if (typeof gafisa.alphabook.admin.faq == 'undefined') { gafisa.alphabook.admin.faq = new Object(); }

gafisa.alphabook.admin.faq.pesquisa = {
    parametros: {},
    botaoExcluir: null,
    modoPesquisa: false,

    inicializar: function () {
        gafisa.alphabook.admin.faq.pesquisa.registrarAcoes();
        gafisa.alphabook.admin.faq.pesquisa.listar(gafisa.alphabook.admin.faq.pesquisa.parametros);
    },

    registrarAcoes: function () {
        $('#buscar').livequery('click', gafisa.alphabook.admin.faq.pesquisa.aoListar);
        $('.ic-excluir-faq').livequery('click', gafisa.alphabook.admin.faq.pesquisa.aoExcluir);
    },

    aoListar: function () {
        gafisa.alphabook.admin.faq.pesquisa.parametros = $('#filtros').formToJSON();
        gafisa.alphabook.admin.faq.pesquisa.listar(gafisa.alphabook.admin.faq.pesquisa.parametros);
    },

    listar: function (parametros) {
        $('#tabela').tabela({ action: gafisa.alphabook.rotas.admin.listarFaq, parametros: parametros, tamanhoPagina: 10 });
    },

    aoExcluir: function () {
        gafisa.alphabook.admin.faq.pesquisa.botaoExcluir = $(this);
        gafisa.alphabook.admin.faq.pesquisa.parametros = { faqId: $(this).data('id') };
        $.dialogo.confirmar(gafisa.mensagens.comum.temCertezaAoExcluirEsse.format('registro de FAQ'), gafisa.alphabook.admin.faq.pesquisa.excluir, null, true);
    },
    
    excluir: function () {
        $.loading({ action: 'show' });
        var url = gafisa.alphabook.rotas.admin.excluirFaq;
        $.post(url, gafisa.alphabook.admin.faq.pesquisa.parametros, gafisa.alphabook.admin.faq.pesquisa.aposExcluir, 'json');
    },
    
    aposExcluir: function (json) {
        if (json.sucesso) {
            gafisa.alphabook.mensagens.exibirMensagemConfirmacao(gafisa.mensagens.comum.excluidoComSucesso.format('Faq'));
            gafisa.alphabook.admin.faq.pesquisa.limparParametros();
            gafisa.alphabook.admin.faq.pesquisa.listar(gafisa.alphabook.admin.faq.pesquisa.parametros);
        }
        else
            gafisa.alphabook.mensagens.exibirMensagemErro(json.erros);

        $.loading({ action: 'hide' });
    },

    limparParametros: function () {
        gafisa.alphabook.admin.faq.pesquisa.botaoExcluir = null;
        gafisa.alphabook.admin.faq.pesquisa.parametros = {};
    }
};

$(document).ready(gafisa.alphabook.admin.faq.pesquisa.inicializar);