if (typeof gafisa.alphabook.home == 'undefined') { gafisa.alphabook.home = new Object(); }

gafisa.alphabook.home.timeline = {
    inicializar: function () {
        gafisa.alphabook.home.timeline.registrarAcoes();

        if (!$('#ProjetoId').val())
            gafisa.alphabook.home.timeline.carregarTimeline();
    },

    registrarAcoes: function () {
        $(".posts").scroll(gafisa.alphabook.home.timeline.aoRolarAteOFim);
        $("#dados-post .leiaMais").livequery('click', gafisa.alphabook.home.timeline.aoClicarLeiaMais);
        $("#fecharDetalhesPost").livequery('click', gafisa.alphabook.home.timeline.aoFecharDetalhesPost);
        $('#botaoBuscaTimeline').livequery('click', gafisa.alphabook.home.timeline.aoSelecionarBuscar);
        $('#campoBuscaTimeline').onPressEnter(gafisa.alphabook.home.timeline.aoSelecionarBuscar);
        $('#criarPost').livequery('click', gafisa.alphabook.home.timeline.aoCriarPost);
        $(".post-excluir").livequery('click', gafisa.alphabook.home.timeline.aoExcluirPost);
        $(".post-like").livequery('click', gafisa.alphabook.home.timeline.aoCurtir);
        $(".post-like-modal").livequery('click', gafisa.alphabook.home.timeline.aoCurtir);
        $(".btn-curtidores").livequery('click', gafisa.alphabook.home.timeline.aoVisualizarCurtidores);
        $(".btn-Excluir-Modal-Postagem").livequery('click', gafisa.alphabook.home.timeline.aoExcluirPostModal);
        $(".btn-curtidores-modal").livequery('click', gafisa.alphabook.home.timeline.aoVisualizarCurtidores);
        $(".linhaTempo").livequery('click', gafisa.alphabook.home.timeline.aoClicarLinhaTempo);
        $("#dados-post .ico-post-anexo, #tabelaProtocolos  #visualizarAnexosPost").livequery(function () { gafisa.alphabook.home.timeline.registrarVisualizarAnexo(true, "#dados-post .ico-post-anexo, #tabelaProtocolos  #visualizarAnexosPost"); });
        $("#postDetalhado #visualizarAnexosPost, #modalEditarProtocolo #visualizarAnexosPost, .sep-posts-busca #visualizarAnexosPost").livequery(function () { gafisa.alphabook.home.timeline.registrarVisualizarAnexo(true, "#postDetalhado #visualizarAnexosPost, #modalEditarProtocolo #visualizarAnexosPost, .sep-posts-busca #visualizarAnexosPost"); });
        $(".iconeProjetosAssociados, .sep-posts-busca .iconeProjetosAssociados").livequery('click', gafisa.alphabook.home.timeline.aoClicarProjetosAssociados);
        $('.nome-projeto-post').livequery('click', gafisa.alphabook.home.timeline.aoClicarNomeProjeto);
        $('#form-etapa-post #EtapaId').livequery('change', gafisa.alphabook.home.timeline.aoAlterarEtapa);
        $('#form-etapa-post #EtapaId').livequery(function () { $(this).change(); });
        $('#form-etapa-post #etapaConcluida').livequery('change', gafisa.alphabook.home.timeline.aoAlterarEtapaConcluida);
        $('#salvar-etapa-post').livequery('click', gafisa.alphabook.home.timeline.aoSalvarEtapaPost);
        $('#imprimirTimeline').livequery('click', gafisa.alphabook.home.timeline.aoImprimirTimeline);
        $('.link-galleria').livequery('click', gafisa.alphabook.home.timeline.aoAbrirGalleria);
        $('.ico-post-mail').livequery('click', gafisa.alphabook.home.email.aoEnviarPostPorEmail);
    },

    aoAbrirGalleria: function () {
        var url = gafisa.alphabook.rotas.arquivo.modalGalleriaPostPhoto;
        var data = { postId: $(this).data('id') };
        var tituloPost = $(this).parent().parent().find('.nome-post').text();

        $('#modalGalleriaPostPhoto').html('');
        $.get(url, data, function (html) {
            $('#modalGalleriaPostPhoto').html(html).modal('show');
            $('#tituloPost').text(tituloPost);
        }, "html");
    },

    aoImprimirTimeline: function () {
        var url = gafisa.alphabook.rotas.projeto.modalImpressaoTimeline;
        var data = { projetoId: gafisa.alphabook.home.carrossel.obterIdProjeto() };

        if (gafisa.alphabook.home.timeline.etapaLinhaTempo === true) {
            data.tipo = 2;
            data.etapaId = $(this).data('etapa-id');
        } else {
            data.tipo = 3;
            data.termo = $('#campoBuscaTimeline').val();
        }

        $.get(url, data, function (html) {
            $('#modalImpressaoTimeline').html(html).modal('show');

            $.navegar.ajustarRodape();
        }, "html");
    },

    aoClicarNomeProjeto: function () {
        var idProjeto = $(this).attr('data-projetoId');

        window.location.href = gafisa.alphabook.rotas.home.index + 'Home/Index/' + idProjeto;
    },

    aoClicarLinhaTempo: function () {
        var obj = $(this);

        if (!obj.data('podealterar')) {
            return;
        }

        var url = gafisa.alphabook.rotas.postagem.alterarEtapaPost;
        var data = { postagemId: obj.data('id') };

        $.get(url, data, function (html) {
            $('#modalEtapaPost').html(html).modal('show');
        }, 'html');
    },

    retornoAlteracaoLinhaTempo: function (json, obj) {
        if (json.sucesso) {
            if (obj.data('marco')) {
                obj.data('marco', false).removeClass('ico-post-linha-tempo').addClass('ico-post-linha-tempo-inativo');
            } else {
                obj.removeClass('ico-post-linha-tempo-inativo').addClass('ico-post-linha-tempo').data('marco', true);
            }
            gafisa.alphabook.home.contadores.atualizarLinhaTempo();
        }
        else {
            gafisa.alphabook.mensagens.exibirMensagemErro(json.erro);
        }
    },

    aoAlterarEtapa: function () {
        var statusEtapaId = $(this).val().split('|')[1];

        if (statusEtapaId == 1 || statusEtapaId == 3 || statusEtapaId == 5 || statusEtapaId == 6) {
            $('#form-etapa-post .campo-etapa').hide();
        } else {
            $('#form-etapa-post .campo-etapa').show();
        }
    },

    aoAlterarEtapaConcluida: function () {
        var etapaConcluida = $(this).val();

        if (etapaConcluida == 'true') {
            $('#form-etapa-post #statusEtapaNaoConcluida').hide();
            $('#form-etapa-post #statusEtapaConcluida').show();
        } else {
            $('#form-etapa-post #statusEtapaNaoConcluida').show();
            $('#form-etapa-post #statusEtapaConcluida').hide();
        }
    },

    aoSalvarEtapaPost: function () {
        var url = gafisa.alphabook.rotas.postagem.salvarEtapaPost;
        var data = {
            postagemId: $('#form-etapa-post #PostagemId').val(),
            projetoId: $('#form-etapa-post #ProjetoId').val(),
            etapaId: $('#form-etapa-post #EtapaId').val().split('|')[0],
            etapaConcluida: $('#form-etapa-post #etapaConcluida').val()
        };

        $.post(url, data, gafisa.alphabook.home.timeline.aposSalvarEtapaPost);
    },

    aposSalvarEtapaPost: function (json) {
        if (json.sucesso) {
            gafisa.alphabook.home.timeline.alterarIconeLinhaTempo($('div[id=dados-post][data-id=' + $('#form-etapa-post #PostagemId').val() + ']'));

            if ($('#postDetalhado').length > 0) {
                gafisa.alphabook.home.timeline.alterarIconeLinhaTempo($('#postDetalhado div[data-id=' + $('#form-etapa-post #PostagemId').val() + ']'));
            }

            if ($('#aba-posts .sep-posts-contato').length > 0) {
                gafisa.alphabook.home.timeline.alterarIconeLinhaTempo($('#aba-posts div.box-post[data-id=' + $('#form-etapa-post #PostagemId').val() + ']'));
            }

            $('#modalEtapaPost').html('').modal('hide');
            gafisa.alphabook.mensagens.exibirMensagemConfirmacao(gafisa.mensagens.comum.salvaComSucesso.format('Etapa'));
            gafisa.alphabook.home.contadores.atualizarLinhaTempo();
        } else {
            gafisa.alphabook.mensagens.exibirMensagemErro(json.erros[0]);
        }
    },

    alterarIconeLinhaTempo: function (post) {
        var iconeLinhaTempo = post.find('a.linhaTempo');

        iconeLinhaTempo.removeClass('ico-post-linha-tempo-inativo').addClass('ico-post-linha-tempo');
        iconeLinhaTempo.attr('title', $('#form-etapa-post #EtapaId option:selected').text());
        iconeLinhaTempo.data('podealterar', false);

        post.find('a.ico-post-perfil-publicacao').text('Público');
    },

    registrarVisualizarAnexo: function (detalhado, seletor) {
        $(seletor).each(
                function () {
                    $(this).off('click').on('click', function ()
                    { gafisa.alphabook.home.timeline.aoVisualizarAnexos(detalhado, $(this)); });
                });
    },

    aoVisualizarAnexos: function (detalhado, obj) {
        $.dialogo.exibir(gafisa.alphabook.rotas.timeline.carregarAnexosPost, { idPost: obj.data("postagemid"), detalhado: detalhado }, gafisa.alphabook.home.timeline.aoExibirVisualizarAnexos);
    },

    aoExibirVisualizarAnexos: function () {
        $('#modalVisAnexoPost #tabelaAnexosPostagem').tabela({ action: gafisa.alphabook.rotas.timeline.listarAnexosPostagem, parametros: { idPostagem: $('#modalVisAnexoPost').attr("data-postagemId"), tamanhoPagina: 10 }, tamanhoPagina: 10 });
        $('#modalVisAnexoPost #tabelaAnexosPostagem .ico-alerta').livequery(function () { $('#modalVisAnexoPost #alertaPrivacidade').css('display', 'inline'); });
        $("#modalVisAnexoPost #voltarPostCompleto").livequery(function () { $(this).off('click').on('click', function () { $.dialogo.voltar(null); }); });
        $('#modalVisAnexoPost .ico-download').livequery('click', gafisa.alphabook.home.documentos.aoBaixarArquivo);
        $('#modalVisAnexoPost #detalheArquivo').livequery(gafisa.alphabook.home.timeline.registrarVisualizarArquivos);
        $('#enviarPorEmail', '#modalVisAnexoPost').livequery('click', gafisa.alphabook.home.email.aoEnviarDocumentoPorEmail);
    },

    aoDetalharArquivo: function () {
        var idArquivo = $(this).data('id');
        var idProjeto = $('#modalVisAnexoPost').attr('data-projetoId');

        $.dialogo.fechar(function () { gafisa.alphabook.home.documentos.abrirDetalheArquivo(idArquivo, idProjeto); }, true);
    },

    registrarVisualizarArquivos: function () {
        $('#modalVisAnexoPost #detalheArquivo').each(
                function () {
                    $(this).off('click').on('click', gafisa.alphabook.home.timeline.aoDetalharArquivo);
                });
    },

    aoVisualizarCurtidores: function () {
        var dados = { postagemId: $(this).data("id") };

        $(this).tooltip('disable');

        $('.box-seguidores').css({
            left: ($(this).offset().left - 200) + 'px',
            top: ($(this).offset().top + 20) + 'px'
        });


        $.get(gafisa.alphabook.rotas.timeline.listarCurtidores, dados,
            gafisa.alphabook.home.timeline.aoRetornarCurtidores, 'html');

        $(this).tooltip('enable');

    },

    aoRetornarCurtidores: function (html, a, b) {
        $('.box-seguidores').html(html).show();

    },

    aoClicarLeiaMais: function () {
        var id = $(this).attr('data-postagemId');
        $.dialogo.exibir(gafisa.alphabook.rotas.timeline.carregarDetalhePost, { idPost: id, homeInicial: !gafisa.alphabook.home.carrossel.estaNoProjeto() });
    },

    exibirPostCompleto: function (idPostagem) {
        $.dialogo.exibir(gafisa.alphabook.rotas.timeline.carregarDetalhePost, { idPost: idPostagem, homeInicial: !gafisa.alphabook.home.carrossel.estaNoProjeto() });
    },

    aoFecharDetalhesPost: function () {
        $.dialogo.fechar();
    },

    aoSelecionarProjetoCarrossel: function (idProjeto) {
        gafisa.alphabook.home.timeline.recarregarTimeline();
    },

    aoSelecionarBuscar: function () {
        var busca = null;
        if (!String.isNullOrWhiteSpace($('#campoBuscaTimeline').val()));
        busca = $('#campoBuscaTimeline').val();
        var projetoId = null;
        if (gafisa.alphabook.home.carrossel.estaNoProjeto())
            projetoId = gafisa.alphabook.home.carrossel.obterIdProjeto();

        gafisa.alphabook.home.timeline.carregarTimeline(null, busca, projetoId);
    },

    aoBuscar: function () {
        if (String.isNullOrWhiteSpace($('#campoBuscaTimeline').val()))
            return;
        gafisa.alphabook.home.timeline.trocarBotaoParaLimpar();
        gafisa.alphabook.home.timeline.buscarNaTimeline();
    },

    aoExcluirPostModal: function () {
        var postagemId = $(this).attr('data-postagemId');
        $.dialogo.fechar(function () {
            $.dialogo.confirmar(
                gafisa.mensagens.comum.desejaExcluir,
                function () { gafisa.alphabook.home.timeline.aoConfirmarExclusaoPostModal(postagemId); },
                function () { gafisa.alphabook.home.timeline.aoNegarExclusaoPostModal(postagemId); }
            );
        });
    },

    aoNegarExclusaoPostModal: function (postagemId) {
        $.dialogo.exibir(gafisa.alphabook.rotas.timeline.carregarDetalhePost, { idPost: postagemId, homeInicial: !gafisa.alphabook.home.carrossel.estaNoProjeto() });
    },

    aoExcluirPost: function () {
        var post = $(this).parent().parent();
        $.dialogo.confirmar(gafisa.mensagens.comum.desejaExcluir, function () { gafisa.alphabook.home.timeline.aoConfirmarExclusaoPost(post); });
    },

    aoConfirmarExclusaoPostModal: function (postagemId) {
        $.loading({ action: 'show' });
        $.ajax({
            type: "GET",
            dataType: "json",
            url: gafisa.alphabook.rotas.timeline.excluirPostagem,
            data: { postagemId: postagemId },
            success: function (json) {
                gafisa.alphabook.home.contadores.atualizarPostagem();
                gafisa.alphabook.notificacao.atualizarQuantidadeNotificacoes();

                if (gafisa.alphabook.home.carrossel.estaNoProjeto())
                    gafisa.alphabook.home.timeline.carregarTimeline(null, null, gafisa.alphabook.home.carrossel.obterIdProjeto());
                else
                    gafisa.alphabook.home.timeline.carregarTimeline();

                $.loading({ action: 'hide' });
            },
            error: function () {
                $.loading({ action: 'hide' });
            }
        });
    },

    aoConfirmarExclusaoPost: function (post) {
        $.loading({ action: 'show' });

        $.ajax({
            type: "GET",
            dataType: "json",
            url: gafisa.alphabook.rotas.timeline.excluirPostagem,
            data: { postagemId: post.data('id') },
            success: function (json) {
                if (gafisa.alphabook.home.timeline.etapaLinhaTempo === true) {
                    $('#aba-padrao .etapas-linha-tempo').data('carregado', false);
                    gafisa.alphabook.home.linhaTempo.atualizarLinhaTempo();
                    $("#modalPostsEtapa").find("[data-id='" + post.data('id') + "']").remove();
                }
                else {
                    var idProjeto = gafisa.alphabook.home.carrossel.obterIdProjeto();
                    gafisa.alphabook.home.contadores.atualizarPostagem(idProjeto);
                    gafisa.alphabook.notificacao.atualizarQuantidadeNotificacoes();

                    if (gafisa.alphabook.home.carrossel.estaNoProjeto())
                        gafisa.alphabook.home.timeline.carregarTimeline(null, null, gafisa.alphabook.home.carrossel.obterIdProjeto());
                    else
                        gafisa.alphabook.home.timeline.carregarTimeline();

                    var vemDeProtocolo = $('#hddProtocolo').val();

                    if (vemDeProtocolo)
                        $("div").find("[data-id='" + post.data('id') + "']").remove();
                }

                $.loading({ action: 'hide' });
                gafisa.alphabook.mensagens.exibirMensagemConfirmacao(gafisa.mensagens.comum.excluidoComSucesso.format('Post'));
            },
            error: function () {
                $.loading({ action: 'hide' });
            }
        });
    },

    aoNegarExclusaoPost: function () {
        $.dialogo.fechar();
    },

    aoCurtir: function () {
        var curtiu = $(this).hasClass('ico-post-like');
        var postagemId = $(this).attr('data-postagemId');
        var botao = $(this);
        $.post(gafisa.alphabook.rotas.timeline.avaliarPostagem, { postagemId: postagemId, curtiu: curtiu },
            function (json) {
                if (json.sucesso) {
                    if (json.curtiu) {
                        botao.removeClass('ico-post-like-inativo').addClass('ico-post-like');
                        $('.post-like[data-id=' + postagemId + ']').removeClass('ico-post-like-inativo').addClass('ico-post-like');
                    } else {
                        botao.removeClass('ico-post-like').addClass('ico-post-like-inativo');
                        $('.post-like[data-id=' + postagemId + ']').removeClass('ico-post-like').addClass('ico-post-like-inativo');
                    }

                    $('.numero-seguir[data-id=' + postagemId + ']').text(json.quantidadeCurtir);

                }
            });
    },

    carregarTimeline: function (idInicio, termoBusca, projetoId) {
        $('.posts').fadeOut('fast', function () {
            $('#carregandoTimeline').fadeIn('fast', function () {
                $.get(gafisa.alphabook.rotas.timeline.home, { id: idInicio, termoBusca: termoBusca, projetoId: projetoId }, function (html) {
                    $('.posts').html(html);
                    $('#carregandoTimeline').fadeOut('fast', function () {
                        $('.posts').fadeIn();
                    });
                }, "html");
            });
        });
    },

    aoPressionarUmaTecla: function (e) {
        var campoBusca = $('#campoBuscaTimeline');
        var keyEvents = $.keyEvents(e);
        if (keyEvents.isEscape() && !String.isNullOrWhiteSpace(campoBusca.val())) {
            gafisa.alphabook.home.timeline.aoAlterarValorBusca(true);
        }
        else if (keyEvents.isEnter()) {
            e.preventDefault();
            if (!$('#botaoBuscaTimeline').hasClass('btn-cancel'))
                gafisa.alphabook.home.timeline.aoBuscar();
        }
        else if (keyEvents.isDelete() || keyEvents.isBackspace()) {
            if (campoBusca.data('tamanho') != campoBusca.val().length)
                gafisa.alphabook.home.timeline.aoAlterarValorBusca(campoBusca.val().length == 0);
        }
        else if (keyEvents.isCharacter()) {
            gafisa.alphabook.home.timeline.trocarBotaoParaBusca();
        }

        campoBusca.data('tamanho', campoBusca.val().length);
    },

    aoAlterarValorBusca: function (limparBusca) {

        if (limparBusca)
            $('#campoBuscaTimeline').val('');

        gafisa.alphabook.home.timeline.trocarBotaoParaBusca();

        if (limparBusca)
            gafisa.alphabook.home.timeline.buscarNaTimeline();
    },

    trocarBotaoParaBusca: function () {
        if ($('#botaoBuscaTimeline').hasClass('btn-cancel')) {
            var botaoBuscaTimeline = $('#botaoBuscaTimeline');
            botaoBuscaTimeline.unbind('click');
            botaoBuscaTimeline.removeClass('btn-cancel').addClass('btn-search');
            botaoBuscaTimeline.click(gafisa.alphabook.home.timeline.aoBuscar);
        }
    },

    trocarBotaoParaLimpar: function () {
        if ($('#botaoBuscaTimeline').hasClass('btn-search')) {
            var botaoBuscaTimeline = $('#botaoBuscaTimeline');
            botaoBuscaTimeline.unbind('click');
            botaoBuscaTimeline.removeClass('btn-search').addClass('btn-cancel');
            botaoBuscaTimeline.click(gafisa.alphabook.home.timeline.aoLimparBusca);
        }
    },

    aoLimparBusca: function () {
        gafisa.alphabook.home.timeline.aoAlterarValorBusca(true);
    },

    buscarNaTimeline: function () {
        if ($('.timeline').scrollTop() + $('.timeline').innerHeight() >= $('.timeline')[0].scrollHeight)
            var id = $('.timeline ul li').last().data('id');

        if (gafisa.alphabook.home.carrossel.estaNoProjeto())
            gafisa.alphabook.home.timeline.carregarTimelineProjeto(gafisa.alphabook.home.carrossel.obterIdProjeto(), id, null);
        else
            gafisa.alphabook.home.timeline.carregarTimelineHome();
    },

    aoRolarAteOFim: function () {
        if ($('.posts').data('carregando') || $('.posts').data('fim')) return;
        if ($(this).scrollTop() + $(this).innerHeight() >= $(this)[0].scrollHeight-10) {
            var id = $('.posts #dados-post').last().data('id');
            var data = { id: id };
            $('.posts').data('carregando', true);

            if (gafisa.alphabook.home.carrossel.estaNoProjeto()) {
                data = { id: id, projetoId: gafisa.alphabook.home.carrossel.obterIdProjeto() };
                if (!String.isNullOrWhiteSpace($('#campoBuscaTimeline').val())) {
                    data = { id: id, projetoId: gafisa.alphabook.home.carrossel.obterIdProjeto(), termoBusca: $('#campoBuscaTimeline').val() };
                }
            } else {
                if (!String.isNullOrWhiteSpace($('#campoBuscaTimeline').val())) {
                    data = { id: id, projetoId: gafisa.alphabook.home.carrossel.obterIdProjeto(), termoBusca: $('#campoBuscaTimeline').val() };
                }
            }

            $.get(
            gafisa.alphabook.rotas.timeline.carregarMaisPosts,
            data,
            function (html) {
                if (String.isNullOrWhiteSpace(html)) {
                    $('.posts').data('fim', true);
                } else {
                    $('.posts').append(html);
                    $('.posts').removeData('carregando');
                }
            },
            "html");
        }
    },

    /****/

    aoExcluirPostagem: function () {
        var temAnexos = $(this).siblings('.anexos').length > 0;
        $.notificationBar({
            message: temAnexos ? gafisa.mensagens.timeline.desejaExcluirComAnexo : gafisa.mensagens.comum.desejaExcluir,
            type: 'confirmation',
            options: [
                {
                    text: 'Sim',
                    action: gafisa.alphabook.home.timeline.aoConfirmarExclusaoDePostagem
                },
                {
                    text: 'Não',
                    action: null
                }
            ],
            data: $(this).parent().data('id')
        });
    },

    aoEditarPostagem: function () {
        gafisa.alphabook.home.postagem.habilitarEdicaoPostagem(this);
    },

    aoConfirmarExclusaoDePostagem: function (data) {
        var postagemId = data;
        $.post(gafisa.alphabook.rotas.timeline.excluirPostagem, { postagemId: postagemId },
            function (json) {
                if (json.sucesso) {
                    gafisa.alphabook.mensagens.exibirMensagemConfirmacao(gafisa.mensagens.comum.excluidaComSucesso.format('Publicação'));
                    if ($('#atualizacoesTimeLine').is(':visible')) {
                        gafisa.alphabook.home.timeline.recarregarTimeline();
                    } else {
                        $('li[data-id="' + postagemId + '"]').fadeOut('fast', function () { $(this).remove(); });
                    }
                }
                else {
                    gafisa.alphabook.mensagens.exibirMensagemErro(json.erros);
                }
            }, "json");
    },

    carregarTimelineProjeto: function (projetoId, idInicio, faseId) {
        var termoBusca = '';
        if ($('#botaoBuscaTimeline').hasClass('btn-cancel'))
            termoBusca = $('#campoBuscaTimeline').val();

        if ($('#atualizacoesTimeLine').is(':visible')) {
            $('#atualizacoesTimeLine').fadeOut('fast');
        }

        $('#listaTimeline').fadeOut('fast', function () {
            $('#loadTimeline').fadeIn('fast');
            $.ajax({
                url: gafisa.alphabook.rotas.timeline.projeto,
                data: {
                    projetoId: projetoId,
                    idInicio: (idInicio ? idInicio : null),
                    termoBusca: termoBusca,
                    faseId: (faseId ? faseId : null)
                },
                success: gafisa.alphabook.home.timeline.aposCarregarTimeline,
                dataType: 'html',
                async: true
            });
        });
    },

    aposCarregarTimeline: function (html) {
        $('#listaTimeline').html(html);
        $('#loadTimeline').fadeOut('fast');
        $('#listaTimeline').fadeIn('fast', function () {
            $('#timelineWrap').antiscroll({ x: false, refresh: true });
        });
        $('.timeline').removeData('fim');
    },

    carregarTimelineHome: function () {
        var termoBusca = '';
        if ($('#botaoBuscaTimeline').hasClass('btn-cancel'))
            termoBusca = $('#campoBuscaTimeline').val();

        if ($('#atualizacoesTimeLine').is(':visible')) {
            $('#atualizacoesTimeLine').fadeOut('fast');
        }

        $('#listaTimeline').fadeOut('fast', function () {
            $('#loadTimeline').fadeIn('fast');
            $.ajax({
                url: gafisa.alphabook.rotas.timeline.home,
                data: { termoBusca: termoBusca },
                success: gafisa.alphabook.home.timeline.aposCarregarTimeline,
                dataType: 'html',
                async: true
            });
        });
    },

    recarregarTimeline: function () {
        if (gafisa.alphabook.home.carrossel.estaNoProjeto())
            gafisa.alphabook.home.timeline.carregarTimeline(null, null, gafisa.alphabook.home.carrossel.obterIdProjeto());
        else
            gafisa.alphabook.home.timeline.carregarTimelineHome();
    },

    aoBaixarDocumento: function (e) {
        e.preventDefault();
        window.location.href = gafisa.alphabook.rotas.arquivo.downloadArquivo.concatQueryString({ referencia: $(this).data('referencia') });
    },



    aoAtualizarTimelineComNovosPosts: function () {
        gafisa.alphabook.home.timeline.recarregarTimeline();
    },


    ajustarTimeline: function (reajuste) {

        var alturaBox = ($('.lastro').height() - $('.container-post').height()) - 81;
        var scroll = (reajuste ? $.fn.scrollbarSize() : 0);
        var alturaTimeline = alturaBox - 55 + scroll - ($('#atualizacoesTimeLine').is(':visible') ? $('#atualizacoesTimeLine').height() : 0);
        var alturaWrap = alturaTimeline - scroll;

        if (alturaBox < 626) alturaBox = 626;
        if (alturaTimeline < 626) alturaTimeline = 626;
        if (alturaWrap < 571) alturaWrap = 571;

        //alert('box:' + alturaBox + ', timeline:' + alturaBox + ', wrap:' + alturaWrap + ', lastro' + $('#atualizacoesTimeLine').height());
        $('.aroundTimeLine').height(alturaBox);
        $('#timeline').height(alturaTimeline);
        $('#timelineWrap').height(alturaWrap);

        $('#timelineWrap').antiscroll({ x: false, refresh: reajuste });
    },

    aoCriarPost: function () {
        gafisa.alphabook.home.postagem.aoClicarCriarPost();
    },

    aoClicarProjetosAssociados: function () {
        var id = $(this).parent().parent().parent().data('id');
        $('#modal').addClass('modalProjetosAssociados');
        $.dialogo.exibir(gafisa.alphabook.rotas.postagem.carregarProjetosAssociados, { idPost: id, detalhado: false, homeInicial: !gafisa.alphabook.home.carrossel.estaNoProjeto() });
    },



};

$(document).ready(gafisa.alphabook.home.timeline.inicializar);
