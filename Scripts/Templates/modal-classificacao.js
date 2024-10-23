if (typeof gafisa.alphabook.home.templates == 'undefined') { gafisa.alphabook.home.templates = new Object(); }
if (typeof gafisa.alphabook.home.templates.modelo == 'undefined') { gafisa.alphabook.home.templates.modelo = new Object(); }

gafisa.alphabook.home.templates.modelo.classificacao = {
    inicializar: function () {
        gafisa.alphabook.home.templates.modelo.classificacao.registrarAcoesModal();
    },

    registrarAcoesModal: function () {
        $('#voltarClassificacaoTemplate', '.modal-footer').livequery('click', gafisa.alphabook.home.templates.modelo.classificacao.aoVoltarParaTemplate);
        $('#incluirClassificacao', '.modal-footer').livequery('click', gafisa.alphabook.home.templates.modelo.classificacao.aoIncluirClassificacao);
    },

    aoVoltarParaTemplate: function () {
        $.dialogo.voltar(gafisa.alphabook.home.templates.modelo.atualizarDados);
    },

    aoIncluirClassificacao: function () {
        var url = gafisa.alphabook.rotas.taxonomia.salvarClassificacao;
        var parametros = { TaxonomiaId: $('#TaxonomiaId').val(), PrivacidadeId: $('#PrivacidadeId').val(), ParaQueServe: $('#ParaQueServe').val(), PalavrasChave: $('#PalavrasChave').val(), NomeClassificacao: $('#NomeClassificacao').val(), Milestone: $('input[name="Milestone"]:checked').val() == 'S' };
        $.post(url, parametros, gafisa.alphabook.home.templates.modelo.classificacao.aposIncluirClassificacao, 'json');
    },

    aposIncluirClassificacao: function (json) {
        if (json.sucesso) {
            gafisa.alphabook.mensagens.exibirMensagemConfirmacao(gafisa.mensagens.comum.salvaComSucesso.format('Classificação'));
            $.dialogo.voltar(gafisa.alphabook.home.templates.modelo.atualizarDados);
        }
        else
            gafisa.alphabook.mensagens.exibirMensagemErro(json.erros);
    }
};

$(document).ready(gafisa.alphabook.home.templates.modelo.classificacao.inicializar);