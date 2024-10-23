if (typeof gafisa.alphabook.home == 'undefined') { gafisa.alphabook.home = new Object(); }

gafisa.alphabook.home.linhaTempo = {
    LARGURA_ITEM_LINHA_TEMPO : 147,
    inicializar: function () {
        gafisa.alphabook.home.linhaTempo.registrarAcoes();
    },

    registrarAcoes: function () {
        $('#linhaDoTempo').livequery('click', gafisa.alphabook.home.linhaTempo.aoClicarTile);
        $('#modalLinhaTempo').on('hidden', gafisa.alphabook.home.linhaTempo.aoFecharModal);

        $('#modalLinhaTempo .item-linha-tempo').livequery('click', gafisa.alphabook.home.linhaTempo.aoSelecionarData);

        $('.box-linha-tempo .item-linha a').livequery('click', gafisa.alphabook.home.linhaTempo.aoClicarItemLinhaTempo);

        $('#tabResumo').livequery('click', $.navegar.ajustarRodape);
        $('#tabDetalhe').livequery('click', gafisa.alphabook.home.linhaTempo.aoClicarAbaDetalhe);

        $('.detalheNomePost').livequery('click', gafisa.alphabook.home.linhaTempo.aoClicarNoPost);
        $('.box-linha-tempo').livequery(function () { gafisa.alphabook.home.linhaTempo.configurarScroll(); });

        $('#imprimirDetalheLinhaTempo').livequery('click', gafisa.alphabook.home.linhaTempo.aoImprimirDetalhe);
        $('#imprimirLinhaTempoPadrao').livequery('click', gafisa.alphabook.home.linhaTempo.aoImprimirPadrao);
        $('#imprimirLinhaTempoFases').livequery('click', gafisa.alphabook.home.linhaTempo.aoImprimirFases);
        $('#imprimirLinhaTempoCronologica').livequery('click', gafisa.alphabook.home.linhaTempo.aoImprimirCronologica);

        $('.abas-linha-tempo ul.list-tabs a').livequery('click', gafisa.alphabook.home.linhaTempo.aoSelecionarAba);

        $('#menu-passagens-etapa .passagem-etapa').livequery('click', gafisa.alphabook.home.linhaTempo.aoSelecionarPassagemEtapa);
        $('.content-linha-tempo .lt-estrutura').livequery('mouseenter', gafisa.alphabook.home.linhaTempo.etapaMouseEnter);
        $('.content-linha-tempo .lt-estrutura').livequery('mouseleave', gafisa.alphabook.home.linhaTempo.etapaMouseLeave);
        $('.content-linha-tempo a.ver-posts-etapa').livequery('click', gafisa.alphabook.home.linhaTempo.aoVerPostsEtapa);
        $('#aba-padrao a.criar-post-etapa, #aba-cronologica a.criar-post-etapa').livequery('click', gafisa.alphabook.home.linhaTempo.aoClicarEtapa);
        $('#aba-fases a.ver-fases-etapa').livequery('click', gafisa.alphabook.home.linhaTempo.aoVerFasesEtapa);
        $('#divEtapasFases').livequery(function () {
            $(this).clickOutSide(gafisa.alphabook.home.linhaTempo.fecharFasesEtapa);
        });

        $('#filtroCronogramaPrevisto').livequery('click', gafisa.alphabook.home.linhaTempo.aoClicarCronogramaPrevisto);
        $('#filtroDataBaseline').livequery('click', gafisa.alphabook.home.linhaTempo.aoClicarDataBaseline);

        $('.nao-se-aplica').livequery('click', gafisa.alphabook.home.linhaTempo.aoSetarNaoSeAplica);

        $('.campo-data').livequery(function () {
            $(this).datepicker();
        });

        $('#salvarBaseline').livequery('click', gafisa.alphabook.home.linhaTempo.aoSalvarBaseline);

        $('.content-linha-tempo .adicionar-previsao').livequery('click', gafisa.alphabook.home.linhaTempo.aoAdicionarPrevisao);
        $('#salvarPrevisao').livequery('click', gafisa.alphabook.home.linhaTempo.aoSalvarPrevisao);

        $('#aba-padrao .etapas-linha-tempo .data-previsao').hide();
        $('#aba-cronologica .etapas-linha-tempo .data-baseline').hide();
    },

    aoClicarCronogramaPrevisto: function () {
        if ($('#filtroCronogramaPrevisto').checked()) {
            $('#aba-padrao .etapas-linha-tempo .data-previsao').show();
            $('#aba-cronologica .etapas-linha-tempo .data-previsao').show();

            $('#aba-padrao .etapas-linha-vertical .data-previsao').show();
            $('#aba-cronologica .etapas-linha-vertical .data-previsao').show();
        } else {
            $('#aba-padrao .etapas-linha-tempo .data-previsao').hide();
            $('#aba-cronologica .etapas-linha-tempo .data-previsao').hide();

            $('#aba-padrao .etapas-linha-vertical .data-previsao').hide();
            $('#aba-cronologica .etapas-linha-vertical .data-previsao').hide();
        }
    },

    aoClicarDataBaseline: function () {
        if ($('#filtroDataBaseline').checked()) {
            $('#aba-padrao .etapas-linha-tempo .data-baseline').show();
            $('#aba-cronologica .etapas-linha-tempo .data-baseline').show();

            $('#aba-padrao .etapas-linha-vertical .data-baseline').show();
            $('#aba-cronologica .etapas-linha-vertical .data-baseline').show();
        } else {
            $('#aba-padrao .etapas-linha-tempo .data-baseline').hide();
            $('#aba-cronologica .etapas-linha-tempo .data-baseline').hide();

            $('#aba-padrao .etapas-linha-vertical .data-baseline').hide();
            $('#aba-cronologica .etapas-linha-vertical .data-baseline').hide();
        }
    },

    aoVerFasesEtapa: function () {
        var data = {
            projetoId: gafisa.alphabook.home.carrossel.obterIdProjeto(),
            etapaId: $(this).data('etapa-id')
        };

        var top = $(this).offset().top;
        var left = $(this).offset().left;
        var div = $('#divEtapasFases');

        if (div.data('fechado')) {
            $.get(gafisa.alphabook.rotas.projeto.listarFasesProjetoEtapa, data, function (html) {
                div.html(html);
                div.offset({ top: top + 64, left: left + 17 });
                div.fadeIn('fast');
                div.data('fechado', false);
            }, "html");
        }
        else {
            gafisa.alphabook.home.linhaTempo.fecharFasesEtapa();
        }
    },

    fecharFasesEtapa: function () {
        $('#divEtapasFases').data('fechado', true).fadeOut('fast').removeAttr('style');
    },

    aoVerPostsEtapa: function () {
        var data = {
            projetoId: gafisa.alphabook.home.carrossel.obterIdProjeto(),
            etapaId: $(this).data('etapa-id')
        };

        $.get(gafisa.alphabook.rotas.projeto.listarPostsEtapaLinhaTempo, data, function (html) {
            $('#modalPostsEtapa').html(html).modal('show');
        }, "html");
    },

    aoSelecionarAba: function () {
        var aba = $(this).attr('href').replace('#', '');

        if ($('#container-baseline:visible').length > 0) {
            $('.box-legenda-status-etapa').show();
            $.navegar.ajustarRodape();
            return;
        }

        gafisa.alphabook.home.linhaTempo.alternarAba(aba);
    },

    alternarAba: function (aba) {
        $('#filtros-padrao').hide();
        $('.box-legenda-status-etapa').show();

        if (aba == 'aba-padrao') {
            $('#menu-passagens-etapa').show();
            $('#menu-passagens-etapa .menu-lt').show();
            $('#filtros-padrao').show();
            gafisa.alphabook.home.linhaTempo.listarEtapasLinhaTempoPadrao();
        }
        else if (aba == 'aba-fases') {
            $('#menu-passagens-etapa').show();
            $('#menu-passagens-etapa .menu-lt').show();
            gafisa.alphabook.home.linhaTempo.listarEtapasLinhaTempoFases();
        }
        else if (aba == 'aba-cronologica') {
            $('#menu-passagens-etapa .menu-lt').hide();
            $('#filtros-padrao').show();
            gafisa.alphabook.home.linhaTempo.listarEtapasLinhaTempoCronologica();
        }
        else if (aba == 'aba-detalhe') {
            $('#menu-passagens-etapa').hide();
            $('.box-legenda-status-etapa').hide();
            gafisa.alphabook.home.linhaTempo.listarEtapasLinhaTempoDetalhe();
        }

        $.navegar.ajustarRodape();
    },

    aoClicarEtapa: function () {
        var data = {
            projetoId: gafisa.alphabook.home.carrossel.obterIdProjeto(),
            etapaId: $(this).data('etapa-id'),
            statusEtapaId: $(this).data('status-etapa-id')
        };

        $.get(gafisa.alphabook.rotas.postagem.postEtapaLinhaTempo, data, function (html) {
            $('#modalEtapaCriarPost').html(html).modal('show');
            $('#modalEtapaCriarPost').find('.fechar-postagem-linha-tempo').click(function () {
                $('#modalEtapaCriarPost').modal('hide').html('');
            });
            gafisa.alphabook.home.postagem.completo = false;
        }, 'html');
    },

    etapaMouseEnter: function () {
        $(this).find('a.ico-post-lt').show();
    },

    etapaMouseLeave: function () {
        $('.content-linha-tempo .lt-estrutura a.ico-post-lt').hide();
    },

    registrarScroll: function () {
        $('#modalLinhaTempo .tile-scroll').antiscroll({ y: false });
        $('#modalLinhaTempo .tile-scroll .antiscroll-inner').bind('mousewheel', function (ev, delta, x, y) {
            this.scrollLeft -= (delta * 30);
            ev.preventDefault();

            $('#modalLinhaTempo .item-linha-tempo').each(function (index, item) {
                if ($(item).hasClass('selecionado')) {
                    $(item).removeClass('selecionado');
                    $(item).popover('hide');
                }
            });
        });
    },

    aoClicarTile: function () {
        if (!$(this).hasClass('inativo')) {
            var projetoId = gafisa.alphabook.home.carrossel.obterIdProjeto();
            var data = { projetoId: projetoId };
            $.navegar.proximo(gafisa.alphabook.rotas.projeto.linhaTempo, data, gafisa.alphabook.home.linhaTempo.aoExibirTela);
        }
    },

    aoSelecionarData: function () {
        if ($(this).hasClass('selecionado')) {
            $(this).removeClass('selecionado');
            $(this).popover('hide');
        }
        else {
            $('#modalLinhaTempo .item-linha-tempo').each(function (index, item) {
                if ($(item).hasClass('selecionado')) {
                    $(item).removeClass('selecionado');
                    $(item).popover('hide');
                }
            });

            $(this).addClass('selecionado');
            $(this).popover('show');
        }
    },

    aoAbrirModal: function () {
        gafisa.alphabook.home.linhaTempo.registrarScroll();

        $('#modalLinhaTempo .item-linha-tempo').popover({
            animation: true,
            trigger: 'manual',
            html: true
        });
    },

    aoExibirTela: function (andamento) {
        var primeiraAba = $('.abas-linha-tempo a.ui-tabs-anchor:first').attr('href').replace('#', '');

        if (primeiraAba != 'aba-padrao' || andamento === true) {
            gafisa.alphabook.home.linhaTempo.alternarAba(primeiraAba);
        }

        setTimeout(function () {
            var passagemEtapaId = $('#cabecalhoProjeto').data('passagemetapaid');
            if (!String.isNullOrEmpty(passagemEtapaId)) {
                $('#menu-passagens-etapa .passagem-etapa[data-id="' + passagemEtapaId + '"]').click();
            }

            $.navegar.ajustarRodape();

            if ($('#container-baseline:visible').length > 0) {
                var footer = $('.seg-footer');
                var top = parseInt(footer.css('top')) + 50;

                footer.css('top', top + 'px');
            }
            
        }, 100);
    },

    aoFecharModal: function () {
        $('#modalLinhaTempo').html('');
    },

    aoClicarItemLinhaTempo: function (e) {
        e.preventDefault();
        var id = $(this).parent().data('id');

        $.dialogo.exibir(gafisa.alphabook.rotas.timeline.carregarDetalhePost, { idPost: id, homeInicial: false });
    },

    aoClicarAbaDetalhe: function () {
        $('#aba-detalhe').fadeOut('fast', function () {
            $('#carregandoDetalhesLinhaTempo').fadeIn('fast', function () {
                $.get(gafisa.alphabook.rotas.projeto.detalhesLinhaTempo, { projetoId: gafisa.alphabook.home.carrossel.obterIdProjeto() }, function (html) {
                    $('#aba-detalhe').html(html);
                    $('#carregandoDetalhesLinhaTempo').fadeOut('fast', function () {
                        $('#aba-detalhe').fadeIn('fast', $.navegar.ajustarRodape);
                        setInterval($.navegar.ajustarRodape, 100);
                    });
                }, "html");
            });
        });
    },

    aoClicarNoPost: function () {
        if ($(this).parents('#modalImpressaoTimeline').length > 0) {
            return;
        }

        $.dialogo.exibir(gafisa.alphabook.rotas.timeline.carregarDetalhePost, { idPost: $(this).data('id'), homeInicial: false });
    },

    configurarScroll: function () {
        var larguraLinhaTempo = 0;
        $('.item-linha').each(function () {
            larguraLinhaTempo = larguraLinhaTempo + $(this).width();
        });

        var larguraLinhasTempoMes = ($('.item-linha').filter(':first').width() + 22) * $('.item-linha').length;

        $('.box-linha-tempo').width(larguraLinhasTempoMes);

        $('.box-linha-tempo-mes').width(larguraLinhasTempoMes);
    },

    aoImprimirDetalhe: function () {
        $('#detalhes').printArea({ mode: "popup", popClose: true, extraCss: urlImpressaoLinhaTempo });
    },

    aoImprimirPadrao: function () {
        $('#aba-padrao .conteudo-linha-impressao').printArea({ mode: "popup", popClose: true, extraCss: urlImpressaoLinhaTempo });
    },

    aoImprimirFases: function () {
        $('#aba-fases .conteudo-linha-impressao').printArea({ mode: "popup", popClose: true, extraCss: urlImpressaoLinhaTempo });
    },

    aoImprimirCronologica: function () {
        $('#aba-cronologica .conteudo-linha-impressao').printArea({ mode: "popup", popClose: true, extraCss: urlImpressaoLinhaTempo });
    },

    aoSetarNaoSeAplica: function () {
        if ($(this).is(':checked')) {
            $(this).closest('.form-line').find('input[type=text]').val('');
            $(this).closest('.form-line').find('input[type=text]').prop('disabled', true);
        } else
            $(this).closest('.form-line').find('input[type=text]').prop('disabled', false);
    },

    aoSalvarBaseline: function () {
        if (!gafisa.alphabook.home.linhaTempo.validarBaseline()) return;

        var data = $('#form-baseline').formToJSON();
        var url = gafisa.alphabook.rotas.projeto.salvarBaseline;
        data.projetoId = gafisa.alphabook.home.carrossel.obterIdProjeto();

        $.post(url, data, function (json) {
            if (json.sucesso) {
                $('#aba-padrao .etapas-linha-tempo').data('carregado', false);
                $('#modalConfigurarLinhaTempo').modal('hide');
                var abaAtiva = $('.abas-linha-tempo ul.list-tabs li.ui-state-active a').attr('href').replace('#', '');
                $('#' + abaAtiva + ' .etapas-linha-tempo').data('carregado', false);
                gafisa.alphabook.mensagens.exibirMensagemConfirmacao(gafisa.mensagens.comum.salvoComSucesso.format('Baseline'));
                gafisa.alphabook.home.linhaTempo.listarEtapasLinhaTempoPadrao();
                $('#menu-passagens-etapa').show();
                $('#container-baseline').hide();
                
            } else {
                gafisa.alphabook.mensagens.exibirMensagemErro(json.erros != null ? json.erros[0] : json.erro);
            }
        });
    },

    validarBaseline: function () {
        var valido = true;

        $('#form-baseline .form-line').each(function (i, element) {
            var data = $(element).find('input:text.campo-data').val();
            var na = $(element).find('input:checkbox.nao-se-aplica').checked();

            if (String.isNullOrEmpty(data) && !na) {
                gafisa.alphabook.mensagens.exibirMensagemErro(gafisa.mensagens.comum.erroConfiguracaoLinhaTempo);
                return valido = false;
            }

            if (!String.isNullOrEmpty(data) && !gafisa.alphabook.validar.data(data)) {
                gafisa.alphabook.mensagens.exibirMensagemErro(gafisa.mensagens.comum.deveSerValida.format('Data de ' + $(element).find('label.nome-etapa').text().replace(':', '')));
                return valido = false;
            }
        });

        return valido;
    },

    listarEtapasLinhaTempoPadrao: function () {
        if ($('#aba-padrao .etapas-linha-tempo').data('carregado')) {
            var passagemEtapaIdSelecionada = $('#menu-passagens-etapa .passagem-etapa.active').data('id');
            var x = 0;
            var itens = $('#aba-padrao div.lt-estrutura');
            for(var i = 0; i < itens.length; i++) {
                if ($(itens[i]).data('passagemetapaid') == passagemEtapaIdSelecionada) break;
                x++;
            }
            var scroll = x * gafisa.alphabook.home.linhaTempo.LARGURA_ITEM_LINHA_TEMPO;
            $('#aba-padrao div.box-lt').scrollLeft(scroll);
            return;
        }

        var url = gafisa.alphabook.rotas.projeto.etapasLinhaTempoPadrao;

        var projetoIdNavegacao = null;
        try {
            projetoIdNavegacao = gafisa.alphabook.home.relatorios.andamentoProjetos.projetoIdNavegacao;
        } catch (e) {
            projetoIdNavegacao = null;
        }

        var data = {
            projetoId: projetoIdNavegacao != null? projetoIdNavegacao : gafisa.alphabook.home.carrossel.obterIdProjeto(),
            passagemEtapaId: $('#menu-passagens-etapa .passagem-etapa.active').data('id')
        };

        $.get(url, data, function (html) {
            $('#aba-padrao .etapas-linha-tempo').html(html);
            $('#aba-padrao .box-linha-tempo-print').html(html);
            gafisa.alphabook.home.linhaTempo.aoClicarCronogramaPrevisto();
            gafisa.alphabook.home.linhaTempo.aoClicarDataBaseline();

            $('#aba-padrao .etapas-linha-tempo').data('carregado', true);
            $.navegar.ajustarRodape();

            var passagemEtapaId = $('#cabecalhoProjeto').data('passagemetapaid');
            if (!String.isNullOrEmpty(passagemEtapaId)) {
                $('#menu-passagens-etapa .passagem-etapa[data-id="' + passagemEtapaId + '"]').click();
            }
        }, "html");
    },

    listarEtapasLinhaTempoCronologica: function () {
        var url = gafisa.alphabook.rotas.projeto.etapasLinhaTempoCronologica;
        var data = {
            projetoId: gafisa.alphabook.home.carrossel.obterIdProjeto()
        };

        $.get(url, data, function (html) {
            $('#aba-cronologica .etapas-linha-tempo').html(html);
            $('#aba-cronologica .box-linha-tempo-print').html(html);
            $.navegar.ajustarRodape();
            gafisa.alphabook.home.linhaTempo.aoClicarDataBaseline();
            gafisa.alphabook.home.linhaTempo.aoClicarCronogramaPrevisto();
        }, "html");
    },

    listarEtapasLinhaTempoFases: function () {
        if ($('#aba-fases .etapas-linha-tempo').data('carregado')) {
            var passagemEtapaIdSelecionada = $('#menu-passagens-etapa .passagem-etapa.active').data('id');
            var x = 0;
            var itens = $('#aba-fases div.lt-estrutura');
            for (var i = 0; i < itens.length; i++) {
                if ($(itens[i]).data('passagemetapaid') == passagemEtapaIdSelecionada) break;
                x++;
            }
            var scroll = x * gafisa.alphabook.home.linhaTempo.LARGURA_ITEM_LINHA_TEMPO;
            $('#aba-fases div.box-lt').scrollLeft(scroll);
            return;
        }

        var url = gafisa.alphabook.rotas.projeto.etapasLinhaTempoFases;
        var data = {
            projetoId: gafisa.alphabook.home.carrossel.obterIdProjeto(),
            passagemEtapaId: $('#menu-passagens-etapa .passagem-etapa.active').data('id')
        };

        $.get(url, data, function (html) {
            $('#aba-fases .etapas-linha-tempo').html(html);
            $('#aba-fases .box-linha-tempo-print').html(html);

            $('#aba-fases .etapas-linha-tempo').data('carregado', true);
            $.navegar.ajustarRodape();

            var passagemEtapaId = $('#cabecalhoProjeto').data('passagemetapaid');
            if (!String.isNullOrEmpty(passagemEtapaId)) {
                $('#menu-passagens-etapa .passagem-etapa[data-id="' + passagemEtapaId + '"]').click();
            }
        }, "html");
    },

    listarEtapasLinhaTempoDetalhe: function () {
        var url = gafisa.alphabook.rotas.projeto.etapasLinhaTempoDetalhe;
        var data = {
            projetoId: gafisa.alphabook.home.carrossel.obterIdProjeto(),
            tipo: 1
        };

        $.get(url, data, function (html) {
            $('#aba-detalhe .etapas-linha-tempo').html(html);

            $.navegar.ajustarRodape();
        }, "html");
    },

    aoAdicionarPrevisao: function () {
        $.get(gafisa.alphabook.rotas.projeto.adicionarPrevisao, { projetoId: gafisa.alphabook.home.carrossel.obterIdProjeto(), etapaId: $(this).data('id') }, function (html) {
            $('#modalPrevisao').html(html).modal('show');
        }, "html");
    },

    validarPrevisao: function () {
        if (String.isNullOrEmpty($('#DataPrevisao').val())) {
            gafisa.alphabook.mensagens.exibirMensagemErro(gafisa.mensagens.comum.deveSerPreenchida.format('Data Prevista'));
            return false;
        }

        if (!gafisa.alphabook.validar.data($('#DataPrevisao').val())) {
            gafisa.alphabook.mensagens.exibirMensagemErro(gafisa.mensagens.comum.deveSerValida.format('Data Prevista'));
            return false;
        }

        return true;
    },

    aoSalvarPrevisao: function () {
        if (!gafisa.alphabook.home.linhaTempo.validarPrevisao()) return;

        var data = $('#form-previsao').formToJSON();

        data.projetoId = gafisa.alphabook.home.carrossel.obterIdProjeto();

        $.post(gafisa.alphabook.rotas.projeto.salvarPrevisao, data, function (json) {
            if (json.sucesso) {
                $('#modalPrevisao').modal('hide');
                gafisa.alphabook.mensagens.exibirMensagemConfirmacao(gafisa.mensagens.comum.salvaComSucesso.format('Data prevista'));
                var abaAtiva = $('.abas-linha-tempo ul.list-tabs li.ui-state-active a').attr('href').replace('#', '');
                $('#' + abaAtiva + ' .etapas-linha-tempo').data('carregado', false);
                gafisa.alphabook.home.linhaTempo.atualizarLinhaTempo();
            } else {
                gafisa.alphabook.mensagens.exibirMensagemErro(json.erros != null ? json.erros[0] : json.erro);
            }
        });
    },

    aoSelecionarPassagemEtapa: function () {
        $('#menu-passagens-etapa .passagem-etapa').removeClass('active');
        $(this).addClass('active');

        gafisa.alphabook.home.linhaTempo.atualizarLinhaTempo();
    },

    atualizarLinhaTempo: function () {
        var abaAtiva = $('.abas-linha-tempo ul.list-tabs li.ui-state-active a').attr('href').replace('#', '');
        
        gafisa.alphabook.home.linhaTempo.alternarAba(abaAtiva);
    }
};

$(document).ready(gafisa.alphabook.home.linhaTempo.inicializar);