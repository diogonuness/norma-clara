/* Visor de PDF do Norma Clara.
   Renderiza o PDF oficial com PDF.js (vendor/pdf.min.js), acha a página do
   trecho por busca normalizada no texto (sem fixar número de página) e
   destaca os spans do trecho com o azul de seleção do vídeo.
   Em file:// o navegador bloqueia fetch de arquivo local; nesse caso o PDF
   vem de normativas/pdf-data.js (base64), carregado sob demanda. */
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

let aberto = false;
let devolverFoco = null;
let sessao = 0;            // invalida renderizações de uma abertura anterior
let observador = null;
let docPdf = null;

/* ---------- normalização para a busca do trecho ---------- */
/* remove acentos, caixa e TODO espaço: aguenta quebras de linha e
   espaçamentos arbitrários da camada de texto do PDF */
function normalizar(s) {
  return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, '');
}

function base64ParaBytes(b64) {
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

let embutidoCarregado = null;
function carregarEmbutido() {
  /* injeta normativas/pdf-data.js via <script>, que funciona em file:// */
  if (embutidoCarregado) return embutidoCarregado;
  embutidoCarregado = new Promise(resolve => {
    if (window.PDF_EMBUTIDO) { resolve(window.PDF_EMBUTIDO); return; }
    const s = document.createElement('script');
    s.src = 'normativas/pdf-data.js';
    s.onload = () => resolve(window.PDF_EMBUTIDO || null);
    s.onerror = () => resolve(null);
    document.head.append(s);
  });
  return embutidoCarregado;
}

async function obterFonte(opcoes) {
  if (location.protocol === 'file:' && opcoes.chaveEmbutida) {
    const embutido = await carregarEmbutido();
    const b64 = embutido && embutido[opcoes.chaveEmbutida];
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
  if (e.key === 'Escape') { e.preventDefault(); fechar(); return; }
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

  /* 1) busca a página do trecho pelo texto, sem fixar número no código */
  let alvo = null; // { pagina, inicio, fim } em índices da string normalizada
  const textos = new Array(doc.numPages + 1);
  if (opcoes.trecho) {
    const agulha = normalizar(opcoes.trecho);
    for (let p = 1; p <= doc.numPages && !alvo; p++) {
      if (s !== sessao) return;
      const pagina = await doc.getPage(p);
      const conteudo = await pagina.getTextContent();
      textos[p] = conteudo;
      const mapa = [];
      let concat = '';
      conteudo.items.forEach((item, i) => {
        const n = normalizar(item.str || '');
        mapa.push({ item: i, inicio: concat.length, fim: concat.length + n.length });
        concat += n;
      });
      const pos = concat.indexOf(agulha);
      if (pos >= 0) alvo = { pagina: p, inicio: pos, fim: pos + agulha.length, mapa };
    }
  }

  if (s !== sessao) return;
  if (opcoes.trecho && !alvo) {
    mostrarAviso('Não conseguimos marcar o trecho. ' + (opcoes.dicaFalha || ''));
  }

  /* 2) monta as cascas das páginas com altura reservada e renderiza sob demanda */
  $paginas.innerHTML = '';
  const primeira = await doc.getPage(1);
  if (s !== sessao) return;
  const larguraDisponivel = Math.max($paginas.clientWidth - 32, 280);
  const vp1 = primeira.getViewport({ scale: 1 });
  const escala = Math.min(larguraDisponivel, 576) / vp1.width;

  const cascas = [];
  for (let p = 1; p <= doc.numPages; p++) {
    const casca = document.createElement('div');
    casca.className = 'pagina-pdf';
    casca.dataset.pagina = p;
    casca.style.width = Math.round(vp1.width * escala) + 'px';
    casca.style.height = Math.round(vp1.height * escala) + 'px';
    casca.setAttribute('aria-label', 'Página ' + p);
    $paginas.append(casca);
    cascas.push(casca);
  }

  const renderizadas = new Set();
  async function renderizarPagina(num) {
    if (renderizadas.has(num) || s !== sessao) return;
    renderizadas.add(num);
    const casca = cascas[num - 1];
    const pagina = num === 1 ? primeira : await doc.getPage(num);
    if (s !== sessao) return;
    const vp = pagina.getViewport({ scale: escala });
    casca.style.width = Math.round(vp.width) + 'px';
    casca.style.height = Math.round(vp.height) + 'px';

    const canvas = document.createElement('canvas');
    const proporcao = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(vp.width * proporcao);
    canvas.height = Math.floor(vp.height * proporcao);
    casca.append(canvas);
    const ctx = canvas.getContext('2d');
    await pagina.render({
      canvasContext: ctx,
      viewport: vp,
      transform: proporcao !== 1 ? [proporcao, 0, 0, proporcao, 0, 0] : null
    }).promise;
    if (s !== sessao) return;

    /* camada de texto, para seleção e destaque */
    const conteudo = textos[num] || await pagina.getTextContent();
    if (s !== sessao) return;
    const camada = document.createElement('div');
    camada.className = 'camada-texto';
    camada.style.setProperty('--scale-factor', String(escala));
    casca.append(camada);
    const divs = [];
    const pdfjs = window.pdfjsLib || window['pdfjs-dist/build/pdf'];
    await pdfjs.renderTextLayer({
      textContentSource: conteudo,
      container: camada,
      viewport: vp,
      textDivs: divs
    }).promise;
    if (s !== sessao) return;

    /* destaque azul do trecho, imitando a seleção do vídeo */
    if (alvo && alvo.pagina === num) {
      const marcados = [];
      alvo.mapa.forEach(m => {
        if (m.fim > alvo.inicio && m.inicio < alvo.fim && divs[m.item]) {
          divs[m.item].classList.add('destaque');
          marcados.push(divs[m.item]);
        }
      });
      if (marcados.length) {
        requestAnimationFrame(() => {
          if (s !== sessao) return;
          const alto = marcados[0].offsetTop;
          const baixo = marcados[marcados.length - 1].offsetTop + marcados[marcados.length - 1].offsetHeight;
          const centro = casca.offsetTop + (alto + baixo) / 2;
          $paginas.scrollTop = centro - $paginas.clientHeight / 2;
        });
      }
    }
  }

  observador = new IntersectionObserver(entradas => {
    entradas.forEach(entrada => {
      if (entrada.isIntersecting) renderizarPagina(Number(entrada.target.dataset.pagina));
    });
  }, { root: $paginas, rootMargin: '600px 0px' });
  cascas.forEach(c => observador.observe(c));

  /* 3) vai direto à página do trecho (ou fica na 1) */
  const destino = alvo ? alvo.pagina : 1;
  await renderizarPagina(destino);
  if (s !== sessao) return;
  if (!alvo) $paginas.scrollTop = 0;
  else if (destino > 1) {
    /* garante a posição mesmo antes do rAF do destaque */
    const casca = cascas[destino - 1];
    if (Math.abs($paginas.scrollTop - casca.offsetTop) > casca.clientHeight) {
      $paginas.scrollTop = casca.offsetTop - 16;
    }
  }
}
})();
