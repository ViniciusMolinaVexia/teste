if (typeof gafisa.alphabook.admin.taxonomia == 'undefined') { gafisa.alphabook.admin.taxonomia = new Object(); }

gafisa.alphabook.admin.taxonomia.editar = {
    idtaxonomia: 0,

    inicializar: function() {
        gafisa.alphabook.admin.taxonomia.editar.registrarAcoes();
        gafisa.alphabook.admin.taxonomia.editar.carregarDepartamentos();
    },

    registrarAcoes: function() {
        $('#departamentoTaxonomia').fcbkcomplete({
            json_url: gafisa.alphabook.rotas.admin.listarDepartamentos,
            cache: true,
            maxitems: 999,
            newel: false,
            complete_text: "Digite o nome de um departamento",
            width: 892,
            bricket: false
        });

        $('#ListaPasta').livequery(gafisa.alphabook.admin.taxonomia.editar.bindTreeView);
        $('[name="Pasta"]').livequery('click', gafisa.alphabook.admin.taxonomia.editar.aoAbrirPasta);
        $('#salvar').livequery('click', gafisa.alphabook.admin.taxonomia.editar.aoIncluirTaxonomia);
    },

    carregarDepartamentos: function() {
        var departamentos = $('#autoDepartamento').data('source');

        if (departamentos && typeof(departamentos) == 'string')
            departamentos = JSON.parse(departamentos);

        if (departamentos != null && departamentos != undefined && departamentos != '') {
            $.each(departamentos, function(index, value) {
                $('#departamentoTaxonomia').trigger('addItem', [{ 'title': value.Nome, 'value': value.Id }]);
            });
        }
    },

    bindTreeView: function() {
        $(this).jstree({
            "themes": {
                "theme": "default",
                "dots": true,
                "icons": true
            },
            "plugins": ["themes", "html_data", "ui"]
        }).bind("select_node.jstree", gafisa.alphabook.admin.taxonomia.editar.aoClicarPasta);
    },

    aoClicarPasta: function(event, data) {

        $('#ListaPasta').toggle();

        var obj = $('#form');
        obj.find('[name="Pasta"]').empty().append('<option value="' + data.rslt.obj.data("taxonomiaid") + '">' + data.rslt.obj.data("taxonomianome") + '</option>');
    },

    aoAbrirPasta: function() {
        gafisa.alphabook.admin.taxonomia.editar.idtaxonomia = $(this).data('idtaxonomia');
        $(this).blur();
        $('#ListaPasta').toggle().css({
            left: ($(this).offset().left + 0) + 'px',
            top: ($(this).offset().top + 33) + 'px'
        });
    },

    aoIncluirTaxonomia: function() {

        $.loading({ action: 'show' });

        var parametros = {};
        var departamentos = null;

        if ($('#departamentoTaxonomia').val())
            departamentos = $('#departamentoTaxonomia').val();

        if (departamentos != null)
            parametros = { Id: $('#Id').val(), IdTaxonomiaPai: $('#IdTaxonomiaPai').val(), Nome: $('#Nome').val(), Template: ($('#Template').val() == "true" || $('#Template').val() == "True"), PadraoPortal: $('#PadraoPortal').checked(), PadraoProtocolo: $('#PadraoProtocolo').checked(), DepartamentosSelecionados: departamentos };
        else
            parametros = { Id: $('#Id').val(), IdTaxonomiaPai: gafisa.alphabook.admin.taxonomia.editar.idtaxonomia, Nome: $('#Nome').val(), Template: ($('#Template').val() == "true" || $('#Template').val() == "True"), PadraoPortal: $('#PadraoPortal').checked(), PadraoProtocolo: $('#PadraoProtocolo').checked() };

        var url = gafisa.alphabook.rotas.admin.salvarTaxonomia;
        $.post(url, parametros, gafisa.alphabook.admin.taxonomia.editar.aposIncluirTaxonomia, 'json');
    },

    aposIncluirTaxonomia: function(json) {
        if (json.sucesso) {
            gafisa.alphabook.mensagens.exibirMensagemConfirmacao(gafisa.mensagens.comum.salvaComSucesso.format('Taxonomia'), function () {
                $.loading({ action: 'hide' });
                history.back();
            });
        } else {
            $.loading({ action: 'hide' });
            gafisa.alphabook.mensagens.exibirMensagemErro(json.erros);
        }
    }
};

$(document).ready(gafisa.alphabook.admin.taxonomia.editar.inicializar);