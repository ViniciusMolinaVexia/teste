if (typeof gafisa.alphabook.admin.status == 'undefined') { gafisa.alphabook.admin.status = new Object(); }
if (typeof gafisa.alphabook.admin.status.projeto == 'undefined') { gafisa.alphabook.admin.status.projeto = new Object(); }

var tamanhoPagina = 20;

gafisa.alphabook.admin.status.projeto.pesquisa = {

    parametros: { tamanhoPagina: tamanhoPagina },

    botaoExcluir: null,

    inicializar: function () {
        gafisa.alphabook.admin.status.projeto.pesquisa.registrarAcoes();
        gafisa.alphabook.admin.status.projeto.pesquisa.listar(gafisa.alphabook.admin.status.projeto.pesquisa.parametros);
    },

    registrarAcoes: function () {
        $('#buscar').livequery('click', gafisa.alphabook.admin.status.projeto.pesquisa.aoListar);
        $('.ic-excluir').livequery('click', gafisa.alphabook.admin.status.projeto.pesquisa.aoExcluir);
    },

    aoListar: function () {
        gafisa.alphabook.admin.status.projeto.pesquisa.parametros = $('#filtros').formToJSON();
        gafisa.alphabook.admin.status.projeto.pesquisa.parametros.tamanhoPagina = tamanhoPagina;
        gafisa.alphabook.admin.status.projeto.pesquisa.listar(gafisa.alphabook.admin.status.projeto.pesquisa.parametros);
    },

    listar: function (parametros) {
        $('#tabela').tabela({ action: gafisa.alphabook.rotas.admin.listarStatusProjeto, parametros: parametros, tamanhoPagina: tamanhoPagina });
    },

    aoExcluir: function () {
        gafisa.alphabook.admin.status.projeto.pesquisa.botaoExcluir = $(this);
        gafisa.alphabook.admin.status.projeto.pesquisa.parametros = { statusId: $(this).data('id') };
        $.dialogo.confirmar(gafisa.mensagens.comum.temCertezaAoExcluirEsse.format('Status'), gafisa.alphabook.admin.status.projeto.pesquisa.excluir, null, true);
    },

    excluir: function () {
        $.loading({ action: 'show' });
        var url = gafisa.alphabook.rotas.admin.excluirStatusProjeto;
        $.post(url, gafisa.alphabook.admin.status.projeto.pesquisa.parametros, gafisa.alphabook.admin.status.projeto.pesquisa.aposExcluir, 'json');
    },

    aposExcluir: function (json) {
        if (json.sucesso) {
            gafisa.alphabook.mensagens.exibirMensagemConfirmacao(gafisa.mensagens.comum.excluidoComSucesso.format('Status'));
            gafisa.alphabook.admin.status.projeto.pesquisa.limparParametros();
            gafisa.alphabook.admin.status.projeto.pesquisa.listar(gafisa.alphabook.admin.status.projeto.pesquisa.parametros);
        }
        else
            gafisa.alphabook.mensagens.exibirMensagemErro(json.erros);

        $.loading({ action: 'hide' });
    },

    limparParametros: function () {
        gafisa.alphabook.admin.status.projeto.pesquisa.botaoExcluir = null;
        gafisa.alphabook.admin.status.projeto.pesquisa.parametros = {};
        gafisa.alphabook.admin.status.projeto.pesquisa.parametros.tamanhoPagina = tamanhoPagina;
    }
};

$(document).ready(gafisa.alphabook.admin.status.projeto.pesquisa.inicializar);
