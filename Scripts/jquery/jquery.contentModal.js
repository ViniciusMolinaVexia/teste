(function ($) {
    $.fn.contentModal = function (options) {
        if (typeof (options) == 'string') {
            if (options == 'open' || options == 'close') {
                var $contentModal = $(this);
                var opts = $contentModal.data('contentModal');

                if (!opts) return this;

                var parts = opts.effect.split(' ');
                var effectType = parts[0];
                var effectTime;

                if (parts.length == 2)
                    effectTime = parts[1];
                else
                    effectTime = 'fast';

                if (opts.overlay) {
                    var $overlay = $('.contentModal-overlay');
                    if ($overlay.length > 0) {
                        if (options == 'open')
                            $overlay.fadeIn(effectTime);
                        else if (options == 'close')
                            $overlay.fadeOut(effectTime);
                    }
                }

                if (effectType == 'slide') {
                    if (options == 'open')
                        $contentModal.slideDown(effectTime);
                    else if (options == 'close')
                        $contentModal.slideUp(effectTime);
                } else {
                    if (options == 'open')
                        $contentModal.fadeIn(effectTime);
                    else if (options == 'close')
                        $contentModal.fadeOut(effectTime);
                }

                if (options == 'open') {
                    $('body').data('contentModal', $contentModal);
                } else {
                    $('body').removeData('contentModal');
                }
            }
        }
        else {
            var opts = $.extend({}, $.fn.contentModal.defaults, options, $.fn.contentModal.setup);
            
            var $contentModal = $(this).hide().remove();
            $contentModal.css("position", "absolute");

            var $relativeParent;
            var top;
            var left;
            if (opts.relativeParent) {
                $relativeParent = $(opts.relativeParent);
                top = Math.max(0, (($relativeParent.outerHeight() - $contentModal.outerHeight()) / 2));
                left = Math.max(0, (($relativeParent.outerWidth() - $contentModal.outerWidth()) / 2));
            }
            else {
                $relativeParent = $(window);
                top = Math.max(0, (($relativeParent.height() - $contentModal.outerHeight()) / 2) + $relativeParent.scrollTop());
                left = Math.max(0, (($relativeParent.width() - $contentModal.outerWidth()) / 2) + $relativeParent.scrollLeft());
            }

            $contentModal.css("top", top + "px");
            $contentModal.css("left", left + "px");

            if (opts.overlay) {
                var $overlay = $('.contentModal-overlay');
                if ($overlay.length == 0) {
                    $overlay = $(document.createElement('div')).addClass('contentModal-overlay');
                    $overlay.hide();

                    if (opts.relativeParent) {
                        $relativeParent.prepend($overlay);
                    }
                    else {
                        $('body').prepend($overlay);
                    }
                }
            }

            if (opts.relativeParent) {
                $relativeParent.append($contentModal);
            }
            else {
                $('body').prepend($contentModal);
            }

            $(document).scroll($.fn.contentModal.scrollControl);

            $contentModal.data('contentModal', opts);
        }
    };

    $.fn.contentModal.scrollControl = function (e) {
        var $contentModal = $('body').data('contentModal');

        if ($contentModal) {
            var opts = $contentModal.data('contentModal');
            var $relativeParent;
            if (opts && opts.relativeParent) {
                $relativeParent = $(opts.relativeParent);
            }
            else {
                $relativeParent = $(window);
            }

            $contentModal.css("top", Math.max(0, (($relativeParent.height() - $contentModal.outerHeight()) / 2) + $relativeParent.scrollTop()) + "px");
            $contentModal.css("left", Math.max(0, (($relativeParent.width() - $contentModal.outerWidth()) / 2) + $relativeParent.scrollLeft()) + "px");
        }
    };

    $.fn.contentModal.defaults = {
        effect: 'fade',
        overlay: true
    };

})(jQuery);

$.contentModal = function (options) {
    $.fn.contentModal(options);
};