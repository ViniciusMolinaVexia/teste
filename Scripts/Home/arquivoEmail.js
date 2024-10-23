if (typeof gafisa.alphabook.home == 'undefined') { gafisa.alphabook.home = new Object(); }

gafisa.alphabook.home.email = {

    dadosEmail: null,

    aoEnviarDocumentoPorEmail: function () {
        var itensSelecionados = $('input[name=ArquivosEmail]:checked').length > 0;

        if (itensSelecionados)
            gafisa.alphabook.home.email.aoAbrirModalEmail();
        else
            gafisa.alphabook.mensagens.exibirMensagemErro(gafisa.mensagens.comum.deveSerSelecionado.format('Pelo menos um arquivo'));
    },  

    aoAbrirModalEmail: function () {
        var url = gafisa.alphabook.rotas.arquivo.modalEnviarEmail;
        $('#modalEnviarEmail').html('');

        var itensSelecionados = $('input[name=ArquivosEmail]:checked');

        $.dialogo.fechar();

        var nomes = [];
        itensSelecionados.each(function () {
            nomes.push({ Nome: $(this).data('nome'), Referencia: $(this).data('referencia'), IdStream: $(this).data('idstream') });
        });

        $.loading({ action: 'show' });

        $.ajax({
            url: url,
            type: "POST",
            data: JSON.stringify(nomes),
            traditional: true,
            cache: false,
            contentType: 'application/json',
            success: gafisa.alphabook.home.email.aposAbrirModalEmail
        });
    },

    aposAbrirModalEmail: function (json) {
        $('#modalEnviarEmail #enviarEmail').livequery('click', gafisa.alphabook.home.email.aoEnviarEmail);
        $('#modalEnviarEmail input[name^=ArquivosSelecionados]').livequery('change', gafisa.alphabook.home.email.aoAlterarArquivosModal);

        $('#modalEnviarEmail').html(json.html).promise().done(gafisa.alphabook.home.email.preencherAutoCompleteEmail);

        $.loading({ action: 'hide' });
    },

    aoAlterarArquivosModal: function () {
        $.loading({ action: 'show' });

        var item = $(this);
        var url = gafisa.alphabook.rotas.arquivo.obterTamanhoTotal;
        var itensSelecionados = $('input[name^=ArquivosSelecionados]:checked', '#modalEnviarEmail');

        if (itensSelecionados.length > 0) {

            var nomes = [];

            itensSelecionados.each(function () {
                nomes.push({ Nome: $(this).data('nome'), Referencia: $(this).data('referencia') });
            });

            $.ajax({
                url: url,
                type: "POST",
                data: JSON.stringify(nomes),
                traditional: true,
                cache: false,
                contentType: 'application/json',
                success: function (json) {
                    $('#tamanhoTotal', '#modalEnviarEmail').text(json.tamanho);

                    if (json.limite) {
                        $('.validacao', '#modalEnviarEmail').show();
                        $('#Erro', '#modalEnviarEmail').addClass('erro');
                    }
                    else {
                        $('.validacao', '#modalEnviarEmail').hide();
                        $('#Erro', '#modalEnviarEmail').removeClass('erro');
                    }

                    $.loading({ action: 'hide' });
                }
            });
        } else {
            $('#tamanhoTotal', '#modalEnviarEmail').text('0,00MB');
            $.loading({ action: 'hide' });
        }
    },

    aoEnviarEmail: function () {
        var url = gafisa.alphabook.rotas.arquivo.enviarArquivosEmail;
        var parametros = $('.modal-body', '#modalEnviarEmail').formToJSON();
        parametros.ArquivosSelecionados = [];

        $('input[name^=ArquivosSelecionados]:checked', '#modalEnviarEmail').each(function () {
            parametros.ArquivosSelecionados.push($(this).val());
        });

        var destinatarios = '', cco = '';
        if ($('#Destinatarios option', '#modalEnviarEmail').val() != null && $('#Destinatarios option', '#modalEnviarEmail').val() != '') {
            $('#Destinatarios option', '#modalEnviarEmail').each(function (i, e) {
                var value = $(e).val().split('|');
                destinatarios += value[1] + ';';
            });
        }

        if ($('#CCO option', '#modalEnviarEmail').val() != null && $('#CCO option', '#modalEnviarEmail').val() != '') {
            $('#CCO option', '#modalEnviarEmail').each(function (i, e) {
                var value = $(e).val().split('|');
                cco += value[1] + ';';
            });
        }

        parametros.Destinatarios = destinatarios;
        parametros.CCO = cco;

        $.loading({ action: 'show' });

        $.post(url, parametros, gafisa.alphabook.home.email.aposEnviarEmail, 'json');
    },

    aposEnviarEmail: function (json) {
        if (json.sucesso) {
            gafisa.alphabook.mensagens.exibirMensagemConfirmacao(gafisa.mensagens.comum.enviadoComSucesso.format('Email'));
            $('#modalEnviarEmail').html('').modal('hide');
        }
        else
            gafisa.alphabook.mensagens.exibirMensagemErro(json.erros);

        $.loading({ action: 'hide' });
    },

    aoEnviarPostPorEmail: function () {
        var postagemId = $(this).data('id');
        var privacidadeId = $(this).data('privacidade');
        var assunto = $(this).data('titulo');
        var conteudo = $(this).data('postagem');

        var url = gafisa.alphabook.rotas.arquivo.modalEnviarPostEmail;
        $('#modalEnviarEmail').html('');

        gafisa.alphabook.home.email.dadosEmail = {
            postagemId: postagemId,
            privacidadeId: privacidadeId,
            assunto: assunto,
            conteudo: conteudo
        };

        $.loading({ action: 'show' });

        $.ajax({
            url: url,
            type: "POST",
            data: JSON.stringify(gafisa.alphabook.home.email.dadosEmail),
            traditional: true,
            cache: false,
            contentType: 'application/json',
            success: gafisa.alphabook.home.email.aposAbrirModalPostEmail
        });

    },

    aposAbrirModalPostEmail: function (json) {
        $('#modalEnviarEmail #enviarPostEmail').livequery('click', gafisa.alphabook.home.email.aoEnviarPostEmail);

        $('#modalEnviarEmail').html(json.html).promise().done(gafisa.alphabook.home.email.preencherAutoCompleteEmail);

        $('#tituloEmail', '#modalEnviarEmail').text('Enviar Post por Email');
        $('input[name^=ArquivosSelecionados]:checked', '#modalEnviarEmail').hide();
        $('#Assunto', '#modalEnviarEmail').attr('disabled', true).val(gafisa.alphabook.home.email.dadosEmail.assunto);
        $('#Conteudo', '#modalEnviarEmail').attr('disabled', true).text(gafisa.alphabook.home.email.dadosEmail.conteudo);
        $.loading({ action: 'hide' });
    },

    aoEnviarPostEmail: function () {
        var url = gafisa.alphabook.rotas.arquivo.enviarArquivosEmail;
        var parametros = $('#modalEnviarEmail').formToJSON();
        parametros.ArquivosSelecionados = [];

        $('input[name^=ArquivosSelecionados]:checked', '#modalEnviarEmail').each(function () {
            parametros.ArquivosSelecionados.push($(this).val());
        });

        var destinatarios = '', cco = '';
        if ($('#Destinatarios option', '#modalEnviarEmail').val() != null && $('#Destinatarios option', '#modalEnviarEmail').val() != '') {
            $('#Destinatarios option', '#modalEnviarEmail').each(function (i, e) {
                var value = $(e).val().split('|');
                destinatarios += value[1] + ';';
            });
        }

        if ($('#CCO option', '#modalEnviarEmail').val() != null && $('#CCO option', '#modalEnviarEmail').val() != '') {
            $('#CCO option', '#modalEnviarEmail').each(function (i, e) {
                var value = $(e).val().split('|');
                cco += value[1] + ';';
            });
        }

        parametros.Destinatarios = destinatarios;
        parametros.CCO = cco;

        $.loading({ action: 'show' });

        $.post(url, parametros, gafisa.alphabook.home.email.aposEnviarPostEmail, 'json');
    },

    aposEnviarPostEmail: function (json) {
        if (json.sucesso) {
            gafisa.alphabook.mensagens.exibirMensagemConfirmacao(gafisa.mensagens.comum.enviadoComSucesso.format('Post'));
            $('#modalEnviarEmail').html('').modal('hide');
        }
        else
            gafisa.alphabook.mensagens.exibirMensagemErro(json.erros);

        $.loading({ action: 'hide' });
    },

    preencherAutoCompleteEmail: function () {
        $(this).modal('show');

        if ($('#Destinatarios', '#modalEnviarEmail').attr('multiple') == 'multiple') return;
        $('#Destinatarios', '#modalEnviarEmail').fcbkcomplete({
            json_url: gafisa.alphabook.rotas.usuario.listarEmails,
            cache: true,
            newel: false,
            maxitems: 999,
            complete_text: "Digite um email",
            width: 384,
            bricket: true
        });

        if ($('#CCO', '#modalEnviarEmail').attr('multiple') == 'multiple') return;
        $('#CCO', '#modalEnviarEmail').fcbkcomplete({
            json_url: gafisa.alphabook.rotas.usuario.listarEmails,
            cache: true,
            newel: false,
            maxitems: 999,
            complete_text: "Digite um email",
            width: 384,
            bricket: true
        });
    }
};

$(document).ready(gafisa.alphabook.home.email.inicializar);
