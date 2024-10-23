if (typeof gafisa.alphabook.admin.perfilAcesso == 'undefined') { gafisa.alphabook.admin.perfilAcesso = new Object(); }

gafisa.alphabook.admin.perfilAcesso.manter = {
    ultimoFiltro: {},
    devePesquisarAposSalvar: false,
    estaSalvando: false,

    inicializar: function () {
        gafisa.alphabook.admin.perfilAcesso.manter.registrarAcoes();
    },
    registrarAcoes: function () {
        $('#ir').on('click', gafisa.alphabook.admin.perfilAcesso.manter.aoClicarIr);
        $('#tabelaPerfilAcesso input[type="checkbox"]').livequery('click', gafisa.alphabook.admin.perfilAcesso.manter.aoAlterarPermissao);
        $('#salvar').on('click', gafisa.alphabook.admin.perfilAcesso.manter.aoSalvar);
        $('#cancelar').on('click', gafisa.alphabook.admin.perfilAcesso.manter.aoCancelar);
        $(window).bind('beforeunload', gafisa.alphabook.admin.perfilAcesso.manter.antesDeSairTela);
        $("#secao").change(function () { gafisa.alphabook.admin.perfilAcesso.manter.aoSelecionarSecao(this); });
    },

    antesDeSairTela: function () {
        if ($('#acaoes').is(":visible") && !gafisa.alphabook.admin.perfilAcesso.manter.estaSalvando)
            return gafisa.mensagens.comum.aoSairTodosAsAlteracoesNaoSalvasSeraoPerdidas;
    },

    aoSelecionarSecao: function (dropDownSecao) {
        var ehAreaAdministrativa = ($(dropDownSecao).val() == 4);

        var html = ('<input type="checkbox" class="checkbox" id="administrador" name="Administrador"' + (ehAreaAdministrativa ? 'checked="checked" disabled="disabled"' : '') + '>');

        $('#administrador').remove();
        $('#labelAdministrador').after(html);
    },

    aoClicarIr: function () {
        if ($('#acaoes').is(":visible")) {
            $.dialogo.questaoTripla(gafisa.mensagens.comum.desejaSalvarAsAlteracoes, "Cancelar", "Não Salvar", "Salvar", function () { $('#modalSelecaoTripla').modal('hide'); }, gafisa.alphabook.admin.perfilAcesso.manter.ir, function () {
                gafisa.alphabook.admin.perfilAcesso.manter.salvar();
                gafisa.alphabook.admin.perfilAcesso.manter.devePesquisarAposSalvar = true;
            });
        } else
            gafisa.alphabook.admin.perfilAcesso.manter.ir();
    },

    aoCancelar: function () {
        $('#acaoes').fadeOut('fast', function () {
            $('#tabelaPerfilAcesso').tabela({ acao: "carregar", parametros: gafisa.alphabook.admin.perfilAcesso.manter.ultimoFiltro });
        });
    },

    aoSalvar: function () {
        gafisa.alphabook.admin.perfilAcesso.manter.estaSalvando = true;
        gafisa.alphabook.admin.perfilAcesso.manter.salvar();
    },

    salvar: function () {
        $.loading({ action: 'hide' });
        $('#acaoes').fadeOut();

        var autorizacoes = new Array();

        $.each($('tbody tr'), function () {
            var autorizacao = {};
            autorizacao.Acao = gafisa.alphabook.admin.perfilAcesso.manter.ultimoFiltro.Acao;
            autorizacao.Secao = gafisa.alphabook.admin.perfilAcesso.manter.ultimoFiltro.Secao;
            autorizacao.Administrador = gafisa.alphabook.admin.perfilAcesso.manter.ultimoFiltro.Administrador;

            var perfisAlterados = $(this).find('[data-alterado="true"]');
            if (perfisAlterados == null || perfisAlterados['length'] == 0)
                return true;

            autorizacao.Funcionalidade = $(this).data('id').toString();
            autorizacao.Perfis = new Array();
            $.each(perfisAlterados, function () {
                autorizacao.Perfis.push({ Id: $(this).val(), Autorizado: $(this).checked() });
            });

            autorizacoes.push(autorizacao);
        });

        $.ajax({
            url: gafisa.alphabook.rotas.admin.salvarPerfisAcesso,
            type: "POST",
            data: JSON.stringify(autorizacoes),
            cache: false,
            contentType: 'application/json',
            success: gafisa.alphabook.admin.perfilAcesso.manter.aposSalvar
        });
    },

    aposSalvar: function (json) {
        $.loading({ action: 'hide' });

        if (json.sucesso) {

            gafisa.alphabook.mensagens.exibirMensagemConfirmacao(gafisa.mensagens.comum.salvosComSucesso.format('Perfis de acesso'));

            if (gafisa.alphabook.admin.perfilAcesso.manter.devePesquisarAposSalvar) {
                gafisa.alphabook.admin.perfilAcesso.manter.ir();
                gafisa.alphabook.admin.perfilAcesso.manter.devePesquisarAposSalvar = false;
            } else {
                $('#tabelaPerfilAcesso').tabela({ acao: "carregar", parametros: gafisa.alphabook.admin.perfilAcesso.manter.ultimoFiltro });
            }

        } else {
            gafisa.alphabook.mensagens.exibirMensagemErro(json.erros);
        }

        gafisa.alphabook.admin.perfilAcesso.manter.estaSalvando = false;
    },

    ir: function () {
        $('#acaoes').fadeOut();
        if (!gafisa.alphabook.admin.perfilAcesso.manter.validarParametros()) return false;
        gafisa.alphabook.admin.perfilAcesso.manter.listar();
    },

    validarParametros: function () {
        if (String.isNullOrEmpty($('#departamento').val())) {
            $('#departamento').focus();
            gafisa.alphabook.mensagens.exibirMensagemErro(gafisa.mensagens.comum.deveSerSelecionado.format('Departamento'));
            return false;
        }

        if (String.isNullOrEmpty($('#acao').val())) {
            $('#acao').focus();
            gafisa.alphabook.mensagens.exibirMensagemErro(gafisa.mensagens.comum.deveSerSelecionado.format('Ação'));
            return false;
        }

        if (String.isNullOrEmpty($('#secao').val())) {
            $('#secao').focus();
            gafisa.alphabook.mensagens.exibirMensagemErro(gafisa.mensagens.comum.deveSerSelecionado.format('Seção'));
            return false;
        }

        return true;
    },

    listar: function () {
        $('#nenhumaInformacaoSeleciona').fadeOut('fast');
        var data = $('#filtros').formToJSON();
        data.tamanhoPagina = 20;

        gafisa.alphabook.admin.perfilAcesso.manter.ultimoFiltro = data;

        $('#tabelaPerfilAcesso').tabela({ action: gafisa.alphabook.rotas.admin.listarPerfisAcesso, parametros: data, tamanhoPagina: 20 });
    },

    aoAlterarPermissao: function () {
        var aces = $('#acaoes');
        if (gafisa.alphabook.admin.perfilAcesso.manter.existeItemAlterado())
            aces.fadeIn();
        else
            aces.fadeOut();
    },

    existeItemAlterado: function () {

        var existeItemAlterado = false;

        var checkBox = $('#tabelaPerfilAcesso input[type="checkbox"]');
        $.each(checkBox, function () {
            var valorAtual = $(this).checked() ? "1" : "0";
            var itemAlterado = (valorAtual != $(this).data('valororiginal'));
            $(this).attr('data-alterado', itemAlterado);
            if (itemAlterado)
                existeItemAlterado = true;
        });

        return existeItemAlterado;
    }
};

$(document).ready(gafisa.alphabook.admin.perfilAcesso.manter.inicializar);