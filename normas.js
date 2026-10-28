/* Base de normas do protótipo.
   Artigos com tipo:'literal' trazem o texto oficial. Sem o campo "tipo", o
   texto é uma SÍNTESE fiel do artigo, escrita para o protótipo.
   O texto oficial completo está no PDF indicado em "link".
   Para trocar uma síntese por texto literal, substitua "texto" e marque tipo:'literal'. */

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
  },
  disciplinar: {
    nome: 'Regulamento Disciplinar Discente do IFTO',
    sigla: 'Disciplinar Discente',
    resolucao: 'Resolução nº 197/2023/CONSUP/IFTO, de 18 de abril de 2023; em vigor desde 1º de junho de 2023',
    data: '2023-04-18',
    situacao: 'vigente',
    link: 'https://www.ifto.edu.br/ifto/colegiados/consup/documentos-aprovados/regulamentos/assistencia-estudantil/resolucao-197-2023-consup-regulamento-disciplinar-discente-ifto.pdf'
  },
  docente: {
    nome: 'Regulamento dos Regimes de Trabalho e suas Alterações e das Atividades Docentes no âmbito do IFTO',
    sigla: 'Regimes de Trabalho Docente',
    resolucao: 'Resolução nº 58/2019/CONSUP/IFTO, de 21 de agosto de 2019',
    data: '2019-08-21',
    situacao: 'vigente',
    link: 'https://www.ifto.edu.br/ifto/colegiados/consup/documentos-aprovados/regulamentos/cppd/regulamento-regime-de-trabalho-dos-docentes.pdf'
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
    tags:'regulamento antigo primeira edicao revogada versao anterior 2011 desatualizada' },

  { id:'disc-4', doc:'disciplinar', artigo:'Art. 4º', assunto:'Direitos dos estudantes', tipo:'literal',
    texto:'São direitos dos discentes do IFTO: I - ter igualdade de condições para acesso e permanência na instituição; II - receber educação de qualidade, que promova o seu desenvolvimento profissional e humano; III - ser respeitado por seus professores, coordenadores, servidores técnico-administrativos e colegas de classe; VI - contestar critérios avaliativos, podendo recorrer às instâncias administrativas e, esgotando essas esferas, recorrer às instâncias superiores externas ao IFTO; VII - representar à coordenação ou ao setor competente do campus ou do polo, por escrito, contra irregularidades, abusos de poder e omissões de colegas, servidores e serviços da instituição; VIII - organizar entidades estudantis e delas participar.',
    tags:'direitos do aluno quais sao meus direitos contestar nota recorrer representar denunciar abuso entidade estudantil gremio igualdade respeito' },

  { id:'disc-5', doc:'disciplinar', artigo:'Art. 5º', assunto:'Deveres do estudante', tipo:'literal',
    texto:'Constituem deveres do corpo discente do IFTO: II - acatar as normas do Regimento Interno do IFTO, da ODP do curso, do Regulamento Disciplinar Discente e dos demais documentos normativos internos; III - tratar com respeito e urbanidade colegas, educadores, servidores e toda a comunidade do IFTO; IV - respeitar a etnia, raça, crença, gênero, sexualidade, convicções e autonomia de todos; VII - comparecer ao campus devidamente uniformizado, quando obrigatório, portando documento de identificação exigido pela instituição; X - frequentar, com assiduidade, pontualidade e interesse, as aulas, as solenidades e demais atividades; XIII - aguardar o professor em sala de aula, por quinze minutos.',
    tags:'deveres do aluno obrigacoes uniforme obrigatorio crachá identificacao esperar o professor quinze minutos assiduidade respeito' },

  { id:'disc-7', doc:'disciplinar', artigo:'Art. 7º', assunto:'O que pesa na hora de aplicar a sanção', tipo:'literal',
    texto:'No Regulamento Disciplinar Discente do IFTO, a aplicação das sanções disciplinares dar-se-á em conformidade com as seguintes condições: I - primariedade do autor da infração; II - culpa ou dolo; III - gravidade da infração; IV - valor moral, cultural ou material atingido; e V - direito humano fundamental violado.',
    tags:'criterios da punicao primeira vez primariedade gravidade dolo culpa atenuante como decidem a pena' },

  { id:'disc-8', doc:'disciplinar', artigo:'Art. 8º', assunto:'As quatro penalidades possíveis', tipo:'literal',
    texto:'Serão aplicadas, por meio de termo específico, ao estudante que cometer infrações disciplinares ou transgredir os preceitos deste Regulamento Disciplinar Discente, as seguintes penalidades: I - advertência verbal; II - advertência por escrito; III - suspensão por tempo determinado; e IV - cancelamento de matrícula.',
    tags:'quais sao as punicoes que posso levar lista das penalidades tipos de punicao advertencia verbal escrito suspensao cancelamento de matricula o que pode acontecer comigo castigo' },

  { id:'disc-8-2', doc:'disciplinar', artigo:'Art. 8º, §§ 2º e 3º', assunto:'Reincidência: quando a punição sobe de nível', tipo:'literal',
    texto:'§ 2º A advertência por escrito é aplicada quando houver reincidência de atos que tenham levado à advertência verbal. § 3º Caso ocorra o terceiro registro de uma infração sujeita à advertência por escrito, poderá levar à suspensão ou ao cancelamento de matrícula do estudante.',
    tags:'reincidencia terceira vez de novo repetir quantas vezes ate suspender agravamento' },

  { id:'disc-8-4', doc:'disciplinar', artigo:'Art. 8º, § 4º', assunto:'Por quanto tempo a punição fica registrada', tipo:'literal',
    texto:'Os registros das penalidades aplicadas serão cancelados após transcorrerem os seguintes prazos: I - advertência verbal: um ano; II - advertência por escrito: dois anos; III - suspensão: até a colação de grau; e IV - cancelamento da matrícula: até o ano subsequente.',
    tags:'quanto tempo fica registrado advertencia some apaga prazo registro ficha limpa um ano dois anos colacao de grau' },

  { id:'disc-8-5', doc:'disciplinar', artigo:'Art. 8º, § 5º', assunto:'Quem pode aplicar cada penalidade', tipo:'literal',
    texto:'São competentes para aplicação das penalidades: I - qualquer servidor ou coordenador ou tutor de polo deverá fazer o registro do ocorrido na Ficha de Ocorrência e encaminhá-la à Coordenação do Curso para preenchimento do Termo de Advertência; II - Coordenação de Curso ou Gerência ou Diretoria de Ensino para a advertência verbal e a advertência por escrito; III - Gerência de Ensino ou Diretoria de Ensino ou Direção-Geral de campus, após deliberação da Comissão ou Equipe Disciplinar Discente Local, para a suspensão; e IV - Direção de campus avançado ou Direção-Geral de campus ou Diretoria do CREAD, após deliberação da Comissão ou Equipe Disciplinar Discente Local, para o cancelamento de matrícula.',
    tags:'quem aplica a punicao quem pode me advertir professor pode suspender coordenador diretor competencia ficha de ocorrencia' },

  { id:'disc-9', doc:'disciplinar', artigo:'Art. 9º', assunto:'Direito de defesa', tipo:'literal',
    texto:'A aplicação das medidas disciplinares deverá levar em consideração, na qualidade de instrumento da prática educativa, a garantia do amplo direito de defesa aos envolvidos no caso.',
    tags:'direito de defesa me defender ampla defesa contraditorio posso explicar meu lado' },

  { id:'disc-11-i', doc:'disciplinar', artigo:'Art. 11, I', assunto:'O que dá advertência verbal', tipo:'literal',
    texto:'Serão consideradas infrações disciplinares passíveis de advertência verbal: a) ausentar-se da sala de aula ou da instituição sem comunicar ao professor ou coordenador; b) alimentar-se em sala de aula, sala de multimeios, laboratórios, auditórios ou piscinas, salvo com anuência do professor; c) permanecer sem autorização nesses espaços após o término das atividades escolares; e) provocar ou participar de atividades que comprometam a disciplina nas dependências da instituição; f) manter-se fora da sala no período em que estiver sendo ministrada aula; e g) usar códigos e linguagem impróprios.',
    tags:'advertencia verbal infracao de menor gravidade comer em sala sair de sala matar aula andar no corredor bagunca conversa' },

  { id:'disc-11-ii', doc:'disciplinar', artigo:'Art. 11, II', assunto:'O que dá advertência por escrito', tipo:'literal',
    texto:'Serão consideradas infrações passíveis de advertência por escrito, entre outras: c) desrespeitar, ofender, provocar com palavras, atos ou gestos colegas, professores, técnicos administrativos, colaboradores ou qualquer outra pessoa; e) aplicar trotes que agridam a integridade física e/ou psicológica de estudantes novatos ou veteranos; f) apresentar-se na instituição alcoolizado ou sob efeito de qualquer substância tóxica; g) danificar, furtar ou subtrair objetos pertencentes a outrem ou à instituição; i) utilizar-se de quaisquer meios fraudulentos, como falsificar assinatura de professor ou nota de prova, cometer plágio, físico ou virtual, para obter resultados favoráveis nas avaliações; l) fumar cigarros ou narguilé eletrônico nas dependências da instituição; m) utilizar telefone celular, smartphone, tablet ou gravadores sem prévia autorização; n) fotografar, filmar ou gravar áudio de qualquer atividade didática sem autorização expressa do professor.',
    tags:'advertencia por escrito cola colar na prova plagio posso usar celular em sala de aula smartphone tablet filmar gravar o professor trote fumar narguile vandalismo furto desrespeito ofensa' },

  { id:'disc-11-iii', doc:'disciplinar', artigo:'Art. 11, III', assunto:'O que dá suspensão', tipo:'literal',
    texto:'Serão consideradas infrações passíveis de suspensão assistida dentro da instituição por até três dias úteis: a) praticar qualquer ação que implique em constrangimento recorrente a outros estudantes que se configure como bullying, presencial ou virtual, prática de injúria racial, racismo, preconceito, discriminação ou qualquer outro tipo de ação; b) desrespeitar, ofender, provocar com palavras, atos ou gestos colegas, professores, técnicos administrativos, demais servidores ou qualquer outra pessoa nas dependências da instituição ou em encontros virtuais; e c) apresentar-se na instituição sob efeito de entorpecentes ou similares.',
    tags:'suspensao o que da suspensao quantos dias tres dias uteis bullying racismo preconceito discriminacao droga suspensao assistida' },

  { id:'disc-11-iv', doc:'disciplinar', artigo:'Art. 11, IV', assunto:'O que dá cancelamento de matrícula', tipo:'literal',
    texto:'Serão consideradas infrações passíveis de cancelamento da matrícula: a) agredir fisicamente qualquer pessoa nas dependências do IFTO, exceto no caso de legítima defesa; b) praticar delitos sujeitos à ação penal; c) participar de atos que possam caracterizar-se como calúnia, injúria ou difamação ao IFTO, a estudantes ou a qualquer membro de sua comunidade; e) praticar tráfico de entorpecentes; f) trazer, guardar, oferecer ou fornecer bebidas alcoólicas, substância tóxica, armas, materiais inflamáveis ou explosivos; g) praticar qualquer ação ou omissão baseada no gênero que cause lesão, sofrimento físico, psicológico ou dano moral; i) praticar violência psicológica.',
    tags:'briga brigar dar soco agressao fisica expulsao expulso cancelamento da matricula por infracao trafico arma crime violencia infracao gravissima' },

  { id:'disc-18', doc:'disciplinar', artigo:'Art. 18', assunto:'Como o processo tramita', tipo:'literal',
    texto:'Após a apuração dos fatos, a Comissão ou Equipe Disciplinar Discente Local emitirá parecer e enviará à Gerência ou Diretoria de Ensino, que encaminhará ao diretor-geral do campus ou à Diretoria do CREAD, para a aplicação da medida disciplinar cabível. Parágrafo único. Quando o ato estiver capitulado na Lei Penal, será remetida cópia dos autos à autoridade competente.',
    tags:'como funciona o processo disciplinar tramite comissao parecer quem decide policia lei penal apuracao' },

  { id:'disc-19', doc:'disciplinar', artigo:'Art. 19', assunto:'A punição não vai para o histórico escolar', tipo:'literal',
    texto:'O registro das penalidades aplicadas a membro do corpo discente será feito por meio do Termo de Advertência nas situações de advertência verbal e por escrito; e nos casos de suspensão e cancelamento de matrícula, por meio do Relatório Final de Procedimento Disciplinar Discente Local, arquivado na pasta do discente, não devendo constar no histórico escolar.',
    tags:'vai para o historico escolar advertencia aparece no historico mancha ficha registro pasta do aluno prejudica' },

  { id:'disc-20', doc:'disciplinar', artigo:'Art. 20', assunto:'Depois do cancelamento, quando dá para voltar', tipo:'literal',
    texto:'Obedecendo ao devido processo, o cancelamento da matrícula implicará o impedimento de nova matrícula no ano subsequente, mesmo que o discente seja aprovado em processo seletivo posterior ao ato infracional.',
    tags:'voltar depois de expulso nova matricula ano seguinte impedimento processo seletivo readmissao' },

  { id:'disc-22', doc:'disciplinar', artigo:'Art. 22', assunto:'Prazo para recorrer da punição', tipo:'literal',
    texto:'O estudante terá direito a recurso, no prazo de até três dias úteis, a contar da publicação da decisão da Comissão ou Equipe Disciplinar Discente Local.',
    tags:'recurso recorrer da punicao levei uma advertencia e agora fui advertido fui suspenso prazo tres dias uteis como contestar discordo da decisao o que fazer' },

  { id:'disc-23', doc:'disciplinar', artigo:'Art. 23', assunto:'Prazo de resposta ao recurso', tipo:'literal',
    texto:'A Comissão ou Equipe Disciplinar Discente Local terá até três dias úteis para resposta ao recurso impetrado pelo discente.',
    tags:'quanto tempo demora a resposta do recurso prazo da comissao tres dias uteis' },

  { id:'doc-5', doc:'docente', artigo:'Art. 5º', assunto:'Os regimes de trabalho do docente', tipo:'literal',
    texto:'Ao docente do IFTO ocupante de cargo efetivo será aplicado um dos seguintes regimes de trabalho: I - tempo integral de 40 horas semanais de trabalho, com dedicação exclusiva às atividades de ensino, pesquisa, extensão e gestão institucional; II - tempo parcial de 20 horas semanais de trabalho. § 1º Excepcionalmente, poderá ser admitida a adoção do regime de 40 horas semanais, em tempo integral, observando dois turnos diários completos, sem dedicação exclusiva, para áreas com características específicas.',
    tags:'regime de trabalho do professor 40 horas 20 horas dedicacao exclusiva tempo integral tempo parcial jornada docente' },

  { id:'doc-5-3', doc:'docente', artigo:'Art. 5º, § 3º', assunto:'O que a dedicação exclusiva impede', tipo:'literal',
    texto:'O regime de 40 horas com dedicação exclusiva implica o impedimento do exercício de outra atividade remunerada, pública ou privada, com as exceções previstas em Lei.',
    tags:'dedicacao exclusiva posso dar aula fora trabalhar em outro lugar outra renda impedimento DE' },

  { id:'doc-11', doc:'docente', artigo:'Art. 11', assunto:'Como se muda de regime de trabalho', tipo:'literal',
    texto:'As alterações dos regimes de trabalho do docente ocorrerão mediante publicação de edital específico para este fim. § 2º A condução do edital será de responsabilidade da Comissão Permanente de Pessoal Docente Local, que fará a análise e o parecer das solicitações. § 4º A alteração de regime de trabalho somente poderá ser concedida desde que não ultrapasse o total do banco de professor-equivalente direcionado a professores efetivos da unidade.',
    tags:'mudar de regime passar para 40 horas pedir dedicacao exclusiva edital cppd banco de professor equivalente' },

  { id:'doc-14', doc:'docente', artigo:'Art. 14', assunto:'Pontuação mínima para conseguir dedicação exclusiva', tipo:'literal',
    texto:'Está vedada ao docente a alteração do regime de trabalho para tempo integral com Dedicação Exclusiva quando o resultado da soma das pontuações previstas nas alíneas “a”, “b” e “c” do art. 12 for inferior a 200 pontos.',
    tags:'pontuacao minima dedicacao exclusiva 200 pontos nao consegui mudar regime vedada alteracao' },

  { id:'doc-16', doc:'docente', artigo:'Art. 16', assunto:'Limite de professores em tempo parcial', tipo:'literal',
    texto:'A alteração de regime de trabalho de tempo integral com Dedicação Exclusiva ou sem Dedicação Exclusiva para tempo parcial observará: I - o limite máximo de 20% do total do quadro de docentes efetivos no campus em regime de trabalho de tempo parcial; II - o parecer de viabilidade elaborado exclusivamente pelo diretor ou gerente de ensino da unidade.',
    tags:'passar para 20 horas tempo parcial limite 20 por cento quadro do campus reduzir jornada' },

  { id:'doc-18', doc:'docente', artigo:'Art. 18', assunto:'Atividades gerais do docente', tipo:'literal',
    texto:'São atividades gerais do docente: I - participar da elaboração da proposta pedagógica do IFTO e da unidade a que está vinculado; II - elaborar e cumprir o Plano Individual de Trabalho; III - zelar pela aprendizagem dos estudantes; IV - estabelecer estratégias de recuperação para os alunos de menor rendimento; V - cumprir os dias letivos e ministrar as horas-aula estabelecidas, além de participar integralmente dos períodos dedicados ao planejamento, à avaliação e ao desenvolvimento do estudante.',
    tags:'obrigacoes do professor atribuicoes deveres docente recuperacao planejamento dias letivos' },

  { id:'doc-21', doc:'docente', artigo:'Art. 21', assunto:'Prazo de entrega do PIT', tipo:'literal',
    texto:'O Plano Individual de Trabalho deverá ser elaborado no início de cada semestre letivo e protocolizado na chefia imediata em até quinze dias corridos após o início do semestre letivo. § 1º Havendo alteração definitiva ou com prazo superior a vinte dias das atividades registradas, o docente deverá encaminhar, via SEI, para a chefia imediata, em até quinze dias corridos, versão atualizada do documento, gerando versão retificadora.',
    tags:'pit plano individual de trabalho prazo quinze dias entregar retificar sei chefia imediata' },

  { id:'doc-24', doc:'docente', artigo:'Art. 24, § 2º', assunto:'Limite de aulas para quem está no mestrado ou doutorado', tipo:'literal',
    texto:'Docentes credenciados em programas stricto sensu, de mestrado ou doutorado, oferecidos pelo IFTO terão carga horária semanal de, no máximo, 12 aulas, incluídas as horas-aula do programa.',
    tags:'stricto sensu mestrado doutorado limite de aulas doze aulas credenciado programa pos graduacao' },

  { id:'doc-25', doc:'docente', artigo:'Art. 25, parágrafo único', assunto:'Quanto vale uma hora-aula', tipo:'literal',
    texto:'Considerando condições de deslocamento dentro das unidades do IFTO e ambientação de docentes e discentes no espaço escolar, computar-se-á 60 minutos, uma hora, de trabalho como equivalente a uma hora-aula para fins de jornada de trabalho do docente.',
    tags:'hora aula quanto vale sessenta minutos uma hora equivalencia jornada' },

  { id:'doc-27', doc:'docente', artigo:'Art. 27', assunto:'Mínimo e máximo de aulas por semana', tipo:'literal',
    texto:'Para fins de atribuição dos valores previstos no campo Aulas observar-se-ão: I - o docente com regime de trabalho de 20 horas semanais deverá cumprir a carga horária mínima de 8 e máxima de 12 horas semanais com aulas; II - o docente com regime de 40 horas semanais, sem Dedicação Exclusiva, deverá cumprir a carga horária mínima de 10 e máxima de 20 horas semanais com aulas; e III - o docente com regime de 40 horas semanais, com Dedicação Exclusiva, deverá cumprir a carga horária mínima de 10 e máxima de 20 horas semanais com aulas.',
    tags:'quantas aulas por semana carga horaria minima maxima de aula limite de aulas 20 horas 40 horas quantas aulas devo dar' },

  { id:'doc-34', doc:'docente', artigo:'Art. 34', assunto:'O que conta como apoio ao ensino', tipo:'literal',
    texto:'Serão consideradas atividades de apoio ao ensino: I - atendimento ao estudante; II - orientação de Trabalho de Conclusão de Curso em curso técnico, até duas horas por orientando; III - orientação de TCC em curso de graduação, até duas horas por orientando; IV - orientação de TCC em curso de pós-graduação, até três horas por orientando; VI - orientação de estágio curricular supervisionado, até uma hora por orientando; IX - coordenação de projeto de ensino, até oito horas por projeto; XI - tutoria presencial, até uma hora para cada cinquenta estudantes.',
    tags:'orientar tcc quantas horas por orientando estagio projeto de ensino tutoria atendimento ao aluno apoio ao ensino' },

  { id:'doc-42', doc:'docente', artigo:'Art. 42', assunto:'Horas das funções administrativas', tipo:'literal',
    texto:'Serão consideradas atividades administrativas, entre outras: I - Direção-Geral de campus, até quarenta horas semanais; III - Gerência ou Direção de Ensino, até vinte e duas horas semanais; IV - Coordenação de Curso de Nível Médio, Técnico Integrado, Subsequente, Concomitante, Proeja ou FIC, até vinte horas semanais; VI - Coordenação de Área de Conhecimento ou Eixo Tecnológico, até doze horas semanais; VIII - Responsabilidade Técnica por Laboratório, até oito horas semanais; XIII - Coordenação do NAPNE, até quatro horas semanais.',
    tags:'coordenacao de curso quantas horas funcao administrativa direcao gerencia napne laboratorio carga horaria de gestao' },

  { id:'doc-49', doc:'docente', artigo:'Arts. 47, 49 e 50', assunto:'RESAD, o relatório semestral', tipo:'literal',
    texto:'As atividades de capacitação deverão ser apresentadas por meio do Relatório Semestral de Atividades Desenvolvidas. A não apresentação do RESAD, dentro dos prazos determinados, tornará o professor inadimplente. O relatório de atividades desenvolvidas deverá ser apresentado, obrigatoriamente, em caráter semestral e entregue, via Sistema Informatizado, à chefia imediata, na data do início do semestre letivo subsequente.',
    tags:'resad relatorio semestral de atividades prazo entrega inadimplente capacitacao' }
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
  'odp1-revogada': 'Este documento é a versão antiga do regulamento e não vale mais. Para qualquer dúvida, use a 2ª edição, que é a vigente.',

  'disc-4': 'Você tem direito a igualdade de condições para entrar e permanecer no IFTO, a uma educação de qualidade e a ser respeitado por professores, servidores e colegas. Se discordar dos critérios de uma avaliação, pode contestar nas instâncias administrativas do IFTO e, esgotadas essas, recorrer a instâncias externas. Você também pode denunciar por escrito abusos e irregularidades à coordenação ou ao setor responsável, e pode organizar entidades estudantis e participar delas.',
  'disc-5': 'Você deve seguir as normas do IFTO, tratar todos com respeito e respeitar a etnia, a raça, a crença, o gênero, a sexualidade e as convicções de cada pessoa. Quando o uniforme for obrigatório, vá uniformizado e leve o documento de identificação exigido. Também deve frequentar as aulas com assiduidade e pontualidade e, se o professor atrasar, esperar por ele em sala por 15 minutos.',
  'disc-7': 'A punição depende de cinco fatores: se é a sua primeira infração, se houve intenção (dolo) ou só culpa, a gravidade do que aconteceu, o valor moral, cultural ou material atingido e se algum direito humano fundamental foi violado. Ou seja, não se olha só para qual foi a infração: as circunstâncias do seu caso também pesam.',
  'disc-8': 'Existem quatro punições possíveis: advertência verbal, advertência por escrito, suspensão por tempo determinado e cancelamento da matrícula. Qualquer uma delas é aplicada por meio de um termo específico, ou seja, fica registrada por escrito.',
  'disc-8-2': 'Se você repetir uma infração que já rendeu advertência verbal, a punição passa a ser advertência por escrito. Se chegar ao terceiro registro de uma infração que dá advertência por escrito, você pode ser suspenso ou ter a matrícula cancelada.',
  'disc-8-4': 'A punição não fica registrada para sempre: a advertência verbal é apagada depois de 1 ano e a advertência por escrito depois de 2 anos. A suspensão fica registrada até a colação de grau, e o cancelamento da matrícula até o ano seguinte.',
  'disc-8-5': 'O professor ou outro servidor não aplica a punição: ele registra o ocorrido na Ficha de Ocorrência e encaminha à Coordenação do Curso. As advertências verbal e por escrito ficam com a Coordenação de Curso ou com a Gerência ou Diretoria de Ensino. A suspensão (Gerência ou Diretoria de Ensino, ou Direção-Geral) e o cancelamento de matrícula (Direção do campus ou do CREAD) só vêm depois que a Comissão ou Equipe Disciplinar Discente Local delibera sobre o seu caso.',
  'disc-9': 'Se você for acusado de uma infração, tem garantido o amplo direito de defesa, ou seja, de apresentar a sua versão dos fatos. A norma trata a medida disciplinar como um instrumento educativo, e por isso a sua defesa precisa ser levada em conta na decisão.',
  'disc-11-i': 'Infrações mais leves, como sair da sala ou do campus sem avisar o professor ou o coordenador, comer em sala ou laboratório sem permissão do professor, ficar fora da sala durante a aula ou usar linguagem imprópria, podem render advertência verbal. Ficar nesses espaços sem autorização depois das atividades e provocar bagunça que comprometa a disciplina também entram na lista.',
  'disc-11-ii': 'Colar ou plagiar, falsificar assinatura ou nota, usar celular ou tablet sem autorização, filmar, fotografar ou gravar a aula sem permissão do professor e fumar cigarro ou narguilé eletrônico no campus podem render advertência por escrito. O mesmo vale para ofender alguém, aplicar trote que agrida um colega, chegar alcoolizado e danificar ou furtar objetos.',
  'disc-11-iii': 'Bullying (presencial ou virtual), injúria racial, racismo, preconceito, discriminação, ofender pessoas no campus ou em encontros virtuais e chegar sob efeito de drogas podem levar a suspensão de até 3 dias úteis. A suspensão é assistida e cumprida dentro da própria instituição.',
  'disc-11-iv': 'As infrações mais graves podem levar ao cancelamento da sua matrícula: agredir fisicamente alguém no IFTO (a não ser em legítima defesa), cometer crime, traficar drogas ou trazer bebida alcoólica, armas ou explosivos para o campus. Caluniar, injuriar ou difamar o IFTO ou alguém da comunidade, praticar violência psicológica ou violência baseada em gênero também estão na lista.',
  'disc-18': 'Depois de apurar os fatos, a Comissão ou Equipe Disciplinar Discente Local dá um parecer, que passa pela Gerência ou Diretoria de Ensino e chega ao diretor-geral do campus (ou à Diretoria do CREAD), que aplica a medida. Se o que você fez também for crime pela lei penal, uma cópia do processo é enviada à autoridade competente.',
  'disc-19': 'A punição não aparece no seu histórico escolar. As advertências ficam registradas num Termo de Advertência, e a suspensão e o cancelamento num relatório final arquivado na sua pasta de estudante.',
  'disc-20': 'Se sua matrícula for cancelada por infração, você não pode se matricular de novo no ano seguinte. Isso vale mesmo que você seja aprovado num novo processo seletivo feito depois do ocorrido.',
  'disc-22': 'Se você discordar da punição, pode recorrer em até 3 dias úteis, contados da publicação da decisão da Comissão ou Equipe Disciplinar Discente Local. Fique atento: o prazo é curto e conta só dias úteis.',
  'disc-23': 'Depois que você entra com o recurso, a Comissão ou Equipe Disciplinar Discente Local tem até 3 dias úteis para responder. Esse é o prazo máximo, então a resposta pode vir antes.',

  'doc-5': 'Como professor efetivo do IFTO, você trabalha em um de dois regimes: 40 horas semanais com dedicação exclusiva a ensino, pesquisa, extensão e gestão, ou 20 horas semanais em tempo parcial. Em caráter excepcional, para áreas com características específicas, pode ser admitido o regime de 40 horas sem dedicação exclusiva, em dois turnos diários completos.',
  'doc-5-3': 'Se você está em 40 horas com dedicação exclusiva, não pode ter outra atividade remunerada, nem pública nem privada. As únicas exceções são as previstas em lei, então confira a legislação antes de aceitar outro trabalho.',
  'doc-11': 'Para mudar de regime de trabalho, você precisa esperar um edital específico, conduzido pela Comissão Permanente de Pessoal Docente Local, que analisa e dá parecer sobre os pedidos. Mesmo com parecer favorável, a mudança só é concedida se couber no banco de professor-equivalente reservado aos efetivos da sua unidade.',
  'doc-14': 'Você não consegue passar para dedicação exclusiva se a soma das suas pontuações nas alíneas “a”, “b” e “c” do art. 12 ficar abaixo de 200 pontos. Ou seja, 200 pontos é o mínimo para essa mudança ser possível.',
  'doc-16': 'Você pode pedir para ir para tempo parcial, mas o campus só pode ter no máximo 20% dos docentes efetivos nesse regime. Além disso, a mudança depende de um parecer de viabilidade feito exclusivamente pelo diretor ou gerente de ensino da unidade.',
  'doc-18': 'Além de dar aula, você deve participar da proposta pedagógica do IFTO e do seu campus, elaborar e cumprir seu Plano Individual de Trabalho e zelar pela aprendizagem dos alunos. Também cabe a você criar estratégias de recuperação para quem tem menor rendimento e cumprir os dias letivos e as horas-aula, participando integralmente do planejamento e da avaliação.',
  'doc-21': 'Você deve elaborar o PIT no início de cada semestre e protocolá-lo na chefia imediata em até 15 dias corridos após o início do semestre letivo. Se suas atividades mudarem de forma definitiva ou por mais de 20 dias, envie pelo SEI uma versão retificadora à chefia, também em até 15 dias corridos.',
  'doc-24': 'Se você é credenciado em mestrado ou doutorado (stricto sensu) oferecido pelo IFTO, sua carga é de no máximo 12 aulas por semana. Essas 12 aulas já incluem as horas-aula que você dá no programa.',
  'doc-25': 'Para a sua jornada, cada hora-aula conta como 60 minutos de trabalho, ou seja, uma hora cheia. A regra leva em conta o tempo de deslocamento dentro das unidades e de ambientação de professores e alunos no espaço escolar.',
  'doc-27': 'Quantas aulas você dá por semana depende do seu regime: em 20 horas, de 8 a 12 horas semanais de aula; em 40 horas, de 10 a 20 horas semanais de aula. O mínimo e o máximo são os mesmos para 40 horas com ou sem dedicação exclusiva.',
  'doc-34': 'Atendimento ao estudante, orientação de TCC e de estágio, coordenação de projeto de ensino e tutoria contam como apoio ao ensino. A orientação de TCC vale até 2 horas por orientando no técnico e na graduação e até 3 horas na pós-graduação, e a de estágio até 1 hora por orientando. Coordenar um projeto de ensino vale até 8 horas por projeto, e a tutoria presencial até 1 hora para cada 50 estudantes.',
  'doc-42': 'Se você assumir uma função administrativa, ela conta horas na sua jornada até um limite semanal: Direção-Geral de campus até 40 horas, Gerência ou Direção de Ensino até 22, Coordenação de Curso (médio, técnico, Proeja ou FIC) até 20 e Coordenação de Área ou Eixo até 12. Responsabilidade técnica por laboratório vale até 8 horas semanais, e coordenação do NAPNE até 4.',
  'doc-49': 'Você precisa entregar o RESAD, o relatório semestral das atividades que desenvolveu, incluindo as de capacitação, à chefia imediata pelo sistema informatizado, na data de início do semestre letivo seguinte. Se não entregar no prazo, você fica inadimplente.'
};