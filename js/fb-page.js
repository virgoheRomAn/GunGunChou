//自动执行滚动到顶部
(function (ele) {
    $(ele).click(function () {
        FB.scrollToElement(0);
    });
})(".go-top");
//浮动菜单显示位置
FB.resizeFun(function (w) {
    var $fl_nav = $(".in-float-nav");
    if (w < 1400) {
        $fl_nav.css("margin-right", -w / 2 + 20 + "px");
    }
});
//滑动显示内容
FB.hoverShowFun();
//修复PlaceHolder
FB.JPlaceHolder.init();

//实例化sliderBox
function newSliderBox(ele, type, opt) {
    var opts = $.extend({}, opt, opts);
    $(ele).sliderBox(type, opts);
}

//设置滚动条
function setProgress(ele) {
    ele.each(function () {
        var that = this;
        FB.progressBox({
            element: {
                container: that,
                text: $(that).find(".meter"),
                runner: $(that).find(".runner")
            },
            number: $(that).find(".meter").text().split("%")[0],
            time: 1000
        });
    });
}

//表单按钮组
function formChecked(ele) {
    var _ele = ele || ".fb-radio-box";
    $(_ele).on("click", function (e) {
        e.stopPropagation();
        var type = $(this).find("input").prop("type");
        switch (type) {
            case "radio":
                if ($(this).hasClass(_ele.split(".")[1])) {
                    var name = $(this).find("input").attr("name");
                    $("input[name='" + name + "']").prop("checked", false).parents(_ele).removeClass("active");
                    $(this).addClass("active").find("input").prop("checked", false);
                } else {
                    var $input = $(this).find("input");
                    var $name = $input.attr("name");
                    $("input[name='" + $name + "']").prop("checked", false).parents(_ele).removeClass("active");
                    $input.prop("checked", true).parents(".fb-radio").addClass("active");
                }
                break;
            case "checkbox":
                var that = this;
                $(that).toggleClass("active");
                if ($(that).hasClass("active")) {
                    $(that).find("input").prop("checked", true);
                } else {
                    $(that).find("input").prop("checked", false);
                }
                break;
        }
    });

    $(_ele).find("span").click(function (e) {
        e.stopPropagation();
    });
}

//验证密码
function verifyPwd(ele, sureEle) {
    var opt = {}, _caps = false;
    var val = $(ele).val(), psdType;
    var $box = $(ele).parents(".item>label:eq(0)"),
        $psdType = $(".password-type>.type");
    var tips = "<div class='form-tips'></div>",
        pwdTip = "<div class='form-tips-pwd'></div>";
    $box.after(tips + pwdTip);
    var $tip = $(".form-tips"),
        $pwdTip = $(".form-tips-pwd");

    if(sureEle){
        $(sureEle).parents(".item>label:eq(0)").after(tips);
    }
    //验证密码
    $(ele).blur(function () {
        val = $(this).val();
        psdType = FB.testForm.password(val);
        if (!psdType.type) {
            $tip.addClass("error").empty().html("<label><b class='fb-arrow-dir top'></b>" + psdType.text + "</label>");
        } else {
            $tip.removeClass("error").empty();
        }
    }).focus(function () {
        $tip.empty();
        val = $(this).val();
        psdType = FB.testForm.password(val, {isShift: true});
        opt = psdType.options;
        if (_caps) {
            $pwdTip.empty().html("<label><b class='fb-arrow-dir left'></b>" + opt.capsText + "</label>");
        } else {
            $pwdTip.empty();
        }
    }).keyup(function () {
        val = $(this).val();
        psdType = FB.testForm.password(val);
        if (psdType.type == 1) {
            $psdType.attr("class", "type type-r");
        } else if (psdType.type == 2) {
            $psdType.attr("class", "type type-z");
        } else if (psdType.type == 3) {
            $psdType.attr("class", "type type-q");
        } else {
            $psdType.attr("class", "type text");
        }
    }).keypress(function (e) {
        var evt = e || window.event;
        var keyCode = evt.keyCode || evt.which;
        var isShift = opt.isShift ? (evt.shiftKey || keyCode == 16 ) : false;
        evt.stopPropagation();
        if (((keyCode >= 65 && keyCode <= 90) && !isShift) || ((keyCode >= 97 && keyCode <= 122) && isShift)) {
            $pwdTip.empty().html("<label><b class='fb-arrow-dir left'></b>" + opt.capsText + "</label>");
            _caps = true;
        } else if (keyCode >= 97 && keyCode <= 122) {
            $pwdTip.empty();
            _caps = false;
        }
    }).keydown(function (e) {
        var evt = e || window.event;
        var keyCode = evt.keyCode || evt.which;
        evt.stopPropagation();
        if (keyCode == 20) {
            if (!_caps) {
                $pwdTip.empty().html("<label><b class='fb-arrow-dir left'></b>" + opt.capsText + "</label>");
                _caps = true;
            } else {
                $pwdTip.empty();
                _caps = false;
            }
        }
    });

    //确认密码
    if (sureEle) {
        $(sureEle).blur(function () {
            val = $(this).val();
            var pwdVal = $(ele).val();
            if (val !== pwdVal) {
                $(sureEle).addClass("error").parents(".item").find(".form-tips").empty().html("<label><b class='fb-arrow-dir top'></b>两次密码不一致</label>");
            }else{
                $(sureEle).removeClass("error").parents(".item").find(".form-tips").empty()
            }
        }).focus(function () {
            $(sureEle).removeClass("error").parents(".item").find(".form-tips").empty();
        });
    }

    //判断大写按键
    $(document).keydown(function (e) {
        var evt = e || window.event;
        var keyCode = evt.keyCode || evt.which;
        evt.stopPropagation();
        _caps = keyCode == 20;
    });
}

//清除文字
function clearText(tag, clearBox, type) {
    $(tag).click(function () {
        if (clearBox[0].nodeName.toLowerCase() == "input" || clearBox[0].nodeName.toLowerCase() == "textarea") {
            clearBox.val("");
        } else {
            clearBox.html("");
        }
        if (!type) {
            clearBox.keyup();
            clearBox.blur();
            $(this).hide();
        }

    });
    if (!type) {
        $(tag)[0].onmousedown = function (e) {
            var event = e || window.event;
            event.preventDefault()
        }
    }
}

//添加提示文字
$(".fb-tips").each(function () {
    var _tips = $(this).find("span");
    _tips.text(_tips.data("text"));
});
//弹出提示QQ
$(".app-qq-bar").click(function () {
    var intro = "<div class='select-s-qq'>";
    intro += "<a href='javascript:;'><i class='fb-sprite icon-s-qq'></i>lucy</a>";
    intro += "<a href='javascript:;'><i class='fb-sprite icon-s-qq'></i>Lily</a>";
    intro += "<a href='javascript:;'><i class='fb-sprite icon-s-qq'></i>Andy</a>";
    intro += "</div>";
    var title = "选择在线咨询客服";
    $.jBox.confirm(intro, {
        title: title,
        hasClose: true
    });
});



