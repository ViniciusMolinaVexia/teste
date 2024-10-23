if (typeof gafisa.alphabook.admin.uso == 'undefined') { gafisa.alphabook.admin.uso = new Object(); }

gafisa.alphabook.admin.uso.editar = {
    inicializar: function () {
        gafisa.alphabook.admin.uso.editar.registrarAcoes();
    },

    registrarAcoes: function () {
        $('#salvar').livequery('click', gafisa.alphabook.admin.uso.editar.aoSalvar);
    },

    aoSalvar: function () {
        $.loading({ action: 'show' });
        var url = gafisa.alphabook.rotas.admin.salvarUso;
        var parametros = $('#form').formToJSON();
        $.post(url, parametros, gafisa.alphabook.admin.uso.editar.aposSalvar, 'json');
    },

    aposSalvar: function (json) {
        if (json.sucesso) {            
            gafisa.alphabook.mensagens.exibirMensagemConfirmacao(gafisa.mensagens.comum.salvoComSucesso.format('Uso'), function() {
                $.loading({ action: 'hide' });
                history.back();
            });
        } else {
            $.loading({ action: 'hide' });
            gafisa.alphabook.mensagens.exibirMensagemErro(json.erros);
        }
    }
};

$(document).ready(gafisa.alphabook.admin.uso.editar.inicializar);
