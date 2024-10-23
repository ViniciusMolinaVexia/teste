if (typeof gafisa.alphabook.home.templates == 'undefined') { gafisa.alphabook.home.templates = new Object(); }
if (typeof gafisa.alphabook.home.templates.modelo == 'undefined') { gafisa.alphabook.home.templates.modelo = new Object(); }

gafisa.alphabook.home.templates.modelo.taxonomia = {
    inicializar: function () {
        gafisa.alphabook.home.templates.modelo.taxonomia.registrarAcoesModal();
    },

    registrarAcoesModal: function () {
        $('#ListaPasta', '.modal').livequery(gafisa.alphabook.home.templates.modelo.taxonomia.bindTreeView);
        $('select[name="Pasta"]', '.modal').livequery('click', gafisa.alphabook.home.templates.modelo.taxonomia.aoAbrirPasta);
        $('#voltarTaxonomiaTemplate', '.modal-footer').livequery('click', gafisa.alphabook.home.templates.modelo.taxonomia.aoVoltarParaTemplate);
        $('#incluirTaxonomia', '.modal-footer').livequery('click', gafisa.alphabook.home.templates.modelo.taxonomia.aoIncluirTaxonomia);
    },

    aoVoltarParaTemplate: function () {
        $.dialogo.voltar(gafisa.alphabook.home.templates.modelo.atualizarDados);
    },

    bindTreeView: function () {
        $(this).jstree({ "themes": {
            "theme": "default",
            "dots": true,
            "icons": true
        }, "plugins": ["themes", "html_data", "ui"]
        }).bind("select_node.jstree", gafisa.alphabook.home.templates.modelo.taxonomia.aoClicarPasta);
    },
    aoClicarPasta: function (event, data) {
        $('#ListaPasta').toggle();
        var obj = $('#formIncluirTaxonomia');
        obj.find('[name="Pasta"]').empty().append('<option value="' + data.rslt.obj.data("taxonomiaid") + '">' + data.rslt.obj.data("taxonomianome") + '</option>');
    },

    aoAbrirPasta: function () {
        $(this).blur();
        $('#ListaPasta').toggle().css({
            left: ($(this).offset().left + 0) + 'px',
            top: ($(this).offset().top + 33) + 'px'
        });
    },

    aoIncluirTaxonomia: function () {

        var taxonomiaPaiId = null, nome = null;

        if ($('#TaxonomiaPaiId').val())
            taxonomiaPaiId = $('#TaxonomiaPaiId').val();

        if ($('#TaxonomiaNome').val())
            nome = $('#TaxonomiaNome').val();

        if (!nome) {
            gafisa.alphabook.mensagens.exibirMensagemAlerta(gafisa.mensagens.comum.deveSerPreenchido.format('Nome da Pasta'));
            return false;
        } else if (!taxonomiaPaiId) {
            gafisa.alphabook.mensagens.exibirMensagemAlerta(gafisa.mensagens.comum.deveSerPreenchido.format('Pasta Pai'));
            return false;
        }

        if (nome && taxonomiaPaiId) {
            var url = gafisa.alphabook.rotas.taxonomia.salvar;
            var parametros = { TaxonomiaPaiId: taxonomiaPaiId, TaxonomiaNome: nome, Template: true };
            $.post(url, parametros, gafisa.alphabook.home.templates.modelo.taxonomia.aposIncluirTaxonomia, 'json');
        }
    },

    aposIncluirTaxonomia: function (json) {
        if (json.sucesso) {
            gafisa.alphabook.mensagens.exibirMensagemConfirmacao(gafisa.mensagens.comum.salvaComSucesso.format('Taxonomia'));
            $.dialogo.voltar(gafisa.alphabook.home.templates.modelo.atualizarDados);
        }
        else
            gafisa.alphabook.mensagens.exibirMensagemErro(json.erros);
    }
};

$(document).ready(gafisa.alphabook.home.templates.modelo.taxonomia.inicializar);