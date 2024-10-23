if (typeof gafisa.alphabook.admin.categoriaContato == 'undefined') { gafisa.alphabook.admin.categoriaContato = new Object(); }

gafisa.alphabook.admin.categoriaContato.pesquisa = {
    registrarAcoes: function () {
        $('#buscar').on('click', gafisa.alphabook.admin.categoriaContato.pesquisa.aoPressionarBuscar);
        $('.ico-post-excluir').livequery('click', gafisa.alphabook.admin.categoriaContato.pesquisa.aoExcluir);

        gafisa.alphabook.admin.categoriaContato.pesquisa.aoAbrirATela();
    },

    aoAbrirATela: function () {
        gafisa.alphabook.admin.categoriaContato.pesquisa.aoPressionarBuscar();
    },

    aoPressionarBuscar: function () {
        $('#nenhumaInformacaoSelecionada').fadeOut();

        var data = {};
        data.Termo = $('#termo').val();
        data.TamanhoPagina = 20;

        $('#tabela').tabela({ action: gafisa.alphabook.rotas.admin.listarCategoriaContato, parametros: data, tamanhoPagina: 20 });
    },

    aoExcluir: function () {
        var idCidade = $(this).data('id');
        $.dialogo.confirmar(gafisa.mensagens.comum.temCertezaAoExcluirEssa.format('categoria de contato'), function () { gafisa.alphabook.admin.categoriaContato.pesquisa.aoConfirmarExclusao(idCidade); }, gafisa.alphabook.admin.categoriaContato.pesquisa.aoCancelarExclusao);
    },

    aoConfirmarExclusao: function (idCategoriaContato) {
        $.post(gafisa.alphabook.rotas.admin.excluirCategoriaContato, { id: idCategoriaContato }, gafisa.alphabook.admin.categoriaContato.pesquisa.aposExcluirCidade, 'json');
    },

    aposExcluirCidade: function (json) {
        if (json.sucesso) {
            gafisa.alphabook.mensagens.exibirMensagemConfirmacao(gafisa.mensagens.comum.excluidaComSucesso.format('Categoria de contato'));
            $('#tabela').tabela({ acao: "carregar" });
        } else {
            gafisa.alphabook.mensagens.exibirMensagemErro(json.erros != null ? json.erros[0] : json.erro);
        }
    },

    aoCancelarExclusao: function () {
    }
};

$(document).ready(gafisa.alphabook.admin.categoriaContato.pesquisa.registrarAcoes);