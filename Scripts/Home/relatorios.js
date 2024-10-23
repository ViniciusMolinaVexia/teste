if (typeof gafisa.alphabook.home == 'undefined') { gafisa.alphabook.home = new Object(); }

gafisa.alphabook.home.relatorios = {
    inicializar: function () {
        gafisa.alphabook.home.relatorios.registrarAcoes();
    },

    registrarAcoes: function () {

        $('.tile-relatorios').livequery('click', gafisa.alphabook.home.relatorios.aoClicarTile);
        $('.tile-pipeline').livequery('click', gafisa.alphabook.home.relatorios.aoClicarTilePipeline);
        $('.tile-landbanking').livequery('click', gafisa.alphabook.home.relatorios.aoClicarTileLanBanking);
        $('.tile-estrutura').livequery('click', gafisa.alphabook.home.relatorios.aoClicarTileEstrutura);
        $('.tile-andamento-projetos').livequery('click', gafisa.alphabook.home.relatorios.aoClicarTileAndamentoProjetos);
    },

    aoClicarTile: function () {
        if (!$(this).hasClass('inativo'))
            $.navegar.proximo(gafisa.alphabook.rotas.relatorios.index);
    },

    aoClicarTilePipeline: function () {
        $.navegar.proximo(gafisa.alphabook.rotas.relatorios.relatorioPipeline);
    },

    aoClicarTileLanBanking: function () {
        gafisa.alphabook.home.relatorios.landbank.inicializada = false;
        $.navegar.proximo(gafisa.alphabook.rotas.relatorios.relatorioLandBanking);
    },

    aoClicarTileEstrutura: function () {
        $.navegar.proximo(gafisa.alphabook.rotas.relatorios.relatorioEstrutura);
    },
    
    aoClicarTileAndamentoProjetos: function() {
        $.navegar.proximo(gafisa.alphabook.rotas.relatorios.relatorioAndamentoProjetos);
    }
};

$(document).ready(gafisa.alphabook.home.relatorios.inicializar);