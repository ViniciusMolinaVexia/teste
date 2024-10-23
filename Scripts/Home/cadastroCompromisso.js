if (typeof gafisa.alphabook.home == 'undefined') { gafisa.alphabook.home = new Object(); }

gafisa.alphabook.home.cadastroCompromisso = {
    inicializar: function () {
        gafisa.alphabook.home.cadastroCompromisso.registrarAcoes();
    },

    registrarAcoes: function () {
        //gafisa.alphabook.home.cadastroCompromisso.carregarComponenteData();
        $('#diaTodo').click(gafisa.alphabook.home.cadastroCompromisso.aoClicarDiaTodo);
        $('#salvarCompromisso').click(gafisa.alphabook.home.cadastroCompromisso.aoSalvar);

        if ($('.modalCriarEventoAgenda').data('id') != 0) {
            $('#salvarCompromissoAgenda textarea').val($('#txtMensagem').val());
            $('#salvarCompromisso').text('Alterar');
        }
    },


    carregaComponente: function () {
        $('#DataInicio').datepicker({ target: '.modalCriarEventoAgenda' });
        $('#HoraInicio').timepicker();
        $('#DataFinal').datepicker({ target: '.modalCriarEventoAgenda' });
        $('#HoraFinal').timepicker();
        var html = $('#componentePostagemHome').html();

        $('#componentePostagemHome').html('');
        $('#componentePostagemCompromisso').html(html);
        $('#lnkProjeto').siblings().hide();
        gafisa.alphabook.home.postagem.inicializarPostagem();


        if ($('.modalCriarEventoAgenda').data('id') != 0 && $('#txtProjetoId').data('id') != 0) {
            var projetoId = $('#txtProjetoId').data('id');
            var nomeProjeto = $('#txtNomeProjeto').val();
            $('#lnkProjeto').data('id', projetoId);
            $('#lnkProjeto').data('nome', nomeProjeto);
            $('#lnkProjeto').tooltip('destroy');
            $('#lnkProjeto').attr('title', nomeProjeto);
            gafisa.alphabook.home.postagem.fecharPopoverProjeto();
        }

        else if ($('body').data('projetoPost') != undefined) {
            gafisa.alphabook.home.postagem.aoSelecionarProjetoPost($('body').data('projetoPost'), true);
        }
    },

    aoClicarDiaTodo: function () {

        if ($(this).is(':checked')) {
            $('#labelDatainicial').text('Data inicial:');
            $('#labelDataFinal').text('Data final:');
            $('#HoraInicio').val('00:00').timepicker('disable').removeClass('obrigatorio');
            $('#HoraFinal').val('00:00').timepicker('disable').removeClass('obrigatorio');
        }
        else {
            $('#labelDatainicial').text('Data e hora inicial:');
            $('#labelDataFinal').text('Data e hora final:');
            $('#HoraInicio').timepicker('enable').addClass('obrigatorio'); ;
            $('#HoraFinal').timepicker('enable').addClass('obrigatorio'); ;
        }
    },

    validar: function () {
        if (String.isNullOrEmpty($.trim($('#DataInicio').val()))) {
            $('#dataInicio').focus();
            return gafisa.mensagens.comum.obrigatorio.format('Data inicial');
        }

        if (!gafisa.alphabook.validar.data($.trim($('#DataInicio').val()))) {
            $('#dataInicio').focus();
            return gafisa.mensagens.comum.invalida.format('Data inicial');
        }

        if (String.isNullOrEmpty($.trim($('#DataFinal').val()))) {
            $('#dataFinal').focus();
            return gafisa.mensagens.comum.obrigatorio.format('Data final');
        }

        if (!gafisa.alphabook.validar.data($.trim($('#DataFinal').val()))) {
            $('#dataFinal').focus();
            return gafisa.mensagens.comum.invalida.format('Data final');
        }

        if (!$("#diaTodo").is(':checked')) {
            if (String.isNullOrEmpty($.trim($('#HoraInicio').val()))) {
                $('#HoraInicio').focus();
                return gafisa.mensagens.comum.obrigatorio.format('Hora inicial');
            }

            if (!gafisa.alphabook.validar.horaminuto($.trim($('#HoraInicio').val()))) {
                $('#HoraInicio').focus();
                return gafisa.mensagens.comum.invalida.format('Hora inicial');
            }

            if (String.isNullOrEmpty($.trim($('#HoraFinal').val()))) {
                $('#HoraFinal').focus();
                return gafisa.mensagens.comum.obrigatorio.format('Hora final');
            }

            if (!gafisa.alphabook.validar.horaminuto($.trim($('#HoraFinal').val()))) {
                $('#HoraFinal').focus();
                return gafisa.mensagens.comum.invalida.format('Hora final');
            }
        }

        return null;
    },

    aoSalvar: function (e) {
        e.preventDefault();
        $('.obrigatorio').css({ 'border-color': '#000' });
        var erro = gafisa.alphabook.home.cadastroCompromisso.validar();

        if (String.isNullOrEmpty(erro)) {
            var data = $('#salvarCompromissoAgenda').serialize();
            data = data + "&Mensagem=" + $('#salvarCompromissoAgenda textarea').val() + "&ProjetoId=" + $('#lnkProjeto').data('id') + "&Id=" + $('.modalCriarEventoAgenda').data('id') + "&ExchangeId=" + $('#txtExchangeId').val() + '&usuarioId=' + $('#salvarCompromissoAgenda').data('usuarioid') + '&DiaTodo=' + $("#diaTodo").is(':checked');
            $.loading({
                url: gafisa.alphabook.rotas.agenda.salvarCompromisso,
                data: data,
                type: 'post',
                success: gafisa.alphabook.home.cadastroCompromisso.aposSalvar
            });
        }
        else {

            gafisa.alphabook.mensagens.exibirMensagemErro(erro);
            $('.obrigatorio').each(function () {
                if (String.isNullOrWhiteSpace($(this).val())) {
                    $(this).css({ 'border-color': 'red' });
                }
            });
        }
    },

    aposSalvar: function (json) {
        if (json.sucesso) {
            $('#modalCompromissosAgenda').animate({ width: 'toggle' }, 'fast', function () {
                gafisa.alphabook.home.cadastroCompromisso.limparCampos();
                gafisa.alphabook.home.agenda.moverComponentePostagem();
                gafisa.alphabook.home.agenda.aoAbrirModalCompromissos();
                $('#modalCompromissosAgenda').animate({ width: 'toggle' });
                gafisa.alphabook.mensagens.exibirMensagemConfirmacao(gafisa.mensagens.comum.salvoComSucesso.format('Compromisso'));
            });
        }
        else {
            afisa.alphabook.mensagens.exibirMensagemErro(json.erros);
        }
    },

    limparCampos: function () {
        $('#dataInicio').val('');
        $('#dataFinal').val('');
        $('#compromissoAssunto').val('');
        $('#compromissoLocal').val('');
        $('#salvarCompromissoAgenda textarea').val('');
        $('#txtProjeto').val('');
        $('#Lembrete option').each(function () {
            if ($(this).val() == '') {
                $(this).attr('selected', true);
            }
        });

        gafisa.alphabook.home.postagem.inicializarPostagem();

        if ($('body').data('projetoPost') != undefined)
            gafisa.alphabook.home.postagem.aoSelecionarProjetoPost($('body').data('projetoPost'), true);
    }
};