if (typeof gafisa.alphabook.home == 'undefined') { gafisa.alphabook.home = new Object(); }

$(document).ready(function () {
    gafisa.alphabook.home.faq.inicializar();
});

gafisa.alphabook.home.faq = {
    inicializar: function () {

        gafisa.alphabook.home.faq.registrarAcoes();
    },

    registrarAcoes: function () {
        $('.bt-faq').livequery('click', gafisa.alphabook.home.faq.aoClicarFaq);
        $('.faq-titulo').livequery('click', gafisa.alphabook.home.faq.aoClicarPergunta);
        $('#faqListaConteudo').livequery(function () { $('#faqListaConteudo').scroll(gafisa.alphabook.home.faq.aoRolarAteOFimFaq); });
        $('#buscarfaq').livequery('click', gafisa.alphabook.home.faq.aoBuscar);
        $('#termoBuscaFaq').onPressEnter(gafisa.alphabook.home.faq.aoBuscar);
    },

    aoClicarFaq: function () {
        $.navegar.proximo(gafisa.alphabook.rotas.faq.index, null, gafisa.alphabook.home.faq.aposExibirTela);
    },

    aposExibirTela: function () {
        gafisa.alphabook.home.faq.aoBuscar();
    },

    aoClicarPergunta: function () {
        var pergunta = $(this);
        if (pergunta.parent().hasClass('fechada')) {
            $('.box-perguntas-faq div[data-id=' + pergunta.data('faqid') + ']').show();
            pergunta.parent().removeClass('fechada').addClass('aberta');
        } else {
            $('.box-perguntas-faq div[data-id=' + pergunta.data('faqid') + ']').hide();
            pergunta.parent().removeClass('aberta').addClass('fechada');
        }
    },

    aoBuscar: function () {

        var conteudo = $("#faqConteudoDiv");
        conteudo.fadeOut('fast', function () {

            $("#faqConteudoDiv").html('<div class="loading-circulo"></div>');

            conteudo.fadeIn('fast', function () {
                var data = { termo: $('#termoBuscaFaq').val(), pagina: 1, tamanhoPagina: 10 };
                $.get(gafisa.alphabook.rotas.faq.listarFaq, data, gafisa.alphabook.home.faq.aposBuscar, 'html');
            });

        });
    },

    aposBuscar: function (html) {
        $('#faqConteudoDiv').removeData('carregando');
        $('#faqConteudoDiv').removeData('fim');
        var conteudo = $("#faqConteudoDiv");
        conteudo.fadeOut('fast', function () {
            $("#faqConteudoDiv").html(html);
            conteudo.fadeIn(function () {
                $.navegar.ajustarRodape();
            });
        });
    },

    aoRolarAteOFimFaq: function () {

        if ($('#faqConteudoDiv').data('carregando') || $('#faqConteudoDiv').data('fim')) return;

        if ($(this).scrollTop() + $(this).innerHeight() >= $(this)[0].scrollHeight) {
            $('#faqConteudoDiv').data('carregando', true);
            var data = { termo: $('#termoBuscaFaq').val(), ultimaLinha: $('.faq-titulo').last().attr('data-numeroLinha') };
            $.get(gafisa.alphabook.rotas.faq.listarFaqFiltros, data, gafisa.alphabook.home.faq.aposRolarAteOFim, 'html');
        }
    },

    aposRolarAteOFim: function (html) {
        if (html.contains('msg-sem-retorno')) {
            $('#faqConteudoDiv').data('fim', true);
        } else {
            $('#faqConteudoDiv').append(html);
            $('#faqConteudoDiv').removeData('carregando');
        }
    }
};
