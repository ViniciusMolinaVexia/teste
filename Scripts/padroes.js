if (typeof gafisa == 'undefined') { gafisa = new Object(); }
if (typeof gafisa.alphabook == 'undefined') { gafisa.alphabook = new Object(); }
if (typeof gafisa.alphabook.padroes == 'undefined') { gafisa.alphabook.padroes = new Object(); }

gafisa.alphabook.padroes.textos = {
    tituloTimeline: 'Atualizações',
    tooltipProjeto: 'Projeto',
    tooltipLocalizacao: 'Localização',
    tooltipFase: 'Fase',
    tooltipNotificacao: 'Notificação',
    tooltipAgenda: 'Agenda'
};

gafisa.alphabook.padroes.cores = {
    tileDashBoard: '#3B8CBB',
    tileDashBoardEscuro: '#235E7A',
    tileDashBoardBorda: '#1E4557',
    tileProjeto: '#74AD41',
    tileProjetoEscuro: '#487027',
    tileProjetoBorda: '#3B5821'
};

gafisa.alphabook.padroes.brasil = {
    codigo: 'P_1',
    descricao : 'Brasil'
};

gafisa.alphabook.padroes.privacidade = {
    codigo: 1,
    descricao: 'Público'
};

gafisa.alphabook.padroes.tempoAtualizacao = {
    notificacoes: 60000,
    timeline: 30000,
    ofertas: 108000,
    clima: 3600000 
};

gafisa.alphabook.padroes.tempoMensagens = {
    confirmacao: 1000,
    aviso: 1500
};

gafisa.alphabook.padroes.tipoContador = {
    Contatos : 1,
    Relatorios : 2,
    Documentos : 3,
    InteligenciaMercado : 4,
    ModelosPadroes : 5,
    LinhaTempo : 6,
    ProjetosRecebidos : 7,
    Protocolos : 8,
    ProjetosDepartamento: 9,
    Agenda: 10,
    Postagem: 11
};

gafisa.alphabook.padroes.configuracoes = {
    urlRetorno: window.location.protocol + "//" + window.location.hostname + location.pathname
};
