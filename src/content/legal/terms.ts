import type { LegalDocSet } from "./types";

// Traducción de referencia (borrador) de "GiivngoTerms of Use.docx".
// El inglés es el texto rector; es y pt-br están pendientes de revisión legal.
// NOTA: se conservan los marcadores del documento fuente ([FEES …], [SIX (6) /
// TWELVE (12)]) y se normalizó la numeración final (fuente: 19 → "20.1").
export const terms: LegalDocSet = {
  en: {
    title: "Terms of Use",
    description:
      "The terms governing access to and use of Giivngo's website, apps, and related services.",
    updated: "2026-07-04",
    sections: [
      { n: "1", title: "Introduction" },
      {
        n: "1.1",
        title: "About these Terms",
        body: [
          {
            k: "p",
            text: "These Terms of Use (\"Terms\") govern access to and use of Giivngo's website, mobile applications, and related services (together, the \"Platform\"). By creating a Pool, contributing to a Pool, or otherwise using the Platform, you agree to be bound by these Terms.",
          },
        ],
      },
      {
        n: "1.2",
        title: "Contracting Entity",
        body: [
          { k: "p", text: "GIIVNGO AUSTRALIA — Giivngo currently operates primarily in Australia." },
        ],
      },
      {
        n: "1.3",
        title: "Nature of the Service",
        body: [
          {
            k: "p",
            text: "Giivngo is a technology platform that enables an Organiser to create a shared money pool (\"Pool\") around a personal celebration or milestone (for example, a birthday, wedding, new baby, farewell, team trip, or similar happy occasion), and enables Contributors to add funds toward that Pool's stated goal.",
          },
        ],
      },
      {
        n: "1.4",
        title: "What Giivngo Is Not",
        body: [
          {
            k: "p",
            text: "Giivngo is not a charity, not a fundraising-for-hardship or crowdfunding-for-cause platform, not a gambling, wagering, betting, sports-tipping, or lottery-pool service, and not a peer-to-peer lending platform. Pools may only be created for the purposes described in Section 6 (Permitted Purpose of Pools).",
          },
        ],
      },
      { n: "2", title: "Definitions" },
      {
        n: "2.1",
        title: "Account",
        body: [{ k: "p", text: "A registered profile that allows a User to access and use the Platform." }],
      },
      { n: "2.2", title: "Contributor", body: [{ k: "p", text: "A person who adds funds to a Pool." }] },
      { n: "2.3", title: "Organiser", body: [{ k: "p", text: "A person who creates and manages a Pool." }] },
      {
        n: "2.4",
        title: "Pool",
        body: [
          {
            k: "p",
            text: "A shared collection point created by an Organiser via a single shareable link, established for a Permitted Purpose, toward which Contributors may add funds.",
          },
        ],
      },
      {
        n: "2.5",
        title: "Platform",
        body: [{ k: "p", text: "Giivngo's website, applications, and associated services." }],
      },
      {
        n: "2.6",
        title: "Payment Partner",
        body: [
          {
            k: "p",
            text: "The third-party payment processor(s) engaged to process fund movements on the Platform.",
          },
        ],
      },
      { n: "2.7", title: "User", body: [{ k: "p", text: "Any Organiser or Contributor, collectively." }] },
      {
        n: "2.8",
        title: "User Content",
        body: [
          {
            k: "p",
            text: "Any text, images, or other material a User submits to a Pool page or Profile.",
          },
        ],
      },
      {
        n: "3",
        title: "Role and Limitations of the Platform",
        body: [
          {
            k: "p",
            lead: "3.1.",
            text: "Giivngo provides software tools that let Organisers set up Pools and let Contributors add funds to them. Giivngo is not a bank, is not a payment institution in its own right, and does not itself hold, custody, or control contributed funds. Fund movement is carried out by the Payment Partner in accordance with the Payment Partner's own terms.",
          },
          {
            k: "p",
            lead: "3.2.",
            text: "Giivngo does not guarantee that any Pool will reach its stated goal, and does not verify the accuracy of information an Organiser posts about a Pool's purpose. Contributors contribute at their own discretion.",
          },
          {
            k: "p",
            lead: "3.3.",
            text: "Giivngo may modify, suspend, or discontinue any part of the Platform at any time, with notice where reasonably practicable.",
          },
        ],
      },
      {
        n: "4",
        title: "Eligibility and Account Registration",
        body: [
          {
            k: "p",
            lead: "4.1.",
            text: "To create an Account, you must provide accurate and current information, including your name and contact details.",
          },
          {
            k: "p",
            lead: "4.2.",
            text: "Age of Majority. You must be at least 18 years old, or the age of majority in your jurisdiction of residence if higher, to create an Account, act as an Organiser, or contribute as a Contributor.",
          },
          {
            k: "p",
            lead: "4.3.",
            text: "A Pool may be created to benefit a minor (for example, a child's birthday), provided the Organiser is an adult and complies with Section 6 and any applicable safeguarding requirements.",
          },
          {
            k: "p",
            lead: "4.4.",
            text: "You are responsible for keeping your Account credentials confidential and for all activity that occurs under your Account.",
          },
        ],
      },
      {
        n: "5",
        title: "Payment Processing",
        body: [
          {
            k: "p",
            lead: "5.1.",
            text: "All contributions and payouts are handled by Giivngo's Payment Partner(s). By contributing to or receiving funds from a Pool, you agree to the applicable Payment Partner's terms in addition to these Terms.",
          },
          {
            k: "p",
            lead: "5.2.",
            text: "[FEES — 3.8% + 60 cents paid by contributor at time of payment on top of contribution amount.",
          },
        ],
      },
      {
        n: "6",
        title: "Permitted Purpose of Pools",
        body: [
          {
            k: "p",
            lead: "6.1.",
            text: "Pools may only be created for happy, personal-occasion purposes, including but not limited to: birthdays, weddings and engagements, baby showers, farewells and retirements, group trips, team or group gifts, anniversaries, and similar life-event celebrations.",
          },
          {
            k: "p",
            lead: "6.2.",
            text: "Express Prohibition — No Gambling or Chance-Based Activity. A Pool must not, in any form, involve: an entry fee paid in exchange for a chance to win a prize; wagering or betting on an uncertain outcome; raffles, sweepstakes, lotteries, or prize draws; fantasy sports or sports-related wagering; or any other arrangement where a Contributor's payment is made in expectation of a monetary or prize-based return determined by chance or a contingent future event.",
          },
          {
            k: "p",
            lead: "6.3.",
            text: "No Charitable Solicitation. Giivngo is not a registered charity or charitable fundraising platform. Pools must not be represented as charitable donations, and Contributors should not expect any tax deduction or charitable receipt in connection with a contribution.",
          },
          {
            k: "p",
            lead: "6.4.",
            text: "No Goods or Services in Exchange for Contribution. Organisers must not offer goods, services, or any tangible/intangible benefit in exchange for a Contributor's payment, other than the shared celebratory purpose of the Pool itself.",
          },
          {
            k: "p",
            lead: "6.5.",
            text: "No Lending or Investment Activity. Pools must not be used to solicit loans, repayments, investments, or any arrangement carrying an expectation of financial return.",
          },
        ],
      },
      {
        n: "7",
        title: "Organiser Responsibilities",
        body: [
          {
            k: "p",
            lead: "7.1.",
            text: "The Organiser is responsible for accurately describing the Pool's purpose and for using contributed funds consistently with that stated purpose.",
          },
          {
            k: "p",
            lead: "7.2.",
            text: "The Organiser must comply with all applicable laws relating to their Pool, including consumer protection and, where relevant, tax obligations.",
          },
          {
            k: "p",
            lead: "7.3.",
            text: "Giivngo may request reasonable evidence to confirm a Pool complies with these Terms and may pause or restrict a Pool pending that review.",
          },
          {
            k: "p",
            lead: "7.4.",
            text: "Where the Organiser is not the intended recipient of funds (for example, organising on behalf of the person being celebrated), the Organiser is responsible for passing funds to, or applying them for the benefit of, the intended recipient.",
          },
        ],
      },
      {
        n: "8",
        title: "Contributor Responsibilities",
        body: [
          {
            k: "p",
            lead: "8.1.",
            text: "Contributors are responsible for reviewing a Pool's stated purpose before contributing and contribute at their own discretion.",
          },
          {
            k: "p",
            lead: "8.2.",
            text: "Giivngo does not guarantee, verify, or take responsibility for how an Organiser ultimately uses contributed funds, beyond the platform-level restrictions in Section 6.",
          },
        ],
      },
      {
        n: "9",
        title: "Payouts, Holds, and Chargebacks",
        body: [
          {
            k: "p",
            lead: "9.1.",
            text: "Funds raised in a Pool may be paid out to the Organiser or nominated recipient in accordance with the Payment Partner's processing timelines. Giivngo does not guarantee a specific payout timeframe.",
          },
          {
            k: "p",
            lead: "9.2.",
            text: "Giivngo may place a temporary hold on a Pool or payout where it reasonably believes further verification is needed to confirm compliance with these Terms or where required by law or a Payment Partner's rules.",
          },
          {
            k: "p",
            lead: "9.3.",
            text: "Where a Contributor disputes a transaction with their card issuer or bank, Giivngo may provide information to the Payment Partner to assist in resolving that dispute.",
          },
        ],
      },
      {
        n: "10",
        title: "Prohibited Conduct",
        body: [
          { k: "p", text: "Users must not:" },
          {
            k: "p",
            lead: "10.1.",
            text: "use the Platform for any unlawful purpose, or in a manner that violates the rights of any third party;",
          },
          { k: "p", lead: "10.2.", text: "post false, misleading, or fraudulent information about a Pool;" },
          { k: "p", lead: "10.3.", text: "use the Platform to harass, threaten, or abuse another User;" },
          {
            k: "p",
            lead: "10.4.",
            text: "attempt to gain unauthorised access to another Account or to Platform systems;",
          },
          {
            k: "p",
            lead: "10.5.",
            text: "use automated means (bots, scrapers) to interact with the Platform other than as expressly permitted;",
          },
          {
            k: "p",
            lead: "10.6.",
            text: "use the Platform to facilitate money laundering, terrorism financing, or transactions involving sanctioned persons, entities, or jurisdictions.",
          },
          {
            k: "p",
            lead: "10.7.",
            text: "use the Platform to circumvent Giivngo's payment systems (for example, directing Contributors to pay outside the Platform while representing the payment as part of a Giivngo Pool).",
          },
        ],
      },
      {
        n: "11",
        title: "Content Moderation",
        body: [
          {
            k: "p",
            lead: "11.1.",
            text: "Giivngo may review, remove, or restrict access to a Pool or User Content that it reasonably believes violates these Terms, including the restrictions in Section 6.",
          },
          {
            k: "p",
            lead: "11.2.",
            text: "Users may report a Pool or User Content they believe violates these Terms through the in-Platform reporting function.",
          },
        ],
      },
      {
        n: "12",
        title: "Fees",
        body: [
          {
            k: "p",
            lead: "12.1.",
            text: "FEES — Fees will be paid by the contributor at time of checkout. Fees will be 3.8% + 60 cents.",
          },
        ],
      },
      {
        n: "13",
        title: "Intellectual Property",
        body: [
          {
            k: "p",
            lead: "13.1.",
            text: "Giivngo and its licensors own all rights in the Platform itself (software, design, trademarks, and branding), excluding User Content.",
          },
          {
            k: "p",
            lead: "13.2.",
            text: "Users retain ownership of the User Content they post, and grant Giivngo a limited, non-exclusive licence to host, display, and reproduce that content solely for the purpose of operating and promoting the Platform.",
          },
          {
            k: "p",
            lead: "13.3.",
            text: "Users must not copy, scrape, or reverse-engineer the Platform, or use Platform content to train machine-learning models, without Giivngo's prior written consent.",
          },
        ],
      },
      {
        n: "14",
        title: "Data Privacy",
        body: [
          {
            k: "p",
            lead: "14.1.",
            text: "Giivngo's collection and use of personal information is described in its separate Privacy Policy, which forms part of these Terms by reference.",
          },
        ],
      },
      {
        n: "15",
        title: "Third-Party Services",
        body: [
          {
            k: "p",
            lead: "15.1.",
            text: "The Platform may link to or rely on third-party services, including the Payment Partner. Giivngo is not responsible for the acts or omissions of third-party service providers, who operate under their own terms.",
          },
        ],
      },
      {
        n: "16",
        title: "Suspension and Termination",
        body: [
          {
            k: "p",
            lead: "16.1.",
            text: "Giivngo may suspend or terminate a User's Account or a Pool where it reasonably believes these Terms have been violated, where required by law, or to prevent fraud or harm to other Users.",
          },
          {
            k: "p",
            lead: "16.2.",
            text: "Where reasonably practicable, Giivngo will provide notice of suspension or termination and the reason for it.",
          },
        ],
      },
      {
        n: "17",
        title: "Disclaimers and Limitation of Liability",
        body: [
          {
            k: "p",
            lead: "17.1.",
            text: "To the maximum extent permitted by law, the Platform is provided \"as is\" without warranties of any kind. Giivngo does not guarantee that any Pool will be successful or that the Platform will be uninterrupted or error-free.",
          },
          {
            k: "p",
            lead: "17.2.",
            text: "To the maximum extent permitted by law, Giivngo's aggregate liability to a User arising out of or in connection with these Terms or use of the Platform will not exceed the total fees paid by that User to Giivngo in the [SIX (6) / TWELVE (12)] months immediately preceding the event giving rise to the claim.",
          },
        ],
      },
      {
        n: "18",
        title: "Indemnification",
        body: [
          {
            k: "p",
            lead: "18.1.",
            text: "To the extent permitted by law, Users agree to indemnify Giivngo against claims, losses, and expenses arising from their misuse of the Platform, breach of these Terms, or violation of a third party's rights.",
          },
        ],
      },
      {
        n: "19",
        title: "Changes to These Terms",
        body: [
          {
            k: "p",
            lead: "19.1.",
            text: "Giivngo may update these Terms from time to time. Material changes will be notified with reasonable advance notice, and continued use of the Platform after the effective date constitutes acceptance of the updated Terms.",
          },
        ],
      },
    ],
  },

  es: {
    title: "Términos de Uso",
    description:
      "Los términos que rigen el acceso y el uso del sitio web, las apps y los servicios relacionados de Giivngo.",
    updated: "2026-07-04",
    sections: [
      { n: "1", title: "Introducción" },
      {
        n: "1.1",
        title: "Acerca de estos Términos",
        body: [
          {
            k: "p",
            text: "Estos Términos de Uso (\"Términos\") rigen el acceso y el uso del sitio web, las aplicaciones móviles y los servicios relacionados de Giivngo (en conjunto, la \"Plataforma\"). Al crear una Colecta, aportar a una Colecta o usar de cualquier otra forma la Plataforma, aceptas quedar obligado por estos Términos.",
          },
        ],
      },
      {
        n: "1.2",
        title: "Entidad contratante",
        body: [
          {
            k: "p",
            text: "GIIVNGO AUSTRALIA — Actualmente Giivngo opera principalmente en Australia.",
          },
        ],
      },
      {
        n: "1.3",
        title: "Naturaleza del servicio",
        body: [
          {
            k: "p",
            text: "Giivngo es una plataforma tecnológica que permite a un Organizador crear una colecta de dinero compartida (\"Colecta\") en torno a una celebración o un momento personal importante (por ejemplo, un cumpleaños, un casamiento, la llegada de un bebé, una despedida, un viaje de equipo u otra ocasión feliz similar), y permite a los Participantes aportar fondos para la meta declarada de esa Colecta.",
          },
        ],
      },
      {
        n: "1.4",
        title: "Lo que Giivngo no es",
        body: [
          {
            k: "p",
            text: "Giivngo no es una organización de caridad, ni una plataforma de recaudación para situaciones de necesidad o de crowdfunding con causa, ni un servicio de apuestas, juegos de azar, pronósticos deportivos o quinielas de lotería, ni una plataforma de préstamos entre particulares (peer-to-peer). Las Colectas solo pueden crearse para los fines descritos en la Sección 6 (Finalidad permitida de las Colectas).",
          },
        ],
      },
      { n: "2", title: "Definiciones" },
      {
        n: "2.1",
        title: "Cuenta",
        body: [{ k: "p", text: "Un perfil registrado que permite a un Usuario acceder y usar la Plataforma." }],
      },
      {
        n: "2.2",
        title: "Participante",
        body: [{ k: "p", text: "Una persona que aporta fondos a una Colecta." }],
      },
      {
        n: "2.3",
        title: "Organizador",
        body: [{ k: "p", text: "Una persona que crea y administra una Colecta." }],
      },
      {
        n: "2.4",
        title: "Colecta",
        body: [
          {
            k: "p",
            text: "Un punto de recaudación compartido que crea un Organizador mediante un único enlace para compartir, establecido para una Finalidad Permitida, al cual los Participantes pueden aportar fondos.",
          },
        ],
      },
      {
        n: "2.5",
        title: "Plataforma",
        body: [{ k: "p", text: "El sitio web, las aplicaciones y los servicios asociados de Giivngo." }],
      },
      {
        n: "2.6",
        title: "Socio de Pagos",
        body: [
          {
            k: "p",
            text: "El o los procesadores de pagos externos contratados para procesar los movimientos de fondos en la Plataforma.",
          },
        ],
      },
      {
        n: "2.7",
        title: "Usuario",
        body: [{ k: "p", text: "Cualquier Organizador o Participante, en conjunto." }],
      },
      {
        n: "2.8",
        title: "Contenido del Usuario",
        body: [
          {
            k: "p",
            text: "Cualquier texto, imagen u otro material que un Usuario envíe a la página de una Colecta o a un Perfil.",
          },
        ],
      },
      {
        n: "3",
        title: "Rol y limitaciones de la Plataforma",
        body: [
          {
            k: "p",
            lead: "3.1.",
            text: "Giivngo provee herramientas de software que permiten a los Organizadores crear Colectas y a los Participantes aportar fondos a ellas. Giivngo no es un banco, no es una institución de pago por sí misma y no retiene, custodia ni controla los fondos aportados. El movimiento de fondos lo realiza el Socio de Pagos de acuerdo con sus propios términos.",
          },
          {
            k: "p",
            lead: "3.2.",
            text: "Giivngo no garantiza que una Colecta alcance su meta declarada ni verifica la exactitud de la información que un Organizador publica sobre la finalidad de una Colecta. Los Participantes aportan a su propia discreción.",
          },
          {
            k: "p",
            lead: "3.3.",
            text: "Giivngo puede modificar, suspender o discontinuar cualquier parte de la Plataforma en cualquier momento, con aviso cuando sea razonablemente posible.",
          },
        ],
      },
      {
        n: "4",
        title: "Elegibilidad y registro de la Cuenta",
        body: [
          {
            k: "p",
            lead: "4.1.",
            text: "Para crear una Cuenta, debes proporcionar información exacta y actualizada, incluidos tu nombre y tus datos de contacto.",
          },
          {
            k: "p",
            lead: "4.2.",
            text: "Mayoría de edad. Debes tener al menos 18 años, o la mayoría de edad de tu jurisdicción de residencia si fuera mayor, para crear una Cuenta, actuar como Organizador o aportar como Participante.",
          },
          {
            k: "p",
            lead: "4.3.",
            text: "Puede crearse una Colecta en beneficio de un menor (por ejemplo, el cumpleaños de un niño), siempre que el Organizador sea una persona adulta y cumpla con la Sección 6 y con los requisitos de protección aplicables.",
          },
          {
            k: "p",
            lead: "4.4.",
            text: "Eres responsable de mantener confidenciales las credenciales de tu Cuenta y de toda la actividad que ocurra en ella.",
          },
        ],
      },
      {
        n: "5",
        title: "Procesamiento de pagos",
        body: [
          {
            k: "p",
            lead: "5.1.",
            text: "Todos los aportes y pagos los gestiona el o los Socios de Pagos de Giivngo. Al aportar a una Colecta o recibir fondos de ella, aceptas los términos del Socio de Pagos aplicable, además de estos Términos.",
          },
          {
            k: "p",
            lead: "5.2.",
            text: "[COMISIONES — 3,8 % + 60 centavos que paga el Participante al momento del pago, además del monto del aporte.",
          },
        ],
      },
      {
        n: "6",
        title: "Finalidad permitida de las Colectas",
        body: [
          {
            k: "p",
            lead: "6.1.",
            text: "Las Colectas solo pueden crearse para fines de ocasiones personales y felices, incluidos, entre otros: cumpleaños, casamientos y compromisos, baby showers, despedidas y jubilaciones, viajes en grupo, regalos de equipo o de grupo, aniversarios y celebraciones similares de la vida.",
          },
          {
            k: "p",
            lead: "6.2.",
            text: "Prohibición expresa — Nada de juegos de azar ni actividades basadas en el azar. Una Colecta no debe, de ninguna forma, involucrar: una cuota de entrada pagada a cambio de la posibilidad de ganar un premio; apuestas sobre un resultado incierto; rifas, sorteos, loterías o sorteos con premio; fantasy sports o apuestas relacionadas con deportes; ni cualquier otro arreglo en el que el pago de un Participante se haga con la expectativa de un retorno monetario o en premios determinado por el azar o por un hecho futuro contingente.",
          },
          {
            k: "p",
            lead: "6.3.",
            text: "Nada de solicitación caritativa. Giivngo no es una organización de caridad registrada ni una plataforma de recaudación caritativa. Las Colectas no deben presentarse como donaciones caritativas, y los Participantes no deben esperar ninguna deducción fiscal ni recibo de donación en relación con un aporte.",
          },
          {
            k: "p",
            lead: "6.4.",
            text: "Nada de bienes o servicios a cambio del aporte. Los Organizadores no deben ofrecer bienes, servicios ni ningún beneficio tangible o intangible a cambio del pago de un Participante, más allá de la finalidad celebratoria compartida de la propia Colecta.",
          },
          {
            k: "p",
            lead: "6.5.",
            text: "Nada de actividad de préstamo o inversión. Las Colectas no deben usarse para solicitar préstamos, reembolsos, inversiones ni ningún arreglo que conlleve una expectativa de retorno financiero.",
          },
        ],
      },
      {
        n: "7",
        title: "Responsabilidades del Organizador",
        body: [
          {
            k: "p",
            lead: "7.1.",
            text: "El Organizador es responsable de describir con exactitud la finalidad de la Colecta y de usar los fondos aportados de forma coherente con esa finalidad declarada.",
          },
          {
            k: "p",
            lead: "7.2.",
            text: "El Organizador debe cumplir con todas las leyes aplicables relacionadas con su Colecta, incluidas las de protección al consumidor y, cuando corresponda, las obligaciones fiscales.",
          },
          {
            k: "p",
            lead: "7.3.",
            text: "Giivngo puede solicitar pruebas razonables para confirmar que una Colecta cumple con estos Términos y puede pausar o restringir una Colecta mientras dure esa revisión.",
          },
          {
            k: "p",
            lead: "7.4.",
            text: "Cuando el Organizador no sea el destinatario previsto de los fondos (por ejemplo, al organizar en nombre de la persona homenajeada), el Organizador es responsable de entregar los fondos al destinatario previsto o de aplicarlos en su beneficio.",
          },
        ],
      },
      {
        n: "8",
        title: "Responsabilidades del Participante",
        body: [
          {
            k: "p",
            lead: "8.1.",
            text: "Los Participantes son responsables de revisar la finalidad declarada de una Colecta antes de aportar, y aportan a su propia discreción.",
          },
          {
            k: "p",
            lead: "8.2.",
            text: "Giivngo no garantiza, verifica ni asume responsabilidad por la forma en que un Organizador finalmente use los fondos aportados, más allá de las restricciones a nivel de plataforma de la Sección 6.",
          },
        ],
      },
      {
        n: "9",
        title: "Pagos, retenciones y contracargos",
        body: [
          {
            k: "p",
            lead: "9.1.",
            text: "Los fondos recaudados en una Colecta pueden pagarse al Organizador o al destinatario designado de acuerdo con los plazos de procesamiento del Socio de Pagos. Giivngo no garantiza un plazo de pago específico.",
          },
          {
            k: "p",
            lead: "9.2.",
            text: "Giivngo puede aplicar una retención temporal sobre una Colecta o un pago cuando considere razonablemente que se necesita una verificación adicional para confirmar el cumplimiento de estos Términos, o cuando lo exija la ley o las reglas de un Socio de Pagos.",
          },
          {
            k: "p",
            lead: "9.3.",
            text: "Cuando un Participante dispute una transacción con su emisor de tarjeta o su banco, Giivngo puede proporcionar información al Socio de Pagos para ayudar a resolver esa disputa.",
          },
        ],
      },
      {
        n: "10",
        title: "Conducta prohibida",
        body: [
          { k: "p", text: "Los Usuarios no deben:" },
          {
            k: "p",
            lead: "10.1.",
            text: "usar la Plataforma para ningún fin ilícito ni de una forma que viole los derechos de un tercero;",
          },
          { k: "p", lead: "10.2.", text: "publicar información falsa, engañosa o fraudulenta sobre una Colecta;" },
          { k: "p", lead: "10.3.", text: "usar la Plataforma para acosar, amenazar o abusar de otro Usuario;" },
          {
            k: "p",
            lead: "10.4.",
            text: "intentar obtener acceso no autorizado a otra Cuenta o a los sistemas de la Plataforma;",
          },
          {
            k: "p",
            lead: "10.5.",
            text: "usar medios automatizados (bots, scrapers) para interactuar con la Plataforma, salvo cuando esté expresamente permitido;",
          },
          {
            k: "p",
            lead: "10.6.",
            text: "usar la Plataforma para facilitar el lavado de dinero, la financiación del terrorismo o transacciones que involucren a personas, entidades o jurisdicciones sancionadas.",
          },
          {
            k: "p",
            lead: "10.7.",
            text: "usar la Plataforma para eludir los sistemas de pago de Giivngo (por ejemplo, dirigiendo a los Participantes a pagar fuera de la Plataforma mientras se presenta el pago como parte de una Colecta de Giivngo).",
          },
        ],
      },
      {
        n: "11",
        title: "Moderación de contenido",
        body: [
          {
            k: "p",
            lead: "11.1.",
            text: "Giivngo puede revisar, eliminar o restringir el acceso a una Colecta o a Contenido del Usuario que considere razonablemente que viola estos Términos, incluidas las restricciones de la Sección 6.",
          },
          {
            k: "p",
            lead: "11.2.",
            text: "Los Usuarios pueden reportar una Colecta o Contenido del Usuario que crean que viola estos Términos mediante la función de reporte dentro de la Plataforma.",
          },
        ],
      },
      {
        n: "12",
        title: "Comisiones",
        body: [
          {
            k: "p",
            lead: "12.1.",
            text: "COMISIONES — Las comisiones las paga el Participante al momento del pago. Las comisiones serán del 3,8 % + 60 centavos.",
          },
        ],
      },
      {
        n: "13",
        title: "Propiedad intelectual",
        body: [
          {
            k: "p",
            lead: "13.1.",
            text: "Giivngo y sus licenciantes son titulares de todos los derechos sobre la Plataforma en sí (software, diseño, marcas e identidad de marca), con exclusión del Contenido del Usuario.",
          },
          {
            k: "p",
            lead: "13.2.",
            text: "Los Usuarios conservan la titularidad del Contenido del Usuario que publican y otorgan a Giivngo una licencia limitada y no exclusiva para alojar, mostrar y reproducir ese contenido con el único fin de operar y promocionar la Plataforma.",
          },
          {
            k: "p",
            lead: "13.3.",
            text: "Los Usuarios no deben copiar, extraer (scrapear) ni aplicar ingeniería inversa a la Plataforma, ni usar el contenido de la Plataforma para entrenar modelos de aprendizaje automático, sin el consentimiento previo y por escrito de Giivngo.",
          },
        ],
      },
      {
        n: "14",
        title: "Privacidad de los datos",
        body: [
          {
            k: "p",
            lead: "14.1.",
            text: "La recopilación y el uso de la información personal por parte de Giivngo se describen en su Política de Privacidad separada, que forma parte de estos Términos por referencia.",
          },
        ],
      },
      {
        n: "15",
        title: "Servicios de terceros",
        body: [
          {
            k: "p",
            lead: "15.1.",
            text: "La Plataforma puede enlazar o depender de servicios de terceros, incluido el Socio de Pagos. Giivngo no es responsable de los actos u omisiones de los proveedores de servicios externos, que operan bajo sus propios términos.",
          },
        ],
      },
      {
        n: "16",
        title: "Suspensión y terminación",
        body: [
          {
            k: "p",
            lead: "16.1.",
            text: "Giivngo puede suspender o dar de baja la Cuenta de un Usuario o una Colecta cuando considere razonablemente que se han violado estos Términos, cuando lo exija la ley, o para prevenir fraudes o daños a otros Usuarios.",
          },
          {
            k: "p",
            lead: "16.2.",
            text: "Cuando sea razonablemente posible, Giivngo dará aviso de la suspensión o terminación y del motivo de esta.",
          },
        ],
      },
      {
        n: "17",
        title: "Renuncias y limitación de responsabilidad",
        body: [
          {
            k: "p",
            lead: "17.1.",
            text: "En la máxima medida permitida por la ley, la Plataforma se provee \"en el estado en que se encuentra\", sin garantías de ningún tipo. Giivngo no garantiza que una Colecta vaya a tener éxito ni que la Plataforma vaya a funcionar sin interrupciones o sin errores.",
          },
          {
            k: "p",
            lead: "17.2.",
            text: "En la máxima medida permitida por la ley, la responsabilidad total de Giivngo frente a un Usuario, derivada de estos Términos o del uso de la Plataforma o relacionada con ellos, no excederá el total de las comisiones pagadas por ese Usuario a Giivngo en los [SEIS (6) / DOCE (12)] meses inmediatamente anteriores al hecho que dé origen al reclamo.",
          },
        ],
      },
      {
        n: "18",
        title: "Indemnización",
        body: [
          {
            k: "p",
            lead: "18.1.",
            text: "En la medida permitida por la ley, los Usuarios aceptan indemnizar a Giivngo frente a reclamos, pérdidas y gastos derivados del uso indebido de la Plataforma, del incumplimiento de estos Términos o de la violación de los derechos de un tercero.",
          },
        ],
      },
      {
        n: "19",
        title: "Cambios a estos Términos",
        body: [
          {
            k: "p",
            lead: "19.1.",
            text: "Giivngo puede actualizar estos Términos cada cierto tiempo. Los cambios importantes se notificarán con una anticipación razonable, y el uso continuado de la Plataforma después de la fecha de vigencia constituye la aceptación de los Términos actualizados.",
          },
        ],
      },
    ],
  },

  "pt-br": {
    title: "Termos de Uso",
    description:
      "Os termos que regem o acesso e o uso do site, dos apps e dos serviços relacionados da Giivngo.",
    updated: "2026-07-04",
    sections: [
      { n: "1", title: "Introdução" },
      {
        n: "1.1",
        title: "Sobre estes Termos",
        body: [
          {
            k: "p",
            text: "Estes Termos de Uso (\"Termos\") regem o acesso e o uso do site, dos aplicativos móveis e dos serviços relacionados da Giivngo (em conjunto, a \"Plataforma\"). Ao criar uma Vaquinha, contribuir para uma Vaquinha ou usar a Plataforma de qualquer outra forma, você concorda em se vincular a estes Termos.",
          },
        ],
      },
      {
        n: "1.2",
        title: "Entidade contratante",
        body: [
          { k: "p", text: "GIIVNGO AUSTRALIA — Atualmente a Giivngo opera principalmente na Austrália." },
        ],
      },
      {
        n: "1.3",
        title: "Natureza do serviço",
        body: [
          {
            k: "p",
            text: "A Giivngo é uma plataforma de tecnologia que permite que um Organizador crie uma vaquinha de dinheiro compartilhada (\"Vaquinha\") em torno de uma celebração ou marco pessoal (por exemplo, um aniversário, um casamento, a chegada de um bebê, uma despedida, uma viagem de equipe ou outra ocasião feliz semelhante), e permite que os Participantes contribuam com fundos para a meta declarada dessa Vaquinha.",
          },
        ],
      },
      {
        n: "1.4",
        title: "O que a Giivngo não é",
        body: [
          {
            k: "p",
            text: "A Giivngo não é uma instituição de caridade, nem uma plataforma de arrecadação para situações de dificuldade ou de crowdfunding com causa, nem um serviço de apostas, jogos de azar, palpites esportivos ou bolões de loteria, nem uma plataforma de empréstimos entre pessoas (peer-to-peer). As Vaquinhas só podem ser criadas para as finalidades descritas na Seção 6 (Finalidade permitida das Vaquinhas).",
          },
        ],
      },
      { n: "2", title: "Definições" },
      {
        n: "2.1",
        title: "Conta",
        body: [{ k: "p", text: "Um perfil registrado que permite a um Usuário acessar e usar a Plataforma." }],
      },
      {
        n: "2.2",
        title: "Participante",
        body: [{ k: "p", text: "Uma pessoa que contribui com fundos para uma Vaquinha." }],
      },
      {
        n: "2.3",
        title: "Organizador",
        body: [{ k: "p", text: "Uma pessoa que cria e administra uma Vaquinha." }],
      },
      {
        n: "2.4",
        title: "Vaquinha",
        body: [
          {
            k: "p",
            text: "Um ponto de arrecadação compartilhado criado por um Organizador por meio de um único link compartilhável, estabelecido para uma Finalidade Permitida, para o qual os Participantes podem contribuir com fundos.",
          },
        ],
      },
      {
        n: "2.5",
        title: "Plataforma",
        body: [{ k: "p", text: "O site, os aplicativos e os serviços associados da Giivngo." }],
      },
      {
        n: "2.6",
        title: "Parceiro de Pagamentos",
        body: [
          {
            k: "p",
            text: "O(s) processador(es) de pagamentos terceirizado(s) contratado(s) para processar as movimentações de fundos na Plataforma.",
          },
        ],
      },
      {
        n: "2.7",
        title: "Usuário",
        body: [{ k: "p", text: "Qualquer Organizador ou Participante, em conjunto." }],
      },
      {
        n: "2.8",
        title: "Conteúdo do Usuário",
        body: [
          {
            k: "p",
            text: "Qualquer texto, imagem ou outro material que um Usuário envie à página de uma Vaquinha ou a um Perfil.",
          },
        ],
      },
      {
        n: "3",
        title: "Papel e limitações da Plataforma",
        body: [
          {
            k: "p",
            lead: "3.1.",
            text: "A Giivngo fornece ferramentas de software que permitem aos Organizadores criar Vaquinhas e aos Participantes contribuir com fundos para elas. A Giivngo não é um banco, não é uma instituição de pagamento por si só e não retém, custodia nem controla os fundos contribuídos. A movimentação de fundos é realizada pelo Parceiro de Pagamentos de acordo com os seus próprios termos.",
          },
          {
            k: "p",
            lead: "3.2.",
            text: "A Giivngo não garante que uma Vaquinha alcance a sua meta declarada nem verifica a exatidão das informações que um Organizador publica sobre a finalidade de uma Vaquinha. Os Participantes contribuem por sua própria conta e risco.",
          },
          {
            k: "p",
            lead: "3.3.",
            text: "A Giivngo pode modificar, suspender ou descontinuar qualquer parte da Plataforma a qualquer momento, com aviso quando razoavelmente possível.",
          },
        ],
      },
      {
        n: "4",
        title: "Elegibilidade e registro da Conta",
        body: [
          {
            k: "p",
            lead: "4.1.",
            text: "Para criar uma Conta, você deve fornecer informações exatas e atualizadas, incluindo o seu nome e os seus dados de contato.",
          },
          {
            k: "p",
            lead: "4.2.",
            text: "Maioridade. Você deve ter pelo menos 18 anos, ou a maioridade da sua jurisdição de residência, se for maior, para criar uma Conta, atuar como Organizador ou contribuir como Participante.",
          },
          {
            k: "p",
            lead: "4.3.",
            text: "Uma Vaquinha pode ser criada em benefício de um menor (por exemplo, o aniversário de uma criança), desde que o Organizador seja adulto e cumpra a Seção 6 e quaisquer requisitos de proteção aplicáveis.",
          },
          {
            k: "p",
            lead: "4.4.",
            text: "Você é responsável por manter as credenciais da sua Conta em sigilo e por toda a atividade que ocorra na sua Conta.",
          },
        ],
      },
      {
        n: "5",
        title: "Processamento de pagamentos",
        body: [
          {
            k: "p",
            lead: "5.1.",
            text: "Todas as contribuições e todos os repasses são tratados pelo(s) Parceiro(s) de Pagamentos da Giivngo. Ao contribuir para uma Vaquinha ou receber fundos dela, você concorda com os termos do Parceiro de Pagamentos aplicável, além destes Termos.",
          },
          {
            k: "p",
            lead: "5.2.",
            text: "[TAXAS — 3,8% + 60 centavos pagos pelo Participante no momento do pagamento, além do valor da contribuição.",
          },
        ],
      },
      {
        n: "6",
        title: "Finalidade permitida das Vaquinhas",
        body: [
          {
            k: "p",
            lead: "6.1.",
            text: "As Vaquinhas só podem ser criadas para finalidades felizes e de ocasiões pessoais, incluindo, entre outras: aniversários, casamentos e noivados, chás de bebê, despedidas e aposentadorias, viagens em grupo, presentes de equipe ou de grupo, datas comemorativas e celebrações semelhantes da vida.",
          },
          {
            k: "p",
            lead: "6.2.",
            text: "Proibição expressa — Nada de jogos de azar ou atividades baseadas em sorte. Uma Vaquinha não deve, de forma alguma, envolver: uma taxa de entrada paga em troca da chance de ganhar um prêmio; apostas sobre um resultado incerto; rifas, sorteios, loterias ou sorteios de prêmios; fantasy sports ou apostas relacionadas a esportes; ou qualquer outro arranjo em que o pagamento de um Participante seja feito na expectativa de um retorno monetário ou em prêmios determinado pela sorte ou por um evento futuro contingente.",
          },
          {
            k: "p",
            lead: "6.3.",
            text: "Nada de solicitação de caridade. A Giivngo não é uma instituição de caridade registrada nem uma plataforma de arrecadação de caridade. As Vaquinhas não devem ser apresentadas como doações de caridade, e os Participantes não devem esperar qualquer dedução fiscal ou recibo de doação em relação a uma contribuição.",
          },
          {
            k: "p",
            lead: "6.4.",
            text: "Nada de bens ou serviços em troca da contribuição. Os Organizadores não devem oferecer bens, serviços ou qualquer benefício tangível ou intangível em troca do pagamento de um Participante, além da finalidade celebratória compartilhada da própria Vaquinha.",
          },
          {
            k: "p",
            lead: "6.5.",
            text: "Nada de atividade de empréstimo ou investimento. As Vaquinhas não devem ser usadas para solicitar empréstimos, reembolsos, investimentos ou qualquer arranjo que carregue uma expectativa de retorno financeiro.",
          },
        ],
      },
      {
        n: "7",
        title: "Responsabilidades do Organizador",
        body: [
          {
            k: "p",
            lead: "7.1.",
            text: "O Organizador é responsável por descrever com exatidão a finalidade da Vaquinha e por usar os fundos contribuídos de forma coerente com essa finalidade declarada.",
          },
          {
            k: "p",
            lead: "7.2.",
            text: "O Organizador deve cumprir todas as leis aplicáveis relacionadas à sua Vaquinha, incluindo a proteção ao consumidor e, quando pertinente, as obrigações fiscais.",
          },
          {
            k: "p",
            lead: "7.3.",
            text: "A Giivngo pode solicitar provas razoáveis para confirmar que uma Vaquinha cumpre estes Termos e pode pausar ou restringir uma Vaquinha enquanto durar essa análise.",
          },
          {
            k: "p",
            lead: "7.4.",
            text: "Quando o Organizador não for o destinatário pretendido dos fundos (por exemplo, ao organizar em nome da pessoa homenageada), o Organizador é responsável por repassar os fundos ao destinatário pretendido ou aplicá-los em seu benefício.",
          },
        ],
      },
      {
        n: "8",
        title: "Responsabilidades do Participante",
        body: [
          {
            k: "p",
            lead: "8.1.",
            text: "Os Participantes são responsáveis por analisar a finalidade declarada de uma Vaquinha antes de contribuir, e contribuem por sua própria conta e risco.",
          },
          {
            k: "p",
            lead: "8.2.",
            text: "A Giivngo não garante, verifica nem se responsabiliza pela forma como um Organizador finalmente usa os fundos contribuídos, além das restrições em nível de plataforma da Seção 6.",
          },
        ],
      },
      {
        n: "9",
        title: "Repasses, retenções e estornos",
        body: [
          {
            k: "p",
            lead: "9.1.",
            text: "Os fundos arrecadados em uma Vaquinha podem ser repassados ao Organizador ou ao destinatário indicado de acordo com os prazos de processamento do Parceiro de Pagamentos. A Giivngo não garante um prazo de repasse específico.",
          },
          {
            k: "p",
            lead: "9.2.",
            text: "A Giivngo pode aplicar uma retenção temporária sobre uma Vaquinha ou um repasse quando acreditar razoavelmente que é necessária uma verificação adicional para confirmar o cumprimento destes Termos, ou quando exigido por lei ou pelas regras de um Parceiro de Pagamentos.",
          },
          {
            k: "p",
            lead: "9.3.",
            text: "Quando um Participante contestar uma transação junto ao emissor do seu cartão ou ao seu banco, a Giivngo pode fornecer informações ao Parceiro de Pagamentos para ajudar a resolver essa contestação.",
          },
        ],
      },
      {
        n: "10",
        title: "Conduta proibida",
        body: [
          { k: "p", text: "Os Usuários não devem:" },
          {
            k: "p",
            lead: "10.1.",
            text: "usar a Plataforma para qualquer finalidade ilícita ou de forma que viole os direitos de terceiros;",
          },
          { k: "p", lead: "10.2.", text: "publicar informações falsas, enganosas ou fraudulentas sobre uma Vaquinha;" },
          { k: "p", lead: "10.3.", text: "usar a Plataforma para assediar, ameaçar ou abusar de outro Usuário;" },
          {
            k: "p",
            lead: "10.4.",
            text: "tentar obter acesso não autorizado a outra Conta ou aos sistemas da Plataforma;",
          },
          {
            k: "p",
            lead: "10.5.",
            text: "usar meios automatizados (bots, scrapers) para interagir com a Plataforma, exceto quando expressamente permitido;",
          },
          {
            k: "p",
            lead: "10.6.",
            text: "usar a Plataforma para facilitar lavagem de dinheiro, financiamento ao terrorismo ou transações que envolvam pessoas, entidades ou jurisdições sancionadas.",
          },
          {
            k: "p",
            lead: "10.7.",
            text: "usar a Plataforma para burlar os sistemas de pagamento da Giivngo (por exemplo, direcionando os Participantes a pagar fora da Plataforma enquanto apresentam o pagamento como parte de uma Vaquinha da Giivngo).",
          },
        ],
      },
      {
        n: "11",
        title: "Moderação de conteúdo",
        body: [
          {
            k: "p",
            lead: "11.1.",
            text: "A Giivngo pode analisar, remover ou restringir o acesso a uma Vaquinha ou a Conteúdo do Usuário que acredite razoavelmente violar estes Termos, incluindo as restrições da Seção 6.",
          },
          {
            k: "p",
            lead: "11.2.",
            text: "Os Usuários podem denunciar uma Vaquinha ou Conteúdo do Usuário que acreditem violar estes Termos por meio da função de denúncia dentro da Plataforma.",
          },
        ],
      },
      {
        n: "12",
        title: "Taxas",
        body: [
          {
            k: "p",
            lead: "12.1.",
            text: "TAXAS — As taxas serão pagas pelo Participante no momento do checkout. As taxas serão de 3,8% + 60 centavos.",
          },
        ],
      },
      {
        n: "13",
        title: "Propriedade intelectual",
        body: [
          {
            k: "p",
            lead: "13.1.",
            text: "A Giivngo e os seus licenciadores detêm todos os direitos sobre a Plataforma em si (software, design, marcas e identidade de marca), excluindo o Conteúdo do Usuário.",
          },
          {
            k: "p",
            lead: "13.2.",
            text: "Os Usuários mantêm a titularidade do Conteúdo do Usuário que publicam e concedem à Giivngo uma licença limitada e não exclusiva para hospedar, exibir e reproduzir esse conteúdo com a única finalidade de operar e promover a Plataforma.",
          },
          {
            k: "p",
            lead: "13.3.",
            text: "Os Usuários não devem copiar, extrair (scrapear) nem fazer engenharia reversa da Plataforma, nem usar o conteúdo da Plataforma para treinar modelos de aprendizado de máquina, sem o consentimento prévio e por escrito da Giivngo.",
          },
        ],
      },
      {
        n: "14",
        title: "Privacidade dos dados",
        body: [
          {
            k: "p",
            lead: "14.1.",
            text: "A coleta e o uso das informações pessoais pela Giivngo estão descritos na sua Política de Privacidade separada, que passa a integrar estes Termos por referência.",
          },
        ],
      },
      {
        n: "15",
        title: "Serviços de terceiros",
        body: [
          {
            k: "p",
            lead: "15.1.",
            text: "A Plataforma pode conter links ou depender de serviços de terceiros, incluindo o Parceiro de Pagamentos. A Giivngo não é responsável pelos atos ou omissões dos prestadores de serviços terceirizados, que operam sob os seus próprios termos.",
          },
        ],
      },
      {
        n: "16",
        title: "Suspensão e encerramento",
        body: [
          {
            k: "p",
            lead: "16.1.",
            text: "A Giivngo pode suspender ou encerrar a Conta de um Usuário ou uma Vaquinha quando acreditar razoavelmente que estes Termos foram violados, quando exigido por lei, ou para prevenir fraude ou dano a outros Usuários.",
          },
          {
            k: "p",
            lead: "16.2.",
            text: "Quando razoavelmente possível, a Giivngo dará aviso da suspensão ou do encerramento e do motivo dele.",
          },
        ],
      },
      {
        n: "17",
        title: "Isenções e limitação de responsabilidade",
        body: [
          {
            k: "p",
            lead: "17.1.",
            text: "Na máxima extensão permitida por lei, a Plataforma é fornecida \"no estado em que se encontra\", sem garantias de qualquer tipo. A Giivngo não garante que uma Vaquinha terá sucesso nem que a Plataforma funcionará sem interrupções ou sem erros.",
          },
          {
            k: "p",
            lead: "17.2.",
            text: "Na máxima extensão permitida por lei, a responsabilidade total da Giivngo perante um Usuário, decorrente destes Termos ou do uso da Plataforma ou a eles relacionada, não excederá o total das taxas pagas por esse Usuário à Giivngo nos [SEIS (6) / DOZE (12)] meses imediatamente anteriores ao evento que der origem à reclamação.",
          },
        ],
      },
      {
        n: "18",
        title: "Indenização",
        body: [
          {
            k: "p",
            lead: "18.1.",
            text: "Na extensão permitida por lei, os Usuários concordam em indenizar a Giivngo por reclamações, perdas e despesas decorrentes do uso indevido da Plataforma, da violação destes Termos ou da violação dos direitos de terceiros.",
          },
        ],
      },
      {
        n: "19",
        title: "Alterações a estes Termos",
        body: [
          {
            k: "p",
            lead: "19.1.",
            text: "A Giivngo pode atualizar estes Termos periodicamente. Alterações relevantes serão notificadas com antecedência razoável, e o uso continuado da Plataforma após a data de vigência constitui a aceitação dos Termos atualizados.",
          },
        ],
      },
    ],
  },
};
