if (typeof gafisa.alphabook.admin == 'undefined') { gafisa.alphabook.admin = new Object(); }
if (typeof gafisa.alphabook.admin.email == 'undefined') { gafisa.alphabook.admin.email = new Object(); }

gafisa.alphabook.admin.email.editar = {
    inicializar: function () {
        gafisa.alphabook.admin.email.editar.registrarAcoes();
    },

    registrarAcoes: function () {
        $('#salvar').livequery('click', gafisa.alphabook.admin.email.editar.aoSalvar);
    },

    aoSalvar: function () {
        $.loading({ action: 'show' });
        var url = gafisa.alphabook.rotas.admin.salvarEmail;
        var parametros = $('#form').formToJSON();
        $.post(url, parametros, gafisa.alphabook.admin.email.editar.aposSalvar, 'json');
    },

    aposSalvar: function (json) {
        if (json.sucesso) {

            gafisa.alphabook.mensagens.exibirMensagemConfirmacao(gafisa.mensagens.comum.salvoComSucesso.format('Email'), function() {
                $.loading({ action: 'hide' });
                history.back();
            });
        } else {
            gafisa.alphabook.mensagens.exibirMensagemErro(json.erros);
            $.loading({ action: 'hide' });
        }        
    }
};

$(document).ready(gafisa.alphabook.admin.email.editar.inicializar);
