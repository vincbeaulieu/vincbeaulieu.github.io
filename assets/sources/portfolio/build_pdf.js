// Renders the portfolio HTML source to PDF with headless Chromium (Playwright).
// Usage: node build_pdf.js "<input.html>" "<output.pdf>"
// Never overwrites: refuses to run if the output file already exists.
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

(async () => {
  const [input, output] = process.argv.slice(2);
  if (!input || !output) {
    console.error('Usage: node build_pdf.js <input.html> <output.pdf>');
    process.exit(1);
  }
  if (fs.existsSync(output)) {
    console.error(`Refusing to overwrite existing file: ${output}`);
    process.exit(2);
  }
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('file://' + path.resolve(input), { waitUntil: 'networkidle' });
  await page.emulateMedia({ media: 'print' });
  await page.pdf({
    path: output,
    preferCSSPageSize: true,
    printBackground: true,
    tagged: true,
    outline: true,
  });
  await browser.close();
  console.log('Wrote', output);
})();
