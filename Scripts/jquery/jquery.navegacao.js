(function ($) {
    var telas = {};
    var idHome = null;
    var idAtual = null;
    var callbackVoltar = null;

    $.fn.navegar = new Object();

    $.fn.navegar.irPara = function (id, callback) {
        if ((!id.contains('#') && !String.isNullOrEmpty(id)) || id.contains('modal') || idAtual == id)
            return;

        if (String.isNullOrEmpty(id))
            id = idHome;

        var rodape = $('.seg-footer');
        rodape.fadeOut('fast', function () {
            $('.content').fadeOut('fast', function () {
                $(this).html(telas[id]);

                $(this).fadeIn("fast", function () {
                    $.fn.navegar.ajustarRodape($(this).find('.seg-header'), $(this), rodape);
                    rodape.fadeIn('fast', callback);
                });
            });
        });

        idAtual = id;

        gafisa.alphabook.setup.aplicarWatermarks();
    },

    $.fn.navegar.tratarValores = function () {

        $.each($('body').find('input'), function (index, element) {
            if ($(element).attr('type') == 'text') {
                $(element).attr('value', $(element).val());
            } else if ($(element).attr('type') == 'radio') {
                if (!$(element).checked()) {
                    $(element).removeAttr('checked');
                } else {
                    $(element).attr('checked', '');
                }
            }
        });

        $.each($('body').find('select'), function (index, element) {
            $.each($(element).find('option'), function (optionIndex, optionElement) {
                if ($(element).val() == $(optionElement).val()) $(optionElement).attr('selected', '');
                else $(optionElement).removeAttr('selected');

            });
        });

        $.each($(':data'), function () {
            var data = $(this).data();
            for (var i in data) {
                $(this).attr('data-' + i, data[i]);
            }
        });

    },

    $.fn.navegar.proximo = function (action, parametros, callback, recarregar) {
        if (action == null || String.isNullOrEmpty(action))
            return;

        if (parametros == null)
            parametros = {};

        $(".ui-multiselect").remove();

        if (recarregar == undefined || !recarregar)
            $.fn.navegar.salvarPaginaAtual();

        var conteudo = $('.content');
        var rodape = $('.seg-footer');
        var divCarregando = $('#carregandoTela');

        rodape.fadeOut('fast', function () {
            conteudo.fadeOut('fast', function () {
                divCarregando.fadeIn();
                $.get(action, parametros, function (html) {
                    conteudo.html(html);
                    divCarregando.fadeOut('fast', function () {
                        conteudo.fadeIn('fast', function () {
                            $.fn.navegar.ajustarRodape($('.seg-header'), conteudo, rodape);

                            rodape.fadeIn('fast', callback);
                        });
                        if (recarregar) {
                            $.fn.navegar.atualizarPaginaAtual();
                        } else {
                            location.hash = $.fn.navegar.obterId();
                            $.fn.navegar.salvarPaginaAtual();
                        }
                    });
                }, "html");

            });
        });
    };

    $.fn.navegar.ajustarRodape = function (header, conteudo, rodape) {
        rodape.css({ "position": "absolute" });
        var tamanhoConteudo = header.height();
        tamanhoConteudo += $.fn.navegar.obterAlturaDiv(conteudo);

        var posiciaoTopFinalMinima = $(window).height() - rodape.height();
        var posicaoTopCalculada = tamanhoConteudo + rodape.height();

        var posicaoTop = posicaoTopCalculada < posiciaoTopFinalMinima ? posiciaoTopFinalMinima : posicaoTopCalculada;
        rodape.css('top', '{0}px'.replace('{0}', posicaoTop));

        if (rodape.hasClass('hide'))
            rodape.toggleClass('hide');

        gafisa.alphabook.setup.aplicarWatermarks();
    };

    $.fn.navegar.obterAlturaDiv = function (div) {

        if ($(div).height() != 0) return $(div).height();

        var altura = 0;
        $.each(div.children('div'), function (index, element) {
            if ($(this).height() == 0)
                altura += $.fn.navegar.obterAlturaDiv($(this));
            else
                altura += $(this).height();
        });

        return altura;
    };

    $.fn.navegar.anterior = function (callback) {
        callbackVoltar = callback;
        history.back(-1);
        gafisa.alphabook.setup.aplicarWatermarks();
        gafisa.alphabook.setup.aplicarcabecalhoProjetoHome();
    };

    $.fn.navegar.limparCallbackVoltar = function () {
        callbackVoltar = null;
    };

    $.fn.navegar.metodoCallbackVoltar = function () {
        return callbackVoltar;
    };

    $.fn.navegar.mapa = function (id, tipo, idProjeto, callback) {

        if (idProjeto == undefined)
            idProjeto = gafisa.alphabook.home.carrossel.obterIdProjeto();

        if (idProjeto == 0 || idProjeto == undefined) {
            idProjeto = null;
        } else {
            $("body").data("idprojeto", idProjeto);
        }

        var home = false;

        if (tipo == 'home')
            home = true;

        $.navegar.proximo(gafisa.alphabook.rotas.mapa.index, { projetoId: idProjeto, homeInicial: home }, function () {
            gafisa.alphabook.home.mapas.posicionarMapa(id, tipo);
            if (callback) callback();
        });
    };

    $.fn.navegar.obterPontoMapa = function (callback) {

        var idProjeto = gafisa.alphabook.home.carrossel.obterIdProjeto();

        if (idProjeto == 0 || idProjeto == undefined) idProjeto = null;

        $.navegar.proximo(gafisa.alphabook.rotas.mapa.index, { projetoId: idProjeto }, function () { gafisa.alphabook.home.mapas.configurarMarcacaoPonto(callback, idProjeto); });

    };

    $.fn.navegar.obterPoligono = function (idProjeto, callback, coordenadas) {

        $.navegar.proximo(gafisa.alphabook.rotas.mapa.index, { projetoId: idProjeto, edicao: true }, function () { gafisa.alphabook.home.mapas.editarPoligono(idProjeto, callback, coordenadas); });

    };

    $.fn.navegar.obterId = function () {
        return '#' + Math.floor(Math.random() * 1100000);
    },

    $.fn.navegar.salvarPaginaAtual = function () {

        var id = String.isNullOrEmpty(location.hash) ? $.fn.navegar.obterId() : location.hash;
        if (idHome == null)
            idHome = id;

        telas[id] = $('.content').html();
        idAtual = id;
    };

    $.fn.navegar.atualizarPaginaAtual = function () {
        var id = location.hash;
        telas[id] = $('.content').html();
    };

    $.fn.navegar.limpar = function () {
        telas = {};
    };

})(jQuery);

$.navegar = new Object();

$.navegar.irPara = function (id, callback) {
    $.fn.navegar.irPara(id, callback);
};

$.navegar.anterior = function (callback) {
    $.fn.navegar.anterior(callback);
};

$.navegar.mapa = function (id, tipo, idProjeto, callback) {
    $.fn.navegar.mapa(id, tipo, idProjeto, callback);
};

$.navegar.obterPontoMapa = function (callback) {
    $.fn.navegar.obterPontoMapa(callback);
};

$.navegar.obterPoligono = function (idProjeto, callback, coordenadas) {
    $.fn.navegar.obterPoligono(idProjeto, callback, coordenadas);
};

$.navegar.proximo = function (action, parametros, callback, recarregar) {
    $.fn.navegar.proximo(action, parametros, callback, recarregar);
};

$.navegar.limpar = function () {
    $.fn.navegar.limpar();
};

$.navegar.metodoCallbackVoltar = function () { return $.fn.navegar.metodoCallbackVoltar; };

$.navegar.limparCallbackVoltar = function () {
    $.fn.navegar.limparCallbackVoltar();
};

$.navegar.tratarValores = function () {
    $.fn.navegar.tratarValores();
};

$.navegar.ajustarRodape = function () {
    $.fn.navegar.ajustarRodape($('.seg-header'), $('.content'), $('.seg-footer'));
};
