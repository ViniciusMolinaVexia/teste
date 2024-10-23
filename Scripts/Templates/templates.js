if (typeof gafisa.alphabook.home == 'undefined') { gafisa.alphabook.home = new Object(); }

gafisa.alphabook.home.templates = {
    botaoExcluir: null,
    idtaxonomia: null,
    uploader: {},
    temArquivo: false,

    inicializar: function () {
        gafisa.alphabook.home.templates.registrarAcoes();
        gafisa.alphabook.home.templates.registrarAcoesModal();
    },

    registrarAcoes: function () {
        $('#templates').livequery('click', gafisa.alphabook.home.templates.aoClicarTile);
        $('#buscarArquivos', '#controleTemplates').livequery('click', gafisa.alphabook.home.templates.aoBuscarArquivos);
        $('.pastaDocumento', '#controleTemplates').livequery('click', gafisa.alphabook.home.templates.aoClicarTileDocumento);
        $('.box-doc', '#controleTemplates').livequery('click', gafisa.alphabook.home.templates.aoSelecionarArquivo);
        $('.editar-doc', '.doc-documents').livequery(gafisa.alphabook.home.templates.aoExibirAcaoArquivo);
        $('.ico-download', '#controleTemplates').livequery('click', gafisa.alphabook.home.templates.aoBaixarArquivo);
        $('.ico-informacoes', '#controleTemplates').livequery('click', gafisa.alphabook.home.templates.aoDetalharArquivo);
        $('#ListaTaxonomias', '#controleTemplates').livequery(gafisa.alphabook.home.templates.bindTreeView);
        $('.det-form-taxonomia [name="Pasta"]', '#controleTemplates').livequery('click', gafisa.alphabook.home.templates.aoAbrirPasta);
        $('#alterarTaxonomia', '#controleTemplates').livequery('click', gafisa.alphabook.home.templates.aoAlterarDadosTaxonomia);
        $('#ClassificacaoTaxonomiaId', '#controleTemplates').livequery('change', gafisa.alphabook.home.templates.aoSelecionarClassificacao);
        $('#enviarNovaVersao', '#controleTemplates').livequery('click', gafisa.alphabook.home.templates.aoEnviarNovaVersao);
        $('.removerAnexoVersao', '#controleTemplates').livequery('click', gafisa.alphabook.home.templates.aoRemoverAnexo);
        $('.ico-excluir-modelo', '#controleTemplates').livequery('click', gafisa.alphabook.home.templates.aoExcluirTemplate);
        $('.bt-voltar-documento').livequery('click', gafisa.alphabook.home.templates.aoVoltar);
        $('.ico-excluir', '#tabelaHistorico').livequery('click', gafisa.alphabook.home.templates.aoExcluirVersaoTemplate);
        $('#controleTemplates #termo').onPressEnter(gafisa.alphabook.home.templates.aoBuscarArquivos);
    },

    registrarAcoesModal: function () {
        $('#incluirTemplate').livequery('click', gafisa.alphabook.home.templates.aoAbrirModalTemplate);
        $('.fechar-template').livequery('click', function () { $.dialogo.fechar(function () { $('#incluirTemplate').livequery('click', gafisa.alphabook.home.templates.aoAbrirModalTemplate); }); });
    },

    aoExibirAcaoArquivo: function () {
        $(this).hide()
            .data('fechado', true)
            .clickOutSide(gafisa.alphabook.home.templates.fecharToolTip);
        $('.box-doc').removeClass('box-doc-sel');
    },

    aoBuscarArquivos: function () {
        $.navegar.proximo(gafisa.alphabook.rotas.templates.index, { Termo: $('#termo').val(), IdsTemaplates: $('body').data('ids') });
    },

    aoClicarTile: function () {
        if (!$(this).hasClass('inativo')) {
            if ($('body').data('ids'))
                $('body').removeData('ids');

            $.navegar.proximo(gafisa.alphabook.rotas.templates.index, null, function () { $('body').data('hashPai', window.location.hash); });
        }
    },

    aoClicarTileDocumento: function () {

        var nivel = null, tax = null, dep = null, nome = null, idsTemplates = null;

        if ($(this).data('nivel'))
            nivel = $(this).data('nivel');

        if ($(this).data('tax'))
            tax = $(this).data('tax');

        if ($(this).data('dep'))
            dep = $(this).data('dep');

        if ($(this).data('nome'))
            nome = $(this).data('nome');

        if ($('body').data('ids'))
            idsTemplates = $('body').data('ids');

        var itens = $('.breadcrumb').find('a');
        var hashInicial = '';
        if (itens.length > 1)
            hashInicial = $(itens[0]).attr('href');

        $.navegar.proximo(gafisa.alphabook.rotas.templates.pesquisa, { DepartamentoId: dep, TaxonomiaId: tax, nivel: nivel, Nome: nome, Hash: window.location.hash, HashInicial: hashInicial, ControleSessao: $('#controleSessao').val(), IdsTemplates: idsTemplates });
    },

    aoSelecionarArquivo: function (e) {

        e.preventDefault();

        var $toolTip = $(this).next();
        var alturaBotaoClicado = $(this).offset().top;

        if ($toolTip.data('fechado')) {
            $(this).addClass('box-doc-sel');
            $toolTip.fadeIn('fast');
            $toolTip.data('fechado', false);
            $toolTip.offset({ top: alturaBotaoClicado, left: $(this).offset().left + 320 });
        } else {
            $toolTip.fadeOut('fast');
            $toolTip.data('fechado', true);
            $(this).removeClass('box-doc-sel');
        }
    },

    fecharToolTip: function () {
        $('.editar-doc', '.doc-documents')
            .data('fechado', true)
            .fadeOut('fast');

        $('.box-doc').removeClass('box-doc-sel');
    },

    aoBaixarArquivo: function (e) {
        e.preventDefault();
        let idImagem = $(this).data('idimagem');
        window.location.href = gafisa.alphabook.rotas.arquivo.downloadArquivo.concatQueryString({ referencia: $(this).data('referencia'), nome: $(this).data('nome'), idimagem: $(this).data('idimagem') });
    },

    aoDetalharArquivo: function () {
        var id = null;

        if ($(this).data('id'))
            id = $(this).data('id');

        $.navegar.proximo(gafisa.alphabook.rotas.templates.detalhe, { ArquivoId: id, TileProjeto: $('.tile-topo').html() }, gafisa.alphabook.home.templates.aoListarHistoricoArquivos);
    },

    bindTreeView: function () {
        $(this).jstree({ "themes": {
            "theme": "default",
            "dots": true,
            "icons": true
        }, "plugins": ["themes", "html_data", "ui"]
        }).bind("select_node.jstree", gafisa.alphabook.home.templates.aoClicarPasta);
    },

    aoClicarPasta: function (event, data) {

        $.get(gafisa.alphabook.rotas.taxonomia.listarClassificacaoTaxonomia,
            { taxonomiaId: data.rslt.obj.data("taxonomiaid") }, gafisa.alphabook.home.templates.aoListarClassificacoes);

        $('#ListaTaxonomias').toggle();

        var obj = $('.det-form-taxonomia');
        obj.find('[name="Pasta"]').empty().append('<option value="' + data.rslt.obj.data("taxonomiaid") + '">' + data.rslt.obj.data("taxonomianome") + '</option>');
    },

    aoAbrirPasta: function () {
        gafisa.alphabook.home.templates.idtaxonomia = $(this).data('idtaxonomia');
        $(this).blur();
        $('#ListaTaxonomias').toggle().css({
            left: ($(this).offset().left + 0) + 'px',
            top: ($(this).offset().top + 33) + 'px'
        });
    },

    aoListarClassificacoes: function (json) {
        var sel = $("#ClassificacaoTaxonomiaId");
        sel.empty();
        sel.append('<option value="">Selecione</option>');
        for (var i = 0; i < json.length; i++) {
            sel.append('<option data-privacidade="' + json[i].IdPrivacidade + '" value="' + json[i].Id + '">' + json[i].Nome + '</option>');
        }
    },

    aoListarHistoricoArquivos: function () {
        gafisa.alphabook.home.templates.configurarUploader();
        $('#tabelaHistorico').tabela({ action: gafisa.alphabook.rotas.templates.listarHistoricoArquivo, parametros: { arquivoId: $('#ArquivoId').val(), ordenacao: 2, tipo: 1 }, tamanhoPagina: 6 });
    },

    aoAlterarDadosTaxonomia: function () {

        var privacidadeClassificacao = $('#ClassificacaoTaxonomiaId').find(':selected').data('privacidade');

        var taxonomiaAtual = $('#TaxonomiaAtual').val();
        var taxonomiaSelecionada = $('#taxonomiaId').val();

        var classificacaoAtual = $('#ClassificacaoAtual').val();
        var classificacaoSelecionada = $('#ClassificacaoTaxonomiaId').val();

        if (taxonomiaAtual != taxonomiaSelecionada || classificacaoAtual != classificacaoSelecionada) {
            if ((!privacidadeClassificacao) && privacidadeClassificacao != null)
                gafisa.alphabook.mensagens.exibirMensagemErro(gafisa.mensagens.comum.deveSerPreenchida.format('Classificação'));
            else
                gafisa.alphabook.home.templates.alterarDadosTaxonomia();
        } else
            gafisa.alphabook.mensagens.exibirMensagemAlerta(gafisa.mensagens.comum.semAlteracaoDe.format('classificação'));
    },

    alterarDadosTaxonomia: function () {
        var parametros = { ArquivoId: $('#ArquivoId').val(), ClassificacaoTaxonomiaId: $('#ClassificacaoTaxonomiaId').val() };
        $.post(gafisa.alphabook.rotas.templates.alterarDadosTaxonomia, parametros, gafisa.alphabook.home.templates.aposAlterarDadosTaxonomia, 'json');
    },

    aposAlterarDadosTaxonomia: function (json) {
        if (json.sucesso) {
            gafisa.alphabook.mensagens.exibirMensagemConfirmacao(gafisa.mensagens.comum.alteradoComSucesso.format('Dados de taxonomia'));
            gafisa.alphabook.home.templates.aoClicarTile();
        }
        else
            gafisa.alphabook.mensagens.exibirMensagemErro(json.erros);
    },

    aoSelecionarClassificacao: function () {
        var id = $(this).val();

        if (id && id != '') {
            var url = gafisa.alphabook.rotas.taxonomia.obterDadosClassificacao;
            var parametros = { classificacaoTaxonomiaId: id };
            $.get(url, parametros, gafisa.alphabook.home.templates.modelo.aposSelecionarClassificacao);
        } else {
            $('#privacidade').hide();
            $('#paraQueServe, #palavraChave, #privacidadeSugerida').text('');
        }
    },

    aposSelecionarClassificacao: function (json) {
        $('#privacidade').show();
        $('#paraQueServe').text(json.ParaQueServe);
        $('#palavraChave').text(json.PalavrasChave);
        $('#privacidadeSugerida').text(json.Privacidade);
    },

    configurarUploader: function () {
        $.browser.chrome = $.browser.webkit && window.chrome;
        $.browser.safari = $.browser.webkit && !window.chrome;

        var runtimes = '';

        if (jQuery.browser.safari && !jQuery.browser.chrome)
            runtimes = 'html4';
        else
            runtimes = 'flash,silverlight,html4';

        gafisa.alphabook.home.templates.uploader = new plupload.Uploader({
            runtimes: runtimes,
            browse_button: 'selecionarArquivos',
            container: 'container',
            max_file_size: '50mb',
            multi_selection: false,
            max_file_count: 1,
            url: gafisa.alphabook.rotas.arquivo.uploadVersaoTemplate,
            flash_swf_url: gafisa.alphabook.rotas.uploadFlash,
            silverlight_xap_url: gafisa.alphabook.rotas.uploadSiverlight,
            filters: [{ title: 'Arquivos', extensions: '*'}],
            urlstream_upload: false
        });

        gafisa.alphabook.home.templates.uploader.init();

        gafisa.alphabook.home.templates.uploader.bind('FilesAdded', gafisa.alphabook.home.templates.aoAdicionarArquivo);
        gafisa.alphabook.home.templates.uploader.bind('Error', gafisa.alphabook.home.templates.erro);
        gafisa.alphabook.home.templates.uploader.bind('FileUploaded', gafisa.alphabook.home.templates.aposUploadArquivo);
        gafisa.alphabook.home.templates.uploader.bind('UploadComplete', gafisa.alphabook.home.templates.aposCompletarUpload);

        gafisa.alphabook.home.templates.uploader.refresh();
    },

    aoAdicionarArquivo: function (up, files) {

        var nomeArquivo = files[0].name;

        var html = '<div id="containerArquivo">{0} <a href="javascript:void(0)" class="ico-excluir removerAnexoVersao" title="Excluir" data-arquivoid="{1}">Excluir</a></div>';
        $('#selecionarArquivos').hide();
        $('.versao').show().append(html.format(nomeArquivo, files[0].id));

        gafisa.alphabook.home.templates.temArquivo = true;
    },

    aoRemoverAnexo: function () {
        $(this).parent().remove();
        $('#selecionarArquivos').show();

        var arquivoExcluido = gafisa.alphabook.home.templates.uploader.getFile($(this).data('arquivoid'));
        gafisa.alphabook.home.templates.uploader.removeFile(arquivoExcluido);

        gafisa.alphabook.home.templates.temArquivo = false;

    },

    aposUploadArquivo: function (up, file, response) {
        var resposta = $.parseJSON(response.response);
        if (!resposta.sucesso) {

            gafisa.alphabook.home.templates.uploader.stop();
            gafisa.alphabook.mensagens.exibirMensagemErro(resposta.erro);

            for (var i = 0; i < gafisa.alphabook.home.templates.uploader.files.length; i++) {
                gafisa.alphabook.home.templates.uploader.files[i].percent = 0;
                gafisa.alphabook.home.templates.uploader.files[i].status = plupload.QUEUED;
            }
        } else {
            gafisa.alphabook.mensagens.exibirMensagemConfirmacao(gafisa.mensagens.comum.salvaComSucesso.format('Versão'));
            $('#containerArquivo').remove();
            $('#selecionarArquivos').show();
            gafisa.alphabook.home.templates.temArquivo = false;
            $('#Observacao').val('');
            $('#tabelaHistorico').tabela({ acao: "carregar" });
        }

        $.loading({ action: 'hide' });
    },

    aposCompletarUpload: function (up, files) {
        $.loading({ action: 'hide' });

        for (var i = 0; i < files.length; i++) {
            if (files[i].state == plupload.FAILED) {
                return;
            }
        }
    },

    aoEnviarNovaVersao: function () {
        var observacao = $('#Observacao').val();

        if (!gafisa.alphabook.home.templates.temArquivo)
            gafisa.alphabook.mensagens.exibirMensagemErro(gafisa.mensagens.documentos.arquivoDeveTerMesmaExtensao);
        else if (observacao == null || observacao == undefined || observacao == '')
            gafisa.alphabook.mensagens.exibirMensagemErro(gafisa.mensagens.comum.deveSerPreenchida.format('Observação'));
        else
            gafisa.alphabook.home.templates.iniciarUploadArquivos();
    },

    iniciarUploadArquivos: function () {
        $.loading({ action: 'show' });

        gafisa.alphabook.home.templates.uploader.settings.multipart_params = { arquivoId: $('#ArquivoId').val(), nomeOriginal: $('#NomeOriginal').val(), observacao: $('#Observacao').val(), classificacaoTaxonomiaId: $('#ClassificacaoTaxonomiaId').val() };
        gafisa.alphabook.home.templates.uploader.start();
    },

    erro: function (up, erro) {
        var listaErros = [];

        if (erro.code == plupload.FILE_SIZE_ERROR)
            listaErros.push(gafisa.mensagens.upload.tamanhoMaximoExcedido.format(50));

        if (listaErros.length > 0) {
            gafisa.alphabook.mensagens.exibirMensagemErro(listaErros);
        }
    },

    aoExcluirTemplate: function () {
        gafisa.alphabook.home.templates.botaoExcluir = $(this);
        $.dialogo.confirmar(gafisa.mensagens.comum.temCertezaAoExcluirEsse.format('template'), gafisa.alphabook.home.templates.excluirTemplate, null, true);
    },

    excluirTemplate: function () {
        $.loading({ action: 'show' });
        var botao = gafisa.alphabook.home.templates.botaoExcluir;
        var parametros = { IdArquivo: botao.data('id'), Referencia: botao.data('referencia'), IdStream: botao.data('idimagem') };
        $.post(gafisa.alphabook.rotas.templates.excluirTemplate, parametros, gafisa.alphabook.home.templates.aposExcluirTemplate, 'json');
    },

    aposExcluirTemplate: function (json) {
        if (json.sucesso) {
            gafisa.alphabook.mensagens.exibirMensagemConfirmacao(gafisa.mensagens.comum.excluidoComSucesso.format('Modelo'));
            gafisa.alphabook.home.templates.botaoExcluir.parent().parent().parent().remove();
            gafisa.alphabook.home.templates.botaoExcluir = null;
            $.loading({ action: 'hide' });
        }
        else {
            $.loading({ action: 'hide' });
            gafisa.alphabook.mensagens.exibirMensagemErro(json.erros);
        }
    },

    aoAbrirModalTemplate: function () {
        $.dialogo.exibir(gafisa.alphabook.rotas.templates.carregarModalTemplate, null, gafisa.alphabook.home.templates.modelo.configurarUploader, null);
    },

    aoVoltar: function () {
        history.go(-1);
    },

    aoExcluirVersaoTemplate: function () {
        gafisa.alphabook.home.templates.botaoExcluir = $(this);
        $.dialogo.confirmar(gafisa.mensagens.comum.temCertezaAoExcluirEssa.format('versão'), gafisa.alphabook.home.templates.excluirVersaoTemplate, null, true);
    },

    excluirVersaoTemplate: function () {
        var botao = gafisa.alphabook.home.templates.botaoExcluir;
        var parametros = { IdArquivo: botao.data('id'), IdHistoricoArquivo: botao.data('historicoid'), Referencia: botao.data('referencia') };
        $.post(gafisa.alphabook.rotas.templates.excluirVersaoTemplate, parametros, gafisa.alphabook.home.templates.aposExcluirVersaoTemplate, 'json');
    },

    aposExcluirVersaoTemplate: function (json) {
        if (json.sucesso) {
            gafisa.alphabook.home.templates.botaoExcluir = null;
            gafisa.alphabook.mensagens.exibirMensagemConfirmacao(gafisa.mensagens.comum.excluidaComSucesso.format('Versão'));

            if (json.excluirCompleto)
                gafisa.alphabook.home.templates.aoClicarTile();
            else
                $('#tabelaHistorico').tabela({ acao: "carregar" });
        }
        else
            gafisa.alphabook.mensagens.exibirMensagemErro(json.erros);
    }
};

$(document).ready(gafisa.alphabook.home.templates.inicializar);