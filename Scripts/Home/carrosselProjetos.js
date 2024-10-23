if (typeof gafisa.alphabook.home == 'undefined') { gafisa.alphabook.home = new Object(); }

gafisa.alphabook.home.carrossel = {
    inicializar: function () {
        gafisa.alphabook.home.carrossel.registrarAcoes();

        if ($('#ProjetoId').val())
            gafisa.alphabook.home.carrossel.configurarProjetoSelecionado($('#ProjetoId').val());

    },
    registrarAcoes: function () {

        $('#listaProjetos div.tile-topo').livequery(function () { $(this).click(gafisa.alphabook.home.carrossel.aoSelecionarProjeto); });
        $('#exibirMaisProjetos').livequery(function () { $(this).click(gafisa.alphabook.home.carrossel.aoExibirMaisProjetos); });
        $('#ocultarProjetos').livequery(function () { $(this).click(gafisa.alphabook.home.carrossel.aoOcultarProjetos); });
        $('#botaoBuscaProjetos').livequery(function () { $(this).click(gafisa.alphabook.home.carrossel.aoPesquisarProjetos); });
        $('#botaoLimparBuscaProjetos').livequery(function () { $(this).click(gafisa.alphabook.home.carrossel.aoLimparProjetos); });
        $('#campoBuscaProjetos').onPressEnter(gafisa.alphabook.home.carrossel.aoPesquisarProjetos);
        $('.bt-seguidores').livequery(function () { $(this).click(gafisa.alphabook.home.carrossel.aoVisualizarSeguidores); });
        $('.bt-seguir').livequery(function () { $(this).click(gafisa.alphabook.home.carrossel.aoSeguirProjeto); });
        $('#carrosselProjetos .ico-projetos-pai').livequery('click', gafisa.alphabook.home.carrossel.aoClicarProjetoPai);
        $('#carrosselProjetos .ico-projetos-filhos').livequery('click', gafisa.alphabook.home.carrossel.aoClicarProjetosFilhos);
        $('.barra-sup-carrossel .meus-projetos h2').livequery('click', gafisa.alphabook.home.carrossel.aoClicarDropdownProjetos);
        $('.meus-projetos .dropdown-projetos').livequery('mouseleave', function () {
            if ($('.meus-projetos .dropdown-projetos').is(':visible'))
                $('.meus-projetos .dropdown-projetos').addClass('hide');
        });
        $('.meus-projetos .dropdown-projetos').livequery('click', gafisa.alphabook.home.carrossel.aoSelecionarDropdownProjetos);
        $('ul.tooltip-projetos-filhos li').livequery('click', gafisa.alphabook.home.carrossel.aoClicarProjetoFilho);

        $('#btnEnviarIndicacao').livequery('click', gafisa.alphabook.home.carrossel.aoEnviarIndicacao);
        $('.ico-email').livequery('click', gafisa.alphabook.home.carrossel.aoIndicarProjeto);

        $(".box-seguidores").mouseleave(function () {
            $(this).hide();
        });

    },

    aoIndicarProjeto: function () {
        var projetoId = $(this).data('id');

        $.dialogo.exibir(gafisa.alphabook.rotas.projeto.modalIndicarProjeto, { projetoId: projetoId }, gafisa.alphabook.home.carrossel.aposAbrirModalIndicarProjeto);
    },

    aposAbrirModalIndicarProjeto: function () {
        if ($('#destinatariosLinkProjeto').attr('multiple') == 'multiple') return;
        $('#destinatariosLinkProjeto').fcbkcomplete({
            json_url: gafisa.alphabook.rotas.usuario.listarEmails,
            cache: true,
            maxitems: 999,
            newel: false,
            complete_text: "Digite um email",
            width: 800,
            bricket: false
        });
    },

    aoEnviarIndicacao: function () {
        var usuarios = new Array();
        if ($('#destinatariosLinkProjeto option').val() != null && $('#destinatariosLinkProjeto option').val() != '') {
            $('#destinatariosLinkProjeto option').each(function (i, e) {
                var value = $(e).val().split('|');
                var usuario = {};
                usuario.Email = value[1];
                usuario.Id = value[0];
                usuarios.push(usuario);
            });
        }

        if (usuarios.length == 0) {
            gafisa.alphabook.mensagens.exibirMensagemErro(gafisa.mensagens.comum.obrigatorio.format('destinatários'));
            return;
        }

        $.loading({ action: 'show' });

        var data = {};
        data.Usuarios = usuarios;
        data.ProjetoId = $(this).data('id');

        $.ajax({
            url:gafisa.alphabook.rotas.projeto.indicarProjeto,
            type: "POST",
            data: JSON.stringify(data),
            cache: false,
            contentType: 'application/json',
            success: gafisa.alphabook.home.carrossel.aposEnviarIndicacao
        });
    },

    aposEnviarIndicacao : function(json) {
        $.loading({ action: 'hide' });

        if (json.sucesso) {
            gafisa.alphabook.mensagens.exibirMensagemConfirmacao(gafisa.mensagens.comum.enviadaComSucesso.format('Indicação'));
            $.dialogo.fechar();
        }
        else {
            if (typeof json.erros != 'undefined')
                gafisa.alphabook.mensagens.exibirMensagemErro(json.erros[0]);
        }
    },

    aoClicarProjetoPai: function () {
        var id = $(this).data('idprojetopai');
        window.location.href = gafisa.alphabook.rotas.home.index + 'Home/Index/' + id;
    },

    aoClicarProjetosFilhos: function () {
        $.navegar.proximo(gafisa.alphabook.rotas.projeto.dadosProjeto, { id: $(this).data('id') }, function () {
            $('#abaFases').click();
        });
    },

    aoClicarProjetoFilho: function () {
        var id = $(this).data('id');
        window.location.href = gafisa.alphabook.rotas.home.index + 'Home/Index/' + id;
    },

    aoSelecionarProjeto: function () {

        $('#tileMapasHome').fadeOut('fast');

        $('.tile-home').fadeOut('fast');
        $('.tile-projeto').fadeIn('fast');
        $('.barra-sup-carrossel').slideUp();

        var idProjeto = $(this).data('id');
        var idStatus = $(this).data('status');

        gafisa.alphabook.home.carrossel.posicionarTela(0);
        $('#criarPost, #imprimirTimeline').fadeIn();
        $('#blocos-linhas').slideUp(1000);
        $("#carrosselProjetos").animate({ opacity: "0.0" }, 500, function () {
            var tileprojeto = $('.tile-projeto[data-id=' + idProjeto + ']').clone();
            tileprojeto.removeClass('no-bd-left').width("100%");

            var section = $("#carrosselProjetos").width("100%").find('.section-project').html('');

            section.append(tileprojeto).width("100%");
            $("#carrosselProjetos").animate({ opacity: "1.0" }, 500);

            if (!gafisa.alphabook.autorizacao.usuarioPossuiPermissao(gafisa.alphabook.autorizacao.secao.homeProjeto,
                                                                    gafisa.alphabook.autorizacao.funcionalidade.posts,
                                                                    gafisa.alphabook.autorizacao.acao.visualizar)) {
                $('#labelPostsTimeline').fadeOut(function () {
                    $(this).remove();
                });

                $('.div-search').fadeOut(function () {
                    $(this).remove();
                });
                $('#carregandoTimeline').fadeOut(function () {
                    $(this).remove();
                });
                $('#divTimelinePosts').fadeOut(function () {
                    $(this).remove();
                });
            }

            if (gafisa.alphabook.autorizacao.usuarioPossuiPermissao(gafisa.alphabook.autorizacao.secao.homeProjeto,
                                                                    gafisa.alphabook.autorizacao.funcionalidade.agendaCompromisso,
                                                                    gafisa.alphabook.autorizacao.acao.visualizar)) {
                $('#tileAgenda').fadeIn('fast', gafisa.alphabook.home.agenda.obterCompromissosTile);
            } else {
                $('#tileAgenda').slideUp('slow');
            }
        });

        gafisa.alphabook.home.carrossel.verificarPermissaoContatos();
        gafisa.alphabook.home.carrossel.selecionarProjeto(idProjeto, idStatus);
        gafisa.alphabook.home.timeline.aoSelecionarProjetoCarrossel(idProjeto);
        gafisa.alphabook.home.clima.carregarClimaCidadeProjeto(idProjeto);

        $('.tile-triple-links').width(458);
        $('#imprimirContatos').livequery(function () { $(this).addClass('imprimir-projeto-contato'); });
    },

    selecionarProjeto: function (idProjeto, idStatus) {
        $("#carrosselProjetos").data("idprojeto", idProjeto);
        $("#carrosselProjetos").data('status', idStatus);
        $("body").data("idprojeto", idProjeto);
        $("body").data("status", idStatus);
        gafisa.alphabook.home.contadores.atualizarTodos();
    },

    verificarPermissaoContatos: function () {
        if (gafisa.alphabook.autorizacao.usuarioPossuiPermissao(gafisa.alphabook.autorizacao.secao.homeProjeto,
                                                                    gafisa.alphabook.autorizacao.funcionalidade.contatos,
                                                                    gafisa.alphabook.autorizacao.acao.visualizar)) {

            $('.tile-contatos .nome-tile').before('<span class="numero-tile">&nbsp;</span>');
            $(".tile-contatos .nome-tile").show();
            $(".tile-contatos").removeClass('inativo');
        } else {
            $(".tile-contatos").addClass('inativo');
            $(".tile-contatos .numero-tile").remove();
        }
    },

    aoExibirMaisProjetos: function () {
        if ($('#blocos-linhas').data('quantidadeprojetos') <= 4) return;

        var blocoatual = $('#carrosselProjetos').data('blocoexibido');

        blocoatual++;
        var linha = $('.linha-bloco-projetos[data-bloco=' + blocoatual + ']');

        if (linha.length) {
            linha.slideToggle(400, function () {
                gafisa.alphabook.home.carrossel.posicionarTela($("#exibirMaisProjetos").offset().top - 630);
                gafisa.alphabook.home.carrossel.alternarBotoes();
                $.navegar.ajustarRodape();
            });

            $('#carrosselProjetos').data('blocoexibido', blocoatual);
        }
    },

    aoOcultarProjetos: function () {
        var blocoatual = $('#carrosselProjetos').data('blocoexibido');
        var linha = $('.linha-bloco-projetos[data-bloco=' + blocoatual + ']');
        blocoatual--;

        if (linha.length) {
            linha.slideToggle(400, function () {
                gafisa.alphabook.home.carrossel.posicionarTela(blocoatual == 0 ? 0 : ($("#exibirMaisProjetos").offset().top - 630));
                gafisa.alphabook.home.carrossel.alternarBotoes();
                $.navegar.ajustarRodape();
            });

            $('#carrosselProjetos').data('blocoexibido', blocoatual);
        }
    },

    aoClicarDropdownProjetos : function() {
        if ($('.meus-projetos .dropdown-projetos').is(':visible'))
            $('.meus-projetos .dropdown-projetos').addClass('hide');
        else
            $('.meus-projetos .dropdown-projetos').removeClass('hide');
    },

    aoSelecionarDropdownProjetos: function () {
        if ($('.barra-sup-carrossel .meus-projetos').data('tipofiltro') == 0) {
            $('.barra-sup-carrossel .meus-projetos h2').html('Seguidos <span></span>');
            $('.meus-projetos .dropdown-projetos h3').text('Meus Projetos');
            $('.barra-sup-carrossel .meus-projetos').data('tipofiltro', 1);
        } else {
            $('.barra-sup-carrossel .meus-projetos h2').html('Meus Projetos <span></span>');
            $('.meus-projetos .dropdown-projetos h3').text('Seguidos');
            $('.barra-sup-carrossel .meus-projetos').data('tipofiltro', 0);
        }

        gafisa.alphabook.home.carrossel.aoPesquisarProjetos();
    },

    aoPesquisarProjetos: function () {
        $('#carregandoCarrossel').show();
        $('#section1').hide();
        var dados = {
            statusId: $('.filtro-carrossel-status').val(),
            ufId: $('.filtro-carrossel-uf').val(),
            nome: $('.filtro-carrossel-nome').val(),
            tipoFiltro: $('.barra-sup-carrossel .meus-projetos').data('tipofiltro')
        };

        $.get(gafisa.alphabook.rotas.projeto.obterCarrosselHome,
            dados,
            gafisa.alphabook.home.carrossel.aoRetornarProjetos, 'html');

    },

    aoRetornarProjetos: function (html, a, b) {
        $('#section1').show();
        $('#carregandoCarrossel').hide();

        if (String.isNullOrEmpty(html)) {
            gafisa.alphabook.mensagens.exibirMensagemErro(gafisa.mensagens.comum.nenhumProjetoEncontrado);
        }
        else {
            $('#listaProjetos').html(html);
            $('.barra-sup-carrossel .meus-projetos span').text('(' + $(html).find('div.tile-projeto').length + ')');
            $('#carrosselProjetos').data('blocoexibido', 0);
            gafisa.alphabook.home.carrossel.alternarBotoes();
        }
    },

    aoLimparProjetos: function () {
        $('#carregandoCarrossel').show();
        $('#section1').hide();
        var dados = {
            statusId: '',
            ufId: '',
            nome: '',
            tipoFiltro: $('.barra-sup-carrossel .meus-projetos').data('tipofiltro')
        };

        $('.filtro-carrossel-status').val('');
        $('.filtro-carrossel-uf').val('');
        $('.filtro-carrossel-nome').val('');

        $.get(gafisa.alphabook.rotas.projeto.obterCarrosselHome,
                dados,
                gafisa.alphabook.home.carrossel.aoRetornarProjetos, 'html');
    },

    aoVisualizarSeguidores: function () {

        var dados = { projetoId: $(this).data("id") };

        $(this).tooltip('disable');

        $('.box-seguidores').css({
            left: ($(this).offset().left - 5) + 'px',
            top: ($(this).offset().top + 20) + 'px'
        });

        $.get(gafisa.alphabook.rotas.projeto.listarSeguidores,
            dados,
            gafisa.alphabook.home.carrossel.aoRetornarSeguidores, 'html');

        $(this).tooltip('enable');
    },

    aoRetornarSeguidores: function (html, a, b) {
        $('.box-seguidores').html(html).show();

    },

    aoSeguirProjeto: function () {

        var dados = { projetoId: $(this).data("id"), favoritar: $(this).data("favorito") };
        var link = $(this);
        $.post(gafisa.alphabook.rotas.projeto.favoritar,
            dados, function (json) {
                link.data("favorito", json.favorito);

                if (json.favorito) {
                    link.removeClass('ico-seguir-inativo').addClass('ico-seguir');
                }
                else {
                    link.removeClass('ico-seguir').addClass('ico-seguir-inativo');
                }

                $('.numero-seguir[data-id=' + dados.projetoId + ']').text(json.seguidores);
            }
            );

    },

    aoRetornarSeguirProjeto: function (html, a, b) {
        $('.box-seguidores').html(html).show();

    },

    alternarBotoes: function () {
        var blocoatual = $('#carrosselProjetos').data('blocoexibido');
        var quantidade = $('#blocos-linhas').data('quantidadeprojetos');

        if (blocoatual == 0) {
            if (quantidade > 4) {
                $('#exibirMaisProjetos').removeClass('bt-exibir-aberto').addClass('bt-exibir');
            } else {
                $('#exibirMaisProjetos').removeClass('bt-exibir-aberto').addClass('bt-exibir-inativo');
            }
            $('#ocultarProjetos').hide();

        } else {
            $('#exibirMaisProjetos').removeClass('bt-exibir').removeClass('bt-exibir-inativo').addClass('bt-exibir-aberto');
            $('#ocultarProjetos').show();
        }

        if ((blocoatual * 12) >= quantidade)
            $('#exibirMaisProjetos').hide();
        else
            $('#exibirMaisProjetos').show();

        $('#ocultarProjetos').removeClass('bt-ocultar-com-exibir-aberto');
        if ($('#ocultarProjetos').is(':visible') && $('#exibirMaisProjetos').is(':visible'))
            $('#ocultarProjetos').addClass('bt-ocultar-com-exibir-aberto');
    },

    posicionarTela: function (posicao) {

        $('html, body').animate({
            scrollTop: posicao
        }, 1000);
    },

    obterIdProjeto: function () {
        var obj;

        try {
            obj = $("body").data("idprojeto");
        } catch (e) { }

        return obj == undefined ? 0 : obj;
    },

    obterIdStatusProjeto: function () {
        var obj = $("body").data("status");

        return obj == undefined ? null : obj;
    },

    estaNoProjeto: function () {
        return gafisa.alphabook.home.carrossel.obterIdProjeto() != 0;
    },

    configurarProjetoSelecionado: function (id) {

        if (typeof id == 'undefined') {
            var quantidadeProjetos = $('div.tile-topo').length;
            if (quantidadeProjetos == 1) {
                var idProjeto = $('div.tile-topo').data('id');
                $('div.tile-topo[data-id=' + idProjeto + ']').trigger('click');
            }
        }
        else {

            $('#listaProjetos div.tile-topo').trigger('click');
        }

    },

    aoObterProjeto: function (html) {
        if (String.isNullOrEmpty(html)) {
            gafisa.alphabook.mensagens.exibirMensagemErro(gafisa.mensagens.comum.nenhumProjetoEncontrado);
        }
        else {
            $("#carrosselProjetos").livequery(function () {
                $(this)
                    .width("100%")
                    .find('.section-project')
                    .find('#listaProjetos')
                    .html('')
                    .append(html)
                    .width("100%")
                    .delegate('div.tile-topo', 'click', gafisa.alphabook.home.carrossel.aoSelecionarProjeto);

            });
        }
    }
};

$(document).ready(gafisa.alphabook.home.carrossel.inicializar);
