if (typeof gafisa.alphabook.admin.cidade == 'undefined') { gafisa.alphabook.admin.cidade = new Object(); }

gafisa.alphabook.admin.cidade.pesquisa = {
    registrarAcoes: function () {
        $('.letra').on('click', gafisa.alphabook.admin.cidade.pesquisa.aoSelecionarLetra);
        $('#buscar').on('click', gafisa.alphabook.admin.cidade.pesquisa.aoPressionarBuscar);
        $('.ico-post-excluir').livequery('click', gafisa.alphabook.admin.cidade.pesquisa.aoExcluir);
    },

    aoSelecionarLetra: function () {
        var itemEstaSelecionado = $(this).hasClass('selecionada');

        $('.letra.selecionada').removeClass('selecionada');

        if (!itemEstaSelecionado)
            $(this).addClass('selecionada');
    },

    aoPressionarBuscar: function () {
        $('#nenhumaInformacaoSelecionada').fadeOut();

        var data = {};
        data.Estados = $('#Estado').val();
        data.Termo = $('#termo').val();
        data.TamanhoPagina = 20;

        if ($('.letra.selecionada').length == 1)
            data.Letra = $('.letra.selecionada').html();

        $('#tabela').tabela({ action: gafisa.alphabook.rotas.admin.listarCidades, parametros: data, tamanhoPagina: 20 });
    },

    aoExcluir: function () {
        var idCidade = $(this).data('id');
        $.dialogo.confirmar(gafisa.mensagens.comum.temCertezaAoExcluirEssa.format('cidade'), function () { gafisa.alphabook.admin.cidade.pesquisa.aoConfirmarExclusao(idCidade); }, gafisa.alphabook.admin.cidade.pesquisa.aoCancelarExclusao);
    },

    aoConfirmarExclusao: function (idCidade) {
        $.post(gafisa.alphabook.rotas.admin.excluirCidade, { idCidade: idCidade }, gafisa.alphabook.admin.cidade.pesquisa.aposExcluirCidade, 'json');
    },

    aposExcluirCidade: function (json) {
        if (json.sucesso) {
            gafisa.alphabook.mensagens.exibirMensagemConfirmacao(gafisa.mensagens.comum.excluidaComSucesso.format('Cidade'));
            $('#tabela').tabela({ acao: "carregar" });
        } else {
            gafisa.alphabook.mensagens.exibirMensagemErro(json.erros != null ? json.erros[0] : json.erro);
        }
    },

    aoCancelarExclusao: function () {
    }
};

$(document).ready(gafisa.alphabook.admin.cidade.pesquisa.registrarAcoes);