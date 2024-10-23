if (typeof gafisa.alphabook.home.templates == 'undefined') { gafisa.alphabook.home.templates = new Object(); }

gafisa.alphabook.home.templates.modelo = {
    botaoExcluir: null,
    idtaxonomia: null,
    uploader: {},
    temArquivo: false,
    parametros: null,

    inicializar: function () {
        gafisa.alphabook.home.templates.modelo.registrarAcoesModal();
    },

    registrarAcoesModal: function () {
        $('#listaTemplateTaxonomias', '.modal').livequery(gafisa.alphabook.home.templates.modelo.bindTreeView);
        $('select[name="Pasta"]', '.modal').livequery('click', gafisa.alphabook.home.templates.modelo.aoAbrirPasta);
        $('.removerAnexoTemplate', '.modal').livequery('click', gafisa.alphabook.home.templates.modelo.aoRemoverAnexo);
        $('select[name="ClassificacaoTaxonomiaId"]', '.modal').livequery('change', gafisa.alphabook.home.templates.modelo.aoSelecionarClassificacao);

        $('#incluirNovoTemplate', '.modal').livequery('click', gafisa.alphabook.home.templates.modelo.aoIncluirNovoTemplate);
        $('#incluirNovaTaxonomia', '.modal').livequery('click', gafisa.alphabook.home.templates.modelo.carregarModalTaxonomia);
        $('#incluirNovaClassificacao', '.modal').livequery('click', gafisa.alphabook.home.templates.modelo.carregarModalClassificacao);
    },

    bindTreeView: function () {
        $(this).jstree({ "themes": {
            "theme": "default",
            "dots": true,
            "icons": true
        }, "plugins": ["themes", "html_data", "ui"]
        }).bind("select_node.jstree", gafisa.alphabook.home.templates.modelo.aoClicarPasta);
    },

    carregarModalTaxonomia: function () {
        $.dialogo.exibir(gafisa.alphabook.rotas.templates.carregarModalTaxonomia, null, null, null);
    },

    carregarModalClassificacao: function () {

        var taxonomiaId = $('#templateTaxonomiaId').val();
        var taxonomiaNome = $('#templateTaxonomiaId').text();

        if (taxonomiaId)
            $.dialogo.exibir(gafisa.alphabook.rotas.templates.carregarModalClassificacao, { taxonomiaId: taxonomiaId, taxonomiaNome: taxonomiaNome }, null, null);
        else
            gafisa.alphabook.mensagens.exibirMensagemErro(gafisa.mensagens.comum.deveSerPreenchida.format('Taxonomia'));

    },

    aoClicarPasta: function (event, data) {

        $.get(gafisa.alphabook.rotas.taxonomia.listarClassificacaoTaxonomia, { taxonomiaId: data.rslt.obj.data("taxonomiaid") }, gafisa.alphabook.home.templates.modelo.aoListarClassificacoes);

        $('#listaTemplateTaxonomias').toggle();

        var obj = $('#formIncluirTemplate');
        obj.find('[name="Pasta"]').empty().append('<option value="' + data.rslt.obj.data("taxonomiaid") + '">' + data.rslt.obj.data("taxonomianome") + '</option>');
    },

    aoAbrirPasta: function () {
        gafisa.alphabook.home.templates.modelo.idtaxonomia = $(this).data('idtaxonomia');
        $(this).blur();
        $('#listaTemplateTaxonomias').toggle().css({
            left: ($(this).offset().left + 0) + 'px',
            top: ($(this).offset().top + 33) + 'px'
        });
    },

    aoListarClassificacoes: function (json) {
        var sel = $("#templateClassificacaoTaxonomiaId");
        sel.empty();
        sel.append('<option value="">Selecione</option>');

        for (var i = 0; i < json.length; i++)
            sel.append('<option value="' + json[i].Id + '">' + json[i].Nome + '</option>');
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

        gafisa.alphabook.home.templates.modelo.uploader = new plupload.Uploader({
            runtimes: runtimes,
            browse_button: 'selecionarArquivoTemplate',
            container: 'containerTemplate',
            max_file_size: '50mb',
            multi_selection: false,
            max_file_count: 1,
            url: gafisa.alphabook.rotas.arquivo.uploadVersaoArquivoTemplate,
            flash_swf_url: gafisa.alphabook.rotas.uploadFlash,
            silverlight_xap_url: gafisa.alphabook.rotas.uploadSiverlight,
            filters: [{ title: 'Arquivos', extensions: '*'}],
            urlstream_upload: false
        });

        gafisa.alphabook.home.templates.modelo.uploader.init();

        gafisa.alphabook.home.templates.modelo.uploader.bind('FilesAdded', gafisa.alphabook.home.templates.modelo.aoAdicionarArquivo);
        gafisa.alphabook.home.templates.modelo.uploader.bind('Error', gafisa.alphabook.home.templates.modelo.erro);
        gafisa.alphabook.home.templates.modelo.uploader.bind('FileUploaded', gafisa.alphabook.home.templates.modelo.aposUploadArquivo);
        gafisa.alphabook.home.templates.modelo.uploader.bind('UploadComplete', gafisa.alphabook.home.templates.modelo.aposCompletarUpload);

        gafisa.alphabook.home.templates.modelo.uploader.refresh();
    },

    aoAdicionarArquivo: function (up, files) {

        var nomeArquivo = files[0].name;

        var html = '<div id="containerArquivo">{0} <a href="javascript:void(0)" class="ico-excluir removerAnexoTemplate" title="Excluir" data-arquivoid="{1}">Excluir</a></div>';
        $('#selecionarArquivoTemplate').hide();
        $('.arquivo-template').show().append(html.format(nomeArquivo, files[0].id));

        gafisa.alphabook.home.templates.modelo.temArquivo = true;
    },

    aoRemoverAnexo: function () {
        $(this).parent().remove();
        $('#selecionarArquivoTemplate').show();

        var arquivoExcluido = gafisa.alphabook.home.templates.modelo.uploader.getFile($(this).data('arquivoid'));

        gafisa.alphabook.home.templates.modelo.uploader.removeFile(arquivoExcluido);
        gafisa.alphabook.home.templates.modelo.temArquivo = false;

    },

    aposUploadArquivo: function (up, file, response) {

        $.loading({ action: 'hide' });

        var resposta = $.parseJSON(response.response);

        if (!resposta.sucesso) {
            gafisa.alphabook.home.templates.modelo.uploader.stop();
            gafisa.alphabook.mensagens.exibirMensagemErro(resposta.erro);

            for (var i = 0; i < gafisa.alphabook.home.templates.modelo.uploader.files.length; i++) {
                gafisa.alphabook.home.templates.modelo.uploader.files[i].percent = 0;
                gafisa.alphabook.home.templates.modelo.uploader.files[i].status = plupload.QUEUED;
            }
        } else {
            gafisa.alphabook.mensagens.exibirMensagemConfirmacao(gafisa.mensagens.comum.salvoComSucesso.format('Modelo'));
            gafisa.alphabook.home.templates.modelo.temArquivo = false;
            $.dialogo.fechar();
            gafisa.alphabook.home.templates.aoClicarTile();
        }
    },

    recusarVersaoTemplate: function () {
        $.dialogo.fechar();
        gafisa.alphabook.home.templates.modelo.parametros = null;
        gafisa.alphabook.home.templates.modelo.temArquivo = false;
    },

    aposInserirVersaoTemplate: function (json) {
        if (json.sucesso) {
            gafisa.alphabook.mensagens.exibirMensagemConfirmacao(gafisa.mensagens.comum.salvaComSucesso.format('Versão'));
            gafisa.alphabook.home.templates.modelo.parametros = null;
            gafisa.alphabook.home.templates.modelo.temArquivo = false;
            $.dialogo.fechar();
            $.navegar.proximo(gafisa.alphabook.rotas.templates.index, { Termo: $('#termo').val(), IdsTemaplates: $('body').data('ids') });
        }
        else
            gafisa.alphabook.mensagens.exibirMensagemErro(json.erro);
    },

    aposCompletarUpload: function (up, files) {
        $.loading({ action: 'hide' });

        for (var i = 0; i < files.length; i++) {
            if (files[i].state == plupload.FAILED) {
                return;
            }
        }
    },

    aoIncluirNovoTemplate: function () {
        var taxonomiaId = $('#templateTaxonomiaId').val();
        var classificacaoTaxonomiaId = $('#templateClassificacaoTaxonomiaId').val();

        gafisa.alphabook.home.templates.modelo.parametros = {
            taxonomiaId: taxonomiaId,
            classificacaoTaxonomiaId: classificacaoTaxonomiaId,
            arquivoId: 0,
            nomeOriginal: '',
            observacao: $('#templateObservacao').val(),
            somenteArquivo: true
        };

        if (!gafisa.alphabook.home.templates.modelo.temArquivo || gafisa.alphabook.home.templates.modelo.uploader.files[0] == undefined)
            gafisa.alphabook.mensagens.exibirMensagemErro(gafisa.mensagens.comum.deveSerPreenchido.format('Arquivo'));
        else if (!taxonomiaId)
            gafisa.alphabook.mensagens.exibirMensagemErro(gafisa.mensagens.comum.deveSerPreenchida.format('Taxonomia'));
        else if (!classificacaoTaxonomiaId)
            gafisa.alphabook.mensagens.exibirMensagemErro(gafisa.mensagens.comum.deveSerPreenchida.format('Classificação'));
        else {
            var url = gafisa.alphabook.rotas.arquivo.verificarTemplateExistente;
            var data = { nome: gafisa.alphabook.home.templates.modelo.uploader.files[0].name, taxonomiaId: taxonomiaId, classificacaoTaxonomiaId: classificacaoTaxonomiaId };
            $.post(url, data, gafisa.alphabook.home.templates.modelo.aposVerificarArquivoExistente);
        }
    },

    aposVerificarArquivoExistente: function (json) {
        if (!json.sucesso) {
            if (json.versao) {
                gafisa.alphabook.home.templates.modelo.parametros = { taxonomiaId: 0, classificacaoTaxonomiaId: $('#templateClassificacaoTaxonomiaId').val(), arquivoId: json.arquivo.IdArquivo, nomeOriginal: json.arquivo.NomeOriginal, observacao: '', somenteArquivo: false };
                $.dialogo.confirmar(gafisa.mensagens.documentos.desejaIncluirVersao, gafisa.alphabook.home.templates.modelo.iniciarUploadArquivos, gafisa.alphabook.home.templates.modelo.recusarVersaoTemplate, true);
            }
        } else
            gafisa.alphabook.home.templates.modelo.iniciarUploadArquivos();
    },

    iniciarUploadArquivos: function () {

        $.loading({ action: 'show' });

        gafisa.alphabook.home.templates.modelo.uploader.settings.multipart_params = gafisa.alphabook.home.templates.modelo.parametros;
        gafisa.alphabook.home.templates.modelo.uploader.start();
    },

    erro: function (up) {

        $.loading({ action: 'hide' });

        var listaErros = [];

        if (up.code == plupload.FILE_SIZE_ERROR)
            listaErros.push(gafisa.mensagens.upload.tamanhoMaximoExcedido.format(50));

        if (listaErros.length > 0)
            gafisa.alphabook.mensagens.exibirMensagemErro(listaErros[0]);
        else
            gafisa.alphabook.mensagens.exibirMensagemErro(gafisa.mensagens.comum.erroInesperadoContateAdministrador);

        gafisa.alphabook.home.templates.modelo.parametros = null;
        gafisa.alphabook.home.templates.modelo.temArquivo = false;
    },

    atualizarDados: function () {
        $.dialogo.atualizar(gafisa.alphabook.rotas.templates.carregarModalTemplate, null, gafisa.alphabook.home.templates.modelo.configurarUploader, true);
    }
};

$(document).ready(gafisa.alphabook.home.templates.modelo.inicializar);