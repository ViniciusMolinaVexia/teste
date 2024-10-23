if (typeof gafisa.alphabook.admin.status == 'undefined') { gafisa.alphabook.admin.status = new Object(); }
if (typeof gafisa.alphabook.admin.status.protocolo == 'undefined') { gafisa.alphabook.admin.status.protocolo = new Object(); }

gafisa.alphabook.admin.status.protocolo.editar = {
    inicializar: function () {
        gafisa.alphabook.admin.status.protocolo.editar.registrarAcoes();
    },

    registrarAcoes: function () {
        $('#salvar').livequery('click', gafisa.alphabook.admin.status.protocolo.editar.aoSalvar);
    },

    aoSalvar: function () {
        $.loading({ action: 'show' });
        var url = gafisa.alphabook.rotas.admin.salvarStatusProtocolo;
        var parametros = $('#form').formToJSON();
        $.post(url, parametros, gafisa.alphabook.admin.status.protocolo.editar.aposSalvar, 'json');
    },

    aposSalvar: function (json) {
        if (json.sucesso) {            
            gafisa.alphabook.mensagens.exibirMensagemConfirmacao(gafisa.mensagens.comum.salvoComSucesso.format('Status'), function() {
                $.loading({ action: 'hide' });
                history.back();
            });
        } else {
            $.loading({ action: 'hide' });
            gafisa.alphabook.mensagens.exibirMensagemErro(json.erros);
        }
    }
};

$(document).ready(gafisa.alphabook.admin.status.protocolo.editar.inicializar);
