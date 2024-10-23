if (typeof gafisa == 'undefined') { gafisa = new Object(); }
if (typeof gafisa.alphabook == 'undefined') { gafisa.alphabook = new Object(); }
if (typeof gafisa.alphabook.autorizacao == 'undefined') { gafisa.alphabook.autorizacao = new Object(); }

gafisa.alphabook.autorizacao.usuarioPossuiPermissao = function (idSecao, idFuncionalidade, idAcao, opcoes) {

    if(!opcoes)
        opcoes = new Object();

    opcoes.secao = idSecao;
    opcoes.funcionalidade = idFuncionalidade;
    opcoes.acao = idAcao;

    var autorizado = false;
    $.ajax({
        dataType: "json",
        url: gafisa.alphabook.rotas.usuario.usuarioPossuiPermissao,
        data: opcoes,
        success: function(data) { autorizado = data.autorizado; },
        async: false,
    });
    
    return autorizado;
};
