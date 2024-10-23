if (typeof gafisa.alphabook.admin.material == 'undefined') { gafisa.alphabook.admin.material = new Object(); }

var tamanhoPagina = 20;

gafisa.alphabook.admin.material.pesquisa = {
    parametros: { tamanhoPagina: tamanhoPagina },
    botaoExcluir: null,

    inicializar: function () {
        gafisa.alphabook.admin.material.pesquisa.registrarAcoes();
        gafisa.alphabook.admin.material.pesquisa.listar();
    },

    registrarAcoes: function () {
        $('#buscar').livequery('click', gafisa.alphabook.admin.material.pesquisa.listar);
        $('.ic-excluir').livequery('click', gafisa.alphabook.admin.material.pesquisa.aoExcluir);
    },

    listar: function () {
        $('#tabela').tabela({ action: gafisa.alphabook.rotas.admin.listarMaterial, parametros: gafisa.alphabook.admin.material.pesquisa.parametros, tamanhoPagina: tamanhoPagina });
    },

    aoExcluir: function () {
        gafisa.alphabook.admin.material.pesquisa.botaoExcluir = $(this);
        gafisa.alphabook.admin.material.pesquisa.parametros = { id: $(this).data('id') };
        $.dialogo.confirmar(gafisa.mensagens.comum.temCertezaAoExcluirEsse.format('Material'), gafisa.alphabook.admin.material.pesquisa.excluir, null, true);
    },

    excluir: function () {
        $.loading({ action: 'show' });
        var url = gafisa.alphabook.rotas.admin.excluirMaterial;
        $.post(url, gafisa.alphabook.admin.material.pesquisa.parametros, gafisa.alphabook.admin.material.pesquisa.aposExcluir, 'json');
    },

    aposExcluir: function (json) {
        if (json.sucesso) {
            gafisa.alphabook.mensagens.exibirMensagemConfirmacao(gafisa.mensagens.comum.excluidoComSucesso.format('Material'));
            gafisa.alphabook.admin.material.pesquisa.limparParametros();
            gafisa.alphabook.admin.material.pesquisa.listar(gafisa.alphabook.admin.material.pesquisa.parametros);
        }
        else
            gafisa.alphabook.mensagens.exibirMensagemErro(json.erros);

        $.loading({ action: 'hide' });
    },

    limparParametros: function () {
        gafisa.alphabook.admin.material.pesquisa.botaoExcluir = null;
        gafisa.alphabook.admin.material.pesquisa.parametros = {};
        gafisa.alphabook.admin.material.pesquisa.parametros.tamanhoPagina = tamanhoPagina;
    }
};

$(document).ready(gafisa.alphabook.admin.material.pesquisa.inicializar);
