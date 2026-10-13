/* Protótipo de busca em normativas — RAG sem LLM.
   Dois braços de busca (palavra exata e significado) fundidos por RRF,
   como na arquitetura proposta. O LLM entra na versão final; aqui a
   resposta é o próprio texto do artigo recuperado. */

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
    candidatos.forEach(c => {
      c.cobertura = cob[c.i].score;
      c.rerank = 0.65 * (c.rrf / tetoRrf) + 0.35 * (c.cobertura / tetoCob);
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

/* ---------- interface ---------- */
const $conversa = document.getElementById('conversa');
const $form = document.getElementById('form-pergunta');
const $campo = document.getElementById('campo-pergunta');
const $revogadas = document.getElementById('incluir-revogadas');
const reduzirMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function el(tag, cls, txt) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (txt != null) e.textContent = txt;
  return e;
}

function cartaoNorma(indice, principal) {
  const n = NORMAS[indice], d = DOCUMENTOS[n.doc];
  const card = el('article', 'norma' + (principal ? ' norma--principal' : ''));

  const topo = el('header', 'norma__topo');
  topo.append(el('span', 'norma__artigo', n.artigo), el('span', 'norma__doc', d.sigla));
  if (d.situacao === 'revogada') topo.append(el('span', 'selo selo--revogada', 'revogada'));
  card.append(topo);

  card.append(el('h3', 'norma__assunto', n.assunto));
  card.append(el('p', 'norma__texto', n.texto));

  const rodape = el('footer', 'norma__rodape');
  rodape.append(el('span', 'norma__resolucao', d.resolucao));
  const link = el('a', 'norma__link', 'Abrir o PDF oficial');
  link.href = d.link; link.target = '_blank'; link.rel = 'noopener';
  rodape.append(link);
  card.append(rodape);
  return card;
}

function painelBusca(r) {
  const det = el('details', 'painel');
  det.append(el('summary', 'painel__titulo', 'Como o sistema encontrou isso'));

  const corpo = el('div', 'painel__corpo');
  const termos = el('p', 'painel__linha');
  termos.append(el('span', 'painel__rotulo', 'Termos buscados'));
  termos.append(el('span', 'painel__valor', r.base.join(', ') || '—'));
  corpo.append(termos);

  const extras = r.extras;
  if (extras.length) {
    const exp = el('p', 'painel__linha');
    exp.append(el('span', 'painel__rotulo', 'Expansão por significado'));
    exp.append(el('span', 'painel__valor', [...new Set(extras)].join(', ')));
    corpo.append(exp);
  }

  const tabela = el('table', 'ranking');
  const thead = el('thead');
  const trh = el('tr');
  ['Artigo', 'Palavra exata', 'Significado', 'Referência', 'RRF', 'Rerank'].forEach(h => trh.append(el('th', null, h)));
  thead.append(trh); tabela.append(thead);

  const tbody = el('tbody');
  r.resultados.forEach(res => {
    const tr = el('tr');
    tr.append(el('td', 'ranking__artigo', NORMAS[res.i].artigo));
    tr.append(el('td', 'num', res.pos.lex ? '#' + res.pos.lex : '—'));
    tr.append(el('td', 'num', res.pos.sem ? '#' + res.pos.sem : '—'));
    tr.append(el('td', 'num', res.pos.ref ? '#' + res.pos.ref : '—'));
    tr.append(el('td', 'num', res.rrf.toFixed(4)));
    tr.append(el('td', 'num', res.rerank != null ? res.rerank.toFixed(3) : '—'));
    tbody.append(tr);
  });
  tabela.append(tbody);

  const rolagem = el('div', 'ranking__rolagem');
  rolagem.append(tabela);
  corpo.append(rolagem);

  if (r.descartadas.length) {
    const aviso = el('p', 'painel__aviso',
      r.descartadas.length + ' trecho(s) de norma revogada foram encontrados e descartados pelo filtro de vigência.');
    corpo.append(aviso);
  }

  det.append(corpo);
  return det;
}

function mensagem(lado, conteudo) {
  const bolha = el('div', 'msg msg--' + lado);
  if (typeof conteudo === 'string') bolha.append(el('p', 'msg__texto', conteudo));
  else bolha.append(conteudo);
  $conversa.append(bolha);
  bolha.scrollIntoView({ behavior: reduzirMovimento ? 'auto' : 'smooth', block: 'end' });
  return bolha;
}

function responder(pergunta) {
  const r = buscar(pergunta, $revogadas.checked);
  const corpo = el('div');

  if (!r.confiante || r.resultados.length === 0) {
    corpo.append(el('p', 'msg__texto',
      'Não encontrei essa informação nas normativas indexadas. Procure a secretaria acadêmica do seu campus ou a coordenação do curso.'));
    const vig = NORMAS.filter(n => DOCUMENTOS[n.doc].situacao === 'vigente').length;
    corpo.append(el('p', 'msg__nota',
      'Responder "não sei" em vez de inventar é uma regra do sistema: ' + vig +
      ' artigos de 2 documentos estão indexados, e nada fora disso é usado como fonte.'));
    corpo.append(painelBusca(r));
    mensagem('bot', corpo);
    return;
  }

  const principal = r.resultados[0];
  corpo.append(el('p', 'msg__texto', 'Isto é o que diz ' + NORMAS[principal.i].artigo +
    ' do ' + DOCUMENTOS[NORMAS[principal.i].doc].sigla + ':'));
  corpo.append(cartaoNorma(principal.i, true));

  const outros = r.resultados.slice(1, 3);
  if (outros.length) {
    corpo.append(el('p', 'msg__sub', 'Artigos relacionados'));
    const lista = el('div', 'relacionados');
    outros.forEach(o => lista.append(cartaoNorma(o.i, false)));
    corpo.append(lista);
  }

  corpo.append(painelBusca(r));
  mensagem('bot', corpo);
}

function perguntar(texto) {
  const p = texto.trim();
  if (!p) return;
  mensagem('eu', p);
  $campo.value = '';
  const pensando = mensagem('bot', el('p', 'msg__pensando', 'Buscando nas normativas…'));
  setTimeout(() => { pensando.remove(); responder(p); }, reduzirMovimento ? 0 : 420);
}

$form.addEventListener('submit', e => { e.preventDefault(); perguntar($campo.value); });
document.querySelectorAll('.sugestao').forEach(b => {
  b.addEventListener('click', () => perguntar(b.textContent));
});

/* estatísticas do cabeçalho */
const vigentes = NORMAS.filter(n => DOCUMENTOS[n.doc].situacao === 'vigente').length;
document.getElementById('stat-artigos').textContent = vigentes;
document.getElementById('stat-docs').textContent =
  Object.values(DOCUMENTOS).filter(d => d.situacao === 'vigente').length;