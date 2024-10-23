if (typeof gafisa.alphabook.home == 'undefined') { gafisa.alphabook.home = new Object(); }

gafisa.alphabook.home.clima = {
    identificadorMetodoAtualizacao: null,
    tipoMetodoAtualizacao: null,

    inicializar: function () {
        if (!$('#ProjetoId').val())
            window.setTimeout(gafisa.alphabook.home.clima.carregarClimaCidade, 7000);
    },

    carregarClimaCidadeProjeto: function (projetoId) {

        gafisa.alphabook.home.clima.atualizarInformacoesMetodoAtualizaca(gafisa.alphabook.home.clima.carregarClimaCidade, gafisa.alphabook.home.clima.metodoAtualizacao.projeto);

        $.get(gafisa.alphabook.rotas.home.obterClima, { projetoId: projetoId }, function (html) {
            gafisa.alphabook.home.clima.aposCarregarClima(html);
        }, "html");
    },

    carregarClimaCidade: function () {

        gafisa.alphabook.home.clima.atualizarInformacoesMetodoAtualizaca(gafisa.alphabook.home.clima.carregarClimaCidade, gafisa.alphabook.home.clima.metodoAtualizacao.portal);

        $.get(gafisa.alphabook.rotas.home.obterClima, function (html) {
            gafisa.alphabook.home.clima.aposCarregarClima(html);
        }, "html");
    },

    aposCarregarClima: function (html) {
        if (!$('#falhaClima').length) {
            if (!$('#conteudoClima').hasClass('hide')) {
                $('#conteudoClima').fadeOut('fast', function () {
                    $('#carregandoClima').fadeIn();
                });
            }

            $('#carregandoClima').fadeOut('fast', function () {
                $('#conteudoClima').html(html);
                $('#conteudoClima').fadeIn();
            });
        }
    },

    atualizarInformacoesMetodoAtualizaca: function (metodo, tipo) {
        if (tipo != gafisa.alphabook.home.clima.tipo || gafisa.alphabook.home.clima.tipo == null) {
            clearInterval(gafisa.alphabook.home.clima.identificadorMetodoAtualizacao);
            gafisa.alphabook.home.clima.identificadorMetodoAtualizacao = setInterval(metodo, gafisa.alphabook.padroes.tempoAtualizacao.clima);
            gafisa.alphabook.home.clima.tipo = tipo;
        }
    }
};

gafisa.alphabook.home.clima.metodoAtualizacao = {
    portal: 'Portal',
    projeto: 'Projeto'
};

$(document).ready(gafisa.alphabook.home.clima.inicializar);
