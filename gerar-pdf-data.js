/* Gera normativas/pdf-data-<chave>.js, um por documento, com o PDF em base64.

   Esses arquivos só são usados quando a página é aberta por file:// (o
   navegador bloqueia fetch de arquivo local). O visor carrega apenas o do
   documento aberto, sob demanda.

   Rode depois de trocar ou acrescentar um PDF em normativas/:
     node gerar-pdf-data.js

   A lista de PDFs vem de PDF_LOCAIS em app.js, para não haver duas fontes. */

const fs = require('fs');
const path = require('path');

const raiz = __dirname;
const app = fs.readFileSync(path.join(raiz, 'app.js'), 'utf8');
const bloco = app.match(/const PDF_LOCAIS = (\{[\s\S]*?\});/);
if (!bloco) throw new Error('Não achei PDF_LOCAIS em app.js.');
const PDF_LOCAIS = new Function('return ' + bloco[1])();

for (const [chave, relativo] of Object.entries(PDF_LOCAIS)) {
  const origem = path.join(raiz, relativo);
  if (!fs.existsSync(origem)) throw new Error(`PDF não encontrado para "${chave}": ${relativo}`);
  const b64 = fs.readFileSync(origem).toString('base64');
  const destino = path.join(raiz, 'normativas', `pdf-data-${chave}.js`);
  fs.writeFileSync(destino,
    `/* Gerado por gerar-pdf-data.js a partir de ${relativo}. Não edite à mão. */\n` +
    `window.PDF_EMBUTIDO = window.PDF_EMBUTIDO || {};\n` +
    `window.PDF_EMBUTIDO[${JSON.stringify(chave)}] = ${JSON.stringify(b64)};\n`);
  console.log(`${path.relative(raiz, destino)}  ${(fs.statSync(destino).size / 1024).toFixed(0)} KB`);
}
