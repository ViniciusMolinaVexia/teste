if (typeof gafisa.alphabook.admin.classificacao == 'undefined') { gafisa.alphabook.admin.classificacao = new Object(); }

var tamanhoPagina = 20;

gafisa.alphabook.admin.classificacao.pesquisa = {

    parametros: { tamanhoPagina: tamanhoPagina, taxonomiaId: $('#Id').val() },

    botaoExcluir: null,

    inicializar: function () {
        gafisa.alphabook.admin.classificacao.pesquisa.registrarAcoes();
        gafisa.alphabook.admin.classificacao.pesquisa.listar(gafisa.alphabook.admin.classificacao.pesquisa.parametros);
    },

    registrarAcoes: function () {
        $('#buscarClassificacao').livequery('click', gafisa.alphabook.admin.classificacao.pesquisa.aoListar);
        $('.ic-excluir').livequery('click', gafisa.alphabook.admin.classificacao.pesquisa.aoExcluir);
    },

    aoListar: function () {
        gafisa.alphabook.admin.classificacao.pesquisa.parametros = $('#filtros').formToJSON();
        gafisa.alphabook.admin.classificacao.pesquisa.parametros.tamanhoPagina = tamanhoPagina;
        gafisa.alphabook.admin.classificacao.pesquisa.listar(gafisa.alphabook.admin.classificacao.pesquisa.parametros);
    },

    listar: function (parametros) {
        $('#tabelaClassificacao').tabela({ action: gafisa.alphabook.rotas.admin.listarClassificacoesTaxonomia, parametros: parametros, tamanhoPagina: tamanhoPagina });
    },

    aoExcluir: function () {
        gafisa.alphabook.admin.classificacao.pesquisa.botaoExcluir = $(this);
        gafisa.alphabook.admin.classificacao.pesquisa.parametros = { Id: $(this).data('id') };
        $.dialogo.confirmar(gafisa.mensagens.comum.temCertezaAoExcluirEssa.format('Classificação'), gafisa.alphabook.admin.classificacao.pesquisa.excluir, null, true);
    },

    excluir: function () {
        $.loading({ action: 'show' });
        var url = gafisa.alphabook.rotas.admin.excluirClassificacao;
        $.post(url, gafisa.alphabook.admin.classificacao.pesquisa.parametros, gafisa.alphabook.admin.classificacao.pesquisa.aposExcluir, 'json');
    },

    aposExcluir: function (json) {
        if (json.sucesso) {
            gafisa.alphabook.mensagens.exibirMensagemConfirmacao(gafisa.mensagens.comum.excluidaComSucesso.format('Classificação'));
            gafisa.alphabook.admin.classificacao.pesquisa.limparParametros();
            gafisa.alphabook.admin.classificacao.pesquisa.listar(gafisa.alphabook.admin.classificacao.pesquisa.parametros);
        }
        else
            gafisa.alphabook.mensagens.exibirMensagemErro(json.erros);

        $.loading({ action: 'hide' });
    },

    limparParametros: function () {
        gafisa.alphabook.admin.classificacao.pesquisa.botaoExcluir = null;
        gafisa.alphabook.admin.classificacao.pesquisa.parametros = $('#filtros').formToJSON();
        gafisa.alphabook.admin.classificacao.pesquisa.parametros.tamanhoPagina = tamanhoPagina;
    }
};

$(document).ready(gafisa.alphabook.admin.classificacao.pesquisa.inicializar);
