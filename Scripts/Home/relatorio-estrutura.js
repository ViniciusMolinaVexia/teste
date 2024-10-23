if (typeof gafisa.alphabook.home == 'undefined') { gafisa.alphabook.home = new Object(); }
if (typeof gafisa.alphabook.home.relatorios == 'undefined') { gafisa.alphabook.home.relatorios = new Object(); }

gafisa.alphabook.home.relatorios.estrutura = {
    inicializar: function () {
        gafisa.alphabook.home.relatorios.estrutura.registrarAcoes();
        gafisa.alphabook.home.relatorios.estrutura.criarOrganograma();
    },

    registrarAcoes: function () {
        $('#filtro').livequery('click', gafisa.alphabook.home.relatorios.estrutura.aoClicarFiltro);
        $('.numero-projetos').livequery('click', gafisa.alphabook.home.relatorios.estrutura.aoAbrirModalProjetos);
        $('.detalhar-usuario').livequery('click', gafisa.alphabook.home.relatorios.estrutura.aoAbrirModalDetalheUsuario);
        $('.ico-central').livequery('click', gafisa.alphabook.home.relatorios.estrutura.aoCentralizarUsuario);
        $('#todos').livequery('click', gafisa.alphabook.home.relatorios.estrutura.aoMarcarTodosFiltros);
        $('input[name=statusProjeto]').livequery('click', gafisa.alphabook.home.relatorios.estrutura.aoFiltrarPorStatus);
    },

    criarOrganograma: function () {
        $("#organograma").livequery(function () { $(this).jOrgChart({ chartElement: '#grafico' }) });
    },

    aoClicarFiltro: function () {
        var obj = $('#filtroProjetos');

        if (obj.is(":visible")) {
            obj.hide('slow');
            return;
        }
        obj.show('slow');
    },

    aoAbrirModalDetalheUsuario: function () {
        $.dialogo.exibir(gafisa.alphabook.rotas.relatorios.carregarDetalheUsuario, { usuarioId: $(this).data('id') }, null, null);
    },

    aoAbrirModalProjetos: function () {
        var qtdProjetos = 0;
        qtdProjetos = $(this).text();

        if (qtdProjetos > 0) {
            var ids = [];
            $('input[name=statusProjeto]:checked').each(function () {
                ids.push($(this).val());
            });

            $.dialogo.exibir(gafisa.alphabook.rotas.relatorios.carregarProjetosUsuario, { usuarioId: $(this).data('id'), status: ids, ultimoNivel: $(this).data('ultimo') == "True" }, null, null);
        }
    },

    aoMarcarTodosFiltros: function () {
        if ($(this).is(':checked'))
            $('input[id^=check_]').prop('checked', true);
        else
            $('input[id^=check_]').prop('checked', false);
    },

    aoFiltrarPorStatus: function () {
        var ids = [];
        $('input[name=statusProjeto]:checked').each(function () {
            ids.push($(this).val());
        });

        $.loading({ action: 'show' });
        $('#containerOrganograma').load(gafisa.alphabook.rotas.relatorios.gerarEstrutura.concatQueryString({ usuarioId: $(this).data('id'), status: ids }), function () { $.loading({ action: 'hide' }); });
    },

    aoCentralizarUsuario: function () {
        $.loading({ action: 'show' });

        $('input[name=statusProjeto]').data('id', $(this).data('id'));

        var ids = [];
        $('#todos, input[id^=check_]').prop('checked', true).each(function () {
            ids.push($(this).val());
        });

        $('#containerOrganograma').load(gafisa.alphabook.rotas.relatorios.gerarEstrutura.concatQueryString({ usuarioId: $(this).data('id'), status: ids, ultimoNivel: $(this).data('ultimo') == "True" }), function () { $.loading({ action: 'hide' }); });
    }
};

$(document).ready(gafisa.alphabook.home.relatorios.estrutura.inicializar);