gafisa.alphabook.dadosUsuario = {
    uploader: null,
    inicializar: function () {
        gafisa.alphabook.dadosUsuario.registrarAcoes();
    },

    registrarAcoes: function () {

        $(".bt-usuario").click(function () {

            $(this).stop();

            if ($(".box-detalhe-usuario").hasClass("carregado")) {
                $(".box-detalhe-usuario").fadeToggle('fast', function () {
                    $(".box-detalhe-usuario").html('');
                    $(".box-detalhe-usuario").removeClass("carregado");
                });

            } else {
                $(".box-detalhe-usuario").load(gafisa.alphabook.rotas.home.carregarDadosGeraisUsuario, function () {
                    gafisa.alphabook.dadosUsuario.aoCarregarPopover();
                    $(".box-detalhe-usuario").fadeToggle();
                    $(".box-detalhe-usuario").addClass("carregado");
                    $("#editarDadosCidade").data('data-cidade', $("#Cidade").val());
                    $("#editarDadosCidade").data('data-cidadeid', $("#dadosCidade").data('cidadeid'));
                    gafisa.alphabook.dadosUsuario.desabilitarCampoCidade(true);
                });
            }
        });

        $('.box-usuario').clickOutSide(gafisa.alphabook.dadosUsuario.aoClicarForaDadosUsuario);

        $("#verContato").livequery('click', gafisa.alphabook.dadosUsuario.aoVerContato);
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
        gafisa.alphabook.dadosUsuario.uploader = new plupload.Uploader({
            runtimes: runtimes,
            browse_button: 'btnEditarFoto',
            container: 'container',
            max_file_size: '1mb',
            url: gafisa.alphabook.rotas.home.upload,
            flash_swf_url: gafisa.alphabook.rotas.uploadFlash,
            silverlight_xap_url: gafisa.alphabook.rotas.uploadSiverlight,
            filters: [{ title: "Image files", extensions: "jpg,gif,png"}],
            urlstream_upload: true
        });

        gafisa.alphabook.dadosUsuario.uploader.init();

        gafisa.alphabook.dadosUsuario.uploader.bind('FilesAdded', gafisa.alphabook.dadosUsuario.aoAdicionarArquivos);
        gafisa.alphabook.dadosUsuario.uploader.bind('Error', gafisa.alphabook.dadosUsuario.erro);
        gafisa.alphabook.dadosUsuario.uploader.bind('FileUploaded', gafisa.alphabook.dadosUsuario.aposUploadArquivo);

        gafisa.alphabook.dadosUsuario.uploader.refresh();
    },

    erro: function (up, erro) {
        var listaErros = [];

        if (erro.code == plupload.FILE_SIZE_ERROR)
            listaErros.push(gafisa.mensagens.comum.tamanhoMaximoExcedido.format(1));

        if (listaErros.length > 0) {
            gafisa.alphabook.mensagens.exibirMensagemErro(listaErros[0]);
        }
    },
    
    aposUploadArquivo: function (up, file, response) {
        var resposta = $.parseJSON(response.response);
        if (resposta.sucesso) {
            gafisa.alphabook.dadosUsuario.uploader.stop();

            $('.img-foto-perfil').each(function() {
                var src = $(this).attr('src');
                if (src.indexOf('Content/img/usuario') > -1) {
                    src = '/Home/CarregarFotoPerfil?usuarioId=' + resposta.usuarioId;
                }
                $(this).attr('src', src + '&dt=' + new Date().getTime());
            });
            
            for (var i = 0; i < gafisa.alphabook.dadosUsuario.uploader.files.length; i++) {
                gafisa.alphabook.dadosUsuario.uploader.files[i].percent = 0;
                gafisa.alphabook.dadosUsuario.uploader.files[i].status = plupload.QUEUED;
            }
        } else {
            gafisa.alphabook.mensagens.exibirMensagemErro(resposta.erro);
        }

        gafisa.alphabook.dadosUsuario.configurarUploader();

        $.loading({ action: 'hide' });
    },

    aoAdicionarArquivos: function () {
        $.loading({ action: 'show' });
        gafisa.alphabook.dadosUsuario.uploader.start();
    },

    aoClicarAutocomplete: function (e) {
        e.preventDefault();
        $(this).prev().focus();
    },

    aoClicarForaDadosUsuario: function () {
        var eventClass = $(this)[0].caller.arguments.callee.arguments[0].target.className;
        if (eventClass == "ui-corner-all ui-state-focus" ||
            eventClass == 'bt-padrao bt-msg-fechar-erro' ||
            eventClass == 'loading-bar')
            return;

        if ($(".box-detalhe-usuario").hasClass("carregado")) {
            $(".box-detalhe-usuario").fadeToggle('fast', function () {
                $(".box-detalhe-usuario").html('');
                $(".box-detalhe-usuario").removeClass("carregado");
            });
        }
    },

    aoCarregarPopover: function () {
        $("#btnEditar").click(gafisa.alphabook.dadosUsuario.aoSelecionarEditar);
        $("#btnFecharEditar").click(gafisa.alphabook.dadosUsuario.aoSelecionarFecharEditar);
        $("#btnSalvarDadosUsuario").click(gafisa.alphabook.dadosUsuario.aoSalvarDadosUsuario);

        $("#UF").change(gafisa.alphabook.dadosUsuario.aoSelecionarUf);
        gafisa.alphabook.dadosUsuario.configurarAutocompleteCidade();
        gafisa.alphabook.dadosUsuario.configurarUploader();

        $("#associarContato").livequery('click', gafisa.alphabook.dadosUsuario.aoAbrirModalContatos);        
    },

    aoAbrirModalContatos: function () {
        var url = gafisa.alphabook.rotas.home.modalAssociarContato;
        $('#modalAssociarContato').html('');
        $.get(url, {}, function (html) {
            $('#modalAssociarContato #associarAoContato').livequery('click', gafisa.alphabook.dadosUsuario.aoAssociarContato)
            $('#modalAssociarContato').html(html).modal('show');
            gafisa.alphabook.dadosUsuario.listarContatos();
            $('#modalAssociarContato #buscarNovoContato').livequery('click', gafisa.alphabook.dadosUsuario.listarContatos);
        }, "html");
    },

    aoAssociarContato: function () {
        var contatoId = $('#modalAssociarContato input[name=ContatoId]:checked').data('id');
        
        $.loading({ action: 'show' });

        $.post(gafisa.alphabook.rotas.home.associarContato, { contatoId: contatoId }, function (json) {
            if (json.sucesso) {
                $('#modalAssociarContato').modal('hide');
                gafisa.alphabook.mensagens.exibirMensagemConfirmacao(gafisa.mensagens.comum.feitaComSucesso.format('Associação'));
            }
            else
                gafisa.alphabook.mensagens.exibirMensagemErro(json.erros);

            $.loading({ action: 'hide' });
        });
    },

    aoVerContato: function () {
        $('#modal').modal('hide');
        $.navegar.proximo(gafisa.alphabook.rotas.contatos.editarContato, { contatoId: $(this).data('id') }, gafisa.alphabook.home.contatos.aposClicarAdicionarEditarContato);
    },

    listarContatos: function () {        
        $('#tabelaContatos').tabela({ action: gafisa.alphabook.rotas.home.listarContatos, parametros: { TermoBusca: $('#modalAssociarContato #nomeContato').val(), tamanhoPagina: 20 }, tamanhoPagina: 20 });
    },

    aoSelecionarEditar: function () {
        
        $('#verContato').attr('id', 'associarContato');

        var cidade = $("#editarDadosCidade").data('data-cidade');
        var cidadeid = $("#editarDadosCidade").data('data-cidadeid');

        $("#dadosCidade").hide('fast');
        $("#btnEditar").hide('fast');
        $("#editarDadosCidade").show('fast');
        $("#divBtnSalvar").show('fast');
        $("#btnFecharEditar").show('fast');
        $("#Cidade").val(cidade);
        $("#Cidade").data('data-id', cidadeid);
        $(".box-detalhe-usuario .container-editar-foto").show();
        if ($("#UF").val() != "") {
            gafisa.alphabook.dadosUsuario.desabilitarCampoCidade(false);
        }
    },

    aoSelecionarFecharEditar: function () {

        $('#associarContato').attr('id', 'verContato');

        $("#editarDadosCidade").hide('fast');
        $("#divBtnSalvar").hide('fast');
        $("#btnFecharEditar").hide('fast');
        $("#dadosCidade").show('fast');
        $("#btnEditar").show('fast');
        $("#Cidade").val('');
        $(".box-detalhe-usuario .container-editar-foto").hide();
        gafisa.alphabook.dadosUsuario.desabilitarCampoCidade(true);
    },

    desabilitarCampoCidade: function (bool) {
        $("#Cidade").disable(bool);
        if (bool)
            $("#Cidade").val('');
    },

    configurarAutocompleteCidade: function () {
        if ($("#UF").val() == "") {
            gafisa.alphabook.dadosUsuario.desabilitarCampoCidade(true);
            return;
        }
        gafisa.alphabook.dadosUsuario.desabilitarCampoCidade(false);
        $("#Cidade").autocomplete({
            open: function () {
                setTimeout(function () {
                    $('.ui-autocomplete').css('z-index', 289);
                }, 0);
            },
            source: gafisa.alphabook.dadosUsuario.carregarDadosAutocomplete,
            minLength: 2,
            select: function (event, ui) {
                $("#Cidade").data('data-id', ui.item.Id);
            }
        });
    },

    aoSelecionarUf: function () {
        $("#Cidade").val('');
        gafisa.alphabook.dadosUsuario.configurarAutocompleteCidade();
    },

    carregarDadosAutocomplete: function (request, response) {
        $.ajax({
            url: gafisa.alphabook.rotas.home.listarCidadesAutocomplete,
            type: "POST",
            dataType: "json",
            data: { chave: $("#Cidade").val(), uf: $("#UF").val() },
            success: function (data) {
                response($.map(data, function (item) {
                    return { label: item.value, value: item.value, Id: item.key };
                }));
            }
        });
    },

    aoSalvarDadosUsuario: function () {
        if (gafisa.alphabook.dadosUsuario.validar()) {
            var data = {};
            data.model = $('#formDadosUsuario').formToJSON();
            data.model.CidadeId = $("#Cidade").data('data-id');

            $.ajax({
                url: gafisa.alphabook.rotas.home.salvarDadosUsuario,
                type: "POST",
                dataType: "JSON",
                data: data.model,
                cache: false,
                success: gafisa.alphabook.dadosUsuario.aposSalvar
            });
        }
    },

    aposSalvar: function (json) {
        if (json.success) {
            if (json.cidadeValida) {
                $("#dadosCidade #cidadeEstado").html("<label>{0} - {1}</label>".format($("#Cidade").val(), $("#UF").val()));
                $("#editarDadosCidade").hide('fast');
                $("#divBtnSalvar").hide('fast');
                $("#btnFecharEditar").hide('fast');
                $("#btnEditar").show('fast');
                $("#dadosCidade").show('fast');
                $(".box-detalhe-usuario .container-editar-foto").hide();
                $("#editarDadosCidade").data('data-cidade', $("#Cidade").val());
                if ($("#Cidade").val()) {
                    $("#dadosCidade .localizacao-cidade").attr("data-id", $("#Cidade").data('data-id')).removeClass("ico-post-pin-inativo").addClass("ico-post-pin").addClass("navegar-mapa");
                } else {
                    $("#dadosCidade .localizacao-cidade").removeClass("ico-post-pin").addClass("ico-post-pin-inativo").removeClass("navegar-mapa");
                }
                $("#Cidade").val('');
                $('#Cidade').autocomplete('close');
                $("#Cidade").data('data-id', json.idCidade);
            } else {
                gafisa.alphabook.mensagens.exibirMensagemErro(gafisa.mensagens.comum.deveSerValida.format('Cidade'));
            }
        } else {
            gafisa.alphabook.mensagens.exibirMensagemErro(gafisa.mensagens.comum.excecaoNaoTratada);
        }

    },

    validar: function () {

        if (String.isNullOrEmpty($("#UF").val())) {
            gafisa.alphabook.mensagens.exibirMensagemErro(gafisa.mensagens.comum.deveSerPreenchido.format('UF'));
            return false;
        }

        if (String.isNullOrEmpty($("#Cidade").val())) {
            gafisa.alphabook.mensagens.exibirMensagemErro(gafisa.mensagens.comum.deveSerPreenchido.format('Cidade'));
            return false;
        }

        return true;
    }
};

$(document).ready(gafisa.alphabook.dadosUsuario.inicializar);
