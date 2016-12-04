
    $(function() {
        $(".tab_nav li").click(function() {
            $(this).addClass('current').siblings().removeClass("current")
        })
        $(".area li").click(function() {
            var index = $(this).index();
            $(".detail .main").eq(index).addClass("selected").siblings().removeClass("selected");
        })
        $(window).bind("scroll.gotop", function() {
            if ($(window).scrollTop() > 30) {
                $(".return").fadeIn('400').css("display", "block");
            } else {
                $(".return").fadeOut('400')
            }
        })
        $(".return").click(function() {
            $(document).scrollTop(0);
        });
    });

    /**  
     * 简单的Tab组件  
     * @param tabnav 导航元素数组  
     * @param tabcon  内容元素数组  
     */
    var Tabs = function(tabnav, tabcon) {
        this.tabnav = tabnav;
        this.tabcon = tabcon;
        this.init.apply(this, arguments);
    };
    Tabs.prototype = {
        init: function() {
            var _this = this;
            this.tabnav.each(function(i, oli) {
                $(oli).click(function() {
                    _this.tabnav.removeClass("current");
                    $(this).addClass("current");
                    _this.tabcon.css("display", "none");
                    _this.tabcon.eq(i).css("display", "block");
                })
            })
        }
    };
    var Page = function(config) {
        this.maxpage = config.maxpage || 5;
        this.containbox = $(config.containbox);
        this.dataclass = config.dataclass || "item";
        this.pagebox = $(config.pagebox);
        this.linum = $(this.dataclass, this.containbox).length;
        this.init.apply(this, arguments);
    }
    Page.prototype = {
        init: function() {

            this.pagebox.html("");
            var totalpage = this.linum / this.maxpage;
            //向上舍入，比如有8条数据，8除6是1点几，Math.ceil的作用是让它变成2  
            totalpage = Math.ceil(totalpage);
            //如果只有一页，那么没必要有这个分页的内容  
            if (totalpage <= 1) {
                return;
            }
            this.current = 1; //存储当前页  
            this.totalpage = totalpage; //存储总页数  
            var str = "";
            for (var i = 0; i < this.totalpage; i++) {
                var c = "";
                if (i == 0) {
                    c = " current";
                }
                str += '<a href="javascript:;" class="pagenum' + c + '">' + (i + 1) + '</a>';
            }
            str = '<a class="prebtn" href="javascript:;"><< 上一页</a>' + str + '<a class="nextbtn" href="javascript:;">下一页 >></a>';
            this.pagebox.html(str);
            this.pagenums = $(".pagenum", this.containbox);
            var _this = this;
            this.goPage(1);
            this.pagenums.each(function(i, npage) {
                $(npage).click(function() {
                    _this.goPage(this.innerHTML);
                });
            })
            $(".prebtn", this.containbox).click(function() {
                _this.goPrev(_this.current);
            });
            $(".nextbtn", this.containbox).click(function() {
                _this.goNext(_this.current);
            });
        },
        goPage: function(num) {
            this.current = num;
            this.pagenums.removeClass("current");
            this.pagenums.eq(num - 1).addClass("current");
            var dataobjs = $(this.dataclass, this.containbox);
            dataobjs.each(function(i, itemdata) {
                $(itemdata).css("display", "none");
            });
            for (var i = (num - 1) * this.maxpage; i < num * this.maxpage; i++) {
                if (i < this.linum) {
                    dataobjs.eq(i).css("display", "block");
                }
            }
        },
        goPrev: function(num) {
            if (num == 1) {
                return;
            }
            this.current--;
            this.goPage(this.current);
        },
        goNext: function(num) {
            if (num == this.totalpage) {
                return;
            }
            this.current++;
            this.goPage(this.current);
        }
    };
    (function() {
        //tab切换的代码  
        var tab = new Tabs($(".area li"), $(".shop_list"));
        //分页的代码  
        var page1 = new Page({
            containbox: "#content1",
            maxpage: "4",
            dataclass: ".item",
            pagebox: "#page1"
        });
        var page2 = new Page({
            containbox: "#content2",
            maxpage: "4",
            dataclass: ".item",
            pagebox: "#page2"
        });
        var page3 = new Page({
            containbox: "#content3",
            maxpage: "4",
            dataclass: ".item",
            pagebox: "#page3"
        });
        var page4 = new Page({
            containbox: "#content4",
            maxpage: "4",
            dataclass: ".item",
            pagebox: "#page4"
        });
        var page5 = new Page({
            containbox: "#content5",
            maxpage: "4",
            dataclass: ".item",
            pagebox: "#page5"
        });
        var page6 = new Page({
            containbox: "#content6",
            maxpage: "4",
            dataclass: ".item",
            pagebox: "#page6"
        });
    })();