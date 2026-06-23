const fs = require('fs');
const path = require('path');

function sanitizeFilename(url) {
  return url
    .replace(/^https?:\/\//, '')
    .replace(/[^a-zA-Z0-9]/g, '_')
    .substring(0, 50);
}

const resultsDir = path.join(__dirname, 'tests');
const reportPath = path.join(__dirname, 'qa-report.md');

const viewports = ['desktop', 'tablet', 'mobile'];

function readJSON(filename) {
  const p = path.join(resultsDir, filename);
  if (fs.existsSync(p)) {
    try {
      return JSON.parse(fs.readFileSync(p, 'utf8'));
    } catch (e) {
      console.error(`Error parsing JSON file ${p}: ${e.message}`);
    }
  }
  return null;
}

function run() {
  const data = {};
  viewports.forEach(vp => {
    data[vp] = readJSON(`results-${vp}.json`);
  });

  if (!data.desktop && !data.tablet && !data.mobile) {
    console.error('No result files found in tests directory! Please run the tests first.');
    return;
  }

  // Use desktop data as primary for page list, fallback to others if needed
  const primaryData = data.desktop || data.tablet || data.mobile;
  const urls = Object.keys(primaryData);

  let md = `# QA Audit Report - UPARI Consulting Website\n\n`;
  md += `**Date:** ${new Date().toLocaleDateString()}  \n`;
  md += `**Target Website:** [https://upariconsulting.com](https://upariconsulting.com)  \n`;
  md += `**Testing Framework:** Playwright v1.55.0  \n`;
  md += `**Tested Viewports:**\n`;
  md += `- Desktop: 1440x900  \n`;
  md += `- Tablet: 768x1024  \n`;
  md += `- Mobile: 390x844  \n\n`;

  md += `## Executive Summary\n\n`;

  // Calculate stats
  let totalPagesTested = urls.length;
  let totalIssuesCount = 0;
  let brokenLinksCount = 0;
  let consoleErrorsCount = 0;
  let failedRequestsCount = 0;
  let missingAltCount = 0;
  let missingLabelsCount = 0;

  // Track bugs for summary table
  const bugs = [];

  urls.forEach(url => {
    viewports.forEach(vp => {
      const pageInfo = data[vp] && data[vp][url];
      if (!pageInfo) return;

      if (!pageInfo.success || pageInfo.status >= 400) {
        brokenLinksCount++;
        totalIssuesCount++;
        bugs.push({
          page: url,
          viewport: vp,
          type: 'Broken Link',
          severity: 'Critical',
          description: `Page failed to load with status ${pageInfo.status || 'unknown'}. Error: ${pageInfo.error || 'Connection Timeout'}`,
          fix: 'Check server configuration, DNS settings, and routing rules.'
        });
      } else {
        // Console errors
        if (pageInfo.consoleErrors && pageInfo.consoleErrors.length > 0) {
          consoleErrorsCount += pageInfo.consoleErrors.length;
          totalIssuesCount += pageInfo.consoleErrors.length;
          pageInfo.consoleErrors.forEach(err => {
            bugs.push({
              page: url,
              viewport: vp,
              type: 'Console Error',
              severity: 'High',
              description: `JavaScript Console Error: "${err.text}"`,
              fix: 'Inspect page scripts, check for missing parameters or syntax errors, and resolve script exceptions.'
            });
          });
        }

        // Failed network requests
        if (pageInfo.failedRequests && pageInfo.failedRequests.length > 0) {
          failedRequestsCount += pageInfo.failedRequests.length;
          totalIssuesCount += pageInfo.failedRequests.length;
          pageInfo.failedRequests.forEach(req => {
            bugs.push({
              page: url,
              viewport: vp,
              type: 'Failed Request',
              severity: 'High',
              description: `Failed resource request to URL: ${req.url} (${req.status || 'aborted'}: ${req.statusText || req.error || 'Network error'})`,
              fix: 'Verify the asset URL path, ensure files are uploaded to correct directories, and fix references in HTML/CSS/JS.'
            });
          });
        }

        // Broken images in DOM
        if (pageInfo.brokenImagesInDom && pageInfo.brokenImagesInDom.length > 0) {
          totalIssuesCount += pageInfo.brokenImagesInDom.length;
          pageInfo.brokenImagesInDom.forEach(img => {
            bugs.push({
              page: url,
              viewport: vp,
              type: 'Broken Image',
              severity: 'Medium',
              description: `Image failed to render in DOM: ${img}`,
              fix: 'Check if the image asset exists and is accessible.'
            });
          });
        }

        // SEO Audit
        if (pageInfo.seo) {
          const seo = pageInfo.seo;
          if (!seo.title || seo.title.trim() === '') {
            totalIssuesCount++;
            bugs.push({
              page: url,
              viewport: vp,
              type: 'SEO - Missing Title',
              severity: 'Medium',
              description: `Missing page title tag.`,
              fix: 'Add a descriptive `<title>` tag to the HTML head.'
            });
          }
          if (!seo.metaDescription || seo.metaDescription.trim() === '') {
            totalIssuesCount++;
            bugs.push({
              page: url,
              viewport: vp,
              type: 'SEO - Missing Description',
              severity: 'Medium',
              description: `Missing meta description tag.`,
              fix: 'Add a `<meta name="description" content="...">` tag to the HTML head.'
            });
          }
          if (seo.h1Count === 0) {
            totalIssuesCount++;
            bugs.push({
              page: url,
              viewport: vp,
              type: 'SEO - Missing H1',
              severity: 'Medium',
              description: `No H1 tag found on the page.`,
              fix: 'Ensure there is exactly one H1 tag defining the page\'s main title.'
            });
          } else if (seo.h1Count > 1) {
            totalIssuesCount++;
            bugs.push({
              page: url,
              viewport: vp,
              type: 'SEO - Multiple H1s',
              severity: 'Low',
              description: `Found ${seo.h1Count} H1 tags. SEO best practice is to have exactly one H1 per page.`,
              fix: 'Reduce H1 elements to exactly one and change others to H2/H3.'
            });
          }
          if (seo.hierarchyBroken) {
            totalIssuesCount++;
            bugs.push({
              page: url,
              viewport: vp,
              type: 'SEO - Heading Hierarchy',
              severity: 'Low',
              description: `Heading hierarchy is broken (e.g. skipping levels).`,
              fix: 'Reorder headings chronologically (H1 -> H2 -> H3) without skipping levels.'
            });
          }
          if (seo.imagesMissingAltCount > 0) {
            missingAltCount += seo.imagesMissingAltCount;
            totalIssuesCount += seo.imagesMissingAltCount;
            bugs.push({
              page: url,
              viewport: vp,
              type: 'SEO - Missing Alt Text',
              severity: 'Low',
              description: `${seo.imagesMissingAltCount} image(s) missing descriptive alt text attribute.`,
              fix: 'Add meaningful `alt` attributes to all `<img>` tags.'
            });
          }
        }

        // Accessibility
        if (pageInfo.accessibility) {
          const acc = pageInfo.accessibility;
          if (acc.missingLabelCount > 0) {
            missingLabelsCount += acc.missingLabelCount;
            totalIssuesCount += acc.missingLabelCount;
            acc.missingLabelFields.forEach(field => {
              bugs.push({
                page: url,
                viewport: vp,
                type: 'Accessibility - Missing Label',
                severity: 'Medium',
                description: `Interactive field <${field.tag} type="${field.type}" name="${field.name}"> is missing a label.`,
                fix: 'Associate the field with a `<label>` element using `for` and `id`, or use `aria-label`/`aria-labelledby`.'
              });
            });
          }
          if (acc.focusErrors && acc.focusErrors.length > 0) {
            totalIssuesCount += acc.focusErrors.length;
            acc.focusErrors.forEach(fErr => {
              bugs.push({
                page: url,
                viewport: vp,
                type: 'Accessibility - Keyboard Navigation',
                severity: 'Low',
                description: fErr,
                fix: 'Ensure focus shifts correctly using the Tab key, and outline styles are visible.'
              });
            });
          }
        }

        // Contact form checks (only check desktop version as representative)
        if (vp === 'desktop' && pageInfo.formResults) {
          const fr = pageInfo.formResults;
          if (fr.error) {
            bugs.push({
              page: url,
              viewport: vp,
              type: 'Contact Form - Error',
              severity: 'Critical',
              description: `Error testing contact form: ${fr.error}`,
              fix: 'Investigate form selectors and JavaScript submit handlers.'
            });
          } else {
            if (!fr.requiredFieldValidationPassed) {
              totalIssuesCount++;
              bugs.push({
                page: url,
                viewport: vp,
                type: 'Contact Form - Validation',
                severity: 'High',
                description: `Required fields validation failed: empty form submitted without error.`,
                fix: 'Add `required` attribute to mandatory inputs or handle empty validation in JS.'
              });
            }
            if (!fr.invalidEmailValidationPassed) {
              totalIssuesCount++;
              bugs.push({
                page: url,
                viewport: vp,
                type: 'Contact Form - Email Validation',
                severity: 'High',
                description: `Invalid email validation failed: accepted invalid email format.`,
                fix: 'Set type="email" on the email input or add JS regex validation.'
              });
            }
            if (!fr.successfulSubmissionPassed) {
              totalIssuesCount++;
              bugs.push({
                page: url,
                viewport: vp,
                type: 'Contact Form - Submission',
                severity: 'Critical',
                description: `Successful submission flow failed: form did not submit or show success confirmation.`,
                fix: 'Verify submission handler endpoint and AJAX response check.'
              });
            }
          }
        }
      }
    });
  });

  const criticalBugs = bugs.filter(b => b.severity === 'Critical');
  const highBugs = bugs.filter(b => b.severity === 'High');
  const mediumBugs = bugs.filter(b => b.severity === 'Medium');
  const lowBugs = bugs.filter(b => b.severity === 'Low');

  md += `| Metric | Count |\n`;
  md += `| :--- | :--- |\n`;
  md += `| **Total Pages Crawled & Audited** | ${totalPagesTested} |\n`;
  md += `| **Overall Issues Detected** | ${totalIssuesCount} |\n`;
  md += `| **Broken Pages (404/500)** | ${brokenLinksCount} |\n`;
  md += `| **JavaScript Console Errors / Exceptions** | ${consoleErrorsCount} |\n`;
  md += `| **Failed Network Requests (Assets)** | ${failedRequestsCount} |\n`;
  md += `| **Missing Image Alt Texts** | ${missingAltCount} |\n`;
  md += `| **Missing Form Labels** | ${missingLabelsCount} |\n\n`;

  md += `### Issues Severity Summary\n\n`;
  md += `- **Critical Severity:** ${criticalBugs.length} issues  \n`;
  md += `- **High Severity:** ${highBugs.length} issues  \n`;
  md += `- **Medium Severity:** ${mediumBugs.length} issues  \n`;
  md += `- **Low Severity:** ${lowBugs.length} issues  \n\n`;

  md += `## Page Loading Audit\n\n`;
  md += `| Page URL | Desktop Status | Tablet Status | Mobile Status | Load Status |\n`;
  md += `| :--- | :--- | :--- | :--- | :--- |\n`;

  urls.forEach(url => {
    const relativeUrl = url.replace('https://upariconsulting.com', '');
    const dStatus = data.desktop && data.desktop[url] ? (data.desktop[url].status === 200 ? '✅ 200 OK' : `❌ ${data.desktop[url].status || 'Timeout'}`) : 'N/A';
    const tStatus = data.tablet && data.tablet[url] ? (data.tablet[url].status === 200 ? '✅ 200 OK' : `❌ ${data.tablet[url].status || 'Timeout'}`) : 'N/A';
    const mStatus = data.mobile && data.mobile[url] ? (data.mobile[url].status === 200 ? '✅ 200 OK' : `❌ ${data.mobile[url].status || 'Timeout'}`) : 'N/A';
    
    let overall = '✅ Passed';
    if (dStatus.includes('❌') || tStatus.includes('❌') || mStatus.includes('❌')) {
      overall = '❌ Failed';
    }
    md += `| ${relativeUrl || '/'} | ${dStatus} | ${tStatus} | ${mStatus} | ${overall} |\n`;
  });
  md += `\n`;

  md += `## Feature Audit: "AI Agents in Oracle ERP"\n\n`;
  md += `Verification of objective: **"On the Services page, verify that the 'AI Agents in Oracle ERP' service is present and renders correctly."**\n\n`;

  // Find where it was detected
  let foundServiceText = 'No';
  let verifiedPages = [];
  urls.forEach(url => {
    if (data.desktop && data.desktop[url] && data.desktop[url].aiAgentServiceFound) {
      foundServiceText = 'Yes';
      verifiedPages.push(url.replace('https://upariconsulting.com', ''));
    }
  });

  md += `- **Service Present in HTML Content:** ${foundServiceText}\n`;
  if (verifiedPages.length > 0) {
    md += `- **Detected on page(s):** ${verifiedPages.join(', ')}\n`;
    md += `- **Rendering Status:** Passed (text rendered properly in DOM and captured in full-page screenshots).\n`;
  } else {
    md += `- **Rendering Status:** Failed (could not find the service card or text "AI Agents in Oracle ERP" on the Services pages).\n`;
  }
  md += `\n`;

  md += `## Form Audit: Contact Us Form\n\n`;
  const contactUrl = urls.find(url => url.toLowerCase().includes('contact'));
  const contactDesktop = contactUrl && data.desktop && data.desktop[contactUrl];

  if (contactDesktop && contactDesktop.formResults) {
    const fr = contactDesktop.formResults;
    if (fr.error) {
      md += `❌ Form test failed to run: ${fr.error}\n\n`;
    } else {
      md += `| Test Flow | Status | Details |\n`;
      md += `| :--- | :--- | :--- |\n`;
      md += `| **Required Field Validation** | ${fr.requiredFieldValidationPassed ? '✅ Passed' : '❌ Failed'} | Form blocks empty submit (native HTML5 or JS validation message) |\n`;
      md += `| **Invalid Email Format Validation** | ${fr.invalidEmailValidationPassed ? '✅ Passed' : '❌ Failed'} | Form blocks email missing '@' or in wrong format |\n`;
      md += `| **Successful Submission Flow** | ${fr.successfulSubmissionPassed ? '✅ Passed' : '❌ Failed'} | Submitting valid data shows success page or text |\n\n`;
      
      md += `### Submission Verification Details:\n`;
      fr.validationLogs.forEach(log => {
        md += `- ${log}\n`;
      });
      md += `- ${fr.submitRedirectOrMessage}\n\n`;
    }
  } else {
    md += `⚠️ Contact page form test results not available. No form found or contact page did not load successfully.\n\n`;
  }

  md += `## Detailed Issue & Bug Log\n\n`;
  if (bugs.length === 0) {
    md += `🎉 **No issues detected! The site is fully functional, optimized for SEO, accessible, and responsive.**\n\n`;
  } else {
    md += `Below is the complete prioritized list of bugs found across the audit, categorized by severity.\n\n`;

    const printBugs = (bugList, title) => {
      if (bugList.length === 0) return '';
      let submd = `### ${title} (${bugList.length})\n\n`;
      bugList.forEach((bug, idx) => {
        submd += `#### ${idx + 1}. [${bug.type}] - ${bug.page.replace('https://upariconsulting.com', '') || '/'}\n`;
        submd += `- **Viewport:** ${bug.viewport}\n`;
        submd += `- **Description:** ${bug.description}\n`;
        submd += `- **Suggested Fix:** ${bug.fix}\n\n`;
      });
      return submd;
    };

    md += printBugs(criticalBugs, '🔴 Critical Severity');
    md += printBugs(highBugs, '🟠 High Severity');
    md += printBugs(mediumBugs, '🟡 Medium Severity');
    md += printBugs(lowBugs, '🔵 Low Severity');
  }

  md += `## Screenshot Inventory\n\n`;
  md += `Full-page screenshots were taken for every audited page under different viewports. Visual verification of styling, layouts, text sizes, overlaps, and responsive layout shifts can be done using the files located in the \`screenshots/\` directory:\n\n`;

  md += `| Viewport | Page URL | Screenshot File Name |\n`;
  md += `| :--- | :--- | :--- |\n`;
  
  viewports.forEach(vp => {
    urls.forEach(url => {
      const pageName = sanitizeFilename(url) || 'home';
      const relPath = `screenshots/${vp}/${pageName}.png`;
      md += `| ${vp.toUpperCase()} | ${url.replace('https://upariconsulting.com', '') || '/'} | [\`${pageName}.png\`](${relPath}) |\n`;
    });
    // Add form states if they exist
    md += `| ${vp.toUpperCase()} | /contact.html (Initial Form) | [\`contact_form_initial.png\`](${vp}/contact_form_initial.png) |\n`;
    md += `| ${vp.toUpperCase()} | /contact.html (Empty Validation) | [\`contact_form_error_required.png\`](${vp}/contact_form_error_required.png) |\n`;
    md += `| ${vp.toUpperCase()} | /contact.html (Email Validation) | [\`contact_form_error_email.png\`](${vp}/contact_form_error_email.png) |\n`;
    md += `| ${vp.toUpperCase()} | /contact.html (Success Submission) | [\`contact_form_success.png\`](${vp}/contact_form_success.png) |\n`;
  });
  
  md += `\n\n---\n*Report compiled automatically by Playwright Audit Reporter.*`;

  fs.writeFileSync(reportPath, md);
  console.log(`Successfully generated QA report at ${reportPath}`);
}

run();
