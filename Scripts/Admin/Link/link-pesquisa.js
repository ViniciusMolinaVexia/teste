if (typeof gafisa.alphabook.admin.link == 'undefined') { gafisa.alphabook.admin.link = new Object(); }

var tamanhoPagina = 20;

gafisa.alphabook.admin.link.pesquisa = {

    parametros: { tamanhoPagina: tamanhoPagina },

    botaoExcluir: null,

    inicializar: function () {
        gafisa.alphabook.admin.link.pesquisa.registrarAcoes();
        gafisa.alphabook.admin.link.pesquisa.listar(gafisa.alphabook.admin.link.pesquisa.parametros);
    },

    registrarAcoes: function () {
        $('#buscar').livequery('click', gafisa.alphabook.admin.link.pesquisa.aoListar);
        $('.ic-excluir').livequery('click', gafisa.alphabook.admin.link.pesquisa.aoExcluir);
    },

    aoListar: function () {
        gafisa.alphabook.admin.link.pesquisa.parametros = $('#filtros').formToJSON();
        gafisa.alphabook.admin.link.pesquisa.parametros.tamanhoPagina = tamanhoPagina;
        gafisa.alphabook.admin.link.pesquisa.listar(gafisa.alphabook.admin.link.pesquisa.parametros);
    },

    listar: function (parametros) {
        $('#tabela').tabela({ action: gafisa.alphabook.rotas.admin.listarLink, parametros: parametros, tamanhoPagina: tamanhoPagina });
    },

    aoExcluir: function () {
        gafisa.alphabook.admin.link.pesquisa.botaoExcluir = $(this);
        gafisa.alphabook.admin.link.pesquisa.parametros = { linkId: $(this).data('id') };
        $.dialogo.confirmar(gafisa.mensagens.comum.temCertezaAoExcluirEsse.format('Link'), gafisa.alphabook.admin.link.pesquisa.excluir, null, true);
    },

    excluir: function () {
        $.loading({ action: 'show' });
        var url = gafisa.alphabook.rotas.admin.excluirLink;
        $.post(url, gafisa.alphabook.admin.link.pesquisa.parametros, gafisa.alphabook.admin.link.pesquisa.aposExcluir, 'json');
    },

    aposExcluir: function (json) {
        if (json.sucesso) {
            gafisa.alphabook.mensagens.exibirMensagemConfirmacao(gafisa.mensagens.comum.excluidoComSucesso.format('Link'));
            gafisa.alphabook.admin.link.pesquisa.limparParametros();
            gafisa.alphabook.admin.link.pesquisa.listar(gafisa.alphabook.admin.link.pesquisa.parametros);
        }
        else
            gafisa.alphabook.mensagens.exibirMensagemErro(json.erros);

        $.loading({ action: 'hide' });
    },

    limparParametros: function () {
        gafisa.alphabook.admin.link.pesquisa.botaoExcluir = null;
        gafisa.alphabook.admin.link.pesquisa.parametros = {};
        gafisa.alphabook.admin.link.pesquisa.parametros.tamanhoPagina = tamanhoPagina;
    }
};

$(document).ready(gafisa.alphabook.admin.link.pesquisa.inicializar);
