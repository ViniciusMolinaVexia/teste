(function ($) {
    var returnObject = {
        event: null,
        isWindows: function () {
            return (this.event.keyCode == 91);
        },
        isPrintScreen: function () {
            return (this.event.keyCode == 44);
        },
        isScrollLock: function () {
            return (this.event.keyCode == 145);
        },
        isPauseBreak: function () {
            return (this.event.keyCode == 19);
        },
        isTab: function () {
            return (this.event.keyCode == 9);
        },
        isPageDown: function () {
            return (this.event.keyCode == 34);
        },
        isPageUp: function () {
            return (this.event.keyCode == 33);
        },
        isNumlock: function () {
            return (this.event.keyCode == 144);
        },
        isInsert: function () {
            return (this.event.keyCode == 45);
        },
        isHome: function () {
            return (this.event.keyCode == 36);
        },
        isEnd: function () {
            return (this.event.keyCode == 35);
        },
        isDelete: function () {
            return (this.event.keyCode == 46);
        },
        isCapsLock: function () {
            return (this.event.keyCode == 20);
        },
        isShift: function () {
            return (this.event.keyCode == 16);
        },
        isAlt: function () {
            return (this.event.keyCode == 18);
        },
        isCtrl: function () {
            return (this.event.keyCode == 17);
        },
        isArrow: function () {
            return (this.event.keyCode >= 37 && this.event.keyCode <= 40);
        },
        isFunction: function () {
            return (this.event.keyCode >= 112 && this.event.keyCode <= 123);
        },
        isNumber: function () {
            return (this.event.keyCode >= 96 && this.event.keyCode <= 105);
        },
        isLetter: function () {
            return (this.event.keyCode >= 65 && this.event.keyCode <= 90);
        },
        isEscape: function () {
            return (this.event.keyCode == 27);
        },
        isBackspace: function () {
            return (this.event.keyCode == 8);
        },
        isEnter: function () {
            return (this.event.keyCode == 13);
        },
        isSpace: function () {
            return (this.event.keyCode == 32);
        },
        isCharacter: function () {
            return (!this.isEscape() && !this.isFunction() &&
                    !this.isBackspace() && !this.isEnter() &&
                    !this.isArrow() && !this.isCtrl() &&
                    !this.isAlt() && !this.isShift() &&
                    !this.isDelete() && !this.isCapsLock() &&
                    !this.isEnd() && !this.isPageDown() &&
                    !this.isPageUp() && !this.isHome() &&
                    !this.isInsert() && !this.isNumlock() &&
                    !this.isTab() && !this.isPauseBreak() &&
                    !this.isScrollLock() && !this.isPrintScreen() &&
                    !this.isSpace());
        }
    };

    $.fn.keyEvents = function (e) {
        returnObject.event = e;
        return returnObject;
    };

})(jQuery);

$.keyEvents = function (e) {
    return $.fn.keyEvents(e);
};