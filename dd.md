# Documentation Revamp: Single Page Architecture 📄

Based on your feedback, we are going to pivot the documentation structure from multiple individual files into a single, clean, long-form scrolling page. This format is very popular for modern languages as it makes searching (Ctrl+F) and reading continuous.

## Proposed Changes

### 1. Merging the Documentation
- **Single Page Compilation:** We will modify `generate_docs.js`. Instead of building `docs/introduction.html`, `docs/syntax.html`, etc., the script will concatenate the content of all markdown topics in sequential order.
- **Anchor Navigation:** The sidebar links will be updated from pointing to separate HTML files (e.g., `href="/docs/syntax.html"`) to pointing to anchor tags on the same page (e.g., `href="#syntax"`). 
- **Clean Separation:** Each section will be separated by clear, large headers (`<h1>` or `<h2>`) and potentially a subtle dividing line so the transition between topics is very clean.

### 2. Polishing Dark Mode for Docs 🌙
- While the dark mode toggle works globally, we will refine the CSS specifically for the documentation layout to ensure maximum readability.
- **Sidebar & Content:** The sidebar background, active link states, tables, and borders will be explicitly verified and tweaked to look gorgeous in dark mode without causing eye strain.
- **Code Blocks:** Ensure the embedded code snippets contrast perfectly with the dark theme backgrounds.

## Open Questions
- Should this new merged documentation page live at `/docs/index.html` (with a "Documentation" link in the nav), or do you want it directly on the homepage (`index.html`) below the hero section? (I recommend keeping it at `/docs/index.html` so the landing page stays clean).

## Verification Plan
- Update `generate_docs.js` to process and merge the arrays of content into a single output file.
- Update `index.html` nav links to point to the new single documentation page.
- Test the sidebar anchor scrolling and dark mode toggle.
