const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

// Helper to sanitize filenames
function sanitizeFilename(url) {
  return url
    .replace(/^https?:\/\//, '')
    .replace(/[^a-zA-Z0-9]/g, '_')
    .substring(0, 50);
}

test.describe('Website Audit', () => {
  let consoleErrors = [];
  let failedRequests = [];
  let pageResults = {};

  test.beforeEach(({ page }) => {
    consoleErrors = [];
    failedRequests = [];

    // Capture console errors
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push({
          type: 'console-error',
          text: msg.text(),
          location: msg.location()
        });
      }
    });

    // Capture uncaught page exceptions
    page.on('pageerror', exception => {
      consoleErrors.push({
        type: 'js-exception',
        text: exception.message,
        stack: exception.stack
      });
    });

    // Capture failed requests (status >= 400 or aborted)
    page.on('requestfailed', request => {
      const failure = request.failure();
      failedRequests.push({
        url: request.url(),
        error: failure ? failure.errorText : 'Unknown failure'
      });
    });

    page.on('response', response => {
      const status = response.status();
      if (status >= 400) {
        failedRequests.push({
          url: response.url(),
          status: status,
          statusText: response.statusText()
        });
      }
    });
  });

  test('Crawl and Audit Pages', async ({ page }, testInfo) => {
    const projectName = testInfo.project.name;
    const baseURL = 'https://upariconsulting.com';
    
    // Create screenshot directory
    const screenshotDir = path.join(__dirname, '..', 'screenshots', projectName);
    if (!fs.existsSync(screenshotDir)) {
      fs.mkdirSync(screenshotDir, { recursive: true });
    }

    console.log(`[${projectName}] Starting crawl of ${baseURL}`);
    
    // Step 1: Load homepage to gather links
    let response;
    try {
      response = await page.goto(baseURL, { waitUntil: 'domcontentloaded', timeout: 30000 });
    } catch (e) {
      console.error(`[${projectName}] Failed to load home page: ${e.message}`);
      throw e;
    }

    const startStatus = response ? response.status() : 'Unknown';
    expect(startStatus).toBeLessThan(400);

    // Get all links in nav and footer
    const links = await page.evaluate((base) => {
      const collected = [];
      const selectors = ['nav a', 'footer a', 'header a'];
      
      selectors.forEach(sel => {
        const elements = document.querySelectorAll(sel);
        elements.forEach(el => {
          const href = el.getAttribute('href');
          if (href) {
            // Resolve relative URLs
            try {
              const url = new URL(href, base);
              // Only collect internal links
              if (url.hostname === window.location.hostname) {
                // Strip hash and trailing slash for deduplication
                const cleanUrl = url.origin + url.pathname.replace(/\/$/, '');
                if (!collected.includes(cleanUrl)) {
                  collected.push(cleanUrl);
                }
              }
            } catch (e) {
              // Ignore invalid links
            }
          }
        });
      });
      return collected;
    }, baseURL);

    // Filter out obvious binary files or client portal placeholders
    const pagesToTest = links.filter(link => {
      const lower = link.toLowerCase();
      // Skip links that end in files or are non-navigable
      if (lower.endsWith('.pdf') || lower.endsWith('.zip') || lower.includes('#') || lower.includes('mailto:')) {
        return false;
      }
      return true;
    });

    // Make sure we have the core pages if crawler fails to find them
    const corePages = [
      `${baseURL}`,
      `${baseURL}/about.html`,
      `${baseURL}/services.html`,
      `${baseURL}/industries.html`,
      `${baseURL}/resources.html`,
      `${baseURL}/contact.html`,
      `${baseURL}/careers.html`,
      `${baseURL}/ucservices/ai-agents.html`
    ];

    corePages.forEach(p => {
      const normalized = p.replace(/\/$/, '');
      if (!pagesToTest.includes(normalized)) {
        pagesToTest.push(normalized);
      }
    });

    console.log(`[${projectName}] Discovered ${pagesToTest.length} pages to audit:`, pagesToTest);

    // Audit each page
    for (const url of pagesToTest) {
      const cleanUrl = url.replace(/\/$/, '');
      const pageName = sanitizeFilename(cleanUrl) || 'home';
      console.log(`\n[${projectName}] Auditing page: ${cleanUrl}`);

      consoleErrors = [];
      failedRequests = [];

      let pageResponse;
      let loadError = null;

      try {
        pageResponse = await page.goto(cleanUrl, { waitUntil: 'load', timeout: 30000 });
      } catch (err) {
        loadError = err.message;
        console.error(`[${projectName}] Load error on ${cleanUrl}: ${loadError}`);
      }

      // Check page status
      const status = pageResponse ? pageResponse.status() : (loadError ? 0 : 200);
      const isOk = status < 400 && !loadError;

      // 1. Take Screenshot
      const screenshotPath = path.join(screenshotDir, `${pageName}.png`);
      try {
        await page.screenshot({ path: screenshotPath, fullPage: true });
        console.log(`[${projectName}] Saved screenshot to ${screenshotPath}`);
      } catch (screenshotErr) {
        console.error(`[${projectName}] Failed to capture screenshot for ${pageName}: ${screenshotErr.message}`);
      }

      if (!isOk) {
        pageResults[cleanUrl] = {
          success: false,
          status,
          error: loadError || 'HTTP error status ' + status,
          consoleErrors: [...consoleErrors],
          failedRequests: [...failedRequests]
        };
        continue;
      }

      // 2. Services check ("AI Agents in Oracle ERP")
      let aiAgentServiceFound = false;
      let aiAgentServiceText = '';
      if (cleanUrl.includes('services') || cleanUrl.includes('ai-agents')) {
        const hasText = await page.evaluate(() => {
          return document.body.innerText.includes('AI Agents in Oracle ERP');
        });
        aiAgentServiceFound = hasText;
        if (hasText) {
          aiAgentServiceText = 'Present on page';
        }
      }

      // 3. SEO Audit
      const seoAudit = await page.evaluate(() => {
        const title = document.title;
        const metaDesc = document.querySelector('meta[name="description"]')?.getAttribute('content') || null;
        
        // Headings
        const h1s = Array.from(document.querySelectorAll('h1')).map(h => h.innerText.trim());
        const h2s = Array.from(document.querySelectorAll('h2')).map(h => h.innerText.trim());
        
        // Check hierarchy
        const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6')).map(h => h.tagName);
        let hierarchyBroken = false;
        let lastLevel = 0;
        for (const h of headings) {
          const level = parseInt(h.substring(1));
          if (level - lastLevel > 1 && lastLevel > 0) {
            hierarchyBroken = true;
          }
          lastLevel = level;
        }

        // Image Alts
        const images = Array.from(document.querySelectorAll('img'));
        const totalImages = images.length;
        const imagesMissingAlt = images.filter(img => !img.getAttribute('alt') || img.getAttribute('alt').trim() === '').map(img => img.src);

        return {
          title,
          metaDescription: metaDesc,
          h1Count: h1s.length,
          h1s,
          h2Count: h2s.length,
          hierarchyBroken,
          totalImages,
          imagesMissingAltCount: imagesMissingAlt.length,
          imagesMissingAlt
        };
      });

      // 4. Accessibility Check
      const accessibilityAudit = await page.evaluate(() => {
        // Labels
        const formInputs = Array.from(document.querySelectorAll('input, select, textarea'));
        let missingLabelCount = 0;
        const missingLabelFields = [];
        
        formInputs.forEach((input) => {
          // Check for id and corresponding label
          const id = input.getAttribute('id');
          let hasLabel = false;
          if (id) {
            const label = document.querySelector(`label[for="${id}"]`);
            if (label && label.innerText.trim() !== '') {
              hasLabel = true;
            }
          }
          
          // Check for parent label
          if (!hasLabel) {
            const parentLabel = input.closest('label');
            if (parentLabel && parentLabel.innerText.trim() !== '') {
              hasLabel = true;
            }
          }
          
          // Check for aria-label or aria-labelledby
          if (!hasLabel) {
            if (input.getAttribute('aria-label') || input.getAttribute('aria-labelledby')) {
              hasLabel = true;
            }
          }

          // Skip hidden fields, buttons, submits, etc.
          const type = input.getAttribute('type');
          if (['submit', 'button', 'hidden', 'image', 'checkbox', 'radio'].includes(type)) {
            hasLabel = true; // Buttons have values, checkboxes have different patterns, skip simple check
          }

          if (!hasLabel) {
            missingLabelCount++;
            missingLabelFields.push({
              tag: input.tagName.toLowerCase(),
              type: type || 'text',
              name: input.getAttribute('name') || 'unnamed',
              id: id || 'noid'
            });
          }
        });

        // ARIA attributes checks
        const ariaElements = Array.from(document.querySelectorAll('[role]'));
        const invalidRoles = [];
        // A simple check for role values
        const validRoles = ['button', 'navigation', 'main', 'banner', 'contentinfo', 'dialog', 'alert', 'heading', 'link', 'list', 'listitem'];
        ariaElements.forEach(el => {
          const role = el.getAttribute('role');
          if (role && !validRoles.includes(role) && !role.startsWith('aria-')) {
            // Just note it as potential issue
            invalidRoles.push(role);
          }
        });

        return {
          missingLabelCount,
          missingLabelFields,
          ariaElementsCount: ariaElements.length,
          invalidRoles
        };
      });

      // Keyboard focus verification (simple tab check)
      let focusErrors = [];
      try {
        await page.keyboard.press('Tab');
        const activeTag = await page.evaluate(() => document.activeElement.tagName.toLowerCase());
        if (activeTag === 'body') {
          focusErrors.push('Keyboard focus did not move from body on first Tab press');
        }
      } catch (err) {
        focusErrors.push(`Failed to perform keyboard navigation test: ${err.message}`);
      }

      // Check for broken images/assets via browser evaluate
      const brokenAssetsInDom = await page.evaluate(() => {
        const imgs = Array.from(document.querySelectorAll('img'));
        const brokenImgs = [];
        imgs.forEach(img => {
          if (!img.complete || img.naturalWidth === 0) {
            brokenImgs.push(img.src);
          }
        });
        return {
          brokenImgs
        };
      });

      pageResults[cleanUrl] = {
        success: true,
        status,
        consoleErrors: [...consoleErrors],
        failedRequests: [...failedRequests],
        brokenImagesInDom: brokenAssetsInDom.brokenImgs,
        seo: seoAudit,
        accessibility: {
          ...accessibilityAudit,
          focusErrors
        },
        aiAgentServiceFound,
        aiAgentServiceText
      };
    }

    // Step 5: Test Contact Us page form (only on contact.html if it was found)
    const contactPageUrl = pagesToTest.find(url => url.toLowerCase().includes('contact'));
    if (contactPageUrl) {
      console.log(`\n[${projectName}] Running Contact Form Validation Checks on: ${contactPageUrl}`);
      try {
        await page.goto(contactPageUrl, { waitUntil: 'load' });
        
        // Capture screenshot of form before testing
        await page.screenshot({ path: path.join(screenshotDir, `contact_form_initial.png`) });

        // Let's identify the form fields and submit button
        // Looking at contact.html, the form fields are:
        // Name: #name
        // Email: #email
        // Message: #message
        // Submit: form button[type="submit"] or similar
        const formSelector = 'form';
        const formExists = await page.locator(formSelector).count() > 0;
        
        if (formExists) {
          const formResults = {
            requiredFieldValidationPassed: false,
            invalidEmailValidationPassed: false,
            successfulSubmissionPassed: false,
            validationLogs: [],
            submitRedirectOrMessage: ''
          };

          // 1. Required field validation: click submit on empty form
          console.log(`[${projectName}] Testing required fields validation...`);
          // Clear any filled fields first
          await page.fill('#name', '');
          await page.fill('#email', '');
          await page.fill('#message', '');
          
          // Submit empty form
          await page.click('form button[type="submit"], form input[type="submit"]');
          await page.waitForTimeout(1000); // Wait for potential validation error UI
          
          // Capture screenshot of validation errors
          await page.screenshot({ path: path.join(screenshotDir, `contact_form_error_required.png`) });

          // Check if native HTML5 validation or custom validation prevents submission
          const isFormStillVisible = await page.locator(formSelector).isVisible();
          const nameValidationMsg = await page.evaluate(() => {
            const el = document.querySelector('#name');
            return el ? el.validationMessage : '';
          });
          
          console.log(`[${projectName}] Name field validation message: "${nameValidationMsg}"`);
          if (!isFormStillVisible || nameValidationMsg !== '') {
            formResults.requiredFieldValidationPassed = true;
            formResults.validationLogs.push(`Required field validation succeeded: Name field message is "${nameValidationMsg}"`);
          } else {
            formResults.validationLogs.push(`Warning: empty form submitted or no validation error shown.`);
          }

          // 2. Invalid email validation
          console.log(`[${projectName}] Testing invalid email validation...`);
          await page.fill('#name', 'Test Auditor');
          await page.fill('#email', 'invalid-email-format');
          await page.fill('#message', 'This is a test audit message.');
          
          await page.click('form button[type="submit"], form input[type="submit"]');
          await page.waitForTimeout(1000);
          
          await page.screenshot({ path: path.join(screenshotDir, `contact_form_error_email.png`) });
          
          const emailValidationMsg = await page.evaluate(() => {
            const el = document.querySelector('#email');
            return el ? el.validationMessage : '';
          });
          
          console.log(`[${projectName}] Email field validation message: "${emailValidationMsg}"`);
          if (emailValidationMsg !== '') {
            formResults.invalidEmailValidationPassed = true;
            formResults.validationLogs.push(`Invalid email validation succeeded: Email field message is "${emailValidationMsg}"`);
          } else {
            formResults.validationLogs.push(`Warning: Form with invalid email submitted or no validation error shown.`);
          }

          // 3. Successful submission flow (fill and submit)
          console.log(`[${projectName}] Testing successful submission flow...`);
          await page.fill('#name', 'QA Test Auditor');
          await page.fill('#email', 'qa-audit-test@upariconsulting.com');
          await page.fill('#message', 'Hello, this is an automated website audit test submission. Please ignore.');

          // Hook for submission response
          const submissionPromise = page.waitForNavigation({ timeout: 10000 }).catch(() => null);
          await page.click('form button[type="submit"], form input[type="submit"]');
          
          await submissionPromise;
          await page.waitForTimeout(2000); // Allow time for success state/redirect

          await page.screenshot({ path: path.join(screenshotDir, `contact_form_success.png`) });

          // Check for success indicator
          const successContent = await page.evaluate(() => {
            // Look for common success keywords in body text or redirects
            const text = document.body.innerText.toLowerCase();
            const hasSuccessMsg = text.includes('thank you') || text.includes('submitted') || text.includes('success') || text.includes('received');
            return {
              url: window.location.href,
              hasSuccessMsg,
              bodyText: document.body.innerText.substring(0, 500)
            };
          });

          console.log(`[${projectName}] Success flow check result:`, successContent);
          formResults.submitRedirectOrMessage = `URL after submit: ${successContent.url}. Has success message: ${successContent.hasSuccessMsg}`;
          
          if (successContent.hasSuccessMsg || successContent.url !== contactPageUrl) {
            formResults.successfulSubmissionPassed = true;
            formResults.validationLogs.push(`Submission check: Succeeded.`);
          } else {
            formResults.validationLogs.push(`Submission check: Form did not submit or no success message was detected.`);
          }

          pageResults[contactPageUrl].formResults = formResults;
        } else {
          console.log(`[${projectName}] No form found on contact page.`);
          pageResults[contactPageUrl].formResults = { error: 'No form found' };
        }
      } catch (contactErr) {
        console.error(`[${projectName}] Error testing Contact Us page form: ${contactErr.message}`);
        pageResults[contactPageUrl].formResults = { error: contactErr.message };
      }
    }

    // Save project results to file
    const resultFilePath = path.join(__dirname, `results-${projectName}.json`);
    fs.writeFileSync(resultFilePath, JSON.stringify(pageResults, null, 2));
    console.log(`[${projectName}] Saved audit results JSON to ${resultFilePath}`);
  });
});
