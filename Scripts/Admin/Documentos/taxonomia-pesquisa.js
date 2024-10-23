if (typeof gafisa.alphabook.admin.taxonomia == 'undefined') { gafisa.alphabook.admin.taxonomia = new Object(); }

var tamanhoPagina = 20;

gafisa.alphabook.admin.taxonomia.pesquisa = {

    parametros: { tamanhoPagina: tamanhoPagina, template: ($('#template').val() == 'true' || $('#template').val() == 'True') },

    botaoExcluir: null,

    inicializar: function () {
        gafisa.alphabook.admin.taxonomia.pesquisa.registrarAcoes();
        gafisa.alphabook.admin.taxonomia.pesquisa.listar(gafisa.alphabook.admin.taxonomia.pesquisa.parametros);
    },

    registrarAcoes: function () {
        $('#buscar').livequery('click', gafisa.alphabook.admin.taxonomia.pesquisa.aoListar);
        $('.ic-excluir').livequery('click', gafisa.alphabook.admin.taxonomia.pesquisa.aoExcluir);
    },

    aoListar: function () {
        gafisa.alphabook.admin.taxonomia.pesquisa.parametros = $('#filtros').formToJSON();
        gafisa.alphabook.admin.taxonomia.pesquisa.parametros.tamanhoPagina = tamanhoPagina;
        gafisa.alphabook.admin.taxonomia.pesquisa.listar(gafisa.alphabook.admin.taxonomia.pesquisa.parametros);
    },

    listar: function (parametros) {
        $('#tabela').tabela({ action: gafisa.alphabook.rotas.admin.listarTaxonomia, parametros: parametros, tamanhoPagina: tamanhoPagina });
    },

    aoExcluir: function () {
        gafisa.alphabook.admin.taxonomia.pesquisa.botaoExcluir = $(this);
        gafisa.alphabook.admin.taxonomia.pesquisa.parametros = { taxonomiaId: $(this).data('id') };
        $.dialogo.confirmar(gafisa.mensagens.comum.temCertezaAoExcluirEssa.format('Taxonomia'), gafisa.alphabook.admin.taxonomia.pesquisa.excluir, null, true);
    },

    excluir: function () {
        $.loading({ action: 'show' });
        var url = gafisa.alphabook.rotas.admin.excluirTaxonomia;
        $.post(url, gafisa.alphabook.admin.taxonomia.pesquisa.parametros, gafisa.alphabook.admin.taxonomia.pesquisa.aposExcluir, 'json');
    },

    aposExcluir: function (json) {
        if (json.sucesso) {
            gafisa.alphabook.mensagens.exibirMensagemConfirmacao(gafisa.mensagens.comum.excluidaComSucesso.format('Taxonomia'));
            gafisa.alphabook.admin.taxonomia.pesquisa.limparParametros();
            gafisa.alphabook.admin.taxonomia.pesquisa.listar(gafisa.alphabook.admin.taxonomia.pesquisa.parametros);
        }
        else
            gafisa.alphabook.mensagens.exibirMensagemErro(json.erros);

        $.loading({ action: 'hide' });
    },

    limparParametros: function () {
        gafisa.alphabook.admin.taxonomia.pesquisa.botaoExcluir = null;
        gafisa.alphabook.admin.taxonomia.pesquisa.parametros = $('#filtros').formToJSON();
        gafisa.alphabook.admin.taxonomia.pesquisa.parametros.tamanhoPagina = tamanhoPagina;
    }
};

$(document).ready(gafisa.alphabook.admin.taxonomia.pesquisa.inicializar);
