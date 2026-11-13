// Genera guia-vocari.pdf a partir de guia.html y el módulo ../../vocari/api/_ebook.js que lo entrega tras el pago.
const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage();
  await p.goto('file://' + path.join(__dirname, 'guia.html')); await p.waitForTimeout(300);
  await p.pdf({ path: path.join(__dirname, 'guia-vocari.pdf'), format: 'A4', printBackground: true, preferCSSPageSize: true,
    displayHeaderFooter: true, headerTemplate: '<span></span>',
    footerTemplate: '<div style="font-size:8px;color:#888;width:100%;text-align:center;font-family:sans-serif">Guía Vocari para familias · <span class="pageNumber"></span></div>' });
  await b.close();
  const pdf = fs.readFileSync(path.join(__dirname, 'guia-vocari.pdf'));
  fs.writeFileSync(path.join(__dirname, '../../vocari/api/_ebook.js'),
    '// Generado por vocari-tools/guia/build.cjs — no editar a mano.\nexport const EBOOK_FILENAME = \'Guia-Vocari-para-familias.pdf\';\nexport const EBOOK_B64 = \'' + pdf.toString('base64') + '\';\n');
  console.log('bytes', pdf.length);
})();
