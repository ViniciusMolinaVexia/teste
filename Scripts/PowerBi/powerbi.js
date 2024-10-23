if (typeof gafisa.alphabook.home == 'undefined') { gafisa.alphabook.home = new Object(); }

gafisa.alphabook.home.powerBi = {
    botaoExcluir: null,
    idtaxonomia: null,
    uploader: {},
    temArquivo: false,
    inicializada: false,
    

    inicializar: function () {
        gafisa.alphabook.home.powerBi.registrarAcoes();
    },

    registrarAcoes: function () {
        $('#powerbirelatorios').livequery('click', gafisa.alphabook.home.powerBi.aoClicarTile);
        $('.tile-Marketing').livequery('click', gafisa.alphabook.home.powerBi.aoClicarTileMarketing);
        $('.tile-Relacionamento').livequery('click', gafisa.alphabook.home.powerBi.aoClicarTileRelacionamento);
        $('.tile-Suprimentos').livequery('click', gafisa.alphabook.home.powerBi.aoClicarTileSuprimentos);
        $('.tile-Informacao').livequery('click', gafisa.alphabook.home.powerBi.aoClicarTileInformacao);
        $('.tile-Facilitites').livequery('click', gafisa.alphabook.home.powerBi.aoClicarTileFacilitites);
        $('.tile-Comercial').livequery('click', gafisa.alphabook.home.powerBi.aoClicarTileComercial);
        $('.tile-Controladoria').livequery('click', gafisa.alphabook.home.powerBi.aoClicarTileControladoria);
        $('.tile-Click').livequery('click', gafisa.alphabook.home.powerBi.aoClicarTileIframe);
        //$('#controleArquivosManuais').livequery(gafisa.alphabook.home.powerBi.inicializarTela);
    },



    inicializarTela: function () {


    },


    aoClicarTileMarketing: function () {

        var elemento = document.getElementById('controleRelatorios');
        var elemento2 = document.getElementById('controleRelatoriosItem');
        var elemento3 = document.getElementById('documentos-market');
        $('#title-relatorios').text("Marketing")


        if (elemento) {
            elemento.style.display = 'none';
            elemento2.style.display = 'block';
            elemento3.style.display = 'block';
        }

    },

    aoClicarTileRelacionamento: function () {

        var elemento = document.getElementById('controleRelatorios');
        var elemento2 = document.getElementById('controleRelatoriosItem');
        var elemento3 = document.getElementById('documentos-relacionamento');
        $('#title-relatorios').text("Marketing")


        if (elemento) {
            elemento.style.display = 'none';
            elemento2.style.display = 'block';
            elemento3.style.display = 'block';
        }

    },

    aoClicarTileSuprimentos: function () {

        var elemento = document.getElementById('controleRelatorios');
        var elemento2 = document.getElementById('controleRelatoriosItem');
        var elemento3 = document.getElementById('documentos-Suprimentos');
        $('#title-relatorios').text("Marketing")


        if (elemento) {
            elemento.style.display = 'none';
            elemento2.style.display = 'block';
            elemento3.style.display = 'block';
        }

    },

    aoClicarTileInformacao: function () {

        var elemento = document.getElementById('controleRelatorios');
        var elemento2 = document.getElementById('controleRelatoriosItem');
        var elemento3 = document.getElementById('documentos-informacao');
        $('#title-relatorios').text("Marketing")


        if (elemento) {
            elemento.style.display = 'none';
            elemento2.style.display = 'block';
            elemento3.style.display = 'block';
        }

    },

    aoClicarTileFacilitites: function () {

        var elemento = document.getElementById('controleRelatorios');
        var elemento2 = document.getElementById('controleRelatoriosItem');
        var elemento3 = document.getElementById('documentos-facilities');
        $('#title-relatorios').text("Marketing")


        if (elemento) {
            elemento.style.display = 'none';
            elemento2.style.display = 'block';
            elemento3.style.display = 'block';
        }

    },

    aoClicarTileComercial: function () {

        var elemento = document.getElementById('controleRelatorios');
        var elemento2 = document.getElementById('controleRelatoriosItem');
        var elemento2 = document.getElementById('documentos-Comercial');
        $('#title-relatorios').text("Marketing")


        if (elemento) {
            elemento.style.display = 'none';
            elemento2.style.display = 'block';
            elemento3.style.display = 'block';
        }

    },

    aoClicarTileControladoria: function () {

        var elemento = document.getElementById('controleRelatorios');
        var elemento2 = document.getElementById('controleRelatoriosItem');
        var elemento3 = document.getElementById('documentos-controladoria');
        $('#title-relatorios').text("Marketing")


        if (elemento) {
            elemento.style.display = 'none';
            elemento2.style.display = 'block';
            elemento3.style.display = 'block';
        }

    },

    aoClicarTileIframe: function () {

        var elemento = document.getElementById('controleRelatorios');
        var elemento2 = document.getElementById('controleRelatoriosItem');
        var elemento3 = document.getElementById('documentos-controladoria');
        var elemento4 = document.getElementById('iframe');
        $('#title-relatorios').text("Marketing")


        if (elemento) {
            elemento.style.display = 'none';
            elemento2.style.display = 'none';
            elemento3.style.display = 'none';
            elemento4.style.display = 'block';
        }

    },



    aoClicarTile: function () {
        if (!$(this).hasClass('inativo')) {
            if ($('body').data('ids'))
                $('body').removeData('ids');

            $.navegar.proximo(gafisa.alphabook.rotas.powerBi.index, null, function () { $('body').data('hashPai', window.location.hash); });
        }
    },

    erro: function (up, erro) {
        var listaErros = [];

        if (erro.code == plupload.FILE_SIZE_ERROR)
            listaErros.push(gafisa.mensagens.upload.tamanhoMaximoExcedido.format(50));

        if (listaErros.length > 0) {
            gafisa.alphabook.mensagens.exibirMensagemErro(listaErros);
        }
    },


};

$(document).ready(gafisa.alphabook.home.powerBi.inicializar);