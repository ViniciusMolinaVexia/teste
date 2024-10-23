if (typeof gafisa.alphabook.home == 'undefined') { gafisa.alphabook.home = new Object(); }

gafisa.alphabook.home.projetosRecebidos = {
    inicializar: function () {
        gafisa.alphabook.home.projetosRecebidos.registrarAcoes();
    },

    registrarAcoes: function () {
        $('#tileProjetosRecebidos').livequery('click', gafisa.alphabook.home.projetosRecebidos.aoClicarTile);
        $('.contatoPrincipal').livequery('click', gafisa.alphabook.home.projetosRecebidos.aoClicarNoContato);
        $('.atribuirProjeto').livequery('click', gafisa.alphabook.home.projetosRecebidos.aoAtribuirResponsavelProjeto);
        $('a.btnFiltroProjetosRecebidos').livequery('click', gafisa.alphabook.home.projetosRecebidos.aoFiltrarProjetosRecebidos);
        $('input.filtroCarrousselProjetosRecebidos').onPressEnter(gafisa.alphabook.home.projetosRecebidos.aoFiltrarProjetosRecebidos);
        $('#Estado').livequery('click', gafisa.alphabook.home.projetosRecebidos.aoSelecionarEstado);
        $('tr td a.lnkProjetoRecebido').livequery('click', gafisa.alphabook.home.projetosRecebidos.aoClicarNoCodigoDoProjeto);
        $('#chkFiltrosProjetosRecebidos').livequery('click', gafisa.alphabook.home.projetosRecebidos.aoClicarCheckFiltros);
        $('.box-tabela .inner').livequery(gafisa.alphabook.home.projetosRecebidos.aoScrollarTabela);
    },

    aoScrollarTabela: function () {
        $(this).scroll(gafisa.alphabook.home.projetosRecebidos.aoClicarForaDoToolTip);
    },

    aoClicarTile: function () {
        
        if (!$(this).hasClass('inativo'))
            $.navegar.proximo(gafisa.alphabook.rotas.projetosRecebidos.projetosRecebidos, null, gafisa.alphabook.home.projetosRecebidos.aoExibirTela);
    },

    aoExibirTela: function () {
        $('#chkFiltrosProjetosRecebidos').attr('checked', 'checked');
        $('.projetos-recebidos #Estado').multiselect('option', 'noneSelectedText', 'UF');
        $('.projetos-recebidos #Status').multiselect('option', 'noneSelectedText', 'Status');

        var data = gafisa.alphabook.home.projetosRecebidos.retornarFiltros();
        $('#tabelaProjetosRecebidos').tabela({ action: gafisa.alphabook.rotas.projetosRecebidos.listarProjetosRecebidos, parametros: data, tamanhoPagina: 20, callback: $.navegar.ajustarRodape });
        gafisa.alphabook.home.projetosRecebidos.limparFiltros();

        $('.contatoPrincipalToolTipProjetosRecebidos', '.projetosRecebidos')
            .hide()
            .data('fechado', true)
            .clickOutSide(gafisa.alphabook.home.projetosRecebidos.aoClicarForaDoToolTip);
        gafisa.alphabook.home.projetosRecebidos.configurarAutocompleteCidade();
    },

    aoClicarNoContato: function (e) {
        e.preventDefault();
        var $contatoToolTip = $('.contatoPrincipalToolTipProjetosRecebidos', '.projetosRecebidos'),
            alturaBotaoClicado = $(this).offset().top;

        if ($contatoToolTip.data('fechado')) {
            var projetoId = $(this).parent().parent().data('id');
            $.get(gafisa.alphabook.rotas.projetosRecebidos.obterContatoPrincipalProjeto, { projetoId: projetoId }, function (html) {
                if (String.isNullOrEmpty(html)) {
                    gafisa.alphabook.mensagens.exibirMensagemErro(gafisa.mensagens.comum.nenhumContatoAssociadoAoProjeto);
                } else {
                    $contatoToolTip.html(html).fadeIn('fast');
                    $contatoToolTip.data('fechado', false);
                    $contatoToolTip.offset({ top: alturaBotaoClicado - 36, left: $contatoToolTip.offset().left });

                }
            }, "html");
        }
        else {
            $contatoToolTip.fadeOut('fast');
            $contatoToolTip.data('fechado', true);
        }
    },

    aoAtribuirResponsavelProjeto: function () {
        $('#tabelaProjetosRecebidos tbody tr').removeClass('selecionado');
        $(this).parent().parent().addClass('selecionado');
        $.dialogo.selecionarUsuario(gafisa.alphabook.home.projetosRecebidos.aoSelecionarUsuarioResponsavel);
    },

    aoSelecionarUsuarioResponsavel: function (usuario) {
        var idUsuario = $(usuario).data('id');
        var idProjeto = $('#tabelaProjetosRecebidos tbody tr.selecionado').data('id');
        $.dialogo.fechar(function () {
            $.dialogo.confirmar(gafisa.mensagens.projetosrecebidos.oUsuarioResponsavelSeraNotificado, function () { gafisa.alphabook.home.projetosRecebidos.aoConfirmarAtribuicaoResponsavel(idProjeto, idUsuario); }, gafisa.alphabook.home.projetosRecebidos.aoAtribuirResponsavelProjeto);
        });
    },

    aoConfirmarAtribuicaoResponsavel: function (idProjeto, idUsuario) {
        $.loading({ action: 'show' });
        $.post(gafisa.alphabook.rotas.projetosRecebidos.atribuirProjetoAUsuario, { idProjeto: idProjeto, idUsuario: idUsuario }, function (json) { gafisa.alphabook.home.projetosRecebidos.aposAtribuirResponsavelProjeto(json, idProjeto, idUsuario); });
    },

    aposAtribuirResponsavelProjeto: function (retorno, idProjeto, idUsuario) {
        if (retorno.sucesso) {
            gafisa.alphabook.mensagens.exibirMensagemConfirmacao(gafisa.mensagens.projetosrecebidos.usuarioAtribuidoComSucesso);
            gafisa.alphabook.home.projetosRecebidos.aoExibirTela();
            $.loading({ action: 'hide' });
        }
        else {
            gafisa.alphabook.mensagens.exibirMensagemErro(gafisa.mensagens.projetosrecebidos.falhaAoAtribuirUsuario);
            $.loading({ action: 'hide' });
        }
    },

    aoClicarForaDoToolTip: function () {
        gafisa.alphabook.home.projetosRecebidos.fecharToolTip();
    },

    fecharToolTip: function () {
        $('.contatoPrincipalToolTipProjetosRecebidos', '.projetosRecebidos')
            .data('fechado', true)
            .fadeOut('fast');
    },

    aoFiltrarProjetosRecebidos: function () {
        var data = gafisa.alphabook.home.projetosRecebidos.retornarFiltros();
        $('#tabelaProjetosRecebidos').tabela({ acao: 'carregar', parametros: data });
    },

    retornarFiltros: function () {
        var data = {};

        data.ordenacao = 1;
        data.tipo = 1;
        data.idUltimo = null;
        data.idStatus = $('#Status').val() != "" ? $('#Status').val() : null;
        data.termoBusca = $('input.filtroCarrousselProjetosRecebidos').val() != "" ? $('input.filtroCarrousselProjetosRecebidos').val() : null;
        data.cidade = $('input.cidadeProjetosRecebidos').val() != "" ? $('input.cidadeProjetosRecebidos').val() : null;
        data.estados = $('#Estado').val() != "" ? $('#Estado').val() : null;
        data.cidadeAlvo = $('input#cidadeAlvoProjetosRecebidos.checkbox').is(':checked');
        data.tamanhoPagina = 20;

        return data;
    },

    aoSelecionarEstado: function () {
        $('input.cidadeProjetosRecebidos').val('');
        gafisa.alphabook.home.projetosRecebidos.configurarAutocompleteCidade();
    },

    configurarAutocompleteCidade: function () {
        if ($("#Estado").val() == "") {
            gafisa.alphabook.home.projetosRecebidos.desabilitarCampoCidade(true);
            return;
        }

        gafisa.alphabook.home.projetosRecebidos.desabilitarCampoCidade(false);

        $('input.cidadeProjetosRecebidos').autocomplete({
            open: function () {
                setTimeout(function () {
                    $('.ui-autocomplete').css('z-index', 289);
                }, 0);
            },
            source: gafisa.alphabook.home.projetosRecebidos.carregarDadosAutocomplete,
            minLength: 2,
            select: function (event, ui) {
                $('input.cidadeProjetosRecebidos').data('data-id', ui.item.Id);
            }
        });
    },

    desabilitarCampoCidade: function (bool) {
        var $cidade = $('input.cidadeProjetosRecebidos').disable(bool);
        if (bool)
            $cidade.val('');
    },

    carregarDadosAutocomplete: function (request, response) {
        $.ajax({
            url: gafisa.alphabook.rotas.contatos.listarCidadesAutocomplete,
            type: "POST",
            dataType: "json",
            data: { chave: $('input.cidadeProjetosRecebidos').val(), uf: $("#Estado").val() },
            success: function (data) {
                response($.map(data, function (item) {
                    return { label: item.value, value: item.value, Id: item.key };
                }));
            }
        });
    },

    aoClicarNoCodigoDoProjeto: function () {
        var id = $(this).data('id');
        window.location.href = gafisa.alphabook.rotas.home.index + 'Home/Index/' + id;
    },

    aoClicarCheckFiltros: function () {
        var $chk = $(this);
        if ($chk.is(':checked')) {
            gafisa.alphabook.home.projetosRecebidos.limparFiltros();
            var data = gafisa.alphabook.home.projetosRecebidos.retornarFiltros();
            $('#tabelaProjetosRecebidos').tabela({ acao: 'carregar', parametros: data });
        }
        else {
            gafisa.alphabook.home.projetosRecebidos.habilitarFiltros();
        }
    },

    limparFiltros: function () {
        $('input.filtroCarrousselProjetosRecebidos').val('').attr('disabled', 'disabled');
        $('input.cidadeProjetosRecebidos').val('').attr('disabled', 'disabled');
        $('input#cidadeAlvoProjetosRecebidos.checkbox').removeAttr('checked').attr('disabled', 'disabled');

        $('#Status')
            .val('')
            .setState('disable');
        $('#Status')
            .parent()
            .find('span')
            .filter(':last')
            .text('Status');

        $('#Estado')
            .val('')
            .setState('disable');
        $('#Estado')
            .parent()
            .find('span')
            .filter(':last')
            .text('UF');
    },

    habilitarFiltros: function () {
        $('input.filtroCarrousselProjetosRecebidos').removeAttr('disabled');
        $('input.cidadeProjetosRecebidos').removeAttr('disabled');
        $('input#cidadeAlvoProjetosRecebidos.checkbox').removeAttr('disabled');

        $('#Status').setState('enable');
        $('#Estado').setState('enable');
    }
};

$(document).ready(gafisa.alphabook.home.projetosRecebidos.inicializar);
