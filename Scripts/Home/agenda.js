if (typeof gafisa.alphabook.home == 'undefined') { gafisa.alphabook.home = new Object(); }

gafisa.alphabook.home.agenda = {
    inicializar: function () {
        gafisa.alphabook.home.agenda.registrarAcoes();

        var isHome = !$('#ProjetoId').val();
        if (isHome) gafisa.alphabook.home.agenda.obterCompromissosTile();
    },

    registrarAcoes: function () {
        $("#tileAgenda").livequery('click', gafisa.alphabook.home.agenda.aoClicarTile);
        $('.section-right .linha-agenda').livequery('click', gafisa.alphabook.home.agenda.aoEditarCompromisso);
        $("#criarCompromisso").livequery('click', gafisa.alphabook.home.agenda.aoCriarCompromisso);
        $('.btAtribuirResponsavel').livequery('click', gafisa.alphabook.home.agenda.aoAtribuirResponsavel);
        $('#btnFiltrarAgenda').livequery('click', gafisa.alphabook.home.agenda.aoFiltrarAgenda);
        $('#txtTexto').onPressEnter(gafisa.alphabook.home.agenda.aoFiltrarAgenda);
        $('.btExcluirCompromisso').livequery('click', gafisa.alphabook.home.agenda.aoExcluirCompromisso);
        $('.btEditar').livequery('click', gafisa.alphabook.home.agenda.aoEditarCompromisso);
        $('#btnSalvarCompromisso').livequery('click', gafisa.alphabook.home.agenda.aoSalvarCompromisso);
        $('#formCompromisso input').onPressEnter(gafisa.alphabook.home.agenda.aoSalvarCompromisso);
        $('#txtDataInicioEdicao').livequery(function () { $(this).setMask({ mask: '99/99/9999', autoTab: false }); });
        $('#txtDataFimEdicao').livequery(function () { $(this).setMask({ mask: '99/99/9999', autoTab: false }); });
        $('#txtHoraInicioEdicao').livequery(function () { $(this).setMask({ mask: '99:99', autoTab: false }); });
        $('#txtHoraFimEdicao').livequery(function () { $(this).setMask({ mask: '99:99', autoTab: false }); });
        $('#CEP').livequery(function () { $(this).setMask({ mask: '99999-999', autoTab: false }); });

        $('#chkConcluidoEdicao').livequery('click', gafisa.alphabook.home.agenda.aoClicarEmAtividadeConcluida);
        $('#StatusCompromisso').livequery('change', gafisa.alphabook.home.agenda.aoAlterarStatusCompromisso);

        $('#cidade').livequery('click', gafisa.alphabook.home.agenda.configurarDadosAutocomplete);
        $('#Estado').livequery('click', gafisa.alphabook.home.agenda.aoSelecionarEstado);

        $('#chkDiaTodoEdicao').livequery('click', gafisa.alphabook.home.agenda.aoSelecionarDiaTodo);
        $('#btnBuscarLocalContato').livequery('click', gafisa.alphabook.home.agenda.aoAssociarUmContato);
        $('#btnExcluirContato').livequery('click', gafisa.alphabook.home.agenda.aoExcluirLocalContato);

        $('#txtDataInicio').livequery(gafisa.alphabook.home.agenda.definirDatePicker);
        $('#txtDataFim').livequery(gafisa.alphabook.home.agenda.definirDatePicker);

        $('#icoDataInicio').livequery('click', gafisa.alphabook.home.agenda.aoClicarIcoData);
        $('#icoDataFim').livequery('click', gafisa.alphabook.home.agenda.aoClicarIcoData);

        $('#icoDataInicioEdicao').livequery('click', gafisa.alphabook.home.agenda.aoClicarIcoDataEdicao);
        $('#icoDataFimEdicao').livequery('click', gafisa.alphabook.home.agenda.aoClicarIcoDataEdicao);
        $('.ico-convidados-agend-list').livequery('mouseenter', gafisa.alphabook.home.agenda.aoAbrirConvidados);
        $('.ico-convidados-agend-list').livequery('mouseleave', gafisa.alphabook.home.agenda.aoFecharConvidados);
    },

    aoClicarTile: function () {
        if (!$(this).hasClass('inativo')) {
            var data = {};
            data.podeCriarCompromisso = gafisa.alphabook.home.carrossel.estaNoProjeto();
            data.idProjeto = gafisa.alphabook.home.carrossel.obterIdProjeto();
            $.navegar.proximo(gafisa.alphabook.rotas.agenda.agenda, data, gafisa.alphabook.home.agenda.aoExibirAgendaHomeInicial);
        }
    },

    aoExibirAgendaHomeInicial: function (ids) {
        var homeProjeto = gafisa.alphabook.home.carrossel.estaNoProjeto();
        var idProjeto = null;
        var idsCompromissos = null;

        if (homeProjeto)
            idProjeto = gafisa.alphabook.home.carrossel.obterIdProjeto();

        if (ids) {
            $('.filtro-agenda').data('ids', ids);
            idsCompromissos = ids;
            idProjeto = null;
        }

        $('#tabelaAgenda').tabela({ action: gafisa.alphabook.rotas.agenda.listarCompromissos, tamanhoPagina: 15, parametros: { ordenacao: 2, tipo: 1, pagina: 1, homeProjeto: homeProjeto, idProjeto: idProjeto, idsCompromissos: idsCompromissos, tamanhoPagina: 15} });
    },

    definirDatePicker: function () {
        $(this).datepicker();
    },

    configurarAutoCompleteConvidados: function () {
        $('#convidadosCompromisso').fcbkcomplete({
            json_url: gafisa.alphabook.rotas.agenda.listarConvidados,
            cache: true,
            newel: false,
            maxitems: 999,
            complete_text: "Digite o nome de um convidado",
            width: 892,
            bricket: false
        });

        var convidados = $('#formCompromisso .textarea-convidados-compromisso').data('source');

        if (typeof (convidados) == 'string' && convidados != '')
            convidados = JSON.parse(convidados);

        if (convidados != null && convidados != undefined && convidados != '') {
            $.each(convidados, function (index, value) {
                $('#convidadosCompromisso').trigger('addItem', [{ 'title': value.Nome + ' ' + value.Sobrenome, 'value': value.Id }]);
            });
        }

        setTimeout($.navegar.ajustarRodape, 1000);
    },

    aoAbrirConvidados: function () {
        var box = $(this).siblings('.box-lista-convidados');

        if (box.hasClass('hide'))
            box.removeClass('hide');
    },

    aoFecharConvidados: function () {
        var box = $(this).siblings('.box-lista-convidados');

        if (!box.hasClass('hide'))
            box.addClass('hide');
    },

    aoCriarCompromisso: function () {
        var homeProjeto = gafisa.alphabook.home.carrossel.estaNoProjeto();
        var idProjeto = null, idStatusProjeto = null;

        if (homeProjeto) {
            idProjeto = gafisa.alphabook.home.carrossel.obterIdProjeto();
            idStatusProjeto = gafisa.alphabook.home.carrossel.obterIdStatusProjeto();
        }
        var idContato = $('#divTabelaContato').data('id');
        $.navegar.proximo(gafisa.alphabook.rotas.agenda.editarCompromisso, { projetoId: idProjeto, statusProjetoId: idStatusProjeto }, gafisa.alphabook.home.agenda.aoAbrirTelaEdicaoCompromisso);
    },

    aoAbrirTelaEdicaoCompromisso: function (contatoId) {

        gafisa.alphabook.home.agenda.definirComponenteDataHora();

        var idContato;

        if (typeof contatoId != 'undefined')
            idContato = contatoId;
        else
            idContato = $('#divTabelaContato').data('id');

        if (idContato > 0) {
            $.post(gafisa.alphabook.rotas.contatos.obterLocalContato, { idContato: idContato }, function (html) {
                if (!String.isNullOrWhiteSpace(html)) {
                    $('#divTabelaContato').html(html);
                }
            }, "html");

            var classeIcoExcluir = $('#chkConcluidoEdicao').is(':checked') ? "ico-excluir-inativo inativo" : "ico-excluir";

            $('#btnExcluirContato').livequery(function () { $(this).removeClass().addClass(classeIcoExcluir); });
        }

        if ($('#chkConcluidoEdicao').is(':checked')) {
            $('#Lembrete').livequery(function () { $(this).attr('disabled', 'disabled'); });
            $('#estado').livequery(function () { $(this).attr('disabled', 'disabled'); });
        }
        else {
            $('#Lembrete').livequery(function () { $(this).removeAttr('disabled'); });
            $('#estado').livequery(function () { $(this).removeAttr('disabled'); });
        }

        gafisa.alphabook.home.agenda.configurarDadosAutocomplete();
    },

    aoAtribuirResponsavel: function () {
        var compromissoId = $(this).data('compromissoid');
        $.dialogo.confirmar(gafisa.mensagens.agenda.mensagemConfirmacaoAssumirCompromisso, function () { gafisa.alphabook.home.agenda.aoConfirmarAtribuicaoResponsavel(compromissoId); }, null);
    },

    aoConfirmarAtribuicaoResponsavel: function (compromissoId) {
        $.loading({ action: 'show' });
        var data = { idCompromisso: compromissoId };
        $.post(gafisa.alphabook.rotas.agenda.assumirCompromisso, data, gafisa.alphabook.home.agenda.aposAtribuirResponsavel);
    },

    aposAtribuirResponsavel: function (json) {
        if (json.sucesso) {
            gafisa.alphabook.mensagens.exibirMensagemConfirmacao(gafisa.mensagens.agenda.compromissoAssumidoComSucesso);
            gafisa.alphabook.home.agenda.aoFiltrarAgenda();
        }
        else {
            if (typeof json.erros != 'undefined' && json.erros != null) {
                gafisa.alphabook.mensagens.exibirMensagemErro(json.erros[0]);
            }
            else if (typeof json.mensagem != 'undefined' && json.mensagem != null) {
                gafisa.alphabook.mensagens.exibirMensagemErro(json.mensagem);
            }
            else {
                gafisa.alphabook.mensagens.exibirMensagemErro(gafisa.mensagens.agenda.compromissoAssumidoComErro);
            }
        }

        $.loading({ action: 'hide' });
    },

    aoFiltrarAgenda: function () {
        var data = gafisa.alphabook.home.agenda.retornarFiltros();
        if ((data.dataInicio != null && data.dataFim == null)
           || (data.dataInicio == null && data.dataFim != null)) {
            gafisa.alphabook.mensagens.exibirMensagemErro(gafisa.mensagens.agenda.dataInicioEFimDevemSerInformadas);
            return;
        }

        $('#tabelaAgenda').tabela({ acao: "carregar", parametros: data });
    },

    retornarFiltros: function () {
        var data = {};

        var homeProjeto = gafisa.alphabook.home.carrossel.estaNoProjeto();

        data.ordenacao = 2;
        data.tipo = 1;
        data.pagina = 1;
        data.tamanhoPagina = 15;
        data.status = $('#Status').val() != "" ? $('#Status').val() : null;
        data.dataInicio = $('#txtDataInicio').val() != "" ? $('#txtDataInicio').val() : null;
        data.dataFim = $('#txtDataFim').val() != "" ? $('#txtDataFim').val() : null;
        data.texto = $('#txtTexto').val() != "" ? $('#txtTexto').val() : null;
        data.homeProjeto = homeProjeto;

        var idProjeto = gafisa.alphabook.home.carrossel.obterIdProjeto();

        data.idProjeto = idProjeto > 0 ? idProjeto : null;

        if (typeof ids != 'undefined' && ids) {
            $('.filtro-agenda').data('ids', ids);
            data.idsCompromissos = ids;
            data.idProjeto = null;
        }

        return data;
    },

    aoExcluirCompromisso: function () {

        $.loading({ action: 'show' });

        var $btnExcluir = $(this);
        $btnExcluir.parent().parent().addClass('excluido');
        var idCompromisso = $btnExcluir.parent().parent().data('id');
        var idProjeto = $btnExcluir.parent().parent().find('.nomeProjeto').data('id');
        var data = { idCompromisso: idCompromisso, idProjeto: idProjeto };
        $.post(gafisa.alphabook.rotas.agenda.excluirCompromisso, data, gafisa.alphabook.home.agenda.aposExcluirCompromisso);
    },

    aposExcluirCompromisso: function (json) {
        if (json.sucesso) {
            $('tr.excluido')
                .slideUp(500, function () {
                    gafisa.alphabook.mensagens.exibirMensagemConfirmacao(gafisa.mensagens.agenda.compromissoExcluidoComSucesso);
                });
        }
        else {
            if (typeof json.erros != 'undefined') {
                gafisa.alphabook.mensagens.exibirMensagemErro(json.erros[0]);
            }
            else if (typeof json.mensagem != 'undefined' && json.mensagem != null) {
                gafisa.alphabook.mensagens.exibirMensagemErro(json.mensagem);
            }
            else {
                gafisa.alphabook.mensagens.exibirMensagemErro(json.mensagem);
            }
        }

        $.loading({ action: 'hide' });
    },

    validar: function () {
        if (String.isNullOrEmpty($.trim($('#txtDataInicioEdicao').val()))) {
            //$('#txtDataInicioEdicao').focus();
            return gafisa.mensagens.comum.obrigatoria.format('Data inicial');
        }

        if (!gafisa.alphabook.validar.data($.trim($('#txtDataInicioEdicao').val()))) {
            //$('#txtDataInicioEdicao').focus();
            return gafisa.mensagens.comum.invalida.format('Data inicial');
        }

        if (String.isNullOrEmpty($.trim($('#txtDataFimEdicao').val()))) {
            //$('#txtDataFimEdicao').focus();
            return gafisa.mensagens.comum.obrigatoria.format('Data final');
        }

        if (!gafisa.alphabook.validar.data($.trim($('#txtDataFimEdicao').val()))) {
            //$('#txtDataFimEdicao').focus();
            return gafisa.mensagens.comum.invalida.format('Data final');
        }

        if (!$("#chkDiaTodoEdicao").is(':checked')) {
            if (String.isNullOrEmpty($.trim($('#txtHoraInicioEdicao').val()))) {
                //$('#txtHoraInicioEdicao').focus();
                return gafisa.mensagens.comum.obrigatoria.format('Hora inicial');
            }

            if (!gafisa.alphabook.validar.horaminuto($.trim($('#txtHoraInicioEdicao').val()))) {
                //$('#txtHoraInicioEdicao').focus();
                return gafisa.mensagens.comum.invalida.format('Hora inicial');
            }

            if (String.isNullOrEmpty($.trim($('#txtHoraFimEdicao').val()))) {
                //$('#txtHoraFimEdicao').focus();
                return gafisa.mensagens.comum.obrigatoria.format('Hora final');
            }

            if (!gafisa.alphabook.validar.horaminuto($.trim($('#txtHoraFimEdicao').val()))) {
                //$('#txtHoraFimEdicao').focus();
                return gafisa.mensagens.comum.invalida.format('Hora final');
            }
        }

        return null;
    },

    aoSalvarCompromisso: function () {
        if ($(this).hasClass('bt-padrao-inativo'))
            return;

        var erro = gafisa.alphabook.home.agenda.validar();

        if (!String.isNullOrEmpty(erro)) {
            gafisa.alphabook.mensagens.exibirMensagemErro(erro);
            return;
        }

        $.loading({ action: 'show' });

        var data = new Object();

        var localContato = $('#dadoscontato').data('id') > 0 ? true : false;

        data.ContatoId = localContato ? $('#dadoscontato').data('id') : null;

        $('#btnSalvarCompromisso').attr('disabled', 'disabled');

        data.Id = $('#frmCompromisso').data('id') != "" ? $('#frmCompromisso').data('id') : null;
        data.ProjetoId = $('#frmCompromisso').data('projeto') != "" ? $('#frmCompromisso').data('projeto') : null;
        data.StatusProjetoId = $('#frmCompromisso').data('statusprojeto') != "" ? $('#frmCompromisso').data('statusprojeto') : null;
        data.UsuarioResponsavelId = $('#frmCompromisso').data('responsavel') != "" ? $('#frmCompromisso').data('responsavel') : null;
        data.DataInicio = $('#txtDataInicioEdicao').val() != "" ? $('#txtDataInicioEdicao').val() : null;
        data.HoraInicio = $('#txtHoraInicioEdicao').val() != "" ? $('#txtHoraInicioEdicao').val() : null;
        data.HoraTermino = $('#txtHoraFimEdicao').val() != "" ? $('#txtHoraFimEdicao').val() : null;
        data.DataTermino = $('#txtDataFimEdicao').val() != "" ? $('#txtDataFimEdicao').val() : null;
        data.DiaTodo = $('#chkDiaTodoEdicao').is(':checked');
        data.Lembrete = $('#Lembrete').val() != "" ? $('#Lembrete').val() : 0;
        data.Concluido = $('#chkConcluidoEdicao').is(':checked');
        data.Assunto = $('#txtAssuntoEdicao').val() != "" ? $('#txtAssuntoEdicao').val() : null;
        data.ComentariosGerais = $('#txtComentariosGerais').val() != "" ? $('#txtComentariosGerais').val() : null;

        if (!localContato) {
            data.ContatoId = null;
            var cep = $('#CEP').val();
            cep = cep.replace("-", "");
            data.Cep = cep != "" ? cep : null;

            data.Logradouro = $('#Logradouro').val() != "" ? $('#Logradouro').val() : null;
            data.Numero = $('#Numero').val() != "" ? $('#Numero').val() : null;
            data.Complemento = $('#Complemento').val() != "" ? $('#Complemento').val() : null;
            data.Bairro = $('#Bairro').val() != "" ? $('#Bairro').val() : null;
            data.Cidade = $('#cidade').val() != "" ? $('#cidade').val() : null;
            data.CidadeId = $('#cidade').data('id') != null ? $('#cidade').data('id') : null;
            data.Uf = $('#Estado').val() != "" ? $('#Estado').val() : null;
        }

        data.Contato = $(this).data('contato');

        if ($('#convidadosCompromisso option').val() != null && $('#convidadosCompromisso option').val() != '') {
            data.ConvidadosIds = [];
            $('#convidadosCompromisso option').each(function(i, e) {
                data.ConvidadosIds.push($(e).val());
            });
        }

        $.post(gafisa.alphabook.rotas.agenda.salvarCompromisso, data, gafisa.alphabook.home.agenda.aposSalvarCompromisso);
    },

    aposSalvarCompromisso: function (json) {
        $.loading({ action: 'hide' });

        $('#btnSalvarCompromisso').removeAttr('disabled');
        gafisa.alphabook.notificacao.atualizarQuantidadeNotificacoes();

        if (json.sucesso) {
            gafisa.alphabook.mensagens.exibirMensagemConfirmacao(gafisa.mensagens.agenda.compromissoSalvoComSucesso);

            if (json.contato)
                $.navegar.anterior(gafisa.alphabook.home.contatos.aoExibirAbaAgenda);
            else
                gafisa.alphabook.home.agenda.aoClicarTile();
        }
        else {
            if (typeof json.erros != 'undefined')
                gafisa.alphabook.mensagens.exibirMensagemErro(json.erros[0]);
            else if (typeof json.mensagem != 'undefined')
                gafisa.alphabook.mensagens.exibirMensagemErro(json.mensagem);
            else
                gafisa.alphabook.mensagens.exibirMensagemErro(gafisa.mensagens.agenda.compromissoSalvoComErro);
        }
    },

    aoEditarCompromisso: function (e) {
        e.stopPropagation();

        var $btnEditar = $(this);
        var idCompromisso = $btnEditar.data('id');
        var idUsuario = $btnEditar.data('responsavel');
        var data = { compromissoId: idCompromisso, usuarioId: idUsuario };

        $.navegar.proximo(gafisa.alphabook.rotas.agenda.editarCompromisso, data, gafisa.alphabook.home.agenda.aoAbrirTelaEdicaoCompromisso);
    },

    aposEditarCompromisso: function (json) {
        if (json.sucesso)
            gafisa.alphabook.mensagens.exibirMensagemConfirmacao(gafisa.mensagens.agenda.compromissoSalvoComSucesso);
        else {
            if (typeof json.erros != 'undefined')
                gafisa.alphabook.mensagens.exibirMensagemErro(json.erros[0]);
            else if (typeof json.mensagem != 'undefined' && json.mensagem != null)
                gafisa.alphabook.mensagens.exibirMensagemErro(json.mensagem);
            else
                gafisa.alphabook.mensagens.exibirMensagemErro(gafisa.mensagens.agenda.compromissoSalvoComErro);
        }
    },

    aoClicarEmAtividadeConcluida: function () {
        if ($(this).is(':checked'))
            $('#StatusCompromisso').val('Concluido');
    },

    aoAlterarStatusCompromisso: function () {
        if ($(this).val() == 'Concluido')
            $('#chkConcluidoEdicao').trigger('click');
        else
            $('#chkConcluidoEdicao').removeAttr('checked');
    },

    aoSelecionarEstado: function () {
        $('#cidade').val('');
        gafisa.alphabook.home.agenda.configurarDadosAutocomplete();
    },

    configurarDadosAutocomplete: function () {
        if ($('#Estado').val() == '') {
            $("#cidade").disable(true);
        } else {
            $('#cidade').autocomplete({
                open: function () {
                    setTimeout(function () {
                        $('.ui-autocomplete').css('z-index', 289);
                    }, 0);
                },
                source: gafisa.alphabook.home.agenda.carregarDadosAutocomplete,
                minLength: 2,
                select: function (event, ui) {
                    $('#cidade').data('id', ui.item.Id);
                }
            });
            $("#cidade").disable(false);
        }
    },

    carregarDadosAutocomplete: function (request, response) {
        $.ajax({
            url: gafisa.alphabook.rotas.contatos.listarCidadesAutocomplete,
            type: "POST",
            dataType: "json",
            data: { chave: $('#cidade').val(), uf: $("#Estado").val() },
            success: function (data) {
                response($.map(data, function (item) {
                    return { label: item.value, value: item.value, Id: item.key };
                }));
            }
        });
    },

    aoSelecionarDiaTodo: function () {
        if ($(this).is(':checked')) {
            $('#txtHoraInicioEdicao').val('');
            $('#txtHoraFimEdicao').val('');
            $('#txtHoraInicioEdicao').attr('disabled', 'disabled');
            $('#txtHoraFimEdicao').attr('disabled', 'disabled');
        }
        else {
            $('#txtHoraInicioEdicao').removeAttr('disabled');
            $('#txtHoraFimEdicao').removeAttr('disabled');
        }
    },

    obterCompromissosTile: function () {
        $('#tileAgenda .section-right').fadeOut('fast', function () {
            $('#carregandoCompromissos').fadeIn('fast', function () {
                var idProjeto = gafisa.alphabook.home.carrossel.obterIdProjeto();
                idProjeto = idProjeto == 0 ? null : idProjeto;

                $.get(gafisa.alphabook.rotas.agenda.listarCompromissos,
                {
                    homeProjeto: (idProjeto != null),
                    idProjeto: idProjeto,
                    ordenacao: 2,
                    tipo: 1,
                    pagina: 1,
                    tamanhoPagina: 3,
                    tipoInterface: 0,
                    status: 'Agendado'
                }, function (html) {
                    gafisa.alphabook.home.agenda.preencherTileCompromissos(html);
                }, "html");
            });
        });
    },

    preencherTileCompromissos: function (html) {
        if (!String.isNullOrWhiteSpace(html)) {
            $('#tileAgenda .section-right').html(html);
            $('#carregandoCompromissos').fadeOut('fast', function () {
                $('#tileAgenda .section-right').fadeIn('fast');
            });
        };
    },

    aoAssociarUmContato: function () {
        if ($(this).hasClass('bt-padrao-inativo'))
            return;

        $.dialogo.selecionarContato({ tipo: 'local', aoSelecionar: gafisa.alphabook.home.agenda.aoSelecionarContato });
    },

    aoSelecionarContato: function (idContato) {

        gafisa.alphabook.home.agenda.definirComponenteDataHora();

        $.post(gafisa.alphabook.rotas.contatos.obterLocalContato, { idContato: idContato }, function (html) {
            $('#formEnderecoContato').fadeOut('fast', function () {
                if (!String.isNullOrWhiteSpace(html)) {
                    $('#divTabelaContato').html(html).fadeIn('fast');
                }
            });
        }, "html");
    },

    aoExcluirLocalContato: function () {
        if ($(this).hasClass('inativo'))
            return;

        $('#divTabelaContato').html('').fadeOut('fast', function () {
            $('#formEnderecoContato').fadeIn('fast', function () {
                $('#dadoscontato').data('id', 0);
            });
        });
    },

    definirComponenteDataHora: function () {
        $('#txtDataInicioEdicao').livequery(function () {
            $(this).datetimepicker({
                altField: '#txtHoraInicioEdicao'
            });
        });

        $('#txtDataFimEdicao').livequery(function () {
            $(this).datetimepicker({
                altField: '#txtHoraFimEdicao'
            });
        });
    },

    aoClicarIcoData: function (e) {
        e.preventDefault();
        $(this).prev().focus();
    },

    aoClicarIcoDataEdicao: function (e) {
        e.preventDefault();

        if ($(this).hasClass('inativo'))
            return;

        $(this).parent().prev().prev().find('input').focus();
    }
};

$(document).ready(gafisa.alphabook.home.agenda.inicializar);
