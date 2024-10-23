if (typeof gafisa.alphabook.admin.uso == 'undefined') { gafisa.alphabook.admin.uso = new Object(); }

var tamanhoPagina = 20;

gafisa.alphabook.admin.uso.pesquisa = {
    parametros: { tamanhoPagina: tamanhoPagina },
    botaoExcluir: null,

    inicializar: function () {
        gafisa.alphabook.admin.uso.pesquisa.registrarAcoes();
        gafisa.alphabook.admin.uso.pesquisa.listar();
    },

    registrarAcoes: function () {
        $('#buscar').livequery('click', gafisa.alphabook.admin.uso.pesquisa.listar);
        $('.ic-excluir').livequery('click', gafisa.alphabook.admin.uso.pesquisa.aoExcluir);
    },

    listar: function () {
        $('#tabela').tabela({ action: gafisa.alphabook.rotas.admin.listarUsos, parametros: gafisa.alphabook.admin.uso.pesquisa.parametros, tamanhoPagina: tamanhoPagina });
    },

    aoExcluir: function () {
        gafisa.alphabook.admin.uso.pesquisa.botaoExcluir = $(this);
        gafisa.alphabook.admin.uso.pesquisa.parametros = { id: $(this).data('id') };
        $.dialogo.confirmar(gafisa.mensagens.comum.temCertezaAoExcluirEsse.format('Uso'), gafisa.alphabook.admin.uso.pesquisa.excluir, null, true);
    },

    excluir: function () {
        $.loading({ action: 'show' });
        var url = gafisa.alphabook.rotas.admin.excluirUso;
        $.post(url, gafisa.alphabook.admin.uso.pesquisa.parametros, gafisa.alphabook.admin.uso.pesquisa.aposExcluir, 'json');
    },

    aposExcluir: function (json) {
        if (json.sucesso) {
            gafisa.alphabook.mensagens.exibirMensagemConfirmacao(gafisa.mensagens.comum.excluidoComSucesso.format('Uso'));
            gafisa.alphabook.admin.uso.pesquisa.limparParametros();
            gafisa.alphabook.admin.uso.pesquisa.listar(gafisa.alphabook.admin.uso.pesquisa.parametros);
        }
        else
            gafisa.alphabook.mensagens.exibirMensagemErro(json.erros);

        $.loading({ action: 'hide' });
    },

    limparParametros: function () {
        gafisa.alphabook.admin.uso.pesquisa.botaoExcluir = null;
        gafisa.alphabook.admin.uso.pesquisa.parametros = {};
        gafisa.alphabook.admin.uso.pesquisa.parametros.tamanhoPagina = tamanhoPagina;
    }
};

$(document).ready(gafisa.alphabook.admin.uso.pesquisa.inicializar);
