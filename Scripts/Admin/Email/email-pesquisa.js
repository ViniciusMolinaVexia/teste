if (typeof gafisa.alphabook.admin == 'undefined') { gafisa.alphabook.admin = new Object(); }
if (typeof gafisa.alphabook.admin.email == 'undefined') { gafisa.alphabook.admin.email = new Object(); }

var tamanhoPagina = 20;

gafisa.alphabook.admin.email.pesquisa = {

    parametros: { tamanhoPagina: tamanhoPagina },

    botaoExcluir: null,

    inicializar: function () {
        gafisa.alphabook.admin.email.pesquisa.registrarAcoes();
        gafisa.alphabook.admin.email.pesquisa.listar(gafisa.alphabook.admin.email.pesquisa.parametros);
    },

    registrarAcoes: function () {
        $('#buscar').livequery('click', gafisa.alphabook.admin.email.pesquisa.aoListar);
    },

    aoListar: function () {
        gafisa.alphabook.admin.email.pesquisa.parametros = $('#filtros').formToJSON();
        gafisa.alphabook.admin.email.pesquisa.parametros.tamanhoPagina = tamanhoPagina;
        gafisa.alphabook.admin.email.pesquisa.listar(gafisa.alphabook.admin.email.pesquisa.parametros);
    },

    listar: function (parametros) {
        $('#tabela').tabela({ action: gafisa.alphabook.rotas.admin.listarEmail, parametros: parametros, tamanhoPagina: tamanhoPagina });
    }
};

$(document).ready(gafisa.alphabook.admin.email.pesquisa.inicializar);
