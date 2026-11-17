/* Conjunto de perguntas-gabarito do Norma Clara.
   Rode com:  node testes.js

   Cada caso é uma pergunta e o id do artigo que deve vir em primeiro lugar.
   'ABSTENCAO' significa que o sistema deve dizer que não sabe.

   A comparação é pelo id, e não pelo número do artigo, porque o número se
   repete entre documentos: "Art. 74" existe na ODP e na POLAE, "Art. 5º" no
   disciplinar e no docente. Comparando por número, o teste passaria mesmo
   trazendo o artigo certo do documento errado.

   Ao acrescentar artigo ou editar tags, rode isto antes de commitar:
   documento novo pode roubar o resultado de pergunta que já funcionava.

   O motor de busca vive em app.js junto com a interface, que depende do
   navegador. Para rodar fora dele, este arquivo carrega só o trecho de app.js
   anterior ao comentário que separa as duas partes. */

const fs = require('fs');
const path = require('path');

const SEPARADOR = '/* ---------- interface ---------- */';

function carregarMotor() {
  const base = __dirname;
  const normas = fs.readFileSync(path.join(base, 'normas.js'), 'utf8');
  const app = fs.readFileSync(path.join(base, 'app.js'), 'utf8');
  const corte = app.indexOf(SEPARADOR);
  if (corte < 0) {
    throw new Error('Não achei o separador da interface em app.js. ' +
      'Se o comentário mudou, ajuste SEPARADOR aqui.');
  }
  const fonte = normas + '\n' + app.slice(0, corte) + '\n; return { buscar, relacionados, NORMAS, DOCUMENTOS, TEMAS };';
  return new Function(fonte)();
}

const CASOS = [
  // --- Organização Didático-Pedagógica ---
  ['Posso trancar a matricula?', 'odp-110'],
  ['qual o prazo pra reabrir a matricula', 'odp-111'],
  ['quero sair do curso', 'odp-40'],
  ['Faltei na prova, e agora?', 'odp-75'],
  ['quanto tempo tenho pra pedir segunda chamada', 'odp-75'],
  ['Qual a frequência mínima para passar?', 'odp-73-i'],
  ['qual a nota minima pra passar', 'odp-73-ii'],
  ['preciso de atestado pra faltar', 'odp-74'],
  ['passei no conselho de classe?', 'odp-86-87'],
  ['quando o conselho de classe se reune', 'odp-85'],
  ['quem compoe o conselho de classe', 'odp-83'],
  ['posso aproveitar materia que ja fiz?', 'odp-104'],
  ['posso usar o ENEM pra aproveitar disciplina', 'odp-108'],
  ['tem como fazer exame de proficiencia', 'odp-106'],
  ['como recorrer de uma nota', 'odp-89-91'],
  ['posso fazer estagio', 'odp-52'],
  ['o que diz o Art. 75?', 'odp-75'],
  ['o que diz o artigo 110', 'odp-110'],

  // --- Assistência estudantil ---
  ['quem pode receber auxilio', 'polae-30'],
  ['quais sao os tipos de auxilio', 'polae-44'],
  ['como faco pra pedir o auxilio?', 'polae-54'],
  ['Quanto é o auxílio estudantil?', 'polae-65'],
  ['qual o valor do auxilio', 'polae-65'],
  ['perdi a bolsa, por que?', 'polae-74'],
  ['meu pagamento foi suspenso', 'polae-74'],
  ['posso almocar no restaurante', 'polae-47'],

  // --- Disciplinar discente ---
  ['quais sao as punicoes que posso levar', 'disc-8'],
  ['levei uma advertencia, e agora?', 'disc-22'],
  ['tenho quanto tempo pra recorrer da punicao', 'disc-22'],
  ['quem pode me dar advertencia', 'disc-8-5'],
  ['quanto tempo a advertencia fica registrada', 'disc-8-4'],
  ['advertencia fica no historico escolar?', 'disc-19'],
  ['tenho direito de defesa?', 'disc-9'],
  ['o que acontece se eu colar na prova', 'disc-11-ii'],
  ['posso usar celular em sala de aula', 'disc-11-ii'],
  ['quantos dias de suspensao', 'disc-11-iii'],
  ['bullying da suspensao?', 'disc-11-iii'],
  ['briga da expulsao?', 'disc-11-iv'],
  ['o uniforme e obrigatorio?', 'disc-5'],

  // --- Trabalho docente ---
  ['quantas aulas por semana o professor tem que dar', 'doc-27'],
  ['o que e dedicacao exclusiva', 'doc-5-3'],
  ['como mudar de regime de trabalho', 'doc-11'],
  ['qual o prazo pra entregar o PIT', 'doc-21'],
  ['quantas horas de coordenacao de curso', 'doc-42'],
  ['quantas horas pra orientar TCC', 'doc-34'],
  ['o que e RESAD', 'doc-49'],

  // --- Chips de sugestão do estado inicial (index.html) ---
  ['Perdi a prova, e agora?', 'odp-75'],
  ['Posso recorrer de uma advertência?', 'disc-22'],
  ['Quanto é o auxílio estudantil?', 'polae-65'],
  ['Posso trancar o curso?', 'odp-110'],

  // --- Abstenção: perguntas fora do acervo ---
  ['A biblioteca abre no sábado?', 'ABSTENCAO'],
  ['qual o horario do RU', 'ABSTENCAO'],
  ['quanto custa a carteirinha', 'ABSTENCAO'],
  ['quem vence o campeonato brasileiro', 'ABSTENCAO'],
];

function rodar() {
  const { buscar, NORMAS } = carregarMotor();
  const falhas = [];

  const porId = Object.fromEntries(NORMAS.map(n => [n.id, n]));
  const legivel = id => porId[id]
    ? `${porId[id].artigo} — ${porId[id].assunto} (${id})`
    : id;

  for (const [pergunta, esperado] of CASOS) {
    if (esperado !== 'ABSTENCAO' && !porId[esperado]) {
      falhas.push({ pergunta, veio: '—', esperado: `${esperado} (id inexistente em NORMAS)` });
      continue;
    }
    const r = buscar(pergunta, false);
    const veio = (!r.confiante || r.resultados.length === 0)
      ? 'ABSTENCAO'
      : NORMAS[r.resultados[0].i].id;
    if (veio !== esperado) {
      falhas.push({ pergunta, veio: legivel(veio), esperado: legivel(esperado) });
    }
  }

  const ok = CASOS.length - falhas.length;
  console.log(`\n${ok}/${CASOS.length} perguntas trouxeram o artigo esperado em primeiro lugar.`);

  if (falhas.length) {
    console.log('\nFalhas:');
    for (const f of falhas) {
      console.log(`  "${f.pergunta}"`);
      console.log(`     veio: ${f.veio}   esperado: ${f.esperado}`);
    }
    process.exitCode = 1;
  }
  return falhas.length === 0;
}

function integridade() {
  const { NORMAS, DOCUMENTOS, TEMAS, buscar } = carregarMotor();
  const normas = fs.readFileSync(path.join(__dirname, 'normas.js'), 'utf8');
  const { EXPLICACOES } = new Function(normas + '; return { EXPLICACOES };')();
  const ids = NORMAS.map(n => n.id);
  const problemas = [];

  if (ids.length !== new Set(ids).size) problemas.push('há ids duplicados em NORMAS');
  ids.filter(i => !EXPLICACOES[i]).forEach(i => problemas.push(`artigo sem explicação: ${i}`));
  Object.keys(EXPLICACOES).filter(k => !ids.includes(k))
    .forEach(k => problemas.push(`explicação sem artigo correspondente: ${k}`));
  NORMAS.filter(n => !DOCUMENTOS[n.doc])
    .forEach(n => problemas.push(`artigo aponta para documento inexistente: ${n.id}`));
  NORMAS.filter(n => !n.artigo || !n.assunto || !n.texto || !n.tags)
    .forEach(n => problemas.push(`artigo com campo vazio: ${n.id}`));
  Object.entries(DOCUMENTOS).filter(([, d]) => d.link.includes('/view'))
    .forEach(([k]) => problemas.push(`link com /view, não entrega o PDF direto: ${k}`));

  // Temas: todo artigo tem um, e a pergunta-exemplo de cada tema (usada nos
  // chips da abstenção) precisa trazer um artigo do próprio tema.
  NORMAS.filter(n => !TEMAS[n.tema])
    .forEach(n => problemas.push(`artigo sem tema conhecido: ${n.id} (${n.tema})`));
  for (const [tema, pergunta] of Object.entries(TEMAS)) {
    const r = buscar(pergunta, false);
    const veio = r.confiante && r.resultados.length ? NORMAS[r.resultados[0].i] : null;
    if (!veio || veio.tema !== tema) {
      problemas.push(`pergunta-exemplo do tema "${tema}" não traz artigo do tema: "${pergunta}" → ${veio ? veio.id : 'abstenção'}`);
    }
  }

  const vigentes = NORMAS.filter(n => DOCUMENTOS[n.doc].situacao === 'vigente').length;
  const docs = Object.values(DOCUMENTOS).filter(d => d.situacao === 'vigente').length;
  console.log(`Base: ${vigentes} artigos vigentes em ${docs} documentos, ` +
    `${NORMAS.filter(n => n.tipo === 'literal').length} com texto oficial.`);

  if (problemas.length) {
    console.log('\nProblemas de integridade:');
    problemas.forEach(p => console.log('  - ' + p));
    process.exitCode = 1;
  } else {
    console.log('Integridade: tudo certo.');
  }
  return problemas.length === 0;
}

/* Em quantas respostas o bloco "Outros artigos relacionados" teria itens.
   Meta: pelo menos metade das perguntas-gabarito. */
function relacionadosNasRespostas() {
  const { buscar, relacionados, NORMAS } = carregarMotor();
  let respostas = 0, comBloco = 0;
  for (const [pergunta] of CASOS) {
    const r = buscar(pergunta, false);
    if (!r.confiante || !r.resultados.length) continue;
    respostas++;
    const lista = relacionados(r);
    if (lista.some(i => i === r.resultados[0].i || NORMAS[i].tema !== NORMAS[r.resultados[0].i].tema)) {
      console.log(`  relacionado fora do tema ou repetido em "${pergunta}"`);
      process.exitCode = 1;
    }
    if (lista.length) comBloco++;
  }
  const meta = Math.ceil(CASOS.length / 2);
  console.log(`Relacionados: o bloco aparece em ${comBloco} de ${respostas} respostas ` +
    `(${comBloco}/${CASOS.length} perguntas; meta: ${meta}).`);
  if (comBloco < meta) process.exitCode = 1;
}

integridade();
rodar();
relacionadosNasRespostas();
