(function ($) {
    var binded = false;
    var selectors = new Array();
    var functions = new Array();

    var methods = {
        init: function (func) {
            if (!binded) {
                $(document).mouseup(methods.mouseClick);
                binded = true;
            }

            var exists = false;
            for (var item in selectors) {
                if (selectors[item] == this) {
                    exists = true;
                    break;
                }
            }

            if (!exists) {
                selectors.push(this);
                functions.push(func);
            }

            return this;
        },
        mouseClick: function (e) {
            for (var item in selectors) {
                var container = selectors[item];
                if ($(container).is(':visible')) {
                    if (container.has(e.target).length === 0 && !container.is(e.target)) {
                        functions[item](e);
                    }
                }
            }
        },
        unbind: function () {
            for (var item in selectors) {
                if (selectors[item] == this) {
                    selectors.splice(item);
                    functions.splice(item);
                    break;
                }
            }
        }
    };

    $.fn.clickOutSide = function (method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'function') {
            return methods.init.apply(this, arguments);
        } else if (!method) {
            $.error('jQuery.clickOutSide need a function or method as parameter.');
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.clickOutSide.');
        }
    };
})(jQuery)