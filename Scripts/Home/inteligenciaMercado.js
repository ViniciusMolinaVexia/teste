if (typeof gafisa.alphabook.home == 'undefined') { gafisa.alphabook.home = new Object(); }

gafisa.alphabook.home.inteligenciaMercado = {
    uploader: null,
    ultimaPesquisa: null,
    ultimaPosicao: 0,

    inicializar: function () {
        gafisa.alphabook.home.inteligenciaMercado.registrarAcoes();
        gafisa.alphabook.home.inteligenciaMercado.bindarCabecalhoTabela();
    },

    bindarCabecalhoTabela: function () {
        $('.inteligenciaMercado').livequery(gafisa.alphabook.home.inteligenciaMercado.aoRolarTabela);
    },

    aoRolarTabela: function () {
        $(this).scroll(function () {
            if (gafisa.alphabook.home.inteligenciaMercado.ultimaPosicao != this.scrollLeft) {
                $('#tabelaInteligenciaMercadoH').css({ left: -1 * this.scrollLeft, position: 'relative' });
                gafisa.alphabook.home.inteligenciaMercado.ultimaPosicao = this.scrollLeft;
            }
        });
    },

    IsJson: function (data) {
        gafisa.alphabook.home.inteligenciaMercado.IsJson(data);
    },

    registrarAcoes: function () {
        $('#tileInteligenciaMercado').livequery('click', gafisa.alphabook.home.inteligenciaMercado.aoClicarTile);
        $('#btnFiltroInteligenciaMercado').livequery('click', gafisa.alphabook.home.inteligenciaMercado.aoFiltrar);
        $('#btExportarInteligenciaMercado').livequery('click', gafisa.alphabook.home.inteligenciaMercado.aoExportar);
        $('#filtroLetraInteligencia .letra').livequery('click', function () { gafisa.alphabook.home.inteligenciaMercado.aoClicarNaLetra($(this)); });
        $('input[id^="ui-multiselect-Estado-option"]').livequery('change', gafisa.alphabook.home.inteligenciaMercado.aoSelecionarEstado);
        $('#cidadeAlvoInteligencia').livequery('change', gafisa.alphabook.home.inteligenciaMercado.aoSelecionarCidadeAlvo);
        $('.box-inteligencia-mercado #termoBusca').onPressEnter(gafisa.alphabook.home.inteligenciaMercado.aoFiltrar);
    },

    aoClicarTile: function () {
        if (!$(this).hasClass('inativo'))
            $.navegar.proximo(gafisa.alphabook.rotas.inteligenciaMercado.index, null, gafisa.alphabook.home.inteligenciaMercado.aoExibirTela);
    },

    aoSelecionarCidadeAlvo: function () {
        gafisa.alphabook.home.inteligenciaMercado.carregarCidades();
    },

    aoSelecionarEstado: function () {
        gafisa.alphabook.home.inteligenciaMercado.carregarCidades();
    },

    carregarCidades: function () {

        var data = {
            ufIds: new Array(),
            cidadeAlvo: $('#cidadeAlvoInteligencia').checked()
        };

        var estados = $('input[id^="ui-multiselect-Estado-option"]:checked');

        $.each(estados, function (index, elemento) {
            data.ufIds.push($(elemento).val());
        });

        $('#Cidade').fillMultipleSelect(gafisa.alphabook.rotas.localizacao.listarCidades, data);
    },

    configurarUploader: function () {
        $.browser.chrome = $.browser.webkit && window.chrome;
        $.browser.safari = $.browser.webkit && !window.chrome;

        var runtimes = '';
        if (jQuery.browser.safari && !jQuery.browser.chrome) {
            runtimes = 'html4';
        } else {
            runtimes = 'flash,silverlight,html4';
        }
        gafisa.alphabook.home.inteligenciaMercado.uploader = new plupload.Uploader({
            runtimes: runtimes,
            browse_button: 'btnImportarInteligenciaMercado',
            container: 'container',
            max_file_size: '50mb',
            url: gafisa.alphabook.rotas.inteligenciaMercado.validarImportacao,
            flash_swf_url: gafisa.alphabook.rotas.uploadFlash,
            silverlight_xap_url: gafisa.alphabook.rotas.uploadSiverlight,
            filters: [{ title: 'Arquivos', extensions: 'csv' }],
            urlstream_upload: true
        });

        gafisa.alphabook.home.inteligenciaMercado.uploader.init();
        gafisa.alphabook.home.inteligenciaMercado.uploader.bind('FilesAdded', gafisa.alphabook.home.inteligenciaMercado.aposSelecionarArquivo);
        gafisa.alphabook.home.inteligenciaMercado.uploader.bind('FileUploaded', gafisa.alphabook.home.inteligenciaMercado.aposCompletarUpload);
        gafisa.alphabook.home.inteligenciaMercado.uploader.refresh();
    },

    aposSelecionarArquivo: function (up, files) {
        $.loading({ action: 'show' });
        gafisa.alphabook.home.inteligenciaMercado.uploader.start();
    },

    aoClicarBotaoImportacao: function () {
        $.dialogo.exibir(gafisa.alphabook.rotas.inteligenciaMercado.exibirUploader);
    },

    aposCompletarUpload: function (up, file, response) {
        $.loading({ action: 'hide' });
        // verifica se retornou json ou html
        if (gafisa.alphabook.home.inteligenciaMercado.IsJson(response.response) == true) {
            var resposta = $.parseJSON(response.response);
            if (!resposta.sucesso) {
                var erro = resposta.erros;
                gafisa.alphabook.mensagens.exibirMensagemErro('Erro na importação do arquivo: ' + erro);

                $.loading({ action: 'hide' });
            } else {

                const tbData = resposta.data;
                const txtMsg = `Abaixo o resumo da importação:\n
                                   ${tbData.NumeroCidadesNaoCadastradas} cidades ainda não estão cadastradas e não serão importadas.\n
                                    ${tbData.NumeroCidadesAtualizadas} cidades que terão seus índices atualizados.\n
                                    ${tbData.NumeroCidadesIncluidas} cidades que terão seus índices criados.\n
                                    Deseja prosseguir com a importação?
                                    <input type="hidden" value="${tbData.NomeArquivoTmp}" id="nomeArquivoTmp" />`;


                $.dialogo.confirmar(txtMsg, gafisa.alphabook.home.inteligenciaMercado.aoConfirmarUpload, gafisa.alphabook.home.inteligenciaMercado.aoCancelarUpload, true);
            }
        } else {

            var numErros = $($.parseHTML(response.response)).find('#numeroErrosProcessamento').val();

            if (numErros == undefined || numErros == 0) {
                $.dialogo.confirmar(response.response, gafisa.alphabook.home.inteligenciaMercado.aoConfirmarUpload, gafisa.alphabook.home.inteligenciaMercado.aoCancelarUpload, true);
            } else {
                $.dialogo.questaoTripla(response.response, "Ok");
            }
        }
    },

    aoConfirmarUpload: function () {
        $.loading({ action: 'show' });
        var url = gafisa.alphabook.rotas.inteligenciaMercado.efetivarImportacao;
        var data = { idArquivo: $("#modalConfirmacao #nomeArquivoTmp").val() };







        if (data.idArquivo) {
            $.get(url, data, gafisa.alphabook.home.inteligenciaMercado.aposConfirmarUpload);
        } else {
            $.loading({ action: 'hide' });
            alert('Id do arqivo inválido.');
        }
    },

    aposConfirmarUpload: function (json) {
        $.loading({ action: 'hide' });
        if (json.sucesso) {
            gafisa.alphabook.mensagens.exibirMensagemConfirmacao(gafisa.mensagens.comum.salvaComSucesso.format('Importação'));
            $.navegar.proximo(gafisa.alphabook.rotas.inteligenciaMercado.index, null, gafisa.alphabook.home.inteligenciaMercado.aoExibirTela, true);
        } else {
            var erros = json.erros != null ? json.erros[0] : '';
            gafisa.alphabook.mensagens.exibirMensagemErro('Erro na importação do arquivo: ' + erros);
        }
    },

    aoCancelarUpload: function () {

        var url = gafisa.alphabook.rotas.inteligenciaMercado.cancelarUpload;
        var data = { idArquivo: $("#modalConfirmacao #nomeArquivoTmp").val() };

        if (data.idArquivo) {
            $.get(url, data, gafisa.alphabook.home.inteligenciaMercado.cancelarUpload);
        }
    },

    aoExibirTela: function () {
        $('.box-inteligencia-mercado #Estado').multiselect('option', 'noneSelectedText', 'UF');
        $('.box-inteligencia-mercado #Cidade').multiselect('option', 'noneSelectedText', 'Cidade');

        $('#tabelaInteligenciaMercado').tabelaHeader({ action: gafisa.alphabook.rotas.inteligenciaMercado.listarParametros, parametros: { tamanhoPagina: 20 }, tamanhoPagina: 20, inteligenciaMercado: 'true' });

        var data = {};
        data.estados = $('#Estado').val() != "" ? $('#Estado').val() : null;
        data.cidades = $('#Cidade').val() != "" ? $('#Cidade').val() : null;
        data.cidadeAlvo = $('#cidadeAlvoInteligencia').checked();
        data.termoBuscaCidade = $('#termoBusca').val();
        data.tamanhoPagina = 20;
        gafisa.alphabook.home.inteligenciaMercado.ultimaPesquisa = data;

        if ($('#btnImportarInteligenciaMercado').length > 0)
            gafisa.alphabook.home.inteligenciaMercado.configurarUploader();

    },

    aoExportar: function (e) {
        e.preventDefault();
        var data = gafisa.alphabook.home.inteligenciaMercado.ultimaPesquisa;
        window.location.href = gafisa.alphabook.rotas.inteligenciaMercado.exportarParaCSV.concatQueryString({ estados: data.estados, cidades: data.cidades, cidadeAlvo: data.cidadeAlvo, termoBuscaCidade: data.termoBuscaCidade });
    },

    aoFiltrar: function () {
        var data = {};

        data.estados = $('#Estado').val() != "" ? $('#Estado').val() : null;
        data.cidades = $('#Cidade').val() != "" ? $('#Cidade').val() : null;
        data.cidadeAlvo = $('#cidadeAlvoInteligencia').checked();
        data.termoBuscaCidade = $('#termoBusca').val();
        data.tamanhoPagina = 20;
        data.inteligenciaMercado = 'true';
        gafisa.alphabook.home.inteligenciaMercado.ultimaPesquisa = data;

        $('#tabelaInteligenciaMercado').tabelaHeader({ acao: "carregar", parametros: data });

        $.navegar.ajustarRodape();
    },

    aoClicarNaLetra: function (letra) {
        var letraatual = $($('#filtroLetraInteligencia').find('.selecionada')[0]).html();
        $('#filtroLetraInteligencia .letra').removeClass('selecionada');
        if (letraatual != letra.html()) letra.addClass('selecionada');

        gafisa.alphabook.home.inteligenciaMercado.aoFiltrar();
    },

    IsJson: function (data) {
        var IS_JSON;

        try {
            var json = $.parseJSON(data);

            if (typeof json == 'object')
                IS_JSON = true;

        } catch (err) {
            IS_JSON = false;
        }

        return IS_JSON;
    },
};

$(document).ready(gafisa.alphabook.home.inteligenciaMercado.inicializar);
