if (typeof gafisa.alphabook.home == 'undefined') { gafisa.alphabook.home = new Object(); }

gafisa.alphabook.home.aprovacaoEtapa = {
    inicializar: function () {
        gafisa.alphabook.home.aprovacaoEtapa.registrarAcoes();
    },

    registrarAcoes: function () {
        $('#tabelaAprovacaoEtapa .lnkPostAprovacao').livequery('click', gafisa.alphabook.home.aprovacaoEtapa.aoClicarEtapaProjeto);
        $('#rejeitar').livequery('click', gafisa.alphabook.home.aprovacaoEtapa.aoRejeitarConclusao);
        $('#validar').livequery('click', gafisa.alphabook.home.aprovacaoEtapa.aoValidarConclusao);
    },

    aoExibirTela: function () {
        $('#tabelaAprovacaoEtapa').tabela({
            action: gafisa.alphabook.rotas.aprovacaoEtapa.listarEtapasPendentesAprovacao, callback: function () {
                $.navegar.ajustarRodape();
            }
        });
    },

    aoClicarEtapaProjeto: function () {
        var id = $(this).data('id');
        $.dialogo.exibir(gafisa.alphabook.rotas.aprovacaoEtapa.carregarDetalhePost, { idPost: id });
    },

    aoRejeitarConclusao: function () {
        
        var postId = $(this).data('postagemid');
        var projetoId = $(this).data('projetoid');

        var link = $('.lnkPostAprovacao[data-id="' + postId + '"]');
        var dataConclusao = link.data('conclusao');
        var etapa = link.text();
        var etapaId = link.data('etapaid');

        $.dialogo.fechar(function () {
            $.dialogo.confirmar(gafisa.mensagens.aprovacaoetapa.desejaRejeitarAConclusaoDaEtapa.format(etapa), function () {
                $.loading({ action: 'show' });
                gafisa.alphabook.home.aprovacaoEtapa.rejeitarConclusao(postId, projetoId, dataConclusao, etapaId);
            });
        });
    },

    aoValidarConclusao: function () {
        var postId = $(this).data('postagemid');
        var projetoId = $(this).data('projetoid');

        var link = $('.lnkPostAprovacao[data-id="' + postId + '"]');
        var dataConclusao = link.data('conclusao');
        var etapa = link.text();
        var etapaId = link.data('etapaid');

        $.dialogo.fechar(function () {
            $.dialogo.confirmar(gafisa.mensagens.aprovacaoetapa.desejaValidarAConclusaoDaEtapa.format(etapa), function () {
                $.loading({ action: 'show' });
                gafisa.alphabook.home.aprovacaoEtapa.validarConclusao(postId, projetoId, dataConclusao, etapaId);
            });
        });
    },

    rejeitarConclusao: function (postId, projetoId, dataConclusao, etapaId) {
        var data = {};
        data.idPost = postId;
        data.projetoId = projetoId;
        data.dataConclusao = dataConclusao;
        data.etapaId = etapaId;

        $.ajax({
            url: gafisa.alphabook.rotas.aprovacaoEtapa.rejeitarConclusao,
            type: "POST",
            data: JSON.stringify(data),
            cache: false,
            contentType: 'application/json',
            success: gafisa.alphabook.home.aprovacaoEtapa.aposFinalizarValidacao
        });
    },

    validarConclusao: function (postId, projetoId, dataConclusao, etapaId) {
        var data = {};
        data.idPost = postId;
        data.projetoId = projetoId;
        data.dataConclusao = dataConclusao;
        data.etapaId = etapaId;

        $.ajax({
            url: gafisa.alphabook.rotas.aprovacaoEtapa.validarConclusao,
            type: "POST",
            data: JSON.stringify(data),
            cache: false,
            contentType: 'application/json',
            success: gafisa.alphabook.home.aprovacaoEtapa.aposFinalizarValidacao
        });
    },

    aposFinalizarValidacao: function (json) {
        $.loading({ action: 'hide' });
        if (json.sucesso)
            gafisa.alphabook.mensagens.exibirMensagemConfirmacao(gafisa.mensagens.comum.salvaComSucesso.format('Validação da conclusão da etapa'));
        else
            gafisa.alphabook.mensagens.exibirMensagemErro(json.erros != null ? json.erros[0] : json.erro);

        $('#tabelaAprovacaoEtapa').tabela({ acao: "carregar" });
    },
};

$(document).ready(gafisa.alphabook.home.aprovacaoEtapa.inicializar);
