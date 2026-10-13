import type { LegalDocSet } from "./types";

// Documento "Terms of Use" de Giivngo. Fuente: "Giivngo_Terms_of_Use_Master_Draftv3 (1).md"
// (última actualización 30-sep-2026). El inglés es el texto rector; es y pt-br son
// traducciones de referencia pendientes de revisión legal.
// NOTA: se conservan los marcadores del documento fuente ("[SIX (6) / TWELVE (12)]" en 17.2)
// hasta que el equipo legal confirme el valor.
export const terms: LegalDocSet = {
  en: {
    title: "Terms of Use",
    description:
      "The terms governing access to and use of Giivngo's website, apps, and related services.",
    updated: "2026-09-30",
    sections: [
      { n: "", title: "Part I — Terms of Use", unnumbered: true },
      { n: "1", title: "Introduction" },
      {
        n: "1.1",
        title: "About these Terms",
        body: [
          {
            k: "p",
            text: "These Terms of Use (“Terms”) govern access to and use of Giivngo's website, mobile applications, and related services (together, the “Platform”). By creating a Pool, contributing to a Pool, or otherwise using the Platform, you agree to be bound by these Terms.",
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
            text: "Giivngo is a technology platform that enables an Organiser to create a shared money pool (“Pool”) around a personal celebration or milestone (for example, a birthday, wedding, new baby, farewell, team trip, or similar happy occasion), and enables Contributors to add funds toward that Pool's stated goal.",
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
      {
        n: "2.7",
        title: "User",
        body: [{ k: "p", text: "Any Organiser or Contributor, collectively." }],
      },
      {
        n: "2.8",
        title: "User Content",
        body: [
          {
            k: "p",
            text: "Any text, images, video, or other material a User submits to a Pool page or Profile.",
          },
        ],
      },
      { n: "3", title: "Role and Limitations of the Platform", body: [
        { k: "p", lead: "3.1.", text: "Giivngo provides software tools that let Organisers set up Pools and let Contributors add funds to them. Giivngo is not a bank, is not a payment institution in its own right, and does not itself hold, custody, or control contributed funds. Fund movement is carried out by the Payment Partner in accordance with the Payment Partner's own terms." },
        { k: "p", lead: "3.2.", text: "Giivngo does not guarantee that any Pool will reach its stated goal and does not verify the accuracy of information an Organiser posts about a Pool's purpose. Contributors contribute at their own discretion." },
        { k: "p", lead: "3.3.", text: "Giivngo may modify, suspend, or discontinue any part of the Platform at any time, with notice where reasonably practicable." },
      ] },
      { n: "4", title: "Eligibility and Account Registration", body: [
        { k: "p", lead: "4.1.", text: "To create an Account, you must provide accurate and current information, including your name and contact details." },
        { k: "p", lead: "4.2. Age of Majority.", text: "You must be at least 18 years old, or the age of majority in your jurisdiction of residence if higher, to create an Account, act as an Organiser, or contribute as a Contributor." },
        { k: "p", lead: "4.3.", text: "A Pool may be created to benefit a minor (for example, a child's birthday), provided the Organiser is an adult and complies with Section 6 and any applicable safeguarding requirements." },
        { k: "p", lead: "4.4.", text: "You are responsible for keeping your Account credentials confidential and for all activity that occurs under your Account." },
      ] },
      { n: "5", title: "Payment Processing", body: [
        { k: "p", lead: "5.1.", text: "All contributions and payouts are handled by Giivngo's Payment Partner(s). By contributing to or receiving funds from a Pool, you agree to the applicable Payment Partner's terms in addition to these Terms." },
        { k: "p", lead: "5.2. Fees.", text: "A fee of 4.4% + $0.75 AUD is added on top of the contribution amount and paid by the Contributor at the time of payment." },
      ] },
      { n: "6", title: "Permitted Purpose of Pools", body: [
        { k: "p", lead: "6.1.", text: "Pools may only be created for happy, personal-occasion purposes, including but not limited to: birthdays; weddings and engagements; baby showers; farewells and retirements; group trips; team or group gifts; anniversaries; and similar life-event celebrations." },
        { k: "p", lead: "6.2. Express Prohibition, No Gambling or Chance-Based Activity.", text: "A Pool must not, in any form, involve: an entry fee paid in exchange for a chance to win a prize; wagering or betting on an uncertain outcome; raffles, sweepstakes, lotteries, or prize draws; fantasy sports or sports-related wagering; or any other arrangement where a Contributor's payment is made in expectation of a monetary or prize-based return determined by chance or a contingent future event." },
        { k: "p", lead: "6.3. No Charitable Solicitation.", text: "Giivngo is not a registered charity or charitable fundraising platform. Pools must not be represented as charitable donations, and Contributors should not expect any tax deduction or charitable receipt in connection with a contribution." },
        { k: "p", lead: "6.4. No Goods or Services in Exchange for Contribution.", text: "Organisers must not offer goods, services, or any tangible/intangible benefit in exchange for a Contributor's payment, other than the shared celebratory purpose of the Pool itself." },
        { k: "p", lead: "6.5. No Lending or Investment Activity.", text: "Pools must not be used to solicit loans, repayments, investments, or any arrangement carrying an expectation of financial return." },
      ] },
      { n: "7", title: "Organiser Responsibilities", body: [
        { k: "p", lead: "7.1.", text: "The Organiser is responsible for accurately describing the Pool's purpose and for using contributed funds consistently with that stated purpose." },
        { k: "p", lead: "7.2.", text: "The Organiser must comply with all applicable laws relating to their Pool, including consumer protection and, where relevant, tax obligations." },
        { k: "p", lead: "7.3.", text: "Giivngo may request reasonable evidence to confirm a Pool complies with these Terms and may pause or restrict a Pool pending that review." },
        { k: "p", lead: "7.4.", text: "Where the Organiser is not the intended recipient of funds (for example, organising on behalf of the person being celebrated), the Organiser is responsible for passing funds to, or applying them for the benefit of, the intended recipient." },
      ] },
      { n: "8", title: "Contributor Responsibilities", body: [
        { k: "p", lead: "8.1.", text: "Contributors are responsible for reviewing a Pool's stated purpose before contributing and contribute at their own discretion." },
        { k: "p", lead: "8.2.", text: "Giivngo does not guarantee, verify, or take responsibility for how an Organiser ultimately uses contributed funds, beyond the platform-level restrictions in Section 6." },
      ] },
      { n: "9", title: "Payouts, Holds, and Chargebacks", body: [
        { k: "p", lead: "9.1.", text: "Funds raised in a Pool may be paid out to the Organiser or nominated recipient in accordance with the Payment Partner's processing timelines. Giivngo does not guarantee a specific payout timeframe." },
        { k: "p", lead: "9.2.", text: "Giivngo may place a temporary hold on a Pool or payout where it reasonably believes further verification is needed to confirm compliance with these Terms or where required by law or a Payment Partner's rules." },
        { k: "p", lead: "9.3.", text: "Where a Contributor disputes a transaction with their card issuer or bank, Giivngo may provide information to the Payment Partner to assist in resolving that dispute." },
      ] },
      { n: "10", title: "Prohibited Conduct", body: [
        { k: "p", text: "Users must not:" },
        { k: "p", lead: "10.1", text: "Use the Platform for any unlawful purpose, or in a manner that violates the rights of any third party;" },
        { k: "p", lead: "10.2", text: "Post false, misleading, or fraudulent information about a Pool;" },
        { k: "p", lead: "10.3", text: "Use the Platform to harass, threaten, or abuse another User;" },
        { k: "p", lead: "10.4", text: "Attempt to gain unauthorised access to another Account or to Platform systems;" },
        { k: "p", lead: "10.5", text: "Use automated means (bots, scrapers) to interact with the Platform other than as expressly permitted;" },
        { k: "p", lead: "10.6", text: "Use the Platform to facilitate money laundering, terrorism financing, or transactions involving sanctioned persons, entities, or jurisdictions;" },
        { k: "p", lead: "10.7", text: "Use the Platform to circumvent Giivngo's payment systems (for example, directing Contributors to pay outside the Platform while representing the payment as part of a Giivngo Pool)." },
      ] },
      { n: "11", title: "Content Moderation & Takedown", body: [
        { k: "p", lead: "11.1.", text: "Giivngo may review, remove, or restrict access to a Pool or User Content that it reasonably believes violates these Terms, the Acceptable Use Policy (Part II below), or applicable law." },
        { k: "p", lead: "11.2. Reporting.", text: "Every uploaded photo or video carries a report/flag control. Any User, including someone who is not a Giivngo Account holder but has viewed a Pool via a shared link, can use it to flag content for review." },
        { k: "p", lead: "11.3. Review.", text: "Reported content is placed into a review queue. Giivngo's internal target is to review reported content within 24–48 hours. Content automatically flagged by upload-time scanning (see 11.6) may be actioned before publication, without waiting for a User report." },
        { k: "p", lead: "11.4. Outcomes.", text: "Following review, Giivngo may: take no action; remove the specific content; remove the content and issue a warning to the uploader; suspend the uploader's Account; or terminate the uploader's Account, depending on severity and history." },
        { k: "p", lead: "11.5. Repeat offenders.", text: "Giivngo maintains an internal record of upheld reports against an Account." },
        { k: "p", lead: "11.6. Proactive scanning.", text: "Uploaded photos and videos are passed through automated content-scanning at the point of upload, before being made visible to other Users." },
        { k: "p", lead: "11.7. Legal and regulatory reporting.", text: "Certain categories of content carry mandatory reporting obligations to government authorities that exist independently of, and are not satisfied by, Giivngo's internal takedown process." },
        { k: "p", lead: "11.8. Retention for safety purposes.", text: "Where content is removed for a suspected serious violation, Giivngo may retain a copy and associated Account information for a period necessary to comply with legal obligations or respond to a law enforcement or regulatory request." },
      ] },
      { n: "12", title: "Fees", body: [
        { k: "p", lead: "12.1.", text: "Fees are paid by the Contributor at time of checkout and are 4.4% + $0.75 AUD on top of the contribution amount." },
      ] },
      { n: "13", title: "Intellectual Property", body: [
        { k: "p", lead: "13.1.", text: "Giivngo and its licensors own all rights in the Platform itself (software, design, trademarks, and branding), excluding User Content." },
        { k: "p", lead: "13.2. Content Licence.", text: "Users retain ownership of the User Content they post. By uploading, posting, or otherwise submitting User Content to the Platform (including photos, videos, and text attached to a Pool), you grant Giivngo a worldwide, non-exclusive, royalty-free licence to host, store, display, reproduce, and distribute that User Content solely for the purposes of operating, securing, and promoting the Platform. This licence ends when the relevant User Content is removed from the Platform, except to the extent Giivngo is required to retain it for legal, safety, or record-keeping purposes described in Section 11.8." },
        { k: "p", lead: "13.3.", text: "Users must not copy, scrape, or reverse-engineer the Platform, or use Platform content to train machine-learning models, without Giivngo's prior written consent." },
        { k: "p", lead: "13.4. Sole Responsibility for Uploaded Content.", text: "You are solely responsible for any User Content you upload, including its legality, accuracy, and the fact that you have the right to upload it. By uploading User Content, you represent and warrant that: (a) you own the content or have the necessary rights and consents to upload it, including the consent of any other identifiable person appearing in it; (b) the content complies with the Acceptable Use Policy (Part II below); and (c) uploading the content does not infringe any third party's intellectual property, privacy, or other rights." },
        { k: "p", lead: "13.5.", text: "Giivngo does not pre-screen all User Content before it is displayed, but operates the moderation and reporting mechanisms described in Section 11." },
      ] },
      { n: "14", title: "Data Privacy", body: [
        { k: "p", lead: "14.1.", text: "Giivngo's collection and use of personal information is described in its separate Privacy Policy, which forms part of these Terms by reference. See Part III below for the specific insert covering personal information in uploaded media, including of people who are not Giivngo Users." },
      ] },
      { n: "15", title: "Third-Party Services", body: [
        { k: "p", lead: "15.1.", text: "The Platform may link to or rely on third-party services, including the Payment Partner. Giivngo is not responsible for the acts or omissions of third-party service providers, who operate under their own terms." },
      ] },
      { n: "16", title: "Suspension and Termination", body: [
        { k: "p", lead: "16.1.", text: "Giivngo may suspend or terminate a User's Account or a Pool where it reasonably believes these Terms have been violated, where required by law, or to prevent fraud or harm to other Users." },
        { k: "p", lead: "16.2.", text: "Where reasonably practicable, Giivngo will provide notice of suspension or termination and the reason for it." },
      ] },
      { n: "17", title: "Disclaimers and Limitation of Liability", body: [
        { k: "p", lead: "17.1.", text: "To the maximum extent permitted by law, the Platform is provided “as is” without warranties of any kind. Giivngo does not guarantee that any Pool will be successful or that the Platform will be uninterrupted or error-free." },
        { k: "p", lead: "17.2.", text: "To the maximum extent permitted by law, Giivngo's aggregate liability to a User arising out of or in connection with these Terms or use of the Platform will not exceed the total fees paid by that User to Giivngo in the [SIX (6) / TWELVE (12)] months immediately preceding the event giving rise to the claim." },
      ] },
      { n: "18", title: "Indemnification", body: [
        { k: "p", lead: "18.1.", text: "To the extent permitted by law, Users agree to indemnify Giivngo against claims, losses, and expenses arising from their misuse of the Platform, breach of these Terms, or violation of a third party's rights." },
      ] },
      { n: "19", title: "Changes to These Terms", body: [
        { k: "p", lead: "19.1.", text: "Giivngo may update these Terms from time to time. Material changes will be notified with reasonable advance notice, and continued use of the Platform after the effective date constitutes acceptance of the updated Terms." },
      ] },
      { n: "", title: "Part II — Acceptable Use Policy / Community Guidelines", unnumbered: true, body: [
        { k: "p", text: "Giivngo exists to help people celebrate happy occasions together. To keep the Platform safe, everyone who uploads content, Organisers and Contributors alike, agrees to the following before uploading any photo, video, or other content." },
        { k: "p", text: "You must not upload content that:" },
        { k: "ul", items: [
          "contains nudity, sexual content, or sexually suggestive material of any kind;",
          "depicts graphic violence, or content intended to shock, disturb, or glorify harm;",
          "harasses, bullies, threatens, or demeans another person;",
          "depicts or involves a minor in any way that is sexualised, exploitative, or otherwise inappropriate, this includes content that would concern a reasonable parent, regardless of the uploader's intent;",
          "infringes someone else's copyright, trademark, or other intellectual property rights;",
          "includes another identifiable person's personal information without their consent (see Part III, the Privacy Policy);",
          "is fraudulent, misleading, or impersonates another person or organisation;",
          "promotes illegal activity of any kind.",
        ] },
        { k: "p", text: "What happens if you upload something that shouldn't be there:" },
        { k: "ul", items: [
          "Any User can report content using the report/flag control on that content.",
          "Giivngo will review reported content in line with the timeframes in Section 11 of the Terms of Use.",
          "Content found to violate this Policy will be removed, and the uploader's Account may be suspended or terminated, particularly for repeat or serious violations.",
          "Some categories of content may also be reported to the relevant authority, regardless of any action taken on the Platform.",
        ] },
        { k: "p", text: "By uploading any content to a Pool, you confirm you have read and agree to this Acceptable Use Policy." },
      ] },
      { n: "", title: "Part III — Privacy Policy: Third-Party Personal Information in Uploaded Media", unnumbered: true, body: [
        { k: "p", lead: "Personal Information of People Who Are Not Giivngo Users.", text: "Photos and videos uploaded to a Pool may contain personal information about people other than the uploader, for example other guests, or children, appearing in a birthday or celebration video or photo. By uploading such content, the uploader confirms they have the appropriate consent to do so, including, where the person shown is a child, the consent of that child's parent or guardian." },
        { k: "p", text: "Giivngo does not independently verify that this consent has been obtained. If you believe your image, or that of a child in your care, has been uploaded without appropriate consent, you can request its removal using the report/flag control on the content, or by contacting support@giivngo.com." },
      ] },
    ],
  },
  es: {
  title: "Términos de Uso",
  description:
    "Los términos que rigen el acceso y el uso del sitio web, las aplicaciones y los servicios relacionados de Giivngo.",
  updated: "2026-09-30",
  sections: [
    { n: "", title: "Parte I — Términos de Uso", unnumbered: true },
    { n: "1", title: "Introducción" },
    {
      n: "1.1",
      title: "Acerca de estos Términos",
      body: [
        {
          k: "p",
          text: "Estos Términos de Uso (“Términos”) rigen el acceso y el uso del sitio web, las aplicaciones móviles y los servicios relacionados de Giivngo (en conjunto, la “Plataforma”). Al crear una Colecta, aportar a una Colecta o usar de cualquier otra forma la Plataforma, aceptas quedar obligado por estos Términos.",
        },
      ],
    },
    {
      n: "1.2",
      title: "Entidad contratante",
      body: [
        { k: "p", text: "GIIVNGO AUSTRALIA — Giivngo opera actualmente principalmente en Australia." },
      ],
    },
    {
      n: "1.3",
      title: "Naturaleza del servicio",
      body: [
        {
          k: "p",
          text: "Giivngo es una plataforma tecnológica que permite a un Organizador crear una colecta de dinero compartida (“Colecta”) en torno a una celebración o hito personal (por ejemplo, un cumpleaños, una boda, un nuevo bebé, una despedida, un viaje de equipo u otra ocasión feliz similar), y permite a los Aportantes añadir fondos hacia la meta declarada de esa Colecta.",
        },
      ],
    },
    {
      n: "1.4",
      title: "Lo que Giivngo no es",
      body: [
        {
          k: "p",
          text: "Giivngo no es una organización benéfica, ni una plataforma de recaudación para situaciones de necesidad o de crowdfunding para causas, ni un servicio de apuestas, juegos de azar, pronósticos deportivos o loterías, ni una plataforma de préstamos entre particulares. Las Colectas solo pueden crearse para los fines descritos en la Sección 6 (Finalidad permitida de las Colectas).",
        },
      ],
    },
    { n: "2", title: "Definiciones" },
    {
      n: "2.1",
      title: "Cuenta",
      body: [{ k: "p", text: "Un perfil registrado que permite a un Usuario acceder a la Plataforma y usarla." }],
    },
    { n: "2.2", title: "Aportante", body: [{ k: "p", text: "Una persona que añade fondos a una Colecta." }] },
    { n: "2.3", title: "Organizador", body: [{ k: "p", text: "Una persona que crea y gestiona una Colecta." }] },
    {
      n: "2.4",
      title: "Colecta",
      body: [
        {
          k: "p",
          text: "Un punto de recolección compartido creado por un Organizador mediante un único enlace para compartir, establecido para una Finalidad permitida, hacia el cual los Aportantes pueden añadir fondos.",
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
      title: "Socio de pagos",
      body: [
        {
          k: "p",
          text: "El/los procesador(es) de pagos de terceros contratados para procesar los movimientos de fondos en la Plataforma.",
        },
      ],
    },
    { n: "2.7", title: "Usuario", body: [{ k: "p", text: "Cualquier Organizador o Aportante, en conjunto." }] },
    {
      n: "2.8",
      title: "Contenido del Usuario",
      body: [
        {
          k: "p",
          text: "Cualquier texto, imagen, video u otro material que un Usuario envíe a la página de una Colecta o a su Perfil.",
        },
      ],
    },
    { n: "3", title: "Función y limitaciones de la Plataforma", body: [
      { k: "p", lead: "3.1.", text: "Giivngo proporciona herramientas de software que permiten a los Organizadores configurar Colectas y a los Aportantes añadir fondos a ellas. Giivngo no es un banco, no es por sí misma una entidad de pagos, y no retiene, custodia ni controla los fondos aportados. El movimiento de fondos lo lleva a cabo el Socio de pagos de conformidad con sus propias condiciones." },
      { k: "p", lead: "3.2.", text: "Giivngo no garantiza que una Colecta alcance su meta declarada y no verifica la exactitud de la información que un Organizador publique sobre la finalidad de una Colecta. Los Aportantes contribuyen a su propia discreción." },
      { k: "p", lead: "3.3.", text: "Giivngo puede modificar, suspender o discontinuar cualquier parte de la Plataforma en cualquier momento, con aviso cuando sea razonablemente posible." },
    ] },
    { n: "4", title: "Elegibilidad y registro de la cuenta", body: [
      { k: "p", lead: "4.1.", text: "Para crear una Cuenta debes proporcionar información exacta y actualizada, incluidos tu nombre y datos de contacto." },
      { k: "p", lead: "4.2. Mayoría de edad.", text: "Debes tener al menos 18 años, o la mayoría de edad en tu jurisdicción de residencia si es superior, para crear una Cuenta, actuar como Organizador o aportar como Aportante." },
      { k: "p", lead: "4.3.", text: "Puede crearse una Colecta para beneficiar a un menor (por ejemplo, el cumpleaños de un niño), siempre que el Organizador sea un adulto y cumpla con la Sección 6 y con cualquier requisito de protección aplicable." },
      { k: "p", lead: "4.4.", text: "Eres responsable de mantener confidenciales las credenciales de tu Cuenta y de toda la actividad que se produzca bajo ella." },
    ] },
    { n: "5", title: "Procesamiento de pagos", body: [
      { k: "p", lead: "5.1.", text: "Todas las aportaciones y pagos se gestionan a través del/de los Socio(s) de pagos de Giivngo. Al aportar a una Colecta o recibir fondos de ella, aceptas las condiciones del Socio de pagos aplicable, además de estos Términos." },
      { k: "p", lead: "5.2. Comisiones.", text: "Se añade una comisión de 4,4% + 0,75 AUD sobre el importe de la aportación, que paga el Aportante en el momento del pago." },
    ] },
    { n: "6", title: "Finalidad permitida de las Colectas", body: [
      { k: "p", lead: "6.1.", text: "Las Colectas solo pueden crearse para fines personales y de celebración, entre los que se incluyen, sin limitarse a ellos: cumpleaños; bodas y compromisos; baby showers; despedidas y jubilaciones; viajes en grupo; regalos de equipo o de grupo; aniversarios; y celebraciones similares de eventos de la vida." },
      { k: "p", lead: "6.2. Prohibición expresa, sin juegos de azar ni actividad basada en el azar.", text: "Una Colecta no debe implicar, de ninguna forma: una cuota de entrada pagada a cambio de la posibilidad de ganar un premio; apuestas sobre un resultado incierto; rifas, sorteos, loterías o sorteos de premios; fantasy sports o apuestas deportivas; ni ningún otro acuerdo en el que el pago de un Aportante se realice con la expectativa de un retorno monetario o en premios determinado por el azar o por un evento futuro contingente." },
      { k: "p", lead: "6.3. Sin solicitud benéfica.", text: "Giivngo no es una organización benéfica registrada ni una plataforma de recaudación benéfica. Las Colectas no deben presentarse como donaciones benéficas, y los Aportantes no deben esperar ninguna deducción fiscal ni recibo benéfico en relación con una aportación." },
      { k: "p", lead: "6.4. Sin bienes ni servicios a cambio de la aportación.", text: "Los Organizadores no deben ofrecer bienes, servicios ni ningún beneficio tangible o intangible a cambio del pago de un Aportante, distinto de la finalidad celebratoria compartida de la propia Colecta." },
      { k: "p", lead: "6.5. Sin actividad de préstamo o inversión.", text: "Las Colectas no deben utilizarse para solicitar préstamos, reembolsos, inversiones ni ningún acuerdo que conlleve la expectativa de un retorno financiero." },
    ] },
    { n: "7", title: "Responsabilidades del Organizador", body: [
      { k: "p", lead: "7.1.", text: "El Organizador es responsable de describir con exactitud la finalidad de la Colecta y de usar los fondos aportados de forma coherente con esa finalidad declarada." },
      { k: "p", lead: "7.2.", text: "El Organizador debe cumplir todas las leyes aplicables a su Colecta, incluida la protección del consumidor y, cuando corresponda, las obligaciones fiscales." },
      { k: "p", lead: "7.3.", text: "Giivngo puede solicitar pruebas razonables para confirmar que una Colecta cumple estos Términos y puede pausar o restringir una Colecta mientras se realiza esa revisión." },
      { k: "p", lead: "7.4.", text: "Cuando el Organizador no sea el destinatario previsto de los fondos (por ejemplo, si organiza en nombre de la persona que se celebra), el Organizador es responsable de transferir los fondos al destinatario previsto o de aplicarlos en su beneficio." },
    ] },
    { n: "8", title: "Responsabilidades del Aportante", body: [
      { k: "p", lead: "8.1.", text: "Los Aportantes son responsables de revisar la finalidad declarada de una Colecta antes de aportar, y aportan a su propia discreción." },
      { k: "p", lead: "8.2.", text: "Giivngo no garantiza, verifica ni asume responsabilidad por el uso final que un Organizador haga de los fondos aportados, más allá de las restricciones a nivel de plataforma de la Sección 6." },
    ] },
    { n: "9", title: "Pagos, retenciones y contracargos", body: [
      { k: "p", lead: "9.1.", text: "Los fondos recaudados en una Colecta pueden pagarse al Organizador o al destinatario designado de acuerdo con los plazos de procesamiento del Socio de pagos. Giivngo no garantiza un plazo específico para el pago." },
      { k: "p", lead: "9.2.", text: "Giivngo puede aplicar una retención temporal a una Colecta o a un pago cuando considere razonablemente que se necesita una verificación adicional para confirmar el cumplimiento de estos Términos, o cuando lo exija la ley o las normas de un Socio de pagos." },
      { k: "p", lead: "9.3.", text: "Cuando un Aportante impugne una transacción con su emisor de tarjeta o su banco, Giivngo puede proporcionar información al Socio de pagos para ayudar a resolver esa disputa." },
    ] },
    { n: "10", title: "Conducta prohibida", body: [
      { k: "p", text: "Los Usuarios no deben:" },
      { k: "p", lead: "10.1", text: "Usar la Plataforma para cualquier fin ilícito, o de forma que vulnere los derechos de cualquier tercero;" },
      { k: "p", lead: "10.2", text: "Publicar información falsa, engañosa o fraudulenta sobre una Colecta;" },
      { k: "p", lead: "10.3", text: "Usar la Plataforma para acosar, amenazar o abusar de otro Usuario;" },
      { k: "p", lead: "10.4", text: "Intentar obtener acceso no autorizado a otra Cuenta o a los sistemas de la Plataforma;" },
      { k: "p", lead: "10.5", text: "Usar medios automatizados (bots, scrapers) para interactuar con la Plataforma, salvo que esté expresamente permitido;" },
      { k: "p", lead: "10.6", text: "Usar la Plataforma para facilitar el blanqueo de capitales, la financiación del terrorismo o transacciones con personas, entidades o jurisdicciones sancionadas;" },
      { k: "p", lead: "10.7", text: "Usar la Plataforma para eludir los sistemas de pago de Giivngo (por ejemplo, indicar a los Aportantes que paguen fuera de la Plataforma presentando el pago como parte de una Colecta de Giivngo)." },
    ] },
    { n: "11", title: "Moderación de contenido y retirada", body: [
      { k: "p", lead: "11.1.", text: "Giivngo puede revisar, eliminar o restringir el acceso a una Colecta o a Contenido del Usuario que considere razonablemente que infringe estos Términos, la Política de Uso Aceptable (Parte II más abajo) o la legislación aplicable." },
      { k: "p", lead: "11.2. Denuncias.", text: "Cada foto o video subido incluye un control de denuncia/marcado. Cualquier Usuario, incluida una persona que no tenga una Cuenta de Giivngo pero haya visto una Colecta a través de un enlace compartido, puede usarlo para marcar contenido para su revisión." },
      { k: "p", lead: "11.3. Revisión.", text: "El contenido denunciado se coloca en una cola de revisión. El objetivo interno de Giivngo es revisar el contenido denunciado en un plazo de 24 a 48 horas. El contenido marcado automáticamente por el escaneo en el momento de la subida (véase 11.6) puede ser objeto de medidas antes de su publicación, sin esperar a una denuncia de un Usuario." },
      { k: "p", lead: "11.4. Resultados.", text: "Tras la revisión, Giivngo puede: no tomar ninguna medida; eliminar el contenido específico; eliminar el contenido y emitir una advertencia al autor de la subida; suspender la Cuenta del autor; o dar de baja la Cuenta del autor, según la gravedad y el historial." },
      { k: "p", lead: "11.5. Reincidencia.", text: "Giivngo mantiene un registro interno de las denuncias confirmadas contra una Cuenta." },
      { k: "p", lead: "11.6. Escaneo proactivo.", text: "Las fotos y videos subidos pasan por un escaneo automatizado de contenido en el momento de la subida, antes de hacerse visibles para otros Usuarios." },
      { k: "p", lead: "11.7. Denuncia legal y regulatoria.", text: "Determinadas categorías de contenido conllevan obligaciones de denuncia ante las autoridades públicas que existen de forma independiente y que no quedan cubiertas por el proceso interno de retirada de Giivngo." },
      { k: "p", lead: "11.8. Conservación por motivos de seguridad.", text: "Cuando el contenido se elimine por una presunta infracción grave, Giivngo puede conservar una copia y la información de la Cuenta asociada durante el tiempo necesario para cumplir obligaciones legales o responder a una solicitud de las fuerzas de seguridad o de un regulador." },
    ] },
    { n: "12", title: "Comisiones", body: [
      { k: "p", lead: "12.1.", text: "Las comisiones las paga el Aportante en el momento del pago y equivalen a 4,4% + 0,75 AUD sobre el importe de la aportación." },
    ] },
    { n: "13", title: "Propiedad intelectual", body: [
      { k: "p", lead: "13.1.", text: "Giivngo y sus licenciantes son titulares de todos los derechos sobre la propia Plataforma (software, diseño, marcas y branding), excluido el Contenido del Usuario." },
      { k: "p", lead: "13.2. Licencia de contenido.", text: "Los Usuarios conservan la titularidad del Contenido del Usuario que publican. Al subir, publicar o enviar de cualquier otra forma Contenido del Usuario a la Plataforma (incluidas fotos, videos y textos adjuntos a una Colecta), concedes a Giivngo una licencia mundial, no exclusiva y libre de regalías para alojar, almacenar, mostrar, reproducir y distribuir ese Contenido del Usuario únicamente con el fin de operar, proteger y promocionar la Plataforma. Esta licencia termina cuando el Contenido del Usuario correspondiente se elimina de la Plataforma, salvo en la medida en que Giivngo deba conservarlo por motivos legales, de seguridad o de registro descritos en la Sección 11.8." },
      { k: "p", lead: "13.3.", text: "Los Usuarios no deben copiar, extraer datos de (scrapear) ni realizar ingeniería inversa sobre la Plataforma, ni usar el contenido de la Plataforma para entrenar modelos de aprendizaje automático, sin el consentimiento previo y por escrito de Giivngo." },
      { k: "p", lead: "13.4. Responsabilidad exclusiva por el contenido subido.", text: "Eres el único responsable de cualquier Contenido del Usuario que subas, incluida su legalidad, exactitud y el hecho de que tienes derecho a subirlo. Al subir Contenido del Usuario, declaras y garantizas que: (a) eres titular del contenido o tienes los derechos y consentimientos necesarios para subirlo, incluido el consentimiento de cualquier otra persona identificable que aparezca en él; (b) el contenido cumple con la Política de Uso Aceptable (Parte II más abajo); y (c) subir el contenido no infringe la propiedad intelectual, la privacidad ni otros derechos de ningún tercero." },
      { k: "p", lead: "13.5.", text: "Giivngo no revisa previamente todo el Contenido del Usuario antes de mostrarlo, pero opera los mecanismos de moderación y denuncia descritos en la Sección 11." },
    ] },
    { n: "14", title: "Privacidad de datos", body: [
      { k: "p", lead: "14.1.", text: "La recopilación y el uso de información personal por parte de Giivngo se describen en su Política de Privacidad independiente, que forma parte de estos Términos por referencia. Consulta la Parte III más abajo para la cláusula específica sobre información personal en contenido subido, incluida la de personas que no son Usuarios de Giivngo." },
    ] },
    { n: "15", title: "Servicios de terceros", body: [
      { k: "p", lead: "15.1.", text: "La Plataforma puede enlazar a servicios de terceros o depender de ellos, incluido el Socio de pagos. Giivngo no es responsable de los actos u omisiones de los proveedores de servicios de terceros, que operan con sus propias condiciones." },
    ] },
    { n: "16", title: "Suspensión y terminación", body: [
      { k: "p", lead: "16.1.", text: "Giivngo puede suspender o dar de baja la Cuenta de un Usuario o una Colecta cuando considere razonablemente que se han infringido estos Términos, cuando lo exija la ley o para prevenir fraudes o daños a otros Usuarios." },
      { k: "p", lead: "16.2.", text: "Cuando sea razonablemente posible, Giivngo notificará la suspensión o terminación y el motivo." },
    ] },
    { n: "17", title: "Exenciones de responsabilidad y limitación de responsabilidad", body: [
      { k: "p", lead: "17.1.", text: "En la máxima medida permitida por la ley, la Plataforma se proporciona “tal cual”, sin garantías de ningún tipo. Giivngo no garantiza que una Colecta vaya a tener éxito ni que la Plataforma vaya a estar disponible sin interrupciones o libre de errores." },
      { k: "p", lead: "17.2.", text: "En la máxima medida permitida por la ley, la responsabilidad agregada de Giivngo frente a un Usuario derivada de estos Términos o del uso de la Plataforma, o relacionada con ellos, no superará las comisiones totales pagadas por ese Usuario a Giivngo en los [SEIS (6) / DOCE (12)] meses inmediatamente anteriores al hecho que dio origen a la reclamación." },
    ] },
    { n: "18", title: "Indemnización", body: [
      { k: "p", lead: "18.1.", text: "En la medida permitida por la ley, los Usuarios aceptan indemnizar a Giivngo por las reclamaciones, pérdidas y gastos derivados de su uso indebido de la Plataforma, del incumplimiento de estos Términos o de la vulneración de los derechos de un tercero." },
    ] },
    { n: "19", title: "Cambios en estos Términos", body: [
      { k: "p", lead: "19.1.", text: "Giivngo puede actualizar estos Términos periódicamente. Los cambios sustanciales se notificarán con antelación razonable, y el uso continuado de la Plataforma después de la fecha de entrada en vigor implica la aceptación de los Términos actualizados." },
    ] },
    { n: "", title: "Parte II — Política de Uso Aceptable / Normas de la Comunidad", unnumbered: true, body: [
      { k: "p", text: "Giivngo existe para ayudar a las personas a celebrar juntas ocasiones felices. Para mantener la Plataforma segura, todos los que suben contenido, tanto Organizadores como Aportantes, aceptan lo siguiente antes de subir cualquier foto, video u otro contenido." },
      { k: "p", text: "No debes subir contenido que:" },
      { k: "ul", items: [
        "contenga desnudos, contenido sexual o material de carácter sexualmente sugerente de cualquier tipo;",
        "muestre violencia gráfica, o contenido destinado a impactar, perturbar o glorificar el daño;",
        "acose, intimide, amenace o denigre a otra persona;",
        "muestre o implique a un menor de cualquier forma sexualizada, explotadora o inapropiada; esto incluye el contenido que preocuparía a un padre o madre razonable, independientemente de la intención de quien lo sube;",
        "infrinja los derechos de autor, las marcas u otros derechos de propiedad intelectual de otra persona;",
        "incluya información personal de otra persona identificable sin su consentimiento (véase la Parte III, la Política de Privacidad);",
        "sea fraudulento, engañoso, o suplante a otra persona u organización;",
        "promueva actividades ilegales de cualquier tipo.",
      ] },
      { k: "p", text: "Qué ocurre si subes algo que no debería estar ahí:" },
      { k: "ul", items: [
        "Cualquier Usuario puede denunciar el contenido mediante el control de denuncia/marcado de ese contenido.",
        "Giivngo revisará el contenido denunciado de acuerdo con los plazos de la Sección 11 de los Términos de Uso.",
        "El contenido que se considere infractor de esta Política se eliminará, y la Cuenta del autor puede ser suspendida o dada de baja, en particular en caso de infracciones reiteradas o graves.",
        "Algunas categorías de contenido también pueden comunicarse a la autoridad competente, independientemente de las medidas adoptadas en la Plataforma.",
      ] },
      { k: "p", text: "Al subir cualquier contenido a una Colecta, confirmas que has leído y aceptas esta Política de Uso Aceptable." },
    ] },
    { n: "", title: "Parte III — Política de Privacidad: información personal de terceros en contenido subido", unnumbered: true, body: [
      { k: "p", lead: "Información personal de personas que no son Usuarios de Giivngo.", text: "Las fotos y los videos subidos a una Colecta pueden contener información personal de personas distintas del autor de la subida, por ejemplo, otros invitados o niños que aparezcan en un video o foto de cumpleaños o de celebración. Al subir dicho contenido, el autor confirma que cuenta con el consentimiento adecuado para hacerlo, incluido, cuando la persona que aparece sea un menor, el consentimiento de su madre, padre o tutor." },
      { k: "p", text: "Giivngo no verifica de forma independiente que se haya obtenido ese consentimiento. Si consideras que tu imagen, o la de un menor a tu cargo, se ha subido sin el consentimiento adecuado, puedes solicitar su eliminación mediante el control de denuncia/marcado del contenido, o contactando con support@giivngo.com." },
    ] },
  ],
  },
  "pt-br": {
  title: "Termos de Uso",
  description:
    "Os termos que regem o acesso e o uso do site, dos aplicativos e dos serviços relacionados da Giivngo.",
  updated: "2026-09-30",
  sections: [
    { n: "", title: "Parte I — Termos de Uso", unnumbered: true },
    { n: "1", title: "Introdução" },
    {
      n: "1.1",
      title: "Sobre estes Termos",
      body: [
        {
          k: "p",
          text: "Estes Termos de Uso (“Termos”) regem o acesso e o uso do site, dos aplicativos móveis e dos serviços relacionados da Giivngo (em conjunto, a “Plataforma”). Ao criar uma Vaquinha, contribuir para uma Vaquinha ou usar a Plataforma de qualquer outra forma, você concorda em ficar vinculado a estes Termos.",
        },
      ],
    },
    {
      n: "1.2",
      title: "Entidade contratante",
      body: [
        { k: "p", text: "GIIVNGO AUSTRALIA — A Giivngo atualmente opera principalmente na Austrália." },
      ],
    },
    {
      n: "1.3",
      title: "Natureza do serviço",
      body: [
        {
          k: "p",
          text: "A Giivngo é uma plataforma de tecnologia que permite a um Organizador criar um fundo de dinheiro compartilhado (“Vaquinha”) em torno de uma celebração ou marco pessoal (por exemplo, um aniversário, casamento, novo bebê, despedida, viagem de equipe ou ocasião feliz semelhante), e permite que os Contribuidores adicionem valores em direção à meta declarada dessa Vaquinha.",
        },
      ],
    },
    {
      n: "1.4",
      title: "O que a Giivngo não é",
      body: [
        {
          k: "p",
          text: "A Giivngo não é uma instituição de caridade, nem uma plataforma de arrecadação para necessidades ou de crowdfunding para causas, nem um serviço de apostas, jogos de azar, palpites esportivos ou loteria, nem uma plataforma de empréstimo entre pessoas. As Vaquinhas só podem ser criadas para as finalidades descritas na Seção 6 (Finalidade Permitida das Vaquinhas).",
        },
      ],
    },
    { n: "2", title: "Definições" },
    {
      n: "2.1",
      title: "Conta",
      body: [{ k: "p", text: "Um perfil cadastrado que permite a um Usuário acessar e usar a Plataforma." }],
    },
    { n: "2.2", title: "Contribuidor", body: [{ k: "p", text: "Uma pessoa que adiciona valores a uma Vaquinha." }] },
    { n: "2.3", title: "Organizador", body: [{ k: "p", text: "Uma pessoa que cria e gerencia uma Vaquinha." }] },
    {
      n: "2.4",
      title: "Vaquinha",
      body: [
        {
          k: "p",
          text: "Um ponto de arrecadação compartilhado criado por um Organizador por meio de um único link para compartilhar, estabelecido para uma Finalidade Permitida, para o qual os Contribuidores podem adicionar valores.",
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
      title: "Parceiro de pagamento",
      body: [
        {
          k: "p",
          text: "O(s) processador(es) de pagamento terceirizado(s) contratado(s) para processar as movimentações de valores na Plataforma.",
        },
      ],
    },
    { n: "2.7", title: "Usuário", body: [{ k: "p", text: "Qualquer Organizador ou Contribuidor, coletivamente." }] },
    {
      n: "2.8",
      title: "Conteúdo do Usuário",
      body: [
        {
          k: "p",
          text: "Qualquer texto, imagem, vídeo ou outro material que um Usuário envie para a página de uma Vaquinha ou para o seu Perfil.",
        },
      ],
    },
    { n: "3", title: "Papel e limitações da Plataforma", body: [
      { k: "p", lead: "3.1.", text: "A Giivngo fornece ferramentas de software que permitem aos Organizadores configurar Vaquinhas e aos Contribuidores adicionar valores a elas. A Giivngo não é um banco, não é uma instituição de pagamento por si só, e não detém, custodia nem controla os valores contribuídos. A movimentação dos valores é realizada pelo Parceiro de Pagamento, de acordo com os próprios termos desse parceiro." },
      { k: "p", lead: "3.2.", text: "A Giivngo não garante que qualquer Vaquinha atingirá a meta declarada e não verifica a exatidão das informações que um Organizador publica sobre a finalidade de uma Vaquinha. Os Contribuidores contribuem a seu próprio critério." },
      { k: "p", lead: "3.3.", text: "A Giivngo pode modificar, suspender ou descontinuar qualquer parte da Plataforma a qualquer momento, com aviso sempre que for razoavelmente possível." },
    ] },
    { n: "4", title: "Elegibilidade e cadastro da conta", body: [
      { k: "p", lead: "4.1.", text: "Para criar uma Conta, você deve fornecer informações exatas e atualizadas, incluindo seu nome e dados de contato." },
      { k: "p", lead: "4.2. Maioridade.", text: "Você deve ter pelo menos 18 anos, ou a maioridade da sua jurisdição de residência, se for maior, para criar uma Conta, atuar como Organizador ou contribuir como Contribuidor." },
      { k: "p", lead: "4.3.", text: "Uma Vaquinha pode ser criada para beneficiar um menor (por exemplo, o aniversário de uma criança), desde que o Organizador seja adulto e cumpra a Seção 6 e quaisquer requisitos de proteção aplicáveis." },
      { k: "p", lead: "4.4.", text: "Você é responsável por manter suas credenciais de Conta em sigilo e por toda atividade realizada em sua Conta." },
    ] },
    { n: "5", title: "Processamento de pagamentos", body: [
      { k: "p", lead: "5.1.", text: "Todas as contribuições e repasses são processados pelo(s) Parceiro(s) de Pagamento da Giivngo. Ao contribuir para uma Vaquinha ou receber valores dela, você concorda com os termos do Parceiro de Pagamento aplicável, além destes Termos." },
      { k: "p", lead: "5.2. Taxas.", text: "Uma taxa de 4,4% + AUD 0,75 é acrescida ao valor da contribuição e paga pelo Contribuidor no momento do pagamento." },
    ] },
    { n: "6", title: "Finalidade permitida das Vaquinhas", body: [
      { k: "p", lead: "6.1.", text: "As Vaquinhas só podem ser criadas para finalidades felizes e pessoais, incluindo, mas não se limitando a: aniversários; casamentos e noivados; chás de bebê; despedidas e aposentadorias; viagens em grupo; presentes de equipe ou de grupo; aniversários de relacionamento; e celebrações semelhantes de eventos da vida." },
      { k: "p", lead: "6.2. Proibição expressa, sem jogos de azar ou atividade baseada em sorte.", text: "Uma Vaquinha não deve envolver, de nenhuma forma: taxa de inscrição paga em troca de uma chance de ganhar um prêmio; apostas sobre um resultado incerto; rifas, sorteios, loterias ou sorteios de prêmios; fantasy sports ou apostas esportivas; ou qualquer outro arranjo em que o pagamento de um Contribuidor seja feito na expectativa de um retorno monetário ou em prêmio determinado por sorte ou por um evento futuro contingente." },
      { k: "p", lead: "6.3. Sem solicitação de caridade.", text: "A Giivngo não é uma instituição de caridade registrada nem uma plataforma de arrecadação benemerente. As Vaquinhas não devem ser apresentadas como doações de caridade, e os Contribuidores não devem esperar qualquer dedução fiscal ou recibo de caridade em relação a uma contribuição." },
      { k: "p", lead: "6.4. Sem bens ou serviços em troca da contribuição.", text: "Os Organizadores não devem oferecer bens, serviços ou qualquer benefício tangível ou intangível em troca do pagamento de um Contribuidor, além da finalidade celebrativa compartilhada da própria Vaquinha." },
      { k: "p", lead: "6.5. Sem atividade de empréstimo ou investimento.", text: "As Vaquinhas não devem ser usadas para solicitar empréstimos, pagamentos, investimentos ou qualquer arranjo que gere expectativa de retorno financeiro." },
    ] },
    { n: "7", title: "Responsabilidades do Organizador", body: [
      { k: "p", lead: "7.1.", text: "O Organizador é responsável por descrever com precisão a finalidade da Vaquinha e por usar os valores contribuídos de forma consistente com essa finalidade declarada." },
      { k: "p", lead: "7.2.", text: "O Organizador deve cumprir todas as leis aplicáveis à sua Vaquinha, incluindo a defesa do consumidor e, quando pertinente, as obrigações tributárias." },
      { k: "p", lead: "7.3.", text: "A Giivngo pode solicitar evidências razoáveis para confirmar que uma Vaquinha cumpre estes Termos e pode pausar ou restringir uma Vaquinha enquanto essa análise estiver pendente." },
      { k: "p", lead: "7.4.", text: "Quando o Organizador não for o destinatário pretendido dos valores (por exemplo, se organizar em nome da pessoa homenageada), o Organizador é responsável por repassar os valores ao destinatário pretendido ou aplicá-los em benefício dele." },
    ] },
    { n: "8", title: "Responsabilidades do Contribuidor", body: [
      { k: "p", lead: "8.1.", text: "Os Contribuidores são responsáveis por analisar a finalidade declarada de uma Vaquinha antes de contribuir e contribuem a seu próprio critério." },
      { k: "p", lead: "8.2.", text: "A Giivngo não garante, não verifica e não se responsabiliza pelo uso final que um Organizador faça dos valores contribuídos, além das restrições em nível de plataforma previstas na Seção 6." },
    ] },
    { n: "9", title: "Repasses, retenções e estornos", body: [
      { k: "p", lead: "9.1.", text: "Os valores arrecadados em uma Vaquinha podem ser repassados ao Organizador ou ao destinatário indicado de acordo com os prazos de processamento do Parceiro de Pagamento. A Giivngo não garante um prazo específico para o repasse." },
      { k: "p", lead: "9.2.", text: "A Giivngo pode aplicar uma retenção temporária sobre uma Vaquinha ou repasse quando acreditar razoavelmente que é necessária verificação adicional para confirmar o cumprimento destes Termos, ou quando exigido por lei ou pelas regras de um Parceiro de Pagamento." },
      { k: "p", lead: "9.3.", text: "Quando um Contribuidor contestar uma transação junto à sua operadora de cartão ou ao seu banco, a Giivngo pode fornecer informações ao Parceiro de Pagamento para auxiliar na resolução dessa disputa." },
    ] },
    { n: "10", title: "Conduta proibida", body: [
      { k: "p", text: "Os Usuários não devem:" },
      { k: "p", lead: "10.1", text: "Usar a Plataforma para qualquer finalidade ilícita, ou de modo que viole os direitos de terceiros;" },
      { k: "p", lead: "10.2", text: "Publicar informações falsas, enganosas ou fraudulentas sobre uma Vaquinha;" },
      { k: "p", lead: "10.3", text: "Usar a Plataforma para assediar, ameaçar ou abusar de outro Usuário;" },
      { k: "p", lead: "10.4", text: "Tentar obter acesso não autorizado a outra Conta ou aos sistemas da Plataforma;" },
      { k: "p", lead: "10.5", text: "Usar meios automatizados (bots, scrapers) para interagir com a Plataforma, exceto quando expressamente permitido;" },
      { k: "p", lead: "10.6", text: "Usar a Plataforma para facilitar lavagem de dinheiro, financiamento do terrorismo ou transações envolvendo pessoas, entidades ou jurisdições sancionadas;" },
      { k: "p", lead: "10.7", text: "Usar a Plataforma para contornar os sistemas de pagamento da Giivngo (por exemplo, direcionar Contribuidores a pagar fora da Plataforma enquanto apresentam o pagamento como parte de uma Vaquinha da Giivngo)." },
    ] },
    { n: "11", title: "Moderação de conteúdo e remoção", body: [
      { k: "p", lead: "11.1.", text: "A Giivngo pode revisar, remover ou restringir o acesso a uma Vaquinha ou a Conteúdo do Usuário que acredite razoavelmente violar estes Termos, a Política de Uso Aceitável (Parte II abaixo) ou a legislação aplicável." },
      { k: "p", lead: "11.2. Denúncias.", text: "Cada foto ou vídeo enviado possui um controle de denúncia/sinalização. Qualquer Usuário, inclusive alguém que não tenha uma Conta da Giivngo, mas tenha visualizado uma Vaquinha por meio de um link compartilhado, pode usá-lo para sinalizar conteúdo para análise." },
      { k: "p", lead: "11.3. Análise.", text: "O conteúdo denunciado é colocado em uma fila de análise. A meta interna da Giivngo é analisar o conteúdo denunciado em até 24 a 48 horas. Conteúdo sinalizado automaticamente pela verificação no momento do envio (veja 11.6) pode ser tratado antes da publicação, sem aguardar uma denúncia de Usuário." },
      { k: "p", lead: "11.4. Resultados.", text: "Após a análise, a Giivngo pode: não tomar nenhuma providência; remover o conteúdo específico; remover o conteúdo e emitir uma advertência ao autor do envio; suspender a Conta do autor; ou encerrar a Conta do autor, dependendo da gravidade e do histórico." },
      { k: "p", lead: "11.5. Reincidência.", text: "A Giivngo mantém um registro interno de denúncias confirmadas contra uma Conta." },
      { k: "p", lead: "11.6. Verificação proativa.", text: "Fotos e vídeos enviados passam por verificação automatizada de conteúdo no momento do envio, antes de ficarem visíveis para outros Usuários." },
      { k: "p", lead: "11.7. Denúncia legal e regulatória.", text: "Determinadas categorias de conteúdo têm obrigações de comunicação obrigatória a autoridades governamentais, que existem independentemente do processo interno de remoção da Giivngo e não são cumpridas por ele." },
      { k: "p", lead: "11.8. Retenção para fins de segurança.", text: "Quando o conteúdo for removido por suspeita de violação grave, a Giivngo pode reter uma cópia e as informações associadas à Conta pelo período necessário para cumprir obrigações legais ou responder a uma solicitação de autoridades ou de órgão regulador." },
    ] },
    { n: "12", title: "Taxas", body: [
      { k: "p", lead: "12.1.", text: "As taxas são pagas pelo Contribuidor no momento do checkout e correspondem a 4,4% + AUD 0,75 sobre o valor da contribuição." },
    ] },
    { n: "13", title: "Propriedade intelectual", body: [
      { k: "p", lead: "13.1.", text: "A Giivngo e seus licenciadores são titulares de todos os direitos sobre a própria Plataforma (software, design, marcas e identidade visual), excluído o Conteúdo do Usuário." },
      { k: "p", lead: "13.2. Licença de conteúdo.", text: "Os Usuários mantêm a titularidade do Conteúdo do Usuário que publicam. Ao enviar, publicar ou submeter de outra forma Conteúdo do Usuário à Plataforma (incluindo fotos, vídeos e textos anexados a uma Vaquinha), você concede à Giivngo uma licença mundial, não exclusiva e livre de royalties para hospedar, armazenar, exibir, reproduzir e distribuir esse Conteúdo do Usuário exclusivamente para operar, proteger e promover a Plataforma. Essa licença se encerra quando o Conteúdo do Usuário correspondente for removido da Plataforma, exceto na medida em que a Giivngo seja obrigada a retê-lo para fins legais, de segurança ou de registro descritos na Seção 11.8." },
      { k: "p", lead: "13.3.", text: "Os Usuários não devem copiar, extrair dados (scrapear) ou fazer engenharia reversa da Plataforma, nem usar conteúdo da Plataforma para treinar modelos de aprendizado de máquina, sem o consentimento prévio e por escrito da Giivngo." },
      { k: "p", lead: "13.4. Responsabilidade exclusiva pelo conteúdo enviado.", text: "Você é o único responsável por qualquer Conteúdo do Usuário que envie, incluindo sua legalidade, exatidão e o fato de você ter o direito de enviá-lo. Ao enviar Conteúdo do Usuário, você declara e garante que: (a) é titular do conteúdo ou possui os direitos e consentimentos necessários para enviá-lo, inclusive o consentimento de qualquer outra pessoa identificável que apareça nele; (b) o conteúdo cumpre a Política de Uso Aceitável (Parte II abaixo); e (c) o envio do conteúdo não viola a propriedade intelectual, a privacidade ou outros direitos de terceiros." },
      { k: "p", lead: "13.5.", text: "A Giivngo não faz uma triagem prévia de todo o Conteúdo do Usuário antes de exibi-lo, mas opera os mecanismos de moderação e denúncia descritos na Seção 11." },
    ] },
    { n: "14", title: "Privacidade de dados", body: [
      { k: "p", lead: "14.1.", text: "A coleta e o uso de informações pessoais pela Giivngo são descritos na sua Política de Privacidade separada, que integra estes Termos por referência. Consulte a Parte III abaixo para a cláusula específica sobre informações pessoais em conteúdo enviado, inclusive de pessoas que não são Usuários da Giivngo." },
    ] },
    { n: "15", title: "Serviços de terceiros", body: [
      { k: "p", lead: "15.1.", text: "A Plataforma pode conter links para serviços de terceiros ou depender deles, incluindo o Parceiro de Pagamento. A Giivngo não é responsável pelos atos ou omissões de prestadores de serviços terceirizados, que operam sob seus próprios termos." },
    ] },
    { n: "16", title: "Suspensão e encerramento", body: [
      { k: "p", lead: "16.1.", text: "A Giivngo pode suspender ou encerrar a Conta de um Usuário ou uma Vaquinha quando acreditar razoavelmente que estes Termos foram violados, quando exigido por lei ou para prevenir fraude ou dano a outros Usuários." },
      { k: "p", lead: "16.2.", text: "Sempre que for razoavelmente possível, a Giivngo fornecerá aviso da suspensão ou do encerramento e do motivo." },
    ] },
    { n: "17", title: "Isenções de responsabilidade e limitação de responsabilidade", body: [
      { k: "p", lead: "17.1.", text: "Na máxima extensão permitida por lei, a Plataforma é fornecida “como está”, sem garantias de qualquer tipo. A Giivngo não garante que qualquer Vaquinha será bem-sucedida, nem que a Plataforma será ininterrupta ou livre de erros." },
      { k: "p", lead: "17.2.", text: "Na máxima extensão permitida por lei, a responsabilidade agregada da Giivngo perante um Usuário decorrente de ou relacionada a estes Termos ou ao uso da Plataforma não excederá o total de taxas pagas por esse Usuário à Giivngo nos [SEIS (6) / DOZE (12)] meses imediatamente anteriores ao fato que deu origem à reclamação." },
    ] },
    { n: "18", title: "Indenização", body: [
      { k: "p", lead: "18.1.", text: "Na medida permitida por lei, os Usuários concordam em indenizar a Giivngo contra reclamações, perdas e despesas decorrentes do uso indevido da Plataforma, de violação destes Termos ou de violação de direitos de terceiros." },
    ] },
    { n: "19", title: "Alterações destes Termos", body: [
      { k: "p", lead: "19.1.", text: "A Giivngo pode atualizar estes Termos de tempos em tempos. Alterações relevantes serão notificadas com antecedência razoável, e a continuidade do uso da Plataforma após a data de vigência constitui aceitação dos Termos atualizados." },
    ] },
    { n: "", title: "Parte II — Política de Uso Aceitável / Diretrizes da Comunidade", unnumbered: true, body: [
      { k: "p", text: "A Giivngo existe para ajudar as pessoas a celebrar juntas ocasiões felizes. Para manter a Plataforma segura, todos que enviam conteúdo, Organizadores e Contribuidores, concordam com o seguinte antes de enviar qualquer foto, vídeo ou outro conteúdo." },
      { k: "p", text: "Você não deve enviar conteúdo que:" },
      { k: "ul", items: [
        "contenha nudez, conteúdo sexual ou material de conotação sexual de qualquer tipo;",
        "retrate violência gráfica, ou conteúdo destinado a chocar, perturbar ou glorificar danos;",
        "assedie, intimide, ameace ou deprecie outra pessoa;",
        "retrate ou envolva um menor de forma sexualizada, exploratória ou de outra maneira inadequada, incluindo conteúdo que preocuparia um pai ou mãe razoável, independentemente da intenção de quem envia;",
        "viole direitos autorais, marcas ou outros direitos de propriedade intelectual de outra pessoa;",
        "inclua informações pessoais de outra pessoa identificável sem o consentimento dela (veja a Parte III, a Política de Privacidade);",
        "seja fraudulento, enganoso ou se faça passar por outra pessoa ou organização;",
        "promova atividade ilegal de qualquer tipo.",
      ] },
      { k: "p", text: "O que acontece se você enviar algo que não deveria estar lá:" },
      { k: "ul", items: [
        "Qualquer Usuário pode denunciar conteúdo usando o controle de denúncia/sinalização desse conteúdo.",
        "A Giivngo analisará o conteúdo denunciado dentro dos prazos da Seção 11 dos Termos de Uso.",
        "Conteúdo considerado em violação desta Política será removido, e a Conta do autor poderá ser suspensa ou encerrada, especialmente em casos de violações reincidentes ou graves.",
        "Algumas categorias de conteúdo também podem ser comunicadas à autoridade competente, independentemente de qualquer medida tomada na Plataforma.",
      ] },
      { k: "p", text: "Ao enviar qualquer conteúdo a uma Vaquinha, você confirma que leu e concorda com esta Política de Uso Aceitável." },
    ] },
    { n: "", title: "Parte III — Política de Privacidade: informações pessoais de terceiros em conteúdo enviado", unnumbered: true, body: [
      { k: "p", lead: "Informações pessoais de pessoas que não são Usuários da Giivngo.", text: "Fotos e vídeos enviados a uma Vaquinha podem conter informações pessoais de pessoas diferentes de quem enviou, por exemplo, outros convidados ou crianças que aparecem em um vídeo ou foto de aniversário ou celebração. Ao enviar esse conteúdo, quem envia confirma que possui o consentimento adequado para fazê-lo, incluindo, quando a pessoa exibida for uma criança, o consentimento do pai, mãe ou responsável legal dessa criança." },
      { k: "p", text: "A Giivngo não verifica de forma independente se esse consentimento foi obtido. Se você acredita que sua imagem, ou a de uma criança sob sua responsabilidade, foi enviada sem o consentimento adequado, pode solicitar sua remoção usando o controle de denúncia/sinalização do conteúdo, ou entrando em contato com support@giivngo.com." },
    ] },
  ],
  },
};
