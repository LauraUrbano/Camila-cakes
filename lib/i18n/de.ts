import type { Dicionario } from "./pt-PT";

/**
 * Deutsch. Wie im Französischen die Sie-Form: eine Konditorin, die man nicht
 * kennt, duzt man im deutschsprachigen Raum nicht — weder in der Schweiz noch
 * in Deutschland. Umkehrbar, falls gewünscht.
 *
 * Übersetzt ist nur die Oberfläche. Was die Konditorin über ihren eigenen
 * Laden schreibt, bleibt in ihrer Sprache.
 */
export const de: Dicionario = {
  meta: {
    htmlLang: "de",
    nome: "Deutsch",
    titulo: "Cakelyo — Ihr Tortengeschäft an einem Ort",
    descricao:
      "Alles, was Ihr Tortengeschäft braucht, an einem Ort. Bestellungen, Sonderwünsche, Sortiment und Auswertungen.",
  },

  comum: {
    painel: "Übersicht",
    precos: "Preise",
    verExemplo: "Beispiel ansehen",
    cardapio: "Sortiment",
    lingua: "Sprache",
    prototipo: "klickbarer Prototyp mit Beispieldaten",
    assinatura: "Ihr Tortengeschäft an einem Ort",
  },

  home: {
    aviso: "Visueller Prototyp — noch ohne Datenbank",
    titulo: "Alles, was Ihr Tortengeschäft braucht,",
    tituloDestaque: "an einem Ort.",
    subtitulo:
      "Ihre Kundin wählt Boden, Füllung und Dekor, sieht den Preis sofort und schickt die Bestellung fertig ab. Sie müssen nur noch annehmen — oder eben nicht.",
    verPagina: "Eine echte Seite ansehen",
    entrarPainel: "Zur Übersicht",
    resumoBolo: "Große Torte · 3 Füllungen",
    total: "Gesamt",
    passos: [
      {
        titulo: "Sortiment anlegen",
        texto:
          "Größen, Böden, Füllungen und Dekore, jedes mit seinem Preis. Einmal, und fertig.",
      },
      {
        titulo: "Link teilen",
        texto:
          "Ihre Seite steht. In die Bio, in eine Story, in den Chat — statt zwanzig loser Fotos.",
      },
      {
        titulo: "Annehmen, was Sie wollen",
        texto:
          "Die Bestellung kommt fertig zusammengestellt und ausgepreist an. Sie klären die Zahlung und nehmen an.",
      },
    ],
    camadasRotulo: "Was Cakelyo macht",
    camadasTitulo: "Alles, was eine Bestellung braucht — ohne Tabelle und ohne Heft.",
    camadasAjuda: "Fünf Ebenen. Öffnen Sie die, die Sie interessiert.",
    aceiteTitulo: "Kein Termin landet in Ihrem Kalender, bevor Sie Ja sagen.",
    aceiteTexto:
      "Eine Bestellung über die Seite ist eine Anfrage, keine Zusage. Sie klären die Zahlung wie immer — Überweisung, Sofortzahlung, bar — und nehmen erst danach an. Das steht auch auf dem Bildschirm Ihrer Kundin, damit es keine Missverständnisse gibt.",
    aceitarPedido: "Bestellung annehmen",
    recusar: "Ablehnen",
    aceiteNota: "Annehmen reserviert den Termin in Ihrem Kalender",
    vitrineRotulo: "Die Seite gehört ihr",
    vitrineTitulo: "Dasselbe Schaufenster, mit dem Gesicht der Inhaberin.",
    vitrineTexto:
      "Tippen Sie auf einen Namen und sehen Sie zu, wie Adresse, Farben, Preise und Währung wechseln. Es ist dieselbe Seite — sie gehört nur jemand anderem.",
    vitrineMoeda: "Preise in",
    abrirPagina: "Diese Seite öffnen →",
    chamadaTitulo: "Ihr Tortengeschäft hat mehr verdient als ein Fotoalbum.",
    chamadaBotao: "Cakelyo in Aktion sehen",
  },

  areas: [
    {
      titulo: "Preis nach Kombination",
      resumo: "Die Größe bestimmt Preis und Anzahl der Füllungen",
      texto:
        "Die Größe legt den Startpreis fest und wie viele Füllungen hineinpassen. Boden, Füllung und Dekor kommen als Aufpreis dazu, und die Summe ergibt sich von selbst — keine Preisliste, die gepflegt werden muss.",
      accao: "Torte zusammenstellen",
    },
    {
      titulo: "Saisonale Kollektionen",
      resumo: "Weihnachten, Ostern, Muttertag — pünktlich online und offline",
      texto:
        "Sie stellen das Sortiment der Saison einmal zusammen und sagen, wann es erscheint und wann es verschwindet. Dieselbe Torte kann in mehreren Kollektionen leben, und das Abschalten der Weihnachtskollektion löscht nichts — es nimmt sie nur von der Seite.",
      accao: "Sortiment ansehen",
    },
    {
      titulo: "Produktionsgrenze",
      resumo: "Sagen Sie, wie viele Sie schaffen — die Seite stoppt von selbst",
      texto:
        "Sie sagen, wie viele Stück Sie im Zeitraum schaffen. Die Seite zählt für Sie mit, und wenn es aufgebraucht ist, verschwindet der Artikel — niemand bestellt, was Sie nicht mehr backen können.",
      accao: "In der Übersicht ansehen",
    },
    {
      titulo: "Lieferung nach Ihrer Art",
      resumo: "Abholung, Lieferung nach Gebiet, Gebühr je Region",
      texto:
        "Sie legen fest, wie abgeholt oder geliefert wird und was das kostet. Ihre Kundin wählt beim Bestellen aus, und die Gebühr steht gleich in der Summe — ohne Hin und Her per Nachricht.",
      accao: "Lieferung einrichten",
    },
    {
      titulo: "Auswertungen",
      resumo: "Bestätigter Umsatz, Durchschnittsbon und Bestseller",
      texto:
        "Bestätigter Umsatz, durchschnittlicher Bestellwert, Annahmequote und die Rangliste der Produkte. Bestellungen, die noch auf Annahme warten, bleiben draußen — gezählt wird nur, wozu Sie schon Ja gesagt haben.",
      accao: "Auswertungen öffnen",
    },
  ],

  precos: {
    rotulo: "Pakete",
    titulo: "Ein fester Preis pro Monat. Keine Provision auf Ihre Umsätze.",
    subtitulo:
      "Fangen Sie an, ohne etwas zu zahlen. Wenn das Sortiment wächst und die Saison drückt, wechseln Sie das Paket — oder eben nicht.",
    mensal: "Monatlich",
    anual: "Jährlich",
    doisMeses: "zwei Monate geschenkt",
    porMes: "Monat",
    porAno: "Jahr",
    gratis: "Kostenlos",
    porMesCobrado: "pro Monat, einmal jährlich abgerechnet",
    maisEscolhido: "am häufigsten gewählt",
    comecarSemPagar: "Kostenlos starten",
    escolher: "Wählen:",
    planoAPlano: "Paket für Paket",
    planoAPlanoAjuda: "Was sich von einem zum anderen ändert, ohne Kleingedrucktes.",
    tabelaLegenda: "Vergleich der Pakete",
    incluido: "enthalten",
    naoIncluido: "nicht enthalten",
    brasilTitulo: "Wenn Sie aus Brasilien zahlen:",
    brasilTexto:
      "Cakelyo rechnet aus Portugal ab, Ihre Karte behandelt das also als Auslandskauf — Ihre Bank schlägt die IOF-Steuer und einen Wechselkursaufschlag drauf, rund 7% über dem gezeigten Preis.",
    brasilSaidaAntes: "Um das zu vermeiden,",
    brasilSaidaForte: "wählen Sie das Jahrespaket und zahlen per Pix",
    brasilSaidaDepois:
      ": eine lokale Zahlung in Real, ohne IOF und ohne Umrechnung. Einmal im Jahr, genau zum Preis aus der Tabelle.",
    codigoTitulo: "Haben Sie einen Code für lebenslangen Zugang?",
    codigoTexto: "Lösen Sie ihn ein unter",
    codigoLink: "Paket und Abrechnung",
    codigoFim: "und das Paket gehört Ihnen dauerhaft, ohne Zahlung und ohne Karte.",
    prototipoTitulo: "Das hier ist ein Prototyp.",
    prototipoTexto:
      "Es wird keine Zahlung verarbeitet — die Anbindung an Stripe kommt, sobald es Konten und eine Datenbank gibt.",
    duvidasTitulo: "Bevor Sie fragen",
    duvidas: [
      {
        pergunta: "Nehmen Sie Provision auf die Bestellungen?",
        resposta:
          "Nein. Die Zahlung der Bestellung klären Sie direkt mit Ihrer Kundin — Überweisung, Sofortzahlung, bar. Cakelyo ist an diesem Geschäft nicht beteiligt und behält nichts davon.",
      },
      {
        pergunta: "Kann ich das Paket wechseln oder kündigen?",
        resposta:
          "Jederzeit, über die Übersicht. Beim Hochstufen zahlen Sie nur die Differenz für den Rest des Zeitraums. Beim Kündigen bleibt Ihre Seite bis zum Ende des bezahlten Zeitraums online und fällt danach auf das Paket Prova zurück — Ihr Sortiment bleibt erhalten.",
      },
      {
        pergunta: "Sind die Preise inklusive Mehrwertsteuer?",
        resposta:
          "Die Beträge oben verstehen sich ohne Steuer. Die Mehrwertsteuer kommt je nach Land am Ende dazu, und bei einer EU-Umsatzsteuer-Identifikationsnummer greift das Reverse-Charge-Verfahren. Die Rechnung kommt aus Portugal, aus welchem Land Sie auch zahlen.",
      },
      {
        pergunta: "Welche Zahlungsmittel nehmen Sie an?",
        resposta:
          "Karte, über Stripe, in allen Ländern. In Brasilien zusätzlich Pix im Jahrespaket. Kartendaten berühren unsere Server nie.",
      },
      {
        pergunta: "Warum steht auf meiner brasilianischen Abrechnung ein anderer Betrag?",
        resposta:
          "Weil Cakelyo aus Portugal abrechnet und Ihre Bank die Belastung als Auslandskauf behandelt: Sie schlägt IOF-Steuer und Wechselkursaufschlag drauf, rund 7% über dem Tabellenpreis. Wer das Jahrespaket per Pix zahlt, hat diese Kosten nicht — das ist eine lokale Zahlung in Real.",
      },
    ],
  },

  painel: {
    nav: {
      geral: "Überblick",
      pedidos: "Bestellungen",
      relatorios: "Auswertungen",
      cardapio: "Sortiment",
      colecoes: "Kollektionen",
      pagina: "Meine Seite",
      plano: "Paket",
    },
    painel: "Übersicht",
    verPagina: "Meine Seite ansehen",
    geral: {
      titulo: "Überblick",
      saudacao: "Guten Morgen",
      aEspera: "wartet auf Ihre Zusage",
      aEsperaUm: "Bestellung wartet auf Ihre Zusage",
      aEsperaVarios: "Bestellungen warten auf Ihre Zusage",
      aEsperaTexto:
        "Keine davon steht schon in Ihrem Kalender. Klären Sie die Zahlung mit der Kundin und nehmen Sie an, um den Termin zu sichern. →",
      naAgenda: "Im Kalender",
      naAgendaNota: "angenommene Bestellungen",
      aReceber: "Offen",
      aReceberNota: "laufende Bestellungen",
      colecoesAtivas: "Aktive Kollektionen",
      colecoesNota: "gerade online",
      proximas: "Nächste Lieferungen",
      pedidoPersonalizado: "Sonderbestellung",
      emProducao: "in Produktion",
      aceite: "angenommen",
      producaoAcabar: "Produktion geht zur Neige",
      vendidosDe: "von",
      vendidos: "verkauft",
      esgotouSaiu: "ausverkauft — aus dem Sortiment",
      restamNota: "verschwindet von selbst, sobald es null erreicht",
      restam: "übrig",
    },
    pedidos: {
      titulo: "Bestellungen",
      subtitulo:
        "Eine über die Seite gesendete Bestellung ist nur eine Anfrage. Sie kommt in Ihren Kalender, sobald Sie sie annehmen — meist nachdem die Zahlung geklärt ist.",
      aEsperaUm: "wartet",
      aEsperaVarios: "warten auf Annahme",
      filtroTodos: "Alle",
      filtroAguardando: "Warten auf Zusage",
      filtroAceite: "Angenommen",
      filtroProducao: "In Produktion",
      filtroEntregue: "Geliefert",
      filtroRecusado: "Abgelehnt",
      procurar: "Nach Name oder Nummer suchen",
      semResultados: "Keine Bestellung mit diesem Filter.",
      de: "von",
      escolhePedido: "Wählen Sie links eine Bestellung.",
      aOrcar: "noch zu beziffern",
      pedidoEm: "bestellt am",
      entrega: "Lieferung",
      naoReservada: "· der Termin ist noch nicht reserviert",
      personalizado: "Sonderbestellung",
      massa: "Boden",
      recheio: "Füllung",
      decoracao: "Dekor",
      semTaxa: "ohne Gebühr",
      aceitar: "Bestellung annehmen",
      recusar: "Ablehnen",
      aceitarNota: "Annehmen reserviert den Termin in Ihrem Kalender",
      marcarProducao: "Als in Produktion markieren",
      marcarEntregue: "Als geliefert markieren",
      encerrado: "Bestellung abgeschlossen.",
      estados: {
        aguardando: "wartet auf Zusage",
        aceito: "angenommen",
        producao: "in Produktion",
        entregue: "geliefert",
        recusado: "abgelehnt",
      },
    },
    cardapio: {
      titulo: "Sortiment",
      subtitulo:
        "Preise werden nicht Stück für Stück eingetippt: Sie legen den Preis jeder Größe fest und den Aufpreis für jeden Boden, jede Füllung und jedes Dekor. Die Summe der Kombination, die Ihre Kundin zusammenstellt, ergibt sich von selbst.",
      diasAntecedencia: "Tage Vorlauf",
      limite: "Grenze",
      tamanhosNota:
        "Größen — jede legt den Startpreis fest und wie viele Füllungen hineinpassen",
      ate: "bis zu",
      recheio: "Füllung",
      recheios: "Füllungen",
      massas: "Böden",
      recheiosTitulo: "Füllungen",
      decoracoes: "Dekore",
      incluido: "enthalten",
    },
    colecoes: {
      titulo: "Kollektionen",
      subtitulo:
        "Sortimente, die zum Datum erscheinen und verschwinden. Dieselbe Torte kann in mehreren Kollektionen auftauchen — die Weihnachtskollektion abzuschalten löscht nichts, es nimmt sie nur von der Seite.",
      destaque: "hervorgehoben",
      noAr: "online",
      foraDoAr: "offline",
    },
    pagina: {
      titulo: "Meine Seite",
      subtitulo:
        "Alles, was Ihre Kundin sieht, gehört Ihnen: Adresse, Farben, Texte und die Wege der Übergabe.",
      endereco: "Adresse",
      sempreActivo: "immer aktiv",
      dominioProprio: "eigene Domain",
      dominioNota:
        "Sie haben schon eine Domain? Richten Sie sie hierher und Ihre Seite ist unter beiden Adressen erreichbar.",
      identidade: "Visuelle Identität",
      corMarca: "Marke",
      corMarcaSuave: "Marke hell",
      corFundo: "Hintergrund",
      corTexto: "Text",
      textos: "Texte der Seite",
      chamada: "Aufmacher",
      sobre: "Über mich",
      avisoPagamento: "Hinweis zur Zahlung",
      formasReceber: "Wege der Übergabe",
      gratis: "kostenlos",
      personalizados: "Sonderbestellungen",
      personalizadosLigado:
        "An. Ihre Kundin kann ein Angebot für etwas anfragen, das nicht im Sortiment steht.",
      personalizadosDesligado:
        "Aus. Ihre Kundin kann nur bestellen, was im Sortiment steht.",
    },
    relatorios: {
      titulo: "Auswertungen",
      subtitulo:
        "Was angenommen wurde, was sich am besten verkauft und wie der Monat läuft. Bestellungen, die auf Annahme warten, zählen nicht als Umsatz.",
      receita: "Bestätigter Umsatz",
      encomendasAceites: "angenommene Bestellungen",
      faceMesAnterior: "gegenüber dem Vormonat",
      ticket: "Durchschnittsbon",
      ticketNota: "pro Bestellung",
      taxaAceite: "Annahmequote",
      recusadas: "abgelehnt",
      encomendas: "Bestellungen",
      desdeInicio: "seit Beginn",
      receitaMes: "Umsatz pro Monat",
      ultimosSeis: "Die letzten sechs abgeschlossenen Monate",
      mes: "Monat",
      verTabela: "Als Tabelle ansehen",
      esconderTabela: "Tabelle ausblenden",
      maisSai: "Was am besten läuft",
      porEncomendas: "Nach Anzahl der Bestellungen",
      emQuePe: "Wo sie stehen",
      todasEncomendas: "Alle Bestellungen",
    },
    plano: {
      titulo: "Paket und Abrechnung",
      subtitulo:
        "Was Sie für die Plattform zahlen. Nicht zu verwechseln mit dem, was Sie von Ihren Kundinnen bekommen — dieses Geld läuft nie hier durch.",
      plano: "Paket",
      semCusto: "Kostenfrei",
      paraSempre: "dauerhaft",
      porSemIva: "zzgl. MwSt.",
      por: "pro",
      vitaliciaAntes: "Sie haben das Paket",
      vitaliciaForte: "dauerhaft",
      vitaliciaDepois: "durch den Code",
      vitaliciaNota:
        "Es gibt keine Verlängerung, keine Karte, und es wird Ihnen nie etwas berechnet.",
      proximaCobranca: "Nächste Abbuchung",
      cartao: "Karte",
      nenhum: "keine",
      cobranca: "Abrechnung",
      gerirStripe: "In Stripe verwalten",
      verPlanos: "Pakete ansehen",
      temCodigo: "Ich habe einen Code",
      temCodigoTexto:
        "Wenn Sie einen Code für lebenslangen Zugang bekommen haben, tragen Sie ihn hier ein. Das Paket gehört Ihnen dauerhaft, ohne Zahlung und ohne Karte.",
      codigoCampo: "Ihr Code",
      resgatar: "Einlösen",
      aVerificar: "Wird geprüft…",
      estasAUsar: "Was Sie nutzen",
      produtos: "Produkte",
      colecoes: "Kollektionen",
      encomendasMes: "Bestellungen diesen Monat",
      semLimite: "· in diesem Paket ohne Grenze",
      faturas: "Rechnungen",
      semFaturas: "Noch keine Rechnungen — das Paket Prova berechnet nichts.",
      paga: "bezahlt",
      porPagar: "offen",
      mudarPlano: "Paket wechseln",
      eOTeuPlano: "Ihr aktuelles Paket",
      trocarPara: "hierhin wechseln",
      mudarNota:
        "Beim Hochstufen zahlen Sie nur die Differenz für den Rest des Zeitraums. Beim Herabstufen oder Kündigen bleibt Ihre Seite bis zum Ende des bezahlten Zeitraums online.",
      prototipoForte: "Hier wird nichts wirklich berechnet.",
      prototipoTexto:
        "Es ist ein Prototyp: Die Knöpfe sprechen nicht mit Stripe und die Rechnungen sind Beispiele. Der Code wird bereits auf dem Server geprüft, gespeichert wird aber noch nichts.",
      estados: {
        teste: "im Test",
        activa: "aktiv",
        vitalicia: "lebenslang",
        pagamento_falhou: "Zahlung fehlgeschlagen",
        cancelada: "gekündigt",
      },
      erros: {
        vazio: "Bitte den Code eingeben.",
        desconhecido: "Diesen Code kenne ich nicht.",
        esgotado: "Dieser Code wurde bereits so oft eingelöst, wie erlaubt ist.",
      },
    },
  },

  loja: {
    falarComigo: "Schreiben Sie mir",
    feitaNo: "Seite erstellt mit Cakelyo ·",
    criaATua: "erstellen Sie Ihre",
    desde: "ab",
    diasAntes: "Tage vorher",
    esgotado: "ausverkauft",
    restam: "übrig",
    porTempoLimitado: "nur für kurze Zeit",
    naoEncontrou: "Nicht gefunden, was Sie suchten?",
    naoEncontrouTexto:
      "Hochzeitstorte, ein bestimmtes Motto, eine Unverträglichkeit. Erzählen Sie mir die Idee, ich mache Ihnen ein Angebot.",
    pedirOrcamento: "Angebot anfragen",
    comoRecebe: "Wie Sie es bekommen",
    comoPaga: "Wie Sie zahlen",
    gratis: "kostenlos",
    reservaAntes: "Eine über die Seite aufgegebene Bestellung ist eine",
    reservaForte: "Reservierungsanfrage",
    reservaDepois:
      ". Sie kommt erst in den Kalender, nachdem ich mich mit Ihnen abgestimmt und angenommen habe.",
    montador: {
      encomendeCom: "Bestellen Sie",
      diasAntecedencia: "Tage im Voraus",
      restamUnidades: "noch",
      unidades: "Stück",
      tamanho: "Größe",
      ate: "bis zu",
      recheio: "Füllung",
      recheios: "Füllungen",
      massa: "Boden",
      recheiosTitulo: "Füllungen",
      /** Prefixo da linha do orçamento: "Füllung Nutella". */
      prefixoRecheio: "Füllung",
      completo: "vollständig",
      escolheMais: "wählen Sie noch",
      decoracao: "Dekor",
      comoReceber: "Wie Sie es erhalten",
      observacoes: "Anmerkungen",
      observacoesAjuda:
        "Motto der Feier, Farben, ein Name obendrauf, eine Unverträglichkeit…",
      seuBolo: "Ihre Torte",
      entrega: "Lieferung",
      total: "Gesamt",
      enviarPedido: "Bestellung senden",
      enviarNota1: "Senden reserviert den Termin noch nicht.",
      enviarNota2: "muss",
      enviarNota3: "die Bestellung annehmen",
      enviarNota4: "damit sie gilt.",
      incluido: "enthalten",
      inclusa: "enthalten",
      emFalta: "nicht verfügbar",
      acrescimo: "Aufpreis",
      recheioPremium: "Premium-Füllung",
      faltaUm: "Noch 1 Füllung zu wählen",
      faltamVarios: "Noch zu wählen:",
      faltamFim: "Füllungen",
      escolheTamanho: "Wählen Sie die Größe",
      escolheMassa: "Wählen Sie den Boden",
      enviadoTitulo: "Bestellung gesendet",
      enviadoTexto1:
        "hat Ihre Anfrage erhalten und meldet sich, um die Zahlung zu klären.",
      enviadoAviso: "Ihr Termin ist noch nicht gesichert",
      enviadoAvisoTexto1:
        "Die Bestellung kommt erst in den Kalender, wenn die Konditorin sie",
      enviadoAvisoForte: "annimmt",
      enviadoAvisoTexto2:
        ". Sie bekommen Bescheid, sobald das passiert — meist innerhalb von 24 Stunden.",
      voltarCardapio: "Zurück zum Sortiment",
    },
    personalizado: {
      titulo: "Sonderbestellung",
      subtitulo:
        "Für das, was nicht ins fertige Sortiment passt. Beschreiben Sie die Idee so genau wie möglich — je mehr ich weiß, desto genauer das Angebot.",
      nome: "Ihr Name",
      whatsapp: "WhatsApp",
      data: "Datum der Feier",
      pessoas: "Für wie viele Personen",
      ideia: "Die Idee",
      ideiaAjuda:
        "Motto, Farben, Geschmacksrichtungen, die Sie mögen, gesehene Vorbilder, Unverträglichkeiten…",
      avisoAntes: "Eine Sonderbestellung beginnt als",
      avisoForte: "Angebot",
      avisoDepois: ". Der Termin ist erst reserviert, wenn",
      avisoFim: "die Bestellung angenommen hat.",
      botao: "Angebot anfragen",
      enviadoTitulo: "Angebot angefragt",
      enviadoTexto:
        "meldet sich mit einem Preis, und wenn Sie zustimmen, nimmt sie die Bestellung an und der Termin ist reserviert.",
    },
  },

  planos: {
    prova: {
      promessa: "Um das Sortiment aufzustellen und zu sehen, ob es passt.",
      inclui: [
        "Ihre Seite auf cakelyo.app/ihr-name",
        "Unbegrenzte Bestellungen, von Hand angenommen",
        "Bis zu 5 Produkte und 1 Kollektion",
        "Automatische Preisberechnung der Torte",
        "Eigene Farben und eigenes Logo",
        "Bestellkalender",
      ],
      naoInclui: [
        "Saisonale Kollektionen",
        "Produktionsgrenzen",
        "Auswertungen",
      ],
    },
    atelier: {
      promessa: "Für alle, die davon leben und volle Saisons haben.",
      inclui: [
        "Alles aus Prova",
        "Produkte und Kollektionen ohne Grenze",
        "Saisonale Kollektionen mit Start- und Enddatum",
        "Produktionsgrenzen je Artikel",
        "Umsatz- und Annahmeauswertungen",
        "Vollständige Kundinnenhistorie",
      ],
      naoInclui: ["Eigene Domain", "Team", "Formulare je Kundin"],
    },
    pastelaria: {
      promessa: "Für alle mit eigener Marke und einem Team.",
      inclui: [
        "Alles aus Atelier",
        "Eigene Domain",
        "Bis zu 5 Nutzerinnen im selben Konto",
        "Sortimentsformulare je Kundin",
        "Bevorzugter Support",
      ],
      naoInclui: [],
    },
  },

  comparacao: {
    linhas: {
      paginaPublica: "Öffentliche Seite",
      pedidos: "Bestellungen",
      produtos: "Produkte",
      colecoes: "Kollektionen",
      personalizar: "Farben und Logo anpassen",
      entrega: "Lieferung und Abholung",
      calculo: "Automatische Preisberechnung",
      agenda: "Bestellkalender",
      sazonais: "Saisonale Kollektionen",
      limites: "Produktionsgrenzen",
      relatorios: "Auswertungen",
      clientes: "Kundinnen und Historie",
      dominio: "Eigene Domain",
      equipa: "Team",
      formularios: "Formulare je Kundin",
      apoio: "Bevorzugter Support",
    },
    valores: {
      ilimitados: "unbegrenzt",
      ilimitadas: "unbegrenzt",
      ate5: "bis zu 5",
      um: "1",
      basico: "einfach",
      completo: "vollständig",
      ate5Utilizadores: "bis zu 5 Nutzerinnen",
    },
  },

};
