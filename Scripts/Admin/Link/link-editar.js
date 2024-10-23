if (typeof gafisa.alphabook.admin.link == 'undefined') { gafisa.alphabook.admin.link = new Object(); }

gafisa.alphabook.admin.link.editar = {
    inicializar: function () {
        gafisa.alphabook.admin.link.editar.registrarAcoes();
    },

    registrarAcoes: function () {
        $('#salvar').livequery('click', gafisa.alphabook.admin.link.editar.aoSalvar);
        $('#cor').livequery(function () {
            $(this).colorpicker({
                altField: '.cor',
                altProperties: 'background-color, color',
                altAlpha: true,
                alpha: true,
                select: function (event, color) {
                    $(this).val('#' + color.formatted);
                }
            });
        });
        $('#IconeLinkId').livequery(function () { $(this).ddslick({ width: '70px', background: 'rgb(98, 187, 70)' }); });
        //$('#IconeLinkId').livequery(gafisa.alphabook.admin.link.editar.criarDropDownImagem);
    },
    
    aoSalvar: function () {
        $.loading({ action: 'show' });
        var url = gafisa.alphabook.rotas.admin.salvarLink;
        var parametros = $('#form').formToJSON();
        parametros.IconeLinkId = $('#IconeLinkId .dd-selected-value').val();
        $.post(url, parametros, gafisa.alphabook.admin.link.editar.aposSalvar, 'json');
    },

    aposSalvar: function (json) {
        if (json.sucesso) {
            gafisa.alphabook.mensagens.exibirMensagemConfirmacao(gafisa.mensagens.comum.salvoComSucesso.format('Link'), function() {
                $.loading({ action: 'hide' });
                history.back();
            });
        } else {
            $.loading({ action: 'hide' });
            gafisa.alphabook.mensagens.exibirMensagemErro(json.erros);
        }         
    }
};

$(document).ready(gafisa.alphabook.admin.link.editar.inicializar);
