if (typeof gafisa == 'undefined') { gafisa = new Object(); }
if (typeof gafisa.alphabook == 'undefined') { gafisa.alphabook = new Object(); }

gafisa.alphabook.controles = {
    aplicarMascaras: function () {
        $.mask.rules = {
            'a': /[a-zA-Z]/,
            'b': /[a-zA-ZçÇáàãéèíìóòõúùü ]/,
            'c': /[0-9a-zA-ZçÇáàãéèíìóòõúùü ]/
        };

        $('.campo-cep').livequery(function () { $(this).setMask({ mask: '99999-999', autoTab: false }); });
        $('.campo-cpf').livequery(function () { $(this).setMask({ mask: '999.999.999-99', autoTab: false }); });
        $('.campo-data').livequery(function () { $(this).setMask({ mask: '99/99/9999', autoTab: false }); });
        $('.campo-data-hora').livequery(function () { $(this).setMask({ mask: '99/99/9999 99:99', autoTab: false }); });
        $('.campo-ano').livequery(function () { $(this).setMask({ mask: '9999', autoTab: false }); });
        $('.ddd').livequery(function () { $(this).setMask({ mask: '99', autoTab: false }); });
        $('.fone').livequery(function () { $(this).setMask({ mask: '99999999', autoTab: false }); });
        $('.campo-alpha').livequery(function () { $(this).setMask({ mask: 'b', type: 'repeat', fixedChars: "[(),.:/-]", autoTab: false }); });
        $('.campo-alpha-number').livequery(function () { $(this).setMask({ mask: 'c', type: 'repeat', fixedChars: "[(),.:/ -]", autoTab: false }); });
        $('.campo-inteiro').livequery(function () { $(this).setMask({ mask: '999999999', autoTab: false }); });
        $('.campo-inteiro-direita').livequery(function () { $(this).setMask({ mask: '999999999', type: 'reverse', autoTab: false }); });

        $('.campo-agencia').livequery(function () { $(this).setMask({ mask: '9999', autoTab: false }); });
        $('.campo-conta').livequery(function () { $(this).setMask({ mask: '9999999999', autoTab: false }); });
        $('.campo-cnpj').livequery(function () { $(this).setMask({ mask: '99.999.999/9999-99', autoTab: false }); });
        $('.campo-preco').livequery(function () { $(this).setMask({ mask: '99,999.999.999.999', type: 'reverse', defaultValue: '+000', autoTab: false }); });
        $('.campo-telefone-fixo').livequery(function () { $(this).setMask({ mask: '(99) 9999-9999', autoTab: false }); });
        $('.campo-telefone').livequery(function () {
            $(this).keydown(function (e) {

                if (!(e.which >= 48 && e.which <= 57) && !(e.which >= 96 && e.which <= 105) && e.which != 8 && e.which != 46) {
                    return;
                }

                if ($(this).val().length < 10 && $(this).data('mask').mask == '99999-9999') {
                    $(this).setMask({ mask: '9999-9999', autoTab: false });
                }
                else if ($(this).val().length >= 9 && !(e.which == 8 || e.which == 46)) {
                    $(this).setMask({ mask: '99999-9999', autoTab: false });
                }
                else if ($(this).val().length == 10 && (e.which == 8 || e.which == 46)) {
                    var inputTelefone = this;
                    setTimeout(function () { $(inputTelefone).setMask({ mask: '9999-9999', autoTab: false }); }, 50);
                }
            });

            if (($(this).val().length == 6) || ($(this).val().length == 9)) {
                $(this).setMask({ mask: '99999-9999', autoTab: false });
            }
            else {
                $(this).setMask({ mask: '9999-9999', autoTab: false });
            }
        });
        $('.campo-quantidade').livequery(function () { $(this).setMask({ mask: '99', autoTab: false, type: 'reverse' }); });
        $('.carousel').livequery(function () { $(this).jcarousel({ vertical: false, scroll: 1 }); });
        $('.campo-hora').livequery(function () { $(this).setMask({ mask: '99:99:99', autoTab: false }); });
        $('.campo-hora-minuto').livequery(function () { $(this).setMask({ mask: '99:99', autoTab: false }); });
        $('.campo-numeros').livequery(function () { $(this).setMask({ mask: '999999999999999999', autoTab: false }); });

        $('.campo-taxa-juros').livequery(function () { $(this).setMask({ mask: '9999,999', type: 'reverse', autoTab: false }); });
        $('.campo-percentual').livequery(function () { $(this).setMask({ mask: '99,999', type: 'reverse', autoTab: false }); });
        $('.campo-valor').livequery(function () { $(this).setMask({ mask: '99,999.999.99', type: 'reverse', autoTab: false }); });
        $('.campo-valor-grande').livequery(function () { $(this).setMask({ mask: '99,999.999.999.999.999', type: 'reverse', autoTab: false }); });
        $('.campo-iof').livequery(function () { $(this).setMask({ mask: '99999,999', type: 'reverse', autoTab: false }); });
        $('.campo-indice').livequery(function () { $(this).setMask({ mask: '999999,9', type: 'reverse', autoTab: false }); });
        $('.campo-anos').livequery(function () { $(this).setMask({ mask: '999', autoTab: false, type: 'reverse' }); });
        $('.campo-mip-dfi').livequery(function () { $(this).setMask({ mask: '999999,999', autoTab: false, type: 'reverse' }); });
        $('.campo-ordem').livequery(function () { $(this).setMask({ mask: '999', autoTab: false }); });

        $('.campo-quantidade, .campo-preco, .campo-taxa-juros, .campo-percentual, .campo-valor, .campo-iof, .campo-indice, .campo-anos, .campo-mip-dfi, .campo-ordem').livequery(function () {
            $(this).bind('focus mouseup mousedown dblclick', function (e) {
                e.preventDefault();
                $(this).select();
            });
        });

        $('#btnBuscarCep').livequery('click', gafisa.alphabook.controles.obterEndereco);
        $('#CEP').livequery('keypress', function (e) {
            if (e.keyCode == 13) {
                e.preventDefault();
                gafisa.alphabook.controles.obterEndereco();
            }
        });
    },

    obterEndereco: function () {
        gafisa.alphabook.util.obterEndereco($('#CEP').val());
    },

    isIE: function () {
        return $.browser.msie;
    },

    scrollToAnchor: function (id) {
        var aTag = $("a[name='" + id + "']");
        $('html,body').animate({ scrollTop: aTag.offset().top }, 'slow');
    },

    inicializar: function () {
        $('select[multiple]:not(.no-multiple-select)').livequery(function () {
            $(this).setMultipleCheckList();
        });
    }
};

$(document).ready(gafisa.alphabook.controles.inicializar);

//-------------------------------
// MultipleCheckList 
//-------------------------------

$.fn.clearSelect = function () {
    return this.find('option').remove();
};

$.fn.fillMultipleSelect = function (url, data, defaultOption, onComplete) {
    var ddl = this;
    data = data ? $.param(data) : '';

    $.getJSON(url.concatQueryString(data), function (json) {
        ddl.clearMultipleCheckList();

        var options = '';

        if (defaultOption) 
            options += '<option value="">' + defaultOption + '</option>';

        $.each(json, function () {
            options += '<option value="' + this.Value + '">' + this.Text + '</option>';
        });

        ddl.append(options);

        if (ddl[0].getAttribute('multiple') == 'true' || ddl[0].getAttribute('multiple') == 'false') 
            ddl.multiselect('refresh');

        if (onComplete && typeof onComplete == 'function') 
            onComplete(ddl);
    });

    return ddl;
};

$.fn.fillSelect = function (url, data, defaultOption, onComplete) {
    var ddl = this;
    data = data ? $.param(data) : '';

    $.getJSON(url.concatQueryString(data), function (json) {

        $(ddl).find('option').remove().end();

        var options = '';

        if (defaultOption)
            options += '<option value="">' + defaultOption + '</option>';

        $.each(json, function () {
            options += '<option value="' + this.Value + '">' + this.Text + '</option>';
        });

        ddl.append(options);

        if (onComplete && typeof onComplete == 'function')
            onComplete(ddl);
    });

    return ddl;
};

$.fn.clearMultipleCheckList = function (keepDefaultOption) {
    var ddl = this;

    ddl.multiselect('destroy');

    if (keepDefaultOption === true) 
        ddl.find('option[value!=""]').remove();
    else 
        ddl.find('option').remove();

    ddl.setMultipleCheckList();
    return ddl;
};

$.fn.setMultipleCheckList = function () {

    var id = '#' + $(this).attr('id');
    var checkAll = $(this).attr('firsitemcheckall') == 'true';
    var checked = false;

    $(this).multiselect({
        multiple: true,
        header: false,
        selectedList: 2,
        minWidth: $(this).attr('width'),
        click: function (event, ui) {
            if (checkAll) {
                if ((ui.value == '' || ui.value == '-1') && checked == false) {
                    checked = true;
                    $(id).multiselect('checkAll');
                } else if ((ui.value == '' || ui.value == '-1') && checked == true) {
                    checked = false;
                    $(id).multiselect('uncheckAll');
                }
            }
        }
    });
};

$.fn.setState = function (state) {
    var id = '#' + $(this).attr('id');
    $(id).multiselect(state);
};

$.fn.setVal = function (value, disabled, selected) 
{
    var v = value, opt = $('<option />', { value: v, text: v });

    if (disabled.is(':checked')) 
        opt.attr('disabled', 'disabled');
    
    if (selected.is(':checked')) 
        opt.attr('selected', 'selected');

    opt.appendTo(this);

    this.multiselect('refresh');
};

//-------------------------------
//FIM MultipleCheckList
//-------------------------------

$.fn.applyMaxLength = function () {
    var maxLength = this.attr('maxlength');

    return this.maxlength({
        maxCharacters: maxLength,
        status: false,
        showAlert: false
    });
};

$.formatCurrency = function (num, moeda) {
    num = num.toString().replace(/\$|\,/g, '');

    if (isNaN(num))
        num = "0";

    var cents = '00';

    if (num.indexOf('.') != -1)
        cents = num.substring(num.indexOf('.') + 1);

    if (cents.length < 2)
        cents = (cents + "00").substring(0, 2);

//    if (cents < 10)
//        cents = "0" + cents;

    if (cents.length > 2)
        cents = cents.substring(0, 2);

    num = parseInt(num).toString();

    for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++) {
        num = num.substring(0, num.length - (4 * i + 3)) + '.' + num.substring(num.length - (4 * i + 3));
    }

    if (moeda == undefined || moeda == null)
        moeda = '';

    return moeda + num + ',' + cents;
};

$.formatInt = function (num) {
    num += '';

    var x = num.split('.');
    var x1 = x[0];
    var x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;

    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + '.' + '$2');
    }

    return x1 + x2;
};

$.fn.checked = function (value) {
    if (typeof value == 'undefined') {
        return this.is(':checked');
    }
    else {
        if (value === true) {
            return this.attr('checked', 'checked');
        }
        else if (value === false) {
            return this.removeAttr('checked');
        }

        return this;
    }
};


$.fn.disable = function (disabled) {
    if (typeof disabled == 'undefined') {
        disabled = true;
    }
    else {
        if (disabled === true) {
            return this.attr('disabled', 'disabled');
        }
        else if (disabled === false) {
            return this.removeAttr('disabled');
        }

        return this;
    }
};

$.fn.scrollbarSize = function() {
    var $inner = $('<div style="width: 100%; height:200px;">test</div>'),
        $outer = $('<div style="width:200px;height:150px; position: absolute; top: 0; left: 0; visibility: hidden; overflow:hidden;"></div>').append($inner),
        inner = $inner[0],
        outer = $outer[0];

    $('body').append(outer);
    var width1 = inner.offsetWidth;
    $outer.css('overflow', 'scroll');
    var width2 = outer.clientWidth;
    $outer.remove();

    return (width1 - width2) / ($.browser.msie ? 2 : 1);
};


