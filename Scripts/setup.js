if (typeof gafisa == 'undefined') { gafisa = new Object(); }
if (typeof gafisa.alphabook == 'undefined') { gafisa.alphabook = new Object(); }

gafisa.alphabook.setup = {
    registrar: function () {
        gafisa.alphabook.setup.aplicarWatermarks();
        gafisa.alphabook.setup.aplicarMaxLength();
        gafisa.alphabook.controles.aplicarMascaras();
        gafisa.alphabook.setup.aplicarToolTips();
        gafisa.alphabook.setup.aplicarTabs();
        gafisa.alphabook.setup.aplicarAccordion();
        gafisa.alphabook.setup.aplicarDatePicker();
        gafisa.alphabook.setup.aplicarEstiloTabelas();
        gafisa.alphabook.setup.aplicarNavegacao();
        gafisa.alphabook.setup.aplicarMapa();
        gafisa.alphabook.setup.aplicarLinks();
        gafisa.alphabook.setup.aplicarCabecalhoProjeto();
        gafisa.alphabook.setup.aplicarcabecalhoProjetoHome();
    },

    aplicarNavegacao: function () {
        $('.bt-voltar').livequery(
			function () {
			    if ($.navegar.anterior)
			        $(this).click($.navegar.anterior);
			});


        $('.content').livequery(function () {
            if ($(window).hashchange)
                $(window).hashchange(function () {

                    var callback = $.navegar.metodoCallbackVoltar()();

                    $.navegar.irPara(location.hash, function () {
                        if (callback) callback();
                        $.navegar.limparCallbackVoltar();
                    });

                });
        });

        $('a.fechar').livequery('click', function () {
            $.dialogo.fechar();
        });

        $('a.voltar').livequery('click', function () {
            $.dialogo.voltar();
        });

    },

    aplicarMapa: function () {
        $(".navegar-mapa").livequery('click', function () {
            var id = $(this).attr('data-id');
            var tipo = $(this).data('tipo');
            var idProjeto = $(this).data('idprojeto');

            if (tipo == "cidade") $(".box-detalhe-usuario").fadeToggle('fast', function () {
                $(".box-detalhe-usuario").html('');
                $(".box-detalhe-usuario").removeClass("carregado");
            });

            if ($('#modal').hasClass('in'))
                $.dialogo.fechar(function() { $.navegar.mapa(id, tipo, idProjeto); }, true);
            else {
                if (gafisa.alphabook.home.timeline.etapaLinhaTempo === true) {
                    $('#modalEtapaCriarPost').html('').modal('hide');
                    $('.modal-backdrop').hide();
                }
                
                $.navegar.mapa(id, tipo, idProjeto);
            }
        });
    },

    aplicarEstiloTabelas: function () {
        $("table:not(.tabela-sem-estilo) tr:odd").livequery(function () { $(this).addClass("odd"); });
        $("table:not(.tabela-sem-estilo) tr:even").livequery(function () { $(this).addClass("even"); });
    },

    aplicarDatePicker: function () {
        $("#datepicker").livequery(function () {
            $(this).datepicker({
                inline: true
            });
        });
    },

    aplicarAccordion: function () {
        $("#accordion").livequery(function () { $(this).accordion(); });
    },

    aplicarToolTips: function () {
        $('a:not([data-html-tooltip])').livequery(function () { $(this).tooltip(); });
        $('a[data-html-tooltip]').livequery(function () {
            $(this).tooltip({
                content: function () {
                    return $(this).prop('title');
                },
                hide: 1000,
                close: function (e, ui) {
                    ui.tooltip.hover(
                        function () {
                            $(this).stop(true).fadeTo(400, 1);
                        },
                        function () {
                            $(this).fadeOut(400, function () { $(this).remove(); });
                        });
                }
            });
        });
    },

    aplicarTabs: function () {
        $("#tabs").livequery(function () { $(this).tabs(); });
    },

    aplicarWatermarks: function () {
        $('[watermark][watermark!=""]').livequery(function () {
            $(this).watermark($(this).attr('watermark'), { useNative: false, className: 'watermark-font' });
        });
    },

    aplicarMaxLength: function () {
        $('textarea[maxlength]').livequery(function () { $(this).applyMaxLength(); });
    },

    aplicarLinks: function () {
        $('.links .ico-link').livequery(function () {
            gafisa.alphabook.util.gerarImagemNovaCor("imgLink" + $(this).data('id'), "canvas" + $(this).data('id'), $(this).data('cor'));
            var id = $(this).data('id');
            $(this).hover(function () { $("#canvas" + id).show(); $("#imgLink" + id).hide(); }, function () { $("#canvas" + id).hide(); $("#imgLink" + id).show(); });
        });
    },

    aplicarCabecalhoProjeto: function () {
        $('#cabecalhoProjeto').livequery(function () {
            var idprojeto = $('#cabecalhoProjeto').data('projetoid');

            if (idprojeto == undefined)
                idprojeto = gafisa.alphabook.home.carrossel.obterIdProjeto();
            else if (!gafisa.alphabook.home.carrossel.estaNoProjeto())
                $("body").data("idprojeto", idprojeto);

            $.get(
            gafisa.alphabook.rotas.projeto.obterCabecalhoProjeto, { projetoId: idprojeto },
            function (html) {
                $('#cabecalhoProjeto').html('').html(html).find(".tile-sup-interno").on('click', function () { window.location.href = gafisa.alphabook.rotas.home.index + 'Home/Index/' + gafisa.alphabook.home.carrossel.obterIdProjeto(); });
            },
            "html");
        });
    },

    aplicarcabecalhoProjetoHome: function () {
        $('#cabecalhoProjetoHome').livequery(function () {
            var home = $('#cabecalhoProjetoHome').data('home');

            if (home == true && gafisa.alphabook.home.mapas.coordenadasNovoPontoInteresse != null && $('#postagemCriacao').length == 1) {
                return;
            }

            if (home == true && gafisa.alphabook.home.carrossel.estaNoProjeto())
                window.location.href = gafisa.alphabook.rotas.home.index + 'Home/Index/' + gafisa.alphabook.home.carrossel.obterIdProjeto();
        });
    }

};

$(document).ready(gafisa.alphabook.setup.registrar);

$.ajaxSetup({ dataType: 'json', cache: !$.browser.msie, traditional: true });

