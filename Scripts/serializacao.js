$.fn.formToJSON = function () {
    var form = {};
    //var forms = this !== [] ? [this] : this;

    this.each(function () {
        $(this).find(':input[name]:not([name^=ddcl])').each(function () {
            var self = $(this);
            var name = self.attr('name');
            var value = self.val();
            var text; // = self.text();

            if (String.isNullOrWhiteSpace(value)) {
                return;
            }

            if (self.attr('checklist') == 'true' && value.startsWith(',')) {
                return;
            }

            if (name.startsWith('_')) {
                name = name.replace('_', '');
            }

            // Não serializa hidden se houver checkbox para o mesmo.
            if (self.attr('type') == 'hidden') {
                var nameHidden = self.attr('name');
                var existeCheckBoxComMesmoNome = $(':input[name="' + nameHidden + '"]:checkbox').length > 0;

                if (existeCheckBoxComMesmoNome)
                    return;
            }

            if (self.attr('type') == 'checkbox' && $(':input[name="' + self.attr('name') + '"]:checkbox').length == 1) {
                if (self.checked()) {
                    value = true;
                    text = self.text();
                } else {
                    value = false;
                }
            } else if (self.attr('type') == 'checkbox' && $(':input[name="' + self.attr('name') + '"]:checkbox').length > 1) {
                if (!self.attr('checked')) return;
            }

            if (self.attr('type') == 'radio') {
                if (!self.attr('checked'))
                    return;
            }

            if (form[name]) {
                form[name] = form[name] + ',' + value;
            } else {
                form[name] = value;
            }
        });
    });

    return form;
};

$.fn.formSerialize = function () {
    var array = this.formToJSON();
    var serial = '';

    for (var nome in array) {
        if (nome)
            serial += nome + '=' + array[nome] + '&';
    }

    return serial.substring(0, serial.length - 1).toLowerCase();
};

$.fn.getData = function () {
    if (this.length > 0) {
        var qtdAtributos = this[0].attributes.length;
        var data = {};
        for (var i = 0; i < qtdAtributos; i++) {
            if (this[0].attributes[i].name.startsWith('data-')) {
                if (!data[this[0].attributes[i].name.replace('data-', '')]) {
                    data[this[0].attributes[i].name.replace('data-', '')] = this[0].attributes[i].value;
                }
            }
        }
        return data;
    } else {
        return null;
    }
};

function serializeJSON(json) {
    var serial = '';

    for (var nome in json) {
        if (nome && json[nome] != null)
            serial += nome + '=' + json[nome] + '&';
    }

    return serial.substring(0, serial.length - 1);
};

function htmlEncode(value) {
    return $('<div/>').text(value).html();
}

function htmlDecode(value) {
    return $('<div/>').html(value).text();
}  