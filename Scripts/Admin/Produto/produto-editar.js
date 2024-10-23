if (typeof gafisa.alphabook.admin.produto == 'undefined') { gafisa.alphabook.admin.produto = new Object(); }

gafisa.alphabook.admin.produto.editar = {
    inicializar: function () {
        gafisa.alphabook.admin.produto.editar.registrarAcoes();
    },

    registrarAcoes: function () {
        $('#salvar').livequery('click', gafisa.alphabook.admin.produto.editar.aoSalvar);
    },

    aoSalvar: function () {
        $.loading({ action: 'show' });
        var url = gafisa.alphabook.rotas.admin.salvarProduto;
        var parametros = $('#form').formToJSON();
        $.post(url, parametros, gafisa.alphabook.admin.produto.editar.aposSalvar, 'json');
    },

    aposSalvar: function (json) {
        if (json.sucesso) {            
            gafisa.alphabook.mensagens.exibirMensagemConfirmacao(gafisa.mensagens.comum.salvoComSucesso.format('Produto'), function() {
                $.loading({ action: 'hide' });
                history.back();
            });
        } else {
            $.loading({ action: 'hide' });
            gafisa.alphabook.mensagens.exibirMensagemErro(json.erros);
        }
    }
};

$(document).ready(gafisa.alphabook.admin.produto.editar.inicializar);
