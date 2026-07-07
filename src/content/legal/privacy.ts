import type { LegalDocSet } from "./types";

// Traducción de referencia (borrador) de "Privacy Notice.docx".
// El inglés es el texto rector; es y pt-br están pendientes de revisión legal.
export const privacy: LegalDocSet = {
  en: {
    title: "Privacy Notice",
    description:
      "How Giivngo collects, uses, and shares personal data of Pool Creators and Contributors who use the platform.",
    updated: "2026-07-04",
    sections: [
      {
        n: "1",
        title: "Overview",
        body: [
          {
            k: "p",
            text: 'Giivngo ("Giivngo," "we," "us," or "our") operates a group money-pooling platform that allows people to collect and contribute funds together in connection with celebrations and life events, such as birthdays, weddings, group trips, and baby showers. Giivngo is not a charity, donation, or hardship-fundraising platform, and this Notice should not be drafted or read as if it were one.',
          },
          {
            k: "p",
            text: 'This Privacy Notice ("Notice") describes how Giivngo collects, uses, and shares personal data about individuals who use the platform, including Pool Creators (organizers who set up a pooled collection) and Contributors (participants who contribute funds to a pool).',
          },
        ],
      },
      { n: "2", title: "What Personal Data We Collect" },
      {
        n: "2.1",
        title: "Data Collected Directly From You",
        body: [
          {
            k: "p",
            text: "When you create an account or otherwise use Giivngo as a Pool Creator or a Contributor, we collect the following personal data directly from you:",
          },
          { k: "ul", items: ["Name", "Email address", "Phone number", "Date of birth"] },
        ],
      },
      {
        n: "2.2",
        title: "Data We Do Not Collect Directly",
        body: [
          {
            k: "p",
            text: "Giivngo does not collect or hold payment card numbers, bank account details, or other full payment credentials. Payment information is collected and processed directly by our third-party payment processor, Stripe. See Section 3 below.",
          },
        ],
      },
      {
        n: "2.3",
        title: "Data Collected Automatically or Via Third-Party Tools",
        body: [
          {
            k: "p",
            text: "In connection with operating the platform, the following categories of data may be processed by tools we use, as described further in Section 5 below:",
          },
          {
            k: "ul",
            items: [
              "Website and app usage data, collected via Google Analytics",
              "Business correspondence data, where you email us or we email you, processed via Gmail",
              "Contact and marketing-related data, processed via our CRM/marketing platform, Go High Level (GHL)",
            ],
          },
        ],
      },
      {
        n: "3",
        title: "How Payment Information Is Handled",
        body: [
          {
            k: "p",
            text: 'All payment processing on Giivngo is performed by Stripe, Inc. ("Stripe"), a third-party payment processor. When a Pool Creator or Contributor makes or receives a payment through Giivngo, payment details — such as card numbers, bank account information, and other payment credentials — are submitted to and held by Stripe, not by Giivngo.',
          },
          {
            k: "p",
            text: "Giivngo does not store full card numbers, bank account numbers, or other complete payment credentials on its own systems. Stripe processes this information as an independent party in connection with the payment services it provides.",
          },
        ],
      },
      {
        n: "4",
        title: "How We Use Personal Data",
        body: [
          {
            k: "p",
            text: "Giivngo anticipates using the personal data described in Section 2 for purposes that may include:",
          },
          {
            k: "ul",
            items: [
              "Creating and administering Pool Creator and Contributor accounts",
              "Enabling the creation, administration, and operation of pools for celebrations and life events",
              "Facilitating communication between Pool Creators and Contributors in connection with a pool",
              "Communicating with users about their accounts or pools, including service and administrative communications",
              "Operating, maintaining, and improving the platform, including through analysis of usage data",
              "Business correspondence with users",
              "Marketing communications, where applicable, via our CRM/marketing platform",
            ],
          },
        ],
      },
      {
        n: "5",
        title: "How We Share Personal Data",
        body: [
          {
            k: "p",
            text: "We share personal data with the following categories of third parties, each of which processes data in connection with services they provide to Giivngo:",
          },
        ],
      },
      {
        n: "5.1",
        title: "Stripe (Payment Processing)",
        body: [
          {
            k: "p",
            text: "Stripe processes payment information in connection with pool contributions, withdrawals, and related transactions, as described in Section 3.",
          },
        ],
      },
      {
        n: "5.2",
        title: "Google Analytics (Analytics)",
        body: [
          {
            k: "p",
            text: "Google Analytics is used to analyze usage of the Giivngo website and/or app.",
          },
        ],
      },
      {
        n: "5.3",
        title: "Gmail (Business Email Correspondence)",
        body: [
          { k: "p", text: "Gmail is used for business email correspondence with users." },
        ],
      },
      {
        n: "5.4",
        title: "Go High Level / GHL (CRM and Marketing)",
        body: [
          {
            k: "p",
            text: "Go High Level (GHL) is used as a customer relationship management and marketing platform.",
          },
          {
            k: "p",
            lead: "Note on third-party data practices:",
            text: "This Notice identifies Stripe, Google Analytics, Gmail, and Go High Level as third parties/sub-processors that may process personal data in connection with the Giivngo platform.",
          },
        ],
      },
      {
        n: "6",
        title: "International Data Transfers",
        body: [
          {
            k: "p",
            text: "Giivngo operates in Australia, the United States, and Latin America. As a result, personal data may be transferred between and processed in these regions.",
          },
        ],
      },
      {
        n: "7",
        title: "Your Rights",
        body: [
          {
            k: "p",
            text: "Depending on where you are located, you may have certain rights regarding your personal data. The applicable rights, and the specific laws that give rise to them, depend on your jurisdiction.",
          },
        ],
      },
      {
        n: "8",
        title: "Cookies and Tracking Technologies",
        body: [
          {
            k: "p",
            text: "Giivngo uses Google Analytics to understand how the platform is used. Google Analytics may use cookies and similar tracking technologies to collect information about your device and your interactions with the Giivngo website and/or app.",
          },
        ],
      },
      {
        n: "9",
        title: "Contact Information",
        body: [
          {
            k: "p",
            text: "If you have questions about this Notice or about how Giivngo handles personal data, you can contact us at: support@giivngo.com.",
          },
        ],
      },
    ],
  },

  es: {
    title: "Aviso de Privacidad",
    description:
      "Cómo Giivngo recopila, usa y comparte los datos personales de los Organizadores y Participantes que usan la plataforma.",
    updated: "2026-07-04",
    sections: [
      {
        n: "1",
        title: "Descripción general",
        body: [
          {
            k: "p",
            text: 'Giivngo ("Giivngo", "nosotros" o "nuestro") opera una plataforma de colectas grupales que permite a las personas juntar y aportar fondos en conjunto en el marco de celebraciones y momentos importantes de la vida, como cumpleaños, casamientos, viajes en grupo y baby showers. Giivngo no es una plataforma de caridad, donaciones ni recaudación para situaciones de necesidad, y este Aviso no debe redactarse ni leerse como si lo fuera.',
          },
          {
            k: "p",
            text: 'Este Aviso de Privacidad ("Aviso") describe cómo Giivngo recopila, usa y comparte datos personales de las personas que usan la plataforma, incluidos los Organizadores (quienes crean una colecta) y los Participantes (quienes aportan fondos a una colecta).',
          },
        ],
      },
      { n: "2", title: "Qué datos personales recopilamos" },
      {
        n: "2.1",
        title: "Datos que recopilamos directamente de ti",
        body: [
          {
            k: "p",
            text: "Cuando creas una cuenta o usas Giivngo como Organizador o Participante, recopilamos los siguientes datos personales directamente de ti:",
          },
          {
            k: "ul",
            items: [
              "Nombre",
              "Dirección de correo electrónico",
              "Número de teléfono",
              "Fecha de nacimiento",
            ],
          },
        ],
      },
      {
        n: "2.2",
        title: "Datos que no recopilamos directamente",
        body: [
          {
            k: "p",
            text: "Giivngo no recopila ni conserva números de tarjetas de pago, datos de cuentas bancarias ni otras credenciales de pago completas. La información de pago es recopilada y procesada directamente por nuestro procesador de pagos externo, Stripe. Consulta la Sección 3 más abajo.",
          },
        ],
      },
      {
        n: "2.3",
        title: "Datos recopilados de forma automática o mediante herramientas de terceros",
        body: [
          {
            k: "p",
            text: "En relación con la operación de la plataforma, las siguientes categorías de datos pueden ser procesadas por herramientas que usamos, como se describe con más detalle en la Sección 5 más abajo:",
          },
          {
            k: "ul",
            items: [
              "Datos de uso del sitio web y de la app, recopilados mediante Google Analytics",
              "Datos de correspondencia comercial, cuando nos escribes o te escribimos, procesados mediante Gmail",
              "Datos de contacto y de marketing, procesados mediante nuestra plataforma de CRM/marketing, Go High Level (GHL)",
            ],
          },
        ],
      },
      {
        n: "3",
        title: "Cómo se maneja la información de pago",
        body: [
          {
            k: "p",
            text: 'Todo el procesamiento de pagos en Giivngo lo realiza Stripe, Inc. ("Stripe"), un procesador de pagos externo. Cuando un Organizador o Participante realiza o recibe un pago a través de Giivngo, los datos de pago —como números de tarjeta, información de cuentas bancarias y otras credenciales de pago— se envían a Stripe y quedan en su poder, no en el de Giivngo.',
          },
          {
            k: "p",
            text: "Giivngo no almacena números completos de tarjeta, números de cuentas bancarias ni otras credenciales de pago completas en sus propios sistemas. Stripe procesa esta información como parte independiente en relación con los servicios de pago que presta.",
          },
        ],
      },
      {
        n: "4",
        title: "Cómo usamos los datos personales",
        body: [
          {
            k: "p",
            text: "Giivngo prevé usar los datos personales descritos en la Sección 2 para fines que pueden incluir:",
          },
          {
            k: "ul",
            items: [
              "Crear y administrar las cuentas de Organizadores y Participantes",
              "Permitir la creación, administración y operación de colectas para celebraciones y momentos importantes de la vida",
              "Facilitar la comunicación entre Organizadores y Participantes en relación con una colecta",
              "Comunicarnos con los usuarios sobre sus cuentas o colectas, incluidas comunicaciones de servicio y administrativas",
              "Operar, mantener y mejorar la plataforma, incluido el análisis de los datos de uso",
              "Mantener correspondencia comercial con los usuarios",
              "Enviar comunicaciones de marketing, cuando corresponda, mediante nuestra plataforma de CRM/marketing",
            ],
          },
        ],
      },
      {
        n: "5",
        title: "Cómo compartimos los datos personales",
        body: [
          {
            k: "p",
            text: "Compartimos datos personales con las siguientes categorías de terceros, cada uno de los cuales procesa datos en relación con los servicios que le prestan a Giivngo:",
          },
        ],
      },
      {
        n: "5.1",
        title: "Stripe (procesamiento de pagos)",
        body: [
          {
            k: "p",
            text: "Stripe procesa la información de pago en relación con los aportes a colectas, los retiros y las transacciones relacionadas, como se describe en la Sección 3.",
          },
        ],
      },
      {
        n: "5.2",
        title: "Google Analytics (analítica)",
        body: [
          {
            k: "p",
            text: "Google Analytics se usa para analizar el uso del sitio web y/o la app de Giivngo.",
          },
        ],
      },
      {
        n: "5.3",
        title: "Gmail (correspondencia comercial por correo)",
        body: [
          {
            k: "p",
            text: "Gmail se usa para la correspondencia comercial por correo electrónico con los usuarios.",
          },
        ],
      },
      {
        n: "5.4",
        title: "Go High Level / GHL (CRM y marketing)",
        body: [
          {
            k: "p",
            text: "Go High Level (GHL) se usa como plataforma de gestión de relaciones con los clientes (CRM) y de marketing.",
          },
          {
            k: "p",
            lead: "Nota sobre las prácticas de datos de terceros:",
            text: "Este Aviso identifica a Stripe, Google Analytics, Gmail y Go High Level como terceros/subprocesadores que pueden procesar datos personales en relación con la plataforma de Giivngo.",
          },
        ],
      },
      {
        n: "6",
        title: "Transferencias internacionales de datos",
        body: [
          {
            k: "p",
            text: "Giivngo opera en Australia, Estados Unidos y América Latina. Como resultado, los datos personales pueden transferirse entre estas regiones y procesarse en ellas.",
          },
        ],
      },
      {
        n: "7",
        title: "Tus derechos",
        body: [
          {
            k: "p",
            text: "Según dónde te encuentres, es posible que tengas ciertos derechos sobre tus datos personales. Los derechos aplicables, y las leyes específicas que los otorgan, dependen de tu jurisdicción.",
          },
        ],
      },
      {
        n: "8",
        title: "Cookies y tecnologías de seguimiento",
        body: [
          {
            k: "p",
            text: "Giivngo usa Google Analytics para entender cómo se usa la plataforma. Google Analytics puede usar cookies y tecnologías de seguimiento similares para recopilar información sobre tu dispositivo y tus interacciones con el sitio web y/o la app de Giivngo.",
          },
        ],
      },
      {
        n: "9",
        title: "Información de contacto",
        body: [
          {
            k: "p",
            text: "Si tienes preguntas sobre este Aviso o sobre cómo Giivngo maneja los datos personales, puedes escribirnos a: support@giivngo.com.",
          },
        ],
      },
    ],
  },

  "pt-br": {
    title: "Aviso de Privacidade",
    description:
      "Como a Giivngo coleta, usa e compartilha os dados pessoais dos Organizadores e Participantes que usam a plataforma.",
    updated: "2026-07-04",
    sections: [
      {
        n: "1",
        title: "Visão geral",
        body: [
          {
            k: "p",
            text: 'A Giivngo ("Giivngo", "nós" ou "nosso") opera uma plataforma de vaquinhas em grupo que permite que as pessoas juntem e contribuam com fundos em conjunto no contexto de celebrações e momentos importantes da vida, como aniversários, casamentos, viagens em grupo e chás de bebê. A Giivngo não é uma plataforma de caridade, doações nem de arrecadação para situações de dificuldade, e este Aviso não deve ser redigido nem lido como se fosse.',
          },
          {
            k: "p",
            text: 'Este Aviso de Privacidade ("Aviso") descreve como a Giivngo coleta, usa e compartilha dados pessoais das pessoas que usam a plataforma, incluindo os Organizadores (quem cria uma vaquinha) e os Participantes (quem contribui com fundos para uma vaquinha).',
          },
        ],
      },
      { n: "2", title: "Quais dados pessoais coletamos" },
      {
        n: "2.1",
        title: "Dados coletados diretamente de você",
        body: [
          {
            k: "p",
            text: "Quando você cria uma conta ou usa a Giivngo como Organizador ou Participante, coletamos os seguintes dados pessoais diretamente de você:",
          },
          {
            k: "ul",
            items: ["Nome", "Endereço de e-mail", "Número de telefone", "Data de nascimento"],
          },
        ],
      },
      {
        n: "2.2",
        title: "Dados que não coletamos diretamente",
        body: [
          {
            k: "p",
            text: "A Giivngo não coleta nem mantém números de cartões de pagamento, dados de contas bancárias ou outras credenciais de pagamento completas. As informações de pagamento são coletadas e processadas diretamente pelo nosso processador de pagamentos terceirizado, a Stripe. Consulte a Seção 3 abaixo.",
          },
        ],
      },
      {
        n: "2.3",
        title: "Dados coletados automaticamente ou por meio de ferramentas de terceiros",
        body: [
          {
            k: "p",
            text: "No contexto da operação da plataforma, as seguintes categorias de dados podem ser processadas por ferramentas que usamos, conforme descrito com mais detalhes na Seção 5 abaixo:",
          },
          {
            k: "ul",
            items: [
              "Dados de uso do site e do app, coletados por meio do Google Analytics",
              "Dados de correspondência comercial, quando você nos escreve ou nós escrevemos para você, processados por meio do Gmail",
              "Dados de contato e de marketing, processados por meio da nossa plataforma de CRM/marketing, Go High Level (GHL)",
            ],
          },
        ],
      },
      {
        n: "3",
        title: "Como as informações de pagamento são tratadas",
        body: [
          {
            k: "p",
            text: 'Todo o processamento de pagamentos na Giivngo é realizado pela Stripe, Inc. ("Stripe"), um processador de pagamentos terceirizado. Quando um Organizador ou Participante faz ou recebe um pagamento por meio da Giivngo, os dados de pagamento — como números de cartão, informações de conta bancária e outras credenciais de pagamento — são enviados à Stripe e ficam sob a sua guarda, e não da Giivngo.',
          },
          {
            k: "p",
            text: "A Giivngo não armazena números completos de cartão, números de contas bancárias nem outras credenciais de pagamento completas nos seus próprios sistemas. A Stripe processa essas informações como parte independente, no contexto dos serviços de pagamento que presta.",
          },
        ],
      },
      {
        n: "4",
        title: "Como usamos os dados pessoais",
        body: [
          {
            k: "p",
            text: "A Giivngo pretende usar os dados pessoais descritos na Seção 2 para finalidades que podem incluir:",
          },
          {
            k: "ul",
            items: [
              "Criar e administrar as contas de Organizadores e Participantes",
              "Permitir a criação, administração e operação de vaquinhas para celebrações e momentos importantes da vida",
              "Facilitar a comunicação entre Organizadores e Participantes no contexto de uma vaquinha",
              "Comunicar-nos com os usuários sobre suas contas ou vaquinhas, incluindo comunicações de serviço e administrativas",
              "Operar, manter e melhorar a plataforma, inclusive por meio da análise dos dados de uso",
              "Manter correspondência comercial com os usuários",
              "Enviar comunicações de marketing, quando aplicável, por meio da nossa plataforma de CRM/marketing",
            ],
          },
        ],
      },
      {
        n: "5",
        title: "Como compartilhamos os dados pessoais",
        body: [
          {
            k: "p",
            text: "Compartilhamos dados pessoais com as seguintes categorias de terceiros, cada um dos quais processa dados no contexto dos serviços que presta à Giivngo:",
          },
        ],
      },
      {
        n: "5.1",
        title: "Stripe (processamento de pagamentos)",
        body: [
          {
            k: "p",
            text: "A Stripe processa informações de pagamento no contexto das contribuições para vaquinhas, dos saques e das transações relacionadas, conforme descrito na Seção 3.",
          },
        ],
      },
      {
        n: "5.2",
        title: "Google Analytics (análise)",
        body: [
          {
            k: "p",
            text: "O Google Analytics é usado para analisar o uso do site e/ou do app da Giivngo.",
          },
        ],
      },
      {
        n: "5.3",
        title: "Gmail (correspondência comercial por e-mail)",
        body: [
          {
            k: "p",
            text: "O Gmail é usado para a correspondência comercial por e-mail com os usuários.",
          },
        ],
      },
      {
        n: "5.4",
        title: "Go High Level / GHL (CRM e marketing)",
        body: [
          {
            k: "p",
            text: "O Go High Level (GHL) é usado como plataforma de gestão de relacionamento com o cliente (CRM) e de marketing.",
          },
          {
            k: "p",
            lead: "Nota sobre as práticas de dados de terceiros:",
            text: "Este Aviso identifica a Stripe, o Google Analytics, o Gmail e o Go High Level como terceiros/suboperadores que podem processar dados pessoais no contexto da plataforma da Giivngo.",
          },
        ],
      },
      {
        n: "6",
        title: "Transferências internacionais de dados",
        body: [
          {
            k: "p",
            text: "A Giivngo opera na Austrália, nos Estados Unidos e na América Latina. Como resultado, os dados pessoais podem ser transferidos entre essas regiões e processados nelas.",
          },
        ],
      },
      {
        n: "7",
        title: "Seus direitos",
        body: [
          {
            k: "p",
            text: "Dependendo de onde você estiver, você pode ter certos direitos em relação aos seus dados pessoais. Os direitos aplicáveis, e as leis específicas que os originam, dependem da sua jurisdição.",
          },
        ],
      },
      {
        n: "8",
        title: "Cookies e tecnologias de rastreamento",
        body: [
          {
            k: "p",
            text: "A Giivngo usa o Google Analytics para entender como a plataforma é usada. O Google Analytics pode usar cookies e tecnologias de rastreamento semelhantes para coletar informações sobre o seu dispositivo e as suas interações com o site e/ou o app da Giivngo.",
          },
        ],
      },
      {
        n: "9",
        title: "Informações de contato",
        body: [
          {
            k: "p",
            text: "Se você tiver dúvidas sobre este Aviso ou sobre como a Giivngo trata os dados pessoais, entre em contato conosco em: support@giivngo.com.",
          },
        ],
      },
    ],
  },
};
