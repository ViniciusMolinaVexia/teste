if (typeof gafisa.alphabook.home == 'undefined') { gafisa.alphabook.home = new Object(); }

gafisa.alphabook.home.postagem = {
    completo: false,
    uploader: null,
    arquivos: 0,
    postagemid: null,
    idarquivopastaclicada: null,
    voltarMapa: false,
    etapaLinhaTempo: false,

    inicializar: function () {
        gafisa.alphabook.home.postagem.registrarAcoes();
    },

    registrarAcoes: function () {
        gafisa.alphabook.home.postagem.registrarRichText();

        $('#postagemCriacao #notificacao').livequery('click', gafisa.alphabook.home.postagem.aoAlternarNotificacao);
        $('#postagemCriacao #lembrete').livequery('click', gafisa.alphabook.home.postagem.aoClicarLembrete);
        $('#postagemCriacao #marco').livequery('click', gafisa.alphabook.home.postagem.aoAlternarMarco);
        $('#postagemCriacao #EtapaId').livequery('change', gafisa.alphabook.home.postagem.aoAlterarEtapa);
        $('#postagemCriacao #EtapaId').livequery(function () { $(this).change(); });
        $('#postagemCriacao #etapaConcluida').livequery('change', gafisa.alphabook.home.postagem.aoAlterarEtapaConcluida);
        $('#postagemCriacao #anexos').livequery('click', gafisa.alphabook.home.postagem.aoClicarAnexo);
        $('#postagemCriacao #localizacao').livequery('click', gafisa.alphabook.home.postagem.aoClicarLocalizacao);
        $('#postagemCriacao #projetosAssociados').livequery('click', gafisa.alphabook.home.postagem.aoClicarProjetosAssociados);
        $('#postagemCriacao #postRetroativo').livequery('click', gafisa.alphabook.home.postagem.aoClicarPostRetroativo);
        $('#postagemCriacao #salvarPost').livequery('click', gafisa.alphabook.home.postagem.aoClicarSalvarPost);
        $('#postagemCriacao #TituloCriacaoPost').onPressEnter(gafisa.alphabook.home.postagem.aoClicarSalvarPost);
        $('#postagemCriacao #PrivacidadeId').livequery('change', gafisa.alphabook.home.postagem.aoClicarPrivacidade);
        $('.post-completo #salvarPost').livequery('click', gafisa.alphabook.home.postagem.aoClicarSalvarPost);
        $('.post-completo input').onPressEnter(gafisa.alphabook.home.postagem.aoClicarSalvarPost);
        $('#postagemAnexos [name="Classificacao"]').livequery(function () { $('#postagemAnexos [name="Classificacao"]').off().on('change', gafisa.alphabook.home.postagem.aoSelecionarClassificacao); });
        $('#divUsuariosEspecificos').livequery(gafisa.alphabook.home.postagem.configurarAutoCompleteUsuarios);
    },

    exibirAlertaPrivacidade: function () {
        var alerta = $("#postagemAnexos #alertaPrivacidade");
        var exibir = false;

        $("#postagemAnexos [name='Classificacao']").each(function () {
            if ($("#PrivacidadeId").val() != $(this).data('idPrivacidade')) exibir = true;
        });

        if (exibir) {
            $("#postagemAnexos #alertaPrivacidade #perfil-publicacao").text($("#PrivacidadeId option:selected").text());
            alerta.show('slow');
        }
        else {
            alerta.hide('slow');
        }
    },

    aoClicarPrivacidade: function () {
        gafisa.alphabook.home.postagem.exibirAlertaPrivacidade();

        var privacidadeId = $("#PrivacidadeId").val();

        if (privacidadeId == 3) {
            $('#divUsuariosEspecificos').hide();
            $("#DepartamentoId").show('slow');
        }
        else if (privacidadeId == 5) {
            $("#DepartamentoId").hide('slow');
            $('#divUsuariosEspecificos').show();
        }
        else {
            $("#DepartamentoId").hide('slow');
            $('#divUsuariosEspecificos').hide();
        }
    },

    aoClicarCriarPost: function () {
        var containerPost = $('#criarPostHome');
        if (containerPost.is(':visible')) {
            containerPost.fadeOut('slow', function () {
                containerPost.animate({ height: 0 }, 600);
            });
        }
        else {
            var data = { projetoId: gafisa.alphabook.home.carrossel.obterIdProjeto() };

            var protocoloId = $('#hddProtocolo').val();

            if (protocoloId)
                data.protocoloId = protocoloId;

            $.get(gafisa.alphabook.rotas.postagem.postSimples, data,
            function (html) {
                containerPost.height(0).html('').html(html).animate({ height: 387 }, 600, function () {
                    gafisa.alphabook.home.postagem.inicializar();
                    containerPost.fadeIn('slow');
                });
            },
            "html");
        }
    },

    aoClicarPostRetroativo: function () {
        $('#postagemCriacao #dataHoraPost').show();
        $('#postagemCriacao #DataRetroativa').datetimepicker();
        $('#postagemCriacao #limparDataRetroativa').livequery('click', gafisa.alphabook.home.postagem.aoLimparDataRetroativa);
        $('#postagemCriacao #confirmarDataRetroativa').livequery('click', gafisa.alphabook.home.postagem.aoConfirmarDataRetroativa);
    },

    aoLimparDataRetroativa: function () {
        $('#postagemCriacao #DataRetroativa').val('');
    },

    aoConfirmarDataRetroativa: function () {
        $('#postagemCriacao #dataHoraPost').hide();
        if ($('#postagemCriacao #DataRetroativa').val() != '') {
            $('#postagemCriacao #spanDataRetroativa').text('| ' + $('#DataRetroativa').val());
            $('#postagemCriacao #postRetroativo').removeClass('ico-calendario-inativo').addClass('ico-calendario');
        } else {
            $('#postagemCriacao #spanDataRetroativa').text('');
            $('#postagemCriacao #postRetroativo').removeClass('ico-calendario').addClass('ico-calendario-inativo');
        }
    },

    aoAlternarNotificacao: function () {
        if (gafisa.alphabook.home.postagem.estaEmProtocoloCompleto() && $('#ProtocoloPaiId').length > 0) return;

        var obj = $(this);
        if (obj.data('notificar')) {
            obj.data('notificar', false);
            obj.removeClass('ico-post-notificacao').addClass('ico-post-notificacao-inativo');
        }
        else {
            obj.data('notificar', true);
            obj.removeClass('ico-post-notificacao-inativo').addClass('ico-post-notificacao');
        }
    },

    aoClicarLembrete: function () {
        $('#postagemCriacao #lembretePost').show();
        $('#postagemCriacao #DataLembrete').datetimepicker();
        $('#postagemCriacao #limparDataLembrete').livequery('click', gafisa.alphabook.home.postagem.aoLimparDataLembrete);
        $('#postagemCriacao #confirmarDataLembrete').livequery('click', gafisa.alphabook.home.postagem.aoConfirmarDataLembrete);
    },

    aoLimparDataLembrete: function () {
        $('#postagemCriacao #DataLembrete').val('');
    },

    aoConfirmarDataLembrete: function () {
        $('#postagemCriacao #lembretePost').hide();

        if ($('#postagemCriacao #DataLembrete').val() != '') {
            $('#postagemCriacao #lembrete').removeClass('ico-post-lembrete-inativo').addClass('ico-post-lembrete');
        } else {
            $('#postagemCriacao #lembrete').removeClass('ico-post-lembrete').addClass('ico-post-lembrete-inativo');
        }
    },

    aoAlternarMarco: function () {
        if (gafisa.alphabook.home.postagem.estaEmProtocoloCompleto() && $('#ProtocoloPaiId').length > 0) return;

        var obj = $(this);

        if (obj.data('marco')) {
            obj.data('marco', false);
            obj.removeClass('ico-post-linha-tempo').addClass('ico-post-linha-tempo-inativo');
            $('#postagemCriacao #etapa-post').hide();
            $('.seg-combos-privacidade-criar', '#postagemCriacao').show();
            gafisa.alphabook.home.postagem.aoClicarPrivacidade();
        }
        else {
            obj.data('marco', true);
            obj.removeClass('ico-post-linha-tempo-inativo').addClass('ico-post-linha-tempo');
            $('#postagemCriacao #etapa-post').show();
            $('.seg-combos-privacidade-criar, #divUsuariosEspecificos', '#postagemCriacao').hide();
        }
        $.navegar.ajustarRodape();
    },

    aoAlterarEtapa: function () {
        var statusEtapaId = $(this).val().split('|')[1];

        if (statusEtapaId == 3 || statusEtapaId == 5 || statusEtapaId == 6) {
            $('#postagemCriacao .campo-etapa').hide();
        } else {
            $('#postagemCriacao .campo-etapa').show();
        }
    },

    aoAlterarEtapaConcluida: function () {
        var etapaConcluida = $(this).val();

        if (etapaConcluida == 'true') {
            $('#postagemCriacao #statusEtapaNaoConcluida').hide();
            $('#postagemCriacao #statusEtapaConcluida').show();
        } else {
            $('#postagemCriacao #statusEtapaNaoConcluida').show();
            $('#postagemCriacao #statusEtapaConcluida').hide();
        }

        $.navegar.ajustarRodape();
    },

    estaEmProtocoloCompleto : function() {
        try {
            return gafisa.alphabook.home.protocolos.completo;
        } catch (e) { }

        return false;
    },

    aoClicarAnexo: function () {
        if (gafisa.alphabook.home.postagem.estaEmProtocoloCompleto()) return;

        if (gafisa.alphabook.home.postagem.completo) {
            $('html, body').animate({
                scrollTop: $("#postagemAnexos #accordionAnexos").offset().top
            }, 1000);
        }
        else {
            gafisa.alphabook.home.postagem.aoConfirmarNavegacaoCompleto();
        }
    },

    aoConfirmarNavegacaoCompleto: function (lat, lng, data) {
        var dados = { projetoid: gafisa.alphabook.home.carrossel.obterIdProjeto(), protocoloId: $('#hddProtocolo').val() };

        if (lat == undefined)
            var data = gafisa.alphabook.home.postagem.obterJsonDadosDigitados();

        if (gafisa.alphabook.home.postagem.etapaLinhaTempo === true) {
            var dadosEtapa = $('#postagemCriacao #EtapaId').val().split('|');

            dados.etapaId = dadosEtapa[0];
            dados.statusEtapaId = dadosEtapa[1];

            $('#modalEtapaCriarPost').html('').modal('hide');
        }

        $.navegar.proximo(gafisa.alphabook.rotas.postagem.criarPost, dados, function () { gafisa.alphabook.home.postagem.aposCarregarPostCompleto(lat, lng, data); });
    },

    aposCarregarPostCompleto: function (lat, lng, data) {
        $('#divBtnSalvarPost').hide();
        if (data != undefined)
            gafisa.alphabook.home.postagem.preencherTelaDadosDigitados(data);
        gafisa.alphabook.home.postagem.registrarRichText();
        gafisa.alphabook.home.postagem.configurarUploader();
        gafisa.alphabook.home.postagem.completo = true;
        gafisa.alphabook.home.postagem.voltarMapa = !(lat == undefined);

        $('#postagemAnexos [name="Pasta"]').livequery('click', gafisa.alphabook.home.postagem.aoAbrirPasta);

        $("#ListaTaxonomias").jstree({
            "themes": {
                "theme": "default",
                "dots": true,
                "icons": true
            }, "plugins": ["themes", "html_data", "ui"]
        }).bind("select_node.jstree", gafisa.alphabook.home.postagem.aoClicarPasta);

        $("#postagemAnexos .botao-excluir-anexo").livequery('click', gafisa.alphabook.home.postagem.aoExcluirAnexo);

        if (lat != undefined)
            $('#postagemCriacao #localizacao').data('idContato', null).data('latitude', lat).data('longitude', lng).removeClass('ico-post-pin-inativo').addClass('ico-post-pin');
    },


    totalizarAnexos: function () {
        $("#postagemCriacao #anexos").text(gafisa.alphabook.home.postagem.arquivos);
    },

    aoSelecionarClassificacao: function () {
        var obj = $("#postagemAnexos tr[data-arquivoid='" + $(this).data("arquivoid") + "'");
        if ($(this).val() != '') {
            $.get(
                gafisa.alphabook.rotas.taxonomia.obterDadosClassificacao,
                { classificacaoTaxonomiaId: $(this).val() },
                function (json) { gafisa.alphabook.home.postagem.aoRetornarClassificacao(json, obj); });
        } else {
            obj.find(".para-que-serve").text('');
            obj.find(".confidencialidade").text('');
        }

        $.navegar.ajustarRodape();
    },

    aoRetornarClassificacao: function (json, tr) {
        tr.find(".para-que-serve").text(json.ParaQueServe);
        tr.find(".confidencialidade").text(json.Privacidade);
        tr.find("[name='Classificacao']").data('idPrivacidade', json.IdPrivacidade);

        if (json.IdPrivacidade != $("#PrivacidadeId").val()) {
            $.dialogo.questaoTripla(
                gafisa.mensagens.comum.privacidadeDivergenteAnexos,
                gafisa.mensagens.comum.privacidadeDivergenteAnexos_AlterarPost.format(json.Privacidade),
                gafisa.mensagens.comum.privacidadeDivergenteAnexos_ManterPost.format($("#PrivacidadeId option:selected").text()),
                gafisa.mensagens.comum.privacidadeDivergenteAnexos_NaoAnexar,
                function () { gafisa.alphabook.home.postagem.alterarPrivacidadePost(json); },
                function () { gafisa.alphabook.home.postagem.manterPrivacidadePost(tr, json); },
                function () { gafisa.alphabook.home.postagem.naoIncluirAnexo(tr); });
        }
    },

    alterarPrivacidadePost: function (json) {
        $("#PrivacidadeId").val(json.IdPrivacidade);
        gafisa.alphabook.home.postagem.aoClicarPrivacidade();
    },

    manterPrivacidadePost: function (tr, json) {
        $("#postagemAnexos #alertaPrivacidade").show('slow');
        tr.find(".confidencialidade").html(json.Privacidade + '<a href="javascript:void(0)" class="ico-alerta" title="ATENÇÃO: existem anexos com confidencialidade incompatível com o perfil de publicação do post.">Alerta</a>');
        gafisa.alphabook.home.postagem.exibirAlertaPrivacidade();
    },

    naoIncluirAnexo: function (tr) {
        var arquivoExcluido = gafisa.alphabook.home.postagem.uploader.getFile(tr.data('arquivoid'));
        gafisa.alphabook.home.postagem.uploader.removeFile(arquivoExcluido);
        $("#postagemAnexos tr[data-arquivoid='" + tr.data('arquivoid') + "'").hide('slow').remove();
        gafisa.alphabook.home.postagem.arquivos--;
        gafisa.alphabook.home.postagem.totalizarAnexos();
        gafisa.alphabook.home.postagem.exibirAlertaPrivacidade();
    },

    aoExcluirAnexo: function () {

        if ($('#ListaTaxonomias').is(":visible"))
            $('#ListaTaxonomias').toggle();

        var arquivoExcluido = gafisa.alphabook.home.postagem.uploader.getFile($(this).data('arquivoid'));
        gafisa.alphabook.home.postagem.uploader.removeFile(arquivoExcluido);
        $("#postagemAnexos tr[data-arquivoid='" + $(this).data('arquivoid') + "'").hide('slow').remove();
        gafisa.alphabook.home.postagem.arquivos--;
        gafisa.alphabook.home.postagem.totalizarAnexos();
        gafisa.alphabook.home.postagem.exibirAlertaPrivacidade();
    },

    aoAbrirPasta: function () {
        gafisa.alphabook.home.postagem.idarquivopastaclicada = $(this).data('arquivoid');
        $(this).blur();
        $('#ListaTaxonomias').toggle().css({
            left: ($(this).offset().left + 0) + 'px',
            top: ($(this).offset().top + 33) + 'px'
        });
    },

    aoClicarPasta: function (event, data) {
        $.get(gafisa.alphabook.rotas.taxonomia.listarClassificacaoTaxonomia,
            { taxonomiaId: data.rslt.obj.data("taxonomiaid") }, gafisa.alphabook.home.postagem.aoListarClassificacoes);

        $('#ListaTaxonomias').toggle();

        var obj = $('#postagemAnexos tr[data-arquivoid="' + gafisa.alphabook.home.postagem.idarquivopastaclicada + '"]');
        obj.find('[name="Pasta"]').empty().append('<option value="">' + data.rslt.obj.data("taxonomianome") + '</option>');
    },

    aoListarClassificacoes: function (json) {
        var sel = $("#postagemAnexos .campo-classificacao[data-arquivoid='" + gafisa.alphabook.home.postagem.idarquivopastaclicada + "']");
        sel.empty();
        sel.append('<option value="">Selecione</option>');
        for (var i = 0; i < json.length; i++) {
            sel.append('<option value="' + json[i].Id + '">' + json[i].Nome + '</option>');
        }
    },

    aoClicarLocalizacao: function () {
        var edicao = $('#hddProtocolo').val();
        if (gafisa.alphabook.home.postagem.voltarMapa || (edicao && !gafisa.alphabook.home.protocolos.completo)) return;

        $.dialogo.questaoTripla(gafisa.mensagens.comum.contatoOuMapa, "Contato", "Ponto no mapa", null,
            gafisa.alphabook.home.postagem.aoEscolherAssociarContato,
            gafisa.alphabook.home.postagem.aoEscolherAssociarMapa, null);
    },

    aoEscolherAssociarContato: function () {
        $.dialogo.selecionarContato({ tipo: 'contato', aoSelecionar: gafisa.alphabook.home.postagem.aposSelecionarContato });
    },

    aoEscolherAssociarMapa: function () {
        if (gafisa.alphabook.home.postagem.arquivos > 0)
            $.dialogo.confirmar(gafisa.mensagens.comum.anexosRemovidosPostagem, gafisa.alphabook.home.postagem.aoConfirmarEscolherAssociarMapa);
        else
            gafisa.alphabook.home.postagem.aoConfirmarEscolherAssociarMapa();
    },

    aoConfirmarEscolherAssociarMapa: function () {
        gafisa.alphabook.home.postagem.arquivos = 0;
        gafisa.alphabook.home.postagem.uploader = null;
        $('#postagemAnexos #arquivos tbody').html('');

        var obj = "<span id=\"textoCriacaoPost\">" + $('#postagemCriacao #textoCriacaoPost').val() + "</span>";
        $(".msg-post-criar-post").html('').html(obj);
        $.navegar.tratarValores();
        $.navegar.obterPontoMapa(gafisa.alphabook.home.postagem.aposSelecionarLocalizacao);
        
        if (gafisa.alphabook.home.postagem.etapaLinhaTempo === true) {
            $('#modalEtapaCriarPost').modal('hide');
        }
    },

    aposSelecionarLocalizacao: function (latitude, longitude) {
        $('#postagemCriacao #textoCriacaoPost').livequery(gafisa.alphabook.home.postagem.registrarRichText);

        if (gafisa.alphabook.home.postagem.completo) {
            $("#ListaTaxonomias").jstree({
                "themes": {
                    "theme": "default",
                    "dots": true,
                    "icons": true
                }, "plugins": ["themes", "html_data", "ui"]
            }).bind("select_node.jstree", gafisa.alphabook.home.postagem.aoClicarPasta);

            gafisa.alphabook.home.postagem.configurarUploader();
        }

        if (latitude != null)
            $('#postagemCriacao #localizacao').data('idContato', null).data('latitude', latitude).data('longitude', longitude).removeClass('ico-post-pin-inativo').addClass('ico-post-pin');
        else
            $('#postagemCriacao #localizacao').data('idContato', null).data('latitude', null).data('longitude', null).removeClass('ico-post-pin').addClass('ico-post-pin-inativo');
        
        if (gafisa.alphabook.home.postagem.etapaLinhaTempo === true) {
            $('#modalEtapaCriarPost').modal('show');
        }
    },

    aposSelecionarContato: function (idContato) {
        if (idContato != null)
            $('#postagemCriacao #localizacao').data('idContato', idContato).data('latitude', null).data('longitude', null).removeClass('ico-post-pin-inativo').addClass('ico-post-pin');
        else
            $('#postagemCriacao #localizacao').data('idContato', null).data('latitude', null).data('longitude', null).removeClass('ico-post-pin').addClass('ico-post-pin-inativo');
    },

    aoClicarProjetosAssociados: function () {
        if (gafisa.alphabook.home.postagem.completo)
            $('html, body').animate({ scrollTop: $("#postagemProjetosAssociados #accordionProjetosAssociados").offset().top }, 1000);
        else
            gafisa.alphabook.home.postagem.aoConfirmarNavegacaoCompleto();
    },

    aoClicarSalvarPost: function () {
        if (gafisa.alphabook.home.postagem.validar()) {
            var data = new Object();
            data.Titulo = $('#postagemCriacao #TituloCriacaoPost').val();

            var editors = $("#postagemCriacao .jqte_editor");
            var texto = '';
            editors.each(function (index, element) {
                if ($(element).text() != '') {
                    texto = $(element).text();
                    return false;
                }
            });

            data.Postagem = htmlEncode(texto);
            data.Notificacao = $('#postagemCriacao #notificacao').data('notificar');
            data.LinhaTempo = $('#postagemCriacao #marco').data('marco');
            data.DataLembrete = $('#postagemCriacao #DataLembrete').val();
            data.DataRetroativa = $('#postagemCriacao #DataRetroativa').val();
            data.PrivacidadeId = $('#postagemCriacao #PrivacidadeId').val();
            data.DepartamentoId = $('#postagemCriacao #DepartamentoId').val();
            data.ProjetoId = gafisa.alphabook.home.carrossel.obterIdProjeto();
            data.ContatoId = $('#postagemCriacao #localizacao').data('idContato');
            data.Latitude = $('#postagemCriacao #localizacao').data('latitude');
            data.Longitude = $('#postagemCriacao #localizacao').data('longitude');
            data.IdsProjetosAssociados = [];

            if (data.LinhaTempo) {
                data.EtapaId = $('#postagemCriacao #EtapaId').val().split('|')[0];
                data.EtapaConcluida = $('#postagemCriacao #etapaConcluida').val();

                if (gafisa.alphabook.home.postagem.etapaLinhaTempo === true) {
                    data.StatusEtapaId = $('#statusEtapaNaoConcluida').val();
                }
            }

            $("#tabelaProjetosAssociados input:checkbox[name='checkProjeto']").each(function () {
                data.IdsProjetosAssociados.push($(this).data('id'));
            });

            var protocoloId = $('#hddProtocolo').val();

            if (protocoloId)
                data.ProtocoloId = protocoloId;

            if (data.PrivacidadeId == 5)
                data.UsuariosEspecificosIds = $('#usuariosEspecificos').val();

            $.loading({ action: 'show' });

            $.post(gafisa.alphabook.rotas.postagem.postar, data, gafisa.alphabook.home.postagem.aoRetornarSalvarPost);
        }
    },

    validar: function () {
        if ($("#postagemCriacao #TituloCriacaoPost").val() == '') {
            gafisa.alphabook.mensagens.exibirMensagemErro(gafisa.mensagens.comum.obrigatorio.format('Título'));
            return false;
        }

        var editors = $("#postagemCriacao .jqte_editor");
        var valido = false;
        editors.each(function (index, element) {
            if ($(element).text() != '') {
                valido = true;
                return false;
            }
        });

        if (!valido) {
            gafisa.alphabook.mensagens.exibirMensagemErro(gafisa.mensagens.comum.obrigatoria.format('Conteúdo'));
            return false;
        }

        if ($('#postagemCriacao #marco').data('marco')) {
            if ($('#postagemCriacao #etapa-post .sem-baseline').length > 0) {
                gafisa.alphabook.mensagens.exibirMensagemErro(gafisa.mensagens.comum.baselineNaoConfigurada);
                return false;
            }    
        }
        else {
            if ($("#postagemCriacao #PrivacidadeId").val() == '') {
                gafisa.alphabook.mensagens.exibirMensagemErro(gafisa.mensagens.comum.obrigatoria.format('Confidencialidade'));
                return false;
            }

            if ($("#postagemCriacao #PrivacidadeId").val() == 5) {
                var usuarios = $('#usuariosEspecificos').val();

                if (usuarios == null || usuarios == '') {
                    gafisa.alphabook.mensagens.exibirMensagemErro(gafisa.mensagens.comum.selecionePeloMenosUm.format('usuário'));
                    return false;
                }
            }
        }

        var itens = $('#postagemAnexos [name="Classificacao"]');
        for (ind in itens) {
            var item = itens[ind];
            if (item.selectedIndex <= 0) {
                gafisa.alphabook.mensagens.exibirMensagemErro(gafisa.mensagens.comum.todasClassificacoesObrigatorias);
                return false;
            }
        }

        return true;
    },

    aoRetornarSalvarPost: function (json) {
        if (json.sucesso) {
            if (gafisa.alphabook.home.postagem.completo) {
                if (gafisa.alphabook.home.postagem.arquivos > 0) {
                    gafisa.alphabook.home.postagem.postagemid = json.postagemid;
                    gafisa.alphabook.home.postagem.iniciarUploadArquivos();
                } else {
                    gafisa.alphabook.home.postagem.sucessoPostagemCompleta();
                }
            } else if (gafisa.alphabook.home.protocolos.completo) {
                if (gafisa.alphabook.home.protocolos.arquivos > 0) {
                    gafisa.alphabook.home.protocolos.postagemid = json.postagemid;
                    gafisa.alphabook.home.protocolos.iniciarUploadArquivos();
                } else {
                    gafisa.alphabook.home.protocolos.sucessoInclusao();
                }
            }
            else {
                gafisa.alphabook.mensagens.exibirMensagemConfirmacao(gafisa.mensagens.comum.salvoComSucesso.format('Post'));

                $.loading({ action: 'hide' });

                if (gafisa.alphabook.home.postagem.etapaLinhaTempo === true) {

                    $('#aba-padrao .etapas-linha-tempo').data('carregado', false);
                    
                    gafisa.alphabook.home.linhaTempo.atualizarLinhaTempo();

                    if (!gafisa.alphabook.home.postagem.completo) {
                        $('#modalEtapaCriarPost').html('').modal('hide');
                    }
                } else {
                    gafisa.alphabook.home.timeline.recarregarTimeline();
                    gafisa.alphabook.home.contadores.atualizarTodos();

                    $('#criarPostHome').animate({ height: 0 }, 600).html("");
                }
            }

            var vemDeProtocolo = $('#hddProtocolo').val();

            if (vemDeProtocolo)
                $.fn.dialogo.fechar();

            if (gafisa.alphabook.home.protocolos.localizacaoEdicao)
                $.navegar.proximo(gafisa.alphabook.rotas.protocolos.index, { projetoId: gafisa.alphabook.home.carrossel.obterIdProjeto() }, gafisa.alphabook.home.protocolos.aoExibirTela);
            else {
                gafisa.alphabook.home.contadores.atualizarPostagem();
                gafisa.alphabook.home.contadores.atualizarLinhaTempo();
                gafisa.alphabook.notificacao.atualizarQuantidadeNotificacoes();
            }

        } else {
            gafisa.alphabook.mensagens.exibirMensagemErro(json.erros);
            $.loading({ action: 'hide' });
        }       
    },

    iniciarUploadArquivos: function () {
        gafisa.alphabook.home.postagem.uploader.settings.multipart_params = { postagemId: gafisa.alphabook.home.postagem.postagemid, classificacaoTaxonomiaId: 0, projetoId: gafisa.alphabook.home.carrossel.obterIdProjeto() };
        gafisa.alphabook.home.postagem.uploader.start();
    },

    aposSalvarPostCompleto: function () {
        gafisa.alphabook.notificacao.atualizarQuantidadeNotificacoes();

        if (gafisa.alphabook.home.postagem.etapaLinhaTempo === true) {
            $('#modalEtapaCriarPost').html('').modal('hide');

            $('#aba-padrao .etapas-linha-tempo').livequery(function () { gafisa.alphabook.home.linhaTempo.atualizarLinhaTempo(); });
        } else {
            $('#criarPostHome').livequery(function () { gafisa.alphabook.home.postagem.aposVoltarHomeProjeto(); });
        }
    },

    aposVoltarHomeProjeto: function () {
        $('#criarPostHome').hide('slow').html("");
        gafisa.alphabook.home.timeline.recarregarTimeline();
        gafisa.alphabook.home.contadores.atualizarTodos();
    },

    registrarRichText: function () {
        var param = {
            'br': false,
            'center': false,
            'color': false,
            'fsize': false,
            'format': false,
            'indent': false,
            'link': false,
            'left': false,
            'ol': false,
            'outdent': false,
            'p': false,
            'remove': false,
            'right': false,
            'rule': false,
            'source': false,
            'strike': false,
            'sup': false,
            'sub': false,
            'title': false,
            'ul': false,
            'unlink': false
        };
        $('#postagemCriacao #textoCriacaoPost').jqte(param);
        $('.jqte .jqte_editor').on('paste', gafisa.alphabook.home.postagem.aoColarDescricaoPost);
    },

    cancelarPropagacao: function (e) {
        e.stopPropagation();
    },

    aoColarDescricaoPost: function (e) {
        e.currentTarget.innerHTML = e.currentTarget.innerText;
    },

    configurarUploader: function () {
        $.browser.chrome = $.browser.webkit && window.chrome;
        $.browser.safari = $.browser.webkit && !window.chrome;

        var runtimes = '';
        if (jQuery.browser.safari && !jQuery.browser.chrome) {
            runtimes = 'html4';
        }
        else {
            runtimes = 'flash,silverlight,html4';
        }
        gafisa.alphabook.home.postagem.uploader = new plupload.Uploader({
            runtimes: runtimes,
            browse_button: 'selecionarArquivos',
            container: 'container',
            max_file_size: '25mb',
            url: gafisa.alphabook.rotas.arquivo.uploadAnexo,
            flash_swf_url: gafisa.alphabook.rotas.uploadFlash,
            silverlight_xap_url: gafisa.alphabook.rotas.uploadSiverlight,
            filters: [{ title: 'Arquivos', extensions: '*' }],
            urlstream_upload: true
        });

        gafisa.alphabook.home.postagem.uploader.init();

        gafisa.alphabook.home.postagem.uploader.bind('FilesAdded', gafisa.alphabook.home.postagem.aoAdicionarArquivo);
        gafisa.alphabook.home.postagem.uploader.bind('Error', gafisa.alphabook.home.postagem.erro);
        gafisa.alphabook.home.postagem.uploader.bind('FileUploaded', gafisa.alphabook.home.postagem.aposUploadArquivo);
        gafisa.alphabook.home.postagem.uploader.bind('UploadComplete', gafisa.alphabook.home.postagem.aposCompletarUpload);
        gafisa.alphabook.home.postagem.uploader.bind('BeforeUpload', gafisa.alphabook.home.postagem.antesEnviarArquivo);

        gafisa.alphabook.home.postagem.uploader.refresh();
    },

    aoAdicionarArquivo: function (up, files) {
        for (var i = 0; i < files.length; i++) {
            var nomeArquivo = files[i].name;

            var html = '<tr data-arquivoid="{1}">' +
				'<td class="colun-1">{0}</td>' +
				'<td class="colun-2 taxo-select">' +
                '   <select data-arquivoid="{1}" name="Pasta" class="campo-status filtro-carrossel-status campo-pasta">' +
                '    </select>' +
                '</td>' +
				'<td class="colun-3">' +
                '    <select data-arquivoid="{1}" name="Classificacao" class="campo-status filtro-carrossel-status campo-classificacao">' +
                '    </select>' +
                '</td>' +
				'<td class="colun-4 para-que-serve" data-arquivoid="{1}"></td>' +
                '<td class="colun-5 confidencialidade" data-arquivoid="{1}"></td>' +
				'<td class="colun-6"><a href="javascript:void(0)" class="ico-excluir ajuste-ico botao-excluir-anexo" title="Excluir" data-arquivoid="{1}">Excluir</a></td>' +
			    '</tr>';

            $('#postagemAnexos #arquivos tbody').append(html.format(nomeArquivo, files[i].id));

            gafisa.alphabook.home.postagem.arquivos++;
        }
        gafisa.alphabook.home.postagem.totalizarAnexos();
    },

    antesEnviarArquivo: function (up, file) {
        var obj = $("#postagemAnexos tr[data-arquivoid='" + file.id + "']").find("[name='Classificacao']");
        up.settings.multipart_params.classificacaoTaxonomiaId = obj.val();
    },

    aposUploadArquivo: function (up, file, response) {
        var resposta = $.parseJSON(response.response);
        if (!resposta.sucesso) {

            gafisa.alphabook.home.postagem.uploader.stop();
            gafisa.alphabook.mensagens.exibirMensagemErro(resposta.erro);

            for (var i = 0; i < gafisa.alphabook.home.postagem.uploader.files.length; i++) {
                gafisa.alphabook.home.postagem.uploader.files[i].percent = 0;
                gafisa.alphabook.home.postagem.uploader.files[i].status = plupload.QUEUED;
            }
        }
    },

    aposCompletarUpload: function (up, files) {
        for (var i = 0; i < files.length; i++) {
            if (files[i].state == plupload.FAILED) {
                return;
            }
        }

        gafisa.alphabook.home.postagem.sucessoPostagemCompleta();
    },

    sucessoPostagemCompleta: function () {
        $.loading({ action: 'hide' });

        gafisa.alphabook.mensagens.exibirMensagemConfirmacao(gafisa.mensagens.comum.salvoComSucesso.format('Post'));
        gafisa.alphabook.home.postagem.completo = false;

        if (gafisa.alphabook.home.postagem.voltarMapa) {
            $.navegar.mapa(gafisa.alphabook.home.carrossel.obterIdProjeto(), "projeto");
        } else {
            $.navegar.anterior(function () { gafisa.alphabook.home.postagem.aposSalvarPostCompleto(); });
        }
    },

    erro: function (up, erro) {
        var listaErros = [];

        if (erro.code == plupload.FILE_SIZE_ERROR)
            listaErros.push(gafisa.mensagens.comum.tamanhoMaximoExcedido.format(25));

        if (listaErros.length > 0) {
            gafisa.alphabook.mensagens.exibirMensagemErro(listaErros[0]);
        }
    },

    atualizarPosicaoPostagem: function (latitude, longitude, idPostagem) {
        $.post(gafisa.alphabook.rotas.postagem.atualizarPosicao,
            { latitude: latitude, longitude: longitude, idPostagem: idPostagem },
            gafisa.alphabook.home.postagem.retornoAtualizacaoPosicaoPostagem);
    },

    retornoAtualizacaoPosicaoPostagem: function (json) {
        if (json.sucesso)
            gafisa.alphabook.mensagens.exibirMensagemConfirmacao(gafisa.mensagens.comum.salvaComSucesso.format('Posição'));
        else {
            gafisa.alphabook.mensagens.exibirMensagemErro(json.erro);
        }
    },

    obterJsonDadosDigitados: function () {
        var data = new Object();
        if (gafisa.alphabook.home.postagem.completo) {

        } else {
            data.Titulo = $('#postagemCriacao #TituloCriacaoPost').val();
            data.Postagem = $('#postagemCriacao #textoCriacaoPost').val();
            data.Notificacao = $('#postagemCriacao #notificacao').data('notificar');
            data.LinhaTempo = $('#postagemCriacao #marco').data('marco');
            data.DataLembrete = $('#postagemCriacao #DataLembrete').val();
            data.DataRetroativa = $('#postagemCriacao #DataRetroativa').val();
            data.PrivacidadeId = $('#postagemCriacao #PrivacidadeId').val();
            data.DepartamentoId = $('#postagemCriacao #DepartamentoId').val();
            data.ContatoId = $('#postagemCriacao #localizacao').data('idContato');
            data.Latitude = $('#postagemCriacao #localizacao').data('latitude');
            data.Longitude = $('#postagemCriacao #localizacao').data('longitude');

            if (data.LinhaTempo) {
                data.EtapaId = $('#postagemCriacao #EtapaId').val();
                data.EtapaConcluida = $('#postagemCriacao #etapaConcluida').val();

                if (gafisa.alphabook.home.postagem.etapaLinhaTempo === true) {
                    data.StatusEtapaId = $('#postagemCriacao #statusEtapaNaoConcluida').val();
                }
            }

            data.UsuariosEspecificos = [];

            $('#usuariosEspecificos option').each(function (index, element) {
                data.UsuariosEspecificos.push({ id: $(element).val(), nome: $(element).text() });
            });
        }

        return data;
    },

    preencherTelaDadosDigitados: function (data) {
        $('#postagemCriacao #TituloCriacaoPost').val(data.Titulo);
        $('#postagemCriacao #textoCriacaoPost').html(data.Postagem);

        if (data.Notificacao) {
            $('#postagemCriacao #notificacao').data('notificar', data.Notificacao);
            $('#postagemCriacao #notificacao').removeClass('ico-post-notificacao-inativo').addClass('ico-post-notificacao');
        }

        if (data.DataLembrete && data.DataLembrete != '') {
            $('#postagemCriacao #DataLembrete').val(data.DataLembrete);
            $('#postagemCriacao #lembrete').removeClass('ico-post-lembrete-inativo').addClass('ico-post-lembrete');
        }

        if (data.DataRetroativa && data.DataRetroativa != '') {
            $('#postagemCriacao #DataRetroativa').val(data.DataRetroativa);
            $('#postagemCriacao #spanDataRetroativa').text('| ' + data.DataRetroativa);
            $('#postagemCriacao #postRetroativo').removeClass('ico-calendario-inativo').addClass('ico-calendario');
        }

        $('#postagemCriacao #PrivacidadeId').val(data.PrivacidadeId);
        $('#postagemCriacao #DepartamentoId').val(data.DepartamentoId);

        if (data.PrivacidadeId == 3) {
            $("#DepartamentoId").show('slow');
        }
        else if (data.PrivacidadeId == 5) {
            $("#divUsuariosEspecificos").show();

            $.each(data.UsuariosEspecificos, function (index, value) {
                $('#usuariosEspecificos').trigger('addItem', [{ 'title': value.nome, 'value': value.id }]);
            });

            $('ul.holder, div.fcbk-auto, ul#usuariosEspecificos_feed', '#divUsuariosEspecificos').width('562px');
            $('ul.holder', '#divUsuariosEspecificos').width('550px');
        }

        if (data.LinhaTempo) {
            $('#postagemCriacao #marco').click();

            $('#postagemCriacao #EtapaId').val(data.EtapaId).change();
            $('#postagemCriacao #etapaConcluida').val(data.EtapaConcluida).change();

            if (gafisa.alphabook.home.postagem.etapaLinhaTempo === true) {
                $('#postagemCriacao #statusEtapaNaoConcluida').val(data.StatusEtapaId);
            }
        }

        if (data.ContatoId != undefined) {
            $('#postagemCriacao #localizacao').data('idContato', data.ContatoId).removeClass('ico-post-pin-inativo').addClass('ico-post-pin');
        }
        if (data.Latitude != undefined) {
            $('#postagemCriacao #localizacao').data('latitude', data.Latitude).removeClass('ico-post-pin-inativo').addClass('ico-post-pin');
        }
        if (data.Longitude != undefined) {
            $('#postagemCriacao #localizacao').data('longitude', data.Longitude).removeClass('ico-post-pin-inativo').addClass('ico-post-pin');
        }
    },

    configurarAutoCompleteUsuarios: function () {
        $('#usuariosEspecificos').fcbkcomplete({
            json_url: gafisa.alphabook.rotas.postagem.listarUsuariosEspecificos,
            cache: true,
            newel: false,
            maxitems: 999,
            complete_text: 'Digite o nome de um usuário',
            width: 413,
            bricket: false
        });

        /*var convidados = $('#formCompromisso .textarea-convidados-compromisso').data('source');

        if (typeof (convidados) == 'string' && convidados != '')
            convidados = JSON.parse(convidados);

        if (convidados != null && convidados != undefined && convidados != '') {
            $.each(convidados, function (index, value) {
                $('#convidadosCompromisso').trigger('addItem', [{ 'title': value.Nome + ' ' + value.Sobrenome, 'value': value.Id }]);
            });
        }*/
    }
};

$(document).ready(gafisa.alphabook.home.postagem.inicializar);
