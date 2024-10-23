(function ($) {
    var methods = {
        init: function (event) {

            if (this.length == 0) {
                $(this).livequery(function () {
                    methods.bind($(this), event);
                });
                return this;
            }

            $.each(this, function (index, element) {
                methods.bind($(element), event);
            });

            return this;
        },
        onKeyEnterPress: function (e, event) {
            if (e.keyCode == 13) {
                e.preventDefault();
                event();
            }
        },
        bind: function (element, event) {
            if (element == null || $(element).data('onpressenter') || $(element).data('preventonpressenter')) return this;


            $(element).on('keypress', function (e) {
                methods.onKeyEnterPress(e, event);
            });

            $(element).data('onpressenter', true);
        },
        unbind: function () {
            $.each(this, function (index, element) {
                $(element).data('onpressenter', false);

                $(element).off('keypress');
            });
            return this;
        }
    };

    $.fn.onPressEnter = function (method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'function') {
            return methods.init.apply(this, arguments);
        } else if (!method) {
            $.error('jQuery.onPressEnter need a function or method as parameter.');
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.onPressEnter.');
        }
    };
})(jQuery)