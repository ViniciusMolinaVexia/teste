if (typeof gafisa == 'undefined') { gafisa = new Object(); }
if (typeof gafisa.alphabook == 'undefined') { gafisa.alphabook = new Object(); }

gafisa.alphabook.mensagens = {
    registrar: function () {
        gafisa.alphabook.mensagens.registrarAcoes();
    },

    registrarAcoes: function () {
        $(".bt-msg-fechar").click(gafisa.alphabook.mensagens.aoFecharMensagemAviso);
        $(".bt-msg-fechar-erro").click(gafisa.alphabook.mensagens.aoFecharMensagemErrro);
    },

    exibirMensagemConfirmacao: function (mensagem, callback) {
        $(".msg-confirmacao p").html(mensagem);
        $(".bt-msg-fechar").off('click');
        if (callback) {
            $(".bt-msg-fechar").livequery('click', callback);
        }
        $(".bt-msg-fechar").click(gafisa.alphabook.mensagens.aoFecharMensagemAviso);
        $(".box-confirmacao").show("blind");
    },

    aoFecharMensagemAviso: function () {
        $(".box-confirmacao").hide("blind");
    },

    exibirMensagemErro: function (mensagem) {
        if (mensagem instanceof Array) {
            var msgs = '';
            for (var i = 0; i < mensagem.length; i++)
                msgs += (msgs == '' ? '' : '<br/>') + mensagem[i];

            mensagem = msgs;
        }

        $(".msg-erro p").html(mensagem);
        $(".box-erro").show("blind");
    },

    aoFecharMensagemErrro: function () {
        $(".box-erro").hide("blind");
    },

    exibirMensagemAlerta: function (mensagem) {
        $(".msg-alerta p").html(mensagem);
        $(".box-alerta").show("blind");

        setTimeout(gafisa.alphabook.mensagens.aoFecharMensagemAlerta, gafisa.alphabook.padroes.tempoMensagens.aviso);
    },

    aoFecharMensagemAlerta: function () {
        $(".box-alerta").hide("blind");
    }
};

$(document).ready(gafisa.alphabook.mensagens.registrar);