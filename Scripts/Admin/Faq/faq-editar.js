if (typeof gafisa.alphabook.admin.faq == 'undefined') { gafisa.alphabook.admin.faq = new Object(); }

gafisa.alphabook.admin.faq.editar = {
    inicializar: function () {
        gafisa.alphabook.admin.faq.editar.registrarAcoes();
    },

    registrarAcoes: function() {
        $('#salvar').livequery('click', gafisa.alphabook.admin.faq.editar.aoSalvar);
    },

    aoSalvar: function () {
        $.loading({ action: 'show' });
        var url = gafisa.alphabook.rotas.admin.salvarFaq;
        var parametros = $('#form').formToJSON();
        $.post(url, parametros, gafisa.alphabook.admin.faq.editar.aposSalvar, 'json');   
    },

    aposSalvar: function (json) {
        if (json.sucesso) {
            gafisa.alphabook.mensagens.exibirMensagemConfirmacao(gafisa.mensagens.comum.salvoComSucesso.format('Faq'), function () {
                $.loading({ action: 'hide' });
                history.back();
            });
        }
        else {
            $.loading({ action: 'hide' });
            gafisa.alphabook.mensagens.exibirMensagemErro(json.erros);
        }
    }
};

$(document).ready(gafisa.alphabook.admin.faq.editar.inicializar);
