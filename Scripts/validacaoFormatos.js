gafisa.alphabook.validar = {
    email: function (valor) {
        var rx = new RegExp("\\w+([-+.]\\w+)*@\\w+([-.]\\w+)*\\.\\w+([-.]\\w+)*");
        var matches = rx.exec(valor);

        return (matches != null && valor == matches[0]);
    },

    cpf: function (valor) {
        var soma = 0;
        var resto = 0;
        var strCPF = valor.replace(".", "").replace("-", "").replace(".", "");
        var cpfValido = true;

        if (strCPF == "00000000000") {
            cpfValido = false;
        }
        for (var i = 1; i <= 9; i++) {
            soma = soma + parseInt(strCPF.substring(i - 1, i)) * (11 - i);
        }
        resto = (soma * 10) % 11;
        if ((resto == 10) || (resto == 11)) {
            resto = 0;
        }
        if (resto != parseInt(strCPF.substring(9, 10))) {
            cpfValido = false;
        }
        soma = 0;
        for (i = 1; i <= 10; i++) {
            soma = soma + parseInt(strCPF.substring(i - 1, i)) * (12 - i);
        }
        resto = (soma * 10) % 11;
        if ((resto == 10) || (resto == 11)) {
            resto = 0;
        }
        if (resto != parseInt(strCPF.substring(10, 11))) {
            cpfValido = false;
        }
        return cpfValido;
    },

    cnpj: function (valor) {
        valor = jQuery.trim(valor);
        valor = valor.replace('/', '');
        valor = valor.replace('.', '');
        valor = valor.replace('.', '');
        valor = valor.replace('-', '');

        var numeros, digitos, soma, i, resultado, pos, tamanho, digitosIguais;
        digitosIguais = 1;

        if (valor.length < 14 && valor.length < 15)
            return false;

        for (i = 0; i < valor.length - 1; i++) {
            if (valor.charAt(i) != valor.charAt(i + 1)) {
                digitosIguais = 0;
                break;
            }
        }

        if (!digitosIguais) {
            tamanho = valor.length - 2;
            numeros = valor.substring(0, tamanho);
            digitos = valor.substring(tamanho);
            soma = 0;
            pos = tamanho - 7;

            for (i = tamanho; i >= 1; i--) {
                soma += numeros.charAt(tamanho - i) * pos--;

                if (pos < 2) {
                    pos = 9;
                }
            }

            resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;

            if (resultado != digitos.charAt(0))
                return false;

            tamanho = tamanho + 1;
            numeros = valor.substring(0, tamanho);
            soma = 0;
            pos = tamanho - 7;

            for (i = tamanho; i >= 1; i--) {
                soma += numeros.charAt(tamanho - i) * pos--;

                if (pos < 2)
                    pos = 9;
            }

            resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;

            if (resultado != digitos.charAt(1))
                return false;

            return true;
        }
        else
            return false;

    },
    dataHora: function (value) {
        var dataHora = value;
        var data = dataHora.substr(0, 10);
        var hora = dataHora.substr(11, 5);

        if (!gafisa.alphabook.validar.data(data))
            return false;

        if (!gafisa.alphabook.validar.hora(hora))
            return false;

        return true;

    },

    data: function (value) {
        if (value.length != 10) return false;

        var data = value;
        var dia = data.substr(0, 2);
        var barra1 = data.substr(2, 1);
        var mes = data.substr(3, 2);
        var barra2 = data.substr(5, 1);
        var ano = data.substr(6, 4);

        if (data.length != 10 || barra1 != "/" || barra2 != "/" || isNaN(dia) || isNaN(mes) || isNaN(ano) || dia > 31 || mes > 12) return false;
        if ((mes == 4 || mes == 6 || mes == 9 || mes == 11) && dia == 31) return false;
        if (mes == 2 && (dia > 29 || (dia == 29 && ano % 4 != 0))) return false;
        if (ano < 1900) return false;

        return true;
    },

    horaminuto: function (value) {
        if (value.length != 5) return false;

        var data = value;
        var hora = data.substr(0, 2);
        var sep = data.substr(2, 1);
        var minuto = data.substr(3, 2);


        if (sep != ":" || isNaN(hora) || isNaN(minuto) || hora < 0 || hora > 23 || minuto < 0 || minuto > 59) return false;

        return true;
    },

    telefone: function (valor) {
        valor = valor.replace('(', '').replace(')', '').replace('-', '');
        var partes = valor.split(' ');

        if (partes.length != 2)
            return false;

        if (!/^\d+$/.test(partes[0]) || !/^\d+$/.test(partes[1]))
            return false;

        return (partes[0].length == 2 && (partes[1].length == 8 || partes[1].length == 9));
    },

    numero: function (valor) {
        return /^-?(?:\d+|\d{1,3}(?:.\d{3})+)(?:\,\d+)?$/.test(valor);
    },

    ddd: function (valor) {
        if (!/^\d+$/.test(valor))
            return false;

        return valor.length == 2;
    }
};