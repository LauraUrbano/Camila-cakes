import type { Dicionario } from "./pt-PT";

/**
 * Français. Le manuel de marque tutoie, mais en français on vouvoie une
 * pâtissière qu'on ne connaît pas : le registre professionnel passe mieux en
 * France comme en Suisse romande. Décision réversible.
 *
 * Seule l'interface est traduite. Ce que la pâtissière écrit sur sa propre
 * boutique reste dans sa langue.
 */
export const fr: Dicionario = {
  meta: {
    htmlLang: "fr",
    nome: "Français",
    titulo: "Cakelyo — gérez votre activité pâtissière en un seul endroit",
    descricao:
      "Tout ce dont votre activité pâtissière a besoin, en un seul endroit. Commandes, demandes sur mesure, carte et rapports.",
  },

  comum: {
    painel: "Tableau de bord",
    precos: "Tarifs",
    verExemplo: "Voir un exemple",
    cardapio: "carte",
    lingua: "Langue",
    prototipo: "prototype navigable avec des données d'exemple",
    assinatura: "gérez votre activité pâtissière en un seul endroit",
  },

  home: {
    aviso: "Prototype visuel — pas encore de base de données",
    titulo: "Tout ce dont votre activité pâtissière a besoin,",
    tituloDestaque: "en un seul endroit.",
    subtitulo:
      "Votre cliente choisit la génoise, la garniture et le décor, voit le prix aussitôt et envoie la commande prête. Vous n'avez plus qu'à accepter — ou non.",
    verPagina: "Voir une vraie boutique",
    entrarPainel: "Ouvrir le tableau de bord",
    resumoBolo: "Grand gâteau · 3 garnitures",
    total: "Total",
    passos: [
      {
        titulo: "Composez votre carte",
        texto:
          "Tailles, génoises, garnitures et décors, chacun avec son prix. Une seule fois.",
      },
      {
        titulo: "Partagez le lien",
        texto:
          "Votre page est prête. Dans la bio, en story, dans une conversation — au lieu de vingt photos éparpillées.",
      },
      {
        titulo: "Acceptez ce que vous voulez",
        texto:
          "La commande arrive composée et chiffrée. Vous convenez du paiement et vous acceptez.",
      },
    ],
    camadasRotulo: "Ce que fait Cakelyo",
    camadasTitulo: "Tout ce qu'une commande demande, sans tableur ni carnet.",
    camadasAjuda: "Cinq couches. Ouvrez celle qui vous intéresse.",
    aceiteTitulo: "Aucune date n'entre dans votre agenda sans votre accord.",
    aceiteTexto:
      "Une commande passée sur le site est une demande, pas un engagement. Vous convenez du paiement comme vous l'avez toujours fait — virement, paiement instantané, espèces — et vous acceptez seulement ensuite. C'est écrit sur l'écran de votre cliente, pour éviter tout malentendu.",
    aceitarPedido: "Accepter la commande",
    recusar: "Refuser",
    aceiteNota: "accepter réserve la date dans votre agenda",
    vitrineRotulo: "La page lui appartient",
    vitrineTitulo: "La même vitrine, au visage de celle qui la tient.",
    vitrineTexto:
      "Choisissez un nom et regardez l'adresse, les couleurs, les prix et la monnaie changer. C'est la même page — elle appartient simplement à quelqu'un d'autre.",
    vitrineMoeda: "prix en",
    abrirPagina: "Ouvrir cette page →",
    chamadaTitulo: "Votre pâtisserie mérite mieux qu'un album photo.",
    chamadaBotao: "Voir Cakelyo à l'œuvre",
  },

  areas: [
    {
      titulo: "Prix par combinaison",
      resumo: "La taille commande le prix et le nombre de garnitures",
      texto:
        "La taille fixe le prix de départ et le nombre de garnitures possibles. Génoise, garniture et décor s'ajoutent en supplément et le total se calcule tout seul — aucune grille tarifaire à tenir à jour.",
      accao: "Composer un gâteau",
    },
    {
      titulo: "Collections saisonnières",
      resumo: "Noël, Pâques, fête des Mères — en ligne et hors ligne à la date",
      texto:
        "Vous composez la carte de la saison une fois et vous dites quand elle paraît et quand elle disparaît. Le même gâteau peut vivre dans plusieurs collections, et désactiver celle de Noël n'efface rien — cela la retire seulement de la page.",
      accao: "Voir la carte",
    },
    {
      titulo: "Limite de production",
      resumo: "Dites combien vous pouvez en faire, le site s'arrête seul",
      texto:
        "Vous dites combien d'unités vous pouvez produire sur la période. Le site compte pour vous et, une fois épuisé, l'article quitte la page — personne ne commande ce que vous ne pouvez plus faire.",
      accao: "Voir dans le tableau de bord",
    },
    {
      titulo: "La livraison à votre façon",
      resumo: "Retrait, livraison par secteur, frais par zone",
      texto:
        "Vous définissez les façons de recevoir et ce que vous facturez pour chacune. Votre cliente en choisit une au moment de commander et les frais entrent dans le total, sans échange de messages.",
      accao: "Régler les livraisons",
    },
    {
      titulo: "Rapports",
      resumo: "Chiffre confirmé, panier moyen et ce qui part le plus",
      texto:
        "Chiffre d'affaires confirmé, panier moyen, taux d'acceptation et classement des produits. Les commandes en attente d'acceptation restent hors du compte — seul entre ce à quoi vous avez déjà dit oui.",
      accao: "Ouvrir les rapports",
    },
  ],

  precos: {
    rotulo: "Formules",
    titulo: "Un prix fixe par mois. Aucune commission sur ce que vous vendez.",
    subtitulo:
      "Commencez sans rien payer. Quand la carte s'étoffe et que les saisons chargent, vous montez de formule — ou pas.",
    mensal: "Mensuel",
    anual: "Annuel",
    doisMeses: "deux mois offerts",
    porMes: "mois",
    porAno: "an",
    gratis: "Gratuit",
    porMesCobrado: "par mois, facturés en une fois",
    maisEscolhido: "la plus choisie",
    comecarSemPagar: "Commencer gratuitement",
    escolher: "Choisir",
    planoAPlano: "Formule par formule",
    planoAPlanoAjuda: "Ce qui change de l'une à l'autre, sans petits caractères.",
    tabelaLegenda: "Comparaison des formules",
    incluido: "inclus",
    naoIncluido: "non inclus",
    brasilTitulo: "Si vous payez depuis le Brésil :",
    brasilTexto:
      "Cakelyo facture depuis le Portugal, votre carte traite donc l'opération comme un achat international — votre banque ajoute la taxe IOF et une marge de change, environ 7% au-dessus du prix affiché.",
    brasilSaidaAntes: "Pour l'éviter,",
    brasilSaidaForte: "choisissez la formule annuelle et payez par Pix",
    brasilSaidaDepois:
      " : c'est un paiement local en reais, sans IOF ni change. Il part une fois par an, au prix exact du tableau.",
    codigoTitulo: "Vous avez reçu un code d'accès à vie ?",
    codigoTexto: "Utilisez-le dans",
    codigoLink: "Formule et facturation",
    codigoFim: "et la formule est à vous pour toujours, sans paiement ni carte.",
    prototipoTitulo: "Ceci est un prototype.",
    prototipoTexto:
      "Aucun paiement n'est traité — la connexion à Stripe arrivera avec les comptes et la base de données.",
    duvidasTitulo: "Avant que vous ne demandiez",
    duvidas: [
      {
        pergunta: "Prenez-vous une commission sur les commandes ?",
        resposta:
          "Non. Le paiement de la commande se règle directement entre vous et votre cliente — virement, paiement instantané, espèces. Cakelyo n'entre pas dans cette transaction et n'en retient rien.",
      },
      {
        pergunta: "Puis-je changer de formule ou partir ?",
        resposta:
          "À tout moment, depuis le tableau de bord. En montant, vous ne payez que la différence pour le reste de la période. En partant, votre page reste en ligne jusqu'à la fin de la période déjà payée, puis repasse à la formule Prova — vous ne perdez pas votre carte.",
      },
      {
        pergunta: "Les prix comprennent-ils la TVA ?",
        resposta:
          "Les montants ci-dessus sont hors taxes. La TVA s'ajoute à la fin selon le pays et, si vous avez un numéro de TVA intracommunautaire, l'autoliquidation s'applique. La facture part du Portugal, quel que soit le pays depuis lequel vous payez.",
      },
      {
        pergunta: "Quels moyens de paiement acceptez-vous ?",
        resposta:
          "La carte, via Stripe, dans tous les pays. Au Brésil nous acceptons aussi le Pix sur la formule annuelle. Les données de carte ne passent jamais par nos serveurs.",
      },
      {
        pergunta: "Pourquoi le montant débité diffère-t-il au Brésil ?",
        resposta:
          "Parce que Cakelyo facture depuis le Portugal et que la banque traite le prélèvement comme un achat international : elle ajoute la taxe IOF et une marge de change, environ 7% au-dessus du prix affiché. Payer la formule annuelle par Pix évite ce coût — c'est un paiement local en reais.",
      },
    ],
  },

  painel: {
    nav: {
      geral: "Vue d'ensemble",
      pedidos: "Commandes",
      relatorios: "Rapports",
      cardapio: "Carte",
      colecoes: "Collections",
      pagina: "Ma page",
      plano: "Formule",
    },
    painel: "tableau de bord",
    verPagina: "Voir ma page",
    geral: {
      titulo: "Vue d'ensemble",
      saudacao: "Bonjour",
      aEspera: "en attente de votre accord",
      aEsperaUm: "commande en attente de votre accord",
      aEsperaVarios: "commandes en attente de votre accord",
      aEsperaTexto:
        "Aucune n'est encore dans votre agenda. Convenez du paiement avec la cliente et acceptez pour réserver la date. →",
      naAgenda: "Dans l'agenda",
      naAgendaNota: "commandes acceptées",
      aReceber: "À encaisser",
      aReceberNota: "commandes en cours",
      colecoesAtivas: "Collections en ligne",
      colecoesNota: "visibles en ce moment",
      proximas: "Prochaines livraisons",
      pedidoPersonalizado: "commande sur mesure",
      emProducao: "en production",
      aceite: "acceptée",
      producaoAcabar: "Production bientôt épuisée",
      vendidosDe: "sur",
      vendidos: "vendus",
      esgotouSaiu: "épuisé — retiré de la carte",
      restamNota: "quitte la page tout seul une fois à zéro",
      restam: "il reste",
    },
    pedidos: {
      titulo: "Commandes",
      subtitulo:
        "Une commande envoyée par le site n'est qu'une demande. Elle entre dans votre agenda quand vous l'acceptez — en général après avoir convenu du paiement.",
      aEsperaUm: "en attente",
      aEsperaVarios: "en attente d'acceptation",
      filtroTodos: "Toutes",
      filtroAguardando: "En attente d'accord",
      filtroAceite: "Acceptées",
      filtroProducao: "En production",
      filtroEntregue: "Livrées",
      filtroRecusado: "Refusées",
      procurar: "Chercher par nom ou numéro",
      semResultados: "Aucune commande avec ce filtre.",
      de: "sur",
      escolhePedido: "Choisissez une commande à gauche.",
      aOrcar: "à chiffrer",
      pedidoEm: "commandé le",
      entrega: "livraison",
      naoReservada: "· la date n'est pas encore réservée",
      personalizado: "commande sur mesure",
      massa: "Génoise",
      recheio: "Garniture",
      decoracao: "Décor",
      semTaxa: "sans frais",
      aceitar: "Accepter la commande",
      recusar: "Refuser",
      aceitarNota: "accepter réserve la date dans votre agenda",
      marcarProducao: "Marquer en production",
      marcarEntregue: "Marquer comme livrée",
      encerrado: "Commande close.",
      estados: {
        aguardando: "en attente d'accord",
        aceito: "acceptée",
        producao: "en production",
        entregue: "livrée",
        recusado: "refusée",
      },
    },
    cardapio: {
      titulo: "Carte",
      subtitulo:
        "Le prix ne se saisit pas article par article : vous fixez le prix de chaque taille et le supplément de chaque génoise, garniture et décor. Le total de la combinaison composée par votre cliente se calcule tout seul.",
      diasAntecedencia: "jours à l'avance",
      limite: "limite",
      tamanhosNota:
        "Tailles — chacune fixe le prix de départ et le nombre de garnitures",
      ate: "jusqu'à",
      recheio: "garniture",
      recheios: "garnitures",
      massas: "Génoises",
      recheiosTitulo: "Garnitures",
      decoracoes: "Décors",
      incluido: "inclus",
    },
    colecoes: {
      titulo: "Collections",
      subtitulo:
        "Des cartes qui paraissent et disparaissent à la date. Le même gâteau peut figurer dans plusieurs collections — désactiver celle de Noël n'efface rien, cela la retire seulement de la page.",
      destaque: "mise en avant",
      noAr: "en ligne",
      foraDoAr: "hors ligne",
    },
    pagina: {
      titulo: "Ma page",
      subtitulo:
        "Tout ce que votre cliente voit est à vous : adresse, couleurs, textes et façons de recevoir.",
      endereco: "Adresse",
      sempreActivo: "toujours active",
      dominioProprio: "domaine propre",
      dominioNota:
        "Vous avez déjà un domaine ? Pointez-le ici et votre page répondra aux deux adresses.",
      identidade: "Identité visuelle",
      corMarca: "Marque",
      corMarcaSuave: "Marque claire",
      corFundo: "Fond",
      corTexto: "Texte",
      textos: "Textes de la page",
      chamada: "Accroche",
      sobre: "À propos",
      avisoPagamento: "Note de paiement",
      formasReceber: "Façons de recevoir",
      gratis: "offert",
      personalizados: "Commandes sur mesure",
      personalizadosLigado:
        "Activé. Votre cliente peut demander un devis pour ce qui n'est pas sur la carte.",
      personalizadosDesligado:
        "Désactivé. Votre cliente ne peut commander que ce qui est sur la carte.",
    },
    relatorios: {
      titulo: "Rapports",
      subtitulo:
        "Ce qui a été accepté, ce qui se vend le plus et comment se passe le mois. Les commandes en attente d'acceptation ne comptent pas comme chiffre d'affaires.",
      receita: "Chiffre confirmé",
      encomendasAceites: "commandes acceptées",
      faceMesAnterior: "par rapport au mois dernier",
      ticket: "Panier moyen",
      ticketNota: "par commande",
      taxaAceite: "Taux d'acceptation",
      recusadas: "refusées",
      encomendas: "Commandes",
      desdeInicio: "depuis le début",
      receitaMes: "Chiffre par mois",
      ultimosSeis: "Six derniers mois clos",
      mes: "Mois",
      verTabela: "Voir en tableau",
      esconderTabela: "Masquer le tableau",
      maisSai: "Ce qui part le plus",
      porEncomendas: "Par nombre de commandes",
      emQuePe: "Où elles en sont",
      todasEncomendas: "Toutes les commandes",
    },
    plano: {
      titulo: "Formule et facturation",
      subtitulo:
        "Ce que vous payez pour la plateforme. À ne pas confondre avec ce que vous encaissez de vos clientes — cet argent ne passe jamais par ici.",
      plano: "Formule",
      semCusto: "Sans frais",
      paraSempre: "pour toujours",
      porSemIva: "hors TVA",
      por: "par",
      vitaliciaAntes: "Vous avez la formule",
      vitaliciaForte: "pour toujours",
      vitaliciaDepois: "grâce au code",
      vitaliciaNota:
        "Il n'y a pas de renouvellement, pas de carte, et rien ne vous sera jamais facturé.",
      proximaCobranca: "Prochain prélèvement",
      cartao: "Carte",
      nenhum: "aucune",
      cobranca: "Facturation",
      gerirStripe: "Gérer dans Stripe",
      verPlanos: "Voir les formules",
      temCodigo: "J'ai un code",
      temCodigoTexto:
        "Si vous avez reçu un code d'accès à vie, saisissez-le ici. La formule est à vous pour toujours, sans rien payer et sans carte.",
      codigoCampo: "Votre code",
      resgatar: "Valider",
      aVerificar: "Vérification…",
      estasAUsar: "Ce que vous utilisez",
      produtos: "Produits",
      colecoes: "Collections",
      encomendasMes: "Commandes ce mois-ci",
      semLimite: "· sans limite dans cette formule",
      faturas: "Factures",
      semFaturas: "Pas encore de facture — la formule Prova ne facture rien.",
      paga: "payée",
      porPagar: "impayée",
      mudarPlano: "Changer de formule",
      eOTeuPlano: "votre formule actuelle",
      trocarPara: "passer à celle-ci",
      mudarNota:
        "En montant, vous ne payez que la différence pour le reste de la période. En descendant ou en résiliant, votre page reste en ligne jusqu'à la fin de la période déjà payée.",
      prototipoForte: "Rien ici ne facture vraiment.",
      prototipoTexto:
        "C'est un prototype : les boutons ne parlent pas à Stripe et les factures sont des exemples. La validation du code se fait déjà côté serveur, mais rien n'est encore enregistré.",
      estados: {
        teste: "à l'essai",
        activa: "active",
        vitalicia: "à vie",
        pagamento_falhou: "paiement refusé",
        cancelada: "résiliée",
      },
      erros: {
        vazio: "Saisissez le code.",
        desconhecido: "Je ne connais pas ce code.",
        esgotado: "Ce code a déjà été utilisé le nombre de fois autorisé.",
      },
    },
  },

  loja: {
    falarComigo: "M'écrire",
    feitaNo: "Page réalisée avec Cakelyo ·",
    criaATua: "créez la vôtre",
    desde: "à partir de",
    diasAntes: "jours à l'avance",
    esgotado: "épuisé",
    restam: "il reste",
    porTempoLimitado: "pour un temps limité",
    naoEncontrou: "Vous n'avez pas trouvé ce que vous cherchiez ?",
    naoEncontrouTexto:
      "Gâteau de mariage, thème particulier, restriction alimentaire. Racontez-moi l'idée et je vous fais un devis.",
    pedirOrcamento: "Demander un devis",
    comoRecebe: "Comment vous le recevez",
    comoPaga: "Comment vous payez",
    gratis: "offert",
    reservaAntes: "Une commande passée sur le site est une",
    reservaForte: "demande de réservation",
    reservaDepois:
      ". Elle n'entre dans l'agenda qu'après que j'aie confirmé avec vous et accepté.",
    montador: {
      encomendeCom: "Commandez",
      diasAntecedencia: "jours à l'avance",
      restamUnidades: "il reste",
      unidades: "unités",
      tamanho: "Taille",
      ate: "jusqu'à",
      recheio: "garniture",
      recheios: "garnitures",
      massa: "Génoise",
      recheiosTitulo: "Garnitures",
      /** Prefixo da linha do orçamento: "Garniture Nutella". */
      prefixoRecheio: "Garniture",
      completo: "complet",
      escolheMais: "choisissez encore",
      decoracao: "Décor",
      comoReceber: "Comment le recevoir",
      observacoes: "Remarques",
      observacoesAjuda:
        "Thème de la fête, couleurs, un prénom sur le dessus, une restriction alimentaire…",
      seuBolo: "Votre gâteau",
      entrega: "livraison",
      total: "Total",
      enviarPedido: "Envoyer la commande",
      enviarNota1: "Envoyer ne réserve pas la date.",
      enviarNota2: "doit",
      enviarNota3: "accepter la commande",
      enviarNota4: "pour qu'elle compte.",
      incluido: "inclus",
      inclusa: "incluse",
      emFalta: "indisponible",
      acrescimo: "supplément",
      recheioPremium: "garniture premium",
      faltaUm: "Il reste 1 garniture à choisir",
      faltamVarios: "Il reste à choisir",
      faltamFim: "garnitures",
      escolheTamanho: "Choisissez la taille",
      escolheMassa: "Choisissez la génoise",
      enviadoTitulo: "Commande envoyée",
      enviadoTexto1:
        "a bien reçu votre demande et vous contactera pour convenir du paiement.",
      enviadoAviso: "Votre date n'est pas encore garantie",
      enviadoAvisoTexto1:
        "La commande n'entre dans l'agenda que lorsque la pâtissière l'",
      enviadoAvisoForte: "accepte",
      enviadoAvisoTexto2:
        ". Vous recevrez un message dès que ce sera fait — en général sous 24 heures.",
      voltarCardapio: "Retour à la carte",
    },
    personalizado: {
      titulo: "Commande sur mesure",
      subtitulo:
        "Pour ce qui n'entre pas dans la carte toute faite. Décrivez l'idée avec le plus de détails possible — plus j'en sais, plus le devis est juste.",
      nome: "Votre nom",
      whatsapp: "WhatsApp",
      data: "Date de la fête",
      pessoas: "Combien de personnes",
      ideia: "L'idée",
      ideiaAjuda:
        "Thème, couleurs, parfums que vous aimez, références que vous avez vues, restrictions alimentaires…",
      avisoAntes: "Une commande sur mesure commence par un",
      avisoForte: "devis",
      avisoDepois: ". La date n'est réservée qu'une fois que",
      avisoFim: "a accepté la commande.",
      botao: "Demander un devis",
      enviadoTitulo: "Devis demandé",
      enviadoTexto:
        "vous répondra avec un prix et, si vous l'approuvez, accepte la commande et la date est réservée.",
    },
  },

  planos: {
    prova: {
      promessa: "Pour monter la carte et voir si cela vous convient.",
      inclui: [
        "Votre page sur cakelyo.app/votre-nom",
        "Commandes illimitées, acceptées à la main",
        "Jusqu'à 5 produits et 1 collection",
        "Calcul automatique du gâteau",
        "Vos couleurs et votre logo",
        "Agenda des commandes",
      ],
      naoInclui: [
        "Collections saisonnières",
        "Limites de production",
        "Rapports",
      ],
    },
    atelier: {
      promessa: "Pour celles qui en vivent déjà et ont des saisons chargées.",
      inclui: [
        "Tout ce que contient Prova",
        "Produits et collections sans limite",
        "Collections saisonnières avec dates de début et de fin",
        "Limites de production par article",
        "Rapports de chiffre et d'acceptation",
        "Historique complet des clientes",
      ],
      naoInclui: ["Domaine propre", "Équipe", "Formulaires par cliente"],
    },
    pastelaria: {
      promessa: "Pour celles qui ont leur marque et une équipe.",
      inclui: [
        "Tout ce que contient Atelier",
        "Domaine propre",
        "Jusqu'à 5 utilisateurs sur le même compte",
        "Formulaires de carte par cliente",
        "Assistance prioritaire",
      ],
      naoInclui: [],
    },
  },

  comparacao: {
    linhas: {
      paginaPublica: "Page publique",
      pedidos: "Commandes",
      produtos: "Produits",
      colecoes: "Collections",
      personalizar: "Couleurs et logo personnalisés",
      entrega: "Livraison et retrait",
      calculo: "Calcul automatique du gâteau",
      agenda: "Agenda des commandes",
      sazonais: "Collections saisonnières",
      limites: "Limites de production",
      relatorios: "Rapports",
      clientes: "Clientes et historique",
      dominio: "Domaine propre",
      equipa: "Équipe",
      formularios: "Formulaires par cliente",
      apoio: "Assistance prioritaire",
    },
    valores: {
      ilimitados: "illimitées",
      ilimitadas: "illimitées",
      ate5: "jusqu'à 5",
      um: "1",
      basico: "de base",
      completo: "complet",
      ate5Utilizadores: "jusqu'à 5 utilisateurs",
    },
  },

};
