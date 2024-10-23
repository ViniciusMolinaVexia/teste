if (typeof gafisa == 'undefined') { gafisa = new Object(); }
if (typeof gafisa.alphabook == 'undefined') { gafisa.alphabook = new Object(); }

gafisa.alphabook.util = {

    gerarImagemNovaCor: function (idImagem, idCanvas, hexacor) {

        try {

            var canvas = document.getElementById(idCanvas),
        ctx = canvas.getContext("2d"),
        image = document.getElementById(idImagem);

            ctx.drawImage(image, 0, 0);

            var imgd = ctx.getImageData(0, 0, 128, 128),
            pix = imgd.data;
            var cor = gafisa.alphabook.util.converterCorHexParaRGB(hexacor);

            for (var i = 0, n = pix.length; i < n; i += 4) {
                pix[i] = cor.R;
                pix[i + 1] = cor.G;
                pix[i + 2] = cor.B;
            }

            ctx.putImageData(imgd, 0, 0);
        }
        catch (err) {
        }
    },

    converterCorHexParaRGB: function (cor) {
        var long = parseInt(cor.replace(/^#/, ""), 16);
        return {
            R: (long >>> 16) & 0xff,
            G: (long >>> 8) & 0xff,
            B: long & 0xff
        };
    },

    obterEndereco: function (cep) {
        if (cep) {
            $.loading({ action: 'show' });
            var valores = cep.toString().split('-');
            $.get(gafisa.alphabook.rotas.home.obterEndereco, { noCep: valores[0], noCepComplemento: valores[1] }, gafisa.alphabook.util.aposObterEndereco);
        }
    },

    aposObterEndereco: function (json) {
        $('#Endereco, #Logradouro').val(json.endereco.Logradouro);
        $('#Bairro').val(json.endereco.Bairro);
        $('#Estado').val(json.endereco.UF);
        $('#cidade').val(json.endereco.Cidade);
        $("#cidade").data('data-id', json.endereco.CidadeId);
        $("#cidade").data('id', json.endereco.CidadeId);
        $("#cidade").disable(!(json.endereco.Cidade != '' && json.endereco.Cidade != undefined));

        $.loading({ action: 'hide' });
    },

    obterUsuario: function (login) {
        if (login) {
            $.loading({ action: 'show' });
            $.get(gafisa.alphabook.rotas.admin.obterUsuarioAd, { login: login }, gafisa.alphabook.util.aposObterUsuario);
        }
    },

    aposObterUsuario: function (json) {
        $('#nomeUsuario').val(json.usuario.Nome);
        $('#sobrenomeUsuario').val(json.usuario.Sobrenome);
        $('#email').val(json.usuario.Email);
        $.loading({ action: 'hide' });
    },

    removeHtmlTag: function (returnText) {
        //-- remove BR tags and replace them with line break
        returnText = returnText.replace(/<br>/gi, "\n");
        returnText = returnText.replace(/<br\s\/>/gi, "\n");
        returnText = returnText.replace(/<br\/>/gi, "\n");

        //-- remove P and A tags but preserve what's inside of them
        returnText = returnText.replace(/<p.*>/gi, "\n");
        returnText = returnText.replace(/<a.*href="(.*?)".*>(.*?)<\/a>/gi, " $2 ($1)");

        //-- remove all inside SCRIPT and STYLE tags
        returnText = returnText.replace(/<script.*>[\w\W]{1,}(.*?)[\w\W]{1,}<\/script>/gi, "");
        returnText = returnText.replace(/<style.*>[\w\W]{1,}(.*?)[\w\W]{1,}<\/style>/gi, "");
        //-- remove all else
        returnText = returnText.replace(/<(?:.|\s)*?>/g, "");

        //-- get rid of more than 2 multiple line breaks:
        returnText = returnText.replace(/(?:(?:\r\n|\r|\n)\s*){2,}/gim, "\n\n");

        //-- get rid of more than 2 spaces:
        returnText = returnText.replace(/ +(?= )/g, '');

        //-- get rid of html-encoded characters:
        returnText = returnText.replace(/&nbsp;/gi, " ");
        returnText = returnText.replace(/&amp;/gi, "&");
        returnText = returnText.replace(/&quot;/gi, '"');
        returnText = returnText.replace(/&lt;/gi, '<');
        returnText = returnText.replace(/&gt;/gi, '>');

        return returnText;
    },
    
}