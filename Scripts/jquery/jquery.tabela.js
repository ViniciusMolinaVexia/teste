(function ($) {

    var action = '';
    var parametros = '';
    var callback = null;
    var estruturaTabela = null;
    var tamanhoPagina = 5;
    var exibirVazio = null;
    var fatorLinhas = 1;
    var inteligenciaMercado = false;

    $.fn.tabela = function (opcoes) {
        var tabela = $(this);

        if (opcoes == null) return;

        exibirVazio = opcoes.exibirVazio;

        if (opcoes.parametros != null)
            atualizarParametros(opcoes.parametros);

        if (opcoes.acao === "carregar") {
            parametros.pagina = 1;

            var idTabela = $(this).attr('id');
            carregar($(this), function () {
                eventoAoRolarAteOFim(idTabela);
            });
            return;
        }

        action = opcoes.action;
        callback = opcoes.callback;
        tamanhoPagina = opcoes.tamanhoPagina;

        if (opcoes.fatorLinhas != undefined)
            fatorLinhas = opcoes.fatorLinhas;

        tabela.find('a').livequery(function () {
            if ($(this).data('ordenacao') > 0)
                $(this).click(function () { aoOrdenar($(this), tabela); });
        });

        carregar(tabela, function () {
            eventoAoRolarAteOFim(tabela.attr('id'));
        });
    };

    function atualizarParametros(_parametros) {
        parametros = _parametros;

        if (!parametros.pagina)
            parametros.pagina = 1;

        if (!parametros.tipo)
            parametros.tipo = 1;

        if (!parametros.ordenacao)
            parametros.ordenacao = 1;
    };


    function eventoAoRolarAteOFim(tabelaId) {
        var divScroll = $('#' + tabelaId).parents('[tabela-scroll="true"]');
        if (divScroll.length > 0)
            divScroll.scroll(function () { aoRolarAteOFim($(this)); });
        else
            $('#' + tabelaId).parent().scroll(function () { aoRolarAteOFim($(this)); });
    }

    function aoRolarAteOFim(conteudo) {
        var tabela = $(conteudo).find('table');
        var lastScrollTop = tabela.data('scroll-top') ? tabela.data('scroll-top') : 0;

        conteudo = $(conteudo);
        if (tabela.data('carregando') || tabela.data('fim')) return;

        if (conteudo.scrollTop() + conteudo.innerHeight() >= conteudo[0].scrollHeight && conteudo.scrollTop() != lastScrollTop) {
            tabela.data('carregando', true);
            var trLength = tabela.find('tbody tr:not(.no-paging)').length > 0 ? tabela.find('tbody tr:not(.no-paging)').length : tabela.find('tr').length;

            if (parametros.inteligenciaMercado == 'true')
                trLength--;

            parametros.pagina = Math.ceil((trLength / fatorLinhas) / tamanhoPagina) + 1;

            $.get(action, parametros,
                function (html) {
                    if (html.contains('msg-sem-retorno')) {
                        tabela.data('fim', true);
                    } else {

                        var nrLastSeq = tabela.find('tbody tr').last().find('td').first().text().trim();
                        if (html.contains('<td class="colun-1">' + nrLastSeq + '</td>')) {
                            tabela.data('fim', true);                          
                        } else {
                            tabela.find('tbody').append(html);
                            tabela.removeData('carregando');
                        }                        
                    }
                    if (callback)
                        callback();
                },
            "html");
        }

        tabela.data('scroll-top', conteudo.scrollTop());
    };

    function aoOrdenar(botao, tabela) {
        var campo = botao.data('ordenacao');
        var tipo = botao.data('tipo');
        tipo = (tipo == 1) ? 2 : 1;

        parametros.pagina = 1;

        parametros.ordenacao = campo;
        parametros.tipo = tipo;

        carregar(tabela, function () {
            eventoAoRolarAteOFim(tabela.attr('id'));
        });
    };

    function aposOrdenar(tabela) {
        if (parametros.ordenacao && parametros.tipo) {
            var linkOrdenacao = $('#' + tabela.attr('id')).find('[data-ordenacao=' + parametros.ordenacao + ']');
            if (linkOrdenacao) {
                linkOrdenacao.data('tipo', parametros.tipo);

                var sufixoRemover, sufixoAdicionar;
                if (parametros.tipo == 1) {
                    sufixoRemover = 'up';
                    sufixoAdicionar = 'down';
                } else {
                    sufixoRemover = 'down';
                    sufixoAdicionar = 'up';
                }

                linkOrdenacao.parent().switchClass('table-title-ord-' + sufixoRemover, 'table-title-ord-' + sufixoAdicionar);
            }
        }
    };

    function carregar(tabela, callbackCarregar) {
        var idTabela = tabela.attr('id');
        var conteudo = $('#' + idTabela);

        if (!conteudo.hasClass('box-tabela')) {
            conteudo = conteudo.parent().parent().parent();
            estruturaTabela = conteudo.html();
        }

        conteudo.fadeOut('fast', function () {

            conteudo.html('<div class="loading-circulo"></div>');

            conteudo.fadeIn('fast', function () {

                $.get(action, parametros, function (html) {
                    conteudo.fadeOut('fast', function () {
                        if (!html.contains('msg-sem-retorno')) {
                            conteudo.attr('id', '');
                            conteudo.html(estruturaTabela);
                            conteudo.find('tbody').html(html);
                            conteudo.fadeIn('fast', function () {
                                aposOrdenar(tabela);
                                if (callback)
                                    callback();
                                if (callbackCarregar)
                                    callbackCarregar();
                            });
                        } else {

                            if (exibirVazio)
                                conteudo.html(estruturaTabela);
                            else {
                                conteudo.attr('id', idTabela);
                                conteudo.html(html);
                            }

                            conteudo.fadeIn('fast', function () {
                                if (callback)
                                    callback();
                            });
                        }
                    });
                }, "html");
            });
        });
    }

})(jQuery);
