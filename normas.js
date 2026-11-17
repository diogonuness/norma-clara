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
    link: 'https://www.ifto.edu.br/ifto/colegiados/consup/documentos-aprovados/regulamentos/assistencia-estudantil/politica-de-assistencia-estudantil.pdf'
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
    nomeCurto: 'Regulamento Disciplinar Discente',
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
  { id:'odp-73-i', doc:'odp', artigo:'Art. 73, I', assunto:'Frequência mínima para aprovação', tipo:'literal',
    texto:'Será considerado APROVADO o estudante que, ao final do período letivo, obtiver:\nI - frequência mínima de 75% (setenta e cinco por cento) da carga horária total dos componentes curriculares da respectiva série/ano/módulo e/ou outro tempo escolar definido em PPC e,',
    tags:'frequencia falta faltar presenca quantas faltas posso ter limite de faltas frequencia minima pra passar passar de ano aprovacao reprovacao por falta percentual minimo 75 carga horaria' },

  { id:'odp-73-ii', doc:'odp', artigo:'Art. 73, II', assunto:'Nota mínima para aprovação', tipo:'literal',
    texto:'Será considerado APROVADO o estudante que, ao final do período letivo, obtiver:\n[…]\nII - média aritmética final igual ou superior a 6,0 (seis) pontos em TODOS os componentes curriculares.',
    tags:'nota media minima aprovacao aprovado passar seis 6,0 todos componentes disciplina materia' },

  { id:'odp-71-pu', doc:'odp', artigo:'Art. 71, parágrafo único', assunto:'Como se calcula a média final', tipo:'literal',
    texto:'Parágrafo único. A nota final será a média aritmética simples dos bimestres/trimestres, conforme o caso, considerando a especificidade de cada componente curricular.',
    tags:'media final calculo como calcula aritmetica bimestre trimestre nota soma' },

  { id:'odp-74', doc:'odp', artigo:'Art. 74', assunto:'Abono de faltas', tipo:'literal',
    texto:'A frequência às aulas e às demais atividades escolares, pelo estudante regularmente matriculado, é obrigatória, sendo vedado o abono de faltas, salvo casos prescritos em lei.',
    tags:'abono de falta justificar atestado abonar ausencia obrigatoria lei' },

  { id:'odp-12-viii', doc:'odp', artigo:'Art. 12, VIII', assunto:'Notificação por excesso de faltas', tipo:'literal',
    texto:'Cabe a cada campus do IFTO:\n[…]\nVIII – notificar ao Conselho Tutelar do Município, ao juiz competente da Comarca e ao respectivo representante do Ministério Público a relação dos estudantes que apresentem quantidade de faltas acima de 12,5% (doze e meio por cento), conforme tempo escolar de cada ciclo.',
    tags:'excesso falta notificacao conselho tutelar orgao protecao 12,5 por cento infrequencia' },

  { id:'odp-75', doc:'odp', artigo:'Art. 75', assunto:'Segunda chamada de avaliação', tipo:'literal',
    texto:'Ao estudante que faltar a qualquer das verificações de aprendizagem ou deixar de executar trabalho escolar será facultado o direito à outra oportunidade, se esse estudante requerer à Direção/Gerência de Ensino ou a quem esta designar, no prazo de até 72 (setenta duas) horas úteis após o término do prazo de afastamento.\nParágrafo único. Somente será deferido o requerimento que constar anexo à comprovação de impedimento nas seguintes situações:\nI – problema de saúde;\nII – obrigações com o Serviço Militar;\nIII – pelo exercício do voto (um dia anterior e um dia posterior à data de eleição, se coincidentes com a realização da prova);\nIV – convocação pelo Poder Judiciário ou pela Justiça Eleitoral;\nV – viagem, autorizada pelo IFTO, para representação em atividades desportivas, culturais, de ensino e/ou pesquisa e/ou extensão;\nVI – acompanhamento de dependentes em caso de defesa da saúde;\nVII – falecimento de parente (cônjuge, companheiro(a), pais, padrasto, madrasta, filhos enteados, menor sob guarda ou tutela ou irmãos), desde que a avaliação tenha acontecido no período de até 8 (oito) dias após falecimento;\nVIII – doação voluntária de sangue (no dia de sua doação);\nIX - estudante que integrar representação desportiva nacional, conforme art. 85 da Lei n.º 9.615, de 24 de março de 1998 - “Lei Pelé”;\nX – demais atividades promovidas pelo IFTO para as quais o estudante tenha sido autorizado ou convocado;\nXI – por questões relativas a trabalho devidamente comprovadas/justificadas.\nParágrafo único. Todos os trâmites processuais quanto à matéria serão acompanhados pela Direção/Gerência de Ensino ou por quem esta designar, devendo proceder aos encaminhamentos que se fizerem necessários até sua efetiva conclusão.',
    tags:'segunda chamada perdi prova faltei avaliacao reposicao prazo 72 horas requerer atestado trabalho nao entregue' },

  { id:'odp-80', doc:'odp', artigo:'Art. 80', assunto:'Recuperação paralela', tipo:'literal',
    texto:'A recuperação é o processo pelo qual é concedida ao estudante a possibilidade de sanar dificuldades inerentes ao ensino-aprendizagem.\n§1º A recuperação será paralela e contínua no que diz respeito às bases tecnológicas e científicas (conteúdos) e de competências/habilidades, ocorrendo durante as etapas intermediárias (bimestre/trimestre) proposta no PPC.\n§2º Caberá ao docente proporcionar de forma paralela, contínua e com instrumentos avaliativos diversificados a recuperação da nota ou conceito ao estudante que não logrou êxito, ou seja, nota menor que 6,0 (seis), nas etapas intermediárias (bimestre/trimestre).\n§3º No processo de recuperação paralela, serão desenvolvidas atividades diversificadas, com vista a subsidiar, provocar e promover o desenvolvimento do estudante nos aspectos cognitivos, afetivos e sociais e a nota aferida na recuperação quando superior a anterior, substituíra a nota inferior.',
    tags:'recuperacao paralela continua nota baixa reforco refazer substituir nota bimestre' },

  { id:'odp-81', doc:'odp', artigo:'Art. 81', assunto:'Onde acontece a recuperação', tipo:'literal',
    texto:'Os estudos de recuperação paralela poderão ser realizados:\nI - em sala de aula, desde que se privilegie a recuperação de elementos curriculares em defasagem, e não a realização de provas em dias letivos e horários regulares para o turno do curso;\nII – durante os horários de atendimento do PEBTT, que se responsabilizará por estabelecer tais horários e divulgá-los aos estudantes.',
    tags:'recuperacao onde horario atendimento professor sala de aula monitoria' },

  { id:'odp-83', doc:'odp', artigo:'Art. 83', assunto:'Quem compõe o conselho de classe', tipo:'literal',
    texto:'Constituirão o Conselho de Classe/Análise de Turma, além da Direção/Gerência de Ensino, todos os PEBTTs da turma, o representante dos estudantes, o coordenador de curso/área e um representante da equipe técnico-pedagógica.\n§1º Conforme logística de cada Campus e de forma gradativa, deverão compor esse conselho toda a equipe de apoio pedagógico dentre eles os assistentes de estudantes, psicólogos, assistentes sociais e outros profissionais do Campus.\n§ 2º Faculta-se a publicação de ato administrativo complementar conforme a realidade de cada Campus nominando cada ente que deverá compor o conselho de classe/análise de turma.\n§3º Faculta-se a inserção de pais ou responsáveis tutelares nos Conselhos de Análise de Classe/Análise de Turma.',
    tags:'conselho de classe composicao quem participa representante estudante coordenador' },

  { id:'odp-85', doc:'odp', artigo:'Art. 85', assunto:'Quando o conselho de classe se reúne', tipo:'literal',
    texto:'O Conselho de Classe/Análise de Turma se reunirá minimamente ao final de cada etapa (bimestralmente, trimestralmente ou outro tempo escolar conforme PPC), em caráter ordinário, com previsão no calendário acadêmico e, em caráter excepcional, quando convocado pela Direção/Gerência de Ensino, para tratar de assunto específico.',
    tags:'conselho de classe reuniao quando final bimestre etapa convocacao' },

  { id:'odp-86-87', doc:'odp', artigo:'Art. 86 e Art. 87', assunto:'Conselho de classe e o aluno com média abaixo de 6,0', tipo:'literal',
    texto:'Ao final do período letivo, o Conselho de Classe/Análise de Turma analisará a situação de todos os estudantes com média inferior a 6,0 em um ou mais componentes curriculares, tendo a possibilidade de aprová-los em conselho.\nArt. 87. Como critérios de análise o Conselho considerará:\nI - a média global (média aritmética simples de todos componentes curriculares), maior ou igual a 5,0 (cinco), obtida pelo estudante, e/ou;\nII – a quantidade de componentes curriculares com média inferior a 6,0 (seis) em até 50% (cinquenta por cento) do total de componentes curriculares do tempo escolar cursado (semestre/ano).\nParágrafo único. Esgotadas as possibilidades previstas nos incisos I e II, outros critérios poderão ser deliberados pelo Conselho de Análise de Turma, considerando as especificidades de cada turma.',
    tags:'conselho de classe passei no conselho aprovado pelo conselho aprovar passar media global 5,0 metade componentes reprovado' },

  { id:'odp-110', doc:'odp', artigo:'Art. 110', assunto:'Trancamento de matrícula', tipo:'literal',
    texto:'O trancamento de matrícula será concedido mediante preenchimento de requerimento, seguido de sua comprovação, protocolizado e encaminhado à Direção/Gerência de Ensino ou a quem esta delegar, e será facultado nos seguintes casos:\nI – estudante convocado pelo serviço militar;\nII – tratamento de saúde prolongado;\nIII – gravidez comprovada por atestado médico, conforme legislação específica;\nIV – acompanhamento de cônjuge e/ou parente de primeiro grau que esteja em tratamento de saúde.\n§1º Os casos não contemplados os incisos I, II, III e IV serão encaminhados à Direção/Gerência de Ensino ou a quem esta delegar, podendo ser ouvida a coordenação do curso, para emissão de parecer conclusivo sobre a matéria.\n§2º Salvo os casos especificados em lei, fica vedado o trancamento no primeiro ano/semestre/módulo.\n§3º Não havendo mais a série/ano/módulo do respectivo curso objeto de trancamento, a reabertura poderá ser efetivada na mesma série/ano/módulo de um curso de mesmo eixo ou afim, nível e modalidade, desde que haja a vaga remanescente/ociosa e sejam realizadas as adaptações necessárias.',
    tags:'trancar trancamento matricula posso trancar quero trancar pausar parar o curso afastar servico militar gravidez saude primeiro ano' },

  { id:'odp-111', doc:'odp', artigo:'Art. 111', assunto:'Prazo para reabrir a matrícula trancada', tipo:'literal',
    texto:'O estudante que não reabrir a matrícula no prazo máximo de dois semestres letivos e/ou não proceder à justificativa de prorrogação de prazo, junto a CORES ou ao setor responsável, terá sua matrícula cancelada.',
    tags:'trancamento prazo reabrir voltar retorno dois semestres cancelada perder vaga' },

  { id:'odp-40', doc:'odp', artigo:'Art. 40', assunto:'Cancelamento da matrícula', tipo:'literal',
    texto:'O estudante terá sua matrícula cancelada quando:\nI – solicitado por este ou seu representante legal, via requerimento no protocolo;\nII – não concluir o seu curso dentro do prazo máximo para integralização;\nIII - apresentar para matrícula ou a qualquer tempo documento falso ou falsificado ou adulterado, ficando o responsável passível das sanções legais;\nIV - cometer irregularidade ou infração disciplinar, passível de expulsão;\nV - não efetivar a matrícula dentro dos prazos previstos em calendário escolar;\nVI – sendo estrangeiro, estiver em situação irregular;\nVIII – estando com matrícula trancada e não reabri-la no prazo que culmine com sua integralização.\n§1º O cancelamento da matrícula dar-se-á pela ocorrência de um ou mais incisos deste artigo.\n§2º Ficam assegurados o direito a ampla defesa e de nova submissão ao processo seletivo ao estudante que tiver sua matrícula cancelada, salvo exceções previstas neste regulamento.\n§3º Não se aplica o exposto no inciso II às pessoas com necessidades educacionais específicas.',
    tags:'cancelamento cancelar matricula quero sair do curso desistir largar o curso abandonar desligamento desligado expulsao perder a vaga voltar processo seletivo' },

  { id:'odp-104', doc:'odp', artigo:'Art. 104', assunto:'Como pedir aproveitamento de estudos', tipo:'literal',
    texto:'Fica assegurado ao estudante juridicamente capaz, ou ao seu responsável legal, conforme o caso, a solicitação de aproveitamento de estudos formais e informais realizados no Brasil e/ou em país estrangeiro mediante requerimento dirigido à Direção/Gerência de Ensino ou a quem esta delegar.',
    tags:'aproveitamento de estudos requerimento aproveitar disciplina ja cursada aproveitar materia onde entregar o requerimento materia que ja fiz disciplina que ja fiz cursei em outra escola' },

  { id:'odp-105', doc:'odp', artigo:'Art. 105', assunto:'Quem analisa o aproveitamento de estudos', tipo:'literal',
    texto:'Cabem à coordenação de curso e/ou à coordenação técnico-pedagógica do Campus, a análise do mérito, conforme este regulamento e outras legislações.\n§ 1º O parecer deverá conter as seguintes partes:\nI – do Relatório – onde o relator descreverá sucintamente os autos processuais que foram considerados;\nII – da Análise – onde o relator embasará sua análise conforme ordenamento jurídico vigente e fundamentação pedagógica;\nIII – do Voto – onde o relator, mediante o exposto no relatório e análise, apresenta o DEFERIMENTO ou INDEREFIMENTO indicando despacho.\n§2º O voto deverá apresentar a seguinte deliberação:\nI – aproveitamento total, reduzido a termo e autuado na pasta do estudante e registrado em histórico escolar;\nII – aproveitamento parcial indicando ao requerente/interessado procedimentos para complementação de estudos, adaptações ou outros;\nIII – indeferimento do aproveitamento indicando os motivos que levaram à decisão.',
    tags:'aproveitamento analise coordenacao resultado total parcial indeferido complementacao' },

  { id:'odp-106', doc:'odp', artigo:'Art. 106', assunto:'Exame de proficiência', tipo:'literal',
    texto:'Resguarda-se ao Campus, nos reconhecimentos informais e havendo dúvidas quanto às alegações apresentadas pelo requerente nos autos processuais, a possibilidade de exames teórico-práticos de proficiência para fins de aproveitamento.',
    tags:'exame de proficiencia equivalencia duvida teorico pratico avaliar conhecimento' },

  { id:'odp-108', doc:'odp', artigo:'Art. 108', assunto:'Aproveitamento de certificados do ENEM', tipo:'literal',
    texto:'Os Campi aproveitarão os certificados parciais e totais dos estudantes que obtiverem pontuação igual ou superior aos mínimos exigidos para certificação e/ou para declaração parcial constante no Exame Nacional do Ensino Médio – ENEM.',
    tags:'enem certificado aproveitamento exame nacional ensino medio usar o enem para aproveitar disciplina materia componente curricular nota do enem' },

  { id:'odp-109', doc:'odp', artigo:'Art. 109', assunto:'Aproveitamento para quem foi reprovado', tipo:'literal',
    texto:'Faculta-se ao estudante que esteja reprovado em determinado ano/série/módulo o direito de solicitar aproveitamento de estudos daqueles componentes em que logrou êxito, devendo cursar apenas aqueles em que não obteve resultado satisfatório no ano/série/módulo em que ficou reprovado.\n§1º A situação prevista no caput deverá ser requerida pelo representante legal do estudante, se a situação o exigir.\n§ 2º No período/horários em que ficar dispensado de parte dos componentes curriculares, o estudante, assistido por seu responsável legal, deverá comprometer-se, conforme o caso, a se dedicar aos estudos com o propósito de sanar as dificuldades identificadas nos componentes em que não obteve êxito.',
    tags:'reprovado repetir ano aproveitar materias que passei exito refazer serie' },

  { id:'odp-89-91', doc:'odp', artigo:'Art. 89, I e Art. 91, §2º', assunto:'Revisão de nota e de situação final', tipo:'literal',
    texto:'Ao estudante reprovado e/ou seu representante legal que tenha esgotado suas possibilidades de revisão de nota e/ou conceito insuficientes junto ao PEBTT fica assegurado:\nI – ampla defesa e contraditório por meio de instauração de processo de revisão de situação final;\n[…]\nArt. 91. […]\n§2º As alterações de notas e/ou frequência serão efetuadas pelo PEBTT titular do componente curricular, no sistema escolar em uso, por meio de formulário específico ou na impossibilidade legal do PEBTT, pelo coordenador ou responsável do curso nos casos de deferimento de revisão de nota.',
    tags:'revisao de nota recorrer recurso contestar nota reprovado situacao final ampla defesa' },

  { id:'odp-52', doc:'odp', artigo:'Art. 52', assunto:'Estágio na carga horária do curso', tipo:'literal',
    texto:'A integralização dos estudos correspondentes aos conhecimentos científicos e tecnológicos será obtida pela efetivação da carga horária total fixada para cada curso, incluindo, quando for o caso, estágio, atividades complementares, trabalhos de conclusão de curso (TCC) ou outros elementos no campo do currículo, conforme especificidades previstas no PPC.',
    tags:'estagio carga horaria ppc projeto pedagogico obrigatorio curso tecnico' },

  { id:'odp-78-9', doc:'odp', artigo:'Art. 78, §9º, I', assunto:'Regime domiciliar e estágio', tipo:'literal',
    texto:'§9º Fica vedada a concessão de regime de exercício domiciliar para estudantes que:\nI - estejam faltando apenas à realização de estágios; e',
    tags:'regime domiciliar exercicio domiciliar atestado longo estagio afastamento aula em casa' },

  { id:'polae-30', doc:'polae', artigo:'Art. 30', assunto:'Quem pode receber auxílio estudantil', tipo:'literal',
    texto:'Para fins de concessão de auxílios financeiros, o Eixo de Serviços Essenciais é destinado a estudantes regularmente matriculados e frequentes nos cursos do ensino médio (integrado, subsequente e concomitante e PROEJA) e superior (bacharelado, tecnológico e licenciatura) que se encontram em situação de vulnerabilidade, de modo a atender com prioridade aqueles com renda per capita familiar de até 1,5 salário-mínimo e meio, visando essencialmente contribuir para a redução de índices de baixa frequência, retenção e evasão.\nParágrafo único. A concessão de auxílio financeiro voltado a qualquer um dos aspectos que compõem o Eixo de Serviços Essenciais ocorrerá por meio de estudo socioeconômico-cultural, via edital.',
    tags:'quem pode receber auxilio bolsa assistencia estudantil requisito matriculado frequente vulnerabilidade ensino medio integrado' },

  { id:'polae-44', doc:'polae', artigo:'Art. 44', assunto:'Tipos de auxílio oferecidos', tipo:'literal',
    texto:'Em atenção aos termos do Decreto nº 7.234/2010, bem como em observação às características do Eixo de Serviços Essenciais, a concessão de recursos para esse fim visa atender às seguintes áreas essenciais ou demandas: moradia; alimentação; transporte (locomoção entre a residência e o Campus); material didático; emergencial; cuidadores (infantil ou adulto dependentes); e auxílio emergencial.\nParágrafo único. A concessão dos auxílios ocorrerá por meio de processo de seleção, atendendo prioritariamente estudantes oriundos da rede pública de educação básica ou com renda familiar per capita de até um salário mínimo e meio, sem prejuízo de demais requisitos fixados pelo IFTO, levando-se em conta os níveis de vulnerabilidade alta, média e baixa, conforme indicadores dispostos no art. 39.',
    tags:'tipos de auxilio quais bolsas moradia alimentacao transporte material didatico emergencial cuidador lista' },

  { id:'polae-54', doc:'polae', artigo:'Art. 54', assunto:'Como se inscrever no auxílio', tipo:'literal',
    texto:'A solicitação de auxílios do Eixo de Serviços Essenciais requer do estudante, além de matrícula e frequências regulares, a realização dos seguintes procedimentos:\nI - preencher o formulário de inscrição e o questionário socioeconômico-cultural, anexando os documentos pertinentes indicados em edital e disponíveis no sistema, quando houver;\nII - apresentar documentação e comprovantes relacionados nos editais, no prazo estabelecido para efetivar a solicitação;\nIII - submeter-se à avaliação socioeconômica, realizada por profissional de Serviço Social;\nIV - participar de entrevista, visita domiciliar ou outros procedimentos que se fizerem necessários, realizados por profissional da Unidade de Gestão da Assistência Estudantil envolvido no processo de seleção;\nV - atender a critérios gerais e específicos da modalidade de auxílio solicitada;\nVI - acompanhar as divulgações pertinentes à assistência estudantil.',
    tags:'como se inscrever como pedir o auxilio como solicitar bolsa inscricao auxilio documentacao edital assistente social entrevista visita domiciliar selecao' },

  { id:'polae-59', doc:'polae', artigo:'Art. 59', assunto:'Indicadores de vulnerabilidade', tipo:'literal',
    texto:'A seleção dos estudantes para concessão de auxílios será realizada a partir da análise dos níveis de vulnerabilidades alta, média e baixa, considerando os seguintes indicadores:\nI - condições de trabalho do estudante e/ou de membros da família;\nII - situação de moradia do estudante e da família, e consumo de energia do grupo familiar;\nIII - relações de dependência financeira e afetiva do estudante;\nIV - composição familiar ou domiciliar e suas relações de dependência financeira e afetiva do estudante;\nV - existência de deficiência ou doença grave, crônica ou degenerativa do estudante ou de membro do grupo familiar;\nVI - distância entre residência e Campus;\nVII - meio e condições de transporte entre residência e Campus;\nVIII - família beneficiária de programas sociais (exemplo: Bolsa Família e Benefício de Prestação Continuada - BPC);\nIX - escolaridade dos responsáveis pela manutenção do domicílio;\nX - bens patrimoniais móveis, imóveis e semoventes de pessoas físicas ou jurídicas do estudante ou da família;\nXI - despesas familiares;\nXII - renda per capita do grupo familiar;\nXIII - participação do estudante na renda familiar;\nXIV - vínculo do estudante a outros auxílios financeiros que caracterizam o acúmulo de renda;\nXV - recebimento de benefícios e de outras atividades remuneradas pela família ou estudante;\nXVI - agravantes de vulnerabilidades identificados pelo profissional durante os procedimentos de seleção.',
    tags:'indicadores criterios vulnerabilidade renda per capita composicao familiar moradia distancia campus bolsa familia' },

  { id:'polae-61', doc:'polae', artigo:'Art. 61', assunto:'Grupos de vulnerabilidade', tipo:'literal',
    texto:'Para a concessão dos auxílios serão considerados os seguintes grupos:\nI - Grupo 3: Contempla os estudantes com alto grau de vulnerabilidade, expressando risco de não permanecer na instituição e atingir rendimento acadêmico/escolar satisfatório por falta ou insuficiência de recurso financeiro, questões socioculturais e ambientais.\nII - Grupo 2: Contempla os estudantes com médio grau de vulnerabilidade, expressando risco de não permanecer na instituição e atingir rendimento acadêmico/escolar satisfatório por falta ou insuficiência de recurso financeiro, questões socioculturais e ambientais.\nIII - Grupo 1: Contempla os estudantes com baixo grau de vulnerabilidade, expressando risco de não permanecer na instituição e atingir rendimento acadêmico/escolar satisfatório por falta ou insuficiência de recurso financeiro, questões socioculturais e ambientais.\n§ 1º Para fins de organização e transparência, o Serviço Social do IFTO deverá sistematizar o método de seleção para concessão de auxílios e elaborar documento para apresentação do mesmo no prazo de até seis meses a partir da data de aprovação desta normativa.\n§ 2º O método de seleção será apresentado no Comitê Estratégico de Assistência Estudantil para fins de institucionalização.',
    tags:'grupo 1 2 3 classificacao vulnerabilidade alta media baixa faixa' },

  { id:'polae-65', doc:'polae', artigo:'Art. 65', assunto:'Valor do auxílio por grupo', tipo:'literal',
    texto:'A concessão dos auxílios financeiros seguirá faixa de valores de acordo com o grupo de vulnerabilidade em que o estudante se encontra no momento do estudo socioeconômico-cultural:\nI - Grupo 3 Entre 40% e 50% do valor do salário mínimo vigente;\nII - Grupo 2 Entre 30% e 40% do valor do salário mínimo vigente;\nIII - Grupo 1 Entre 20% e 30% do valor do salário mínimo vigente;\nIV - Auxílio Emergencial: Até 150% do salário mínimo vigente, podendo ser dividido em até três vezes no ano letivo.\nParágrafo único. O valor referente a cada grupo será estabelecido em edital, de acordo com a disposição orçamentária do Campus.',
    tags:'valor do auxilio quanto recebe percentual salario minimo grupo faixa quanto paga' },

  { id:'polae-66', doc:'polae', artigo:'Art. 66', assunto:'Auxílio emergencial', tipo:'literal',
    texto:'O benefício do Auxílio Emergencial será oferecido circunstancialmente, de acordo com análise e parecer de assistente social ou, na ausência deste profissional, de acordo com análise e parecer de Comissão Local em conjunto com a Unidade de Gestão da Assistência Estudantil, que poderá ainda conferir encaminhamento para a rede de proteção social ou parcerias afins.\nParágrafo único. Em demandas relacionadas a epidemias, pandemias, desastres naturais ou outras situações de igual proporção de vulnerabilidades e riscos, caberá a Comissão Local de Assistência Estudantil junto com assistente(s) social(is) a análise e o parecer sobre a possibilidade de ampliação do tempo de concessão de auxílio emergencial, desde que haja disponibilidade orçamentária.',
    tags:'auxilio emergencial emergencia urgente quantas vezes ano parecer assistente social 150' },

  { id:'polae-47', doc:'polae', artigo:'Art. 47', assunto:'Subsídio de refeição', tipo:'literal',
    texto:'O subsídio da assistência estudantil destinado aos estudantes para as refeições nos restaurantes das unidades, quando houver, será concedido da seguinte forma:\nI - até 100% do valor de uma refeição diária para atender estudantes com renda, prioritariamente, per capita de até um salário mínimo e meio, considerando os critérios de seleção no expressos nesta normativa;\nII - até 50% do valor de uma refeição diária para atender os demais estudantes, conforme critérios estabelecidos em edital do Campus.\n§ 1º A Unidade de Gestão da Assistência Estudantil (Campus) tem autonomia para estabelecer critérios em edital para a concessão ou não dos 50% de subsídio de forma universal para estudantes com renda per capita superior a um salário mínimo e meio.\n§ 2º Em caso de atender todos os estudantes com renda per capita superior a um salário mínimo e meio, o orçamento utilizado deverá ser do Eixo Universal.',
    tags:'refeicao restaurante almoco subsidio alimentacao desconto comida' },

  { id:'polae-71', doc:'polae', artigo:'Art. 71', assunto:'Frequência exigida de quem recebe auxílio', tipo:'literal',
    texto:'A manutenção do recebimento mensal do auxílio estará sujeita às seguintes condicionalidades:\nI - frequência mínima global de 75% (cento) mensal e/ou,\nII - rendimento escolar/acadêmico satisfatório.',
    tags:'frequencia para manter o auxilio 75 rendimento beneficiario requisito mensal' },

  { id:'polae-73', doc:'polae', artigo:'Art. 73', assunto:'Obrigações de quem recebe auxílio', tipo:'literal',
    texto:'São responsabilidades do estudante contemplado com qualquer modalidade de auxílio:\nI - informar imediatamente à Unidade de Gestão de Assistência ao Estudantil ou a Comissão Local de Assistência Estudantil sobre quaisquer mudanças no quadro de vulnerabilidades socioeconômica-cultural;\nII - ter desempenho acadêmico/escolar mínimo para aprovação e frequência;\nIII - comunicar a Unidade de Gestão da Assistência Estudantil ou a Comissão Local de Assistência Estudantil se decidir transferir-se ou sair da Instituição;\nIV - participar de atendimentos individualizados e/ou em grupos, reuniões ou outros procedimentos/atividades quando convocado pela Unidade de Gestão da Assistência Estudantil e/ou Comissão Local de Assistência Estudantil, a partir de qualquer um dos serviços de atendimento e apoio ao estudante;\nV - devolver, por meio de Guia de Recolhimento da União (GRU), o auxílio recebido indevidamente;\nVI - possuir conta bancária em seu nome;\nVII - fazer prestação de contas;\nVIII - apresentar informações, quando solicitado.',
    tags:'obrigacoes deveres beneficiario conta bancaria devolver dinheiro gru prestar contas comunicar mudanca' },

  { id:'polae-74', doc:'polae', artigo:'Art. 74', assunto:'Suspensão do auxílio (bolsa) por frequência baixa', tipo:'literal',
    texto:'O estudante terá o seu pagamento do mês vigente suspenso, se a frequência do mês anterior for inferior a 75%, salvo em caso de faltas justificadas, na forma da legislação vigente, em suas atividades acadêmicas, ou por atestado médico;\nParágrafo único. Regularizada a frequência mínima mensal de 75%, ou formalizada justificativa plausível para a infrequência, o estudante terá o auxílio restabelecido no mês seguinte à suspensão.',
    tags:'suspensao corte do auxilio perdi a bolsa nao recebi pagamento suspenso falta frequencia por que perdi o auxilio' },

  { id:'polae-68', doc:'polae', artigo:'Art. 68', assunto:'Renovação do auxílio', tipo:'literal',
    texto:'A concessão de qualquer auxílio ao estudante que já tenha sido contemplado anteriormente estará condicionada ao rendimento acadêmico/escolar satisfatório, conforme estabelecido abaixo:\nI - aproveitamento de pelo menos 50% das disciplinas cursadas no ano ou semestre anterior, conforme regras do curso;\nII - a não reprovação por faltas.',
    tags:'renovar renovacao auxilio voltar a receber ano seguinte 50 por cento disciplinas reprovado por falta' },

  { id:'polae-92-99', doc:'polae', artigo:'Art. 92 e Art. 99', assunto:'Programa Auxílio-Viagem', tipo:'literal',
    texto:'O Programa consistirá em uma modalidade de auxílio financeiro para custear despesas com alimentação, pernoite e passagens (aéreas ou terrestres), se houver, durante o deslocamento em viagens nas seguintes situações:\nI - para participação em eventos de ensino, extensão, pesquisa, artísticos ou culturais com apresentação de trabalhos aprovados pela comissão organizadora, em localidade distinta do Campus onde está matriculado;\nII - para participação em atividades de ensino, extensão, pesquisa, artísticas, esportivas, culturais, quando selecionado para representar o IFTO em localidade distinta do Campus onde está matriculado.\nArt 99. O valor do auxílio-viagem será concedido obedecendo aos seguintes critérios:\nI - alimentação: até 8 % do salário mínimo (diário);\nII - pernoite: até 8 % do salário mínimo (diário);\nIII - até 15% do salário mínimo, uma única vez, para despesas com alimentação durante a viagem, quando a organização do evento oferecer alimentação e hospedagem.\n§ 1º O percentual tem por referência o valor do salário mínimo vigente.\n§ 2º Não será concedido o valor do auxílio referente a alimentação e/ou pernoite se a organização do evento oferecer um ou outro, ou os dois.',
    tags:'auxilio viagem evento competicao jice participar fora do campus apoio deslocamento' },

  { id:'polae-26', doc:'polae', artigo:'Art. 26, parágrafo único', assunto:'Prioridade por renda', tipo:'literal',
    texto:'Parágrafo único. A concessão de auxílios estudantis deverá considerar, prioritariamente, estudantes cuja renda familiar per capita seja de até um salário mínimo, conforme Decreto nº 7.234/2010.',
    tags:'prioridade renda per capita salario minimo limite criterio quem tem preferencia' },

  { id:'odp1-revogada', doc:'odp1', artigo:'Documento inteiro', assunto:'Edição anterior do regulamento (revogada)',
    texto:'Esta é a 1ª edição do Regulamento da Organização Didático-Pedagógica dos cursos técnicos presenciais, revogada pela Resolução Consup nº 23/2015. Não deve ser usada como referência: a versão vigente é a 2ª edição.',
    tags:'regulamento antigo primeira edicao revogada versao anterior 2011 desatualizada' },

  { id:'disc-4', doc:'disciplinar', artigo:'Art. 4º', assunto:'Direitos dos estudantes', tipo:'literal',
    texto:'São direitos dos discentes do IFTO:\nI - ter igualdade de condições para acesso e permanência na instituição;\nII - receber educação de qualidade, que promova o seu desenvolvimento profissional e humano;\nIII - ser respeitado por seus professores, coordenadores, servidores técnico-administrativos e colegas de classe;\n[…]\nVI - contestar critérios avaliativos, podendo recorrer às instâncias administrativas e, esgotando essas esferas, recorrer às instâncias superiores externas ao IFTO;\nVII - representar à coordenação ou ao setor competente do campus ou do polo, por escrito, contra irregularidades, abusos de poder e omissões de colegas, servidores e serviços da instituição;\nVIII - organizar entidades estudantis e delas participar;\n[…]',
    tags:'direitos do aluno quais sao meus direitos contestar nota recorrer representar denunciar abuso entidade estudantil gremio igualdade respeito' },

  { id:'disc-5', doc:'disciplinar', artigo:'Art. 5º', assunto:'Deveres do estudante', tipo:'literal',
    texto:'Constituem deveres do corpo discente do IFTO:\n[…]\nII - acatar as normas do Regimento Interno do IFTO, da ODP do curso, do Regulamento Disciplinar Discente, bem como dos demais documentos normativos internos, e as determinações da Reitoria, da Direção dos campi avançados, da Direção-Geral dos campi, dos coordenadores e tutores dos polos, e da Diretoria do Centro de Referência em Educação a Distância (CREAD) e de seus auxiliares;\nIII - tratar com respeito e urbanidade colegas, educadores, servidores e toda a comunidade do IFTO;\nIV - respeitar a etnia, raça, crença, gênero, sexualidade, convicções e autonomia de todos os servidores, colegas e comunidade, e valorizar as individualidades, sem praticar preconceito e discriminação de qualquer espécie;\n[…]\nVII - comparecer ao campus devidamente uniformizado, quando obrigatório, durante o seu período regular de estudo e em situações que assim exigir, portando documento de identificação exigido pela instituição;\n[…]\nX - frequentar, com assiduidade, pontualidade e interesse, as aulas, as solenidades e demais atividades;\n[…]\nXIII - aguardar o professor em sala de aula, por quinze minutos, não permanecendo nas áreas de circulação;\n[…]',
    tags:'deveres do aluno obrigacoes uniforme obrigatorio crachá identificacao esperar o professor quinze minutos assiduidade respeito' },

  { id:'disc-7', doc:'disciplinar', artigo:'Art. 7º', assunto:'O que pesa na hora de aplicar a sanção', tipo:'literal',
    texto:'No Regulamento Disciplinar Discente do IFTO, a aplicação das sanções disciplinares dar-se-á em conformidade com as seguintes condições:\nI - primariedade do autor da infração;\nII - culpa ou dolo;\nIII - gravidade da infração;\nIV - valor moral, cultural ou material atingido; e\nV - direito humano fundamental violado.',
    tags:'criterios da punicao primeira vez primariedade gravidade dolo culpa atenuante como decidem a pena' },

  { id:'disc-8', doc:'disciplinar', artigo:'Art. 8º', assunto:'As quatro penalidades possíveis', tipo:'literal',
    texto:'Serão aplicadas, por meio de termo específico, ao estudante que cometer infrações disciplinares ou transgredir os preceitos deste Regulamento Disciplinar Discente, as seguintes penalidades:\nI - advertência verbal;\nII - advertência por escrito;\nIII - suspensão por tempo determinado; e\nIV - cancelamento de matrícula.\n[…]',
    tags:'quais sao as punicoes que posso levar lista das penalidades tipos de punicao advertencia verbal escrito suspensao cancelamento de matricula o que pode acontecer comigo castigo' },

  { id:'disc-8-2', doc:'disciplinar', artigo:'Art. 8º, §§ 2º e 3º', assunto:'Reincidência: quando a punição sobe de nível', tipo:'literal',
    texto:'§ 2º A advertência por escrito é aplicada quando houver reincidência de atos que tenham levado à advertência verbal.\n§ 3º Caso ocorra o terceiro registro de uma infração sujeita à advertência por escrito, poderá levar à suspensão ou ao cancelamento de matrícula do estudante.',
    tags:'reincidencia terceira vez de novo repetir quantas vezes ate suspender agravamento' },

  { id:'disc-8-4', doc:'disciplinar', artigo:'Art. 8º, § 4º', assunto:'Por quanto tempo a punição fica registrada', tipo:'literal',
    texto:'§ 4º Os registros das penalidades aplicadas serão cancelados após transcorrerem os seguintes prazos:\nI - advertência verbal: um ano;\nII - advertência por escrito: dois anos;\nIII - suspensão: até a colação de grau; e\nIV - cancelamento da matrícula: até o ano subsequente.',
    tags:'quanto tempo fica registrado advertencia some apaga prazo registro ficha limpa um ano dois anos colacao de grau' },

  { id:'disc-8-5', doc:'disciplinar', artigo:'Art. 8º, § 5º', assunto:'Quem pode aplicar cada penalidade', tipo:'literal',
    texto:'§ 5º São competentes para aplicação das penalidades:\nI - qualquer servidor ou coordenador ou tutor de polo deverá fazer o registro do ocorrido na Ficha de Ocorrência (Anexo I) e encaminhá-la à Coordenação do Curso para preenchimento do Termo de Advertência (Anexo II);\nII - Coordenação de Curso ou Gerência ou Diretoria de Ensino para os incisos I e II do § 4º do art. 8º;\nIII - Gerência de Ensino ou Diretoria de Ensino ou Diretoria do CREAD ou Direção de campus avançado ou Direção-Geral de campus após deliberação da Comissão ou Equipe Disciplinar Discente Local para o inciso III do § 4º do art. 8º; e\nIV - Direção de campus avançado ou Direção-Geral de campus ou Diretoria do CREAD após deliberação da Comissão ou Equipe Disciplinar Discente Local para o inciso IV do § 4º do art. 8º.',
    tags:'quem aplica a punicao quem pode me advertir professor pode suspender coordenador diretor competencia ficha de ocorrencia' },

  { id:'disc-9', doc:'disciplinar', artigo:'Art. 9º', assunto:'Direito de defesa', tipo:'literal',
    texto:'A aplicação das medidas disciplinares deverá levar em consideração, na qualidade de instrumento da prática educativa, a garantia do amplo direito de defesa aos envolvidos no caso.',
    tags:'direito de defesa me defender ampla defesa contraditorio posso explicar meu lado' },

  { id:'disc-11-i', doc:'disciplinar', artigo:'Art. 11, I', assunto:'O que dá advertência verbal', tipo:'literal',
    texto:'Serão consideradas infrações disciplinares passíveis de aplicação de penalidades os seguintes comportamentos:\nI - para a advertência verbal:\na) ausentar-se da sala de aula ou da instituição sem comunicar ao professor ou coordenador ou tutor de polo quando em encontros presenciais;\nb) alimentar-se em sala de aula, sala de multimeios, sala de projeções, laboratórios, auditórios ou piscinas, salvo com anuência do professor ou coordenador ou tutor de polo;\nc) permanecer, sem autorização do professor ou coordenador ou tutor de polo, em sala de aula, sala de multimeios, laboratório, auditório ou sala de projeções após o término das atividades escolares ou o término das atividades presenciais;\nd) permanecer em quadras, piscinas e demais espaços destinados às práticas esportivas fora das atividades de Educação Física, quando não autorizado pela Gerência ou Diretoria de Ensino ou Coordenação de Área ou de Curso;\ne) provocar ou participar de atividades que comprometam a disciplina nas dependências da instituição ou do polo, especialmente nos locais destinados a aulas e a outras atividades curriculares;\nf) manter-se fora da sala no período em que estiver sendo ministrada aula; e\ng) usar códigos e linguagem impróprios e praticar atos que não estejam de acordo com os princípios da ética, da dignidade, do decoro, do zelo e da consciência dos princípios morais.\n[…]',
    tags:'advertencia verbal infracao de menor gravidade comer em sala sair de sala matar aula andar no corredor bagunca conversa' },

  { id:'disc-11-ii', doc:'disciplinar', artigo:'Art. 11, II', assunto:'O que dá advertência por escrito', tipo:'literal',
    texto:'Serão consideradas infrações disciplinares passíveis de aplicação de penalidades os seguintes comportamentos:\n[…]\nII - para a advertência por escrito:\n[…]\nc) desrespeitar, ofender, provocar com palavras, atos ou gestos colegas, professores, técnicos administrativos, colaboradores ou qualquer outra pessoa nas dependências da instituição ou do polo;\n[…]\ne) aplicar trotes que agridam a integridade física e/ou psicológica de estudantes novatos ou veteranos e que não estejam previamente acordados com a Coordenação do Curso ou do Polo;\nf) apresentar-se na instituição ou no polo ou representá-la alcoolizado ou sob efeito de qualquer substância tóxica;\ng) danificar, furtar ou subtrair objetos pertencentes a outrem ou à instituição;\n[…]\ni) utilizar-se de quaisquer meios fraudulentos, como falsificar assinatura de professor ou nota de prova, cometer plágio, físico ou virtual, para obter resultados favoráveis nas avaliações;\n[…]\nl) fumar, no pátio e nas dependências da instituição e do polo, cigarros ou narguilé eletrônico (Lei nº 9.294, de 15 de julho de 1996);\nm) utilizar telefone celular, smartphone, tablet, gravadores de imagem e/ou áudio ou outros aparelhos eletrônicos similares sem prévia autorização;\nn) fotografar, filmar ou gravar áudio de qualquer atividade didática sem autorização expressa do professor;\n[…]',
    tags:'advertencia por escrito cola colar na prova plagio posso usar celular em sala de aula smartphone tablet filmar gravar o professor trote fumar narguile vandalismo furto desrespeito ofensa colei fraude fraudar avaliacao verificacao de aprendizagem' },

  { id:'disc-11-iii', doc:'disciplinar', artigo:'Art. 11, III', assunto:'O que dá suspensão', tipo:'literal',
    texto:'Serão consideradas infrações disciplinares passíveis de aplicação de penalidades os seguintes comportamentos:\n[…]\nIII - para suspensão assistida dentro da instituição por até três dias úteis:\na) praticar qualquer ação que implique em constrangimento recorrente a outros estudantes que se configure como bullying, presencial ou virtual, prática de injúria racial, racismo, preconceito, discriminação ou qualquer outro tipo de ação;\nb) desrespeitar, ofender, provocar com palavras, atos ou gestos colegas, professores, técnicos administrativos, colaboradores, demais servidores ou qualquer outra pessoa nas dependências da instituição ou em encontros virtuais; e\nc) apresentar-se na instituição ou no polo sob efeito de entorpecentes ou similares como cocaína, maconha, crack, heroína ou qualquer uma substância psicoativa.\n[…]',
    tags:'suspensao o que da suspensao quantos dias tres dias uteis bullying racismo preconceito discriminacao droga suspensao assistida' },

  { id:'disc-11-iv', doc:'disciplinar', artigo:'Art. 11, IV', assunto:'O que dá cancelamento de matrícula', tipo:'literal',
    texto:'Serão consideradas infrações disciplinares passíveis de aplicação de penalidades os seguintes comportamentos:\n[…]\nIV - para o cancelamento da matrícula:\na) agredir fisicamente qualquer pessoa nas dependências do campus/campus avançado/polo do IFTO, exceto no caso de legítima defesa;\nb) praticar delitos sujeitos à ação penal;\nc) participar de atos que possam caracterizar-se como calúnia, injúria ou difamação ao IFTO, a estudantes ou a qualquer membro de sua comunidade;\n[…]\ne) praticar tráfico de entorpecentes;\nf) trazer, guardar, oferecer ou fornecer, no campus/campus avançado/polo, bebidas alcoólicas, qualquer substância tóxica ou psicotrópica, armas e materiais inflamáveis, explosivos de qualquer natureza ou qualquer elemento que represente perigo para si e para a comunidade escolar;\ng) praticar qualquer ação ou omissão baseada no gênero, independente de o estudante se identificar com algum, que lhe cause estudante lesão, sofrimento físico, psicológico e dano moral;\n[…]\ni) praticar violência psicológica, entendida como qualquer conduta que cause dano emocional e diminuição da autoestima;\n[…]',
    tags:'briga brigar dar soco agressao fisica expulsao expulso cancelamento da matricula por infracao trafico arma crime violencia infracao gravissima' },

  { id:'disc-18', doc:'disciplinar', artigo:'Art. 18', assunto:'Como o processo tramita', tipo:'literal',
    texto:'Após a apuração dos fatos, a Comissão/Equipe Disciplinar Discente Local emitirá parecer e enviará à Gerência/Diretoria de Ensino ou setor equivalente, que encaminhará ao diretor-geral/diretor do campus/campus avançado ou à Diretoria do CREAD, para a aplicação da medida disciplinar cabível.\nParágrafo único. Quando o ato estiver capitulado na Lei Penal, será remetida cópia com autenticação administrativa dos autos à autoridade competente pelo diretor-geral/diretor do campus/campus avançado ou pela Diretoria do CREAD.',
    tags:'como funciona o processo disciplinar tramite comissao parecer quem decide policia lei penal apuracao' },

  { id:'disc-19', doc:'disciplinar', artigo:'Art. 19', assunto:'A punição não vai para o histórico escolar', tipo:'literal',
    texto:'O registro das penalidades aplicadas a membro do corpo discente será feito por meio do Termo de Advertência (Anexo II) nas situações dispostas no art. 8º, incisos I e II; e nos casos do art. 8º, incisos III e IV, por meio do Relatório Final de Procedimento Disciplinar Discente Local (Anexo VI), arquivado na pasta do discente, não devendo constar no histórico escolar.',
    tags:'vai para o historico escolar advertencia aparece no historico mancha ficha registro pasta do aluno prejudica' },

  { id:'disc-20', doc:'disciplinar', artigo:'Art. 20', assunto:'Depois do cancelamento, quando dá para voltar', tipo:'literal',
    texto:'Obedecendo ao devido processo, o cancelamento da matrícula implicará o impedimento de nova matrícula no ano subsequente, mesmo que o discente seja aprovado em processo seletivo posterior ao ato infracional, conforme indicado pela Comissão /Equipe Disciplinar Discente Local e ratificado pelo diretor-geral/diretor do campus/campus avançado ou pela Diretoria do CREAD.',
    tags:'voltar depois de expulso nova matricula ano seguinte impedimento processo seletivo readmissao' },

  { id:'disc-22', doc:'disciplinar', artigo:'Art. 22', assunto:'Prazo para recorrer da punição', tipo:'literal',
    texto:'O estudante terá direito a recurso (Anexo IV), no prazo de até três dias úteis, a contar da publicação da decisão da Comissão/Equipe Disciplinar Discente Local.',
    tags:'recurso recorrer da punicao levei uma advertencia e agora fui advertido fui suspenso prazo tres dias uteis como contestar discordo da decisao o que fazer' },

  { id:'disc-23', doc:'disciplinar', artigo:'Art. 23', assunto:'Prazo de resposta ao recurso', tipo:'literal',
    texto:'A Comissão/Equipe Disciplinar Discente Local terá até três dias úteis para resposta ao recurso impetrado pelo discente.',
    tags:'quanto tempo demora a resposta do recurso prazo da comissao tres dias uteis' },

  { id:'doc-5', doc:'docente', artigo:'Art. 5º', assunto:'Os regimes de trabalho do docente', tipo:'literal',
    texto:'Ao docente do IFTO ocupante de cargo efetivo será aplicado um dos seguintes regimes de trabalho:\nI - tempo integral de 40 (quarenta) horas semanais de trabalho, com dedicação exclusiva às atividades de ensino, pesquisa, extensão e gestão institucional;\nII - tempo parcial de 20 (vinte) horas semanais de trabalho.\n§ 1º Excepcionalmente, poderá ser admitida a adoção do regime de 40 (quarenta) horas semanais de trabalho, em tempo integral, observando 2 (dois) turnos diários completos, sem dedicação exclusiva, para áreas com características específicas.\n[…]',
    tags:'regime de trabalho do professor 40 horas 20 horas dedicacao exclusiva tempo integral tempo parcial jornada docente' },

  { id:'doc-5-3', doc:'docente', artigo:'Art. 5º, § 3º', assunto:'O que a dedicação exclusiva impede', tipo:'literal',
    texto:'§ 3º O regime de 40 (quarenta) horas com dedicação exclusiva implica o impedimento do exercício de outra atividade remunerada, pública ou privada, com as exceções previstas em Lei.',
    tags:'dedicacao exclusiva posso dar aula fora trabalhar em outro lugar outra renda impedimento DE' },

  { id:'doc-11', doc:'docente', artigo:'Art. 11', assunto:'Como se muda de regime de trabalho', tipo:'literal',
    texto:'As alterações dos regimes de trabalho do docente ocorrerão mediante publicação de edital específico para este fim.\n[…]\n§ 2º A condução do edital de que trata o caput será de responsabilidade da Comissão Permanente de Pessoal Docente Local – CPPD da unidade, que fará a análise e o parecer das solicitações.\n[…]\n§ 4º A alteração de regime de trabalho somente poderá ser concedida desde que não ultrapasse o total do banco de professor-equivalente direcionado a professores efetivos da unidade.\n[…]',
    tags:'mudar de regime passar para 40 horas pedir dedicacao exclusiva edital cppd banco de professor equivalente' },

  { id:'doc-14', doc:'docente', artigo:'Art. 14', assunto:'Pontuação mínima para conseguir dedicação exclusiva', tipo:'literal',
    texto:'Está vedada ao docente a alteração do regime de trabalho para tempo integral com Dedicação Exclusiva quando o resultado da soma das pontuações previstas nas alíneas “a”, “b” e “c” do art. 12 for inferior a 200 (duzentos) pontos.',
    tags:'pontuacao minima dedicacao exclusiva 200 pontos nao consegui mudar regime vedada alteracao' },

  { id:'doc-16', doc:'docente', artigo:'Art. 16', assunto:'Limite de professores em tempo parcial', tipo:'literal',
    texto:'A alteração de regime de trabalho de tempo integral com Dedicação Exclusiva ou tempo integral sem Dedicação Exclusiva para tempo parcial observará:\nI - o limite máximo de 20% (vinte por cento) do total do quadro de docentes efetivos no campus em regime de trabalho de tempo parcial;\nII - o parecer de viabilidade elaborado exclusivamente pelo diretor/gerente de ensino da unidade.\n[…]',
    tags:'passar para 20 horas tempo parcial limite 20 por cento quadro do campus reduzir jornada' },

  { id:'doc-18', doc:'docente', artigo:'Art. 18', assunto:'Atividades gerais do docente', tipo:'literal',
    texto:'São atividades gerais do docente:\nI - participar da elaboração da proposta pedagógica do IFTO e da unidade a que está vinculado;\nII - elaborar e cumprir o Plano Individual de Trabalho – PIT, em conformidade com este regulamento;\nIII - zelar pela aprendizagem dos estudantes;\nIV - estabelecer estratégias de recuperação para os alunos de menor rendimento;\nV - cumprir os dias letivos e ministrar as horas-aula estabelecidas, além de participar integralmente dos períodos dedicados ao planejamento, à avaliação e ao desenvolvimento do estudante;\n[…]',
    tags:'obrigacoes do professor atribuicoes deveres docente recuperacao planejamento dias letivos' },

  { id:'doc-21', doc:'docente', artigo:'Art. 21', assunto:'Prazo de entrega do PIT', tipo:'literal',
    texto:'O Plano Individual de Trabalho deverá ser elaborado no início de cada semestre letivo e protocolizado na chefia imediata em até quinze dias corridos após o início do semestre letivo.\n§ 1º Havendo alteração definitiva ou com prazo superior a 20 (vinte) dias das atividades registradas no Plano Individual de Trabalho, o docente deverá encaminhar, via SEI, para a chefia imediata, em até 15 (quinze) dias corridos, versão atualizada do documento, gerando versão retificadora.\n[…]',
    tags:'pit plano individual de trabalho prazo quinze dias entregar retificar sei chefia imediata' },

  { id:'doc-24', doc:'docente', artigo:'Art. 24, § 2º', assunto:'Limite de aulas para quem está no mestrado ou doutorado', tipo:'literal',
    texto:'§ 2º Docentes credenciados em programas stricto sensu (mestrado ou doutorado) oferecidos pelo IFTO terão carga horária semanal de, no máximo, 12 (doze) aulas, incluídas as horas-aula do programa.',
    tags:'stricto sensu mestrado doutorado limite de aulas doze aulas credenciado programa pos graduacao' },

  { id:'doc-25', doc:'docente', artigo:'Art. 25, parágrafo único', assunto:'Quanto vale uma hora-aula', tipo:'literal',
    texto:'Parágrafo único. Considerando condições de deslocamento dentro das unidades do IFTO e ambientação de docentes e discentes no espaço escolar/acadêmico, computar-se-á 60 (sessenta) minutos – 1 (uma) hora – de trabalho como equivalente a uma hora-aula para fins de jornada de trabalho do docente.',
    tags:'hora aula quanto vale sessenta minutos uma hora equivalencia jornada' },

  { id:'doc-27', doc:'docente', artigo:'Art. 27', assunto:'Mínimo e máximo de aulas por semana', tipo:'literal',
    texto:'Para fins de atribuição dos valores previstos no campo Aulas, Apêndice A, observar-se-ão:\nI - o docente com regime de trabalho de 20 (vinte) horas semanais deverá cumprir a carga horária mínima de 8 (oito) e máxima de 12 (doze) horas semanais com aulas;\nII - o docente com regime de trabalho de 40 (quarenta) horas semanais, sem Dedicação Exclusiva, deverá cumprir a carga horária mínima de 10 (dez) e máxima de 20 (vinte) horas semanais com aulas; e\nIII - o docente com regime de trabalho de 40 (quarenta) horas semanais, com Dedicação Exclusiva, deverá cumprir a carga horária mínima de 10 (dez) e máxima de 20 (vinte) horas semanais com aulas.\n[…]',
    tags:'quantas aulas por semana carga horaria minima maxima de aula limite de aulas 20 horas 40 horas quantas aulas devo dar' },

  { id:'doc-34', doc:'docente', artigo:'Art. 34', assunto:'O que conta como apoio ao ensino', tipo:'literal',
    texto:'Serão consideradas atividades de apoio ao ensino as ações do docente diretamente vinculadas às matrizes curriculares e programas dos cursos regulares autorizados do IFTO, compreendendo:\nI - atendimento ao estudante (conforme quantitativos definidos nas Tabelas 1 e 2 do Apêndice A);\nII - orientação de Trabalho de Conclusão de Curso – TCC em curso técnico (até duas horas por orientando);\nIII - orientação de TCC em curso de graduação (até duas horas por orientando);\nIV - orientação de TCC em curso de pós-graduação (até três horas por orientando);\n[…]\nVI - orientação de estágio curricular supervisionado (até uma hora por orientando);\n[…]\nIX - coordenação de projeto de ensino (até oito horas por projeto);\n[…]\nXI - tutoria presencial (até uma hora para cada cinquenta estudantes);\n[…]',
    tags:'orientar tcc quantas horas por orientando estagio projeto de ensino tutoria atendimento ao aluno apoio ao ensino' },

  { id:'doc-42', doc:'docente', artigo:'Art. 42', assunto:'Horas das funções administrativas', tipo:'literal',
    texto:'Serão consideradas Atividades de Administrativas aquelas desenvolvidas em caráter temporário ou permanente no âmbito IFTO vinculadas diretamente a cargos comissionados; funções gratificadas; funções não gratificadas ou comissões não gratificadas, compreendendo, mas não se limitando a:\nI - Direção-Geral de campus (até quarenta horas semanais);\n[…]\nIII - Gerência/Direção de Ensino (até vinte e duas horas semanais);\nIV - Coordenação de Curso de Nível Médio: Técnico Integrado, Técnico Subsequente, Técnico Concomitante, Proeja ou FIC (até vinte horas semanais);\n[…]\nVI - Coordenação de Área de Conhecimento/Eixo Tecnológico (até doze horas semanais);\n[…]\nVIII - Responsabilidade Técnica por Laboratório (até oito horas semanais);\n[…]\nXIII - Coordenação do Núcleo de Atendimento de Pessoas com Necessidades Específicas – NAPNE (até quatro horas semanais);\n[…]',
    tags:'coordenacao de curso quantas horas funcao administrativa direcao gerencia napne laboratorio carga horaria de gestao' },

  { id:'doc-49', doc:'docente', artigo:'Arts. 47, 49 e 50', assunto:'RESAD, o relatório semestral', tipo:'literal',
    texto:'As atividades de capacitação deverão ser apresentadas por meio do Relatório Semestral de Atividades Desenvolvidas – RESAD.\nParágrafo único. A não apresentação do RESAD, dentro dos prazos determinados, tornará o professor inadimplente.\nArt. 49. O relatório de atividades desenvolvidas deverá ser apresentado, obrigatoriamente, em caráter semestral.\n[…]\nArt. 50. O relatório de atividades desenvolvidas, devidamente preenchido, deverá ser entregue, via Sistema Informatizado, à chefia imediata, na data do início do semestre letivo subsequente.\n[…]',
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
  'odp-12-viii': 'Se suas faltas passarem de 12,5% do tempo escolar, o campus é obrigado a enviar seu nome ao Conselho Tutelar, ao juiz da comarca e ao Ministério Público. Não é uma punição: é um dever que o regulamento dá à instituição.',
  'odp-75': 'Se você perdeu uma prova ou não entregou um trabalho, pode pedir uma nova oportunidade à Direção ou Gerência de Ensino. O prazo é de até 72 horas úteis depois que o motivo da ausência terminar, e você precisa comprovar o impedimento, por exemplo com atestado médico. Os motivos aceitos estão listados no parágrafo único do artigo.',
  'odp-80': 'A recuperação acontece ao longo do período, não só no fim. Se sua nota numa etapa ficar abaixo de 6,0, o professor deve oferecer recuperação. Se você tirar mais na recuperação, a nova nota substitui a anterior.',
  'odp-81': 'A recuperação pode ser feita na própria sala de aula ou no horário de atendimento do professor. Pergunte a ele quando e onde vai ser a sua.',
  'odp-83': 'O conselho de classe reúne a Direção ou Gerência de Ensino, os professores da sua turma, o coordenador do curso ou da área, alguém da equipe técnico-pedagógica e um representante dos estudantes. Ou seja, os alunos têm voz nele.',
  'odp-85': 'O conselho de classe se reúne pelo menos ao fim de cada etapa (bimestre, trimestre ou o que o PPC definir), em data prevista no calendário. Também pode haver reunião extra quando a Direção ou Gerência de Ensino convoca para tratar de um assunto específico.',
  'odp-86-87': 'Se você terminar o período com média abaixo de 6,0, o conselho de classe analisa seu caso. Ele pode aprovar você se sua média global for 5,0 ou mais e/ou se você estiver abaixo de 6,0 em no máximo metade das disciplinas. É uma possibilidade, não uma garantia.',
  'odp-110': 'Você pode trancar a matrícula em situações como serviço militar, tratamento de saúde prolongado, gravidez com atestado médico ou para acompanhar cônjuge ou parente de primeiro grau em tratamento. Atenção: no primeiro ano, semestre ou módulo do curso o trancamento não é permitido, salvo as exceções previstas em lei.',
  'odp-111': 'Se você trancou a matrícula, tem até dois semestres letivos para reabri-la ou justificar um pedido de prorrogação no registro escolar (CORES) ou no setor responsável. Sem uma coisa nem outra, a matrícula é cancelada.',
  'odp-40': 'Sua matrícula pode ser cancelada se você pedir, se não concluir o curso no prazo máximo, se apresentar documento falso, se cometer infração passível de expulsão, se não fizer a matrícula no prazo do calendário, entre outros casos. Você tem direito à ampla defesa e pode voltar a participar do processo seletivo, salvo as exceções do próprio regulamento.',
  'odp-104': 'Você pode pedir o aproveitamento de estudos que já fez, formais ou informais, no Brasil ou no exterior. O pedido é feito por requerimento à Direção ou Gerência de Ensino (ou a quem ela indicar); se você for menor de idade, seu responsável faz o pedido.',
  'odp-105': 'Quem analisa seu pedido de aproveitamento é a coordenação do curso ou a coordenação técnico-pedagógica. A resposta pode ser aproveitamento total, aproveitamento parcial (você complementa o que faltar) ou indeferimento.',
  'odp-106': 'Quando o pedido de aproveitamento se baseia em conhecimentos que você adquiriu fora da escola e houver dúvida sobre o que você apresentou, o campus pode aplicar um exame teórico-prático de proficiência.',
  'odp-108': 'Se você atingiu no ENEM a pontuação mínima exigida para certificação ou para declaração parcial, o campus aproveita esse certificado nos seus estudos.',
  'odp-109': 'Se você foi reprovado no ano, série ou módulo, pode pedir o aproveitamento das disciplinas em que passou e cursar de novo só aquelas em que não passou. Nos horários livres, você se compromete a estudar para superar as dificuldades.',
  'odp-89-91': 'Se você foi reprovado e já tentou revisar a nota com o professor, pode abrir um processo de revisão da situação final, com direito a apresentar sua defesa. Se o pedido for aceito, quem corrige é o professor titular ou, se ele estiver impedido, o coordenador do curso.',
  'odp-52': 'Para concluir o curso, você precisa cumprir toda a carga horária prevista, que pode incluir estágio, atividades complementares e TCC, conforme o Projeto Pedagógico do Curso (PPC). Consulte o PPC do seu curso para saber o que vale no seu caso.',
  'odp-78-9': 'Se você só não consegue ir ao estágio, mas pode frequentar as aulas, não tem direito ao regime de exercícios domiciliares.',
  'polae-30': 'Os auxílios do eixo de serviços essenciais são para quem está matriculado e frequentando o ensino médio (integrado, subsequente, concomitante ou PROEJA) ou o ensino superior e está em situação de vulnerabilidade. A prioridade é para renda familiar por pessoa de até um salário mínimo e meio, e a seleção é feita por estudo socioeconômico, via edital.',
  'polae-44': 'Os auxílios essenciais cobrem moradia, alimentação, transporte até o campus, material didático, emergências e cuidadores (de criança ou de adulto dependente). A escolha é feita por seleção, com prioridade para quem veio da escola pública ou tem renda familiar por pessoa de até um salário mínimo e meio.',
  'polae-54': 'Para conseguir o auxílio, você se inscreve no edital, entrega os documentos pedidos e passa por uma avaliação socioeconômica com assistente social, que pode incluir entrevista ou visita à sua casa. Também precisa cumprir os critérios do edital.',
  'polae-59': 'A avaliação da sua situação usa 16 indicadores, entre eles a renda por pessoa da família, quem compõe a família, a condição da moradia, a distância até o campus e os benefícios sociais que vocês recebem.',
  'polae-61': 'Depois da avaliação, você é classificado em um de três grupos: Grupo 1 (baixa vulnerabilidade), Grupo 2 (média) ou Grupo 3 (alta).',
  'polae-65': 'O valor depende do seu grupo e é calculado sobre o salário mínimo: o Grupo 3 recebe de 40% a 50%, o Grupo 2 de 30% a 40% e o Grupo 1 de 20% a 30%. O auxílio emergencial pode chegar a 150% do salário mínimo, dividido em até três vezes no ano letivo. O valor exato de cada grupo sai no edital do campus.',
  'polae-66': 'O Auxílio Emergencial é concedido caso a caso, depois da análise e do parecer de um assistente social (ou, se não houver, da Comissão Local junto com a Unidade de Gestão da Assistência Estudantil). Em situações como epidemias ou desastres naturais, o tempo de concessão pode ser ampliado, se houver orçamento.',
  'polae-47': 'No restaurante, a refeição pode ser subsidiada em até 100% para quem tem renda familiar por pessoa de até um salário mínimo e meio e em até 50% para os demais estudantes, conforme o edital do campus.',
  'polae-71': 'Para continuar recebendo o auxílio, você precisa manter pelo menos 75% de frequência no mês e/ou rendimento acadêmico satisfatório.',
  'polae-73': 'Quem recebe auxílio tem deveres: avisar se sua situação mudar, manter o desempenho mínimo, comunicar transferência ou saída, ir aos atendimentos quando for chamado, devolver por GRU o que receber indevidamente, ter conta bancária no próprio nome e prestar contas.',
  'polae-74': 'Se sua frequência num mês ficar abaixo de 75%, o pagamento do mês seguinte é suspenso, a não ser que as faltas sejam justificadas na forma da lei ou por atestado médico. Quando a frequência volta a 75% (ou você justifica as faltas), o auxílio volta no mês seguinte.',
  'polae-68': 'Para voltar a receber o auxílio, você precisa ter aproveitado pelo menos metade das disciplinas e não pode ter sido reprovado por faltas.',
  'polae-92-99': 'O Auxílio-Viagem ajuda a pagar alimentação, pernoite e passagens quando você viaja para apresentar um trabalho aprovado num evento ou para representar o IFTO fora do seu campus. Alimentação e pernoite têm teto de 8% do salário mínimo por dia cada, e não são pagos se o evento já oferecer.',
  'polae-26': 'Na concessão dos auxílios, têm prioridade os estudantes com renda familiar por pessoa de até um salário mínimo. Atenção: outros artigos da mesma política, como o 30 e o 44, falam em um salário mínimo e meio, então confira o limite no edital.',
  'odp1-revogada': 'Este documento é a versão antiga do regulamento e não vale mais. Para qualquer dúvida, use a 2ª edição, que é a vigente.',

  'disc-4': 'Você tem direito a igualdade de condições para entrar e permanecer no IFTO, a uma educação de qualidade e a ser respeitado por professores, servidores e colegas. Se discordar dos critérios de uma avaliação, pode contestar nas instâncias administrativas do IFTO e, esgotadas essas, recorrer a instâncias externas. Você também pode denunciar por escrito abusos e irregularidades à coordenação ou ao setor responsável, e pode organizar entidades estudantis e participar delas.',
  'disc-5': 'Você deve seguir as normas do IFTO, tratar todos com respeito e respeitar a etnia, a raça, a crença, o gênero, a sexualidade e as convicções de cada pessoa. Quando o uniforme for obrigatório, vá uniformizado e leve o documento de identificação exigido. Também deve frequentar as aulas com assiduidade e pontualidade e, se o professor atrasar, esperar por ele em sala por 15 minutos.',
  'disc-7': 'A punição depende de cinco fatores: se é a sua primeira infração, se houve intenção (dolo) ou só culpa, a gravidade do que aconteceu, o valor moral, cultural ou material atingido e se algum direito humano fundamental foi violado. Ou seja, não se olha só para qual foi a infração: as circunstâncias do seu caso também pesam.',
  'disc-8': 'Existem quatro punições possíveis: advertência verbal, advertência por escrito, suspensão por tempo determinado e cancelamento da matrícula. Qualquer uma delas é aplicada por meio de um termo específico, ou seja, fica registrada por escrito.',
  'disc-8-2': 'Se você repetir uma infração que já rendeu advertência verbal, a punição passa a ser advertência por escrito. Se chegar ao terceiro registro de uma infração que dá advertência por escrito, você pode ser suspenso ou ter a matrícula cancelada.',
  'disc-8-4': 'A punição não fica registrada para sempre: a advertência verbal é apagada depois de 1 ano e a advertência por escrito depois de 2 anos. A suspensão fica registrada até a colação de grau, e o cancelamento da matrícula até o ano seguinte.',
  'disc-8-5': 'O professor ou outro servidor não aplica a punição: ele registra o ocorrido na Ficha de Ocorrência e encaminha à Coordenação do Curso. As advertências verbal e por escrito ficam com a Coordenação de Curso ou com a Gerência ou Diretoria de Ensino. A suspensão (Gerência ou Diretoria de Ensino, Diretoria do CREAD, Direção de campus avançado ou Direção-Geral) e o cancelamento de matrícula (Direção de campus avançado, Direção-Geral ou Diretoria do CREAD) só vêm depois que a Comissão ou Equipe Disciplinar Discente Local delibera sobre o seu caso.',
  'disc-9': 'Se você for acusado de uma infração, tem garantido o amplo direito de defesa, ou seja, de apresentar a sua versão dos fatos. A norma trata a medida disciplinar como um instrumento educativo, e por isso a sua defesa precisa ser levada em conta na decisão.',
  'disc-11-i': 'Infrações mais leves, como sair da sala ou do campus sem avisar o professor ou o coordenador, comer em sala ou laboratório sem permissão, ficar fora da sala durante a aula ou usar linguagem imprópria, podem render advertência verbal. Ficar sem autorização nesses espaços depois das atividades, usar quadras e piscinas fora das aulas de Educação Física sem permissão e provocar bagunça que comprometa a disciplina também entram na lista.',
  'disc-11-ii': 'Colar ou plagiar, falsificar assinatura ou nota, usar celular ou tablet sem autorização, filmar, fotografar ou gravar a aula sem permissão do professor e fumar cigarro ou narguilé eletrônico no campus podem render advertência por escrito. O mesmo vale para ofender alguém, aplicar trote que agrida um colega, chegar alcoolizado e danificar ou furtar objetos.',
  'disc-11-iii': 'Bullying (presencial ou virtual), injúria racial, racismo, preconceito, discriminação, ofender pessoas no campus ou em encontros virtuais e chegar sob efeito de drogas podem levar a suspensão de até 3 dias úteis. A suspensão é assistida e cumprida dentro da própria instituição.',
  'disc-11-iv': 'As infrações mais graves podem levar ao cancelamento da sua matrícula: agredir fisicamente alguém no IFTO (a não ser em legítima defesa), cometer crime, traficar drogas ou trazer bebida alcoólica, armas ou explosivos para o campus. Caluniar, injuriar ou difamar o IFTO ou alguém da comunidade, praticar violência psicológica ou violência baseada em gênero também estão na lista.',
  'disc-18': 'Depois de apurar os fatos, a Comissão ou Equipe Disciplinar Discente Local dá um parecer, que passa pela Gerência ou Diretoria de Ensino e chega ao diretor-geral do campus (ou à Diretoria do CREAD), que aplica a medida. Se o que você fez também for crime pela lei penal, uma cópia do processo é enviada à autoridade competente.',
  'disc-19': 'A punição não aparece no seu histórico escolar. As advertências ficam registradas num Termo de Advertência, e a suspensão e o cancelamento num relatório final arquivado na sua pasta de estudante.',
  'disc-20': 'Se sua matrícula for cancelada por infração, você não pode se matricular de novo no ano seguinte, mesmo que seja aprovado num novo processo seletivo feito depois do ocorrido. Esse impedimento é indicado pela Comissão ou Equipe Disciplinar Discente Local e confirmado pelo diretor do campus ou pela Diretoria do CREAD.',
  'disc-22': 'Sim, você pode recorrer se não concordar com a decisão. O prazo é de até 3 dias úteis e começa a contar da publicação da decisão da Comissão ou Equipe Disciplinar Discente Local. Fique de olho nessa data para não perder o prazo.',
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