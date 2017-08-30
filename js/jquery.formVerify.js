;(function ($) {
    $.verify = function (element, exp) {
        var regularExp = {
            telephone: /^(((13[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/,
            telCode: /^[0-9]{6}$/,
            strengthA: {
                number: /^[0-9]+$/,
                letterCaps: /^[A-Z]+$/,
                letterLows: /^[a-z]+$/,
                symbol: /^\W+$/
            },
            strengthB: {
                numLetterA: /^(([0-9]+[a-z]+)|([a-z]+[0-9]+))[0-9a-z]*$/,
                numLetterB: /^(([0-9]+[A-Z]+)|([A-Z]+[0-9]+))[0-9A-Z]*$/,
                numSymbol: /^((\W+[0-9]+)|([0-9]+\W+))[\W0-9]*$/,
                LetterALetterB: /^(([A-Z]+[a-z]+)|([a-z]+[A-Z]+))[A-Za-z]*$/,
                LetterASymbol: /^((\W+[a-z]+)|([a-z]+\W+))[\Wa-z]*$/,
                LetterBSymbol: /^((\W+[A-Z]+)|([A-Z]+\W+))[\WA-Z]*$/
            }
        };

        var expOpt = $.extend({}, regularExp, exp);


    };


    $.fn.verify = function (opt) {
        return this.each(function () {
            if (!$(this).data("verify")) {
                var verify = new $.verify(this, opt);
                $(this).data("verify", verify);
            }
        });
    };
})(jQuery);