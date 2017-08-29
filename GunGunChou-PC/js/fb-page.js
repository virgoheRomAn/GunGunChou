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



