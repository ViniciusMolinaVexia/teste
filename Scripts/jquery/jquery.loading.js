(function ($) {
    var cssClass;
    var effect;



    $.fn.loading = function (options) {
        var opts = $.extend({}, $.fn.loading.defaults, options, $.fn.loading.setup);
        cssClass = '.' + opts.cssClass;
        effect = opts.effect;

        $('.' + opts.cssClass).remove();
        var $loading = $(document.createElement('div')).addClass(opts.cssClass);

        $('body').prepend($loading.hide());

        var parts = opts.effect.split(' ');
        var effectType = parts[0];
        var effectTime;


        if (parts.length == 2)
            effectTime = parts[1];
        else
            effectTime = 'fast';


        if (options.action == 'show') {
            if (effectType == 'slide')
                $loading.slideDown(effectTime);
            else
                $loading.fadeIn(effectTime);

            return;
        }
        else if (options.action == 'hide') {
            if (effectType == 'slide')
                $loading.slideUp(effectTime, $loading.remove);
            else
                $loading.fadeOut(effectTime, $loading.remove);

            return;
        }
        else {
            if (effectType == 'slide')
                $loading.slideDown(effectTime);
            else
                $loading.fadeIn(effectTime);

            $.ajax({
                url: options.url,
                data: options.data,
                type: options.type,
                success: options.success,
                complete: function () {
                    if (effectType == 'slide')
                        $loading.slideUp(effectTime, $loading.remove);
                    else
                        $loading.fadeOut(effectTime, $loading.remove);
                }
            });
        }
    };

    $.fn.loading.defaults = {
        cssClass: 'loading-bar',
        effect: 'fade',
        callBack: null
    };

})(jQuery);

$.loading = function (options) {
    $.fn.loading(options);
};