(function ($) {

    var dialogos = [];
    var modalPresente = false;
    var callbackFecharModal = null;
    var aoSelecionarUsuarioResponsavel = null;

    $.fn.dialogo = new Object();

    $.fn.dialogo.obterNivelDialogo = function () {
        return (dialogos.length + 1);
    };

    $.fn.dialogo.exibir = function (action, parametros, callback, antesConteudoSerExibido) {
        if (action == null || String.isNullOrEmpty(action))
            return;

        if (parametros == null)
            parametros = {};

        $.get(action, parametros, function (html) {

            var divConteudo = $('#modal').find('#conteudoModal');

            if (!modalPresente) {
                divConteudo.html(html);

                if (antesConteudoSerExibido)
                    antesConteudoSerExibido();

                if (callback)
                    $('#modal').on('show', callback);

                $('#modal').modal('toggle');
                modalPresente = true;
            }
            else {
                $.fn.dialogo.salvarDialogo();
                divConteudo.fadeOut('fast', function () {
                    divConteudo.html(html);
                    divConteudo.fadeIn('fast', callback);
                });
            }

        }, "html");

    };

    $.fn.dialogo.atualizar = function (action, parametros, callback, antesConteudoSerExibido) {
        if (action == null || String.isNullOrEmpty(action))
            return;

        if (parametros == null)
            parametros = {};

        $.get(action, parametros, function (html) {
            var divConteudo = $('#modal').find('#conteudoModal');
            divConteudo.fadeOut('fast', function () {
                divConteudo.html(html);
                divConteudo.fadeIn('fast', callback);
            });
        }, 'html');

    };

    $.fn.dialogo.fechar = function (callback, naoVoltar) {
        $('#modal').off('hidden').on('hidden', $.fn.dialogo.aoFecharModal);

        if (naoVoltar == undefined) naoVoltar = false;
        if (dialogos.length > 0 && !naoVoltar) {
            $.fn.dialogo.voltar(callback);
            return;
        }

        if ($('#modal').hasClass('in')) {
            callbackFecharModal = callback;
            $('#modal').modal('toggle');
        } else {
            if ($('.modal-backdrop').is(':visible'))
                $('#modalConfirmacao').modal('toggle');
        }
    };

    $.fn.dialogo.aoFecharModal = function () {
        modalPresente = false;
        dialogos = [];
        $('#modal').find('#conteudoModal').html('');
        if (callbackFecharModal) {
            callbackFecharModal();
            callbackFecharModal = null;
        }

        $('#modal').off('hidden', $.fn.dialogo.aoFecharModal);
    };

    $.fn.dialogo.voltar = function (callback) {
        if (dialogos.length == 0) {
            $.fn.dialogo.fechar(callback);
            return;
        }

        var conteudoDialogo = dialogos.pop();
        var divConteudo = $('#modal').find('#conteudoModal');

        divConteudo.fadeOut('fast', function () {
            divConteudo.html(conteudoDialogo);
            if (callback)
                divConteudo.fadeIn('fast', callback);
            else
                divConteudo.fadeIn('fast');
        });

    };

    $.fn.dialogo.salvarDialogo = function () {
        $.each($('#conteudoModal').find('input'), function (index, element) {
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

        $.each($('#conteudoModal').find('select'), function (index, element) {
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

        dialogos.push($('#conteudoModal').html());
    };

    $.fn.dialogo.confirmar = function (mensagem, callbackSim, callbackNao, deveExecutarAntesFechar) {

        $('#sim').on('click', function () {
            if (deveExecutarAntesFechar && callbackSim) callbackSim();

            $('#modalConfirmacao').modal('hide');

            if (!deveExecutarAntesFechar && callbackSim) callbackSim();

            $('#sim').off('click');
            $('#nao').off('click');
        });

        $('#nao').on('click', function () {

            if (deveExecutarAntesFechar && callbackNao) callbackNao();

            $('#modalConfirmacao').modal('hide');

            if (!deveExecutarAntesFechar && callbackNao) callbackNao();

            $('#sim').off('click');
            $('#nao').off('click');
        });

        $('#modalConfirmacao').find('p').html(mensagem);

        $('#modalConfirmacao').modal('show');
    };

    $.fn.dialogo.questaoTripla = function (mensagem, opcao1, opcao2, opcao3, callbackOpcao1, callbackOpcao2, callbackOpcao3) {

        $('#modalSelecaoTripla #opcao1,#modalSelecaoTripla #opcao2,#modalSelecaoTripla #opcao3').show();

        if (opcao1 == "" || opcao1 == null) $('#modalSelecaoTripla #opcao1').hide();
        if (opcao2 == "" || opcao2 == null) $('#modalSelecaoTripla #opcao2').hide();
        if (opcao3 == "" || opcao3 == null) $('#modalSelecaoTripla #opcao3').hide();

        $('#modalSelecaoTripla #opcao1').on('click', function () {
            $('#modalSelecaoTripla').modal('hide');

            if (callbackOpcao1) {
                callbackOpcao1();
            }

            $('#modalSelecaoTripla #opcao1').off('click');
            $('#modalSelecaoTripla #opcao2').off('click');
            $('#modalSelecaoTripla #opcao3').off('click');
        }).text(opcao1);

        $('#modalSelecaoTripla #opcao2').on('click', function () {
            $('#modalSelecaoTripla').modal('hide');

            if (callbackOpcao2) {
                callbackOpcao2();
            }

            $('#modalSelecaoTripla #opcao1').off('click');
            $('#modalSelecaoTripla #opcao2').off('click');
            $('#modalSelecaoTripla #opcao3').off('click');
        }).text(opcao2);

        $('#modalSelecaoTripla #opcao3').on('click', function () {
            $('#modalSelecaoTripla').modal('hide');

            if (callbackOpcao3) {
                callbackOpcao3();
            }

            $('#modalSelecaoTripla #opcao1').off('click');
            $('#modalSelecaoTripla #opcao2').off('click');
            $('#modalSelecaoTripla #opcao3').off('click');
        }).text(opcao3);


        $('#modalSelecaoTripla').find('p').html(mensagem);
        $('#modalSelecaoTripla').modal('show');
    };

    $.fn.dialogo.selecionarUsuario = function (aoSelecionarUsuario) {
        aoSelecionarUsuarioResponsavel = aoSelecionarUsuario;
        $.dialogo.exibir(gafisa.alphabook.rotas.projeto.selecionarUsuariosResponsaveis, null, function () { listarUsuariosResponsaveis(); });
    };

    $.fn.dialogo.selecionarContato = function (parametros) {
        if (!parametros.tipo)
            parametros.tipo = 'contato';

        var aoSelecionar = parametros.aoSelecionar;
        parametros.aoSelecionar = null;

        $.dialogo.exibir(gafisa.alphabook.rotas.contatos.selecionarContato, parametros, function () {
            listarContatos(aoSelecionar, parametros.tipo);
        }, function () {
            if (parametros.tipo === 'contato')
                $('#tituloBuscaContato').show();
            else
                $('#tituloBuscaLocal').show();

            if ($.dialogo.NivelDialogo > 1)
                $('#voltarSelecaoContato').show();
            else
                $('#fecharSelecaoContato').show();

            $('#btnFiltroProjetosDepartamento').click(function () {
                listarContatos(aoSelecionar, parametros.tipo);
            });

            $('#termoBuscaSelecao').onPressEnter(function () { listarContatos(aoSelecionar, parametros.tipo) });

            $('.letrasSelecao .letra').click(function () { aoClicarLetra($(this), aoSelecionar, parametros.tipo); });

            $("#categoriasSelecao").jstree({
                "themes": {
                    "theme": "default",
                    "dots": true,
                    "icons": false
                },
                "plugins": ["themes", "checkbox", "html_data"]
            });

            $("#tipoCategoriaSelecao").click(function () {
                $(this).blur();
                $('#categoriasSelecao').toggle().css({
                    left: '70px',
                    top: '28px'
                });
            });

            $('#listaContatosSelecionar').livequery(function () { $('#listaContatosSelecionar').scroll(function () { aoRolarAteOFimContatos(aoSelecionar, parametros.tipo); }); });
        });
    };

    function aoRolarAteOFimContatos(aoSelecionar, tipo) {

        if ($('#listaContatosSelecionar').data('carregando') || $('#contatoConteudoDiv').data('fim')) return;

        if ($('#listaContatosSelecionar').scrollTop() + $('#listaContatosSelecionar').innerHeight() >= $('#listaContatosSelecionar')[0].scrollHeight) {
            $('#listaContatosSelecionar').data('carregando', true);

            var data = obterFiltros({ pagina: Math.ceil(($('.item-contatos').length / 6)) + 1, tipo: tipo });

            $.get(gafisa.alphabook.rotas.contatos.listarContatosSelecionar, data.model, function (html) {
                if (html.contains('msg-sem-retorno')) {
                    $('#listaContatosSelecionar').data('fim', true);
                } else {
                    $('#listaContatosSelecionar').append(html);
                    $('.selecionarContato').off('click');
                    $('.selecionarContato').click(function () {
                        $.dialogo.fechar(); aoSelecionar($(this).data('id'));
                    });
                    $('#listaContatosSelecionar').removeData('carregando');
                }
            }, 'html');
        }
    };

    function aoClicarLetra(letra, aoSelecionar, tipo) {
        if (!$(letra).hasClass('selecionada')) {
            $($('.letra.selecionada')[0]).removeClass('selecionada');
            $(letra).addClass('selecionada');
        }

        listarContatos(aoSelecionar, tipo);
    };

    function listarContatos(aoSelecionar, tipo) {

        var conteudo = $("#listaContatosSelecionar");

        conteudo.fadeOut('fast', function () {

            $("#listaContatosSelecionar").html('<div class="loading-circulo"></div>');

            conteudo.fadeIn('fast', function () {

                var data = obterFiltros({ tipo: tipo });

                $.get(gafisa.alphabook.rotas.contatos.listarContatosSelecionar, data.model, function (html) {
                    conteudo.fadeOut('fast', function () {
                        $("#listaContatosSelecionar").html(html);
                        $('.selecionarContato').off('click');
                        $('.selecionarContato').click(function () { $.dialogo.fechar(); aoSelecionar($(this).data('id')); });
                        conteudo.fadeIn();
                        $($('.letra.selecionada')[0]).removeClass('selecionada');
                    });

                }, 'html');
            });

        });
    };

    function obterFiltros(parametros) {

        var data = {};
        data.model = {};
        data.model.TiposContatosSelecionadas = [];

        var quantidadeChecados = $('.jstree-checked').length;
        var quantidadeChecadosPai = $('.jstree-undetermined').length;

        for (var i = 0; i < quantidadeChecadosPai; i++) {
            data.model.TiposContatosSelecionadas.push($('.jstree-undetermined')[i].id);
        }

        for (var j = 0; j < quantidadeChecados; j++) {
            data.model.TiposContatosSelecionadas.push($('.jstree-checked')[j].id);
        }

        data.model.IdProjeto = gafisa.alphabook.home.contatos.obterIdProjeto();

        if (!String.isNullOrEmpty($($('.letra.selecionada')[0]).text()))
            data.model.Letra = $($('.letra.selecionada')[0]).text();

        if (!String.isNullOrEmpty($("#termoBuscaSelecao").val()))
            data.model.TermoBusca = $("#termoBuscaSelecao").val();

        data.model.MeusProjetos = $('#meusProjetos').length == 1 ? !String.isNullOrEmpty($('#meusProjetos').attr("checked")) : null;
        data.model.ProjetosSeguidos = $('#projetosSeguidos').length == 1 ? !String.isNullOrEmpty($('#projetosSeguidos').attr("checked")) : null;
        data.model.TodosProjetos = $('#todoProjetos').length == 1 ? !String.isNullOrEmpty($('#todoProjetos').attr("checked")) : null;
        data.model.Pagina = parametros && parametros.pagina ? parametros.pagina : 1;
        data.model.TipoModal = parametros && parametros.tipo ? parametros.tipo : 'contato';

        return data;
    };

    function listarUsuariosResponsaveis() {
        $('#buscarNovoResponsavel').livequery('click', aoPesquisarUsuarioResponsavel);
        $('#campoNomeUsuario').onPressEnter(aoPesquisarUsuarioResponsavel);
        $('.box-scroll-resp').scroll(function () { aoRolarScrollUsuarioResposanvel($(this)); });

        $('.box-scroll-resp').fadeOut('fast', function () {
            $('#carregandoUsuariosResponsaveis').fadeIn('fast', function () {
                $.get(gafisa.alphabook.rotas.projeto.listarUsuariosResponsaveis, { numeroLinha: null, termo: $('#campoNomeUsuario').val() }, function (html) {
                    $('.box-scroll-resp').html(html);
                    $('#carregandoUsuariosResponsaveis').fadeOut('fast', function () {
                        $('.box-scroll-resp').fadeIn('fast', function () {
                            $('.box-sel-resp').off('click');
                            $('.box-sel-resp').click(function () { aoSelecionarUsuarioResponsavel($(this)); });
                        });
                    });
                }, "html");
            });
        });
    };

    function aoPesquisarUsuarioResponsavel() {
        if (String.isNullOrEmpty($('#campoNomeUsuario').val())) return;
        listarUsuariosResponsaveis();
    };

    function aoRolarScrollUsuarioResposanvel(conteudo) {
        conteudo = $(conteudo);

        if (conteudo.data('carregando') || conteudo.data('fim')) return;

        if (conteudo.scrollTop() + conteudo.innerHeight() >= conteudo[0].scrollHeight) {
            conteudo.data('carregando', true);
            $.get(gafisa.alphabook.rotas.projeto.listarUsuariosResponsaveis, { numeroLinha: $('.box-sel-resp').last().data('numerolinha'), termo: $('#campoNomeUsuario').val() }, function (html) {

                if (html.contains('msg-sem-retorno')) {
                    conteudo.data('fim', true);
                    conteudo.data('carregando', false);
                }
                else {
                    $('.box-scroll-resp').append(html);
                    $('.box-sel-resp').off('click');
                    $('.box-sel-resp').click(function () { aoSelecionarUsuarioResponsavel($(this)); });
                    conteudo.data('carregando', false);
                }
            }, "html");
        }
    };


})(jQuery);

$.dialogo = new Object();

$.dialogo.exibir = function (action, parametros, callback, antesConteudoSerExibido) {
    $.fn.dialogo.exibir(action, parametros, callback, antesConteudoSerExibido);
};

$.dialogo.atualizar = function (action, parametros, callback, antesConteudoSerExibido) {
    $.fn.dialogo.atualizar(action, parametros, callback, antesConteudoSerExibido);
};

$.dialogo.fechar = function (callback, naoVoltar) {
    $.fn.dialogo.fechar(callback, naoVoltar);
};
$.dialogo.voltar = function (callback) {
    $.fn.dialogo.voltar(callback);
};

$.dialogo.confirmar = function (mensagem, callbackSim, callbackNao, deveExecutarAntesFechar) {
    $.fn.dialogo.confirmar(mensagem, callbackSim, callbackNao, deveExecutarAntesFechar);
};

$.dialogo.questaoTripla = function (mensagem, opcao1, opcao2, opcao3, callbackOpcao1, callbackOpcao2, callbackOpcao3) {
    $.fn.dialogo.questaoTripla(mensagem, opcao1, opcao2, opcao3, callbackOpcao1, callbackOpcao2, callbackOpcao3);
};

$.dialogo.NivelDialogo = function () {
    return $.fn.obterNivelDialogo();
};

$.dialogo.selecionarUsuario = function (aoSelecionarUsuario) {
    $.fn.dialogo.selecionarUsuario(aoSelecionarUsuario);
};

$.dialogo.selecionarContato = function (parametros) {
    $.fn.dialogo.selecionarContato(parametros);
};