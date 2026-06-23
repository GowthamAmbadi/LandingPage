# QA Audit Report - UPARI Consulting Website

**Date:** 19/6/2026  
**Target Website:** [https://upariconsulting.com](https://upariconsulting.com)  
**Testing Framework:** Playwright v1.55.0  
**Tested Viewports:**
- Desktop: 1440x900  
- Tablet: 768x1024  
- Mobile: 390x844  

## Executive Summary

| Metric | Count |
| :--- | :--- |
| **Total Pages Crawled & Audited** | 8 |
| **Overall Issues Detected** | 72 |
| **Broken Pages (404/500)** | 0 |
| **JavaScript Console Errors / Exceptions** | 0 |
| **Failed Network Requests (Assets)** | 9 |
| **Missing Image Alt Texts** | 0 |
| **Missing Form Labels** | 3 |

### Issues Severity Summary

- **Critical Severity:** 0 issues  
- **High Severity:** 9 issues  
- **Medium Severity:** 27 issues  
- **Low Severity:** 36 issues  

## Page Loading Audit

| Page URL | Desktop Status | Tablet Status | Mobile Status | Load Status |
| :--- | :--- | :--- | :--- | :--- |
| / | ✅ 200 OK | ✅ 200 OK | ✅ 200 OK | ✅ Passed |
| /about.html | ✅ 200 OK | ✅ 200 OK | ✅ 200 OK | ✅ Passed |
| /services.html | ✅ 200 OK | ✅ 200 OK | ✅ 200 OK | ✅ Passed |
| /industries.html | ✅ 200 OK | ✅ 200 OK | ✅ 200 OK | ✅ Passed |
| /resources.html | ✅ 200 OK | ✅ 200 OK | ✅ 200 OK | ✅ Passed |
| /contact.html | ✅ 200 OK | ✅ 200 OK | ✅ 200 OK | ✅ Passed |
| /careers.html | ✅ 200 OK | ✅ 200 OK | ✅ 200 OK | ✅ Passed |
| /ucservices/ai-agents.html | ✅ 200 OK | ✅ 200 OK | ✅ 200 OK | ✅ Passed |

## Feature Audit: "AI Agents in Oracle ERP"

Verification of objective: **"On the Services page, verify that the 'AI Agents in Oracle ERP' service is present and renders correctly."**

- **Service Present in HTML Content:** Yes
- **Detected on page(s):** /services.html, /ucservices/ai-agents.html
- **Rendering Status:** Passed (text rendered properly in DOM and captured in full-page screenshots).

## Form Audit: Contact Us Form

| Test Flow | Status | Details |
| :--- | :--- | :--- |
| **Required Field Validation** | ✅ Passed | Form blocks empty submit (native HTML5 or JS validation message) |
| **Invalid Email Format Validation** | ✅ Passed | Form blocks email missing '@' or in wrong format |
| **Successful Submission Flow** | ✅ Passed | Submitting valid data shows success page or text |

### Submission Verification Details:
- Required field validation succeeded: Name field message is "Please fill out this field."
- Invalid email validation succeeded: Email field message is "Please include an '@' in the email address. 'invalid-email-format' is missing an '@'."
- Submission check: Succeeded.
- URL after submit: https://www.upariconsulting.com/contact.html. Has success message: false

## Detailed Issue & Bug Log

Below is the complete prioritized list of bugs found across the audit, categorized by severity.

### 🟠 High Severity (9)

#### 1. [Failed Request] - /
- **Viewport:** desktop
- **Description:** Failed resource request to URL: https://fonts.gstatic.com/s/merriweather/v33/u-4B0qyriQwlOrhSvowK_l5-eTxCVx0ZbwLvKH2Gk9hLmp0v5yA-xXPqCzLvPee1XYk_XSf-FmTCUG33AvE.woff2 (aborted: net::ERR_ABORTED)
- **Suggested Fix:** Verify the asset URL path, ensure files are uploaded to correct directories, and fix references in HTML/CSS/JS.

#### 2. [Failed Request] - /
- **Viewport:** desktop
- **Description:** Failed resource request to URL: https://fonts.gstatic.com/s/merriweather/v33/u-4e0qyriQwlOrhSvowK_l5UcA6zuSYEqOzpPe3HOZJ5eX1WtLaQwmYiSeqqJ-k.woff2 (aborted: net::ERR_ABORTED)
- **Suggested Fix:** Verify the asset URL path, ensure files are uploaded to correct directories, and fix references in HTML/CSS/JS.

#### 3. [Failed Request] - /
- **Viewport:** desktop
- **Description:** Failed resource request to URL: https://fonts.gstatic.com/s/merriweathersans/v28/2-c99IRs1JiJN1FRAMjTN5zd9vgsFHX1QjU.woff2 (aborted: net::ERR_ABORTED)
- **Suggested Fix:** Verify the asset URL path, ensure files are uploaded to correct directories, and fix references in HTML/CSS/JS.

#### 4. [Failed Request] - /
- **Viewport:** tablet
- **Description:** Failed resource request to URL: https://fonts.gstatic.com/s/merriweather/v33/u-4B0qyriQwlOrhSvowK_l5-eTxCVx0ZbwLvKH2Gk9hLmp0v5yA-xXPqCzLvPee1XYk_XSf-FmTCUG33AvH4Yr_E.woff2 (aborted: net::ERR_ABORTED)
- **Suggested Fix:** Verify the asset URL path, ensure files are uploaded to correct directories, and fix references in HTML/CSS/JS.

#### 5. [Failed Request] - /
- **Viewport:** tablet
- **Description:** Failed resource request to URL: https://fonts.gstatic.com/s/merriweather/v33/u-4e0qyriQwlOrhSvowK_l5UcA6zuSYEqOzpPe3HOZJ5eX1WtLaQwmYiSeqqJ-mXq1Gi.woff2 (aborted: net::ERR_ABORTED)
- **Suggested Fix:** Verify the asset URL path, ensure files are uploaded to correct directories, and fix references in HTML/CSS/JS.

#### 6. [Failed Request] - /
- **Viewport:** tablet
- **Description:** Failed resource request to URL: https://fonts.gstatic.com/s/merriweathersans/v28/2-c99IRs1JiJN1FRAMjTN5zd9vgsFHX1QjXp8Bte.woff2 (aborted: net::ERR_ABORTED)
- **Suggested Fix:** Verify the asset URL path, ensure files are uploaded to correct directories, and fix references in HTML/CSS/JS.

#### 7. [Failed Request] - /
- **Viewport:** mobile
- **Description:** Failed resource request to URL: https://fonts.gstatic.com/s/merriweather/v33/u-4B0qyriQwlOrhSvowK_l5-eTxCVx0ZbwLvKH2Gk9hLmp0v5yA-xXPqCzLvPee1XYk_XSf-FmTCUG33AvH4Yr_E.woff2 (aborted: net::ERR_ABORTED)
- **Suggested Fix:** Verify the asset URL path, ensure files are uploaded to correct directories, and fix references in HTML/CSS/JS.

#### 8. [Failed Request] - /
- **Viewport:** mobile
- **Description:** Failed resource request to URL: https://fonts.gstatic.com/s/merriweather/v33/u-4e0qyriQwlOrhSvowK_l5UcA6zuSYEqOzpPe3HOZJ5eX1WtLaQwmYiSeqqJ-mXq1Gi.woff2 (aborted: net::ERR_ABORTED)
- **Suggested Fix:** Verify the asset URL path, ensure files are uploaded to correct directories, and fix references in HTML/CSS/JS.

#### 9. [Failed Request] - /
- **Viewport:** mobile
- **Description:** Failed resource request to URL: https://fonts.gstatic.com/s/merriweathersans/v28/2-c99IRs1JiJN1FRAMjTN5zd9vgsFHX1QjXp8Bte.woff2 (aborted: net::ERR_ABORTED)
- **Suggested Fix:** Verify the asset URL path, ensure files are uploaded to correct directories, and fix references in HTML/CSS/JS.

### 🟡 Medium Severity (27)

#### 1. [SEO - Missing Description] - /
- **Viewport:** desktop
- **Description:** Missing meta description tag.
- **Suggested Fix:** Add a `<meta name="description" content="...">` tag to the HTML head.

#### 2. [SEO - Missing Description] - /
- **Viewport:** tablet
- **Description:** Missing meta description tag.
- **Suggested Fix:** Add a `<meta name="description" content="...">` tag to the HTML head.

#### 3. [SEO - Missing Description] - /
- **Viewport:** mobile
- **Description:** Missing meta description tag.
- **Suggested Fix:** Add a `<meta name="description" content="...">` tag to the HTML head.

#### 4. [SEO - Missing Description] - /about.html
- **Viewport:** desktop
- **Description:** Missing meta description tag.
- **Suggested Fix:** Add a `<meta name="description" content="...">` tag to the HTML head.

#### 5. [SEO - Missing Description] - /about.html
- **Viewport:** tablet
- **Description:** Missing meta description tag.
- **Suggested Fix:** Add a `<meta name="description" content="...">` tag to the HTML head.

#### 6. [SEO - Missing Description] - /about.html
- **Viewport:** mobile
- **Description:** Missing meta description tag.
- **Suggested Fix:** Add a `<meta name="description" content="...">` tag to the HTML head.

#### 7. [SEO - Missing Description] - /services.html
- **Viewport:** desktop
- **Description:** Missing meta description tag.
- **Suggested Fix:** Add a `<meta name="description" content="...">` tag to the HTML head.

#### 8. [SEO - Missing Description] - /services.html
- **Viewport:** tablet
- **Description:** Missing meta description tag.
- **Suggested Fix:** Add a `<meta name="description" content="...">` tag to the HTML head.

#### 9. [SEO - Missing Description] - /services.html
- **Viewport:** mobile
- **Description:** Missing meta description tag.
- **Suggested Fix:** Add a `<meta name="description" content="...">` tag to the HTML head.

#### 10. [SEO - Missing Description] - /industries.html
- **Viewport:** desktop
- **Description:** Missing meta description tag.
- **Suggested Fix:** Add a `<meta name="description" content="...">` tag to the HTML head.

#### 11. [SEO - Missing Description] - /industries.html
- **Viewport:** tablet
- **Description:** Missing meta description tag.
- **Suggested Fix:** Add a `<meta name="description" content="...">` tag to the HTML head.

#### 12. [SEO - Missing Description] - /industries.html
- **Viewport:** mobile
- **Description:** Missing meta description tag.
- **Suggested Fix:** Add a `<meta name="description" content="...">` tag to the HTML head.

#### 13. [SEO - Missing Description] - /resources.html
- **Viewport:** desktop
- **Description:** Missing meta description tag.
- **Suggested Fix:** Add a `<meta name="description" content="...">` tag to the HTML head.

#### 14. [SEO - Missing Description] - /resources.html
- **Viewport:** tablet
- **Description:** Missing meta description tag.
- **Suggested Fix:** Add a `<meta name="description" content="...">` tag to the HTML head.

#### 15. [SEO - Missing Description] - /resources.html
- **Viewport:** mobile
- **Description:** Missing meta description tag.
- **Suggested Fix:** Add a `<meta name="description" content="...">` tag to the HTML head.

#### 16. [SEO - Missing Description] - /contact.html
- **Viewport:** desktop
- **Description:** Missing meta description tag.
- **Suggested Fix:** Add a `<meta name="description" content="...">` tag to the HTML head.

#### 17. [SEO - Missing Description] - /contact.html
- **Viewport:** tablet
- **Description:** Missing meta description tag.
- **Suggested Fix:** Add a `<meta name="description" content="...">` tag to the HTML head.

#### 18. [SEO - Missing Description] - /contact.html
- **Viewport:** mobile
- **Description:** Missing meta description tag.
- **Suggested Fix:** Add a `<meta name="description" content="...">` tag to the HTML head.

#### 19. [SEO - Missing Description] - /careers.html
- **Viewport:** desktop
- **Description:** Missing meta description tag.
- **Suggested Fix:** Add a `<meta name="description" content="...">` tag to the HTML head.

#### 20. [Accessibility - Missing Label] - /careers.html
- **Viewport:** desktop
- **Description:** Interactive field <input type="file" name="attachment"> is missing a label.
- **Suggested Fix:** Associate the field with a `<label>` element using `for` and `id`, or use `aria-label`/`aria-labelledby`.

#### 21. [SEO - Missing Description] - /careers.html
- **Viewport:** tablet
- **Description:** Missing meta description tag.
- **Suggested Fix:** Add a `<meta name="description" content="...">` tag to the HTML head.

#### 22. [Accessibility - Missing Label] - /careers.html
- **Viewport:** tablet
- **Description:** Interactive field <input type="file" name="attachment"> is missing a label.
- **Suggested Fix:** Associate the field with a `<label>` element using `for` and `id`, or use `aria-label`/`aria-labelledby`.

#### 23. [SEO - Missing Description] - /careers.html
- **Viewport:** mobile
- **Description:** Missing meta description tag.
- **Suggested Fix:** Add a `<meta name="description" content="...">` tag to the HTML head.

#### 24. [Accessibility - Missing Label] - /careers.html
- **Viewport:** mobile
- **Description:** Interactive field <input type="file" name="attachment"> is missing a label.
- **Suggested Fix:** Associate the field with a `<label>` element using `for` and `id`, or use `aria-label`/`aria-labelledby`.

#### 25. [SEO - Missing Description] - /ucservices/ai-agents.html
- **Viewport:** desktop
- **Description:** Missing meta description tag.
- **Suggested Fix:** Add a `<meta name="description" content="...">` tag to the HTML head.

#### 26. [SEO - Missing Description] - /ucservices/ai-agents.html
- **Viewport:** tablet
- **Description:** Missing meta description tag.
- **Suggested Fix:** Add a `<meta name="description" content="...">` tag to the HTML head.

#### 27. [SEO - Missing Description] - /ucservices/ai-agents.html
- **Viewport:** mobile
- **Description:** Missing meta description tag.
- **Suggested Fix:** Add a `<meta name="description" content="...">` tag to the HTML head.

### 🔵 Low Severity (36)

#### 1. [SEO - Heading Hierarchy] - /
- **Viewport:** desktop
- **Description:** Heading hierarchy is broken (e.g. skipping levels).
- **Suggested Fix:** Reorder headings chronologically (H1 -> H2 -> H3) without skipping levels.

#### 2. [SEO - Heading Hierarchy] - /
- **Viewport:** tablet
- **Description:** Heading hierarchy is broken (e.g. skipping levels).
- **Suggested Fix:** Reorder headings chronologically (H1 -> H2 -> H3) without skipping levels.

#### 3. [SEO - Heading Hierarchy] - /
- **Viewport:** mobile
- **Description:** Heading hierarchy is broken (e.g. skipping levels).
- **Suggested Fix:** Reorder headings chronologically (H1 -> H2 -> H3) without skipping levels.

#### 4. [SEO - Multiple H1s] - /about.html
- **Viewport:** desktop
- **Description:** Found 2 H1 tags. SEO best practice is to have exactly one H1 per page.
- **Suggested Fix:** Reduce H1 elements to exactly one and change others to H2/H3.

#### 5. [SEO - Heading Hierarchy] - /about.html
- **Viewport:** desktop
- **Description:** Heading hierarchy is broken (e.g. skipping levels).
- **Suggested Fix:** Reorder headings chronologically (H1 -> H2 -> H3) without skipping levels.

#### 6. [SEO - Multiple H1s] - /about.html
- **Viewport:** tablet
- **Description:** Found 2 H1 tags. SEO best practice is to have exactly one H1 per page.
- **Suggested Fix:** Reduce H1 elements to exactly one and change others to H2/H3.

#### 7. [SEO - Heading Hierarchy] - /about.html
- **Viewport:** tablet
- **Description:** Heading hierarchy is broken (e.g. skipping levels).
- **Suggested Fix:** Reorder headings chronologically (H1 -> H2 -> H3) without skipping levels.

#### 8. [SEO - Multiple H1s] - /about.html
- **Viewport:** mobile
- **Description:** Found 2 H1 tags. SEO best practice is to have exactly one H1 per page.
- **Suggested Fix:** Reduce H1 elements to exactly one and change others to H2/H3.

#### 9. [SEO - Heading Hierarchy] - /about.html
- **Viewport:** mobile
- **Description:** Heading hierarchy is broken (e.g. skipping levels).
- **Suggested Fix:** Reorder headings chronologically (H1 -> H2 -> H3) without skipping levels.

#### 10. [SEO - Multiple H1s] - /services.html
- **Viewport:** desktop
- **Description:** Found 2 H1 tags. SEO best practice is to have exactly one H1 per page.
- **Suggested Fix:** Reduce H1 elements to exactly one and change others to H2/H3.

#### 11. [SEO - Multiple H1s] - /services.html
- **Viewport:** tablet
- **Description:** Found 2 H1 tags. SEO best practice is to have exactly one H1 per page.
- **Suggested Fix:** Reduce H1 elements to exactly one and change others to H2/H3.

#### 12. [SEO - Multiple H1s] - /services.html
- **Viewport:** mobile
- **Description:** Found 2 H1 tags. SEO best practice is to have exactly one H1 per page.
- **Suggested Fix:** Reduce H1 elements to exactly one and change others to H2/H3.

#### 13. [SEO - Multiple H1s] - /industries.html
- **Viewport:** desktop
- **Description:** Found 2 H1 tags. SEO best practice is to have exactly one H1 per page.
- **Suggested Fix:** Reduce H1 elements to exactly one and change others to H2/H3.

#### 14. [SEO - Multiple H1s] - /industries.html
- **Viewport:** tablet
- **Description:** Found 2 H1 tags. SEO best practice is to have exactly one H1 per page.
- **Suggested Fix:** Reduce H1 elements to exactly one and change others to H2/H3.

#### 15. [SEO - Multiple H1s] - /industries.html
- **Viewport:** mobile
- **Description:** Found 2 H1 tags. SEO best practice is to have exactly one H1 per page.
- **Suggested Fix:** Reduce H1 elements to exactly one and change others to H2/H3.

#### 16. [SEO - Multiple H1s] - /resources.html
- **Viewport:** desktop
- **Description:** Found 2 H1 tags. SEO best practice is to have exactly one H1 per page.
- **Suggested Fix:** Reduce H1 elements to exactly one and change others to H2/H3.

#### 17. [SEO - Heading Hierarchy] - /resources.html
- **Viewport:** desktop
- **Description:** Heading hierarchy is broken (e.g. skipping levels).
- **Suggested Fix:** Reorder headings chronologically (H1 -> H2 -> H3) without skipping levels.

#### 18. [SEO - Multiple H1s] - /resources.html
- **Viewport:** tablet
- **Description:** Found 2 H1 tags. SEO best practice is to have exactly one H1 per page.
- **Suggested Fix:** Reduce H1 elements to exactly one and change others to H2/H3.

#### 19. [SEO - Heading Hierarchy] - /resources.html
- **Viewport:** tablet
- **Description:** Heading hierarchy is broken (e.g. skipping levels).
- **Suggested Fix:** Reorder headings chronologically (H1 -> H2 -> H3) without skipping levels.

#### 20. [SEO - Multiple H1s] - /resources.html
- **Viewport:** mobile
- **Description:** Found 2 H1 tags. SEO best practice is to have exactly one H1 per page.
- **Suggested Fix:** Reduce H1 elements to exactly one and change others to H2/H3.

#### 21. [SEO - Heading Hierarchy] - /resources.html
- **Viewport:** mobile
- **Description:** Heading hierarchy is broken (e.g. skipping levels).
- **Suggested Fix:** Reorder headings chronologically (H1 -> H2 -> H3) without skipping levels.

#### 22. [SEO - Multiple H1s] - /contact.html
- **Viewport:** desktop
- **Description:** Found 2 H1 tags. SEO best practice is to have exactly one H1 per page.
- **Suggested Fix:** Reduce H1 elements to exactly one and change others to H2/H3.

#### 23. [SEO - Multiple H1s] - /contact.html
- **Viewport:** tablet
- **Description:** Found 2 H1 tags. SEO best practice is to have exactly one H1 per page.
- **Suggested Fix:** Reduce H1 elements to exactly one and change others to H2/H3.

#### 24. [SEO - Multiple H1s] - /contact.html
- **Viewport:** mobile
- **Description:** Found 2 H1 tags. SEO best practice is to have exactly one H1 per page.
- **Suggested Fix:** Reduce H1 elements to exactly one and change others to H2/H3.

#### 25. [SEO - Multiple H1s] - /careers.html
- **Viewport:** desktop
- **Description:** Found 2 H1 tags. SEO best practice is to have exactly one H1 per page.
- **Suggested Fix:** Reduce H1 elements to exactly one and change others to H2/H3.

#### 26. [SEO - Heading Hierarchy] - /careers.html
- **Viewport:** desktop
- **Description:** Heading hierarchy is broken (e.g. skipping levels).
- **Suggested Fix:** Reorder headings chronologically (H1 -> H2 -> H3) without skipping levels.

#### 27. [SEO - Multiple H1s] - /careers.html
- **Viewport:** tablet
- **Description:** Found 2 H1 tags. SEO best practice is to have exactly one H1 per page.
- **Suggested Fix:** Reduce H1 elements to exactly one and change others to H2/H3.

#### 28. [SEO - Heading Hierarchy] - /careers.html
- **Viewport:** tablet
- **Description:** Heading hierarchy is broken (e.g. skipping levels).
- **Suggested Fix:** Reorder headings chronologically (H1 -> H2 -> H3) without skipping levels.

#### 29. [SEO - Multiple H1s] - /careers.html
- **Viewport:** mobile
- **Description:** Found 2 H1 tags. SEO best practice is to have exactly one H1 per page.
- **Suggested Fix:** Reduce H1 elements to exactly one and change others to H2/H3.

#### 30. [SEO - Heading Hierarchy] - /careers.html
- **Viewport:** mobile
- **Description:** Heading hierarchy is broken (e.g. skipping levels).
- **Suggested Fix:** Reorder headings chronologically (H1 -> H2 -> H3) without skipping levels.

#### 31. [SEO - Multiple H1s] - /ucservices/ai-agents.html
- **Viewport:** desktop
- **Description:** Found 2 H1 tags. SEO best practice is to have exactly one H1 per page.
- **Suggested Fix:** Reduce H1 elements to exactly one and change others to H2/H3.

#### 32. [SEO - Heading Hierarchy] - /ucservices/ai-agents.html
- **Viewport:** desktop
- **Description:** Heading hierarchy is broken (e.g. skipping levels).
- **Suggested Fix:** Reorder headings chronologically (H1 -> H2 -> H3) without skipping levels.

#### 33. [SEO - Multiple H1s] - /ucservices/ai-agents.html
- **Viewport:** tablet
- **Description:** Found 2 H1 tags. SEO best practice is to have exactly one H1 per page.
- **Suggested Fix:** Reduce H1 elements to exactly one and change others to H2/H3.

#### 34. [SEO - Heading Hierarchy] - /ucservices/ai-agents.html
- **Viewport:** tablet
- **Description:** Heading hierarchy is broken (e.g. skipping levels).
- **Suggested Fix:** Reorder headings chronologically (H1 -> H2 -> H3) without skipping levels.

#### 35. [SEO - Multiple H1s] - /ucservices/ai-agents.html
- **Viewport:** mobile
- **Description:** Found 2 H1 tags. SEO best practice is to have exactly one H1 per page.
- **Suggested Fix:** Reduce H1 elements to exactly one and change others to H2/H3.

#### 36. [SEO - Heading Hierarchy] - /ucservices/ai-agents.html
- **Viewport:** mobile
- **Description:** Heading hierarchy is broken (e.g. skipping levels).
- **Suggested Fix:** Reorder headings chronologically (H1 -> H2 -> H3) without skipping levels.

## Screenshot Inventory

Full-page screenshots were taken for every audited page under different viewports. Visual verification of styling, layouts, text sizes, overlaps, and responsive layout shifts can be done using the files located in the `screenshots/` directory:

| Viewport | Page URL | Screenshot File Name |
| :--- | :--- | :--- |
| DESKTOP | / | [`upariconsulting_com.png`](screenshots/desktop/upariconsulting_com.png) |
| DESKTOP | /about.html | [`upariconsulting_com_about_html.png`](screenshots/desktop/upariconsulting_com_about_html.png) |
| DESKTOP | /services.html | [`upariconsulting_com_services_html.png`](screenshots/desktop/upariconsulting_com_services_html.png) |
| DESKTOP | /industries.html | [`upariconsulting_com_industries_html.png`](screenshots/desktop/upariconsulting_com_industries_html.png) |
| DESKTOP | /resources.html | [`upariconsulting_com_resources_html.png`](screenshots/desktop/upariconsulting_com_resources_html.png) |
| DESKTOP | /contact.html | [`upariconsulting_com_contact_html.png`](screenshots/desktop/upariconsulting_com_contact_html.png) |
| DESKTOP | /careers.html | [`upariconsulting_com_careers_html.png`](screenshots/desktop/upariconsulting_com_careers_html.png) |
| DESKTOP | /ucservices/ai-agents.html | [`upariconsulting_com_ucservices_ai_agents_html.png`](screenshots/desktop/upariconsulting_com_ucservices_ai_agents_html.png) |
| DESKTOP | /contact.html (Initial Form) | [`contact_form_initial.png`](desktop/contact_form_initial.png) |
| DESKTOP | /contact.html (Empty Validation) | [`contact_form_error_required.png`](desktop/contact_form_error_required.png) |
| DESKTOP | /contact.html (Email Validation) | [`contact_form_error_email.png`](desktop/contact_form_error_email.png) |
| DESKTOP | /contact.html (Success Submission) | [`contact_form_success.png`](desktop/contact_form_success.png) |
| TABLET | / | [`upariconsulting_com.png`](screenshots/tablet/upariconsulting_com.png) |
| TABLET | /about.html | [`upariconsulting_com_about_html.png`](screenshots/tablet/upariconsulting_com_about_html.png) |
| TABLET | /services.html | [`upariconsulting_com_services_html.png`](screenshots/tablet/upariconsulting_com_services_html.png) |
| TABLET | /industries.html | [`upariconsulting_com_industries_html.png`](screenshots/tablet/upariconsulting_com_industries_html.png) |
| TABLET | /resources.html | [`upariconsulting_com_resources_html.png`](screenshots/tablet/upariconsulting_com_resources_html.png) |
| TABLET | /contact.html | [`upariconsulting_com_contact_html.png`](screenshots/tablet/upariconsulting_com_contact_html.png) |
| TABLET | /careers.html | [`upariconsulting_com_careers_html.png`](screenshots/tablet/upariconsulting_com_careers_html.png) |
| TABLET | /ucservices/ai-agents.html | [`upariconsulting_com_ucservices_ai_agents_html.png`](screenshots/tablet/upariconsulting_com_ucservices_ai_agents_html.png) |
| TABLET | /contact.html (Initial Form) | [`contact_form_initial.png`](tablet/contact_form_initial.png) |
| TABLET | /contact.html (Empty Validation) | [`contact_form_error_required.png`](tablet/contact_form_error_required.png) |
| TABLET | /contact.html (Email Validation) | [`contact_form_error_email.png`](tablet/contact_form_error_email.png) |
| TABLET | /contact.html (Success Submission) | [`contact_form_success.png`](tablet/contact_form_success.png) |
| MOBILE | / | [`upariconsulting_com.png`](screenshots/mobile/upariconsulting_com.png) |
| MOBILE | /about.html | [`upariconsulting_com_about_html.png`](screenshots/mobile/upariconsulting_com_about_html.png) |
| MOBILE | /services.html | [`upariconsulting_com_services_html.png`](screenshots/mobile/upariconsulting_com_services_html.png) |
| MOBILE | /industries.html | [`upariconsulting_com_industries_html.png`](screenshots/mobile/upariconsulting_com_industries_html.png) |
| MOBILE | /resources.html | [`upariconsulting_com_resources_html.png`](screenshots/mobile/upariconsulting_com_resources_html.png) |
| MOBILE | /contact.html | [`upariconsulting_com_contact_html.png`](screenshots/mobile/upariconsulting_com_contact_html.png) |
| MOBILE | /careers.html | [`upariconsulting_com_careers_html.png`](screenshots/mobile/upariconsulting_com_careers_html.png) |
| MOBILE | /ucservices/ai-agents.html | [`upariconsulting_com_ucservices_ai_agents_html.png`](screenshots/mobile/upariconsulting_com_ucservices_ai_agents_html.png) |
| MOBILE | /contact.html (Initial Form) | [`contact_form_initial.png`](mobile/contact_form_initial.png) |
| MOBILE | /contact.html (Empty Validation) | [`contact_form_error_required.png`](mobile/contact_form_error_required.png) |
| MOBILE | /contact.html (Email Validation) | [`contact_form_error_email.png`](mobile/contact_form_error_email.png) |
| MOBILE | /contact.html (Success Submission) | [`contact_form_success.png`](mobile/contact_form_success.png) |


---
*Report compiled automatically by Playwright Audit Reporter.*