/* Visor de PDF do Norma Clara.
   Renderiza o PDF oficial com PDF.js (vendor/pdf.min.js), acha onde está o
   artigo pela busca no texto (sem fixar número de página) e destaca o trecho
   com o azul de seleção.

   Texto literal: cada linha do trecho é procurada no documento inteiro, em
   ordem; se uma linha atravessa uma quebra de página, cai para frase a frase.
   Resumo (ou literal não encontrado): destaca o parágrafo que começa em "Art. N".

   Em file:// o navegador bloqueia fetch de arquivo local; nesse caso o PDF vem
   de normativas/pdf-data-<chave>.js (base64), carregado só para o documento
   aberto. Os arquivos são gerados por gerar-pdf-data.js. */
(() => {
'use strict';

const $modal = document.getElementById('modal-pdf');
const $fundo = document.getElementById('modal-fundo');
const $janela = $modal.querySelector('.modal__janela');
const $titulo = document.getElementById('modal-titulo');
const $aviso = document.getElementById('modal-aviso');
const $paginas = document.getElementById('modal-paginas');
const $fechar = document.getElementById('modal-fechar');
const $oficial = document.getElementById('modal-oficial');

const reduzirMovimento = matchMedia('(prefers-reduced-motion: reduce)').matches;
const OMITIDO = '[…]';

let aberto = false;
let devolverFoco = null;
let sessao = 0;            // invalida trabalho de uma abertura anterior
let observador = null;
let docPdf = null;

/* ---------- normalização ----------
   Sem acentos, sem caixa, sem nada que não seja letra ou dígito (o que some
   com espaços, quebras e hífen de quebra de linha) e sem as sequências que os
   PDFs do IFTO costumam perder como ligadura ("ti", "fi", "fl": o PDF.js
   devolve "estudan\u0000l" para "estudantil"). Aplicada igual aos dois lados. */
function normalizar(s) {
  return s.replace(/ﬁ/g, 'fi').replace(/ﬂ/g, 'fl')
    .normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
    .replace(/[^a-z0-9]+/g, '')
    .replace(/ti|fi|fl/g, '');
}

function base64ParaBytes(b64) {
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

const embutidos = {};
function carregarEmbutido(chave) {
  /* injeta normativas/pdf-data-<chave>.js via <script>, que funciona em file:// */
  if (!embutidos[chave]) {
    embutidos[chave] = new Promise(resolve => {
      if (window.PDF_EMBUTIDO && window.PDF_EMBUTIDO[chave]) { resolve(window.PDF_EMBUTIDO[chave]); return; }
      const s = document.createElement('script');
      s.src = 'normativas/pdf-data-' + chave + '.js';
      s.onload = () => resolve((window.PDF_EMBUTIDO || {})[chave] || null);
      s.onerror = () => { delete embutidos[chave]; resolve(null); };
      document.head.append(s);
    });
  }
  return embutidos[chave];
}

async function obterFonte(opcoes) {
  if (location.protocol === 'file:' && opcoes.chaveEmbutida) {
    const b64 = await carregarEmbutido(opcoes.chaveEmbutida);
    if (b64) return { data: base64ParaBytes(b64) };
  }
  return { url: encodeURI(opcoes.pdfLocal) };
}

/* ---------- abertura e fechamento ---------- */
window.abrirVisorPdf = function (opcoes) {
  if (aberto) return;
  aberto = true;
  devolverFoco = opcoes.devolverFoco || null;
  sessao++;

  $titulo.textContent = opcoes.titulo || 'PDF oficial';
  $oficial.href = opcoes.pdfOficial || '#';
  $aviso.hidden = true;
  $paginas.innerHTML = '';
  $paginas.append(criarMensagem('Carregando o PDF oficial...'));

  $modal.hidden = false;
  if (!reduzirMovimento) {
    $modal.setAttribute('data-entrando', '');
    requestAnimationFrame(() => requestAnimationFrame(() => $modal.removeAttribute('data-entrando')));
  }
  document.addEventListener('keydown', aoTeclar, true);
  $fechar.focus();

  carregarDocumento(opcoes);
};

window.fecharVisorPdf = fechar;

function fechar() {
  if (!aberto) return;
  aberto = false;
  sessao++;
  document.removeEventListener('keydown', aoTeclar, true);
  if (observador) { observador.disconnect(); observador = null; }
  if (docPdf) { try { docPdf.destroy(); } catch {} docPdf = null; }
  $modal.hidden = true;
  $paginas.innerHTML = '';
  if (devolverFoco) { try { devolverFoco.focus(); } catch {} devolverFoco = null; }
}

$fechar.addEventListener('click', fechar);
$fundo.addEventListener('click', fechar);

function aoTeclar(e) {
  if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); fechar(); return; }
  if (e.key !== 'Tab') return;
  /* prende o foco dentro do modal */
  const focaveis = [$fechar, $paginas, $oficial].filter(f => !f.hidden);
  const primeiro = focaveis[0];
  const ultimo = focaveis[focaveis.length - 1];
  if (e.shiftKey && document.activeElement === primeiro) {
    e.preventDefault(); ultimo.focus();
  } else if (!e.shiftKey && document.activeElement === ultimo) {
    e.preventDefault(); primeiro.focus();
  } else if (!$janela.contains(document.activeElement)) {
    e.preventDefault(); primeiro.focus();
  }
}

function criarMensagem(texto) {
  const p = document.createElement('p');
  p.className = 'modal__carregando';
  p.textContent = texto;
  return p;
}

function mostrarAviso(texto) {
  $aviso.textContent = texto;
  $aviso.hidden = false;
}

/* ---------- busca do trecho ----------
   indice: todos os itens de texto do documento, em ordem, com a posição de
   cada um na string normalizada concatenada. marcas: Map(página -> Set(item)). */
function montarIndice(textos) {
  const itens = [];
  let concat = '';
  textos.forEach((conteudo, p) => {
    if (!conteudo) return;
    conteudo.items.forEach((item, i) => {
      if (typeof item.str !== 'string') return;
      const n = normalizar(item.str);
      itens.push({ p, i, ini: concat.length, fim: concat.length + n.length, str: item.str, eol: !!item.hasEOL });
      concat += n;
    });
  });
  return { itens, concat };
}

function marcarIntervalo(indice, ini, fim, marcas) {
  for (const it of indice.itens) {
    if (it.fim <= ini) continue;
    if (it.ini >= fim) break;
    if (it.fim > it.ini) {
      if (!marcas.has(it.p)) marcas.set(it.p, new Set());
      marcas.get(it.p).add(it.i);
    }
  }
}

function paginaDe(indice, pos) {
  const it = indice.itens.find(x => x.fim > pos);
  return it ? it.p : null;
}

/* Onde começa o artigo: item que abre com "Art. N" (maiúsculo, para não pegar
   remissões como "conforme art. 85 da Lei"). */
function ancoraDoArtigo(indice, artigo) {
  const m = /Arts?\.?\s*(\d+)/.exec(artigo || '');
  if (!m) return -1;
  const inicio = new RegExp('^\\s*Art\\.?\\s*' + m[1] + '\\s*[º°o]?\\s*(\\.|\\s|$)');
  return indice.itens.findIndex(it => inicio.test(it.str));
}

function buscarLiteral(indice, trecho, artigo) {
  const marcas = new Map();
  const linhas = trecho.split('\n')
    .flatMap(l => l.split(OMITIDO))
    .map(l => l.trim())
    .filter(l => normalizar(l).length >= 8);
  /* a busca começa no título do artigo, quando ele existe: frases curtas e
     repetidas ("regime de 40 horas semanais") não casam em artigo vizinho */
  const k = ancoraDoArtigo(indice, artigo);
  let cursor = k >= 0 ? indice.itens[k].ini : 0;
  let primeiraPagina = null;
  for (const linha of linhas) {
    const pedacos = [linha];
    let achou = false;
    for (let tentativa = 0; tentativa < 2 && !achou; tentativa++) {
      const lista = tentativa === 0 ? pedacos
        : linha.split(/(?<=[,;:.])\s+/).filter(f => normalizar(f).length >= 16);
      for (const pedaco of lista) {
        const agulha = normalizar(pedaco);
        const pos = indice.concat.indexOf(agulha, cursor);
        if (pos < 0) continue;
        const pag = paginaDe(indice, pos);
        if (primeiraPagina !== null && pag - primeiraPagina > 3) continue;
        if (primeiraPagina === null) primeiraPagina = pag;
        marcarIntervalo(indice, pos, pos + agulha.length, marcas);
        cursor = pos + agulha.length;
        achou = true;
      }
    }
  }
  return marcas;
}

function buscarPorNumero(indice, artigo) {
  const marcas = new Map();
  const k = ancoraDoArtigo(indice, artigo);
  if (k < 0) return marcas;
  /* destaca o parágrafo que começa ali: até a linha terminar em . : ou ;
     (no máximo 8 linhas, para não pintar meia página) */
  let linhas = 0;
  let textoLinha = '';
  for (let j = k; j < indice.itens.length; j++) {
    const it = indice.itens[j];
    if (j > k && it.p !== indice.itens[k].p && linhas > 0) break;
    if (!marcas.has(it.p)) marcas.set(it.p, new Set());
    marcas.get(it.p).add(it.i);
    textoLinha += it.str;
    if (it.eol) {
      linhas++;
      if (/[.:;]\s*$/.test(textoLinha) || linhas >= 8) break;
      textoLinha = '';
    }
  }
  return marcas;
}

/* ---------- carregamento e renderização ---------- */
async function carregarDocumento(opcoes) {
  const s = sessao;
  const pdfjs = window.pdfjsLib || window['pdfjs-dist/build/pdf'];
  if (!pdfjs) {
    $paginas.innerHTML = '';
    $paginas.append(criarMensagem('O visualizador não carregou. Use o link abaixo para abrir o PDF no site do IFTO.'));
    return;
  }
  pdfjs.GlobalWorkerOptions.workerSrc = 'vendor/pdf.worker.min.js';

  let doc;
  try {
    const fonte = await obterFonte(opcoes);
    doc = await pdfjs.getDocument(fonte).promise;
  } catch (erro) {
    if (s !== sessao) return;
    $paginas.innerHTML = '';
    $paginas.append(criarMensagem('Não foi possível carregar o PDF. Use o link abaixo para abrir a versão oficial no site do IFTO.'));
    return;
  }
  if (s !== sessao) { try { doc.destroy(); } catch {} return; }
  docPdf = doc;

  /* 1) texto de todas as páginas, para achar o artigo sem fixar página */
  $paginas.innerHTML = '';
  $paginas.append(criarMensagem('Procurando o artigo no PDF...'));
  const textos = new Array(doc.numPages + 1);
  const paginasPdf = new Array(doc.numPages + 1);
  for (let p = 1; p <= doc.numPages; p++) {
    if (s !== sessao) return;
    paginasPdf[p] = await doc.getPage(p);
    textos[p] = await paginasPdf[p].getTextContent();
  }
  if (s !== sessao) return;

  const indice = montarIndice(textos);
  let marcas = opcoes.trecho ? buscarLiteral(indice, opcoes.trecho, opcoes.artigo) : new Map();
  if (!marcas.size) marcas = buscarPorNumero(indice, opcoes.artigo);
  const paginasMarcadas = [...marcas.keys()].sort((a, b) => a - b);
  const destino = paginasMarcadas.length ? paginasMarcadas[0] : 1;
  if (!paginasMarcadas.length && (opcoes.trecho || opcoes.artigo)) {
    mostrarAviso('Não conseguimos marcar o trecho. ' + (opcoes.dicaFalha || ''));
  }

  /* 2) cascas das páginas com altura reservada; renderização sob demanda */
  $paginas.innerHTML = '';
  const larguraDisponivel = Math.max($paginas.clientWidth - 32, 280);
  const vp1 = paginasPdf[1].getViewport({ scale: 1 });
  const escala = Math.min(larguraDisponivel, 576) / vp1.width;

  const cascas = [];
  for (let p = 1; p <= doc.numPages; p++) {
    const casca = document.createElement('div');
    casca.className = 'pagina-pdf';
    casca.dataset.pagina = p;
    const vp = paginasPdf[p].getViewport({ scale: escala });
    casca.style.width = Math.round(vp.width) + 'px';
    casca.style.height = Math.round(vp.height) + 'px';
    casca.setAttribute('aria-label', 'Página ' + p);
    $paginas.append(casca);
    cascas.push(casca);
  }

  let rolou = false;
  const renderizadas = new Set();
  async function renderizarPagina(num) {
    if (renderizadas.has(num) || s !== sessao) return;
    renderizadas.add(num);
    const casca = cascas[num - 1];
    const pagina = paginasPdf[num];
    const vp = pagina.getViewport({ scale: escala });

    const canvas = document.createElement('canvas');
    const proporcao = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(vp.width * proporcao);
    canvas.height = Math.floor(vp.height * proporcao);
    casca.append(canvas);
    await pagina.render({
      canvasContext: canvas.getContext('2d'),
      viewport: vp,
      transform: proporcao !== 1 ? [proporcao, 0, 0, proporcao, 0, 0] : null
    }).promise;
    if (s !== sessao) return;

    /* camada de texto, para seleção e destaque */
    const camada = document.createElement('div');
    camada.className = 'camada-texto';
    camada.style.setProperty('--scale-factor', String(escala));
    casca.append(camada);
    const divs = [];
    await pdfjs.renderTextLayer({
      textContentSource: textos[num],
      container: camada,
      viewport: vp,
      textDivs: divs
    }).promise;
    if (s !== sessao) return;

    const alvo = marcas.get(num);
    if (!alvo) return;
    /* liga cada item do PDF.js ao span da camada pelo conteúdo, não pela
       posição: itens vazios podem não ganhar span */
    const marcados = [];
    let j = 0;
    textos[num].items.forEach((item, i) => {
      if (typeof item.str !== 'string') return;
      while (j < divs.length && divs[j].textContent !== item.str && item.str !== '') j++;
      if (item.str === '' || j >= divs.length) return;
      if (alvo.has(i)) { divs[j].classList.add('destaque'); marcados.push(divs[j]); }
      j++;
    });
    if (num === destino && marcados.length && !rolou) {
      rolou = true;
      requestAnimationFrame(() => {
        if (s !== sessao) return;
        const alto = Math.min(...marcados.map(d => d.offsetTop));
        const baixo = Math.max(...marcados.map(d => d.offsetTop + d.offsetHeight));
        const meio = casca.offsetTop + (alto + Math.min(baixo, alto + $paginas.clientHeight * 0.7)) / 2;
        $paginas.scrollTop = meio - $paginas.clientHeight / 2;
      });
    }
  }

  observador = new IntersectionObserver(entradas => {
    entradas.forEach(entrada => {
      if (entrada.isIntersecting) renderizarPagina(Number(entrada.target.dataset.pagina));
    });
  }, { root: $paginas, rootMargin: '600px 0px' });
  cascas.forEach(c => observador.observe(c));

  /* 3) vai direto à página do trecho (ou fica na 1) */
  $paginas.scrollTop = cascas[destino - 1].offsetTop - 16;
  await renderizarPagina(destino);
  for (const p of paginasMarcadas) if (p !== destino) renderizarPagina(p);
}
})();
