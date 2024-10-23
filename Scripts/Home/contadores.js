if (typeof gafisa.alphabook.home == 'undefined') { gafisa.alphabook.home = new Object(); }

gafisa.alphabook.home.contadores = {
    inicializar: function () {
        gafisa.alphabook.home.contadores.registrarAcoes();
        if (!$('#ProjetoId').val())
            gafisa.alphabook.home.contadores.atualizarTodos();
    },

    registrarAcoes: function () {

    },

    atualizarTodos: function () {
        var idProjeto = gafisa.alphabook.home.carrossel.obterIdProjeto();

        gafisa.alphabook.home.contadores.atualizarContatos(idProjeto);
        gafisa.alphabook.home.contadores.atualizarAgenda(idProjeto);
        gafisa.alphabook.home.contadores.atualizarPostagem(idProjeto);

        if (idProjeto == 0) {
            gafisa.alphabook.home.contadores.atualizarRelatorios(idProjeto);
            gafisa.alphabook.home.contadores.atualizarInteligenciaMercado(idProjeto);
            gafisa.alphabook.home.contadores.atualizarModelosPadroes(idProjeto);
            gafisa.alphabook.home.contadores.atualizarProjetosRecebidos(idProjeto);
            gafisa.alphabook.home.contadores.atualizarProjetosDepartamento(idProjeto);
        } else {
            gafisa.alphabook.home.contadores.atualizarDocumentos(idProjeto);
            gafisa.alphabook.home.contadores.atualizarLinhaTempo(idProjeto);
            gafisa.alphabook.home.contadores.atualizarProtocolos(idProjeto);
        }
    },

    atualizarContatos: function (idProjeto) {
        if (idProjeto == undefined) idProjeto = gafisa.alphabook.home.carrossel.obterIdProjeto();
        gafisa.alphabook.home.contadores.obterQuantidade(gafisa.alphabook.padroes.tipoContador.Contatos, idProjeto, $(".tile-contatos .numero-tile"));
    },

    atualizarRelatorios: function (idProjeto) {
        if (idProjeto == undefined) idProjeto = gafisa.alphabook.home.carrossel.obterIdProjeto();
        gafisa.alphabook.home.contadores.obterQuantidade(gafisa.alphabook.padroes.tipoContador.Relatorios, idProjeto, $(".tile-relatorios .numero-tile"));
    },

    atualizarDocumentos: function (idProjeto) {
        if (idProjeto == undefined) idProjeto = gafisa.alphabook.home.carrossel.obterIdProjeto();
        gafisa.alphabook.home.contadores.obterQuantidade(gafisa.alphabook.padroes.tipoContador.Documentos, idProjeto, $(".tile-documentos .numero-tile"));
    },

    atualizarInteligenciaMercado: function (idProjeto) {
        if (idProjeto == undefined) idProjeto = gafisa.alphabook.home.carrossel.obterIdProjeto();
        gafisa.alphabook.home.contadores.obterQuantidade(gafisa.alphabook.padroes.tipoContador.InteligenciaMercado, idProjeto, $(".tile-inteligenciamercado .numero-tile"));
    },

    atualizarModelosPadroes: function (idProjeto) {
        if (idProjeto == undefined) idProjeto = gafisa.alphabook.home.carrossel.obterIdProjeto();

        gafisa.alphabook.home.contadores.obterQuantidade(gafisa.alphabook.padroes.tipoContador.ModelosPadroes, idProjeto, $(".tile-modelopadroes .numero-tile"));
    },

    atualizarLinhaTempo: function (idProjeto) {
        if (idProjeto == undefined) idProjeto = gafisa.alphabook.home.carrossel.obterIdProjeto();
        gafisa.alphabook.home.contadores.obterQuantidade(gafisa.alphabook.padroes.tipoContador.LinhaTempo, idProjeto, $(".tile-linhatempo .numero-tile"));

    },

    atualizarProjetosRecebidos: function (idProjeto) {
        if (idProjeto == undefined) idProjeto = gafisa.alphabook.home.carrossel.obterIdProjeto();
        gafisa.alphabook.home.contadores.obterQuantidade(gafisa.alphabook.padroes.tipoContador.ProjetosRecebidos, idProjeto, $(".tile-projetosrecebidos .numero-tile"));

    },

    atualizarProtocolos: function (idProjeto) {
        if (idProjeto == undefined) idProjeto = gafisa.alphabook.home.carrossel.obterIdProjeto();
        gafisa.alphabook.home.contadores.obterQuantidade(gafisa.alphabook.padroes.tipoContador.Protocolos, idProjeto, $(".tile-protocolos .numero-tile"));

    },

    atualizarProjetosDepartamento: function (idProjeto) {
        if (idProjeto == undefined) idProjeto = gafisa.alphabook.home.carrossel.obterIdProjeto();
        gafisa.alphabook.home.contadores.obterQuantidade(gafisa.alphabook.padroes.tipoContador.ProjetosDepartamento, idProjeto, $(".tile-projetosdepartamento .numero-tile"));

    },

    atualizarAgenda: function (idProjeto) {
        if (idProjeto == undefined) idProjeto = gafisa.alphabook.home.carrossel.obterIdProjeto();
        gafisa.alphabook.home.contadores.obterQuantidade(gafisa.alphabook.padroes.tipoContador.Agenda, idProjeto, $("#tileAgenda .numero-tile"));
    },

    atualizarPostagem: function (idProjeto) {
        if (idProjeto == undefined) idProjeto = gafisa.alphabook.home.carrossel.obterIdProjeto();
        gafisa.alphabook.home.contadores.obterQuantidade(gafisa.alphabook.padroes.tipoContador.Postagem, idProjeto, $(".div-posts .top .contagem"), '({0})');
    },

    obterQuantidade: function (contador, idProjeto, obj, padraoFormatacao) {
        obj.fadeOut();
        $.post(gafisa.alphabook.rotas.projeto.obterContador,
            { projetoId: idProjeto, contador: contador },
            function (json) {
                
                if (json.ProjetoId != gafisa.alphabook.home.carrossel.obterIdProjeto()) {
                    obj.fadeIn();
                    return;
                }
                
                var texto = json.Quantidade;
                if (!String.isNullOrEmpty(padraoFormatacao))
                    texto = padraoFormatacao.format(texto);

                obj.text(texto);
                obj.fadeIn();
            });
    }
};

$(document).ready(gafisa.alphabook.home.contadores.inicializar);