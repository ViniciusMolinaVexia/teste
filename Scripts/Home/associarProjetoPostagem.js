if (typeof gafisa.alphabook.home == 'undefined') { gafisa.alphabook.home = new Object(); }

gafisa.alphabook.home.associarProjeto = {
    completo: false,
    uploader: null,
    arquivos: 0,
    postagemid: null,
    idarquivopastaclicada: null,

    inicializar: function () {
        gafisa.alphabook.home.associarProjeto.registrarAcoes();
    },

    registrarAcoes: function () {

        var associados = [];
        associados.push(gafisa.alphabook.home.carrossel.obterIdProjeto());

        $('#postagemProjetosAssociados #buscaProjetosDisponiveisPost').livequery('click', gafisa.alphabook.home.associarProjeto.aoBuscarProjetosDisponiveis);
        $('#nomeProjetoDisponiveis').onPressEnter(gafisa.alphabook.home.associarProjeto.aoBuscarProjetosDisponiveis);
        $('#postagemProjetosAssociados #associarProjeto').livequery('click', gafisa.alphabook.home.associarProjeto.aoAssociarProjeto);
        $('#postagemProjetosAssociados #desassociarProjeto').livequery('click', gafisa.alphabook.home.associarProjeto.aoDesassociarProjeto);
        $('#postagemProjetosAssociados #selecionarTodosDisponiveis').livequery('click', gafisa.alphabook.home.associarProjeto.aoSelecionarTodosDisponiveis);
        $('#postagemProjetosAssociados #selecionarTodosAssociados').livequery('click', gafisa.alphabook.home.associarProjeto.aoSelecionarTodosAssociados);
        $('#postagemProjetosAssociados #Cidade').livequery(gafisa.alphabook.home.associarProjeto.configurarAutocompleteCidade);
        $('#postagemProjetosAssociados #buscaProjetosDisponiveisPost').livequery(gafisa.alphabook.home.associarProjeto.aoBuscarProjetosDisponiveis);
        $('#salvarProjetosAssociados').livequery('click', gafisa.alphabook.home.associarProjeto.aoSalvar);
        $('#fecharAssociarProjeto').livequery('click', gafisa.alphabook.home.associarProjeto.voltarDialogo);
        $('#voltarProjetosAssociados').livequery('click', gafisa.alphabook.home.associarProjeto.voltarDialogo);
    },
    aoAssociarProjeto: function () {

        $("#tabelaProjetosDisponiveis input:checkbox[name='checkProjeto']:checked").each(function () {
            var usuarioLogadoId = $('#tabelaProjetosAssociados').data('data-usuarioLogadId');
            var date = new Date();
            var dia = date.getDate();
            var mes = date.getMonth() + 1;
            var ano = date.getFullYear();
            var data = dia + "/" + mes + "/" + ano + " " + date.getHours() + ":" + date.getMinutes();
            var linha = $("#tabelaProjetosDisponiveis tr[data-id=" + $(this).data('id') + "]").clone();
            var linhaFixa = $("#tabelaProjetosAssociados #linhaProjetoFixo");
            linha.find('td').eq(7).after('<td class="colun-9">' + linha.find(".colun-4").html() + '</td><td class="colun-10">' + data + '</td>');
            $("#tabelaProjetosAssociados tbody").append(linha);
            $("#tabelaProjetosDisponiveis tr[data-id=" + $(this).data('id') + "]").remove();

        });

        if ($("#tabelaProjetosDisponiveis tr").length == 1) {
            gafisa.alphabook.home.associarProjeto.aoBuscarProjetosDisponiveis();
        }

        gafisa.alphabook.home.associarProjeto.totalizarProjetosAssociados();
    },

    aoDesassociarProjeto: function () {

        $("#tabelaProjetosAssociados input:checkbox[name='checkProjeto']:checked").each(function () {
            var linha = $("#tabelaProjetosAssociados tr[data-id=" + $(this).data('id') + "]").clone();
            linha.find('td').eq(8).remove();
            linha.find('td').eq(8).remove();

            $("#tabelaProjetosDisponiveis tbody").append(linha);
            $("#tabelaProjetosAssociados tr[data-id=" + $(this).data('id') + "]").remove();
        });

        gafisa.alphabook.home.associarProjeto.totalizarProjetosAssociados();
    },

    totalizarProjetosAssociados: function () {
        $("#projetosAssociados").text($("#tabelaProjetosAssociados tbody tr").length);
    },

    aoBuscarProjetosDisponiveis: function () {
        $('#postagemProjetosAssociados #tabelaProjetosDisponiveis').tabela({ action: gafisa.alphabook.rotas.postagem.listarProjetosDisponiveis, parametros: gafisa.alphabook.home.associarProjeto.retornarFiltros(), exibirVazio: true });
    },

    aoSelecionarTodosDisponiveis: function () {
        $('#tabelaProjetosDisponiveis [name="checkProjeto"]').prop('checked', $('#postagemProjetosAssociados #selecionarTodosDisponiveis').is(':checked'));
    },

    aoSelecionarTodosAssociados: function () {
        $('#tabelaProjetosAssociados [name="checkProjeto"]').prop('checked', $('#postagemProjetosAssociados #selecionarTodosAssociados').is(':checked'));
    },

    configurarAutocompleteCidade: function () {
        if ($("#postagemProjetosAssociados #Estado").val() == "") {
            gafisa.alphabook.home.associarProjeto.desabilitarCampoCidade(true);
            return;
        }

        gafisa.alphabook.home.associarProjeto.desabilitarCampoCidade(false);

        $('#postagemProjetosAssociados #Cidade').autocomplete({
            open: function () {
                setTimeout(function () {
                    $('.ui-autocomplete').css('z-index', 9999);
                }, 0);
            },
            source: gafisa.alphabook.home.associarProjeto.carregarDadosAutocomplete,
            minLength: 2,
            select: function (event, ui) {
                $('#postagemProjetosAssociados #Cidade').data('id', ui.item.Id);
            },
            change: function (event, ui) {
                if ($('#postagemProjetosAssociados #Cidade').val() == '') $('#postagemProjetosAssociados #Cidade').data('id', '');
            }
        });
    },

    desabilitarCampoCidade: function (bool) {
        var $cidade = $('#postagemProjetosAssociados #Cidade').disable(bool);
        if (bool)
            $cidade.val('');
    },

    carregarDadosAutocomplete: function (request, response) {
        $.ajax({
            url: gafisa.alphabook.rotas.contatos.listarCidadesAutocomplete,
            type: "POST",
            dataType: "json",
            data: { chave: $('#postagemProjetosAssociados #Cidade').val(), uf: $("#postagemProjetosAssociados #Estado").val() },
            success: function (data) {
                response($.map(data, function (item) {
                    return { label: item.value, value: item.value, Id: item.key };
                }));
            }
        });
    },

    retornarFiltros: function () {
        var data = {};

        data.ordenacao = 1;
        data.tipo = 1;
        data.idUltimo = null;
        data.status = $('#postagemProjetosAssociados #Status').val() != "" ? $('#postagemProjetosAssociados #Status').val() : null;
        data.nome = $('#postagemProjetosAssociados #nomeProjetoDisponiveis').val() != "" ? $('#postagemProjetosAssociados #nomeProjetoDisponiveis').val() : null;
        data.cidade = $('#postagemProjetosAssociados #Cidade').data('id') != "" ? $('#postagemProjetosAssociados #Cidade').data('id') : null;
        data.estados = $('#postagemProjetosAssociados #Estado').val() != "" ? $('#postagemProjetosAssociados #Estado').val() : null;
        data.associados = [];
        data.postId = $('#tabelaProjetosDisponiveis').data('postid');
        data.associados.push(gafisa.alphabook.home.carrossel.obterIdProjeto());

        $("#tabelaProjetosAssociados input:checkbox[name='checkProjeto']").each(function () {
            data.associados.push($(this).data('id'));
        });

        return data;
    },

    aoSalvar: function () {
        var data = {};

        data.idPost = $('#tabelaProjetosDisponiveis').data('postid');
        data.projetosAssociar = [];
        data.projetosDesassociar = [];

        $("#tabelaProjetosAssociados input:checkbox[name='checkProjeto']").each(function () {
            data.projetosAssociar.push($(this).data('id'));
        });

        $("#tabelaProjetosDisponiveis input:checkbox[name='checkProjeto']").each(function () {
            data.projetosDesassociar.push($(this).data('id'));
        });

        $.post(gafisa.alphabook.rotas.postagem.associarProjetosPost, data, function (json) { gafisa.alphabook.home.associarProjeto.aposSalvar(json) });
    },

    aposSalvar: function (json) {
        if (json.sucesso) {
            gafisa.alphabook.mensagens.exibirMensagemConfirmacao(gafisa.mensagens.post.projetosAssociadosComSucesso);
            $.dialogo.fechar(function () {
                $('#modal').removeClass('modalProjetosAssociados');
            });
        }
        else {
            if (typeof json.erros != 'undefined') {
                gafisa.alphabook.mensagens.exibirMensagemErro(json.erros[0]);
            }
            else {
                gafisa.alphabook.mensagens.exibirMensagemErro(json.mensagem);
            }
        }
    },

    voltarDialogo: function () {
        $.dialogo.fechar(function () {
            $('#modal').removeClass('modalProjetosAssociados');
        });
    }
};


$(document).ready(gafisa.alphabook.home.associarProjeto.inicializar);
