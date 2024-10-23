if (typeof gafisa.alphabook.home == 'undefined') { gafisa.alphabook.home = new Object(); }
if (typeof gafisa.alphabook.home.relatorios == 'undefined') { gafisa.alphabook.home.relatorios = new Object(); }

gafisa.alphabook.home.relatorios.andamentoProjetos = {
    ultimaPosicao: 0,
    inicializar: function () {
        gafisa.alphabook.home.relatorios.andamentoProjetos.registrarAcoes();
        gafisa.alphabook.home.relatorios.andamentoProjetos.bindarCabecalhoTabela();
    },

    projetoIdNavegacao: null,

    registrarAcoes: function () {
        $(".box-relatorio-andamento-projetos #responsavel").livequery('click', gafisa.alphabook.home.relatorios.andamentoProjetos.aoAbrirUsuarios);
        $(".box-relatorio-andamento-projetos #statusProjeto").livequery('click', gafisa.alphabook.home.relatorios.andamentoProjetos.aoAbrirStatusProjeto);

        $('.box-relatorio-andamento-projetos .btnFiltroAndamentoProjetos').livequery('click', gafisa.alphabook.home.relatorios.andamentoProjetos.filtrar);
        $('.box-relatorio-andamento-projetos input[type=text]').onPressEnter(gafisa.alphabook.home.relatorios.andamentoProjetos.filtrar);

        $('#btnExportarRelatorioAndamentoProjetos').livequery('click', gafisa.alphabook.home.relatorios.andamentoProjetos.exportar);
        $('#tabelaRelatorioAndamentoProjetos .linha-tempo').livequery('click', gafisa.alphabook.home.relatorios.andamentoProjetos.aoClicarNomeProjeto);
        $('.box-relatorio-andamento-projetos').livequery(gafisa.alphabook.home.relatorios.andamentoProjetos.inicializarTela);
        if (departamentoUsuario == 2) {
            $('.box-relatorio-andamento-projetos #ListaStatusProjeto ul.jstree-no-icons').livequery(function () {
                $(this).find('a[data-statusprojetoid=13], a[data-statusprojetoid=14], a[data-statusprojetoid=16],a[data-statusprojetoid=22]').find('.jstree-checkbox').click();
            });
        }
    },

    bindarCabecalhoTabela: function () {
        $('.relatorio-andamento-projetos').livequery(gafisa.alphabook.home.relatorios.andamentoProjetos.aoRolarTabela);
    },

    aoRolarTabela: function () {
        $(this).scroll(function () {
            if (gafisa.alphabook.home.relatorios.andamentoProjetos.ultimaPosicao != this.scrollLeft) {
                $('#tabelaRelatorioAndamentoProjetosH').css({ left: -1 * this.scrollLeft, position: 'relative' });
                gafisa.alphabook.home.relatorios.andamentoProjetos.ultimaPosicao = this.scrollLeft;
            }
        });
    },

    inicializarTela: function () {
        gafisa.alphabook.home.relatorios.andamentoProjetos.configurarJstreeFiltro();
        gafisa.alphabook.home.relatorios.andamentoProjetos.configurarAutocompleteCidade();
        $('.box-relatorio-andamento-projetos #FiltroEstado').multiselect('option', 'noneSelectedText', 'UF');

        gafisa.alphabook.home.relatorios.andamentoProjetos.filtrar(true);
    },

    filtrar: function (inicializacao) {
        var data = gafisa.alphabook.home.relatorios.andamentoProjetos.retornarFiltros();

        if (inicializacao === true && departamentoUsuario == 2)
            data.statusIds = [13, 14, 16, 22];
        
        gafisa.alphabook.home.relatorios.andamentoProjetos.projetoIdNavegacao = null;

        var url = gafisa.alphabook.rotas.relatorios.listarDadosAndamentoProjetos;

        $('#tabelaRelatorioAndamentoProjetos').tabela({
            action: url,
            parametros: data,
            tamanhoPagina: 20,
            callback: $.navegar.ajustarRodape
        });
    },

    retornarFiltros: function () {
        var data = {};

        data.ordenacao = 1;
        data.tipo = 1;
        data.pagina = 1;
        data.tamanhoPagina = 20;
        if (!$('.box-relatorio-andamento-projetos #filtroTodas').is(':checked')) {

            data.cidade = $('.box-relatorio-andamento-projetos .cidade').val() != "" ? $('.box-relatorio-andamento-projetos .cidade').val() : null;
            data.estados = $('.box-relatorio-andamento-projetos #FiltroEstado').val() != "" ? $('.box-relatorio-andamento-projetos #FiltroEstado').val() : null;

            var quantidadeChecados = $('#ListaUsuarios .jstree-checked').length;
            data.usuariosIds = [];
            for (var i = 0; i < quantidadeChecados; i++) {
                data.usuariosIds.push($('#ListaUsuarios .jstree-checked')[i].id);
            }

            quantidadeChecados = $('#ListaStatusProjeto .jstree-checked').length;
            data.statusIds = [];
            for (var j = 0; j < quantidadeChecados; j++) {
                data.statusIds.push($('#ListaStatusProjeto .jstree-checked')[j].id);
            }

            data.produtoId = $('.box-relatorio-andamento-projetos #ProdutoId').val() != "" ? $('.box-relatorio-andamento-projetos #ProdutoId').val() : null;
            data.etapaId = $('.box-relatorio-andamento-projetos #EtapaId').val() != "" ? $('.box-relatorio-andamento-projetos #EtapaId').val() : null;

            data.anoMaturacaoDe = $('.box-relatorio-andamento-projetos #AnoMaturacaoDe').val() != "" ? $('.box-relatorio-andamento-projetos #AnoMaturacaoDe').val() : null;
            data.anoMaturacaoAte = $('.box-relatorio-andamento-projetos #AnoMaturacaoAte').val() != "" ? $('.box-relatorio-andamento-projetos #AnoMaturacaoAte').val() : null;
        }

        return data;
    },

    configurarJstreeFiltro: function () {
        $("#ListaUsuarios").jstree({
            "themes": {
                "theme": "default",
                "dots": true,
                "icons": false
            },
            "plugins": ["themes", "checkbox", "html_data"]
        }).bind("check_node.jstree uncheck_node.jstree", gafisa.alphabook.home.relatorios.andamentoProjetos.aoSelecionarItemUsuario);

        $("#ListaStatusProjeto").jstree({
            "themes": {
                "theme": "default",
                "dots": true,
                "icons": false
            },
            "plugins": ["themes", "checkbox", "html_data"]
        }).bind("check_node.jstree uncheck_node.jstree", gafisa.alphabook.home.relatorios.andamentoProjetos.aoSelecionarItemStatusProjeto);
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

    configurarAutocompleteCidade: function () {
        $('.box-relatorio-andamento-projetos input.cidade').autocomplete({
            open: function () {
                setTimeout(function () {
                    $('.ui-autocomplete').css('z-index', 289);
                }, 0);
            },
            source: gafisa.alphabook.home.relatorios.andamentoProjetos.carregarDadosAutocomplete,
            minLength: 2,
            select: function (event, ui) {
                $('.box-relatorio-andamento-projetos input.cidade').data('id', ui.item.Id);
            }
        });
    },

    carregarDadosAutocomplete: function (request, response) {
        if ($(".box-relatorio-andamento-projetos #FiltroEstado").val() == null) return;

        $.ajax({
            url: gafisa.alphabook.rotas.contatos.listarCidadesAutocomplete,
            type: "POST",
            dataType: "json",
            data: { chave: $('.box-relatorio-andamento-projetos input.cidade').val(), uf: $(".box-relatorio-andamento-projetos #FiltroEstado").val() },
            success: function (data) {
                response($.map(data, function (item) {
                    return { label: item.value, value: item.value, Id: item.key };
                }));
            }
        });
    },

    exportar: function (e) {
        e.preventDefault();
        var data = gafisa.alphabook.home.relatorios.andamentoProjetos.retornarFiltros();
        window.location.href = gafisa.alphabook.rotas.relatorios.relatorioAndamentoProjetosExportar.concatQueryString(data);
    },

    aoClicarNomeProjeto: function () {
        var parametros = {
            projetoId: $(this).data('id')
        };

        gafisa.alphabook.home.relatorios.andamentoProjetos.projetoIdNavegacao = $(this).data('id');

        $.navegar.proximo(gafisa.alphabook.rotas.projeto.linhaTempo, parametros, function () { gafisa.alphabook.home.linhaTempo.aoExibirTela(true); });
    }
};

$(document).ready(gafisa.alphabook.home.relatorios.andamentoProjetos.inicializar);
