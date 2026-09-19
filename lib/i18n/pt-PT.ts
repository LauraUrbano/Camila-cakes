/**
 * Português europeu — a língua de origem do produto e a fonte de verdade das
 * chaves. O tipo `Dicionario` é derivado deste ficheiro, por isso qualquer
 * chave que falte noutra língua rebenta na compilação em vez de aparecer em
 * branco na página.
 *
 * Tratamento por "tu", como manda o manual da marca.
 */
export const ptPT = {
  meta: {
    htmlLang: "pt-PT",
    nome: "Português (Portugal)",
    titulo: "Cakelyo — gestão do teu negócio de bolos",
    descricao:
      "Tudo o que o teu negócio de bolos precisa, num só lugar. Encomendas, pedidos personalizados, cardápio e relatórios.",
  },

  comum: {
    painel: "Painel",
    precos: "Preços",
    verExemplo: "Ver exemplo",
    cardapio: "cardápio",
    lingua: "Língua",
    prototipo: "protótipo navegável com dados de exemplo",
    assinatura: "gestão do teu negócio de bolos",
  },

  home: {
    aviso: "Protótipo de visualização — ainda sem base de dados",
    titulo: "Tudo o que o teu negócio de bolos precisa,",
    tituloDestaque: "num só lugar.",
    subtitulo:
      "A tua cliente escolhe massa, recheio e decoração, vê o preço na hora e envia a encomenda pronta. Só tens de aceitar — ou não.",
    verPagina: "Ver uma página a sério",
    entrarPainel: "Entrar no painel",
    resumoBolo: "Bolo grande · 3 recheios",
    total: "Total",
    passos: [
      {
        titulo: "Monta o cardápio",
        texto:
          "Tamanhos, massas, recheios e decorações, cada um com o seu preço. Uma vez só.",
      },
      {
        titulo: "Partilha o link",
        texto:
          "A tua página fica pronta. Vai na bio, no story, na conversa — em vez de vinte fotos soltas.",
      },
      {
        titulo: "Aceita o que quiseres",
        texto:
          "O pedido chega montado e com o preço feito. Combinas o pagamento e aceitas.",
      },
    ],
    camadasRotulo: "O que o Cakelyo faz",
    camadasTitulo:
      "Tudo o que uma encomenda precisa, sem folha de cálculo e sem caderno.",
    camadasAjuda: "Cinco camadas. Abre a que te interessa.",
    aceiteTitulo: "Nenhuma data entra na tua agenda sem tu dizeres que sim.",
    aceiteTexto:
      "O pedido feito no site é uma reserva, não um compromisso. Combinas o pagamento como sempre fizeste — MB WAY, TWINT, transferência — e só depois aceitas. Está escrito no ecrã da tua cliente, para não haver mal-entendido.",
    aceitarPedido: "Aceitar pedido",
    recusar: "Recusar",
    aceiteNota: "aceitar reserva a data na tua agenda",
    vitrineRotulo: "A página é sua",
    vitrineTitulo: "A mesma vitrine, com a cara de quem a faz.",
    vitrineTexto:
      "Carrega num nome e vê o endereço, as cores, os preços e a moeda mudarem. É a mesma página — só que de outra pessoa.",
    vitrineMoeda: "preços em",
    abrirPagina: "Abrir esta página →",
    chamadaTitulo: "O teu negócio de bolos merece mais do que um álbum de fotos.",
    chamadaBotao: "Ver o Cakelyo a funcionar",
  },

  areas: [
    {
      titulo: "Preço por combinação",
      resumo: "O tamanho manda no preço e no número de recheios",
      texto:
        "O tamanho define o preço de partida e quantos recheios cabem. Massa, recheio e decoração entram como acréscimo e a soma sai sozinha — não há tabela de preços para manter à mão.",
      accao: "Montar um bolo",
    },
    {
      titulo: "Coleções sazonais",
      resumo: "Natal, Páscoa, Dia da Mãe — entram e saem na data",
      texto:
        "Montas o cardápio da época uma vez e dizes quando entra e quando sai. O mesmo bolo pode viver em várias coleções, e desligar a de Natal não apaga nada — só tira do ar.",
      accao: "Ver o cardápio",
    },
    {
      titulo: "Limite de produção",
      resumo: "Diz quantos consegues fazer e o site trava sozinho",
      texto:
        "Dizes quantas unidades dás conta de fazer no período. O site conta por ti e, quando esgota, o artigo sai do ar — ninguém encomenda o que já não podes fazer.",
      accao: "Ver no painel",
    },
    {
      titulo: "Entrega à tua maneira",
      resumo: "Levantamento, entrega por zona, taxa por região",
      texto:
        "Defines as formas de receber e o que cobras por cada uma. A tua cliente escolhe uma no momento do pedido e a taxa entra no total, sem combinar por mensagem.",
      accao: "Definir entregas",
    },
    {
      titulo: "Relatórios",
      resumo: "Receita confirmada, ticket médio e o que mais sai",
      texto:
        "Receita confirmada, ticket médio, taxa de aceite e o ranking dos produtos. Pedidos à espera de aceite ficam de fora da conta — só entra o que já disseste que sim.",
      accao: "Abrir relatórios",
    },
  ],

  precos: {
    rotulo: "Planos",
    titulo: "Um preço fixo por mês. Zero comissão sobre o que vendes.",
    subtitulo:
      "Começa sem pagar nada. Quando o cardápio crescer e as épocas apertarem, sobes de plano — ou não.",
    mensal: "Mensal",
    anual: "Anual",
    doisMeses: "dois meses oferecidos",
    porMes: "mês",
    porAno: "ano",
    gratis: "Grátis",
    porMesCobrado: "por mês, cobrados de uma vez",
    maisEscolhido: "o mais escolhido",
    comecarSemPagar: "Começar sem pagar",
    escolher: "Escolher",
    planoAPlano: "Plano a plano",
    planoAPlanoAjuda: "O que muda de um para o outro, sem letra pequena.",
    tabelaLegenda: "Comparação dos planos",
    incluido: "incluído",
    naoIncluido: "não incluído",
    brasilTitulo: "Se pagas do Brasil:",
    brasilTexto:
      "o Cakelyo fatura de Portugal, por isso o cartão trata isto como compra internacional — o teu banco soma IOF e spread cambial, à volta de 7% a mais do que o valor acima.",
    brasilSaidaAntes: "Para não pagares isso,",
    brasilSaidaForte: "escolhe o plano anual e paga por Pix",
    brasilSaidaDepois:
      ": é um pagamento local em reais, sem IOF e sem câmbio. Sai uma vez por ano e fica exatamente o valor da tabela.",
    codigoTitulo: "Recebeste um código de acesso vitalício?",
    codigoTexto: "Resgata-o em",
    codigoLink: "Plano e faturação",
    codigoFim:
      "e ficas com o plano para sempre, sem pagar e sem cartão.",
    prototipoTitulo: "Isto é um protótipo.",
    prototipoTexto:
      "Nenhum pagamento é processado — a ligação ao Stripe entra quando houver contas e base de dados.",
    duvidasTitulo: "Antes que perguntes",
    duvidas: [
      {
        pergunta: "Pago comissão sobre as encomendas?",
        resposta:
          "Não. O pagamento da encomenda é combinado diretamente entre ti e a tua cliente — MB WAY, TWINT, transferência, dinheiro. O Cakelyo não entra nessa transação e não fica com nada dela.",
      },
      {
        pergunta: "Posso mudar de plano ou sair?",
        resposta:
          "A qualquer momento, pelo painel. Ao subir, pagas só a diferença do que falta do período. Ao sair, a tua página fica no ar até ao fim do período já pago e depois passa ao plano Prova — não perdes o cardápio.",
      },
      {
        pergunta: "Os preços têm IVA?",
        resposta:
          "Os valores acima são sem imposto. O IVA é somado no fim conforme o país e, se tiveres número de contribuinte de empresa na União Europeia, é aplicada a autoliquidação. A fatura sai de Portugal, seja qual for o país de onde pagas.",
      },
      {
        pergunta: "Que meios de pagamento aceitam?",
        resposta:
          "Cartão, através do Stripe, em qualquer um dos países. No Brasil aceitamos também Pix no plano anual. Os dados do cartão nunca passam pelos nossos servidores.",
      },
      {
        pergunta: "Porque é que a minha fatura brasileira vem com valor diferente?",
        resposta:
          "Porque o Cakelyo fatura de Portugal e o teu banco trata a cobrança como compra internacional: soma IOF e spread cambial, cerca de 7% acima do preço da tabela. Quem paga o plano anual por Pix não tem esse custo — é um pagamento local em reais.",
      },
    ],
  },

  painel: {
    nav: {
      geral: "Visão geral",
      pedidos: "Pedidos",
      relatorios: "Relatórios",
      cardapio: "Cardápio",
      colecoes: "Coleções",
      pagina: "A minha página",
      plano: "Plano",
    },
    painel: "painel",
    verPagina: "Ver a minha página",
    geral: {
      titulo: "Visão geral",
      saudacao: "Bom dia",
      aEspera: "à espera do teu aceite",
      aEsperaUm: "pedido à espera do teu aceite",
      aEsperaVarios: "pedidos à espera do teu aceite",
      aEsperaTexto:
        "Nenhum deles está na tua agenda ainda. Combina o pagamento com a cliente e aceita para reservar a data. →",
      naAgenda: "Na agenda",
      naAgendaNota: "pedidos aceites",
      aReceber: "A receber",
      aReceberNota: "pedidos em aberto",
      colecoesAtivas: "Coleções ativas",
      colecoesNota: "no ar agora",
      proximas: "Próximas entregas",
      pedidoPersonalizado: "pedido personalizado",
      emProducao: "em produção",
      aceite: "aceite",
      producaoAcabar: "Produção a acabar",
      vendidosDe: "de",
      vendidos: "vendidos",
      esgotouSaiu: "esgotado — saiu do cardápio",
      restamNota: "sai do ar sozinho ao zerar",
      restam: "restam",
    },
    pedidos: {
      titulo: "Pedidos",
      subtitulo:
        "Um pedido enviado pelo site é só uma reserva. Entra na tua agenda quando o aceitas — normalmente depois de combinar o pagamento.",
      aEsperaUm: "à espera",
      aEsperaVarios: "à espera de aceite",
      filtroTodos: "Todos",
      filtroAguardando: "Aguardam aceite",
      filtroAceite: "Aceites",
      filtroProducao: "Em produção",
      filtroEntregue: "Entregues",
      filtroRecusado: "Recusados",
      procurar: "Procurar por nome ou número",
      semResultados: "Nenhum pedido com esse filtro.",
      de: "de",
      escolhePedido: "Escolhe um pedido à esquerda.",
      aOrcar: "a orçar",
      pedidoEm: "pedido em",
      entrega: "entrega",
      naoReservada: "· a data ainda não está reservada",
      personalizado: "pedido personalizado",
      massa: "Massa",
      recheio: "Recheio",
      decoracao: "Decoração",
      semTaxa: "sem taxa",
      aceitar: "Aceitar pedido",
      recusar: "Recusar",
      aceitarNota: "aceitar reserva a data na tua agenda",
      marcarProducao: "Marcar como em produção",
      marcarEntregue: "Marcar como entregue",
      encerrado: "Pedido encerrado.",
      estados: {
        aguardando: "aguarda aceite",
        aceito: "aceite",
        producao: "em produção",
        entregue: "entregue",
        recusado: "recusado",
      },
    },
    cardapio: {
      titulo: "Cardápio",
      subtitulo:
        "O preço não é digitado item por item: defines o preço de cada tamanho e o acréscimo de cada massa, recheio e decoração. A soma da combinação que a tua cliente montar sai sozinha.",
      diasAntecedencia: "dias de antecedência",
      limite: "limite",
      tamanhosNota:
        "Tamanhos — cada um define o preço de partida e quantos recheios cabem",
      ate: "até",
      recheio: "recheio",
      recheios: "recheios",
      massas: "Massas",
      recheiosTitulo: "Recheios",
      decoracoes: "Decorações",
      incluido: "incluído",
    },
    colecoes: {
      titulo: "Coleções",
      subtitulo:
        "Cardápios que entram e saem do ar por data. O mesmo bolo pode aparecer em várias coleções — desligar a de Natal não apaga nada, só tira do ar.",
      destaque: "destaque",
      noAr: "no ar",
      foraDoAr: "fora do ar",
    },
    pagina: {
      titulo: "A minha página",
      subtitulo:
        "Tudo o que a tua cliente vê é teu: endereço, cores, textos e as formas de receber.",
      endereco: "Endereço",
      sempreActivo: "sempre ativo",
      dominioProprio: "domínio próprio",
      dominioNota:
        "Já tens um domínio? Aponta-o para cá e a tua página passa a atender pelos dois endereços.",
      identidade: "Identidade visual",
      corMarca: "Marca",
      corMarcaSuave: "Marca suave",
      corFundo: "Fundo",
      corTexto: "Texto",
      textos: "Textos da página",
      chamada: "Chamada",
      sobre: "Sobre",
      avisoPagamento: "Aviso de pagamento",
      formasReceber: "Formas de receber",
      gratis: "grátis",
      personalizados: "Pedidos personalizados",
      personalizadosLigado:
        "Ligado. A tua cliente consegue pedir orçamento para o que não está no cardápio.",
      personalizadosDesligado:
        "Desligado. A tua cliente só pode pedir o que está no cardápio.",
    },
    relatorios: {
      titulo: "Relatórios",
      subtitulo:
        "O que já foi aceite, o que se vende mais e como o mês está a correr. Pedidos à espera de aceite não contam como receita.",
      receita: "Receita confirmada",
      encomendasAceites: "encomendas aceites",
      faceMesAnterior: "face ao mês anterior",
      ticket: "Ticket médio",
      ticketNota: "por encomenda",
      taxaAceite: "Taxa de aceite",
      recusadas: "recusadas",
      encomendas: "Encomendas",
      desdeInicio: "desde o início",
      receitaMes: "Receita por mês",
      ultimosSeis: "Últimos seis meses fechados",
      mes: "Mês",
      verTabela: "Ver em tabela",
      esconderTabela: "Esconder tabela",
      maisSai: "O que mais sai",
      porEncomendas: "Por número de encomendas",
      emQuePe: "Em que pé estão",
      todasEncomendas: "Todas as encomendas",
    },
    plano: {
      titulo: "Plano e faturação",
      subtitulo:
        "O que pagas pela plataforma. Não se confunde com o que recebes das tuas clientes — esse dinheiro nunca passa por aqui.",
      plano: "Plano",
      semCusto: "Sem custo",
      paraSempre: "para sempre",
      porSemIva: "sem IVA",
      por: "por",
      vitaliciaAntes: "Tens o plano",
      vitaliciaForte: "para sempre",
      vitaliciaDepois: "pelo código",
      vitaliciaNota:
        "Não há renovação, não há cartão e nunca te vai ser cobrado nada.",
      proximaCobranca: "Próxima cobrança",
      cartao: "Cartão",
      nenhum: "nenhum",
      cobranca: "Cobrança",
      gerirStripe: "Gerir no Stripe",
      verPlanos: "Ver os planos",
      temCodigo: "Tenho um código",
      temCodigoTexto:
        "Se recebeste um código de acesso vitalício, escreve-o aqui. Ficas com o plano para sempre, sem pagar nada e sem cartão.",
      codigoCampo: "O teu código",
      resgatar: "Resgatar",
      aVerificar: "A verificar…",
      estasAUsar: "O que estás a usar",
      produtos: "Produtos",
      colecoes: "Coleções",
      encomendasMes: "Encomendas este mês",
      semLimite: "· sem limite neste plano",
      faturas: "Faturas",
      semFaturas: "Ainda não há faturas — o plano Prova não cobra nada.",
      paga: "paga",
      porPagar: "por pagar",
      mudarPlano: "Mudar de plano",
      eOTeuPlano: "é o teu plano",
      trocarPara: "trocar para este",
      mudarNota:
        "Ao subir de plano pagas só a diferença do que falta do período. Ao descer ou cancelar, a tua página fica no ar até ao fim do período já pago.",
      prototipoForte: "Nada aqui cobra de verdade.",
      prototipoTexto:
        "É protótipo: os botões não falam com o Stripe e as faturas são de exemplo. O resgate de código já valida no servidor, mas ainda não grava nada.",
      estados: {
        teste: "em experimentação",
        activa: "ativa",
        vitalicia: "vitalícia",
        pagamento_falhou: "pagamento falhou",
        cancelada: "cancelada",
      },
      erros: {
        vazio: "Escreve o código.",
        desconhecido: "Não conheço esse código.",
        esgotado: "Esse código já foi usado o número de vezes permitido.",
      },
    },
  },

  loja: {
    falarComigo: "Falar comigo",
    feitaNo: "Página feita no Cakelyo ·",
    criaATua: "cria a tua",
    desde: "desde",
    diasAntes: "dias antes",
    esgotado: "esgotado",
    restam: "restam",
    porTempoLimitado: "por tempo limitado",
    naoEncontrou: "Não encontraste o que querias?",
    naoEncontrouTexto:
      "Bolo de casamento, tema específico, restrição alimentar. Conta-me a ideia que eu faço um orçamento.",
    pedirOrcamento: "Pedir orçamento",
    comoRecebe: "Como recebes",
    comoPaga: "Como pagas",
    gratis: "grátis",
    reservaAntes: "O pedido feito pelo site é um",
    reservaForte: "pedido de reserva",
    reservaDepois:
      ". Só entra na agenda depois de eu confirmar contigo e aceitar.",
    montador: {
      encomendeCom: "Encomenda com",
      diasAntecedencia: "dias de antecedência",
      restamUnidades: "restam",
      unidades: "unidades",
      tamanho: "Tamanho",
      ate: "até",
      recheio: "recheio",
      recheios: "recheios",
      massa: "Massa",
      recheiosTitulo: "Recheios",
      /** Prefixo da linha do orçamento: "Recheio Nutella". */
      prefixoRecheio: "Recheio",
      completo: "completo",
      escolheMais: "escolhe mais",
      decoracao: "Decoração",
      comoReceber: "Como receber",
      observacoes: "Observações",
      observacoesAjuda:
        "Tema da festa, cores, nome no topo, alguma restrição alimentar…",
      seuBolo: "O teu bolo",
      entrega: "entrega",
      total: "Total",
      enviarPedido: "Enviar pedido",
      enviarNota1: "Enviar não reserva a data.",
      enviarNota2: "precisa de",
      enviarNota3: "aceitar o pedido",
      enviarNota4: "para a encomenda valer.",
      incluido: "incluído",
      inclusa: "inclusa",
      emFalta: "em falta",
      acrescimo: "acréscimo",
      recheioPremium: "recheio premium",
      faltaUm: "Falta escolher 1 recheio",
      faltamVarios: "Faltam escolher",
      faltamFim: "recheios",
      escolheTamanho: "Escolhe o tamanho",
      escolheMassa: "Escolhe a massa",
      enviadoTitulo: "Pedido enviado",
      enviadoTexto1: "recebeu a tua reserva e vai falar contigo para combinar o pagamento.",
      enviadoAviso: "A tua data ainda não está garantida",
      enviadoAvisoTexto1: "O pedido só entra na agenda quando a confeiteira",
      enviadoAvisoForte: "aceitar",
      enviadoAvisoTexto2:
        ". Recebes um aviso assim que isso acontecer — normalmente em até 24 horas.",
      voltarCardapio: "Voltar ao cardápio",
    },
    personalizado: {
      titulo: "Pedido personalizado",
      subtitulo:
        "Para o que não cabe no cardápio pronto. Descreve a ideia com o máximo de detalhe que conseguires — quanto mais eu souber, mais preciso fica o orçamento.",
      nome: "O teu nome",
      whatsapp: "WhatsApp",
      data: "Data da festa",
      pessoas: "Quantas pessoas",
      ideia: "A ideia",
      ideiaAjuda:
        "Tema, cores, sabores de que gostas, referências que viste, restrições alimentares…",
      avisoAntes: "Pedido personalizado começa como",
      avisoForte: "orçamento",
      avisoDepois: ". A data só fica reservada depois de",
      avisoFim: "aceitar o pedido.",
      botao: "Pedir orçamento",
      enviadoTitulo: "Orçamento pedido",
      enviadoTexto:
        "vai responder com um valor e, se aprovares, aceita o pedido e a data fica reservada.",
    },
  },

  planos: {
    prova: {
      promessa: "Para pôr o cardápio de pé e ver se serve.",
      inclui: [
        "A tua página em cakelyo.app/o-teu-nome",
        "Pedidos ilimitados, com aceite manual",
        "Até 5 produtos e 1 coleção",
        "Cálculo automático do bolo",
        "Cores e logótipo à tua escolha",
        "Agenda de encomendas",
      ],
      naoInclui: ["Coleções sazonais", "Limites de produção", "Relatórios"],
    },
    atelier: {
      promessa: "Para quem já vive disto e tem épocas cheias.",
      inclui: [
        "Tudo o do plano Prova",
        "Produtos e coleções sem limite",
        "Coleções sazonais com data de entrada e saída",
        "Limites de produção por artigo",
        "Relatórios de receita e de aceite",
        "Histórico completo de clientes",
      ],
      naoInclui: ["Domínio próprio", "Equipa", "Formulários específicos"],
    },
    pastelaria: {
      promessa: "Para quem tem marca própria e equipa.",
      inclui: [
        "Tudo o do plano Atelier",
        "Domínio próprio",
        "Até 5 utilizadores na mesma conta",
        "Formulários de cardápio por cliente",
        "Apoio prioritário",
      ],
      naoInclui: [],
    },
  },

  comparacao: {
    linhas: {
      paginaPublica: "Página pública",
      pedidos: "Pedidos",
      produtos: "Produtos",
      colecoes: "Coleções",
      personalizar: "Personalizar cores e logótipo",
      entrega: "Entrega e levantamento",
      calculo: "Cálculo automático do bolo",
      agenda: "Agenda de encomendas",
      sazonais: "Coleções sazonais",
      limites: "Limites de produção",
      relatorios: "Relatórios",
      clientes: "Clientes e histórico",
      dominio: "Domínio próprio",
      equipa: "Equipa",
      formularios: "Formulários específicos",
      apoio: "Apoio prioritário",
    },
    valores: {
      ilimitados: "ilimitados",
      ilimitadas: "ilimitadas",
      ate5: "até 5",
      um: "1",
      basico: "básico",
      completo: "completo",
      ate5Utilizadores: "até 5 utilizadores",
    },
  },

};

export type Dicionario = typeof ptPT;
