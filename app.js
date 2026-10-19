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
const $revogadas = document.getElementById('incluir-revogadas');
const reduzirMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* Explicação em linguagem simples. Com CONFIG_IA.endpoint definido, o trecho
   do artigo é enviado ao modelo por POST { pergunta, documento, artigo, texto }
   e a resposta esperada é { explicacao }. Sem endpoint, usa as explicações
   pré-geradas de EXPLICACOES (normas.js). */
const CONFIG_IA = { endpoint: null };

async function explicar(indice, pergunta) {
  const n = NORMAS[indice];
  if (!CONFIG_IA.endpoint) return EXPLICACOES[n.id] || null;
  const resp = await fetch(CONFIG_IA.endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pergunta, documento: DOCUMENTOS[n.doc].nome, artigo: n.artigo, texto: n.texto })
  });
  if (!resp.ok) throw new Error('HTTP ' + resp.status);
  return (await resp.json()).explicacao || null;
}

function el(tag, cls, txt) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (txt != null) e.textContent = txt;
  return e;
}

function linkPdf(d, cls, rotulo, baixar) {
  const a = el('a', cls, rotulo);
  a.href = d.link; a.target = '_blank'; a.rel = 'noopener';
  // "download" só é respeitado na mesma origem; para o portal do IFTO o
  // navegador abre o PDF, de onde ele pode ser salvo.
  if (baixar) a.setAttribute('download', '');
  return a;
}

/* Ordem fixa do cartão: normativa + PDF, artigo, texto do artigo, explicação.
   A explicação só existe depois do texto e nunca o substitui. */
function cartaoNorma(indice, opcoes = {}) {
  const n = NORMAS[indice], d = DOCUMENTOS[n.doc];
  const card = el('article', 'norma' + (opcoes.principal ? ' norma--principal' : ''));

  const cabecalho = el('header', 'norma__cabecalho');
  const linhaDoc = el('div', 'norma__linha-doc');
  linhaDoc.append(el('h3', 'norma__nome', d.nome));
  const abrir = linkPdf(d, 'norma__pdf', 'Abrir PDF');
  abrir.setAttribute('aria-label', 'Abrir o PDF de ' + d.nome);
  linhaDoc.append(abrir);
  cabecalho.append(linhaDoc);

  const linhaArt = el('p', 'norma__linha-artigo');
  linhaArt.append(el('span', 'norma__artigo', n.artigo), el('span', 'norma__assunto', n.assunto));
  if (d.situacao === 'revogada') linhaArt.append(el('span', 'selo selo--revogada', 'revogada'));
  cabecalho.append(linhaArt);
  card.append(cabecalho);

  const trecho = el('section', 'norma__bloco');
  trecho.append(el('p', 'norma__rotulo', 'Texto do artigo'));
  trecho.append(el('blockquote', 'norma__texto', n.texto));
  card.append(trecho);

  if (opcoes.explicar) {
    const bloco = el('section', 'norma__bloco norma__explicacao');
    bloco.append(el('p', 'norma__rotulo', 'Em linguagem simples · explicação gerada por IA'));
    const corpo = el('p', 'norma__explicacao-texto msg__pensando', 'Gerando explicação…');
    bloco.append(corpo);
    card.append(bloco);
    explicar(indice, opcoes.pergunta).then(txt => {
      if (!txt) { bloco.remove(); return; }
      corpo.className = 'norma__explicacao-texto';
      corpo.textContent = txt;
    }).catch(() => {
      corpo.className = 'norma__explicacao-texto norma__explicacao-erro';
      corpo.textContent = 'Não foi possível gerar a explicação agora. O texto do artigo acima continua valendo.';
    });
  }

  const rodape = el('footer', 'norma__rodape');
  rodape.append(el('span', 'norma__resolucao', d.resolucao));
  rodape.append(linkPdf(d, 'norma__link', 'Baixar PDF', true));
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
  corpo.append(cartaoNorma(principal.i, { principal: true, explicar: true, pergunta }));

  const outros = r.resultados.slice(1, 3);
  if (outros.length) {
    corpo.append(el('p', 'msg__sub', 'Artigos relacionados'));
    const lista = el('div', 'relacionados');
    outros.forEach(o => lista.append(cartaoNorma(o.i)));
    corpo.append(lista);
  }

  corpo.append(painelBusca(r));
  mensagem('bot', corpo);
}

function perguntar(texto) {
  const p = texto.trim();
  if (!p) return;
  mensagem('eu', p);
  const pensando = mensagem('bot', el('p', 'msg__pensando', 'Buscando nas normativas…'));
  setTimeout(() => { pensando.remove(); responder(p); }, reduzirMovimento ? 0 : 420);
}

document.querySelectorAll('.sugestao').forEach(b => {
  b.addEventListener('click', () => perguntar(b.textContent));
});

/* ---------- entrada por voz ----------
   Web Speech API em pt-BR. A transcrição fica visível e só é enviada quando o
   usuário confirma em "Perguntar"; se saiu errada, ele grava de novo ou descarta.
   Estados em #voz[data-estado]: pronto, gravando, revisao, indisponivel. */
const $voz = document.getElementById('voz');
const $gravar = document.getElementById('btn-gravar');
const $gravarRotulo = document.getElementById('btn-gravar-rotulo');
const $dica = document.getElementById('transcricao-dica');
const $transcricao = document.getElementById('transcricao-texto');
const $descartar = document.getElementById('btn-descartar');
const $enviar = document.getElementById('btn-enviar');
const $erroVoz = document.getElementById('erro-voz');

const DICAS = {
  pronto: 'Toque no microfone e faça sua pergunta em voz alta.',
  gravando: 'Ouvindo… fale sua pergunta e toque de novo para parar.',
  indisponivel: 'Entrada por voz indisponível. Use as sugestões acima.'
};
const ERROS_VOZ = {
  'not-allowed': 'O acesso ao microfone foi negado. Libere a permissão no ícone ao lado do endereço da página e tente de novo.',
  'service-not-allowed': 'O navegador bloqueou o reconhecimento de voz nesta página. Abra o sistema por http://localhost (Live Server) ou https e libere o microfone.',
  'audio-capture': 'Nenhum microfone foi encontrado. Verifique se ele está conectado e não está em uso por outro programa.',
  'no-speech': 'Não ouvi nada. Toque no microfone e fale um pouco mais perto dele.',
  'network': 'A transcrição precisa de internet e a conexão falhou. Verifique a rede e tente de novo.',
  'language-not-supported': 'Este navegador não transcreve português. Tente no Chrome ou no Edge.',
  'sem-texto': 'Não consegui entender a pergunta. Tente gravar de novo, falando devagar.'
};

const Reconhecimento = window.SpeechRecognition || window.webkitSpeechRecognition;
let reconhecedor = null, textoFinal = '', erroAtual = null;

function mostrarErro(msg) {
  $erroVoz.textContent = msg || '';
  $erroVoz.hidden = !msg;
}

function definirEstado(estado) {
  $voz.dataset.estado = estado;
  const gravando = estado === 'gravando';
  $gravar.setAttribute('aria-pressed', String(gravando));
  $gravarRotulo.textContent = gravando ? 'Parar gravação' : (estado === 'revisao' ? 'Gravar de novo' : 'Gravar pergunta');
  $gravar.disabled = estado === 'indisponivel';
  $enviar.disabled = estado !== 'revisao';
  $descartar.hidden = estado !== 'revisao';
  const temTexto = estado === 'gravando' ? $transcricao.textContent !== '' : estado === 'revisao';
  $transcricao.hidden = !temTexto;
  $dica.hidden = temTexto;
  if (DICAS[estado]) $dica.textContent = DICAS[estado];
}

function limparTranscricao() {
  textoFinal = '';
  $transcricao.textContent = '';
  definirEstado('pronto');
}

function iniciarGravacao() {
  mostrarErro(null);
  textoFinal = ''; erroAtual = null;
  $transcricao.textContent = '';
  reconhecedor = new Reconhecimento();
  reconhecedor.lang = 'pt-BR';
  reconhecedor.interimResults = true;
  reconhecedor.continuous = false;
  reconhecedor.maxAlternatives = 1;

  reconhecedor.onresult = e => {
    let parcial = '';
    textoFinal = '';
    for (const res of e.results) {
      if (res.isFinal) textoFinal += res[0].transcript;
      else parcial += res[0].transcript;
    }
    $transcricao.textContent = (textoFinal + parcial).trim();
    $transcricao.hidden = false; $dica.hidden = true;
  };
  reconhecedor.onerror = e => { erroAtual = e.error; };
  reconhecedor.onend = () => {
    reconhecedor = null;
    const texto = (textoFinal || $transcricao.textContent).trim();
    if (texto) {
      $transcricao.textContent = texto;
      definirEstado('revisao');
      $enviar.focus();
      return;
    }
    $transcricao.textContent = '';
    definirEstado('pronto');
    if (erroAtual !== 'aborted') mostrarErro(ERROS_VOZ[erroAtual] || ERROS_VOZ['sem-texto']);
  };

  try {
    reconhecedor.start();
    definirEstado('gravando');
  } catch {
    reconhecedor = null;
    definirEstado('pronto');
    mostrarErro('Não foi possível iniciar a gravação. Tente de novo em alguns segundos.');
  }
}

$gravar.addEventListener('click', () => {
  if (reconhecedor) reconhecedor.stop();
  else iniciarGravacao();
});
$descartar.addEventListener('click', () => { mostrarErro(null); limparTranscricao(); $gravar.focus(); });
$enviar.addEventListener('click', () => {
  const texto = $transcricao.textContent;
  mostrarErro(null);
  limparTranscricao();
  perguntar(texto);
});

if (!Reconhecimento) {
  definirEstado('indisponivel');
  mostrarErro('Este navegador não transcreve voz. Use o Chrome, o Edge ou o Safari atualizados, ou toque numa das sugestões acima.');
} else {
  definirEstado('pronto');
}

/* ---------- download das normativas ---------- */
const $baixar = document.getElementById('baixar');
const $baixarLista = document.getElementById('baixar-lista');
Object.values(DOCUMENTOS)
  .sort((a, b) => (a.situacao === 'revogada') - (b.situacao === 'revogada'))
  .forEach(d => {
    const li = el('li');
    const a = linkPdf(d, 'baixar__item', null, true);
    a.append(el('span', 'baixar__nome', d.nome), el('span', 'baixar__meta', d.resolucao));
    if (d.situacao === 'revogada') a.append(el('span', 'selo selo--revogada', 'revogada'));
    li.append(a);
    $baixarLista.append(li);
  });
document.addEventListener('click', e => { if ($baixar.open && !$baixar.contains(e.target)) $baixar.open = false; });
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && $baixar.open) { $baixar.open = false; $baixar.querySelector('summary').focus(); }
});

/* estatísticas do cabeçalho */
const vigentes = NORMAS.filter(n => DOCUMENTOS[n.doc].situacao === 'vigente').length;
document.getElementById('stat-artigos').textContent = vigentes;
document.getElementById('stat-docs').textContent =
  Object.values(DOCUMENTOS).filter(d => d.situacao === 'vigente').length;