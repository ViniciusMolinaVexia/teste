if (typeof gafisa.alphabook.home == 'undefined') { gafisa.alphabook.home = new Object(); }

gafisa.alphabook.home.projetosDepartamento = {
    inicializar: function () {
        gafisa.alphabook.home.projetosDepartamento.registrarAcoes();
    },

    registrarAcoes: function () {
        $('#tileProjetosDepartamento').livequery('click', gafisa.alphabook.home.projetosDepartamento.aoClicarTile);
        $('.contatoPrincipalDepartamento').livequery('click', gafisa.alphabook.home.projetosDepartamento.aoClicarNoContato);
        $('a.btnFiltroProjetosDepartamento').livequery('click', gafisa.alphabook.home.projetosDepartamento.aoFiltrarProjetosDepartamento);
        $('input.filtroCarrousselProjetosDepartamento ').onPressEnter(gafisa.alphabook.home.projetosDepartamento.aoFiltrarProjetosDepartamento);
        $('tr td a.lnkProjetoDepartamento').livequery('click', gafisa.alphabook.home.projetosDepartamento.aoClicarNoCodigoDoProjeto);
        $('#Estado').livequery('click', gafisa.alphabook.home.projetosDepartamento.aoSelecionarEstado);
        $('#chkFiltrosProjetosDepartamento').livequery('click', gafisa.alphabook.home.projetosDepartamento.aoClicarCheckFiltros);
        $('.btnResponsavelProjetosDepartamento').livequery('click', gafisa.alphabook.home.projetosDepartamento.aoClicarNoResponsavel);
        $('.trocarResponsavel').livequery('click', gafisa.alphabook.home.projetosDepartamento.aoTrocarResponsavel);

        $('#incluirProjeto').livequery('click', gafisa.alphabook.home.projetosDepartamento.aoIncluirProjeto);
        $('#adicionaResponsavelProjeto').livequery('click', gafisa.alphabook.home.projetosDepartamento.aoEditarResponsavelProjeto);
        $('#botaoIncluirProjeto').livequery('click', gafisa.alphabook.home.projetosDepartamento.aoSalvarProjeto);
        $('#EstadoModal').livequery('change', function () { gafisa.alphabook.home.projetosDepartamento.aoAlterarEstado(true); });
        $('#EstadoSecundarioModal').livequery('change', function () { gafisa.alphabook.home.projetosDepartamento.aoAlterarEstado(false); });

        $('#botaoAdicionarCidadeSecundaria').livequery('click', gafisa.alphabook.home.projetosDepartamento.aoAdicionarCidadeSecundaria);
        $('#botaoRemoverCidadeSecundaria').livequery('click', gafisa.alphabook.home.projetosDepartamento.aoRemoverCidadeSecundaria);
    },

    aoClicarTile: function () {
        if (!$(this).hasClass('inativo'))
            $.navegar.proximo(gafisa.alphabook.rotas.projetosDepartamento.projetosDepartamento, null, gafisa.alphabook.home.projetosDepartamento.aoExibirTela);
    },

    aoExibirTela: function (idsProjetos) {
        $('#campoBuscaGeral').attr('watermark', 'Busca geral');
        if (idsProjetos)
            $('#tituloProjetosDepartamento').fadeOut('fast', function () {
                $(this).html('Projetos');
                $('#tituloProjetosDepartamento').fadeIn();
            });

        $('#chkFiltrosProjetosDepartamento').attr('checked', 'checked');
        $('.projetos-depto #Estado').multiselect('option', 'noneSelectedText', 'UF');
        $('.projetos-depto #Status').multiselect('option', 'noneSelectedText', 'Status');

        var data = gafisa.alphabook.home.projetosDepartamento.retornarFiltros(idsProjetos);
        $('#tabelaProjetosDepartamento').tabela({ action: gafisa.alphabook.rotas.projetosDepartamento.listarProjetosDepartamento, parametros: data, tamanhoPagina: 20 });

        gafisa.alphabook.home.projetosDepartamento.limparFiltros();

        $('.contatoPrincipalToolTipProjetosDepartamento', '.projetosDepartamento')
            .hide()
            .data('fechado', true)
            .clickOutSide(gafisa.alphabook.home.projetosDepartamento.aoClicarForaDoToolTip);

        $('.responsavelToolTipProjetosDepartamento', '.projetosDepartamento')
            .hide()
            .data('fechado', true)
            .clickOutSide(gafisa.alphabook.home.projetosDepartamento.aoClicarForaDoToolTip);

        gafisa.alphabook.home.projetosDepartamento.configurarAutocompleteCidade();
    },

    aoClicarNoContato: function (e) {
        e.preventDefault();
        var $contatoToolTip = $('.contatoPrincipalToolTipProjetosDepartamento', '.projetosDepartamento'),
            alturaBotaoClicado = $(this).offset().top;

        if ($contatoToolTip.data('fechado')) {
            var projetoId = $(this).parent().parent().data('id');
            $.get(gafisa.alphabook.rotas.projetosRecebidos.obterContatoPrincipalProjeto, { projetoId: projetoId }, function (html) {
                if (String.isNullOrEmpty(html)) {
                    gafisa.alphabook.mensagens.exibirMensagemErro(gafisa.mensagens.comum.nenhumContatoAssociadoAoProjeto);
                } else {
                    $contatoToolTip.html(html).fadeIn('fast');
                    $contatoToolTip.data('fechado', false);
                    $contatoToolTip.offset({ top: alturaBotaoClicado - 36, left: $contatoToolTip.offset().left });

                }
            }, "html");
        }
        else {
            $contatoToolTip.fadeOut('fast');
            $contatoToolTip.data('fechado', true);
        }
    },

    aoFiltrarProjetosDepartamento: function () {
        var data = gafisa.alphabook.home.projetosDepartamento.retornarFiltros();
        $('#tabelaProjetosDepartamento').tabela({ acao: 'carregar', parametros: data });
    },

    retornarFiltros: function (idsProjetos) {
        var data = {};

        data.ordenacao = 1;
        data.tipo = 1;
        data.idUltimo = null;
        data.idStatus = $('#Status').val() != "" ? $('#Status').val() : null;
        data.nomeProjeto = $('input.filtroCarrousselProjetosDepartamento').val() != "" ? $('input.filtroCarrousselProjetosDepartamento').val() : null;
        data.cidade = $('input.cidadeProjetosDepartamento').val() != "" ? $('input.cidadeProjetosDepartamento').val() : null;
        data.estados = $('#Estado').val() != "" ? $('#Estado').val() : null;
        data.cidadeAlvo = $('input#cidadeAlvoProjetosDepartamento.checkbox').is(':checked');
        data.pagina = 1;
        data.tamanhoPagina = 20;

        if (idsProjetos)
            $('.projetosDepartamento').data('ids', idsProjetos);

        data.idsProjetos = $('.projetosDepartamento').data('ids') == "" ? null : $('.projetosDepartamento').data('ids');

        return data;
    },

    aoClicarForaDoToolTip: function () {
        gafisa.alphabook.home.projetosDepartamento.fecharToolTip();
    },

    fecharToolTip: function () {
        $('.contatoPrincipalToolTipProjetosDepartamento', '.projetosDepartamento')
            .data('fechado', true)
            .fadeOut('fast');

        $('.responsavelToolTipProjetosDepartamento', '.projetosDepartamento')
            .data('fechado', true)
            .fadeOut('fast');
    },

    aoSelecionarEstado: function () {
        $('input.cidadeProjetosDepartamento').val('');
        gafisa.alphabook.home.projetosDepartamento.configurarAutocompleteCidade();
    },

    configurarAutocompleteCidade: function () {
        if ($("#Estado").val() == "") {
            gafisa.alphabook.home.projetosDepartamento.desabilitarCampoCidade(true);
            return;
        }

        gafisa.alphabook.home.projetosDepartamento.desabilitarCampoCidade(false);

        $('input.cidadeProjetosDepartamento').autocomplete({
            open: function () {
                setTimeout(function () {
                    $('.ui-autocomplete').css('z-index', 289);
                }, 0);
            },
            source: gafisa.alphabook.home.projetosDepartamento.carregarDadosAutocomplete,
            minLength: 2,
            select: function (event, ui) {
                $('input.cidadeProjetosDepartamento').data('id', ui.item.Id);
            }
        });
    },

    desabilitarCampoCidade: function (bool) {
        var $cidade = $('input.cidadeProjetosDepartamento').disable(bool);
        if (bool)
            $cidade.val('');
    },

    carregarDadosAutocomplete: function (request, response) {
        $.ajax({
            url: gafisa.alphabook.rotas.contatos.listarCidadesAutocomplete,
            type: "POST",
            dataType: "json",
            data: { chave: $('input.cidadeProjetosDepartamento').val(), uf: $("#Estado").val() },
            success: function (data) {
                response($.map(data, function (item) {
                    return { label: item.value, value: item.value, Id: item.key };
                }));
            }
        });
    },

    aoClicarNoCodigoDoProjeto: function () {
        var id = $(this).data('id');
        window.location.href = gafisa.alphabook.rotas.home.index + 'Home/Index/' + id;
    },

    aoClicarCheckFiltros: function () {
        var $chk = $(this);
        if ($chk.is(':checked')) {
            gafisa.alphabook.home.projetosDepartamento.limparFiltros();
            var data = gafisa.alphabook.home.projetosDepartamento.retornarFiltros();
            $('#tabelaProjetosDepartamento').tabela({ acao: 'carregar', parametros: data });
        }
        else {
            gafisa.alphabook.home.projetosDepartamento.habilitarFiltros();
        }
    },

    limparFiltros: function () {
        $('input.filtroCarrousselProjetosDepartamento').val('').attr('disabled', 'disabled');
        $('input.cidadeProjetosDepartamento').val('').attr('disabled', 'disabled');
        $('input#cidadeAlvoProjetosDepartamento.checkbox').removeAttr('checked').attr('disabled', 'disabled');

        $('#Status').val('');
        $('#Status').setState('disable');

        $('#Status')
            .parent()
            .find('span')
            .filter(':last')
            .text('Status');

        $('#Estado').val('');
        $('#Estado').setState('disable');
        $('#Estado')
            .parent()
            .find('span')
            .filter(':last')
            .text('UF');
    },

    habilitarFiltros: function () {
        $('input.filtroCarrousselProjetosDepartamento').removeAttr('disabled');
        $('input.cidadeProjetosDepartamento').removeAttr('disabled');
        $('input#cidadeAlvoProjetosDepartamento.checkbox').removeAttr('disabled');

        $('#Status').setState('enable');
        $('#Estado').setState('enable');
    },

    aoClicarNoResponsavel: function (e) {
        e.preventDefault();
        var $responsavel = $('.responsavelToolTipProjetosDepartamento', '.projetosDepartamento'),
            alturaBotaoClicado = $(this).offset().top;

        if ($responsavel.data('fechado')) {
            var responsavelId = $(this).data('id');
            $.get(gafisa.alphabook.rotas.projetosDepartamento.obterResponsavelProjeto, { idUsuarioDono: responsavelId }, function (html) {
                if (String.isNullOrEmpty(html)) {
                    gafisa.alphabook.mensagens.exibirMensagemErro(gafisa.mensagens.comum.nenhumResponsavelProjeto);
                } else {
                    $responsavel.html(html).fadeIn('fast');
                    $responsavel.data('fechado', false);
                    $responsavel.offset({ top: alturaBotaoClicado - 16, left: $responsavel.offset().left });

                }
            }, "html");
        }
        else {
            $responsavel.fadeOut('fast');
            $responsavel.data('fechado', true);
        }
    },

    aoTrocarResponsavel: function () {
        $('#tabelaProjetosDepartamento tbody tr').removeClass('selecionado');
        $(this).parent().parent().addClass('selecionado');
        $.dialogo.selecionarUsuario(gafisa.alphabook.home.projetosDepartamento.aoSelecionarUsuario);
    },

    aoSelecionarUsuario: function (usuario) {
        var idUsuario = $(usuario).data('id');
        var idProjeto = $('#tabelaProjetosDepartamento tbody tr.selecionado').data('id');
        var usuarioResponsavel = $('#tabelaProjetosDepartamento tbody tr.selecionado').data('idresponsavel');

        $.dialogo.fechar(function () {
            if (usuarioResponsavel != 0)
                $.dialogo.confirmar(gafisa.mensagens.projetosdepartamento.oUsuarioResponsavelSeraNotificado, function () { gafisa.alphabook.home.projetosDepartamento.aoConfirmarAtribuicaoResponsavel(idProjeto, idUsuario); });
            else
                gafisa.alphabook.home.projetosDepartamento.aoConfirmarAtribuicaoResponsavel(idProjeto, idUsuario);
        });
    },

    aoConfirmarAtribuicaoResponsavel: function (idProjeto, idUsuario) {
        $.loading({ action: 'show' });
        $.post(gafisa.alphabook.rotas.projetosRecebidos.atribuirProjetoAUsuario, { idProjeto: idProjeto, idUsuario: idUsuario }, function (json) { gafisa.alphabook.home.projetosDepartamento.aposAtribuirResponsavelProjeto(json, idProjeto, idUsuario); });
    },

    aposAtribuirResponsavelProjeto: function (retorno, idProjeto, idUsuario) {
        if (retorno.sucesso) {

            var data = gafisa.alphabook.home.projetosDepartamento.retornarFiltros();
            $('#tabelaProjetosDepartamento').tabela({ acao: 'carregar', parametros: data });
            $.loading({ action: 'hide' });
            gafisa.alphabook.mensagens.exibirMensagemConfirmacao(gafisa.mensagens.projetosdepartamento.usuarioAtribuidoComSucesso);
        }
        else {
            $.loading({ action: 'hide' });
            gafisa.alphabook.mensagens.exibirMensagemErro(gafisa.mensagens.projetosdepartamento.falhaAoAtribuirUsuario);
        }
    },

    aoIncluirProjeto: function () {
        $.dialogo.exibir(gafisa.alphabook.rotas.projeto.incluirProjeto, null, gafisa.alphabook.home.projetosDepartamento.configurarAutoCompleteCidadeModal);
    },

    aoSalvarProjeto: function () {
        if (!gafisa.alphabook.home.projetosDepartamento.validarDadosProjeto()) return;

        $.loading({ action: 'show' });

        var data = new Object();
        data.model = $('#formDadosProjeto').formToJSON();
        data.model.ResponsavelId = $('#dadosResponsavel').data('id');
        data.model.StatusProjetoId = $('#dropdownStatusProjeto').val().split('|')[0];
        data.model.DepartamentoId = $('#dropdownStatusProjeto').val().split('|')[1];
        data.model.Status = $('#dropdownStatusProjeto option:selected').text();
        data.model.Comite = Boolean($('input[name=Comite]:checked').val());
        data.model.CidadeId = $('#cidadeModal').data('id');
        
        if (!$('#divCidadeSecundaria').hasClass('hide'))
            data.model.CidadeSecundariaId = $('#cidadeSecundariaModal').data('id');

        $.ajax({
            url: gafisa.alphabook.rotas.projeto.salvarDadosProjeto,
            type: "POST",
            data: JSON.stringify(data),
            cache: false,
            contentType: 'application/json',
            success: gafisa.alphabook.home.projetosDepartamento.aposSalvarDadosProjeto
        });
    },

    validarDadosProjeto: function () {
        if (String.isNullOrEmpty($('#nome').val())) {
            gafisa.alphabook.mensagens.exibirMensagemErro(gafisa.mensagens.comum.deveSerPreenchido.format('Nome'));
            return false;
        }

        if (String.isNullOrEmpty($('#cidadeModal').data('id'))) {
            gafisa.alphabook.mensagens.exibirMensagemErro(gafisa.mensagens.comum.deveSerPreenchida.format('Cidade Principal'));
            return false;
        }

        if (!$('#divCidadeSecundaria').hasClass('hide')) {
            if (String.isNullOrEmpty($('#cidadeSecundariaModal').data('id'))) {
                gafisa.alphabook.mensagens.exibirMensagemErro(gafisa.mensagens.comum.deveSerPreenchida.format('Cidade'));
                return false;
            }
        }

        if (String.isNullOrEmpty($('#dadosResponsavel').data('id')) || $('#dadosResponsavel').data('id') == 0) {
            gafisa.alphabook.mensagens.exibirMensagemErro(gafisa.mensagens.comum.deveSerPreenchido.format('Responsável'));
            return false;
        }

        return true;
    },

    aposSalvarDadosProjeto: function (json) {
        if (json.sucesso) {
            gafisa.alphabook.mensagens.exibirMensagemConfirmacao(gafisa.mensagens.comum.salvoComSucesso.format('Projeto'));
            var data = gafisa.alphabook.home.projetosDepartamento.retornarFiltros();
            $('#tabelaProjetosDepartamento').tabela({ acao: 'carregar', parametros: data });
            $.dialogo.fechar();
            $.loading({ action: 'hide' });
        } else {
            $.loading({ action: 'hide' });
            gafisa.alphabook.mensagens.exibirMensagemErro(json.erros[0]);
        }
    },

    aoEditarResponsavelProjeto: function () {
        $.dialogo.selecionarUsuario(gafisa.alphabook.home.projetosDepartamento.aoSelecionarUsuarioResponsavel);
    },

    aoSelecionarUsuarioResponsavel: function (usuario) {
        var id = $(usuario).data('id');
        var imagem = $(usuario).data('imagem');
        var nome = $(usuario).data('nome');

        $.dialogo.voltar(function () {
            $('#dadosResponsavel').data('id', id);

            $('#imagemResponsavel').fadeOut('fast', function () {
                $('#imagemResponsavel').attr('src', imagem);
                $('#imagemResponsavel').attr('alt', nome);
                $('#imagemResponsavel').fadeIn();
            });

            $('#nomeResponsavel').fadeOut('fast', function () {
                $('#nomeResponsavel').html(nome);
                $('#nomeResponsavel').fadeIn();
            });

            gafisa.alphabook.home.projetosDepartamento.configurarAutoCompleteCidadeModal(true);
            gafisa.alphabook.home.projetosDepartamento.configurarAutoCompleteCidadeModal(false);
        });
    },

    aoAlterarEstado: function (principal) {
        $(principal ? '#cidadeModal' : '#cidadeSecundariaModal').val('');
        gafisa.alphabook.home.projetosDepartamento.configurarAutoCompleteCidadeModal(principal);
    },

    configurarAutoCompleteCidadeModal: function (principal) {
        var estado = principal ? $('#EstadoModal') : $('#EstadoSecundarioModal');
        var cidade = principal ? $('#cidadeModal') : $('#cidadeSecundariaModal');
        var source = principal ? gafisa.alphabook.home.projetosDepartamento.carregarDadosCidadeModalAutocomplete : gafisa.alphabook.home.projetosDepartamento.carregarDadosCidadeSecundariaModalAutocomplete;

        if (estado.val() == '') {
            cidade.disable(true).data('id', null);
        } else {
            cidade.autocomplete({
                open: function () {
                    setTimeout(function () {
                        $('.ui-autocomplete').css('z-index', 9999);
                    }, 0);
                },
                source: source,
                minLength: 2,
                select: function (event, ui) {
                    cidade.data('id', ui.item.Id);
                }
            });
            cidade.disable(false);
        }
    },

    carregarDadosCidadeModalAutocomplete: function (request, response) {
        $.ajax({
            url: gafisa.alphabook.rotas.home.listarCidadesAutocomplete,
            type: "POST",
            dataType: "json",
            data: { chave: $("#cidadeModal").val(), uf: $("#EstadoModal").val() },
            success: function (data) {
                response($.map(data, function (item) {
                    return { label: item.value, value: item.value, Id: item.key };
                }));
            }
        });
    },
    
    carregarDadosCidadeSecundariaModalAutocomplete: function (request, response) {
        $.ajax({
            url: gafisa.alphabook.rotas.home.listarCidadesAutocomplete,
            type: "POST",
            dataType: "json",
            data: { chave: $("#cidadeSecundariaModal").val(), uf: $("#EstadoSecundarioModal").val() },
            success: function (data) {
                response($.map(data, function (item) {
                    return { label: item.value, value: item.value, Id: item.key };
                }));
            }
        });
    },
    
    aoAdicionarCidadeSecundaria: function () {
        $('#divCidadeSecundaria').removeClass('hide');
    },

    aoRemoverCidadeSecundaria: function () {
        $('#divCidadeSecundaria').addClass('hide');

        $('#EstadoSecundarioModal').val('');
        $('#cidadeSecundariaModal').val('').disable(true).data('id', null);
    },
};

$(document).ready(gafisa.alphabook.home.projetosDepartamento.inicializar);
