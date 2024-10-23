if (typeof gafisa.alphabook.home == 'undefined') { gafisa.alphabook.home = new Object(); }

gafisa.alphabook.home.protocolos = {
    localizacaoEdicao: false,
    completo: false,
    uploader: null,
    arquivos: 0,
    inicializar: function () {
        gafisa.alphabook.home.protocolos.registrarAcoes();
    },

    registrarAcoes: function () {
        $('#tileProtocolos').livequery('click', gafisa.alphabook.home.protocolos.aoClicarTile);
    },

    aoClicarTile: function () {
        if (!$(this).hasClass('inativo'))
            $.navegar.proximo(gafisa.alphabook.rotas.protocolos.index, { projetoId: gafisa.alphabook.home.carrossel.obterIdProjeto() }, gafisa.alphabook.home.protocolos.aoExibirTela);
    },

    aoExibirTela: function (ids) {

        if (ids)
            $('#protocolosProjeto').data('ids', ids);

        $('#tabelaProtocolos').tabela({ action: gafisa.alphabook.rotas.protocolos.listarProtocolosProjeto, parametros: gafisa.alphabook.home.protocolos.retornarFiltros(), tamanhoPagina: 30 });

        $('#protocolosProjeto #buscaProtocolo').livequery('click', gafisa.alphabook.home.protocolos.aoBuscarProtocolos);
        $('#protocolosProjeto #termoBuscaProtocolo').onPressEnter(gafisa.alphabook.home.protocolos.aoBuscarProtocolos);
        $('#protocolosProjeto [name="linkProtocolo"]').livequery('click', gafisa.alphabook.home.protocolos.editarProtocolo);
        $('#protocolosProjeto #adicionarProtocolo').livequery('click', gafisa.alphabook.home.protocolos.aoCriarProtocolo);
        $('#protocolosProjeto .btExcluirProtocolo').livequery('click', gafisa.alphabook.home.protocolos.aoExcluirProtocolo);
    },

    aoCriarProtocolo: function () {
        $.dialogo.exibir(gafisa.alphabook.rotas.protocolos.incluir, { projetoId: gafisa.alphabook.home.carrossel.obterIdProjeto() }, gafisa.alphabook.home.protocolos.aoAbrirCriarProtocolo);
        $("html, body").animate({
            scrollTop: 0
        }, "slow");
    },

    aoAbrirCriarProtocolo: function () {
        gafisa.alphabook.home.protocolos.registrarRichText();
        $('#adicionarProtocolo #DataAbertura').livequery(function () { $(this).datepicker(); });
        $('#adicionarProtocolo #notificacao').livequery('click', gafisa.alphabook.home.protocolos.aoAlternarNotificacao);
        $('#adicionarProtocolo #lembrete').livequery('click', gafisa.alphabook.home.protocolos.aoClicarLembrete);
        $('#adicionarProtocolo #anexos').livequery('click', gafisa.alphabook.home.protocolos.aoClicarAnexo);
        $('#adicionarProtocolo #localizacao').livequery('click', gafisa.alphabook.home.protocolos.aoClicarLocalizacao);
        $('#adicionarProtocolo #projetosAssociados').livequery('click', gafisa.alphabook.home.protocolos.aoClicarProjetosAssociados);
        $('#adicionarProtocolo #postRetroativo').livequery('click', gafisa.alphabook.home.protocolos.aoClicarPostRetroativo);
        $('#adicionarProtocolo #PrivacidadeId').livequery('click', gafisa.alphabook.home.protocolos.aoClicarPrivacidade);
        $('#postagemAnexos [name="Classificacao"]').livequery(function () { $('#postagemAnexos [name="Classificacao"]').off().on('change', gafisa.alphabook.home.protocolos.aoSelecionarClassificacao); });
        $('#adicionarProtocolo #incluirProtocolo, .post-completo #salvarProtocolo').livequery('click', gafisa.alphabook.home.protocolos.aoIncluirProtocolo);
        $('#adicionarProtocolo input').onPressEnter(gafisa.alphabook.home.protocolos.aoIncluirProtocolo);
        $('#adicionarProtocolo #ProtocoloPaiId').livequery('change', gafisa.alphabook.home.protocolos.aoAlterarProtocoloPai);
        
        $('#adicionarProtocolo #marco').livequery('click', gafisa.alphabook.home.protocolos.aoAlternarMarco);
        $('#adicionarProtocolo #EtapaId').livequery('change', gafisa.alphabook.home.protocolos.aoAlterarEtapa);
        $('#adicionarProtocolo #EtapaId').livequery(function () { $(this).change(); });
        $('#adicionarProtocolo #etapaConcluida').livequery('change', gafisa.alphabook.home.protocolos.aoAlterarEtapaConcluida);
    },

    aoSelecionarClassificacao: function () {
        var obj = $("#postagemAnexos tr[data-arquivoid='" + $(this).data("arquivoid") + "'");
        if ($(this).val() != '') {
            $.get(
                gafisa.alphabook.rotas.taxonomia.obterDadosClassificacao,
                { classificacaoTaxonomiaId: $(this).val() },
                function (json) { gafisa.alphabook.home.protocolos.aoRetornarClassificacao(json, obj); });
        } else {
            obj.find(".para-que-serve").text('');
            obj.find(".confidencialidade").text('');
        }
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
        $('#adicionarProtocolo #textoCriacaoPost').jqte(param);
        $('#modalEditarProtocolo #textoCriacaoPost').jqte(param);

        $('.jqte .jqte_editor').on('paste', gafisa.alphabook.home.protocolos.aoColarDescricaoPost);
    },

    aoColarDescricaoPost: function (e) {
        e.currentTarget.innerHTML = e.currentTarget.innerText;
    },

    aoBuscarProtocolos: function () {
        $('#tabelaProtocolos').tabela({ acao: "carregar", parametros: gafisa.alphabook.home.protocolos.retornarFiltros() });
    },

    retornarFiltros: function () {
        var data = {};

        data.ordenacao = 1;
        data.tipo = 1;
        data.projetoId = gafisa.alphabook.home.carrossel.obterIdProjeto();
        data.status = $('#protocolosProjeto #Status').val() != "" ? $('#protocolosProjeto #Status').val() : null;
        data.termo = $('#protocolosProjeto #termoBuscaProtocolo').val() != "" ? $('#protocolosProjeto #termoBuscaProtocolo').val() : null;

        if ($('#protocolosProjeto').data('ids')) {
            data.IdsProtocolos = $('#protocolosProjeto').data('ids');
            data.projetoId = null;
        }

        return data;
    },

    editarProtocolo: function () {
        gafisa.alphabook.home.protocolos.completo = false;
        $.dialogo.exibir(gafisa.alphabook.rotas.protocolos.editar, { protocoloId: $(this).data('id'), projetoId: gafisa.alphabook.home.carrossel.obterIdProjeto() }, gafisa.alphabook.home.protocolos.aoAbrirEditarProtocolo);
    },

    criarProtocolo: function () {
        $.dialogo.exibir(gafisa.alphabook.rotas.protocolos.incluir, null, gafisa.alphabook.home.protocolos.aoAbrirCriarProtocolo);
    },

    aoAbrirEditarProtocolo: function () {
        $('#modalEditarProtocolo #salvarProtocolo').livequery('click', gafisa.alphabook.home.protocolos.salvarEdicaoProtocolo);
        $('#modalEditarProtocolo #anexosEdicao').livequery('click', gafisa.alphabook.home.protocolos.aoClicarAnexoEdicao);
        $('#modalEditarProtocolo #projetosAssociadosEdicao').livequery('click', gafisa.alphabook.home.protocolos.aoClicarProjetosAssociadosEdicao);
        $('#modalEditarProtocolo #localizacao').livequery('click', gafisa.alphabook.home.protocolos.aoClicarLocalizacao);

        $('#protocoloCompleto #incluirPostCompletoProtocolo').livequery('click', gafisa.alphabook.home.protocolos.aoClicarSalvarPostCompletoProtocolo);
        var edicao = $('#hddProtocolo').val();
        if (!edicao) $('#modalEditarProtocolo .box-post').css('width', '360px');
    },

    salvarEdicaoProtocolo: function () {
        if (gafisa.alphabook.home.protocolos.validarEdicao()) {

            var data = new Object();
            data.DataAbertura = $("#modalEditarProtocolo #DataAbertura").val();
            data.Orgao = $("#modalEditarProtocolo #Orgao").val();
            data.StatusProtocoloId = $("#modalEditarProtocolo #StatusProtocolo").val();
            data.Requerente = $("#modalEditarProtocolo #Requerente").val();
            data.Observacoes = $("#modalEditarProtocolo #Observacoes").val();
            data.Id = $("#modalEditarProtocolo").data("id");
            data.ProtocoloPaiId = $('#modalEditarProtocolo #ProtocoloPaiId').val();

            $.post(gafisa.alphabook.rotas.protocolos.editar, data, gafisa.alphabook.home.protocolos.aoRetornarEditarProtocolo);
        }
    },

    aoRetornarEditarProtocolo: function (json) {
        if (json.sucesso) {
            gafisa.alphabook.mensagens.exibirMensagemConfirmacao(gafisa.mensagens.comum.salvoComSucesso.format('Protocolo'));
            $.fn.dialogo.fechar(gafisa.alphabook.home.protocolos.aoBuscarProtocolos);
        } else {
            gafisa.alphabook.mensagens.exibirMensagemErro(json.erros);
        }
    },

    validarEdicao: function () {

        if ($("#modalEditarProtocolo #DataAbertura").val() == '') {
            gafisa.alphabook.mensagens.exibirMensagemErro(gafisa.mensagens.comum.obrigatoria.format('Data de Abertura'));
            return false;
        }

        if ($("#modalEditarProtocolo #Orgao").val() == '') {
            gafisa.alphabook.mensagens.exibirMensagemErro(gafisa.mensagens.comum.obrigatorio.format('Órgão'));
            return false;
        }

        if ($("#modalEditarProtocolo #StatusProtocolo").val() == '') {
            gafisa.alphabook.mensagens.exibirMensagemErro(gafisa.mensagens.comum.obrigatorio.format('Status'));
            return false;
        }

        return true;

    },

    aoAlternarNotificacao: function () {
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
        $('#adicionarProtocolo #lembretePost').show();
        $('#adicionarProtocolo #DataLembrete').datetimepicker();
        $('#adicionarProtocolo #limparDataLembrete').livequery('click', gafisa.alphabook.home.protocolos.aoLimparDataLembrete);
        $('#adicionarProtocolo #confirmarDataLembrete').livequery('click', gafisa.alphabook.home.protocolos.aoConfirmarDataLembrete);
    },

    aoLimparDataLembrete: function () {
        $('#adicionarProtocolo #DataLembrete').val('');
    },

    aoConfirmarDataLembrete: function () {
        $('#adicionarProtocolo #lembretePost').hide();
        if ($('#adicionarProtocolo #DataLembrete').val() != '') {
            $('#adicionarProtocolo #lembrete').removeClass('ico-post-lembrete-inativo').addClass('ico-post-lembrete');
        } else {
            $('#adicionarProtocolo #lembrete').removeClass('ico-post-lembrete').addClass('ico-post-lembrete-inativo');
        }
    },

    aoAlternarMarco: function () {
        var obj = $(this);
        if (obj.data('marco')) {
            obj.data('marco', false);
            obj.removeClass('ico-post-linha-tempo').addClass('ico-post-linha-tempo-inativo');
            $('#adicionarProtocolo #etapa-post').hide();
        }
        else {
            obj.data('marco', true);
            obj.removeClass('ico-post-linha-tempo-inativo').addClass('ico-post-linha-tempo');
            $('#adicionarProtocolo #etapa-post').show();
        }
        $.navegar.ajustarRodape();
    },

    aoAlterarEtapa: function () {
        var statusEtapaId = $(this).val().split('|')[1];

        if (statusEtapaId == 3 || statusEtapaId == 5 || statusEtapaId == 6) {
            $('#adicionarProtocolo .campo-etapa').hide();
        } else {
            $('#adicionarProtocolo .campo-etapa').show();
        }
    },

    aoAlterarEtapaConcluida: function () {
        var etapaConcluida = $(this).val();

        if (etapaConcluida == 'true') {
            $('#adicionarProtocolo #statusEtapaNaoConcluida').hide();
            $('#adicionarProtocolo #statusEtapaConcluida').show();
        } else {
            $('#adicionarProtocolo #statusEtapaNaoConcluida').show();
            $('#adicionarProtocolo #statusEtapaConcluida').hide();
        }

        $.navegar.ajustarRodape();
    },

    aoClicarAnexo: function () {
        if (!gafisa.alphabook.home.protocolos.completo) {
            gafisa.alphabook.home.protocolos.aoConfirmarNavegacaoCompleto();
        }
        else {
            $('html, body').animate({
                scrollTop: $("#postagemAnexos #accordionAnexos").offset().top
            }, 1000);
        }
    },

    aoClicarAnexoEdicao: function () {
        if (gafisa.alphabook.home.protocolos.completo) {
            $('html, body').animate({
                scrollTop: $("#postagemAnexos #accordionAnexos").offset().top
            }, 1000);
        }
        else {
            gafisa.alphabook.home.protocolos.aoConfirmarNavegacaoCompletoEdicao();
        }
    },

    aoConfirmarNavegacaoCompleto: function () {
        var dados = { projetoid: gafisa.alphabook.home.carrossel.obterIdProjeto() };
        var data = gafisa.alphabook.home.protocolos.obterJsonDadosDigitados();
        $.navegar.proximo(gafisa.alphabook.rotas.protocolos.criarProtocolo, dados, function () { gafisa.alphabook.home.protocolos.aposCarregarPostCompleto(data, false); });
        gafisa.alphabook.home.protocolos.completo = true;
        $.fn.dialogo.fechar();
    },

    aoConfirmarNavegacaoCompletoEdicao: function () {
        var data = gafisa.alphabook.home.protocolos.obterJsonDadosDigitadosEdicao();
        var dados = { projetoid: gafisa.alphabook.home.carrossel.obterIdProjeto(), protocoloId: data.protocoloId };
        $.navegar.proximo(gafisa.alphabook.rotas.protocolos.criarProtocolo, dados, function () { gafisa.alphabook.home.protocolos.aposCarregarPostCompleto(data, true); });
        gafisa.alphabook.home.protocolos.completo = true;
        $.fn.dialogo.fechar();
    },

    aposCarregarPostCompleto: function (data, edicao) {
        $('#divBtnSalvarProtocolo').hide();
        if (data != undefined)
            gafisa.alphabook.home.protocolos.preencherTelaDadosDigitados(data, edicao);

        gafisa.alphabook.home.protocolos.registrarRichText();
        gafisa.alphabook.home.protocolos.configurarUploader();
        gafisa.alphabook.home.protocolos.completo = true;

        var associados = [];
        associados.push(gafisa.alphabook.home.carrossel.obterIdProjeto());

        $("#postagemAnexos .botao-excluir-anexo").livequery('click', gafisa.alphabook.home.protocolos.aoExcluirAnexo);

        if (edicao) 
            gafisa.alphabook.home.protocolos.aoAbrirCriarProtocolo();

        $('#modalEditarProtocolo .box-post').css('width', '');

        $.navegar.ajustarRodape();
    },

    aoExcluirAnexo: function () {
        var arquivoExcluido = gafisa.alphabook.home.protocolos.uploader.getFile($(this).data('arquivoid'));
        gafisa.alphabook.home.protocolos.uploader.removeFile(arquivoExcluido);
        $("#postagemAnexos tr[data-arquivoid='" + $(this).data('arquivoid') + "'").hide('slow').remove();
        gafisa.alphabook.home.protocolos.arquivos--;
        gafisa.alphabook.home.protocolos.totalizarAnexos();
    },

    aoClicarLocalizacao: function () {
        if (!gafisa.alphabook.home.protocolos.completo) {
            var edicao = $('#hddProtocolo').val() != undefined? $('#hddProtocolo').val() : 0;
            
            if (edicao > 0) {
                gafisa.alphabook.home.protocolos.completo = true;
                gafisa.alphabook.home.protocolos.localizacaoEdicao = true;
                gafisa.alphabook.home.protocolos.aoConfirmarNavegacaoCompletoEdicao();
                return;
            } else {
                gafisa.alphabook.home.protocolos.aoConfirmarNavegacaoCompleto();
            }
        }
    },

    aoEscolherAssociarContato: function () {

        $.dialogo.selecionarContato({ tipo: 'contato', aoSelecionar: gafisa.alphabook.home.protocolos.aposSelecionarContato });
    },

    aoEscolherAssociarMapa: function () {
        if (gafisa.alphabook.home.protocolos.arquivos > 0) {
            $.dialogo.confirmar(gafisa.mensagens.comum.anexosRemovidosPostagem, gafisa.alphabook.home.protocolos.aoConfirmarEscolherAssociarMapa);
        }
        else {
            gafisa.alphabook.home.protocolos.aoConfirmarEscolherAssociarMapa();
        }
    },

    aoConfirmarEscolherAssociarMapa: function () {

        gafisa.alphabook.home.protocolos.arquivos = 0;
        gafisa.alphabook.home.protocolos.uploader = null;
        $('#postagemAnexos #arquivos tbody').html('');

        var obj = "<span id=\"textoCriacaoPost\">" + $('#adicionarProtocolo #textoCriacaoPost').val() + "</span>";
        $(".msg-post-criar-post").html('').html(obj);
        $.navegar.tratarValores();
        $('#adicionarProtocolo #DataAbertura').datepicker('destroy');
        $.navegar.obterPontoMapa(gafisa.alphabook.home.protocolos.aposSelecionarLocalizacao);
    },

    aposSelecionarLocalizacao: function (latitude, longitude) {

        $('#adicionarProtocolo #textoCriacaoPost').livequery(gafisa.alphabook.home.protocolos.registrarRichText);
        gafisa.alphabook.home.protocolos.configurarUploader();
        $('#adicionarProtocolo #DataAbertura').livequery(function () { $(this).datepicker(); });
        if (latitude != null) {
            $('#adicionarProtocolo #localizacao').data('idContato', null).data('latitude', latitude).data('longitude', longitude).removeClass('ico-post-pin-inativo').addClass('ico-post-pin');
        } else {
            $('#adicionarProtocolo #localizacao').data('idContato', null).data('latitude', null).data('longitude', null).removeClass('ico-post-pin').addClass('ico-post-pin-inativo');
        }

        $.navegar.ajustarRodape();
    },

    aposSelecionarContato: function (idContato) {
        if (idContato != null) {
            $('#adicionarProtocolo #localizacao').data('idContato', idContato).data('latitude', null).data('longitude', null).removeClass('ico-post-pin-inativo').addClass('ico-post-pin');
        } else {
            $('#adicionarProtocolo #localizacao').data('idContato', null).data('latitude', null).data('longitude', null).removeClass('ico-post-pin').addClass('ico-post-pin-inativo');
        }
    },

    aoClicarProjetosAssociados: function () {
        if (gafisa.alphabook.home.protocolos.completo) {
            $('html, body').animate({
                scrollTop: $("#postagemProjetosAssociados #accordionProjetosAssociados").offset().top
            }, 1000);
        }
        else {
            gafisa.alphabook.home.protocolos.aoConfirmarNavegacaoCompleto();
        }
    },

    aoClicarProjetosAssociadosEdicao: function () {
        if (gafisa.alphabook.home.protocolos.completo) {
            $('html, body').animate({
                scrollTop: $("#postagemProjetosAssociados #accordionProjetosAssociados").offset().top
            }, 1000);
        }
        else {
            gafisa.alphabook.home.protocolos.aoConfirmarNavegacaoCompletoEdicao();
        }
    },

    aoClicarPostRetroativo: function () {
        $('#adicionarProtocolo #dataHoraPost').show();
        $('#adicionarProtocolo #DataRetroativa').datetimepicker();
        $('#adicionarProtocolo #limparDataRetroativa').livequery('click', gafisa.alphabook.home.protocolos.aoLimparDataRetroativa);
        $('#adicionarProtocolo #confirmarDataRetroativa').livequery('click', gafisa.alphabook.home.protocolos.aoConfirmarDataRetroativa);
    },

    aoLimparDataRetroativa: function () {
        $('#adicionarProtocolo #DataRetroativa').val('');
    },

    aoConfirmarDataRetroativa: function () {
        $('#adicionarProtocolo #dataHoraPost').hide();
        if ($('#adicionarProtocolo #DataRetroativa').val() != '') {
            $('#adicionarProtocolo #spanDataRetroativa').text('| ' + $('#DataRetroativa').val());
            $('#adicionarProtocolo #postRetroativo').removeClass('ico-calendario-inativo').addClass('ico-calendario');
        } else {
            $('#adicionarProtocolo #spanDataRetroativa').text('');
            $('#adicionarProtocolo #postRetroativo').removeClass('ico-calendario').addClass('ico-calendario-inativo');
        }
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

        gafisa.alphabook.home.protocolos.exibirAlertaPrivacidade();

        var privacidadeId = $("#adicionarProtocolo #PrivacidadeId").val();

        if (privacidadeId == 3) {
            $('#adicionarProtocolo #divUsuariosEspecificos').hide();
            $("#DepartamentoId").show('slow');
        }
        else if (privacidadeId == 5) {
            $("#adicionarProtocolo #DepartamentoId").hide('slow');
            $('#adicionarProtocolo #divUsuariosEspecificos').show();
        }
        else {
            $("#adicionarProtocolo #DepartamentoId").hide('slow');
            $('#adicionarProtocolo #divUsuariosEspecificos').hide();
        }
    },

    aoIncluirProtocolo: function () {

        if (gafisa.alphabook.home.protocolos.validar()) {

            var data = new Object();

            data.Titulo = $('#adicionarProtocolo #TituloCriacaoPost').val();
            data.TextoPostagem = htmlEncode($('#adicionarProtocolo .jqte_editor').text());
            data.Notificacao = $('#adicionarProtocolo #notificacao').data('notificar');
            data.DataLembrete = $('#adicionarProtocolo #DataLembrete').val();
            data.DataRetroativa = $('#adicionarProtocolo #DataRetroativa').val();
            data.PrivacidadeId = $('#adicionarProtocolo #PrivacidadeId').val();
            data.DepartamentoId = $('#adicionarProtocolo #DepartamentoId').val();
            data.ProtocoloPaiId = $('#adicionarProtocolo #ProtocoloPaiId').val();

            data.IdsProjetosAssociados = [];

            $("#tabelaProjetosAssociados input:checkbox[name='checkProjeto']").each(function () {
                data.IdsProjetosAssociados.push($(this).data('id'));
            });

            data.NumeroProtocolo = $('#adicionarProtocolo #NumeroProtocolo').val();
            data.DataAbertura = $('#adicionarProtocolo #DataAbertura').val();
            data.Orgao = $('#adicionarProtocolo #Orgao').val();
            data.StatusProtocoloId = $('#adicionarProtocolo #StatusProtocolo').val();
            data.Requerente = $('#adicionarProtocolo #Requerente').val();
            data.Observacoes = $('#adicionarProtocolo #Observacao').val();
            data.ProjetoId = gafisa.alphabook.home.carrossel.obterIdProjeto();
            data.ContatoId = $('#adicionarProtocolo #localizacao').data('idContato');
            data.Latitude = $('#adicionarProtocolo #localizacao').data('latitude');
            data.Longitude = $('#adicionarProtocolo #localizacao').data('longitude');

            if (data.PrivacidadeId == 5)
                data.UsuariosEspecificosIds = $('#adicionarProtocolo #usuariosEspecificos').val();

            data.LinhaTempo = $('#adicionarProtocolo #marco').data('marco');
            if (data.LinhaTempo) {
                data.EtapaId = $('#adicionarProtocolo #EtapaId').val().split('|')[0];
                data.EtapaConcluida = $('#adicionarProtocolo #etapaConcluida').val();
            }

            $.loading({ action: 'show' });

            $.post(gafisa.alphabook.rotas.protocolos.incluir, data, gafisa.alphabook.home.protocolos.aoRetornarIncluirProtocolo);
        }
    },

    aoRetornarIncluirProtocolo: function (json) {
        if (json.sucesso) {
            if (!gafisa.alphabook.home.protocolos.completo) {
                gafisa.alphabook.home.protocolos.sucessoInclusao();
            }
            else {
                if (gafisa.alphabook.home.protocolos.arquivos > 0) {
                    gafisa.alphabook.home.protocolos.postagemid = json.postagemid;
                    gafisa.alphabook.home.protocolos.iniciarUploadArquivos();
                } else
                    gafisa.alphabook.home.protocolos.sucessoInclusao();
            }
        } else {
            gafisa.alphabook.mensagens.exibirMensagemErro(json.erros);
            $.loading({ action: 'hide' });
        }
    },

    sucessoInclusao: function () {
        $.loading({ action: 'hide' });
        gafisa.alphabook.mensagens.exibirMensagemConfirmacao(gafisa.mensagens.comum.incluidoSucesso.format('Protocolo'));
        if (gafisa.alphabook.home.protocolos.completo) {
            $.navegar.proximo(gafisa.alphabook.rotas.protocolos.index, { projetoId: gafisa.alphabook.home.carrossel.obterIdProjeto() }, gafisa.alphabook.home.protocolos.aoExibirTela);
        }
        else {
            $.fn.dialogo.fechar(gafisa.alphabook.home.protocolos.aoBuscarProtocolos);
        }
        gafisa.alphabook.home.protocolos.completo = false;
    },

    validar: function () {


        if ($("#adicionarProtocolo #NumeroProtocolo").val() == '') {
            gafisa.alphabook.mensagens.exibirMensagemErro(gafisa.mensagens.comum.obrigatorio.format('Número do Protocolo'));
            return false;
        }

        if ($("#adicionarProtocolo #DataAbertura").val() == '') {
            gafisa.alphabook.mensagens.exibirMensagemErro(gafisa.mensagens.comum.obrigatoria.format('Data de Abertura'));
            return false;
        }

        if ($("#adicionarProtocolo #Orgao").val() == '') {
            gafisa.alphabook.mensagens.exibirMensagemErro(gafisa.mensagens.comum.obrigatorio.format('Órgão'));
            return false;
        }

        if ($("#adicionarProtocolo #StatusProtocolo").val() == '') {
            gafisa.alphabook.mensagens.exibirMensagemErro(gafisa.mensagens.comum.obrigatorio.format('Status'));
            return false;
        }

        if ($("#adicionarProtocolo #TituloCriacaoPost").val() == '') {
            gafisa.alphabook.mensagens.exibirMensagemErro(gafisa.mensagens.comum.obrigatorio.format('Assunto'));
            return false;
        }

        if ($('#adicionarProtocolo .jqte_editor').text() == '') {
            gafisa.alphabook.mensagens.exibirMensagemErro(gafisa.mensagens.comum.obrigatoria.format('Descrição'));
            return false;
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

    iniciarUploadArquivos: function () {
        gafisa.alphabook.home.protocolos.uploader.settings.multipart_params = { postagemId: gafisa.alphabook.home.protocolos.postagemid, classificacaoTaxonomiaId: $("#protocoloCompleto").data("idclassificacao"), projetoId: gafisa.alphabook.home.carrossel.obterIdProjeto() };
        gafisa.alphabook.home.protocolos.uploader.start();
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
        gafisa.alphabook.home.protocolos.uploader = new plupload.Uploader({
            runtimes: runtimes,
            browse_button: 'selecionarArquivos',
            container: 'container',
            max_file_size: '50mb',
            url: gafisa.alphabook.rotas.arquivo.uploadAnexo,
            flash_swf_url: gafisa.alphabook.rotas.uploadFlash,
            silverlight_xap_url: gafisa.alphabook.rotas.uploadSiverlight,
            filters: [{ title: 'Arquivos', extensions: '*'}],
            urlstream_upload: true
        });

        gafisa.alphabook.home.protocolos.uploader.init();

        gafisa.alphabook.home.protocolos.uploader.bind('FilesAdded', gafisa.alphabook.home.protocolos.aoAdicionarArquivo);
        gafisa.alphabook.home.protocolos.uploader.bind('Error', gafisa.alphabook.home.protocolos.erro);
        gafisa.alphabook.home.protocolos.uploader.bind('FileUploaded', gafisa.alphabook.home.protocolos.aposUploadArquivo);
        gafisa.alphabook.home.protocolos.uploader.bind('UploadComplete', gafisa.alphabook.home.protocolos.aposCompletarUpload);
        gafisa.alphabook.home.protocolos.uploader.bind('BeforeUpload', gafisa.alphabook.home.protocolos.antesEnviarArquivo);

        gafisa.alphabook.home.protocolos.uploader.refresh();
    },

    antesEnviarArquivo: function (up, file) {
        var obj = $("#postagemAnexos tr[data-arquivoid='" + file.id + "']").find("[name='Classificacao']");
        up.settings.multipart_params.classificacaoTaxonomiaId = obj.val();
    },

    aoAdicionarArquivo: function (up, files) {
        var idsArquivo = "";

        for (var i = 0; i < files.length; i++) {
            var nomeArquivo = files[i].name;

            var html = '<tr data-arquivoid="{1}">' +
				'<td class="colun-1">{0}</td>' +
				'<td class="colun-2 taxo-select">{2}</td>' +
				'<td class="colun-3">' +
                '    <select data-arquivoid="{1}" name="Classificacao" class="campo-status filtro-carrossel-status campo-classificacao">' +
                '    </select>' +
                '</td>' +
				'<td class="colun-4 para-que-serve" data-arquivoid="{1}"></td>' +
                '<td class="colun-5 confidencialidade" data-arquivoid="{1}"></td>' +
				'<td class="colun-6"><a href="javascript:void(0)" class="ico-excluir ajuste-ico botao-excluir-anexo" title="Excluir" data-arquivoid="{1}">Excluir</a></td>' +
			    '</tr>';

            var classificacaoPadrao = $("#protocoloCompleto");
            $('#postagemAnexos #arquivos tbody').append(html.format(nomeArquivo, files[i].id, classificacaoPadrao.data('nometaxonomia')));

            gafisa.alphabook.home.protocolos.arquivos++;
            idsArquivo += "#postagemAnexos .campo-classificacao[data-arquivoid='" + files[i].id + "'],";
        }

        $.get(gafisa.alphabook.rotas.taxonomia.listarClassificacaoTaxonomia,
            { taxonomiaId: $("#protocoloCompleto").data("idtaxonomia") }, function (json) { gafisa.alphabook.home.protocolos.aoListarClassificacoes(json, idsArquivo.substring(0, idsArquivo.length - 1)); });

        gafisa.alphabook.home.protocolos.totalizarAnexos();
    },

    aoListarClassificacoes: function (json, idsArquivo) {
        var sel = $(idsArquivo);

        sel.each(function () {
            $(this).empty();
            $(this).append('<option value="">Selecione</option>');
            for (var i = 0; i < json.length; i++) {
                $(this).append('<option value="' + json[i].Id + '">' + json[i].Nome + '</option>');
            }
        });

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
                function () { gafisa.alphabook.home.protocolos.alterarPrivacidadePost(json); },
                function () { gafisa.alphabook.home.protocolos.manterPrivacidadePost(tr, json); },
                function () { gafisa.alphabook.home.protocolos.naoIncluirAnexo(tr); });

        }
    },

    alterarPrivacidadePost: function () {
        $("#PrivacidadeId").val($("#protocoloCompleto").data("idprivacidade"));
        gafisa.alphabook.home.protocolos.exibirAlertaPrivacidade();
    },

    manterPrivacidadePost: function (tr, json) {
        $("#postagemAnexos #alertaPrivacidade").show('slow');
        $("#postagemAnexos .confidencialidade").html(json.Privacidade + '<a href="javascript:void(0)" class="ico-alerta" title="ATENÇÃO: existem anexos com confidencialidade incompatível com o perfil de publicação do post.">Alerta</a>');
        gafisa.alphabook.home.protocolos.exibirAlertaPrivacidade();
    },

    naoIncluirAnexo: function (tr) {
        $('#postagemAnexos #arquivos tbody tr').each(function () { gafisa.alphabook.home.protocolos.uploader.removeFile($(this).data('arquivoid')); }).hide('slow').remove();
        gafisa.alphabook.home.protocolos.arquivos = 0;
        gafisa.alphabook.home.protocolos.totalizarAnexos();
        gafisa.alphabook.home.protocolos.exibirAlertaPrivacidade();
    },

    aposUploadArquivo: function (up, file, response) {
        var resposta = $.parseJSON(response.response);
        if (!resposta.sucesso) {

            gafisa.alphabook.home.protocolos.uploader.stop();
            gafisa.alphabook.mensagens.exibirMensagemErro(resposta.erro);

            for (var i = 0; i < gafisa.alphabook.home.protocolos.uploader.files.length; i++) {
                gafisa.alphabook.home.protocolos.uploader.files[i].percent = 0;
                gafisa.alphabook.home.protocolos.uploader.files[i].status = plupload.QUEUED;
            }
        }
    },

    aposCompletarUpload: function (up, files) {
        $.loading({ action: 'hide' });
        for (var i = 0; i < files.length; i++) {
            if (files[i].state == plupload.FAILED) {
                return;
            }
        }

        gafisa.alphabook.home.protocolos.sucessoInclusao();
    },

    erro: function (up, erro) {
        var listaErros = [];

        if (erro.code == plupload.FILE_SIZE_ERROR)
            listaErros.push(gafisa.mensagens.upload.tamanhoMaximoExcedido.format(50));

        if (listaErros.length > 0) {
            gafisa.alphabook.mensagens.exibirMensagemErro(listaErros);
        }
    },

    totalizarAnexos: function () {
        $("#adicionarProtocolo #anexos").text(gafisa.alphabook.home.postagem.arquivos);
    },

    sucessoPostagemCompleta: function () {
        gafisa.alphabook.mensagens.exibirMensagemConfirmacao(gafisa.mensagens.comum.salvoComSucesso.format('Protocolo'));
        gafisa.alphabook.home.protocolos.completo = false;
        $.navegar.anterior(function () { gafisa.alphabook.home.postagem.aposSalvarPostCompleto(); });
    },

    obterJsonDadosDigitados: function () {
        var data = new Object();
        if (gafisa.alphabook.home.postagem.completo) {
            data.protocoloId = $('#hddProtocolo').val();
        } else {
            data.Titulo = $('#adicionarProtocolo #TituloCriacaoPost').val();
            data.Postagem = $('#adicionarProtocolo #textoCriacaoPost').val();
            data.Notificacao = $('#adicionarProtocolo #notificacao').data('notificar');
            data.LinhaTempo = $('#adicionarProtocolo #marco').data('marco');
            data.DataLembrete = $('#adicionarProtocolo #DataLembrete').val();
            data.DataRetroativa = $('#adicionarProtocolo #DataRetroativa').val();
            data.PrivacidadeId = $('#adicionarProtocolo #PrivacidadeId').val();
            data.DepartamentoId = $('#adicionarProtocolo #DepartamentoId').val();
            data.NumeroProtocolo = $('#adicionarProtocolo #NumeroProtocolo').val();
            data.DataAbertura = $('#adicionarProtocolo #DataAbertura').val();
            data.Orgao = $('#adicionarProtocolo #Orgao').val();
            data.StatusProtocolo = $('#adicionarProtocolo #StatusProtocolo').val();
            data.Requerente = $('#adicionarProtocolo #Requerente').val();
            data.Observacao = $('#adicionarProtocolo #Observacao').val();
            data.ProtocoloPaiId = $('#adicionarProtocolo #ProtocoloPaiId').val();
        }

        return data;
    },

    obterJsonDadosDigitadosEdicao: function () {
        var data = new Object();
        data.protocoloId = $('#hddProtocolo').val();
        data.Titulo = $('#modalEditarProtocolo #TituloCriacaoPost').val();
        data.Postagem = $('#modalEditarProtocolo #textoCriacaoPost').val();
        data.Notificacao = $('#modalEditarProtocolo #notificacao').data('notificar');
        data.LinhaTempo = $('#modalEditarProtocolo #marco').data('marco');
        data.DataLembrete = $('#modalEditarProtocolo #DataLembrete').val();
        data.DataRetroativa = $('#modalEditarProtocolo #DataRetroativa').val();
        data.PrivacidadeId = $('#modalEditarProtocolo #PrivacidadeId').val();
        data.DepartamentoId = $('#modalEditarProtocolo #DepartamentoId').val();
        data.NumeroProtocolo = $('#modalEditarProtocolo #NumeroProtocolo').val();
        data.DataAbertura = $('#modalEditarProtocolo #DataAbertura').val();
        data.Orgao = $('#modalEditarProtocolo #Orgao').val();
        data.StatusProtocolo = $('#modalEditarProtocolo #StatusProtocolo').val();
        data.Requerente = $('#modalEditarProtocolo #Requerente').val();
        data.Observacao = $('#modalEditarProtocolo #Observacao').val();
        data.ProtocoloPaiId = $('#modalEditarProtocolo #ProtocoloPaiId').val();
        return data;
    },

    preencherTelaDadosDigitados: function (data, edicao) {

        var id = edicao ? '#modalEditarProtocolo' : '#adicionarProtocolo';

        $(id).find('#TituloCriacaoPost').val(data.Titulo);
        $(id).find('#textoCriacaoPost').html(data.Postagem);
        $(id).find('#NumeroProtocolo').val(data.NumeroProtocolo);
        $(id).find('#DataAbertura').val(data.DataAbertura);
        $(id).find('#Orgao').val(data.Orgao);
        $(id).find('#StatusProtocolo').val(data.StatusProtocolo);
        $(id).find('#Requerente').val(data.Requerente);
        $(id).find('#Observacao').val(data.Observacao);
        if (data.Notificacao) {
            $(id).find('#notificacao').data('notificar', data.Notificacao);
            $(id).find('#notificacao').removeClass('ico-post-notificacao-inativo').addClass('ico-post-notificacao');
        }
        if (data.LinhaTempo) {
            $(id).find('#marco').data('marco', data.LinhaTempo);
            $(id).find('#marco').removeClass('ico-post-linha-tempo-inativo').addClass('ico-post-linha-tempo');
        }
        if (data.DataLembrete != '') {
            $(id).find('#DataLembrete').val(data.DataLembrete);
            $(id).find('#lembrete').removeClass('ico-post-lembrete-inativo').addClass('ico-post-lembrete');
        }
        if (data.DataRetroativa != '') {
            $(id).find('#DataRetroativa').val(data.DataRetroativa);
            $(id).find('#spanDataRetroativa').text('| ' + data.DataRetroativa);
            $(id).find('#postRetroativo').removeClass('ico-calendario-inativo').addClass('ico-calendario');
        }

        $(id).find('#PrivacidadeId').val(data.PrivacidadeId);
        $(id).find('#DepartamentoId').val(data.DepartamentoId);

        if (data.PrivacidadeId == 3) {
            $(id).find('#DepartamentoId').show('slow');
        }

        $(id).find('#ProtocoloPaiId').val(data.ProtocoloPaiId);

        if (data.ProtocoloPaiId)
            $('.seg-combos-privacidade-criar').hide();
    },

    aoExcluirProtocolo: function () {
        var protocolo = $(this);
        $.dialogo.confirmar(gafisa.mensagens.comum.desejaRealmenteExcluirProtocolo, function () { gafisa.alphabook.home.protocolos.aoConfirmarExclusaoProtocolo(protocolo); });
    },

    aoConfirmarExclusaoProtocolo: function (protocolo) {
        $.loading({ action: 'show' });
        
        protocolo.parent().parent().addClass('excluido');
        var id = protocolo.parent().parent().data('id');

        var data = { protocoloId: id };
        $.post(gafisa.alphabook.rotas.protocolos.excluirProtocolo, data, gafisa.alphabook.home.protocolos.aposExcluirProtocolo);
    },

    aposExcluirProtocolo: function (json) {
        if (json.sucesso) {
            $('tr.excluido')
                .slideUp(500, function () {
                    gafisa.alphabook.mensagens.exibirMensagemConfirmacao(json.mensagem);
                });

            gafisa.alphabook.home.protocolos.aoBuscarProtocolos();
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

    aoAlterarProtocoloPai: function () {
        if ($(this).val())
            $('#adicionarProtocolo .seg-combos-privacidade-criar').hide();
        else
            $('#adicionarProtocolo .seg-combos-privacidade-criar').show();
    },

    aoClicarSalvarPostCompletoProtocolo: function () {
        gafisa.alphabook.home.postagem.aoClicarSalvarPost();
    }
};

$(document).ready(gafisa.alphabook.home.protocolos.inicializar);
