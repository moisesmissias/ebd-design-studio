export interface Subtopic {
  id: string;
  number: string;
  title: string;
  content: string;
}

export interface Topic {
  id: string;
  number: string;
  title: string;
  content: string;
  subtopics: Subtopic[];
}

export interface ReflectionQuestion {
  id: string;
  number: number;
  question: string;
}

export interface MagazineContent {
  lessonTitle: string;
  lessonNumber: string;
  goldenText: string;
  goldenTextReference: string;
  objectives: string[];
  biblicalReading: string;
  biblicalReadingReference: string;
  introduction: string;
  topics: Topic[];
  conclusion: string;
  theologicalSubsidies: string;
  reflectionQuestions: ReflectionQuestion[];
}

export const defaultContent: MagazineContent = {
  lessonTitle: "A Mordomia Cristã",
  lessonNumber: "Lição 1",
  goldenText: "E disse o Senhor: Qual é, pois, o mordomo fiel e prudente, a quem o senhor pôs sobre os seus servos, para lhes dar a tempo a ração? Bem-aventurado aquele servo a quem o senhor, quando vier, achar fazendo assim",
  goldenTextReference: "Lucas 12.42,43",
  objectives: [
    "Apresentar o conceito de \"Mordomo\" e de \"Mordomia\"",
    "Expor acerca da mordomia espiritual do cristão",
    "Explicar a mordomia dos bens materiais"
  ],
  biblicalReading: `42 — E disse o Senhor: O qual é, pois, o mordomo fiel e prudente, a quem o senhor pôs sobre os seus servos, para lhes dar a tempo a ração?
43 — Bem-aventurado aquele servo a quem o senhor, quando vier, achar fazendo assim.
44 — Em verdade vos digo que sobre todos os seus bens o porá.
45 — Mas, se aquele servo disser em seu coração: O meu senhor tarda em vir, e começar a espancar os criados e criadas, e a comer, e a beber, e a embriagar-se,
46 — virá o Senhor daquele servo no dia em que o não espera e numa hora que ele não sabe, e separá-lo-á, e lhe dará a sua parte com os infiéis.
47 — E o servo que soube a vontade do seu senhor e não se aprontou, nem fez conforme a sua vontade, será castigado com muitos açoites.
48 — Mas o que a não soube e fez coisas dignas de açoites com poucos açoites será castigado. E a qualquer que muito for dado, muito se lhe pedirá, e ao que muito se lhe confiou, muito mais se lhe pedirá.`,
  biblicalReadingReference: "Lucas 12:42-48",
  introduction: `Neste trimestre, estudaremos a Mordomia Cristã. Ela prioriza os bens espirituais e materiais que o Criador nos delegou. Nesta lição, denominamos "bens espirituais" os recursos e os meios confiados por Deus à Igreja.

Quanto aos "bens materiais", são estes os recursos naturais e sociais que desfrutamos no mundo. Assim, veremos que o Pai levantou a Igreja para cuidar dos seus interesses na Terra. Tanto no Antigo quanto no Novo Testamento essa função corresponde à de um administrador. Portanto, nós somos mordomos de Deus e, à luz do Novo Testamento, os líderes espirituais têm maior responsabilidade perante o Senhor da Igreja (Lc 12.48).`,
  topics: [
    {
      id: "topic-1",
      number: "I",
      title: "CONCEITOS DE MORDOMIA",
      content: "",
      subtopics: [
        {
          id: "subtopic-1-1",
          number: "1",
          title: "Mordomo",
          content: `A palavra vem do latim, major domu, e significa "o criado maior da casa", "administrador dos bens de uma casa", "ecônomo" (Dicionário Aurélio). Na Bíblia, a função aparece diversas vezes como "encarregado administrativo dos bens de um grande proprietário de terras".`
        },
        {
          id: "subtopic-1-2",
          number: "2",
          title: "Mordomia",
          content: `A palavra significa "cargo ou ofício do mordomo; mordomado". Sua origem está no termo grego oikonomia e, por isso, a encontramos em alguns textos do Novo Testamento, como na "Parábola do mordomo infiel" (Lc 16.2-4). Na Bíblia, mordomia diz respeito a todo serviço que o crente realiza para Deus e o seu comportamento diante do Pai e dos homens.`
        },
        {
          id: "subtopic-1-3",
          number: "3",
          title: "Administração dos bens",
          content: `É a administração dos bens espirituais e materiais, tanto no aspecto individual quanto no coletivo do ser humano. Assim, nossas faculdades espirituais, emocionais e físicas são o objeto da Mordomia Cristã. Por isso, esta mordomia está ligada ao ensino da Palavra de Deus.`
        }
      ]
    },
    {
      id: "topic-2",
      number: "II",
      title: "A MORDOMIA ESPIRITUAL DO CRISTÃO",
      content: "",
      subtopics: [
        {
          id: "subtopic-2-1",
          number: "1",
          title: "A mordomia do amor cristão",
          content: `A mordomia cristã deve dar grande valor à prática do amor. Certa vez, um fariseu resolveu testar Jesus quanto à sua visão sobre os mandamentos da Lei de Moisés. Abordando Jesus, indagou-lhe: "Mestre, qual é o grande mandamento da lei?" (Mt 22.36). E Jesus respondeu: "Amarás o Senhor, teu Deus, de todo o teu coração, de toda a tua alma e de todo o teu pensamento" (22.37). E também: "Amarás o teu próximo como a ti mesmo" (22.39).`
        },
        {
          id: "subtopic-2-2",
          number: "2",
          title: "A mordomia da fé cristã",
          content: `A palavra fé (gr. pistis; lat. fides) traz a ideia de confiança que depositamos em todas providências de Deus. A melhor definição de fé foi enunciada pelo autor da Epístola aos Hebreus: "Ora, a fé é o firme fundamento das coisas que se esperam e a prova das coisas que se não veem" (Hb 11.1).`
        },
        {
          id: "subtopic-2-3",
          number: "3",
          title: "A fé como patrimônio espiritual",
          content: `A fé cristã é o depósito espiritual acumulado durante toda vida do crente. É o nosso patrimônio espiritual, de valor e virtudes inestimáveis. Ao escrever ao jovem discípulo, Timóteo, o apóstolo Paulo disse: "Combati o bom combate, acabei a carreira, guardei a fé" (2Tm 4.7).`
        }
      ]
    },
    {
      id: "topic-3",
      number: "III",
      title: "A MORDOMIA DOS BENS MATERIAIS",
      content: "",
      subtopics: [
        {
          id: "subtopic-3-1",
          number: "1",
          title: "O cristão e as finanças",
          content: `Na mordomia dos bens materiais, o cristão deve trabalhar honestamente para garantir sua sobrevivência financeira. Desde o Gênesis, após a Queda, o homem emprega esforços para obter os bens de que necessita. Isso é feito de maneira constante (1Ts 4.11), aspirando a uma vida tranquila, cuidando do que é próprio e trabalhando com as próprias mãos.`
        },
        {
          id: "subtopic-3-2",
          number: "2",
          title: "O cristão e as riquezas",
          content: `A Bíblia mostra que a avareza é a idolatria ao dinheiro. Sobre isso as Escrituras asseveram: "Porque o amor do dinheiro é a raiz de toda espécie de males" (1Tm 6.10). E Jesus ensinou: "Acautelai-vos e guardai-vos da avareza, porque a vida de qualquer não consiste na abundância do que possui" (Lc 12.15).`
        },
        {
          id: "subtopic-3-3",
          number: "3",
          title: "O cristão e a contribuição para a igreja",
          content: `Na igreja local há várias maneiras pelas quais o cristão pode e deve contribuir para a expansão e manutenção da Obra do Senhor. Essa contribuição deve ser feita através dos dízimos e das ofertas voluntárias (cf. Ml 3.8-12). Jesus reiterou a necessidade da contribuição com os dízimos (Mt 23.23).`
        }
      ]
    }
  ],
  conclusion: `Somos mordomos dos bens espirituais e materiais concedidos por Deus à sua Igreja. Se realizarmos nossa mordomia para a glória de Deus, com gratidão pelos bens adquiridos, seremos recompensados pelo Senhor. Usemos os recursos que Deus nos concedeu como verdadeiros mordomos de Nosso Senhor Jesus Cristo. Tudo o que temos vem do Senhor!`,
  theologicalSubsidies: `O mordomo é o servo fiel e prudente colocado por Deus para executar a mordomia — a administração responsável de tudo o que pertence ao Senhor (1Co 4.1-2). Essa função não é opcional, mas uma vocação divina: o crente gerencia os dons, tempo, recursos e relacionamentos como quem presta contas ao Dono absoluto de todas as coisas (Sl 24.1).

No Reino de Deus, essa relação se dá entre o crente e as dimensões de sua vida nas esferas espiritual e social, onde Jesus nos chama a sermos fiéis no pouco para recebermos o muito (Lc 16.10-12). O mordomo fiel de Lucas 12.42-44 sustenta os conservos na ausência do senhor, recebendo recompensa; já o infiel enfrenta juízo severo.

Somos salvos pela graça mediante a fé (Ef 2.8). Sem fé, não poderemos agradar a Deus (Hb 11.6). A fé, portanto, é a atitude da nossa dependência confiante e obediente em Deus e na sua fidelidade.`,
  reflectionQuestions: [
    { id: "q1", number: 1, question: "Como administro meu tempo nas redes sociais, evitando o desperdício que rouba horas preciosas (Ef 5.15-16)?" },
    { id: "q2", number: 2, question: "Meu ministério online ou presencial progride com diligência, ou fica paralisado pela distração (Cl 4.17)?" },
    { id: "q3", number: 3, question: "Minha vida espiritual resiste ao estresse diário, com momentos diários de oração e meditação na Escritura (Sl 1.2; 1Ts 5.17)?" },
    { id: "q4", number: 4, question: "Meu orçamento familiar suporta a inflação sem murmuração, priorizando o essencial e a generosidade (Mt 6.31-33; Hb 13.5)?" },
    { id: "q5", number: 5, question: "Como posso ser um mordomo fiel dos talentos e dons que Deus me concedeu?" },
    { id: "q6", number: 6, question: "De que forma a minha mordomia reflete o amor de Cristo ao próximo?" }
  ]
};
