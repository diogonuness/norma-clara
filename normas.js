/* Base de normas do protótipo.
   Os textos são SÍNTESES fiéis de cada artigo, escritas para o protótipo.
   O texto oficial está no PDF indicado em "link".
   Para trocar por texto literal, basta substituir o campo "texto". */

const DOCUMENTOS = {
  odp: {
    nome: 'Regulamento da Organização Didático-Pedagógica dos Cursos Técnicos Presenciais',
    sigla: 'ODP Presencial',
    resolucao: 'Resolução nº 38/2013/CONSUP/IFTO, convalidada pela Resolução nº 23/2015',
    data: '2015-06-25',
    situacao: 'vigente',
    link: 'https://www.ifto.edu.br/ifto/colegiados/consup/documentos-aprovados/regulamentos/cursos-tecnicos/regulamento-odp-cursos-medio-tecnico-presenciais-ifto-2edicao.pdf'
  },
  polae: {
    nome: 'Política de Assistência Estudantil do IFTO',
    sigla: 'POLAE',
    resolucao: 'Resolução nº 24/2020/CONSUP/IFTO, de 13 de agosto de 2020',
    data: '2020-08-13',
    situacao: 'vigente',
    link: 'https://portal.ifto.edu.br/ifto/reitoria/pro-reitorias/proae/assistencia-estudantil/programa-de-assistencia-estudantil/politica-de-assistencia-estudantil.pdf'
  },
  odp1: {
    nome: 'Regulamento da Organização Didático-Pedagógica dos Cursos Técnicos Presenciais — 1ª edição',
    sigla: 'ODP 1ª ed.',
    resolucao: 'Revogada pela Resolução Consup nº 23/2015',
    data: '2015-06-25',
    situacao: 'revogada',
    link: 'https://www.ifto.edu.br/ifto/colegiados/consup/documentos-aprovados/regulamentos/cursos-tecnicos/regulamento-odp-cursos-tecnicos-presenciais-ifto-1edicao.pdf'
  }
};

const NORMAS = [
  { id:'odp-73-i', doc:'odp', artigo:'Art. 73, I', assunto:'Frequência mínima para aprovação',
    texto:'Para ser aprovado, o estudante precisa ter frequência mínima de 75% (setenta e cinco por cento) da carga horária total do período letivo.',
    tags:'frequencia falta faltar presenca quantas faltas posso ter limite de faltas frequencia minima pra passar passar de ano aprovacao reprovacao por falta percentual minimo 75 carga horaria' },

  { id:'odp-73-ii', doc:'odp', artigo:'Art. 73, II', assunto:'Nota mínima para aprovação',
    texto:'Para ser aprovado, o estudante precisa obter média final igual ou superior a 6,0 (seis) pontos em TODOS os componentes curriculares.',
    tags:'nota media minima aprovacao aprovado passar seis 6,0 todos componentes disciplina materia' },

  { id:'odp-71-pu', doc:'odp', artigo:'Art. 71, parágrafo único', assunto:'Como se calcula a média final',
    texto:'A média final é a média aritmética simples das médias obtidas nos bimestres ou trimestres do período letivo.',
    tags:'media final calculo como calcula aritmetica bimestre trimestre nota soma' },

  { id:'odp-74', doc:'odp', artigo:'Art. 74', assunto:'Abono de faltas',
    texto:'A frequência às aulas é obrigatória. O abono de faltas só é permitido nos casos expressamente previstos em lei.',
    tags:'abono de falta justificar atestado abonar ausencia obrigatoria lei' },

  { id:'odp-12-viii', doc:'odp', artigo:'Art. 12, VIII', assunto:'Notificação por excesso de faltas',
    texto:'Quando as faltas do estudante ultrapassam 12,5% da carga horária, a instituição deve notificar os órgãos de proteção, nos termos da legislação.',
    tags:'excesso falta notificacao conselho tutelar orgao protecao 12,5 por cento infrequencia' },

  { id:'odp-75', doc:'odp', artigo:'Art. 75', assunto:'Segunda chamada de avaliação',
    texto:'O estudante que faltar a uma verificação de aprendizagem ou deixar de entregar trabalho pode requerer nova oportunidade à Direção ou Gerência de Ensino, em até 72 horas úteis após o término do afastamento. O deferimento depende de comprovação do impedimento. O parágrafo único, incisos I a XI, lista as hipóteses aceitas, entre elas problema de saúde, serviço militar, exercício do voto, convocação judicial ou eleitoral e compromisso de trabalho justificado.',
    tags:'segunda chamada perdi prova faltei avaliacao reposicao prazo 72 horas requerer atestado trabalho nao entregue' },

  { id:'odp-80', doc:'odp', artigo:'Art. 80', assunto:'Recuperação paralela',
    texto:'A recuperação é paralela e contínua. O §2º determina que o professor ofereça recuperação a quem tiver nota inferior a 6,0 nas etapas intermediárias do período letivo. Pelo §3º, se a nota da recuperação for maior que a anterior, ela substitui a nota inferior.',
    tags:'recuperacao paralela continua nota baixa reforco refazer substituir nota bimestre' },

  { id:'odp-81', doc:'odp', artigo:'Art. 81', assunto:'Onde acontece a recuperação',
    texto:'A recuperação pode ocorrer em sala de aula ou nos horários de atendimento do professor.',
    tags:'recuperacao onde horario atendimento professor sala de aula monitoria' },

  { id:'odp-83', doc:'odp', artigo:'Art. 83', assunto:'Quem compõe o conselho de classe',
    texto:'O conselho de classe é composto pela Direção ou Gerência de Ensino, pelos professores da turma, por um representante dos estudantes, pelo coordenador de curso ou de área e por um representante da equipe técnico-pedagógica.',
    tags:'conselho de classe composicao quem participa representante estudante coordenador' },

  { id:'odp-85', doc:'odp', artigo:'Art. 85', assunto:'Quando o conselho de classe se reúne',
    texto:'O conselho de classe reúne-se ordinariamente ao final de cada etapa do período letivo e, excepcionalmente, quando convocado.',
    tags:'conselho de classe reuniao quando final bimestre etapa convocacao' },

  { id:'odp-86-87', doc:'odp', artigo:'Art. 86 e Art. 87', assunto:'Conselho de classe e o aluno com média abaixo de 6,0',
    texto:'Ao final do período letivo, o conselho de classe analisa a situação dos estudantes com média inferior a 6,0. O conselho pode considerar aprovado o estudante cuja média global seja igual ou superior a 5,0 e/ou que esteja abaixo de 6,0 em até 50% do total de componentes curriculares.',
    tags:'conselho de classe passei no conselho aprovado pelo conselho aprovar passar media global 5,0 metade componentes reprovado' },

  { id:'odp-110', doc:'odp', artigo:'Art. 110', assunto:'Trancamento de matrícula',
    texto:'O trancamento de matrícula é concedido em casos como convocação para o serviço militar, tratamento de saúde prolongado, gravidez com atestado médico e acompanhamento de cônjuge ou parente de primeiro grau em tratamento de saúde. Pelo §2º, o trancamento é vedado no primeiro ano, semestre ou módulo do curso, salvo as exceções previstas em lei.',
    tags:'trancar trancamento matricula posso trancar quero trancar pausar parar o curso afastar servico militar gravidez saude primeiro ano' },

  { id:'odp-111', doc:'odp', artigo:'Art. 111', assunto:'Prazo para reabrir a matrícula trancada',
    texto:'A matrícula trancada que não for reaberta em até dois semestres letivos é cancelada.',
    tags:'trancamento prazo reabrir voltar retorno dois semestres cancelada perder vaga' },

  { id:'odp-40', doc:'odp', artigo:'Art. 40', assunto:'Cancelamento da matrícula',
    texto:'A matrícula é cancelada, entre outros casos, quando: o próprio estudante solicita; o curso não é concluído no prazo máximo; há documento falso ou adulterado; há infração disciplinar passível de expulsão; a matrícula não é efetivada nos prazos; o estudante estrangeiro está em situação irregular; ou a matrícula trancada não é reaberta. O §2º assegura ampla defesa e o retorno apenas por novo processo seletivo.',
    tags:'cancelamento cancelar matricula quero sair do curso desistir largar o curso abandonar desligamento desligado expulsao perder a vaga voltar processo seletivo' },

  { id:'odp-104', doc:'odp', artigo:'Art. 104', assunto:'Como pedir aproveitamento de estudos',
    texto:'O aproveitamento de estudos é solicitado por requerimento dirigido à Direção ou Gerência de Ensino.',
    tags:'aproveitamento de estudos requerimento aproveitar disciplina ja cursada aproveitar materia onde entregar o requerimento' },

  { id:'odp-105', doc:'odp', artigo:'Art. 105', assunto:'Quem analisa o aproveitamento de estudos',
    texto:'A coordenação do curso ou a coordenação técnico-pedagógica analisa o mérito do pedido. Pelo §2º, o resultado pode ser aproveitamento total, aproveitamento parcial com indicação de complementação, ou indeferimento.',
    tags:'aproveitamento analise coordenacao resultado total parcial indeferido complementacao' },

  { id:'odp-106', doc:'odp', artigo:'Art. 106', assunto:'Exame de proficiência',
    texto:'Havendo dúvida sobre a equivalência dos estudos, pode ser aplicado exame teórico-prático de proficiência.',
    tags:'exame de proficiencia equivalencia duvida teorico pratico avaliar conhecimento' },

  { id:'odp-108', doc:'odp', artigo:'Art. 108', assunto:'Aproveitamento de certificados do ENEM',
    texto:'Certificados obtidos por meio do ENEM também podem ser objeto de aproveitamento de estudos.',
    tags:'enem certificado aproveitamento exame nacional ensino medio' },

  { id:'odp-109', doc:'odp', artigo:'Art. 109', assunto:'Aproveitamento para quem foi reprovado',
    texto:'O estudante reprovado pode aproveitar os componentes curriculares em que obteve êxito.',
    tags:'reprovado repetir ano aproveitar materias que passei exito refazer serie' },

  { id:'odp-89-91', doc:'odp', artigo:'Art. 89, I e Art. 91, §2º', assunto:'Revisão de nota e de situação final',
    texto:'Esgotadas as possibilidades de revisão junto ao professor, o estudante reprovado tem direito a ampla defesa e contraditório por meio de processo de revisão de situação final. Deferida a revisão, a alteração é feita pelo professor titular ou, se ele estiver impedido, pelo coordenador do curso.',
    tags:'revisao de nota recorrer recurso contestar nota reprovado situacao final ampla defesa' },

  { id:'odp-52', doc:'odp', artigo:'Art. 52', assunto:'Estágio na carga horária do curso',
    texto:'O estágio integra a carga horária do curso conforme definido no Projeto Pedagógico do Curso (PPC).',
    tags:'estagio carga horaria ppc projeto pedagogico obrigatorio curso tecnico' },

  { id:'odp-78-9', doc:'odp', artigo:'Art. 78, §9º, I', assunto:'Regime domiciliar e estágio',
    texto:'Não cabe regime de exercício domiciliar ao estudante que esteja impossibilitado de frequentar apenas os estágios.',
    tags:'regime domiciliar exercicio domiciliar atestado longo estagio afastamento aula em casa' },

  { id:'polae-30', doc:'polae', artigo:'Art. 30', assunto:'Quem pode receber auxílio estudantil',
    texto:'Podem receber os auxílios do eixo de serviços essenciais os estudantes regularmente matriculados e frequentes no ensino médio (integrado, subsequente, concomitante e PROEJA) e no ensino superior, que estejam em situação de vulnerabilidade.',
    tags:'quem pode receber auxilio bolsa assistencia estudantil requisito matriculado frequente vulnerabilidade ensino medio integrado' },

  { id:'polae-44', doc:'polae', artigo:'Art. 44', assunto:'Tipos de auxílio oferecidos',
    texto:'O eixo de serviços essenciais abrange as áreas de moradia, alimentação, transporte, material didático, auxílio emergencial e cuidadores.',
    tags:'tipos de auxilio quais bolsas moradia alimentacao transporte material didatico emergencial cuidador lista' },

  { id:'polae-54', doc:'polae', artigo:'Art. 54', assunto:'Como se inscrever no auxílio',
    texto:'A seleção exige inscrição, entrega de documentação, avaliação socioeconômica realizada por assistente social, entrevista ou visita domiciliar, e o atendimento aos critérios definidos no edital.',
    tags:'como se inscrever como pedir o auxilio como solicitar bolsa inscricao auxilio documentacao edital assistente social entrevista visita domiciliar selecao' },

  { id:'polae-59', doc:'polae', artigo:'Art. 59', assunto:'Indicadores de vulnerabilidade',
    texto:'A avaliação considera 16 indicadores, entre eles a renda per capita (inciso XII), a composição familiar, a condição de moradia, a distância até o campus e os benefícios sociais recebidos.',
    tags:'indicadores criterios vulnerabilidade renda per capita composicao familiar moradia distancia campus bolsa familia' },

  { id:'polae-61', doc:'polae', artigo:'Art. 61', assunto:'Grupos de vulnerabilidade',
    texto:'Os estudantes são classificados em Grupo 1 (baixa vulnerabilidade), Grupo 2 (média vulnerabilidade) e Grupo 3 (alta vulnerabilidade).',
    tags:'grupo 1 2 3 classificacao vulnerabilidade alta media baixa faixa' },

  { id:'polae-65', doc:'polae', artigo:'Art. 65', assunto:'Valor do auxílio por grupo',
    texto:'Os valores são definidos como percentual do salário mínimo: Grupo 3 de 40% a 50%, Grupo 2 de 30% a 40% e Grupo 1 de 20% a 30%.',
    tags:'valor do auxilio quanto recebe percentual salario minimo grupo faixa quanto paga' },

  { id:'polae-66', doc:'polae', artigo:'Art. 66', assunto:'Auxílio emergencial',
    texto:'O auxílio emergencial pode chegar a 150% do salário mínimo e ser concedido até três vezes no ano letivo, mediante parecer de assistente social.',
    tags:'auxilio emergencial emergencia urgente quantas vezes ano parecer assistente social 150' },

  { id:'polae-47', doc:'polae', artigo:'Art. 47', assunto:'Subsídio de refeição',
    texto:'O subsídio da refeição no restaurante pode ser de até 100% para estudantes com renda prioritária e de até 50% para os demais.',
    tags:'refeicao restaurante almoco subsidio alimentacao desconto comida' },

  { id:'polae-71', doc:'polae', artigo:'Art. 71', assunto:'Frequência exigida de quem recebe auxílio',
    texto:'O estudante beneficiário deve manter frequência mensal global mínima de 75% e/ou rendimento acadêmico satisfatório.',
    tags:'frequencia para manter o auxilio 75 rendimento beneficiario requisito mensal' },

  { id:'polae-73', doc:'polae', artigo:'Art. 73', assunto:'Obrigações de quem recebe auxílio',
    texto:'O beneficiário deve informar mudanças na sua situação de vulnerabilidade, manter o desempenho mínimo, comunicar transferência ou saída, comparecer aos atendimentos para os quais for convocado, devolver valores recebidos indevidamente por GRU, ter conta bancária em seu próprio nome e prestar contas.',
    tags:'obrigacoes deveres beneficiario conta bancaria devolver dinheiro gru prestar contas comunicar mudanca' },

  { id:'polae-74', doc:'polae', artigo:'Art. 74', assunto:'Suspensão do pagamento do auxílio',
    texto:'O pagamento do mês é suspenso quando a frequência do mês anterior for inferior a 75%, salvo justificativa prevista em lei.',
    tags:'suspensao corte do auxilio perdi a bolsa nao recebi pagamento suspenso falta frequencia' },

  { id:'polae-68', doc:'polae', artigo:'Art. 68', assunto:'Renovação do auxílio',
    texto:'Para voltar a receber, o estudante precisa ter aproveitado pelo menos 50% das disciplinas e não ter sido reprovado por faltas.',
    tags:'renovar renovacao auxilio voltar a receber ano seguinte 50 por cento disciplinas reprovado por falta' },

  { id:'polae-92-99', doc:'polae', artigo:'Art. 92 e Art. 99', assunto:'Programa Auxílio-Viagem',
    texto:'O eixo universal inclui o Programa Auxílio-Viagem, destinado a apoiar a participação de estudantes em atividades fora do campus.',
    tags:'auxilio viagem evento competicao jice participar fora do campus apoio deslocamento' },

  { id:'polae-26', doc:'polae', artigo:'Art. 26, parágrafo único', assunto:'Prioridade por renda',
    texto:'Tem prioridade o estudante com renda familiar per capita de até um salário mínimo. Outros artigos da política citam o limite de um salário mínimo e meio, o que gera divergência dentro do próprio documento.',
    tags:'prioridade renda per capita salario minimo limite criterio quem tem preferencia' },

  { id:'odp1-revogada', doc:'odp1', artigo:'Documento inteiro', assunto:'Edição anterior do regulamento (revogada)',
    texto:'Esta é a 1ª edição do Regulamento da Organização Didático-Pedagógica dos cursos técnicos presenciais, revogada pela Resolução Consup nº 23/2015. Não deve ser usada como referência: a versão vigente é a 2ª edição.',
    tags:'regulamento antigo primeira edicao revogada versao anterior 2011 desatualizada' }
];

/* Explicações em linguagem simples, pré-geradas por IA a partir do campo "texto"
   de cada artigo. São usadas quando não há endpoint de IA configurado em app.js
   (CONFIG_IA). A explicação nunca substitui o texto do artigo: a interface sempre
   mostra o texto primeiro e a explicação depois. Ao trocar "texto" pelo texto
   literal, gere de novo a explicação correspondente. */
const EXPLICACOES = {
  'odp-73-i': 'Você precisa estar presente em pelo menos 75% de todas as aulas do período letivo. Se as faltas passarem de um quarto da carga horária, você não cumpre esse requisito de aprovação.',
  'odp-73-ii': 'Você precisa fechar o período com média final 6,0 ou mais em cada componente curricular. Não basta a média geral chegar a 6,0: cada disciplina precisa chegar lá.',
  'odp-71-pu': 'Sua média final é a soma das médias de cada bimestre (ou trimestre) dividida pelo número de etapas. Exemplo: 5,0, 7,0, 6,0 e 8,0 nos quatro bimestres dão média final 6,5.',
  'odp-74': 'Ir às aulas é obrigatório. A falta só pode ser abonada nas situações que a lei prevê expressamente; fora delas, ela conta na sua frequência.',
  'odp-12-viii': 'Se suas faltas passarem de 12,5% da carga horária, a escola é obrigada a avisar os órgãos de proteção previstos em lei, como o Conselho Tutelar. Não é uma punição: é um dever da instituição.',
  'odp-75': 'Se você perdeu uma prova ou não entregou um trabalho, pode pedir uma nova oportunidade à Direção ou Gerência de Ensino. O prazo é de até 72 horas úteis depois que o motivo da ausência terminar, e você precisa comprovar o impedimento, por exemplo com atestado médico. Os motivos aceitos estão listados no parágrafo único do artigo.',
  'odp-80': 'A recuperação acontece ao longo do período, não só no fim. Se sua nota numa etapa ficar abaixo de 6,0, o professor deve oferecer recuperação. Se você tirar mais na recuperação, a nova nota substitui a anterior.',
  'odp-81': 'A recuperação pode ser feita na própria sala de aula ou no horário de atendimento do professor. Pergunte a ele quando e onde vai ser a sua.',
  'odp-83': 'O conselho de classe reúne a Direção ou Gerência de Ensino, os professores da sua turma, o coordenador do curso ou da área, alguém da equipe técnico-pedagógica e um representante dos estudantes. Ou seja, os alunos têm voz nele.',
  'odp-85': 'O conselho de classe se reúne normalmente ao fim de cada etapa do período letivo. Fora disso, só se reúne quando é convocado.',
  'odp-86-87': 'Se você terminar o período com média abaixo de 6,0, o conselho de classe analisa seu caso. Ele pode aprovar você se sua média global for 5,0 ou mais e/ou se você estiver abaixo de 6,0 em no máximo metade das disciplinas. É uma possibilidade, não uma garantia.',
  'odp-110': 'Você pode trancar a matrícula em situações como serviço militar, tratamento de saúde prolongado, gravidez com atestado médico ou para acompanhar cônjuge ou parente de primeiro grau em tratamento. Atenção: no primeiro ano, semestre ou módulo do curso o trancamento não é permitido, salvo as exceções previstas em lei.',
  'odp-111': 'Se você trancou a matrícula, tem até dois semestres letivos para reabri-la. Passado esse prazo sem reabrir, a matrícula é cancelada.',
  'odp-40': 'Sua matrícula pode ser cancelada se você pedir, se não concluir o curso no prazo máximo, se apresentar documento falso, se cometer infração passível de expulsão, se não efetivar a matrícula no prazo, entre outros casos. Você tem direito de se defender, mas, depois do cancelamento, só volta ao curso por um novo processo seletivo.',
  'odp-104': 'Para aproveitar uma disciplina que você já cursou, faça um requerimento e entregue à Direção ou Gerência de Ensino do seu campus.',
  'odp-105': 'Quem analisa seu pedido de aproveitamento é a coordenação do curso ou a coordenação técnico-pedagógica. A resposta pode ser aproveitamento total, aproveitamento parcial (você complementa o que faltar) ou indeferimento.',
  'odp-106': 'Se houver dúvida de que o que você estudou equivale à disciplina, você pode ter que fazer um exame teórico-prático para mostrar que domina o conteúdo.',
  'odp-108': 'Certificados obtidos pelo ENEM também podem ser usados para pedir aproveitamento de estudos.',
  'odp-109': 'Se você foi reprovado, não precisa refazer tudo: as disciplinas em que foi aprovado podem ser aproveitadas.',
  'odp-89-91': 'Se você foi reprovado e já tentou revisar a nota com o professor, pode abrir um processo de revisão da situação final, com direito a apresentar sua defesa. Se o pedido for aceito, quem corrige é o professor titular ou, se ele estiver impedido, o coordenador do curso.',
  'odp-52': 'O estágio conta como parte da carga horária do curso, do jeito que o Projeto Pedagógico do Curso (PPC) define. Consulte o PPC do seu curso para saber os detalhes.',
  'odp-78-9': 'Se você só não consegue ir ao estágio, mas pode frequentar as aulas, não tem direito ao regime de exercícios domiciliares.',
  'polae-30': 'Pode receber os auxílios do eixo de serviços essenciais quem está matriculado e frequentando o ensino médio (integrado, subsequente, concomitante ou PROEJA) ou o ensino superior e está em situação de vulnerabilidade.',
  'polae-44': 'Os auxílios essenciais cobrem moradia, alimentação, transporte, material didático, emergências e cuidadores.',
  'polae-54': 'Para conseguir o auxílio, você se inscreve no edital, entrega os documentos pedidos e passa por uma avaliação socioeconômica com assistente social, que pode incluir entrevista ou visita à sua casa. Também precisa cumprir os critérios do edital.',
  'polae-59': 'A avaliação da sua situação usa 16 indicadores, entre eles a renda por pessoa da família, quem compõe a família, a condição da moradia, a distância até o campus e os benefícios sociais que vocês recebem.',
  'polae-61': 'Depois da avaliação, você é classificado em um de três grupos: Grupo 1 (baixa vulnerabilidade), Grupo 2 (média) ou Grupo 3 (alta).',
  'polae-65': 'O valor depende do seu grupo e é calculado sobre o salário mínimo: o Grupo 3 recebe de 40% a 50%, o Grupo 2 de 30% a 40% e o Grupo 1 de 20% a 30%.',
  'polae-66': 'Numa emergência, você pode receber até 150% do salário mínimo, no máximo três vezes por ano letivo, com parecer de assistente social.',
  'polae-47': 'No restaurante, a refeição pode ser subsidiada em até 100% para quem tem renda prioritária e em até 50% para os demais estudantes.',
  'polae-71': 'Para continuar recebendo o auxílio, você precisa manter pelo menos 75% de frequência no mês e/ou rendimento acadêmico satisfatório.',
  'polae-73': 'Quem recebe auxílio tem deveres: avisar se sua situação mudar, manter o desempenho mínimo, comunicar transferência ou saída, ir aos atendimentos quando for chamado, devolver por GRU o que receber indevidamente, ter conta bancária no próprio nome e prestar contas.',
  'polae-74': 'Se sua frequência num mês ficar abaixo de 75%, o auxílio do mês seguinte é suspenso, a não ser que a falta tenha uma justificativa prevista em lei.',
  'polae-68': 'Para voltar a receber o auxílio, você precisa ter aproveitado pelo menos metade das disciplinas e não pode ter sido reprovado por faltas.',
  'polae-92-99': 'Se você vai participar de uma atividade fora do campus, pode pedir o Auxílio-Viagem, que faz parte do eixo universal da política.',
  'polae-26': 'Quem tem renda familiar por pessoa de até um salário mínimo tem prioridade. Atenção: outros trechos da própria política falam em um salário mínimo e meio, então confirme o limite no edital.',
  'odp1-revogada': 'Este documento é a versão antiga do regulamento e não vale mais. Para qualquer dúvida, use a 2ª edição, que é a vigente.'
};