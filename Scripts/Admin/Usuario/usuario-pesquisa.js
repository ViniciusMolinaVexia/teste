if (typeof gafisa.alphabook.admin.usuario == 'undefined') { gafisa.alphabook.admin.usuario = new Object(); }

gafisa.alphabook.admin.usuario.pesquisa = {
    parametros: {},
    modoPesquisa: false,
    inicializar: function () {
        gafisa.alphabook.admin.usuario.pesquisa.registrarAcoes();
        gafisa.alphabook.admin.usuario.pesquisa.listar(gafisa.alphabook.admin.usuario.pesquisa.parametros);
    },

    registrarAcoes: function () {
        $('#buscar').livequery('click', gafisa.alphabook.admin.usuario.pesquisa.aoListar);
        $('#chkTodos').livequery('click', gafisa.alphabook.admin.usuario.pesquisa.aoCheckarTodos);
    },

    aoCheckarTodos: function () {
        if ($(this).is(':checked')) {
            gafisa.alphabook.admin.usuario.pesquisa.limparFiltros();
            $('#tabela').tabela({ acao: 'carregar', parametros: gafisa.alphabook.admin.usuario.pesquisa.parametros });
        }
        else
            gafisa.alphabook.admin.usuario.pesquisa.habilitarFiltros();
    },

    limparFiltros: function () {
        gafisa.alphabook.admin.usuario.pesquisa.modoPesquisa = false;
        gafisa.alphabook.admin.usuario.pesquisa.parametros = {};
        $('#departamentoId, #filtroId, #perfilId, #ativo, #termo').val('').attr('disabled', 'disabled');
    },

    habilitarFiltros: function () {
        gafisa.alphabook.admin.usuario.pesquisa.modoPesquisa = true;
        $('#departamentoId, #filtroId, #perfilId, #ativo, #termo').removeAttr('disabled');
    },

    aoListar: function () {
        if (gafisa.alphabook.admin.usuario.pesquisa.modoPesquisa) {
            gafisa.alphabook.admin.usuario.pesquisa.parametros = $('#filtros').formToJSON();
            gafisa.alphabook.admin.usuario.pesquisa.listar(gafisa.alphabook.admin.usuario.pesquisa.parametros);
        }
    },

    listar: function (parametros) {
        $('#tabela').tabela({ action: gafisa.alphabook.rotas.admin.listarUsuarios, parametros: parametros, tamanhoPagina: 10 });
    }
};

$(document).ready(gafisa.alphabook.admin.usuario.pesquisa.inicializar);
