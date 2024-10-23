if (typeof gafisa.alphabook.admin.classificacao == 'undefined') { gafisa.alphabook.admin.classificacao = new Object(); }

gafisa.alphabook.admin.classificacao.editar = {
    inicializar: function () {
        gafisa.alphabook.admin.classificacao.editar.registrarAcoes();
    },

    registrarAcoes: function () {
        $('#salvar').livequery('click', gafisa.alphabook.admin.classificacao.editar.aoIncluirClassificacao);
    },

    aoIncluirClassificacao: function () {

        $.loading({ action: 'show' });
        var parametros = { Id: $(this).data('id'), IdTaxonomia: $('#IdTaxonomia').val(), IdPrivacidade: $('#PrivacidadeId').val(), ParaQueServe: $('#ParaQueServe').val(), PalavrasChave: $('#PalavrasChave').val(), Nome: $('#Nome').val(), Milestone: $('input[name="Milestone"]:checked').val() == 'S' };
        var url = gafisa.alphabook.rotas.admin.salvarClassificacao;
        $.post(url, parametros, gafisa.alphabook.admin.classificacao.editar.aposIncluirClassificacao, 'json');
    },

    aposIncluirClassificacao: function (json) {
        if (json.sucesso) {
            gafisa.alphabook.mensagens.exibirMensagemConfirmacao(gafisa.mensagens.comum.salvaComSucesso.format('Classificação'));

            //if (json.novo)
            history.back();
        }
        else
            gafisa.alphabook.mensagens.exibirMensagemErro(json.erros);

        $.loading({ action: 'hide' });
    }
}

$(document).ready(gafisa.alphabook.admin.classificacao.editar.inicializar);