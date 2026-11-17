/* Protótipo de busca em normativas.
   Dois braços de busca (palavra exata e significado) fundidos por RRF,
   como na arquitetura proposta. A resposta é o próprio texto do artigo
   recuperado, seguido de uma explicação em linguagem simples (ver explicar). */

const STOPWORDS = new Set(('a o as os de do da dos das e em um uma uns umas no na nos nas por para com que se ao aos ' +
  'pelo pela eu meu minha meus minhas tem ter tenho ha sobre entre ate isso essa esse agora ainda ja art artigo ' +
  'posso pode podem preciso quero queria fazer faco faz vou foi sei gostaria pra la ali aqui').split(' '));

const SINONIMOS = {
  trancar:['trancamento','matricula'], trancamento:['trancar','matricula'], pausar:['trancamento'],
  parar:['trancamento','cancelamento'], desistir:['cancelamento','trancamento'], sair:['cancelamento','desligamento'],
  voltar:['reabrir','reingresso','processo','seletivo'], reabrir:['trancamento'],
  bolsa:['auxilio'], bolsas:['auxilio'], auxilio:['bolsa'],
  dinheiro:['auxilio','valor','percentual'], valor:['percentual','salario','minimo'], quanto:['valor','percentual'],
  pagar:['pagamento','valor'], recebo:['auxilio'], receber:['auxilio'],
  prova:['avaliacao','verificacao','aprendizagem'], provas:['avaliacao','verificacao'], avaliacao:['prova','verificacao'],
  faltei:['falta','frequencia','segunda','chamada'],
  faltar:['falta','frequencia'], falta:['frequencia','abono'], faltas:['frequencia','abono'],
  reprovar:['reprovacao','media','frequencia'], reprovado:['reprovacao','conselho','media'],
  rodar:['reprovacao'], passar:['aprovacao','media'], aprovado:['aprovacao','media'],
  nota:['media','avaliacao'], notas:['media','avaliacao'], media:['nota','aprovacao'],
  materia:['componente','curricular','disciplina'], materias:['componente','disciplina'],
  disciplina:['componente','curricular'], disciplinas:['componente','curricular'],
  professor:['docente','atendimento'], recuperacao:['reforco','recuperar','paralela'], recuperar:['recuperacao'],
  recorrer:['revisao','recurso','defesa'], recurso:['revisao','defesa'], contestar:['revisao'],
  estagio:['ppc','carga','horaria'], renda:['per','capita','socioeconomica','vulnerabilidade'],
  comida:['alimentacao','refeicao'], almoco:['refeicao','alimentacao'], janta:['refeicao'],
  onibus:['transporte'], passagem:['transporte'], moradia:['residencia','alugar'],
  viagem:['auxilio','deslocamento','universal'], evento:['viagem','deslocamento'],
  atestado:['saude','justificativa','abono'], doente:['saude'], gravida:['gravidez'],
  aproveitar:['aproveitamento','estudos'], aproveitamento:['estudos','componente'],
  inscrever:['inscricao','edital','selecao'], inscricao:['edital','selecao']
};

function normalizar(s) {
  return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s/]/g, ' ').replace(/\s+/g, ' ').trim();
}
function tokenizar(s) {
  return normalizar(s).split(' ').filter(t => t.length > 1 && !STOPWORDS.has(t));
}
function expandir(tokens) {
  const saida = [...tokens];
  tokens.forEach(t => { if (SINONIMOS[t]) saida.push(...SINONIMOS[t]); });
  return saida;
}

/* Radicalização leve do português: "trancar", "trancamento" e "trancada"
   precisam cair no mesmo radical, senão a busca por palavra erra o artigo. */
const SUFIXOS = ['mente', 'mentos', 'mento', 'acao', 'cao', 'idade', 'istas', 'ista', 'ismo',
  'ancia', 'encia', 'avel', 'ivel', 'agem', 'ario', 'aria', 'adora', 'ador',
  'ada', 'ado', 'ida', 'ido', 'ava', 'ar', 'er', 'ir', 'am', 'ou', 'ei'];
function radical(t) {
  if (t.length <= 4 || /\d/.test(t)) return t;
  let s = t;
  if (s.endsWith('oes') || s.endsWith('aes')) s = s.slice(0, -3) + 'ao';
  else if (s.endsWith('ns')) s = s.slice(0, -2) + 'm';
  else if (s.endsWith('s')) s = s.slice(0, -1);
  for (const suf of SUFIXOS) {
    if (s.endsWith(suf) && s.length - suf.length >= 4) { s = s.slice(0, s.length - suf.length); break; }
  }
  while (s.length > 4 && 'aeiou'.includes(s[s.length - 1])) s = s.slice(0, -1);
  return s;
}
const radicais = tokens => tokens.map(radical);

/* ---------- índice BM25 ---------- */
function construirIndice(campoFn) {
  const docs = NORMAS.map(n => radicais(tokenizar(campoFn(n))));
  const df = new Map();
  docs.forEach(d => new Set(d).forEach(t => df.set(t, (df.get(t) || 0) + 1)));
  const avgdl = docs.reduce((s, d) => s + d.length, 0) / docs.length;
  return { docs, df, avgdl, N: docs.length };
}
function bm25(indice, consulta, b = 0.75) {
  const k1 = 1.5;
  return indice.docs.map((doc, i) => {
    const tf = new Map();
    doc.forEach(t => tf.set(t, (tf.get(t) || 0) + 1));
    let score = 0;
    new Set(consulta).forEach(termo => {
      const f = tf.get(termo); if (!f) return;
      const n = indice.df.get(termo) || 0;
      const idf = Math.log(1 + (indice.N - n + 0.5) / (n + 0.5));
      score += idf * (f * (k1 + 1)) / (f + k1 * (1 - b + b * doc.length / indice.avgdl));
    });
    return { i, score };
  });
}

const IDX_TEXTO = construirIndice(n => n.assunto + ' ' + n.texto + ' ' + n.artigo);
const IDX_TAGS  = construirIndice(n => n.assunto + ' ' + n.assunto + ' ' + n.tags);
const IDX_TUDO  = construirIndice(n => n.assunto + ' ' + n.texto + ' ' + n.tags);

/* Reranking: o BM25 satura na repetição de um termo, então um trecho curto que
   repete uma palavra comum sobe demais. O reranker troca o critério — conta
   quantos termos DISTINTOS da pergunta o trecho cobre, pesados por idf. */
function cobertura(indice, termos) {
  const presentes = new Set(indice.docs[0] ? [] : []);
  return indice.docs.map((doc, i) => {
    const conjunto = new Set(doc);
    let score = 0;
    new Set(termos).forEach(t => {
      if (!conjunto.has(t)) return;
      const n = indice.df.get(t) || 0;
      score += Math.log(1 + (indice.N - n + 0.5) / (n + 0.5));
    });
    return { i, score };
  });
}

/* ---------- referência explícita a artigo ou resolução ---------- */
function referenciaExata(pergunta) {
  const alvos = new Set();
  const txt = normalizar(pergunta);
  for (const m of txt.matchAll(/\bart(?:igo|\.)?\s*(\d+)/g)) {
    NORMAS.forEach((n, i) => {
      if (new RegExp('\\b' + m[1] + '\\b').test(normalizar(n.artigo))) alvos.add(i);
    });
  }
  for (const m of txt.matchAll(/resolucao\s*n?\.?\s*o?\s*(\d+)\s*\/?\s*(\d{4})?/g)) {
    NORMAS.forEach((n, i) => {
      const res = normalizar(DOCUMENTOS[n.doc].resolucao);
      if (res.includes(m[1] + '/' + (m[2] || ''))) alvos.add(i);
    });
  }
  return [...alvos];
}

/* ---------- fusão RRF ---------- */
function ranquear(scores) {
  return scores.filter(s => s.score > 0).sort((a, b) => b.score - a.score);
}
function buscar(pergunta, incluirRevogadas) {
  const brutos = tokenizar(pergunta);
  const expandidos = expandir(brutos);
  const base = radicais(brutos);
  const expandida = radicais(expandidos);
  const idxTudo = IDX_TUDO;

  const listaLex = ranquear(bm25(IDX_TEXTO, base)).slice(0, 20);
  const listaSem = ranquear(bm25(IDX_TAGS, expandida, 0.35)).slice(0, 20);
  const listaRef = referenciaExata(pergunta).map((i, pos) => ({ i, score: 10 - pos }));

  const K = 60, fundido = new Map();
  const somar = (lista, rotulo, peso) => {
    const teto = lista[0]?.score || 1;
    lista.forEach((item, pos) => {
      const reg = fundido.get(item.i) || { i: item.i, rrf: 0, desempate: 0, pos: {} };
      reg.rrf += peso / (K + pos + 1);
      // desempate: RRF empata com frequência entre dois braços simétricos,
      // e sem isso o primeiro braço somado venceria sempre.
      reg.desempate += item.score / teto;
      reg.pos[rotulo] = pos + 1;
      fundido.set(item.i, reg);
    });
  };
  somar(listaLex, 'lex', 1); somar(listaSem, 'sem', 1.2); somar(listaRef, 'ref', 3);

  let resultados = [...fundido.values()]
    .sort((a, b) => (b.rrf - a.rrf) || (b.desempate - a.desempate));

  // reranking dos 8 melhores candidatos da fusão
  const candidatos = resultados.slice(0, 8);
  if (candidatos.length > 1 && listaRef.length === 0) {
    const cob = cobertura(IDX_TUDO, expandida);
    const tetoCob = Math.max(...candidatos.map(c => cob[c.i].score)) || 1;
    const tetoRrf = Math.max(...candidatos.map(c => c.rrf)) || 1;
    // Pesos iguais: acima de 0.5 para a fusão, um trecho que aparece nas duas
    // listas de busca vence outro que aparece só em uma, mesmo quando essa
    // única lista o coloca muito à frente.
    candidatos.forEach(c => {
      c.cobertura = cob[c.i].score;
      c.rerank = 0.5 * (c.rrf / tetoRrf) + 0.5 * (c.cobertura / tetoCob);
    });
    candidatos.sort((a, b) => (b.rerank - a.rerank) || (b.desempate - a.desempate));
    resultados = candidatos.concat(resultados.slice(8));
  }
  const descartadas = [];
  if (!incluirRevogadas) {
    resultados = resultados.filter(r => {
      if (DOCUMENTOS[NORMAS[r.i].doc].situacao === 'revogada') { descartadas.push(r); return false; }
      return true;
    });
  }

  // Abstenção: além de uma pontuação mínima, o melhor trecho precisa cobrir
  // metade dos termos temáticos da pergunta. Sem isso, uma palavra solta em
  // comum ("horário" casando com "carga horária") viraria resposta errada.
  const melhorLex = listaLex[0]?.score || 0;
  const melhorSem = listaSem[0]?.score || 0;
  const topo = resultados[0];
  let coberto = 0;
  if (topo && base.length) {
    const conjunto = new Set(idxTudo.docs[topo.i]);
    coberto = base.filter(t => conjunto.has(t)).length;
  }
  const exigido = base.length >= 3 ? 2 : 1;
  const confiante = listaRef.length > 0 ||
    (coberto >= exigido && (melhorLex > 0.8 || melhorSem > 0.8));

  return { resultados: resultados.slice(0, 4), listaLex, listaSem, listaRef, descartadas, confiante, coberto,
           base: brutos, extras: expandidos.filter(t => !brutos.includes(t)) };
}

/* ---------- outros artigos relacionados ----------
   Fica no motor (e não na interface) para testes.js medir com a mesma regra.
   Recebe o resultado de buscar() e devolve até 3 índices de NORMAS:
   - vigentes (o filtro já vem de buscar), sem o próprio artigo da resposta;
   - do mesmo tema da resposta, com pontuação >= 30% da do primeiro
     (reranking quando houve, senão RRF);
   - se nenhum passar no corte, até 2 seguintes do mesmo tema que cubram
     algum termo da pergunta (cobertura > 0).
   O tema é o que impede artigo sem relação: as pontuações ficam todas perto
   do topo, e sem ele "Faltei na prova" listava "O que dá advertência por
   escrito" (o artigo fala em "nota de prova"). */
function relacionados(r) {
  const nota = x => (x.rerank != null ? x.rerank : x.rrf);
  const [topo, ...resto] = r.resultados || [];
  if (!topo) return [];
  const tema = NORMAS[topo.i].tema;
  const doTema = x => x.i !== topo.i && NORMAS[x.i].tema === tema;
  const acima = resto.filter(x => doTema(x) && nota(x) >= 0.3 * nota(topo)).slice(0, 3);
  if (acima.length) return acima.map(x => x.i);
  return resto.filter(x => doTema(x) && (x.cobertura || 0) > 0).slice(0, 2).map(x => x.i);
}

/* ---------- interface ---------- */
/* Interface do Norma Clara igual ao vídeo de demonstração.
   O microfone ouve de verdade (Web Speech API, pt-BR) e a resposta vem do
   motor de busca acima. ?demo=0 só tira o selo "Demonstração" do cabeçalho. */
(() => {
'use strict';

const PARAMS = new URLSearchParams(location.search);
const MODO_DEMO = PARAMS.get('demo') !== '0' && PARAMS.get('real') !== '1';
const reduzirMovimento = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* PDFs disponíveis localmente (pasta normativas/), por documento */
const PDF_LOCAIS = {
  odp: 'normativas/01-recorte-do-professor/ODP - Organizacao Didatico-Pedagogica dos Cursos Tecnicos Presenciais (Res 38-2013, convalidada pela 23-2015).pdf',
  disciplinar: 'normativas/01-recorte-do-professor/Regulamento Disciplinar Discente (Res 197-2023).pdf',
  docente: 'normativas/01-recorte-do-professor/Regimes de Trabalho e Atividades Docentes (Res 58-2019).pdf',
  polae: 'normativas/02-acrescimos/POLAE - Politica de Assistencia Estudantil.pdf'
};

/* ---------- elementos ---------- */
const $hero = document.getElementById('hero');
const $conversa = document.getElementById('conversa');
const $mic = document.getElementById('btn-mic');
const $campo = document.getElementById('campo');
const $campoCaixa = $campo.parentElement;
const $lixeira = document.getElementById('btn-lixeira');
const $enviar = document.getElementById('btn-enviar');
const $ajuda = document.getElementById('ajuda');
const $rodape = document.getElementById('rodape');
const $seloDemo = document.getElementById('selo-demo');
const $reiniciar = document.getElementById('btn-reiniciar');
const $anuncio = document.getElementById('anuncio');

const PLACEHOLDERS_LONGOS = {
  idle: 'Clique no microfone para fazer sua pergunta.',
  listening: 'Pode falar...',
  review: '',
  answering: 'Sua resposta está chegando...',
  done: 'Faça outra pergunta...'
};
/* no celular o campo tem ~210 px: cada placeholder cabe numa linha */
const PLACEHOLDERS_CURTOS = {
  idle: 'Digite ou fale sua pergunta',
  listening: 'Pode falar...',
  review: '',
  answering: 'Resposta chegando...',
  done: 'Faça outra pergunta...'
};
/* abaixo de 375 px (iPhone SE, 320–360 px) sobram ~150 px de campo */
const PLACEHOLDERS_MINIMOS = {
  idle: 'Fale ou digite aqui',
  listening: 'Pode falar...',
  review: '',
  answering: 'Chegando...',
  done: 'Outra pergunta...'
};
const telaEstreita = matchMedia('(max-width: 640px)');
const telaMuitoEstreita = matchMedia('(max-width: 374px)');
const escolherPlaceholders = () => telaMuitoEstreita.matches ? PLACEHOLDERS_MINIMOS
  : telaEstreita.matches ? PLACEHOLDERS_CURTOS : PLACEHOLDERS_LONGOS;
let PLACEHOLDERS = escolherPlaceholders();
const AJUDA_PADRAO = 'Pergunte com suas palavras. A resposta vem com a fonte.';
const AJUDAS = {
  idle: AJUDA_PADRAO,
  listening: 'Ouvindo sua pergunta...',
  review: 'Tudo certo? Clique em Perguntar para continuar.',
  done: AJUDA_PADRAO
};

let estado = 'idle';
let temConversa = false;
let geracao = 0; // cancela digitações e roteiros pendentes ao reiniciar
let digitacaoAtual = null; // função que completa a digitação em curso (pular)

function definirEstado(novo, ajuda) {
  estado = novo;
  document.body.dataset.estado = novo;
  if (novo !== 'review') $campo.placeholder = PLACEHOLDERS[novo] || '';
  /* no celular o botão é só uma seta: a ajuda não pode falar em "Perguntar" */
  const ajudaPadrao = novo === 'review' && telaEstreita.matches
    ? 'Tudo certo? Toque na seta para enviar.'
    : (AJUDAS[novo] || AJUDA_PADRAO);
  $ajuda.textContent = ajuda != null ? ajuda : ajudaPadrao;

  const podeEnviar = novo === 'review';
  $enviar.disabled = !podeEnviar;
  $enviar.setAttribute('aria-disabled', String(!podeEnviar));
  $enviar.classList.toggle('composer__enviar--ativo', podeEnviar);

  $mic.disabled = micIndisponivel || novo === 'answering';

  const comLixeira = novo === 'review';
  $lixeira.hidden = !comLixeira;
  $campoCaixa.classList.toggle('composer__campo--com-lixeira', comLixeira);

  $campo.disabled = novo === 'answering';
  autoCrescer();
}

/* ---------- utilidades ---------- */
const esperar = ms => new Promise(r => setTimeout(r, ms));

function el(tag, cls, txt) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (txt != null) e.textContent = txt;
  return e;
}

function entrar(elemento) {
  /* entrada com fade + translateY via transição (interrompível) */
  elemento.setAttribute('data-entrando', '');
  requestAnimationFrame(() => requestAnimationFrame(() => elemento.removeAttribute('data-entrando')));
}

function autoCrescer() {
  /* campo vazio mede o placeholder, que no celular pode ocupar duas linhas */
  const vazio = $campo.value === '';
  if (vazio) $campo.value = $campo.placeholder;
  $campo.style.height = 'auto';
  $campo.style.height = Math.min($campo.scrollHeight, 128) + 'px';
  if (vazio) $campo.value = '';
}

function ondulacao(botao, evento) {
  if (reduzirMovimento) return;
  const r = botao.getBoundingClientRect();
  const x = (evento && evento.clientX ? evento.clientX - r.left : r.width / 2);
  const y = (evento && evento.clientY ? evento.clientY - r.top : r.height / 2);
  const d = Math.max(r.width, r.height) * 2;
  const onda = el('span', 'ondulacao');
  onda.style.width = onda.style.height = d + 'px';
  onda.style.left = (x - d / 2) + 'px';
  onda.style.top = (y - d / 2) + 'px';
  botao.appendChild(onda);
  onda.animate(
    [{ transform: 'scale(.15)', opacity: .7 }, { transform: 'scale(1)', opacity: 0 }],
    { duration: 450, easing: 'cubic-bezier(.2,.8,.2,1)' }
  ).onfinish = () => onda.remove();
}

/* ---------- digitação com altura reservada (sem salto de layout) ---------- */
function criarDigitavel() {
  const wrap = el('span', 'digitavel');
  const fantasma = el('span', 'digitavel__fantasma');
  const visivel = el('span', 'digitavel__visivel');
  wrap.append(fantasma, visivel);
  return { wrap, fantasma, visivel };
}

/* Digitação por linha do tempo: cada caractere tem seu instante (ritmo base
   + pausa depois de . e ,). Se o total passa do teto, a linha inteira é
   comprimida, então texto curto mantém o ritmo e texto longo termina no teto.
   A cada quadro aparece o que já deveria estar visível; setTimeout por
   caractere não daria conta de 2.000 caracteres em 1,5 s.
   controle.pular completa o texto na hora (clique no card ou Esc). */
function digitar(digitavel, texto, opcoes) {
  const g = geracao;
  const { visivel } = digitavel;
  const controle = opcoes.controle || {};
  if (reduzirMovimento) {
    visivel.setAttribute('data-fade', '');
    visivel.textContent = texto;
    requestAnimationFrame(() => requestAnimationFrame(() => visivel.setAttribute('data-fade', 'pronto')));
    return esperar(130);
  }
  const chars = Array.from(texto);
  /* ate: só esses primeiros caracteres são digitados; o resto entra de uma vez */
  const ultimo = opcoes.ate ? Math.min(opcoes.ate, chars.length) : chars.length;
  const tempos = new Array(ultimo);
  let t = 0;
  for (let i = 0; i < ultimo; i++) {
    t += opcoes.msPorChar;
    tempos[i] = t;
    if (opcoes.pausaPontuacao && (chars[i] === '.' || chars[i] === ',')) t += opcoes.pausaPontuacao;
  }
  const escala = t > opcoes.teto ? opcoes.teto / t : 1;

  const cursor = el('span', 'cursor');
  const alvo = document.createTextNode('');
  visivel.append(alvo, cursor);
  return new Promise(resolve => {
    const inicio = performance.now();
    let mostrados = 0;
    const quadro = agora => {
      if (g !== geracao) { cursor.remove(); resolve(); return; }
      const decorrido = (agora - inicio) / escala;
      let n = mostrados;
      if (controle.pular) n = chars.length;
      else {
        while (n < ultimo && tempos[n] <= decorrido) n++;
        if (n >= ultimo) n = chars.length;
      }
      if (n !== mostrados) { mostrados = n; alvo.textContent = chars.slice(0, n).join(''); }
      if (mostrados >= chars.length) { cursor.remove(); resolve(); return; }
      requestAnimationFrame(quadro);
    };
    requestAnimationFrame(quadro);
  });
}

/* ---------- card da resposta ---------- */
function montarCard(resposta) {
  const card = el('article', 'card');

  const linha1 = el('div', 'card__linha1');
  linha1.append(el('h2', 'card__documento', resposta.documento));
  const verPdf = el('button', 'card__ver-pdf', 'Ver PDF');
  verPdf.type = 'button';
  verPdf.addEventListener('click', () => {
    if (resposta.pdfLocal && window.abrirVisorPdf) {
      window.abrirVisorPdf({
        titulo: (resposta.documentoCurto || resposta.documento) + ' · PDF oficial',
        pdfLocal: resposta.pdfLocal,
        pdfOficial: resposta.pdfOficial,
        trecho: resposta.trechoParaDestacar,
        artigo: resposta.artigo,
        chaveEmbutida: resposta.chaveEmbutida,
        dicaFalha: resposta.artigo ? "Procure por '" + resposta.artigo + "'." : '',
        devolverFoco: verPdf
      });
    } else {
      window.open(resposta.pdfOficial, '_blank', 'noopener');
    }
  });
  linha1.append(verPdf);
  card.append(linha1);

  const chips = el('div', 'card__chips');
  chips.append(el('span', 'chip-artigo', resposta.artigo));
  if (resposta.tema) chips.append(el('span', 'chip-tema', resposta.tema));
  /* serifa + barra de citação significam "a norma, palavra por palavra";
     o que é síntese aparece em sans, sem barra, com rótulo e selo próprios */
  const literal = resposta.oficial !== false;
  chips.append(literal
    ? el('span', 'chip-oficial', 'Texto oficial')
    : el('span', 'chip-resumo', 'Resumo · confira no PDF'));
  if (!reduzirMovimento) {
    /* some quando a digitação termina; o clique sobe até o card, que pula */
    const dica = el('button', 'card__pular', 'Toque para ver tudo');
    dica.type = 'button';
    chips.append(dica);
  }
  card.append(chips);

  card.append(el('p', 'card__rotulo', literal ? 'O que diz o artigo' : 'Resumo do artigo'));
  const oficial = criarDigitavel();
  const blocoOficial = el('div', literal ? 'card__oficial' : 'card__oficial card__oficial--resumo');
  /* o corpo pode ficar recolhido em 6 linhas; o botão só aparece se o
     artigo não couber (medido depois das fontes, em avaliarRecolhimento) */
  const corpo = el('div', 'card__oficial-corpo');
  corpo.id = 'artigo-' + (contadorCartoes + 1);
  corpo.append(oficial.wrap);
  blocoOficial.append(corpo);
  card.append(blocoOficial);
  const expandir = el('button', 'card__expandir');
  expandir.type = 'button';
  expandir.hidden = true;
  expandir.setAttribute('aria-expanded', 'false');
  expandir.setAttribute('aria-controls', corpo.id);
  expandir.append(el('span', 'card__expandir-texto', 'Ler artigo completo'));
  expandir.insertAdjacentHTML('beforeend', '<svg aria-hidden="true" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>');
  expandir.addEventListener('click', () => alternarArtigo(blocoOficial, expandir));
  card.append(expandir);

  card.append(el('p', 'card__rotulo', 'Em linguagem simples · IA'));
  const simples = criarDigitavel();
  const blocoSimples = el('div', 'card__simples');
  blocoSimples.append(simples.wrap);
  card.append(blocoSimples);

  card.append(el('hr', 'card__divisor'));
  const rodape = el('div', 'card__rodape');
  rodape.append(el('p', 'card__referencia', resposta.referencia || ''));
  const acoes = el('div', 'card__acoes');
  const baixar = el('a', 'card__baixar', 'Baixar PDF');
  baixar.href = encodeURI(resposta.pdfLocal || resposta.pdfOficial);
  baixar.setAttribute('download', '');
  if (!resposta.pdfLocal) { baixar.target = '_blank'; baixar.rel = 'noopener'; }
  acoes.append(baixar, montarCopiar(resposta), montarAvaliacao(resposta));
  rodape.append(acoes);
  card.append(rodape);

  card.dataset.cartao = String(++contadorCartoes);
  if (resposta.relacionados && resposta.relacionados.length) {
    card.append(montarRelacionados(resposta, card));
  }

  return { card, oficial, simples, blocoOficial, expandir };
}

let contadorCartoes = 0;

/* ---------- artigo recolhido ----------
   Seis linhas visíveis, com degradê na base; "Ler artigo completo" expande.
   Decide pela altura real do texto (depois das fontes), não pelo número de
   caracteres: 300 caracteres cabem em 6 linhas no desktop e não no celular. */
const LINHAS_RECOLHIDAS = 6;

function avaliarRecolhimento(bloco, expandir) {
  const fantasma = bloco.querySelector('.digitavel__fantasma');
  const corpo = bloco.querySelector('.card__oficial-corpo');
  const linha = parseFloat(getComputedStyle(fantasma).lineHeight);
  const limite = Math.round(linha * LINHAS_RECOLHIDAS);
  const precisa = fantasma.offsetHeight > limite + 2;
  corpo.style.setProperty('--altura-recolhida', limite + 'px');
  bloco.classList.toggle('card__oficial--recolhivel', precisa);
  expandir.hidden = !precisa;
  return precisa ? limite : null;
}

/* Quantos caracteres do texto cabem na altura recolhida: busca binária com
   Range sobre o fantasma, que já tem o texto inteiro na tipografia final. */
function caracteresVisiveis(fantasma, limite) {
  const no = fantasma.firstChild;
  if (!no) return 0;
  const topo = fantasma.getBoundingClientRect().top;
  const faixa = document.createRange();
  let lo = 0, hi = no.length;
  while (lo < hi) {
    const meio = Math.ceil((lo + hi) / 2);
    faixa.setStart(no, 0);
    faixa.setEnd(no, meio);
    if (faixa.getBoundingClientRect().bottom - topo <= limite + 1) lo = meio; else hi = meio - 1;
  }
  return Array.from(no.data.slice(0, lo)).length;
}

function alternarArtigo(bloco, expandir) {
  const abrir = !bloco.classList.contains('card__oficial--aberto');
  bloco.classList.toggle('card__oficial--aberto', abrir);
  expandir.setAttribute('aria-expanded', String(abrir));
  expandir.querySelector('.card__expandir-texto').textContent = abrir ? 'Mostrar menos' : 'Ler artigo completo';
  if (!abrir) {
    /* ao recolher um artigo longo, o botão pode ter subido para fora da tela */
    setTimeout(() => {
      const r = expandir.getBoundingClientRect();
      if (r.top < 0 || r.bottom > innerHeight) expandir.scrollIntoView({ block: 'center', behavior: 'auto' });
    }, reduzirMovimento ? 0 : 200);
  }
}

/* a quebra de linha muda com a largura: reavalia os cards ao redimensionar */
let timerRecolher = null;
addEventListener('resize', () => {
  clearTimeout(timerRecolher);
  timerRecolher = setTimeout(() => {
    document.querySelectorAll('.card').forEach(c => {
      const bloco = c.querySelector('.card__oficial');
      const botao = c.querySelector('.card__expandir');
      if (bloco && botao) avaliarRecolhimento(bloco, botao);
    });
  }, 150);
});

/* ---------- ações do card: copiar e avaliar ---------- */
const ICONES = {
  copiar: '<svg aria-hidden="true" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>',
  ok: '<svg aria-hidden="true" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
  sim: '<svg aria-hidden="true" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M7 10v12"/><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z"/></svg>',
  nao: '<svg aria-hidden="true" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M17 14V2"/><path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22a3.13 3.13 0 0 1-3-3.88Z"/></svg>'
};

function textoParaCompartilhar(resposta) {
  const linhas = [];
  if (resposta.pergunta) linhas.push('Pergunta: ' + resposta.pergunta);
  linhas.push('Resposta: ' + (resposta.linguagemSimples || resposta.textoOficial));
  linhas.push('Fonte: ' + resposta.documento + ', ' + resposta.artigo + ' — ' + resposta.referencia);
  linhas.push(resposta.pdfOficial);
  linhas.push('(via Norma Clara)');
  return linhas.join('\n');
}

async function copiarTexto(texto) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(texto);
      return true;
    }
  } catch {}
  /* reserva para file:// e navegadores sem a API: textarea temporário */
  try {
    const ta = document.createElement('textarea');
    ta.value = texto;
    ta.setAttribute('readonly', '');
    ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0;pointer-events:none';
    document.body.append(ta);
    ta.select();
    const ok = document.execCommand('copy');
    ta.remove();
    return ok;
  } catch {
    return false;
  }
}

function montarCopiar(resposta) {
  const b = el('button', 'card__acao card__copiar');
  b.type = 'button';
  b.setAttribute('aria-label', 'Copiar resposta com a fonte');
  const icone = el('span', 'card__acao-icone');
  icone.innerHTML = ICONES.copiar;
  const rotulo = el('span', 'card__acao-rotulo', 'Copiar');
  b.append(icone, rotulo);
  let timer = null;
  b.addEventListener('click', async e => {
    e.stopPropagation();
    const ok = await copiarTexto(textoParaCompartilhar(resposta));
    icone.innerHTML = ok ? ICONES.ok : ICONES.copiar;
    rotulo.textContent = ok ? 'Copiado ✓' : 'Não deu para copiar';
    b.classList.add('card__acao--feito');
    $anuncio.textContent = ok ? 'Resposta copiada.' : 'Não deu para copiar.';
    clearTimeout(timer);
    timer = setTimeout(() => {
      icone.innerHTML = ICONES.copiar;
      rotulo.textContent = 'Copiar';
      b.classList.remove('card__acao--feito');
    }, 1500);
  });
  return b;
}

/* Feedback fica só neste navegador (localStorage); ?admin=1 exporta os 👎 */
const CHAVE_FEEDBACK = 'normaClara.feedback';
function lerFeedback() {
  try { return JSON.parse(localStorage.getItem(CHAVE_FEEDBACK)) || []; } catch { return []; }
}
function salvarFeedback(registro) {
  try {
    const lista = lerFeedback();
    lista.push(registro);
    localStorage.setItem(CHAVE_FEEDBACK, JSON.stringify(lista));
  } catch {}
}

function montarAvaliacao(resposta) {
  const grupo = el('div', 'card__avaliacao');
  grupo.setAttribute('role', 'group');
  grupo.setAttribute('aria-label', 'Isso respondeu?');
  grupo.append(el('span', 'card__acao-rotulo card__avaliacao-pergunta', 'Isso respondeu?'));
  const votar = util => e => {
    e.stopPropagation();
    salvarFeedback({ pergunta: resposta.pergunta || null, artigoId: resposta.id, util, data: new Date().toISOString() });
    grupo.replaceChildren(el('span', 'card__avaliacao-obrigado', 'Obrigado!'));
    $anuncio.textContent = 'Obrigado pela avaliação.';
  };
  for (const [util, rotulo, icone] of [[true, 'Sim, respondeu', ICONES.sim], [false, 'Não respondeu', ICONES.nao]]) {
    const b = el('button', 'card__acao card__voto');
    b.type = 'button';
    b.setAttribute('aria-label', rotulo);
    b.innerHTML = icone;
    b.addEventListener('click', votar(util));
    grupo.append(b);
  }
  return grupo;
}

function exportarNegativos() {
  const negativos = lerFeedback().filter(r => r.util === false);
  const blob = new Blob([JSON.stringify(negativos, null, 2)], { type: 'application/json' });
  const a = el('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'norma-clara-perguntas-sem-resposta.json';
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

/* "Outros artigos relacionados": recolhido; cada linha abre o card do artigo */
function montarRelacionados(resposta, card) {
  const det = el('details', 'relacionados');
  det.append(el('summary', 'relacionados__resumo',
    'Outros artigos relacionados (' + resposta.relacionados.length + ')'));
  const lista = el('ul', 'relacionados__lista');
  resposta.relacionados.forEach(i => {
    const n = NORMAS[i];
    const d = DOCUMENTOS[n.doc];
    const li = el('li');
    const b = el('button', 'relacionados__item');
    b.type = 'button';
    b.append(el('span', 'relacionados__artigo', n.artigo), ' · ',
      el('span', 'relacionados__assunto', n.assunto), ' · ',
      el('span', 'relacionados__doc', d.nomeCurto || d.sigla));
    b.addEventListener('click', () => mostrarArtigo(i, resposta.pergunta, card));
    li.append(b);
    lista.append(li);
  });
  det.append(lista);
  return det;
}

/* ---------- fluxo de resposta ---------- */
function esconderHero() {
  if (temConversa) return Promise.resolve();
  temConversa = true;
  return new Promise(resolve => {
    $conversa.hidden = false;
    if (reduzirMovimento) { $hero.hidden = true; resolve(); return; }
    $hero.classList.add('hero--saindo');
    setTimeout(() => { $hero.hidden = true; resolve(); }, 200);
  });
}

/* Explicação em linguagem simples. Com CONFIG_IA.endpoint definido, o trecho
   do artigo é enviado ao modelo por POST { pergunta, documento, artigo, texto }
   e a resposta esperada é { explicacao }. Sem endpoint, usa as explicações
   pré-geradas de EXPLICACOES (normas.js). */
const CONFIG_IA = { endpoint: null };

async function explicar(n, pergunta) {
  if (!CONFIG_IA.endpoint) return EXPLICACOES[n.id] || null;
  try {
    const resp = await fetch(CONFIG_IA.endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pergunta, documento: DOCUMENTOS[n.doc].nome, artigo: n.artigo, texto: n.texto })
    });
    if (!resp.ok) return null;
    return (await resp.json()).explicacao || null;
  } catch {
    return null;
  }
}

/* O formato que o card consome, montado a partir de um artigo de NORMAS */
async function respostaDoArtigo(n, pergunta) {
  const d = DOCUMENTOS[n.doc];
  return {
    id: n.id,
    pergunta,
    documento: d.nome,
    documentoCurto: d.nomeCurto || d.sigla,
    artigo: n.artigo,
    tema: n.assunto,
    textoOficial: n.texto,
    linguagemSimples: await explicar(n, pergunta),
    referencia: d.resolucao,
    pdfLocal: PDF_LOCAIS[n.doc] || null,
    pdfOficial: d.link,
    chaveEmbutida: PDF_LOCAIS[n.doc] ? n.doc : null,
    oficial: n.tipo === 'literal',
    trechoParaDestacar: n.tipo === 'literal' ? n.texto : null
  };
}

const rolar = elemento =>
  elemento.scrollIntoView({ behavior: reduzirMovimento ? 'auto' : 'smooth', block: 'nearest' });

function acrescentarBalao(pergunta) {
  const balao = el('div', 'balao', pergunta);
  entrar(balao);
  $conversa.append(balao);
  rolar(balao);
}

/* Envia uma pergunta pronta (chips de sugestão) como se a pessoa tivesse digitado */
function perguntarDireto(texto) {
  if (estado === 'answering' || estado === 'listening') return;
  $campo.value = texto;
  definirEstado('review');
  responderPergunta(texto);
}

/* usa o pipeline real (busca híbrida + RRF + reranking) definido acima */
async function responderPergunta(texto) {
  const g = geracao;
  const pergunta = texto.trim();
  if (!pergunta) return;

  await esconderHero();
  if (g !== geracao) return;

  acrescentarBalao(pergunta);
  $campo.value = '';
  autoCrescer();
  definirEstado('answering');

  const r = buscar(pergunta, false);
  const confiante = r.confiante && r.resultados.length > 0;
  const resposta = confiante ? await respostaDoArtigo(NORMAS[r.resultados[0].i], pergunta) : null;

  await esperar(reduzirMovimento ? 0 : 120);
  if (g !== geracao) return;

  if (!resposta) { mostrarAbstencao(r); return; }
  resposta.relacionados = relacionados(r);
  await mostrarResposta(resposta, g);
}

function esperarFimDaResposta() {
  return new Promise(resolve => {
    const inicio = performance.now();
    const ver = () => (estado !== 'answering' || performance.now() - inicio > 8000) ? resolve() : setTimeout(ver, 40);
    ver();
  });
}

/* Abre o card completo de um artigo, sem uma nova pergunta da pessoa
   (sugestão "Talvez você queira saber sobre" e "Outros artigos relacionados").
   depoisDe: card de origem; o novo entra logo abaixo dele. */
async function mostrarArtigo(i, pergunta, depoisDe) {
  if (estado === 'listening') return;
  if (estado === 'answering') {
    if (digitacaoAtual) digitacaoAtual();
    await esperarFimDaResposta();
  }
  const g = geracao;
  definirEstado('answering');
  const resposta = await respostaDoArtigo(NORMAS[i], pergunta || null);
  if (g !== geracao) return;
  await mostrarResposta(resposta, g, depoisDe);
}

/* ---------- abstenção com saída ----------
   Mantém a frase de "não sei" e oferece para onde ir: os temas que a base
   cobre (um chip por tema, com uma pergunta-exemplo) e, quando a busca ficou
   perto de responder, o assunto do artigo mais próximo. "Perto" é estrito: o
   mesmo artigo ficou em 1º nos dois braços da busca e faltou só um termo de
   cobertura. Com critério frouxo, "horário da biblioteca" sugeriria
   "Onde acontece a recuperação". */
function artigoProximo(r) {
  const topo = r.resultados[0];
  if (!topo) return null;
  const exigido = r.base.length >= 3 ? 2 : 1;
  const perto = r.coberto >= 1 && r.coberto === exigido - 1 &&
    topo.pos.lex === 1 && topo.pos.sem === 1;
  return perto ? topo.i : null;
}

function temasDaBase() {
  const vistos = [];
  NORMAS.forEach(n => {
    if (DOCUMENTOS[n.doc].situacao === 'vigente' && TEMAS[n.tema] && !vistos.includes(n.tema)) vistos.push(n.tema);
  });
  return vistos.slice(0, 6);
}

const ICONE_INFO = '<svg aria-hidden="true" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>';

function mostrarAbstencao(r) {
  const aviso = el('div', 'aviso-bot aviso-bot--abstencao');
  const icone = el('span', 'aviso-bot__icone');
  icone.innerHTML = ICONE_INFO;
  const corpo = el('div', 'aviso-bot__corpo');
  corpo.append(el('p', 'aviso-bot__texto',
    'Não encontrei essa informação nas normativas indexadas. Procure a secretaria acadêmica do seu campus ou a coordenação do curso.'));

  const proximo = artigoProximo(r);
  if (proximo !== null) {
    corpo.append(el('p', 'aviso-bot__rotulo', 'Talvez você queira saber sobre:'));
    const linha = el('div', 'sugestoes');
    const b = el('button', 'sugestao', NORMAS[proximo].assunto);
    b.type = 'button';
    b.addEventListener('click', () => mostrarArtigo(proximo));
    linha.append(b);
    corpo.append(linha);
  }

  corpo.append(el('p', 'aviso-bot__rotulo', 'Posso ajudar com estes assuntos:'));
  const chips = el('div', 'sugestoes');
  temasDaBase().forEach(tema => {
    const b = el('button', 'sugestao', tema);
    b.type = 'button';
    b.addEventListener('click', () => perguntarDireto(TEMAS[tema]));
    chips.append(b);
  });
  corpo.append(chips);

  aviso.append(icone, corpo);
  entrar(aviso);
  $conversa.append(aviso);
  rolar(aviso);
  $anuncio.textContent = corpo.textContent;
  definirEstado('done');
  $campo.focus({ preventScroll: true });
}

/* ---------- card com digitação ---------- */
async function mostrarResposta(resposta, g, depoisDe) {
  definirEstado('answering', 'Fonte encontrada · ' + (resposta.documentoCurto || resposta.documento));

  const semExplicacao = !resposta.linguagemSimples;
  const textoSimples = resposta.linguagemSimples ||
    'Não foi possível gerar a explicação agora. O texto do artigo acima continua valendo.';

  const { card, oficial, simples, blocoOficial, expandir } = montarCard(resposta);
  /* alturas reservadas desde o início: o fantasma já contém o texto completo */
  oficial.fantasma.textContent = resposta.textoOficial;
  simples.fantasma.textContent = textoSimples;
  entrar(card);
  if (depoisDe && depoisDe.isConnected) {
    /* abaixo do card de origem e dos relacionados que já foram abertos dele */
    let ancora = depoisDe;
    while (ancora.nextElementSibling && ancora.nextElementSibling.dataset.origem === depoisDe.dataset.cartao) {
      ancora = ancora.nextElementSibling;
    }
    card.dataset.origem = depoisDe.dataset.cartao;
    ancora.after(card);
  } else {
    $conversa.append(card);
  }

  /* com o card no DOM e as fontes prontas, decide se o artigo recolhe; a
     reserva de altura passa a ser a recolhida, então não há salto depois */
  if (document.fonts && document.fonts.status !== 'loaded') await document.fonts.ready;
  if (g !== geracao) return;
  const limite = avaliarRecolhimento(blocoOficial, expandir);
  const visiveis = limite ? caracteresVisiveis(oficial.fantasma, limite) : null;
  rolar(card);

  /* leitor de tela recebe o texto completo uma vez só */
  $anuncio.textContent = resposta.documento + '. ' + resposta.artigo + '. ' +
    resposta.textoOficial + ' Em linguagem simples: ' + textoSimples;

  /* pular: clique/toque no card, o botão "Toque para ver tudo" ou Esc */
  const controle = { pular: false };
  const pular = () => { controle.pular = true; };
  digitacaoAtual = pular;
  card.addEventListener('click', pular);

  if (!controle.pular) await esperar(reduzirMovimento ? 0 : 150);
  if (g !== geracao) return;

  /* ritmo máximo de 18 ms (artigo) e 55 ms (linguagem simples) por caractere.
     Artigo recolhido: digita só o que se vê, em até 1 s; o restante entra
     pronto, escondido, e aparece ao expandir. Tetos de 1,4 s e 3,8 s. */
  await digitar(oficial, resposta.textoOficial,
    visiveis ? { msPorChar: 18, teto: 1000, ate: visiveis, controle } : { msPorChar: 18, teto: 1400, controle });
  if (g !== geracao) return;
  if (!controle.pular) await esperar(reduzirMovimento ? 0 : 150);
  if (g !== geracao) return;
  await digitar(simples, textoSimples, { msPorChar: 55, pausaPontuacao: 220, teto: 3800, controle });
  if (g !== geracao) return;
  if (semExplicacao) simples.visivel.classList.add('digitavel--erro');

  digitacaoAtual = null;
  card.removeEventListener('click', pular);
  card.classList.add('card--pronto');
  definirEstado('done');
  $campo.focus({ preventScroll: true });
}

/* ---------- voz (Web Speech API) ----------
   O texto parcial aparece no campo enquanto a pessoa fala. A escuta termina
   sozinha depois de uma pausa (ou num novo clique no microfone) e vai para
   "review", onde a pessoa confere e clica em Perguntar. Se nada foi dito,
   volta ao estado anterior com o motivo na linha de ajuda. */
const Reconhecimento = window.SpeechRecognition || window.webkitSpeechRecognition;
const micIndisponivel = !Reconhecimento;
const PAUSA_FIM_FALA = 1600;
const ERROS_VOZ = {
  'not-allowed': location.protocol === 'file:'
    ? 'O navegador bloqueia o microfone em arquivo aberto direto. Abra pelo Live Server ou digite sua pergunta.'
    : 'O microfone foi bloqueado. Libere a permissão no ícone ao lado do endereço ou digite sua pergunta.',
  'service-not-allowed': 'O navegador bloqueou a voz nesta página. Abra pelo Live Server (http://localhost) ou digite sua pergunta.',
  'audio-capture': 'Nenhum microfone encontrado. Verifique se ele está conectado ou digite sua pergunta.',
  'network': 'A transcrição de voz precisa de internet. Verifique a conexão ou digite sua pergunta.',
  'no-speech': 'Não ouvi nada. Clique no microfone e fale de novo.',
  'language-not-supported': 'Este navegador não transcreve português. Tente no Chrome ou no Edge.'
};
let reconhecedor = null;
let erroVoz = null;
let timerFimFala = null;

function rotularMic(ouvindo) {
  $mic.setAttribute('aria-label', ouvindo ? 'Parar de ouvir' : 'Falar pergunta');
  $mic.setAttribute('aria-pressed', String(ouvindo));
}

function iniciarVoz() {
  erroVoz = null;
  const rec = new Reconhecimento();
  rec.lang = 'pt-BR';
  rec.interimResults = true;
  rec.continuous = true;
  rec.maxAlternatives = 1;

  rec.onresult = e => {
    if (rec !== reconhecedor) return;
    let texto = '';
    for (const res of e.results) texto += res[0].transcript;
    $campo.value = texto.trim();
    autoCrescer();
    clearTimeout(timerFimFala);
    timerFimFala = setTimeout(() => { if (rec === reconhecedor) rec.stop(); }, PAUSA_FIM_FALA);
  };
  rec.onerror = e => { erroVoz = e.error; };
  rec.onend = () => {
    clearTimeout(timerFimFala);
    if (rec !== reconhecedor) return;
    reconhecedor = null;
    rotularMic(false);
    if (estado !== 'listening') return;
    if ($campo.value.trim()) {
      definirEstado('review');
      $enviar.focus({ preventScroll: true });
      return;
    }
    const motivo = erroVoz === 'aborted' ? null
      : (ERROS_VOZ[erroVoz] || ERROS_VOZ['no-speech']);
    definirEstado(temConversa ? 'done' : 'idle', motivo);
  };

  reconhecedor = rec;
  $campo.value = '';
  definirEstado('listening');
  rotularMic(true);
  try {
    rec.start();
  } catch {
    reconhecedor = null;
    rotularMic(false);
    definirEstado(temConversa ? 'done' : 'idle', 'Não foi possível ligar o microfone. Tente de novo em alguns segundos.');
  }
}

function pararVoz(descartar) {
  if (!reconhecedor) return;
  const rec = reconhecedor;
  clearTimeout(timerFimFala);
  if (descartar) {
    reconhecedor = null;
    rotularMic(false);
    try { rec.abort(); } catch {}
  } else {
    try { rec.stop(); } catch {}
  }
}

/* ---------- eventos ---------- */
$mic.addEventListener('click', () => {
  if (estado === 'answering' || micIndisponivel) return;
  if (reconhecedor) pararVoz(false);
  else iniciarVoz();
});

$campo.addEventListener('input', () => {
  autoCrescer();
  if (estado === 'listening') return;
  const temTexto = $campo.value.trim() !== '';
  if (temTexto && estado !== 'review') definirEstado('review');
  else if (!temTexto && estado === 'review') definirEstado(temConversa ? 'done' : 'idle');
});

$campo.addEventListener('keydown', e => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    if (estado === 'review') responderPergunta($campo.value);
  }
});

$lixeira.addEventListener('click', () => {
  $campo.value = '';
  autoCrescer();
  definirEstado(temConversa ? 'done' : 'idle');
  $campo.focus({ preventScroll: true });
});

$enviar.addEventListener('click', e => {
  if (estado !== 'review') return;
  ondulacao($enviar, e);
  responderPergunta($campo.value);
});

document.addEventListener('keydown', e => {
  if (e.key !== 'Escape' || !digitacaoAtual) return;
  if (!document.getElementById('modal-pdf').hidden) return;
  digitacaoAtual();
});

$reiniciar.addEventListener('click', () => {
  geracao++;
  digitacaoAtual = null;
  pararVoz(true);
  if (window.fecharVisorPdf) window.fecharVisorPdf();
  $conversa.innerHTML = '';
  $conversa.hidden = true;
  temConversa = false;
  $hero.hidden = false;
  $hero.classList.remove('hero--saindo');
  $campo.value = '';
  autoCrescer();
  $anuncio.textContent = '';
  definirEstado('idle');
});

/* ---------- estado inicial ---------- */
document.querySelectorAll('#sugestoes-iniciais .sugestao').forEach(b => {
  b.addEventListener('click', () => perguntarDireto(b.textContent));
});
$seloDemo.hidden = !MODO_DEMO;
$rodape.textContent = MODO_DEMO
  ? 'Protótipo acadêmico · Explicações pré-geradas para demonstração · Fonte oficial disponível em cada resposta.'
  : 'Protótipo acadêmico · Fonte oficial disponível em cada resposta.';
if (PARAMS.get('admin') === '1') {
  const exportar = el('button', 'faixa__admin', 'Exportar perguntas');
  exportar.type = 'button';
  exportar.addEventListener('click', exportarNegativos);
  $rodape.append(' · ', exportar);
}
if (micIndisponivel) {
  $mic.title = 'Seu navegador não suporta voz. Digite sua pergunta.';
  $mic.setAttribute('aria-label', 'Falar pergunta (indisponível neste navegador)');
}
definirEstado('idle');
const trocarPlaceholders = () => {
  PLACEHOLDERS = escolherPlaceholders();
  if (estado !== 'review') $campo.placeholder = PLACEHOLDERS[estado] || '';
  autoCrescer();
};
telaEstreita.addEventListener('change', trocarPlaceholders);
telaMuitoEstreita.addEventListener('change', trocarPlaceholders);
addEventListener('resize', autoCrescer);
if (document.fonts) document.fonts.ready.then(autoCrescer);
})();
