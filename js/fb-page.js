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



