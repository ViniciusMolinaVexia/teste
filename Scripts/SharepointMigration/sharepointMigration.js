$(document).ready(function () {

    let queryString = new URLSearchParams(window.location.search);

    let tb = "";
    let inicial = 0;
    let final = 0;
    let loop = false;

    for (let pair of queryString.entries()) {

        switch (pair[0]) {
            case 'tb':
                tb = pair[1];
                break;
            case 'inicial':
                inicial = parseInt(pair[1]);
                break;
            case 'final':
                final = parseInt(pair[1]);
                break;
            case 'ck-loop':
                loop = pair[1] == "on";
                break;
        }
    }

    let maxLoop = 5;

    switch (tb) {
        case 'arquivos':
            maxLoop = 16500;
            break;
        case 'usuarios':
            maxLoop = 350;
            break;
        case 'historico-arquivos':
            maxLoop = 16500;
            break;
        case 'link-email':
            maxLoop = 300;
            break;
        case 'material-treinamento':
            maxLoop = 5;
            break;
        default:
            maxLoop = 5;
            break;
    }


    if (tb && tb != "" && inicial > 0 && final > inicial) {

        if (loop) {
            if (final < maxLoop) {

                var intervalo = (final - inicial) + 1;

                setTimeout(() => {
                    inicial = final + 1;
                    final = final + intervalo;

                    const url = `/SharepointMigration?tb=${tb}&inicial=${inicial}&final=${final}&ck-loop=on`;

                    window.location.href = url;

                }, 7000);

            }
        }
    }

});