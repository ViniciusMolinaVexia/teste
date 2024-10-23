if (typeof gafisa.alphabook.home == 'undefined') { gafisa.alphabook.home = new Object(); }

gafisa.alphabook.home.documentos = {
    idtaxonomia: null,
    uploader: {},
    temArquivo: false,
    botaoExcluir: null,

    inicializar: function () {
        gafisa.alphabook.home.documentos.registrarAcoes();
    },

    registrarAcoes: function () {
        $('#documentos').livequery('click', gafisa.alphabook.home.documentos.aoClicarTile);
        $('#buscarArquivos', '#controleDocumentos').livequery('click', gafisa.alphabook.home.documentos.aoBuscarArquivos);
        $('.pastaDocumento', '#controleDocumentos').livequery('click', gafisa.alphabook.home.documentos.aoClicarTileDocumento);
        $('.box-doc:not(input)', '#controleDocumentos').livequery('click', gafisa.alphabook.home.documentos.aoSelecionarArquivo);
        $('.editar-doc', '.doc-documents').livequery(gafisa.alphabook.home.documentos.aoExibirAcaoArquivo);
        $('.ico-download', '#controleDocumentos').livequery('click', gafisa.alphabook.home.documentos.aoBaixarArquivo);
        $('.ico-informacoes', '#controleDocumentos').livequery('click', gafisa.alphabook.home.documentos.aoDetalharArquivo);
        $('#ListaTaxonomias', '#controleDocumentos').livequery(gafisa.alphabook.home.documentos.bindTreeView);
        $('.det-form-taxonomia [name="Pasta"]', '#controleDocumentos').livequery('click', gafisa.alphabook.home.documentos.aoAbrirPasta);
        $('#alterarTaxonomia', '#controleDocumentos').livequery('click', gafisa.alphabook.home.documentos.aoAlterarDadosTaxonomia);
        $('#ClassificacaoTaxonomiaId', '#controleDocumentos').livequery('change', gafisa.alphabook.home.documentos.aoSelecionarClassificacao);
        $('#enviarNovaVersao', '#controleDocumentos').livequery('click', gafisa.alphabook.home.documentos.aoEnviarNovaVersao);
        $('.removerAnexoVersao', '#controleDocumentos').livequery('click', gafisa.alphabook.home.documentos.aoRemoverAnexo);
        $('.ico-post').livequery('click', gafisa.alphabook.home.documentos.aoClicarPostDocumento);
        $('.bt-voltar-documento').livequery('click', gafisa.alphabook.home.documentos.aoVoltar);
        $('.ico-excluir-documento', '#controleDocumentos').livequery('click', gafisa.alphabook.home.documentos.aoExcluirDocumento);
        $('.ico-excluir', '#tabelaHistoricoDocumento').livequery('click', gafisa.alphabook.home.documentos.aoExcluirVersaoDocumento);
        $('#controleDocumentos #termo').onPressEnter(gafisa.alphabook.home.documentos.aoBuscarArquivos);

        $('#enviarPorEmail', '.doc-documents').livequery('click', gafisa.alphabook.home.email.aoEnviarDocumentoPorEmail);
    },

    aoClicarPostDocumento: function () {
        var id = $(this).attr('data-postagemId');
        $.dialogo.exibir(gafisa.alphabook.rotas.timeline.carregarDetalhePost, { idPost: id, homeInicial: false });
    },

    aoExibirAcaoArquivo: function () {
        $(this).hide()
            .data('fechado', true)
            .clickOutSide(gafisa.alphabook.home.documentos.fecharToolTip);
        $('.box-doc').removeClass('box-doc-sel');
    },

    aoBuscarArquivos: function () {
        var idProjeto = null, idsDocumentos = null;

        idProjeto = gafisa.alphabook.home.carrossel.obterIdProjeto();

        if ($('body').data('ids')) {
            idsDocumentos = $('body').data('ids');
            idProjeto = null;
        }

        $.navegar.proximo(gafisa.alphabook.rotas.documentos.index, { ProjetoId: idProjeto, TileProjeto: $('.tile-topo').html(), Termo: $('#termo').val(), IdsDocumentos: idsDocumentos });
    },

    aoClicarTile: function () {
        if (!$(this).hasClass('inativo')) {
            var idProjeto = gafisa.alphabook.home.carrossel.obterIdProjeto();

            if ($('body').data('ids'))
                $('body').removeData('ids');

            const title = gafisa.alphabook.util.removeHtmlTag($('.tile-topo').html()).replace("\n", "");

            $.navegar.proximo(gafisa.alphabook.rotas.documentos.index, { ProjetoId: idProjeto, TileProjeto: title }, function () { $('body').data('hashPai', window.location.hash); });
        }
    },

    aoClicarTileDocumento: function () {
        var idProjeto = null, nivel = null, tax = null, dep = null, nome = null, idsDocumentos = null;

        idProjeto = gafisa.alphabook.home.carrossel.obterIdProjeto();

        if ($(this).data('nivel'))
            nivel = $(this).data('nivel');

        if ($(this).data('tax'))
            tax = $(this).data('tax');

        if ($(this).data('dep'))
            dep = $(this).data('dep');

        if ($(this).data('nome'))
            nome = $(this).data('nome');

        if ($('body').data('ids')) {
            idsDocumentos = $('body').data('ids');
            idProjeto = null;
        }

        var itens = $('.breadcrumb').find('a');
        var hashInicial = '';
        if (itens.length > 1)
            hashInicial = $(itens[0]).attr('href');

        $.navegar.proximo(gafisa.alphabook.rotas.documentos.projeto, { ProjetoId: idProjeto, DepartamentoId: dep, TaxonomiaId: tax, nivel: nivel, Nome: nome, Hash: window.location.hash, HashInicial: hashInicial, ControleSessao: $('#controleSessao').val(), TileProjeto: $('.tile-topo').html(), IdsDocumentos: idsDocumentos });
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
        $('.editar-doc', '.doc-documents').data('fechado', true).fadeOut('fast');
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

        $.navegar.proximo(gafisa.alphabook.rotas.documentos.detalhe, { ArquivoId: id, TileProjeto: $('.tile-topo').html() }, gafisa.alphabook.home.documentos.aoListarHistoricoArquivos);
    },

    abrirDetalheArquivo: function (id, idProjeto) {
        $.get(gafisa.alphabook.rotas.home.obterProjeto, { idProjeto: idProjeto }, function (html) { gafisa.alphabook.home.documentos.aoRetornarConsultaProjetoDetalheArquivo(html, id); }, 'html');
    },

    aoRetornarConsultaProjetoDetalheArquivo: function (html, idArquivo) {
        $.navegar.proximo(gafisa.alphabook.rotas.documentos.detalhe, { ArquivoId: idArquivo, TileProjeto: $(html).find('.tile-topo').html() }, gafisa.alphabook.home.documentos.aoListarHistoricoArquivos);
    },

    bindTreeView: function () {
        $(this).jstree({ "themes": {
            "theme": "default",
            "dots": true,
            "icons": true
        }, "plugins": ["themes", "html_data", "ui"]
        }).bind("select_node.jstree", gafisa.alphabook.home.documentos.aoClicarPasta);
    },

    aoClicarPasta: function (event, data) {
        $.get(gafisa.alphabook.rotas.taxonomia.listarClassificacaoTaxonomia, { taxonomiaId: data.rslt.obj.data("taxonomiaid") }, gafisa.alphabook.home.documentos.aoListarClassificacoes);
        $('#ListaTaxonomias').toggle();
        var obj = $('.det-form-taxonomia');
        obj.find('[name="Pasta"]').empty().append('<option value="' + data.rslt.obj.data("taxonomiaid") + '">' + data.rslt.obj.data("taxonomianome") + '</option>');
    },

    aoAbrirPasta: function () {
        gafisa.alphabook.home.documentos.idtaxonomia = $(this).data('idtaxonomia');
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
        for (var i = 0; i < json.length; i++)
            sel.append('<option data-privacidade="' + json[i].IdPrivacidade + '" value="' + json[i].Id + '">' + json[i].Nome + '</option>');
    },

    aoListarHistoricoArquivos: function () {
        gafisa.alphabook.home.documentos.configurarUploader();
        $('#tabelaHistoricoDocumento').tabela({ action: gafisa.alphabook.rotas.documentos.listarHistoricoArquivo, parametros: { arquivoId: $('#ArquivoId').val(), ordenacao: 2, tipo: 1 }, tamanhoPagina: 6 });
    },

    aoAlterarDadosTaxonomia: function () {

        var privacidadeClassificacao = $('#ClassificacaoTaxonomiaId').find(':selected').data('privacidade');
        var privacidadePostagem = $('#PrivacidadePostagem').val();

        var taxonomiaAtual = $('#TaxonomiaAtual').val();
        var taxonomiaSelecionada = $('#taxonomiaId').val();

        var classificacaoAtual = $('#ClassificacaoAtual').val();
        var classificacaoSelecionada = $('#ClassificacaoTaxonomiaId').val();

        if (taxonomiaAtual != taxonomiaSelecionada || classificacaoAtual != classificacaoSelecionada) {
            if ((!privacidadeClassificacao || !privacidadePostagem) && privacidadeClassificacao != null)
                gafisa.alphabook.mensagens.exibirMensagemErro(gafisa.mensagens.comum.deveSerPreenchida.format('Classificação'));
            else if ((privacidadeClassificacao != privacidadePostagem) && privacidadeClassificacao != null)
                $.dialogo.confirmar(gafisa.mensagens.taxonomias.incompativel, gafisa.alphabook.home.documentos.alterarDadosTaxonomia, null, true);
            else
                gafisa.alphabook.home.documentos.alterarDadosTaxonomia();
        } else
            gafisa.alphabook.mensagens.exibirMensagemAlerta(gafisa.mensagens.comum.semAlteracaoDe.format('classificação'));
    },

    alterarDadosTaxonomia: function () {
        var parametros = { ArquivoId: $('#ArquivoId').val(), ClassificacaoTaxonomiaId: $('#ClassificacaoTaxonomiaId').val() };
        $.post(gafisa.alphabook.rotas.documentos.alterarDadosTaxonomia, parametros, gafisa.alphabook.home.documentos.aposAlterarDadosTaxonomia, 'json');
    },

    aposAlterarDadosTaxonomia: function (json) {
        if (json.sucesso) {
            gafisa.alphabook.mensagens.exibirMensagemConfirmacao(gafisa.mensagens.comum.alteradoComSucesso.format('Dados de taxonomia'));
            gafisa.alphabook.home.documentos.aoClicarTile();
        }
        else
            gafisa.alphabook.mensagens.exibirMensagemErro(json.erros);
    },

    aoSelecionarClassificacao: function () {

        var id = $(this).val();

        if (id && id != '') {
            var url = gafisa.alphabook.rotas.taxonomia.obterDadosClassificacao;
            var parametros = { classificacaoTaxonomiaId: id };
            $.get(url, parametros, gafisa.alphabook.home.documentos.aposSelecionarClassificacao);
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

        gafisa.alphabook.home.documentos.uploader = new plupload.Uploader({
            runtimes: runtimes,
            browse_button: 'selecionarArquivos',
            container: 'container',
            max_file_size: '50mb',
            multi_selection: false,
            max_file_count: 1,
            url: gafisa.alphabook.rotas.arquivo.uploadVersaoDocumento,
            flash_swf_url: gafisa.alphabook.rotas.uploadFlash,
            silverlight_xap_url: gafisa.alphabook.rotas.uploadSiverlight,
            filters: [{ title: 'Arquivos', extensions: '*'}],
            urlstream_upload: false
        });

        gafisa.alphabook.home.documentos.uploader.init();

        gafisa.alphabook.home.documentos.uploader.bind('FilesAdded', gafisa.alphabook.home.documentos.aoAdicionarArquivo);
        gafisa.alphabook.home.documentos.uploader.bind('Error', gafisa.alphabook.home.documentos.erro);
        gafisa.alphabook.home.documentos.uploader.bind('FileUploaded', gafisa.alphabook.home.documentos.aposUploadArquivo);
        gafisa.alphabook.home.documentos.uploader.bind('UploadComplete', gafisa.alphabook.home.documentos.aposCompletarUpload);

        gafisa.alphabook.home.documentos.uploader.refresh();
    },

    aoAdicionarArquivo: function (up, files) {

        var nomeArquivo = files[0].name;

        var html = '<div id="containerArquivo">{0} <a href="javascript:void(0)" class="ico-excluir removerAnexoVersao" title="Excluir" data-arquivoid="{1}">Excluir</a></div>';
        $('#selecionarArquivos').hide();
        $('.versao').show().append(html.format(nomeArquivo, files[0].id));

        gafisa.alphabook.home.documentos.temArquivo = true;
    },

    aoRemoverAnexo: function () {
        $(this).parent().remove();
        $('#selecionarArquivos').show();

        var arquivoExcluido = gafisa.alphabook.home.documentos.uploader.getFile($(this).data('arquivoid'));
        gafisa.alphabook.home.documentos.uploader.removeFile(arquivoExcluido);

        gafisa.alphabook.home.documentos.temArquivo = false;

    },

    aposUploadArquivo: function (up, file, response) {
        var resposta = $.parseJSON(response.response);
        if (!resposta.sucesso) {

            gafisa.alphabook.home.documentos.uploader.stop();
            gafisa.alphabook.mensagens.exibirMensagemErro(resposta.erro);

            for (var i = 0; i < gafisa.alphabook.home.documentos.uploader.files.length; i++) {
                gafisa.alphabook.home.documentos.uploader.files[i].percent = 0;
                gafisa.alphabook.home.documentos.uploader.files[i].status = plupload.QUEUED;
            }
        } else {
            gafisa.alphabook.mensagens.exibirMensagemConfirmacao(gafisa.mensagens.comum.salvaComSucesso.format('Versão'));
            $('#containerArquivo').remove();
            $('#selecionarArquivos').show();
            gafisa.alphabook.home.documentos.temArquivo = false;
            $('#Observacao').val('');
            $('#tabelaHistoricoDocumento').tabela({ acao: "carregar" });
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

        if (!gafisa.alphabook.home.documentos.temArquivo)
            gafisa.alphabook.mensagens.exibirMensagemErro(gafisa.mensagens.documentos.arquivoDeveTerMesmaExtensao);
        else if (observacao == null || observacao == undefined || observacao == '')
            gafisa.alphabook.mensagens.exibirMensagemErro(gafisa.mensagens.comum.deveSerPreenchida.format('Observação'));
        else
            gafisa.alphabook.home.documentos.iniciarUploadArquivos();
    },

    iniciarUploadArquivos: function () {
        $.loading({ action: 'show' });
        gafisa.alphabook.home.documentos.uploader.settings.multipart_params = { arquivoId: $('#ArquivoId').val(), postagemId: $('#postagemId').val(), projetoId: gafisa.alphabook.home.carrossel.obterIdProjeto(), classificacaoTaxonomiaId: $('#classificacaoId').val(), nomeOriginal: $('#NomeOriginal').val(), observacao: $('#Observacao').val() };
        gafisa.alphabook.home.documentos.uploader.start();
    },

    erro: function (up, erro) {

        $.loading({ action: 'hide' });

        var listaErros = [];

        if (erro.code == plupload.FILE_SIZE_ERROR)
            listaErros.push(gafisa.mensagens.upload.tamanhoMaximoExcedido.format(50));

        if (listaErros.length > 0) {
            gafisa.alphabook.mensagens.exibirMensagemErro(listaErros);
        }
    },

    aoVoltar: function () {
        history.go(-1);
    },

    aoExcluirDocumento: function () {
        gafisa.alphabook.home.documentos.botaoExcluir = $(this);
        $.dialogo.confirmar(gafisa.mensagens.comum.temCertezaAoExcluirEsse.format('documento'), gafisa.alphabook.home.documentos.excluirDocumento, null, true);
    },

    excluirDocumento: function () {
        var botao = gafisa.alphabook.home.documentos.botaoExcluir;
        var parametros = { IdArquivo: botao.data('id'), Referencia: botao.data('referencia'), PostagemId: botao.data('postagemid'), NomeOriginal: botao.data('nome') };
        $.post(gafisa.alphabook.rotas.documentos.excluirDocumento, parametros, gafisa.alphabook.home.documentos.aposExcluirDocumento, 'json');
    },

    aposExcluirDocumento: function (json) {
        if (json.sucesso) {
            gafisa.alphabook.mensagens.exibirMensagemConfirmacao(gafisa.mensagens.comum.excluidoComSucesso.format('Documento'));
            gafisa.alphabook.home.documentos.botaoExcluir.parent().parent().parent().remove();
            gafisa.alphabook.home.documentos.botaoExcluir = null;
            //gafisa.alphabook.home.documentos.aoClicarTile();
        }
        else
            gafisa.alphabook.mensagens.exibirMensagemErro(json.erros);
    },

    aoExcluirVersaoDocumento: function () {
        gafisa.alphabook.home.documentos.botaoExcluir = $(this);
        $.dialogo.confirmar(gafisa.mensagens.comum.temCertezaAoExcluirEssa.format('versão'), gafisa.alphabook.home.documentos.excluirVersaoDocumento, null, true);
    },

    excluirVersaoDocumento: function () {
        var botao = gafisa.alphabook.home.documentos.botaoExcluir;
        var parametros = { NomeOriginal: botao.data('nome'), IdArquivo: botao.data('id'), IdHistoricoArquivo: botao.data('historicoid'), Referencia: botao.data('referencia'), PostagemId: botao.data('postagemid') };
        $.post(gafisa.alphabook.rotas.documentos.excluirVersaoDocumento, parametros, gafisa.alphabook.home.documentos.aposExcluirVersaoDocumento, 'json');
    },

    aposExcluirVersaoDocumento: function (json) {
        if (json.sucesso) {
            gafisa.alphabook.home.documentos.botaoExcluir = null;
            gafisa.alphabook.mensagens.exibirMensagemConfirmacao(gafisa.mensagens.comum.excluidaComSucesso.format('Versão'));

            if (json.excluirCompleto)
                gafisa.alphabook.home.documentos.aoClicarTile();
            else
                $('#tabelaHistoricoDocumento').tabela({ acao: "carregar" });
        }
        else
            gafisa.alphabook.mensagens.exibirMensagemErro(json.erros);
    }
};

$(document).ready(gafisa.alphabook.home.documentos.inicializar);
