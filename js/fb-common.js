//声明FB函数对象集合
var FB = window.Global = window.Global || {};
//声明FB集合属性
FB.verifyExp = {
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
FB.win = window;
/**
 * 验证form表单
 * @param val   输入验证的值
 */
FB.testForm = {
    /**
     * 验证手机号
     * @param val
     * @returns {number}0-空，1-大于11位，2-验证通过，3-格式不对
     */
    phone: function (val) {
        var _val = val;
        var _length = _val.length;
        if (_length == 0) return 0;
        if (_length > 11) return 1;
        if (eval(FB.verifyExp.telephone).test(_val)) {
            return 2;
        } else {
            return 3;
        }
    },
    /**
     * 验证密码
     * @param val
     * @param options 设置错误文本
     * @returns {object}
     */
    password: function (val, options) {
        var defaults = {
            isSimple: true,    //开启简单密码检验
            isCaps: true,  //开启键盘大写验证
            isShift: false,   //开启Shift按键验证
            showTag: true, //开启小tag提示
            minLength: 6,
            simpleLength: 6,
            strongLength: 12,
            nullText: "密码不能为空！",
            lengthLess: "密码不能小于6位！",
            successText: "设置密码成功！",
            capsText: "注意：键盘大写锁定已打开，请注意大小写！",
            shiftText: "注意：您按住了Shift键",
            psdSimple: "密码太简单，有被盗风险，请换复杂的密码组合！"
        };
        var opt = $.extend({}, defaults, options);
        var l = val.toString().length;
        var resultOPT = {};
        if (l == 0) {
            resultOPT.type = 0;
            resultOPT.text = opt.nullText;
        } else if (l < opt.minLength) {
            resultOPT.type = 0;
            resultOPT.text = opt.lengthLess;
        } else {
            if (eval(FB.verifyExp.strengthA.number).test(val) || eval(FB.verifyExp.strengthA.letterCaps).test(val) || eval(FB.verifyExp.strengthA.letterLows).test(val) || eval(FB.verifyExp.strengthA.symbol).test(val)) {
                //弱
                if (!opt.isSimple) {
                    resultOPT.type = 1;
                    resultOPT.text = opt.successText;
                } else {
                    //等于简单长度
                    if (l == opt.simpleLength) {
                        resultOPT.type = 0;
                        resultOPT.text = opt.psdSimple;
                    } else {
                        resultOPT.type = 1;
                        resultOPT.text = opt.successText;
                    }
                }
            } else if (eval(FB.verifyExp.strengthB.numLetterA).test(val) || eval(FB.verifyExp.strengthB.numLetterB).test(val) || eval(FB.verifyExp.strengthB.numSymbol).test(val) || eval(FB.verifyExp.strengthB.LetterALetterB).test(val) || eval(FB.verifyExp.strengthB.LetterASymbol).test(val) || eval(FB.verifyExp.strengthB.LetterBSymbol).test(val)) {
                if (l == opt.strongLength) {
                    //强
                    resultOPT.type = 3;
                    resultOPT.text = opt.successText;
                } else {
                    //中
                    resultOPT.type = 2;
                    resultOPT.text = opt.successText;
                }
            } else {
                //强
                resultOPT.type = 3;
                resultOPT.text = opt.successText;
            }
        }
        //回调
        resultOPT.options = opt;
        return resultOPT;
    }
};
//修复PlaceHolder
FB.JPlaceHolder = {
    //检测
    _check: function () {
        return 'placeholder' in document.createElement('input');
    },
    //初始化
    init: function () {
        if (!this._check()) {
            this.fix();
        }
    },
    //修复
    fix: function () {
        jQuery(':input[placeholder]').each(function (index, element) {
            var self = $(this), txt = self.attr('placeholder');
            self.wrap($('<div></div>').css({
                position: 'relative',
                zoom: '1',
                border: 'none',
                background: 'none',
                padding: 'none',
                margin: 'none'
            }));
            var pos = self.position(), h = self.outerHeight(true), paddingleft = self.css('padding-left');
            var holder = $('<span></span>').text(txt).css({
                position: 'absolute',
                left: pos.left,
                top: pos.top,
                height: h,
                lienHeight: h,
                paddingLeft: paddingleft,
                color: '#aaa'
            }).appendTo(self.parent());
            self.focusin(function (e) {
                holder.hide();
            }).focusout(function (e) {
                if (!self.val()) {
                    holder.show();
                }
            });
            holder.click(function (e) {
                holder.hide();
                self.focus();
            });
        });
    }
};
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
 * @param split     是否批量切割
 * @param unit  单位
 */
FB.numberFormat = function (number, n, format, unit, split) {
    var data_num = "", split_l, million_l;
    var format_type = format || ",";
    //计算单位
    var units = unit || 10000;
    var splits = Boolean(split) || true;
    //处理显示金额精度,去掉小数点,负号
    var num = parseFloat((number + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
    var new_num = splits ? num.toString().split("").reverse() : num.toString().split("");

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
    // if (new_num.length < split_l) {
    //     return num;
    // }
    //循环处理之后的金额
    for (var i = 0; i < new_num.length; i++) {
        if (!splits) {
            if (i == (new_num.length - million_l)) {
                data_num += new_num[i] + ((typeof format_type == "string") ? format_type :
                    "<span class='format-type1'>" + format_type[0] + "</span>") + "";
            } else if (i == (new_num.length - split_l)) {
                data_num += new_num[i] + ((typeof format_type == "string") ? format_type :
                    "<span class='format-type2'>" + format_type[1] + "</span>") + "";
            } else {
                data_num += new_num[i];
            }
        } else {
            //批处理数据
            data_num += new_num[i] + ((i + 1) % 3 == 0 && (i + 1) != new_num.length ? "," : "");
        }
    }

    return splits ? data_num.split("").reverse().join("") : data_num.split("").join("")+((typeof format_type == "string") ? "" :
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
/**
 * 补零
 * @param num 补零的数字
 * @param n 补零的位数
 * @returns {num}   补零之后的字符
 */
FB.padZero = function (num, n) {
    var len = num.toString().length;
    while (len < n) {
        num = "0" + num;
        len++;
    }
    return num;
};
/**
 *  显示倒计时
 * @param dom   显示文字的元素
 * @param time   倒计时时间
 * @param finishFun   结束回调
 * @param countFun   倒计时回调
 */
var _countDown_timer_ = 0;
FB.countDown = function (dom, time, format, finishFun, countFun) {
    clearInterval(_countDown_timer_);
    var that = this;
    var _times = !time ? 120 : time;
    var $this = $(dom);
    $this.text(FB.padZero(_times, 2) + format[1]).addClass("active");
    _countDown_timer_ = setInterval(function () {
        countFun && countFun.call(dom, _times);
        _times--;
        if (_times == 0) {
            $this.text(format[0]).removeClass("active");
            clearInterval(_countDown_timer_);
            finishFun && finishFun.call($this);
        } else {
            $this.text(FB.padZero(_times, 2) + format[1]).addClass("active");
        }
    }, 1000);

    that.stopTimeFun = function () {
        clearInterval(_countDown_timer_);
        $this.text(format[0]).removeClass("active");
        finishFun && finishFun.call($this);
    }
};
/**
 * 倒计时(包含天)
 * @param tags   目标
 * @param time
 * @param Fun
 */
FB.dayTimeDown = function (tags, time, Fun) {
    var boxEle, dayEle, hourEle, minEle, secEle, loadEle;
    if ((typeof tags) == "string" || $(tags).data("time")) {
        boxEle = $(tags);
        dayEle = ".time-day";
        hourEle = ".time-hour";
        minEle = ".time-minute";
        secEle = ".time-second";
        loadEle = ".loading";
    } else {
        boxEle = $(tags.boxEle);
        dayEle = tags.dayEle;
        hourEle = tags.hourEle;
        minEle = tags.minEle;
        secEle = tags.secEle;
        loadEle = tags.loadEle;
    }

    var dayFormat = (dayEle ? (boxEle.find(dayEle).data("format") ? boxEle.find(dayEle).data("format") : "") : "");
    var hourFormat = (hourEle ? (boxEle.find(hourEle).data("format") ? boxEle.find(hourEle).data("format") : "") : "");
    var minFormat = (minEle ? (boxEle.find(minEle).data("format") ? boxEle.find(minEle).data("format") : "") : "");
    var secFormat = (secEle ? (boxEle.find(secEle).data("format") ? boxEle.find(secEle).data("format") : "") : "");

    var countTime = 0;
    if (time) {
        if ((typeof time) == "number") {
            countTime = time / 1000;
        } else {
            countTime = parseInt((new Date("" + time + "") - new Date()) / 1000);
        }
    } else {
        countTime = parseInt((new Date("" + boxEle.data("time") + "") - new Date()) / 1000);
    }
    var int_day, int_hour, int_minute, int_second;
    var _time;

    boxEle.find(loadEle).show();

    _time = setInterval(function () {
        if (boxEle.find(loadEle).css("display") != "none") {
            boxEle.find(loadEle).hide();
        }
        countTime--;
        if (countTime > 0) {
            int_day = Math.floor(countTime / 60 / 60 / 24);
            int_hour = Math.floor(countTime / (60 * 60));
            int_minute = Math.floor(countTime / 60) - (int_hour * 60);
            int_second = Math.floor(countTime) - (int_hour * 60 * 60) - (int_minute * 60);
        } else {
            int_day = 0;
            int_hour = 0;
            int_minute = 0;
            int_second = 0;
            if (Fun) Fun.call(boxEle[0]);
            clearInterval(_time);
        }
        if (dayEle) boxEle.find(dayEle).html(FB.padZero(int_day, 2) + "<em>" + dayFormat + "</em>");
        if (hourEle) boxEle.find(hourEle).html(FB.padZero(int_hour % 24, 2) + "<em>" + hourFormat + "</em>");
        if (minEle) boxEle.find(minEle).html(FB.padZero(int_minute, 2) + "<em>" + minFormat + "</em>");
        if (secEle) boxEle.find(secEle).html(FB.padZero(int_second, 2) + "<em>" + secFormat + "</em>");
    }, 1000);
    return _time;
};
/**
 * 滑块
 * @param ele
 * @param options
 */
FB.slideBox = function (ele, options) {
    var defaults = {
        value: 50,
        min: 100,
        max: 9999999,
        start: null,
        slide: null,
        end: null,
        change: null
    };
    var that = this;
    var $ele = ele ? $(ele) : $(".fb-slide-box");
    var opt = $.extend({}, defaults, options);
    var $box = $ele.find(".slide-box"),
        $btn = $ele.find(".btn"),
        $move = $ele.find(".moved");

    var min = parseInt(opt.min);
    var max = parseInt(opt.max);
    var width = $box.width();
    var height = $box.height();
    var offset = $box.find(".cont").offset();
    var left = eleOffset($box.find(".cont")).left;
    var top = eleOffset($box.find(".cont")).top;

    function eleOffset(ele) {
        return {
            top: ele.offset().top,
            left: ele.offset().left
        }
    }

    var _is_move = false;

    $btn.on("mousedown", function (e) {
        console.log(0);
        e = e || window.event;
        e.stopPropagation();
        e.preventDefault();
        that.sx = e.clientX || e.pageX;
        that.sy = e.clientY || e.pageY;
        that.top = parseFloat($(this).css("top"));
        that.left = parseFloat($(this).css("left"));
        if (!_is_move) {
            _is_move = true;
            $(document).on("mousemove", {opt: opt}, moving);
            $(document).on("mouseup", {opt: opt}, endMove);
        }
    });

    function moving(e) {
        e = e || window.event;
        e.stopPropagation();
        e.preventDefault();
        var x = e.clientX || e.pageX;
        var y = e.clientY || e.pageY;
        if (_is_move) {
            var mx = x - that.sx + that.left;
            var my = y - that.sy + that.top;
            var _left = eleOffset($btn).left;
            var _top = eleOffset($btn).top;
            var ratio = mx / width;
            console.log(ratio, (_left - left) / width);
            if (ratio >= 0 && ratio <= 1) {
                $btn.css({"left": ratio * 100 + "%"});
                $move.width(ratio * 100 + "%");
            }
        }
    }

    function endMove() {
        _is_move = false;
        $(document).off("mousemove", moving);
        $(document).off("mouseup", endMove);
    }
};

