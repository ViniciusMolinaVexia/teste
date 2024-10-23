if (typeof gafisa.alphabook.home == 'undefined') { gafisa.alphabook.home = new Object(); }

gafisa.alphabook.home.buscaGeral = {
    inicializar: function () {
        gafisa.alphabook.home.buscaGeral.registrarAcoes();
    },

    registrarAcoes: function () {
        $('#botaoEfetuarBuscaGeral').livequery('click', gafisa.alphabook.home.buscaGeral.aoBuscar);

        $('#campoBuscaGeral').onPressEnter(gafisa.alphabook.home.buscaGeral.aoBuscar);

        $('#resultadoBuscaProjetos').livequery('click', gafisa.alphabook.home.buscaGeral.aoSelecionarProjetos);
        $('#resultadoBuscaDocumentos').livequery('click', gafisa.alphabook.home.buscaGeral.aoSelecionarDocumentos);
        $('#resultadoBuscaContatos').livequery('click', gafisa.alphabook.home.buscaGeral.aoSelecionarContatos);
        $('#resultadoBuscaCompromissos').livequery('click', gafisa.alphabook.home.buscaGeral.aoSelecionarCompromissos);
        $('#resultadoBuscaPostagens').livequery('click', gafisa.alphabook.home.buscaGeral.aoSelecionarPostagens);
        $('#resultadoBuscaTemplates').livequery('click', gafisa.alphabook.home.buscaGeral.aoSelecionarTemplates);
        $('#resultadoBuscaProtocolos').livequery('click', gafisa.alphabook.home.buscaGeral.aoSelecionarProtocolos);
    },

    aoBuscar: function () {
        if (!$(this).hasClass('inativo')) {
            if (String.isNullOrEmpty($('#campoBuscaGeral').val())) return;

            $.navegar.proximo(gafisa.alphabook.rotas.resultadoBusca.buscar, { termoBusca: $('#campoBuscaGeral').val() });
        }
    },

    aoSelecionarProjetos: function () {
        var ids = $(this).data('ids');
        $.navegar.proximo(gafisa.alphabook.rotas.projetosDepartamento.projetosDepartamento, null, function () { gafisa.alphabook.home.projetosDepartamento.aoExibirTela(ids); });
    },

    aoSelecionarDocumentos: function () {
        var ids = $(this).data('ids');
        $.navegar.proximo(gafisa.alphabook.rotas.documentos.index, { IdsDocumentos: ids }, function () { $('body').data('hashPai', window.location.hash); $('body').data('ids', ids); });
    },

    aoSelecionarContatos: function () {
        var ids = $(this).data('ids');
        $.navegar.proximo(gafisa.alphabook.rotas.contatos.index, {}, function () { gafisa.alphabook.home.contatos.aoExirTela(ids); });
    },

    aoSelecionarCompromissos: function () {
        var ids = $(this).data('ids');
        $.navegar.proximo(gafisa.alphabook.rotas.agenda.agenda, { podeCriarCompromisso: gafisa.alphabook.home.carrossel.estaNoProjeto() }, function () { gafisa.alphabook.home.agenda.aoExibirAgendaHomeInicial(ids); });
    },

    aoSelecionarPostagens: function () {
        var ids = $(this).data('ids');
        $.navegar.proximo(gafisa.alphabook.rotas.resultadoBusca.listarPosts, { ids: ids }, function () { gafisa.alphabook.home.buscaGeral.aoExibirTelaPostagens(ids); });
    },

    aoExibirTelaPostagens: function (ids) {
        $('#divPostagens').scroll(function () { gafisa.alphabook.home.buscaGeral.aoRolatAteOFimPostagens($(this)); }).data('ids', ids);
    },

    aoRolatAteOFimPostagens: function (conteudo) {
        conteudo = $(conteudo);

        if (conteudo.data('carregando') || conteudo.data('fim')) return;

        if (conteudo.scrollTop() + conteudo.innerHeight() >= conteudo[0].scrollHeight) {
            conteudo.data('carregando', true);
            $.get(gafisa.alphabook.rotas.resultadoBusca.listarPosts, { ids: $('#divPostagens').data('ids'), pagina: Math.ceil(($('.box-post').length / 10)) + 1 }, function (html) {

                if (html.contains('msg-sem-retorno')) {
                    conteudo.data('fim', true);
                    conteudo.data('carregando', false);
                }
                else {
                    $('#divPostagens').append(html);
                    conteudo.data('carregando', false);
                }
            }, "html");
        }
    },

    aoSelecionarTemplates: function () {
        var ids = $(this).data('ids');
        $.navegar.proximo(gafisa.alphabook.rotas.templates.index, { IdsTemplates: ids }, function () { $('body').data('hashPai', window.location.hash); $('body').data('ids', ids); });
    },

    aoSelecionarProtocolos: function () {
        var ids = $(this).data('ids');
        $.navegar.proximo(gafisa.alphabook.rotas.protocolos.index, {}, function () { gafisa.alphabook.home.protocolos.aoExibirTela(ids); });
    }
};

$(document).ready(gafisa.alphabook.home.buscaGeral.inicializar);