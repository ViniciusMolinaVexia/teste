if (typeof gafisa == 'undefined') { gafisa = new Object(); }
if (typeof gafisa.alphabook == 'undefined') { gafisa.alphabook = new Object(); }

gafisa.alphabook.notificacao = {
    inicializar: function () {
        gafisa.alphabook.notificacao.registrarAcoes();
        gafisa.alphabook.notificacao.atualizarQuantidadeNotificacoes();
    },

    registrarAcoes: function () {
        var $btMensagens = $(".bt-mensagens"),
            $boxShowMessage = $('.box-show-msg'),
            $btCurtir = $(".bt-curtir"),
            $btExcluir = $(".bt-excluir"),
            $linkPost = $('.box-post .dados-post', '.div-notificacao'),
            $iconesPost = $('.box-post .icones-post a', '.div-notificacao');

        gafisa.alphabook.notificacao.registrarTimeoutDeNotificacao();
        $boxShowMessage.livequery(function () { $(this).scroll(gafisa.alphabook.notificacao.aoRolarAteOFim); });
        $btCurtir.livequery(function () { $(this).click(gafisa.alphabook.notificacao.aoCurtir); });
        $btExcluir.livequery(function () { $(this).click(gafisa.alphabook.notificacao.aoExcluir); });
        $linkPost.livequery(function () { $(this).click(gafisa.alphabook.notificacao.aoClicarNoPost); });
        $iconesPost.livequery(function () { $(this).click(gafisa.alphabook.notificacao.aoClicarNosIconesPost); });
        $('.div-checkbox input[type=checkbox]').livequery(function () { $(this).click(gafisa.alphabook.notificacao.alterarStatusParaLidaNaoLida); });

        $('div.box-notificacao-mensagens').hide();

        $btMensagens.click(
            function () {
                if ($boxShowMessage.data('aberto')) {
                    $boxShowMessage.data('aberto', false);
                    $boxShowMessage.fadeToggle();
                    return;
                }

                $boxShowMessage.fadeToggle();
                $boxShowMessage.data('aberto', true);
                $boxShowMessage.append('<div id="carregandoNotificacoes" class="loading-circulo" style="float: left"></div>');
                $('#carregandoNotificacoes').fadeIn('fast', function () {
                    $boxShowMessage.data('pagina', 1);
                    $boxShowMessage.load(gafisa.alphabook.rotas.notificacao.carregarNotificacoes, gafisa.alphabook.notificacao.aoExibirNotificacoes);
                });
            }
        );

        $(".box-notificacoes").clickOutSide(gafisa.alphabook.notificacao.aoClicarForaEnvelopeNotificacao);
    },

    aoClicarForaEnvelopeNotificacao: function () {
        if ($('.box-show-msg').data('aberto')) {
            $('.box-show-msg').data('aberto', false);
            $('.box-show-msg').fadeToggle();
            return;
        }
    },

    aoExibirNotificacoes: function () {
        $('.dados-post p.nome-post', '.div-notificacao .box-post').css('cursor', 'pointer');
    },

    registrarTimeoutDeNotificacao: function () {
        setInterval(gafisa.alphabook.notificacao.atualizarQuantidadeNotificacoes, gafisa.alphabook.padroes.tempoAtualizacao.notificacoes);
    },

    atualizarQuantidadeNotificacoes: function () {
        var $divNotificacoes = $('div.box-notificacao-mensagens');
        $.get(gafisa.alphabook.rotas.notificacao.obterQuantidadeNotificacoesNaoLidas, function (json) {
            if (json.quantidade > 0) {
                $divNotificacoes.show().text(json.quantidade > 99 ? "99+" : json.quantidade);
            } else {
                $divNotificacoes.hide();
            }
        });
    },

    aoExcluir: function () {
        var notificacaoId = { notificacaoId: $(this).data('id') };
        gafisa.alphabook.notificacao.aoConfirmarExclusao(notificacaoId);
    },

    aoConfirmarExclusao: function (data) {
        $.loading({
            url: gafisa.alphabook.rotas.notificacao.excluirNotificacaoUsuario,
            data: data,
            success: function (json) {
                if (json.sucesso) {
                    var id = data.notificacaoId;
                    var $notificacao = $('div[data-id=' + id + ']');
                    $notificacao.slideUp(500, function () { gafisa.alphabook.notificacao.removerNotificacao($notificacao); });
                    gafisa.alphabook.notificacao.atualizarQuantidadeNotificacoes();

                    var $listaNotificacoes = $('.box-show-msg');
                    var pagina = $listaNotificacoes.data('pagina');
                    $listaNotificacoes.data('pagina', ++pagina);

                    var param = { pagina: pagina };
                    $listaNotificacoes.data('carregando', true);

                    $.get(
                        gafisa.alphabook.rotas.notificacao.listarNotificacoes,
                        param,
                        function (html) {
                            if (String.isNullOrWhiteSpace(html)) {
                                $listaNotificacoes.data('fim', true);
                            } else {
                                $listaNotificacoes.append(html);
                                $listaNotificacoes.removeData('carregando');
                            }
                        },
                        "html");
                }
                else {
                    gafisa.alphabook.mensagens.exibirMensagemErro(json.erros);
                }
            },
            type: 'post'
        });
    },

    aoRolarAteOFim: function () {
        var $listaNotificacoes = $('.box-show-msg');
        if ($listaNotificacoes.data('carregando') || $listaNotificacoes.data('fim')) return;
        if ($(this).scrollTop() + $(this).innerHeight() >= $(this)[0].scrollHeight) {
            var pagina = $listaNotificacoes.data('pagina');
            if ((isNaN(pagina)) || (typeof pagina == 'undefined')) {
                $listaNotificacoes.data('pagina', 1);
                pagina = 1;
            }

            $listaNotificacoes.data('pagina', ++pagina);

            var data = { pagina: pagina };
            $listaNotificacoes.data('carregando', true);

            $.get(
            gafisa.alphabook.rotas.notificacao.listarNotificacoes,
            data,
            function (html) {
                if (String.isNullOrWhiteSpace(html)) {
                    $listaNotificacoes.data('fim', true);
                } else {
                    $listaNotificacoes.append(html);
                    $listaNotificacoes.removeData('carregando');
                }
            },
            "html");
        }
    },

    aoCurtir: function () {
        var curtiu = $(this).hasClass('ico-post-like');
        var postagemId = $(this).data("id");
        var botao = $(this);
        $.post(gafisa.alphabook.rotas.timeline.avaliarPostagem, { postagemId: postagemId, curtiu: curtiu },
                            function (json) {
                                if (json.sucesso) {
                                    botao.removeClass();
                                    if (json.curtiu) {
                                        botao.addClass('ico-post-like bt-curtir');
                                    } else {
                                        botao.addClass('ico-post-like-inativo bt-curtir');
                                    }

                                    botao.text(json.quantidadeCurtir);
                                }

                            });
    },

    alterarStatusParaLidaNaoLida: function () {
        var idNotificacao = $(this).attr("id");
        var lida = $(this).attr("checked") == "checked" ? false : true;

        if (lida) {
            $(this).attr("checked", "checked");
        }
        else {
            $(this).removeAttr("checked");
        }

        $.post(gafisa.alphabook.rotas.notificacao.alterarStatusParaLidaNaoLida, { id: idNotificacao, lida: lida });
        gafisa.alphabook.notificacao.aposLerNotificacao();
    },

    aposLerNotificacao: function () {
        gafisa.alphabook.notificacao.atualizarQuantidadeNotificacoes();
    },


    removerNotificacao: function (notificacao) {
        $(notificacao).remove();
    },

    aoClicarNoPost: function () {
        var pendenteAprovacao = $(this).data('pendenteaprovacao');
        if (pendenteAprovacao) {
            $.navegar.proximo(gafisa.alphabook.rotas.aprovacaoEtapa.aprovacaoEtapa, null, gafisa.alphabook.home.aprovacaoEtapa.aoExibirTela);
            gafisa.alphabook.notificacao.aoClicarForaEnvelopeNotificacao();
        } else {

            var id = $(this).data('id');
            var post = $(this).data('post');

            gafisa.alphabook.notificacao.exibirDialogo(id, post);
        }
    },

    aoClicarNosIconesPost: function () {
        var id = $(this).parent().prev().data('id');
        var post = $(this).parent().prev().data('post');

        gafisa.alphabook.notificacao.exibirDialogo(id, post);
    },

    exibirDialogo: function (id, post) {
        if (post) {
            var homeInicial = gafisa.alphabook.home.carrossel.obterIdProjeto() == 0;
            $.dialogo.exibir(gafisa.alphabook.rotas.timeline.carregarDetalhePost, { idPost: id, homeInicial: homeInicial });
        }
    },

    aoFecharDetalhesPost: function () {
        $.dialogo.fechar();
    }
};

$(document).ready(gafisa.alphabook.notificacao.inicializar);