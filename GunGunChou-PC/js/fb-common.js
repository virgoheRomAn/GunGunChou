//声明FB函数对象集合
var FB = window.Global = window.Global || {};
//声明FB集合属性
var exp = {
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
FB.verifyExp = exp;
FB.win = window;
/**
 * 添加函数名称
 * @param name 函数名称
 * @param callback  函数方法
 * @returns {FB.AddFun} 当前对象
 * @constructor
 */
FB.addFun = function (name, callback) {
    window[name] = callback;
    return this;
};
//屏蔽部分默认事件
FB.preventFun = function (e) {
    var evt = e || window.event;
    evt.preventDefault();
};
//阻止冒泡
FB.propagationFun = function (e) {
    var evt = e || window.event;
    evt.stopPropagation();
};
//改变窗口
FB.resizeFun = function (callback) {
    $(FB.win).resize(function () {
        var width = $(this).width();
        var height = $(this).height();
        if (callback) callback.call(this, width, height);
    }).trigger("resize");
};
/**
 * 给元素加样式
 * @param ele   动画元素
 * @param cls   样式名称
 */
FB.elementAddCls = function (ele, cls) {
    cls = cls || "active";
    return {
        show: function () {
            $(ele).addClass(cls);
        },
        hide: function () {
            $(ele).removeClass(cls);
        },
        toggle: function () {
            $(ele).toggleClass(cls);
        }
    }
};
/**
 * 滑动切换显示
 * @param ele   出发元素
 * @param tag   响应元素
 * @param animate   切换动画（可以是函数）
 */
FB.hoverShowFun = function (ele, tag, animate) {
    var _ele = !ele ? ".fn-hover-bar" : ele;
    var _tag = !tag ? ".fn-hover-menu" : tag;
    $(_ele).hover(function (e) {
        var $tag = $(this).find(_tag);
        FB.propagationFun(e);
        if (!animate) $tag.show();
        else {
            if (animate.show) animate.show.call($tag[0]);
            else $tag.show();
        }
    }, function (e) {
        var $tag = $(this).find(_tag);
        FB.propagationFun(e);
        if (!animate) $tag.hide();
        else {
            if (animate.hide) animate.hide.call($tag[0]);
            else $tag.hide();
        }
    });
};
/**
 * 数字=>字符串（格式化）
 * @param number    传入数字
 * @param n 精确到小数后几位
 * @param format    数字后跟随的标识，单一字符“,”，多处分割“["亿"，"万"，"元"]”
 * @param unit  单位
 */
FB.numberFormat = function (number, n, format, unit) {
    var data_num = "", split_l, million_l;
    var format_type = format || ",";
    //处理显示金额精度,去掉小数点,负号
    var num = parseFloat((number + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
    var new_num = num.toString().split("");
    //计算单位
    var units = unit || 1000;
    switch (units / 100) {
        case 1:     //百为单位
            split_l = 3;    //3位分割
            million_l = 7;    //亿万单位
            break;
        case 10:     //千为单位
            split_l = 4;    //4位分割
            million_l = 8;    //亿万单位
            break;
        case 100:   //万为单位
            split_l = 5;   //5位分割
            million_l = 9;    //亿万单位
            break;
        default :
            split_l = 4;
            million_l = 8;
            break;
    }
    //小于设定单位，直接返回金额
    if (new_num.length < split_l) {
        return num;
    }
    //循环处理之后的金额
    for (var i = 0; i < new_num.length; i++) {
        if (i == (new_num.length - million_l)) {
            data_num += new_num[i] + ((typeof format_type == "string") ? format_type :
                "<span class='format-type1'>" + format_type[0] + "</span>") + "";
        } else if (i == (new_num.length - split_l)) {
            data_num += new_num[i] + ((typeof format_type == "string") ? format_type :
                "<span class='format-type2'>" + format_type[1] + "</span>") + "";
        } else {
            data_num += new_num[i];
        }
        //批处理数据
        //data_num += new_num[i] + ((i + 1) % 3 == 0 && (i + 1) != new_num.length ? "," : "");
    }

    return data_num.split("").join("") + ((typeof format_type == "string") ? "" :
        "<span class='format-type3'>" + format_type[2] + "</span>");
};
/**
 * 滚动到元素
 * @param ele   可以省略-默认"html,body"
 * @param top
 * @param callback
 */
FB.scrollToElement = function (ele, top, callback) {
    if ((typeof ele).toString().toLocaleLowerCase() !== "string") {
        callback = arguments[1];
        top = arguments[0];
        ele = "html,body";
    }
    $(ele).animate({"scrollTop": top + "px"}, 300, function () {
        if (callback) callback.call(this);
    });
};
/**
 * 设置进度掉
 * @param options
 */
FB.progressBox = function (options) {
    var defOpt = {
        element: {
            container: ".progress-container",
            text: ".meter",
            runner: ".runner"
        },
        textMove: false,    //文字是否跟随移动
        number: "100",
        time: 1000
    };
    var option = $.extend({}, defOpt, options);
    var ele = option.element;
    var $progress = $(ele.container);
    var $text = $progress.find(ele.text);
    var $run = $progress.find(ele.runner);
    var _clear_timer_ = 0, num = 0;
    var time = option.time ? option.time : 0;
    var interval = time / 60;
    var that = this;
    clearInterval(_clear_timer_);
    $progress.addClass("running");
    var timeFun = function () {
        if (num <= parseInt(option.number)) {
            $text.html(num.toString() + (option.format ? option.format : "%"));
            $run.css("width", (100 - num) / 100 * 100 + "%");
            if (option.textMove) $text.css("right", (100 - num) / 100 * 100 + "%");
            num++;
            if (option.startFun) option.startFun.call(that, option);
        } else {
            clearInterval(_clear_timer_);
            $progress.addClass("end").removeClass("running");
            if (option.endFun) option.endFun.call(that, option);
        }
    };
    _clear_timer_ = setInterval(timeFun, interval);
};

