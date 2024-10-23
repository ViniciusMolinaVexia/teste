if (typeof gafisa.alphabook.home == 'undefined') { gafisa.alphabook.home = new Object(); }

gafisa.alphabook.home.coordenadores = {
    linkAcao: null,

    inicializar: function () {
        gafisa.alphabook.home.coordenadores.registrarAcoes();
    },

    registrarAcoes: function () {
        $('#tileCoordenadores').live('click', gafisa.alphabook.home.coordenadores.aoAbrirModal);
        $('#modalCoordenadores').on('hidden', gafisa.alphabook.home.coordenadores.aoFecharModalHome);
        $('#modalCoordenadores #lnkAlterar').live('click', gafisa.alphabook.home.coordenadores.aoAlterarCoordenador);
        $('#modalDefinirCoordenador #lnkSalvar').live('click', gafisa.alphabook.home.coordenadores.aoSalvar);
        $('#modalDefinirCoordenador #lnkCancelar').live('click', gafisa.alphabook.home.coordenadores.aoCancelar);
    },

    aoAbrirModal: function () {
        $.get(gafisa.alphabook.rotas.usuario.listarCoordenadoresProspeccao, function (html) {
            $('#modalCoordenadores').html('');
            $('#modalCoordenadores').append(html);
            $("#modalDefinirCoordenador").contentModal({ relativeParent: '#modalCoordenadores' });
            $('#modalCoordenadores').modal('show');
        }, "html");
    },

    aoFecharModalHome: function () {
        $('#modalCoordenadores').html('');
    },

    aoAlterarCoordenador: function () {
        gafisa.alphabook.home.coordenadores.linkAcao = $(this);
        $("#modalDefinirCoordenador #ddlCoordenador").val($(this).data('id'));
        $("#modalDefinirCoordenador").contentModal('open');
    },

    aoSalvar: function () {
        var link = gafisa.alphabook.home.coordenadores.linkAcao;
        var idAnterior = link.data('id');

        if (idAnterior > 0 && idAnterior == $("#modalDefinirCoordenador #ddlCoordenador").val()) {
            $("#modalDefinirCoordenador").contentModal('close');
            return;
        }

        if (String.isNullOrEmpty($("#modalDefinirCoordenador #ddlCoordenador").val())) {
            afisa.alphabook.mensagens.exibirMensagemErro(gafisa.mensagens.comum.selecioneUm.format('Coordenador'));
            $("#modalDefinirCoordenador #ddlCoordenador").focus();
            return;
        }

        var data = {
            UsuarioId: $("#modalDefinirCoordenador #ddlCoordenador").val(),
            UFId: link.data('uf')
        };
        var descricao = $("#modalDefinirCoordenador #ddlCoordenador option:selected").text();

        $.post(gafisa.alphabook.rotas.usuario.salvarCoordenadorProspeccao, data, function (json) {
            if (json.sucesso) {
                link.text(descricao);
                link.data('id', data.UsuarioId);
                link.data('uf', data.UFId);
                gafisa.alphabook.mensagens.exibirMensagemErro(gafisa.mensagens.comum.salvoComSucesso.format('Coordenador'));
            }
            else {
                gafisa.alphabook.mensagens.exibirMensagemErro(json.erros);
            }
        }, "json");

        $("#modalDefinirCoordenador").contentModal('close');
    },

    aoCancelar: function () {
        gafisa.alphabook.home.coordenadores.linkAcao = null;
        $("#modalDefinirCoordenador").contentModal('close');
    }
};

$(document).ready(gafisa.alphabook.home.coordenadores.inicializar);
