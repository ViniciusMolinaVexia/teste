if (typeof gafisa.alphabook.home == 'undefined') { gafisa.alphabook.home = new Object(); }
if (typeof gafisa.alphabook.home.relatorios == 'undefined') { gafisa.alphabook.home.relatorios = new Object(); }

gafisa.alphabook.home.relatorios.pipeline = {
    inicializada: false,
    ultimaPosicao: 0,
    inicializar: function () {
        gafisa.alphabook.home.relatorios.pipeline.registrarAcoes();
        gafisa.alphabook.home.relatorios.pipeline.bindarCabecalhoTabela();
    },

    registrarAcoes: function () {
        $(".box-relatorio-pipeline #responsavel").livequery('click', gafisa.alphabook.home.relatorios.pipeline.aoAbrirUsuarios);
        $(".box-relatorio-pipeline #statusProjeto").livequery('click', gafisa.alphabook.home.relatorios.pipeline.aoAbrirStatusProjeto);
        $('.box-relatorio-pipeline .btnFiltroPipeline').livequery('click', gafisa.alphabook.home.relatorios.pipeline.filtrar);
        $('.box-relatorio-pipeline').livequery(gafisa.alphabook.home.relatorios.pipeline.inicializarTela);
        $('#btnExportarRelatorioPipeline').livequery('click', gafisa.alphabook.home.relatorios.pipeline.exportar);
    },

    bindarCabecalhoTabela: function () {
        $('.relatorio-pipeline').livequery(gafisa.alphabook.home.relatorios.pipeline.aoRolarTabela);
    },

    aoRolarTabela: function () {
        $(this).scroll(function () {
            if (gafisa.alphabook.home.relatorios.pipeline.ultimaPosicao != this.scrollLeft) {
                $('#tabelaRelatorioPipelineH').css({ left: -1 * this.scrollLeft, position: 'relative' });
                gafisa.alphabook.home.relatorios.pipeline.ultimaPosicao = this.scrollLeft;
            }
        });
    },

    inicializarTela: function () {
        if (!gafisa.alphabook.home.relatorios.pipeline.inicializada) {
            gafisa.alphabook.home.relatorios.pipeline.inicializada = true;
            gafisa.alphabook.home.relatorios.pipeline.configurarAutocompleteCidade();
            gafisa.alphabook.home.relatorios.pipeline.configurarJstreeFiltro();
            $('.box-relatorio-pipeline #FiltroEstado').multiselect('option', 'noneSelectedText', 'UF');
            gafisa.alphabook.home.relatorios.pipeline.filtrar();
            gafisa.alphabook.home.relatorios.pipeline.habilitarFiltros();
        }
    },

    filtrar: function () {
        var data = gafisa.alphabook.home.relatorios.pipeline.retornarFiltros();
        $('#tabelaRelatorioPipeline').tabelaHeader({
            action: gafisa.alphabook.rotas.relatorios.listarDadosPipeline, parametros: data, tamanhoPagina: 20, callback: function () {
                if (gafisa.alphabook.home.relatorios.pipeline.ocultarColunas === true) {
                    $('#tabelaRelatorioPipeline .negocios-ocultar, #tabelaRelatorioPipelineH .negocios-ocultar').hide();
                    $('#tabelaRelatorioPipeline .negocios-colspan, #tabelaRelatorioPipelineH .negocios-colspan').attr('colspan', 1);
                }
            }
        });
    },

    configurarJstreeFiltro: function () {
        $("#ListaUsuarios").jstree({
            "themes": {
                "theme": "default",
                "dots": true,
                "icons": false
            },
            "plugins": ["themes", "checkbox", "html_data"]
        }).bind("check_node.jstree uncheck_node.jstree", gafisa.alphabook.home.relatorios.pipeline.aoSelecionarItemUsuario);

        $("#ListaStatusProjeto").jstree({
            "themes": {
                "theme": "default",
                "dots": true,
                "icons": false
            },
            "plugins": ["themes", "checkbox", "html_data"]
        }).bind("check_node.jstree uncheck_node.jstree", gafisa.alphabook.home.relatorios.pipeline.aoSelecionarItemStatusProjeto);
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
            texto = 'Selecione';

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
            texto = 'Selecione';

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
        $('.box-relatorio-pipeline .cidade, .box-relatorio-pipeline #responsavel, .box-relatorio-pipeline #statusProjeto').removeAttr('disabled');
        $('.box-relatorio-pipeline #FiltroEstado').setState('enable');
    },

    limparFiltros: function () {
        $('.box-relatorio-pipeline .cidade').val('').attr('disabled', 'disabled');
        $('.box-relatorio-pipeline #statusProjeto, .box-relatorio-pipeline #responsavel').attr('disabled', 'disabled');
        $(".box-relatorio-pipeline #ListaStatusProjeto").hide();
        $('.box-relatorio-pipeline #ListaUsuarios').hide();

        $('.box-relatorio-pipeline #FiltroEstado')
            .setState('disable');
        $('.box-relatorio-pipeline #FiltroEstado')
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
        if (!$('.box-relatorio-pipeline #filtroTodas').is(':checked')) {

            data.cidade = $('.box-relatorio-pipeline .cidade').val() != "" ? $('.box-relatorio-pipeline .cidade').val() : null;
            data.estados = $('.box-relatorio-pipeline #FiltroEstado').val() != "" ? $('.box-relatorio-pipeline #FiltroEstado').val() : null;

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
        }

        return data;
    },

    configurarAutocompleteCidade: function () {
        $('.box-relatorio-pipeline input.cidade').autocomplete({
            open: function () {
                setTimeout(function () {
                    $('.ui-autocomplete').css('z-index', 289);
                }, 0);
            },
            source: gafisa.alphabook.home.relatorios.pipeline.carregarDadosAutocomplete,
            minLength: 2,
            select: function (event, ui) {
                $('.box-relatorio-pipeline input.cidade').data('id', ui.item.Id);
            }
        });
    },

    desabilitarCampoCidade: function (bool) {
        var $cidade = $('.box-relatorio-pipeline input.cidade').disable(bool);
        if (bool)
            $cidade.val('');
    },

    carregarDadosAutocomplete: function (request, response) {
        if ($(".box-relatorio-pipeline #FiltroEstado").val() == null) return;

        $.ajax({
            url: gafisa.alphabook.rotas.contatos.listarCidadesAutocomplete,
            type: "POST",
            dataType: "json",
            data: { chave: $('.box-relatorio-pipeline input.cidade').val(), uf: $(".box-relatorio-pipeline #FiltroEstado").val() },
            success: function (data) {
                response($.map(data, function (item) {
                    return { label: item.value, value: item.value, Id: item.key };
                }));
            }
        });
    },

    exportar: function (e) {
        e.preventDefault();
        var data = gafisa.alphabook.home.relatorios.pipeline.retornarFiltros();
        window.location.href = gafisa.alphabook.rotas.relatorios.relatorioPipelineExportar.concatQueryString(data);
    }
};
$(document).ready(gafisa.alphabook.home.relatorios.pipeline.inicializar);
