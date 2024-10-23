if (typeof gafisa.alphabook.admin.cidade == 'undefined') { gafisa.alphabook.admin.cidade = new Object(); }

gafisa.alphabook.admin.cidade.editar = {
    registrarAcoes: function () {
        gafisa.alphabook.admin.cidade.editar.aplicarMascaras();
        $('#salvar').on('click', gafisa.alphabook.admin.cidade.editar.aoSalvar);
    },

    aplicarMascaras: function () {
        $('.campo-posicao-global').livequery(function () { $(this).setMask({ mask: '999,999999999999999', autoTab: false }); });
    },

    aoSalvar: function () {
        var existemItensAssociados = false;

        if(!String.isNullOrEmpty($(this).data('id'))) {
            $.ajax({
                dataType: "json",
                url: gafisa.alphabook.rotas.admin.existemItensAssociadosCidade,
                data: { idCidade: $(this).data('id') },
                success: function(data) { existemItensAssociados = data.existemItensAssociados; },
                async: false,
            });

            if(existemItensAssociados) {
                $.dialogo.confirmar(gafisa.mensagens.cidadeadministracao.existemItensAssociadosAEstaCidadeDesejaRealmenteAlterar, gafisa.alphabook.admin.cidade.editar.salvar);
            }
        }
        
        if(!existemItensAssociados)
            gafisa.alphabook.admin.cidade.editar.salvar();
    },

    salvar: function () {
        $.loading({ action: 'show' });
        var url = gafisa.alphabook.rotas.admin.salvarCidade;
        var parametros = $('#form').formToJSON();
        $.post(url, parametros, gafisa.alphabook.admin.cidade.editar.aposSalvar, 'json');
    },

    aposSalvar: function (json) {
        if (json.sucesso) {
            gafisa.alphabook.mensagens.exibirMensagemConfirmacao(gafisa.mensagens.comum.salvaComSucesso.format('Cidade'), function() {
                $.loading({ action: 'hide' });
                history.back();
            });

        } else {
            $.loading({ action: 'hide' });
            gafisa.alphabook.mensagens.exibirMensagemErro(json.erros != null ? json.erros[0] : json.erro);
        }
    }
};

$(document).ready(gafisa.alphabook.admin.cidade.editar.registrarAcoes);