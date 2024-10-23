if (typeof gafisa.alphabook.home == 'undefined') { gafisa.alphabook.home = new Object(); }
if (typeof gafisa.alphabook.home.relatorios == 'undefined') { gafisa.alphabook.home.relatorios = new Object(); }

gafisa.alphabook.home.relatorios.landbank = {
    inicializada: false,
    ultimaPosicao: 0,
    inicializar: function () {
        gafisa.alphabook.home.relatorios.landbank.registrarAcoes();
        gafisa.alphabook.home.relatorios.landbank.bindarCabecalhoTabela();
    },

    registrarAcoes: function () {
        if (departamentoUsuario == 2) {
            $('#ListaStatusProjeto ul.jstree-no-icons').livequery(function () {
                $(this).find('a[data-statusprojetoid=13], a[data-statusprojetoid=14], a[data-statusprojetoid=16],a[data-statusprojetoid=22]').find('.jstree-checkbox').click();
            });
        }

        $(".box-relatorio-landbanking #responsavel").livequery('click', gafisa.alphabook.home.relatorios.landbank.aoAbrirUsuarios);
        $(".box-relatorio-landbanking #statusProjeto").livequery('click', gafisa.alphabook.home.relatorios.landbank.aoAbrirStatusProjeto);
        $('.box-relatorio-landbanking .btnFiltroLandbank').livequery('click', gafisa.alphabook.home.relatorios.landbank.filtrar);
        $('.box-relatorio-landbanking #Maturacao').onPressEnter(gafisa.alphabook.home.relatorios.landbank.filtrar);
        $('.box-relatorio-landbanking').livequery(gafisa.alphabook.home.relatorios.landbank.inicializarTela);
        $('#btnExportarRelatorioLandbank').livequery('click', gafisa.alphabook.home.relatorios.landbank.exportar);
    },

    bindarCabecalhoTabela: function () {
        $('.relatorio-landbanking').livequery(gafisa.alphabook.home.relatorios.landbank.aoRolarTabela);
    },

    aoRolarTabela: function () {
        $(this).scroll(function () {
            if (gafisa.alphabook.home.relatorios.landbank.ultimaPosicao != this.scrollLeft) {
                $('#tabelaRelatorioLandBankingH').css({ left: -1 * this.scrollLeft, position: 'relative' });
                gafisa.alphabook.home.relatorios.landbank.ultimaPosicao = this.scrollLeft;
            }
        });
    },

    filtrar: function () {
        var data = gafisa.alphabook.home.relatorios.landbank.retornarFiltros();
        $('.box-relatorio-landbanking #tabelaRelatorioLandBanking').tabelaHeader({
            acao: 'carregar',
            parametros: data,
            tamanhoPagina: 20
        });
    },

    inicializarTela: function () {
        if (!gafisa.alphabook.home.relatorios.landbank.inicializada) {
            gafisa.alphabook.home.relatorios.landbank.inicializada = true;
            gafisa.alphabook.home.relatorios.landbank.configurarAutocompleteCidade();
            gafisa.alphabook.home.relatorios.landbank.configurarJstreeFiltro();

            $('.box-relatorio-landbanking #FiltroEstado').multiselect('option', 'noneSelectedText', 'UF');

            var data = gafisa.alphabook.home.relatorios.landbank.retornarFiltros();
            $('.box-relatorio-landbanking #tabelaRelatorioLandBanking').tabelaHeader({
                action: gafisa.alphabook.rotas.relatorios.listarProjetosLandbank,
                parametros: data,
                tamanhoPagina: 20,
                callback: function () {
                    if (gafisa.alphabook.home.relatorios.landbank.ocultarColunas === true) {
                        $('#tabelaRelatorioLandBanking .negocios-ocultar, #tabelaRelatorioLandBankingH .negocios-ocultar').hide();
                        $('#tabelaRelatorioLandBanking .negocios-colspan, #tabelaRelatorioLandBankingH .negocios-colspan').attr('colspan', 1);
                    }
                }
            });

            gafisa.alphabook.home.relatorios.landbank.habilitarFiltros();
        }
    },

    configurarJstreeFiltro: function () {
        $("#ListaUsuarios").jstree({
            "themes": {
                "theme": "default",
                "dots": true,
                "icons": false
            },
            "plugins": ["themes", "checkbox", "html_data"]
        }).bind("check_node.jstree uncheck_node.jstree", gafisa.alphabook.home.relatorios.landbank.aoSelecionarItemUsuario);

        $("#ListaStatusProjeto").jstree({
            "themes": {
                "theme": "default",
                "dots": true,
                "icons": false
            },
            "plugins": ["themes", "checkbox", "html_data"]
        }).bind("check_node.jstree uncheck_node.jstree", gafisa.alphabook.home.relatorios.landbank.aoSelecionarItemStatusProjeto);
    },

    aoSelecionarItemUsuario: function () {
        var checkPai = $('#ListaUsuarios .jstree-undetermined').length;
        var check = $('#ListaUsuarios .jstree-checked').length;
        var checkAll = checkPai + check;
        var texto = '';
        if (checkAll > 1) {
            texto = checkAll + ' Selecionados';
        } else {
            texto = $('#ListaUsuarios .jstree-checked').data('usuarionome');
        }

        if ($('#ListaUsuarios .jstree-checked').length == 0)
            texto = 'Responsável';

        $('#opcaoResponsavel').text(texto);

    },

    aoSelecionarItemStatusProjeto: function () {
        var checkPai = $('#ListaStatusProjeto .jstree-undetermined').length;
        var check = $('#ListaStatusProjeto .jstree-checked').length;
        var checkAll = checkPai + check;
        var texto = '';
        if (checkAll > 1) {
            texto = checkAll + ' Selecionados';
        } else {
            texto = $('#ListaStatusProjeto .jstree-checked').data('statusnome');
        }

        if ($('#ListaStatusProjeto .jstree-checked').length == 0)
            texto = 'Status';

        $('#opcaoStatusProjeto').text(texto);
    },

    aoAbrirUsuarios: function () {
        $(this).blur();
        $("#ListaStatusProjeto").hide();
        $('#ListaUsuarios').toggle(function () {
            if ($('#ListaUsuarios').attr('data-carregado')) {
                if ($('#ListaUsuarios').attr('data-carregado') == "true") {
                    $('#ListaUsuarios').attr('data-carregado', false);
                } else {
                    $('#ListaUsuarios').attr('data-carregado', true);
                }
            } else {
                $('#ListaUsuarios').attr('data-carregado', true);
            }
        }).css({
            left: ($(this).offset().left + 0) + 'px',
            top: ($(this).offset().top + 26) + 'px'
        });
    },

    aoAbrirStatusProjeto: function () {
        $(this).blur();
        $("#ListaUsuarios").hide();
        $('#ListaStatusProjeto').toggle(function () {
            if ($('#ListaStatusProjeto').attr('data-carregado')) {
                if ($('#ListaStatusProjeto').attr('data-carregado') == "true") {
                    $('#ListaStatusProjeto').attr('data-carregado', false);
                } else {
                    $('#ListaStatusProjeto').attr('data-carregado', true);
                }
            } else {
                $('#ListaStatusProjeto').attr('data-carregado', true);
            }
        }).css({
            left: ($(this).offset().left + 0) + 'px',
            top: ($(this).offset().top + 26) + 'px'
        });
    },

    habilitarFiltros: function () {
        $('.box-relatorio-landbanking .cidade, .box-relatorio-landbanking #responsavel, .box-relatorio-landbanking #Maturacao,.box-relatorio-landbanking #statusProjeto').removeAttr('disabled');
        $('.box-relatorio-landbanking #FiltroEstado').setState('enable');
    },

    limparFiltros: function () {
        $('.box-relatorio-landbanking .cidade, .box-relatorio-landbanking #Maturacao').val('').attr('disabled', 'disabled');
        $('.box-relatorio-landbanking #statusProjeto, .box-relatorio-landbanking #responsavel').attr('disabled', 'disabled');
        $(".box-relatorio-landbanking #ListaStatusProjeto").hide();
        $('.box-relatorio-landbanking #ListaUsuarios').hide();

        $('.box-relatorio-landbanking #FiltroEstado')
            .setState('disable');
        $('.box-relatorio-landbanking #FiltroEstado')
            .parent()
            .find('span')
            .filter(':last')
            .text('UF');
    },

    retornarFiltros: function () {
        var data = {};

        data.ordenacao = 1;
        data.tipo = 1;
        data.pagina = 1;
        data.tamanhoPagina = 20;
        data.cidade = null;
        data.estados = null;
        data.maturacao = null;
        data.usuarios = null;
        data.idStatus = null;
        data.produtoId = null;
        data.etapaId = null;

        if (!$('.box-relatorio-landbanking #filtroTodas').is(':checked')) {

            data.cidade = $('.box-relatorio-landbanking .cidade').val() != "" ? $('.box-relatorio-landbanking .cidade').val() : null;
            data.estados = $('.box-relatorio-landbanking #FiltroEstado').val() != "" ? $('.box-relatorio-landbanking #FiltroEstado').val() : null;
            data.maturacao = data.idStatus = $('.box-relatorio-landbanking #Maturacao').val() != "" ? $('.box-relatorio-landbanking #Maturacao').val() : null;

            var quantidadeChecados = $('#ListaUsuarios .jstree-checked').length;
            data.usuarios = [];
            for (var j = 0; j < quantidadeChecados; j++) {
                data.usuarios.push($('#ListaUsuarios .jstree-checked')[j].id);
            }

            quantidadeChecados = $('#ListaStatusProjeto .jstree-checked').length;
            data.idStatus = [];
            for (var j = 0; j < quantidadeChecados; j++) {
                data.idStatus.push($('#ListaStatusProjeto .jstree-checked')[j].id);
            }

            data.produtoId = $('.box-relatorio-landbanking #ProdutoId').val() != "" ? $('.box-relatorio-landbanking #ProdutoId').val() : null;
            data.etapaId = $('.box-relatorio-landbanking #EtapaId').val() != "" ? $('.box-relatorio-landbanking #EtapaId').val() : null;
        }

        return data;
    },

    configurarAutocompleteCidade: function () {
        $('.box-relatorio-landbanking input.cidade').autocomplete({
            open: function () {
                setTimeout(function () {
                    $('.ui-autocomplete').css('z-index', 289);
                }, 0);
            },
            source: gafisa.alphabook.home.relatorios.landbank.carregarDadosAutocomplete,
            minLength: 2,
            select: function (event, ui) {
                $('.box-relatorio-landbanking input.cidade').data('id', ui.item.Id);
            }
        });
    },

    desabilitarCampoCidade: function (bool) {
        var $cidade = $('.box-relatorio-landbanking input.cidade').disable(bool);
        if (bool)
            $cidade.val('');
    },

    carregarDadosAutocomplete: function (request, response) {
        if ($(".box-relatorio-landbanking #FiltroEstado").val() == null) return;

        $.ajax({
            url: gafisa.alphabook.rotas.contatos.listarCidadesAutocomplete,
            type: "POST",
            dataType: "json",
            data: { chave: $('.box-relatorio-landbanking input.cidade').val(), uf: $(".box-relatorio-landbanking #FiltroEstado").val() },
            success: function (data) {
                response($.map(data, function (item) {
                    return { label: item.value, value: item.value, Id: item.key };
                }));
            }
        });
    },
    exportar: function (e) {
        e.preventDefault();
        var data = gafisa.alphabook.home.relatorios.landbank.retornarFiltros();
        window.location.href = gafisa.alphabook.rotas.relatorios.relatorioLandbankExportar.concatQueryString(data);
    }
};

$(document).ready(gafisa.alphabook.home.relatorios.landbank.inicializar);
