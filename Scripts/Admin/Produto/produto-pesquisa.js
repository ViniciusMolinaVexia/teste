if (typeof gafisa.alphabook.admin.produto == 'undefined') { gafisa.alphabook.admin.produto = new Object(); }

var tamanhoPagina = 20;

gafisa.alphabook.admin.produto.pesquisa = {
    parametros: { tamanhoPagina: tamanhoPagina },
    botaoExcluir: null,

    inicializar: function () {
        gafisa.alphabook.admin.produto.pesquisa.registrarAcoes();
        gafisa.alphabook.admin.produto.pesquisa.listar();
    },

    registrarAcoes: function () {
        $('#buscar').livequery('click', gafisa.alphabook.admin.produto.pesquisa.listar);
        $('.ic-excluir').livequery('click', gafisa.alphabook.admin.produto.pesquisa.aoExcluir);
    },

    listar: function () {
        $('#tabela').tabela({ action: gafisa.alphabook.rotas.admin.listarProdutos, parametros: gafisa.alphabook.admin.produto.pesquisa.parametros, tamanhoPagina: tamanhoPagina });
    },

    aoExcluir: function () {
        gafisa.alphabook.admin.produto.pesquisa.botaoExcluir = $(this);
        gafisa.alphabook.admin.produto.pesquisa.parametros = { id: $(this).data('id') };
        $.dialogo.confirmar(gafisa.mensagens.comum.temCertezaAoExcluirEsse.format('Produto'), gafisa.alphabook.admin.produto.pesquisa.excluir, null, true);
    },

    excluir: function () {
        $.loading({ action: 'show' });
        var url = gafisa.alphabook.rotas.admin.excluirProduto;
        $.post(url, gafisa.alphabook.admin.produto.pesquisa.parametros, gafisa.alphabook.admin.produto.pesquisa.aposExcluir, 'json');
    },

    aposExcluir: function (json) {
        if (json.sucesso) {
            gafisa.alphabook.mensagens.exibirMensagemConfirmacao(gafisa.mensagens.comum.excluidoComSucesso.format('Produto'));
            gafisa.alphabook.admin.produto.pesquisa.limparParametros();
            gafisa.alphabook.admin.produto.pesquisa.listar(gafisa.alphabook.admin.produto.pesquisa.parametros);
        }
        else
            gafisa.alphabook.mensagens.exibirMensagemErro(json.erros);

        $.loading({ action: 'hide' });
    },

    limparParametros: function () {
        gafisa.alphabook.admin.produto.pesquisa.botaoExcluir = null;
        gafisa.alphabook.admin.produto.pesquisa.parametros = {};
        gafisa.alphabook.admin.produto.pesquisa.parametros.tamanhoPagina = tamanhoPagina;
    }
};

$(document).ready(gafisa.alphabook.admin.produto.pesquisa.inicializar);
