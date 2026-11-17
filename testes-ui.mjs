/* Teste de interface do Norma Clara, com Playwright.
   Rode com:  npm test        (busca + interface)
          ou  node testes-ui.mjs

   Sobe um servidor estático mínimo (Node puro, sem Python) na pasta do
   projeto e percorre, em 1280×720 e em 390×844:
     1. o estado inicial mostra os chips de sugestão;
     2. "Perdi a prova, e agora?" traz um card com o Art. 75 da ODP;
     3. clicar no card durante a digitação completa os textos na hora;
     4. "Ver PDF" abre o modal com pelo menos um trecho destacado;
     5. uma pergunta fora do acervo mostra a abstenção com chips de temas;
     6. nenhum erro no console.
   Na primeira vez: npm install && npx playwright install chromium */

import { chromium } from 'playwright';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = path.dirname(fileURLToPath(import.meta.url));
const TIPOS = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.pdf': 'application/pdf', '.woff2': 'font/woff2', '.json': 'application/json',
  '.csv': 'text/csv; charset=utf-8', '.svg': 'image/svg+xml',
};

function servir() {
  const servidor = http.createServer((req, res) => {
    let rel = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    if (rel.endsWith('/')) rel += 'index.html';
    const arquivo = path.join(RAIZ, path.normalize(rel));
    if (!arquivo.startsWith(RAIZ) || !fs.existsSync(arquivo) || fs.statSync(arquivo).isDirectory()) {
      res.writeHead(404); res.end('não encontrado'); return;
    }
    res.writeHead(200, { 'Content-Type': TIPOS[path.extname(arquivo)] || 'application/octet-stream' });
    fs.createReadStream(arquivo).pipe(res);
  });
  return new Promise(resolve => servidor.listen(0, '127.0.0.1', () => resolve(servidor)));
}

const falhas = [];
function conferir(rotulo, ok, detalhe = '') {
  console.log(`  ${ok ? '✓' : '✗'} ${rotulo}${detalhe ? ' — ' + detalhe : ''}`);
  if (!ok) falhas.push(rotulo);
}

async function percorrer(browser, base, nome, opcoes) {
  console.log(`\n${nome}`);
  const ctx = await browser.newContext(opcoes);
  const page = await ctx.newPage();
  const erros = [];
  page.on('console', m => { if (m.type() === 'error') erros.push(m.text()); });
  page.on('pageerror', e => erros.push(e.message));
  const estado = () => page.evaluate(() => document.body.dataset.estado);

  try {
    await page.goto(base);

    // 1. chips de sugestão no estado inicial
    const chips = page.locator('#sugestoes-iniciais .sugestao');
    await chips.first().waitFor({ state: 'visible' });
    const textos = await chips.allTextContents();
    conferir('estado inicial com chips de sugestão', textos.length >= 3 && textos.includes('Perdi a prova, e agora?'),
      textos.length + ' chips');

    // 2. "Perdi a prova, e agora?" → Art. 75 da ODP
    await page.locator('#sugestoes-iniciais .sugestao', { hasText: 'Perdi a prova, e agora?' }).click();
    const card = page.locator('.card').first();
    await card.waitFor();
    const artigo = await card.locator('.chip-artigo').textContent();
    const documento = await card.locator('.card__documento').textContent();
    conferir('card com o Art. 75 da ODP', artigo === 'Art. 75' && documento.includes('Organização Didático-Pedagógica'),
      `${artigo} · ${documento}`);

    // 3. clicar no card durante a digitação completa os textos na hora
    const digitando = await estado() === 'answering';
    await card.locator('.card__simples').click();
    await page.waitForFunction(() => document.body.dataset.estado === 'done', null, { timeout: 2000 });
    const completo = await card.evaluate(c => [...c.querySelectorAll('.digitavel')].every(d =>
      d.querySelector('.digitavel__visivel').textContent === d.querySelector('.digitavel__fantasma').textContent));
    conferir('clique no card completa a digitação na hora', digitando && completo,
      digitando ? 'textos completos' : 'a digitação já tinha acabado antes do clique');

    // 4. "Ver PDF" abre o modal com destaque
    await card.locator('.card__ver-pdf').click();
    await page.locator('#modal-pdf').waitFor({ state: 'visible' });
    await page.locator('.camada-texto span.destaque').first().waitFor({ timeout: 20000 });
    const destaques = await page.locator('.camada-texto span.destaque').count();
    conferir('"Ver PDF" abre o visor com trecho destacado', destaques > 0, destaques + ' trechos');
    await page.keyboard.press('Escape');
    await page.locator('#modal-pdf').waitFor({ state: 'hidden' });

    // 5. fora do acervo → abstenção com chips de temas
    await page.fill('#campo', 'qual o horário da biblioteca?');
    await page.keyboard.press('Enter');
    const abst = page.locator('.aviso-bot--abstencao').last();
    await abst.waitFor();
    const temas = await abst.locator('.sugestao').allTextContents();
    conferir('pergunta fora do acervo mostra abstenção com temas', temas.length >= 4, temas.join(', '));

    // 6. console limpo
    conferir('nenhum erro no console', erros.length === 0, erros.join(' | '));
  } catch (e) {
    conferir('percurso sem exceção', false, e.message.split('\n')[0]);
  } finally {
    await ctx.close();
  }
}

const servidor = await servir();
const base = `http://127.0.0.1:${servidor.address().port}/index.html`;
const browser = await chromium.launch();
try {
  await percorrer(browser, base, 'Desktop 1280×720', { viewport: { width: 1280, height: 720 } });
  await percorrer(browser, base, 'Celular 390×844', { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
} finally {
  await browser.close();
  servidor.close();
}

console.log(falhas.length ? `\n${falhas.length} verificação(ões) falharam.` : '\nInterface: tudo certo.');
process.exitCode = falhas.length ? 1 : 0;
