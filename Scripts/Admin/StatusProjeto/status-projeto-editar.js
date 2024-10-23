if (typeof gafisa.alphabook.admin.status == 'undefined') { gafisa.alphabook.admin.status = new Object(); }
if (typeof gafisa.alphabook.admin.status.projeto == 'undefined') { gafisa.alphabook.admin.status.projeto = new Object(); }

gafisa.alphabook.admin.status.projeto.editar = {
    inicializar: function () {
        gafisa.alphabook.admin.status.projeto.editar.registrarAcoes();
    },

    registrarAcoes: function () {
        $('#salvar').livequery('click', gafisa.alphabook.admin.status.projeto.editar.dialogoFlagInicial);
    },

    dialogoFlagInicial: function () {
        if ($('#Inicial').checked())
            $.dialogo.confirmar(gafisa.mensagens.status.inicial, function () { gafisa.alphabook.admin.status.projeto.editar.aoSalvar() }, null, true);
        else
            gafisa.alphabook.admin.status.projeto.editar.aoSalvar();
    },

    aoSalvar: function () {
        $.loading({ action: 'show' });
        var url = gafisa.alphabook.rotas.admin.salvarStatusProjeto;
        var parametros = $('#form').formToJSON();
        $.post(url, parametros, gafisa.alphabook.admin.status.projeto.editar.aposSalvar, 'json');
    },

    aposSalvar: function (json) {
        if (json.sucesso) {
            gafisa.alphabook.mensagens.exibirMensagemConfirmacao(gafisa.mensagens.comum.salvoComSucesso.format('Status'), function () {
                $.loading({ action: 'hide' });
                history.back();
            });
        } else {
            $.loading({ action: 'hide' });
            gafisa.alphabook.mensagens.exibirMensagemErro(json.erros);                
        }        
    }
};

$(document).ready(gafisa.alphabook.admin.status.projeto.editar.inicializar);
