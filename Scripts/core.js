String.prototype.format = function () {
    var s = this;

    for (var i = 0; i < arguments.length; i++) {
        var reg = new RegExp("\\{" + i + "\\}", "gm");
        s = s.replace(reg, arguments[i]);
    }

    return s;
};

String.prototype.replaceAll = function (token, newToken) {
    var s = this;

    while (s.indexOf(token) != -1) {
        s = s.replace(token, newToken);
    }

    return s;
};

String.prototype.removeAll = function (token) {
    return this.replaceAll(token, '');
};

String.prototype.concatQueryString = function (data) {
    if (typeof data == 'string') {
        return this + '?' + data;
    }

    return this + '?' + $.param(data);
};

String.prototype.contains = function (value) {
    return this.indexOf(value) > -1;
};

String.prototype.startsWith = function (value) {
    return this.slice(0, value.length) == value;
};

String.prototype.endsWith = function (value) {
    return this.slice(-value.length) == value;
};

String.prototype.toFloat = function () {
    if (String.isNullOrWhiteSpace(this))
        return 0;

    var value = this.replaceAll('.', '').replaceAll(',', '.');

    if (isNaN(value))
        return null;

    return parseFloat(value);
};

String.prototype.toInt = function () {
    if (String.isNullOrWhiteSpace(this))
        return 0;

    var value = parseInt(this, 10);

    if (isNaN(value))
        return null;

    return value;
};

String.prototype.clearJSON = function () {
    if (String.isNullOrWhiteSpace(this))
        return '';

    if (!this.contains('{') || !this.contains('}'))
        return '';

    var start = this.indexOf('{');
    var end = this.lastIndexOf('}') + 1;

    return this.substring(start, end);
};

String.isNullOrEmpty = function (value) {
    return value == undefined || value == null || value == '';
};

String.isNullOrWhiteSpace = function (value) {
    return value == undefined || value == null || $.trim(value) == '';
};

String.prototype.toSecureUrl = function () {
    if (window.location.protocol == 'https:') {
        return this.substring(0, this.length - 1) + 'ssl/';
    }

    return this.toString();
};

Array.prototype.indexOf = function (obj) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == obj) {
            return i;
        }
    }

    return -1;
};

Math.roundDecimal = function (value, decimalPlaces) {
    var decimalCoefficient = Math.pow(10, decimalPlaces);
    return Math.round(value * decimalCoefficient) / decimalCoefficient;
};