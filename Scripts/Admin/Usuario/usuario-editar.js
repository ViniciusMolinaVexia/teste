if (typeof gafisa.alphabook.admin.usuario == 'undefined') { gafisa.alphabook.admin.usuario = new Object(); }

gafisa.alphabook.admin.usuario.editar = {
    inicializar: function () {
        gafisa.alphabook.admin.usuario.editar.registrarAcoes();
    },

    registrarAcoes: function () {
        $('#salvar').livequery('click', gafisa.alphabook.admin.usuario.editar.aoSalvar);

        $('#btnBuscarUsuario').livequery('click', gafisa.alphabook.admin.usuario.editar.obterUsuario);
        $('#login').livequery('keypress', function (e) {
            if (e.keyCode == 13) {
                e.preventDefault();
                gafisa.alphabook.admin.usuario.editar.obterUsuario();
            }
        });

        $('#Departamento').livequery('change', gafisa.alphabook.admin.usuario.editar.aoAlterarDepartamento);
        $('#Cargo').livequery('change', gafisa.alphabook.admin.usuario.editar.aoAlterarCargo);
    },

    obterUsuario: function () {
        gafisa.alphabook.util.obterUsuario($('#login').val());
    },

    aoSalvar: function () {
        $.loading({ action: 'show' });
        var url = gafisa.alphabook.rotas.admin.salvarUsuario;
        var parametros = $('#form').formToJSON();
        $.post(url, parametros, gafisa.alphabook.admin.usuario.editar.aposSalvar, 'json');
    },

    aposSalvar: function (json) {
        if (json.sucesso) {
            gafisa.alphabook.mensagens.exibirMensagemConfirmacao(gafisa.mensagens.comum.salvoComSucesso.format('Usuário'), function() {
                $.loading({ action: 'hide' });
                window.location.href = gafisa.alphabook.rotas.admin.usuario;
            });
        } else {
            $.loading({ action: 'hide' });
            gafisa.alphabook.mensagens.exibirMensagemErro(json.erros != null ? json.erros[0] : json.erro);
        }        
    },

    aoAlterarDepartamento: function () {
        if ($('#Departamento').val() == '' || $('#Cargo').val() == '') {
            $('#UsuarioCoordenador option[value!=""]').remove();
            return;
        }

        $('#UsuarioCoordenador').fillSelect(gafisa.alphabook.rotas.admin.listarSuperiores, { usuarioId: $('#Id').val(), departamentoId: $('#Departamento').val(), cargoId: $('#Cargo').val() }, 'Selecione');
    },
    
    aoAlterarCargo: function () {
        if ($('#Departamento').val() == '' || $('#Cargo').val() == '') {
            $('#UsuarioCoordenador option[value!=""]').remove();
            return;
        }

        $('#UsuarioCoordenador').fillSelect(gafisa.alphabook.rotas.admin.listarSuperiores, { usuarioId: $('#Id').val(), departamentoId: $('#Departamento').val(), cargoId: $('#Cargo').val() }, 'Selecione');
    }
};

$(document).ready(gafisa.alphabook.admin.usuario.editar.inicializar);
