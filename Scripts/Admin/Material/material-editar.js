if (typeof gafisa.alphabook.admin.material == 'undefined') { gafisa.alphabook.admin.material = new Object(); }

gafisa.alphabook.admin.material.editar = {
    uploader: {},
    temArquivo: false,
    inicializar: function () {
        gafisa.alphabook.admin.material.editar.registrarAcoes();
    },

    registrarAcoes: function () {
        $('#salvar').livequery('click', gafisa.alphabook.admin.material.editar.aoSalvar);
        $('.removerArquivo', '#form').livequery('click', gafisa.alphabook.admin.material.editar.aoRemoverAnexo);
        gafisa.alphabook.admin.material.editar.configurarUploader();
    },

    aoSalvar: function () {
        gafisa.alphabook.admin.material.editar.iniciarUploadArquivos();
    },

    configurarUploader: function () {
        $.browser.chrome = $.browser.webkit && window.chrome;
        $.browser.safari = $.browser.webkit && !window.chrome;

        var runtimes = '';

        if (jQuery.browser.safari && !jQuery.browser.chrome)
            runtimes = 'html4';
        else
            runtimes = 'flash,silverlight,html4';

        gafisa.alphabook.admin.material.editar.uploader = new plupload.Uploader({
            runtimes: runtimes,
            browse_button: 'selecionarArquivos',
            container: 'container',
            max_file_size: '50mb',
            multi_selection: false,
            max_file_count: 1,
            url: gafisa.alphabook.rotas.admin.salvarMaterial,
            flash_swf_url: gafisa.alphabook.rotas.uploadFlash,
            silverlight_xap_url: gafisa.alphabook.rotas.uploadSiverlight,
            filters: [{ title: 'Arquivos', extensions: '*' }],
            urlstream_upload: false
        });

        gafisa.alphabook.admin.material.editar.uploader.init();

        gafisa.alphabook.admin.material.editar.uploader.bind('FilesAdded', gafisa.alphabook.admin.material.editar.aoAdicionarArquivo);
        gafisa.alphabook.admin.material.editar.uploader.bind('Error', gafisa.alphabook.admin.material.editar.erro);
        gafisa.alphabook.admin.material.editar.uploader.bind('FileUploaded', gafisa.alphabook.admin.material.editar.aposUploadArquivo);
        gafisa.alphabook.admin.material.editar.uploader.bind('UploadComplete', gafisa.alphabook.admin.material.editar.aposCompletarUpload);

        gafisa.alphabook.admin.material.editar.uploader.refresh();
    },

    aoAdicionarArquivo: function (up, files) {

        var nomeArquivo = files[0].name;

        var html = '<div id="containerArquivo">{0} <a href="javascript:void(0)" class="ico-excluir removerArquivo" title="Excluir" data-arquivoid="{1}">Excluir</a></div>';
        $('#selecionarArquivos').hide();
        $('#nomeArquivo').show().append(html.format(nomeArquivo, files[0].id));

        gafisa.alphabook.admin.material.editar.temArquivo = true;
    },

    aoRemoverAnexo: function () {
        $(this).parent().remove();
        $('#selecionarArquivos').show();

        var arquivoExcluido = gafisa.alphabook.admin.material.editar.uploader.getFile($(this).data('arquivoid'));
        gafisa.alphabook.admin.material.editar.uploader.removeFile(arquivoExcluido);

        gafisa.alphabook.admin.material.editar.temArquivo = false;

    },

    aposUploadArquivo: function (up, file, response) {
        var resposta = $.parseJSON(response.response);
        if (!resposta.sucesso) {

            gafisa.alphabook.admin.material.editar.uploader.stop();
            gafisa.alphabook.mensagens.exibirMensagemErro(resposta.erros);

            for (var i = 0; i < gafisa.alphabook.admin.material.editar.uploader.files.length; i++) {
                gafisa.alphabook.admin.material.editar.uploader.files[i].percent = 0;
                gafisa.alphabook.admin.material.editar.uploader.files[i].status = plupload.QUEUED;
            }
        } else {
            gafisa.alphabook.admin.material.editar.temArquivo = false;
            gafisa.alphabook.mensagens.exibirMensagemConfirmacao(gafisa.mensagens.comum.salvoComSucesso.format('Material'), function () {
                history.back();
            });
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

    iniciarUploadArquivos: function () {

        var titulo = $('#Titulo').val();

        if (!gafisa.alphabook.admin.material.editar.temArquivo)
            gafisa.alphabook.mensagens.exibirMensagemErro(gafisa.mensagens.comum.obrigatorio.format('Arquivo'));
        else if (titulo == null || titulo == undefined || titulo == '')
            gafisa.alphabook.mensagens.exibirMensagemErro(gafisa.mensagens.comum.obrigatorio.format('Título'));
        else {
            $.loading({ action: 'show' });
            gafisa.alphabook.admin.material.editar.uploader.settings.multipart_params = { Titulo: titulo };
            gafisa.alphabook.admin.material.editar.uploader.start();
        }
    },

    erro: function (up, erro) {

        $.loading({ action: 'hide' });

        var listaErros = [];

        if (erro.code == plupload.FILE_SIZE_ERROR)
            listaErros.push(gafisa.mensagens.upload.tamanhoMaximoExcedido.format(50));

        if (listaErros.length > 0) {
            gafisa.alphabook.mensagens.exibirMensagemErro(listaErros);
        }
    }
};

$(document).ready(gafisa.alphabook.admin.material.editar.inicializar);
