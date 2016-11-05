/**
* 券妈妈公共扩展
*
* @author  quanmama
* @url     http://www.quanmama.com/
* @name    common.js
* @since   2011-12-7 21:34:45
*/
if (!Array.indexOf) {
    Array.prototype.indexOf = function (obj) {
        for (var i = 0; i < this.length; i++) {
            if (this[i] == obj) {
                return i;
            }
        }
        return -1;
    }
}

function delayMouseover(jQueryDom, fn) {
    jQueryDom.on("aj-delay-mouseover", {
        'attr': 'aj-mouseenter-timestamp'
    }, function (e, fn) {
        var attr = e.data.attr;
        $(this).on('mouseenter mouseleave', function (e) {
            if (e.type === 'mouseenter') {
                $(this).attr(attr, +new Date());
            } else if (e.type === 'mouseleave') {
                $(this).removeAttr(attr);
            }
        });
        $(this).on('mouseover', function () {
            var that = this;
            setTimeout(function () {
                if ($(that).attr(attr)) {
                    fn(that);
                }
            }, 300);
        });
    });
    jQueryDom.trigger("aj-delay-mouseover", fn);
}

Youhui.common = {
    confirm: function (msg, url) {
        if (arguments.length == 1) {
            url = msg;
            msg = '真的要删除吗？';
        }
        Youhui.dialog.confirm(msg, {
            yes: function () {
                if (url.constructor == String) {
                    location.href = url;
                } else if (url.constructor == Function) {
                    url();
                }
            }
        });
        return false;
    },
    errorAnimation: function (obj) {
        obj.stop(false, true).focus();
        var _o_bgcolor = obj.css("backgroundColor");
        obj.css({
            backgroundColor: "#FFC8C8"
        }).animate({
            backgroundColor: _o_bgcolor
        }, 1000);
        return false;
    },
    slide: function (top) { //滚动到指定位置或顶部高度
        top = typeof top != "undefined" ? (typeof top == 'object' ? top.offset().top : top) : 0;
        $('html,body').animate({
            scrollTop: top
        }, 0);
    },
    tips: function (text, left, top, arrow, loc, obj, closefunc) {
        var id = left + '_' + top + '_' + arrow + '_' + loc;
        if (Youhui.tools.cookie('close_' + id) != 1) {
            var c = '<div id="tips_' + id + '" class="newtips" style="top: ' + top + 'px; left: ' + left + 'px; ">';
            c = c + '<div class="tipcontainer" style="opacity: 1; ">';
            c = arrow == 'up' ? c + '<span class="arrowup" style="margin-left: ' + loc + 'px; "></span>' : c;
            c = c + '<div class="t_container"><div class="tcc"><div class="t_content">';
            c = c + '<div class="tipsicon "><span class="tipsico tipsico_normal"></span></div>';
            c = c + '<div class="tipstxt"><span class="black">' + text + '</span></div>';
            c = c + '<div class="tipsrightpanel"><div class="opertbar"><a class="" id="close_' + id + '" href="javascript:;">我知道了</a></div></div>';
            c = c + '<div class="clear"></div>';
            c = c + '</div></div></div>';
            c = arrow == 'down' ? c + '<span class="arrowdown" style="display:none; margin-left: ' + loc + 'px; "></span>' : c;
            c = c + '</div></div>';

            $(c).appendTo((obj != undefined && obj != '' ? obj : document.body));
            $("#close_" + id).click(function () {
                //关闭层和写Cookie
                $("#tips_" + id).fadeOut();
                Youhui.tools.cookie('close_' + id, 1, {
                    path: '/',
                    expires: 86400
                });
                if (closefunc != undefined) {
                    closefunc();
                }
            });
        }
    }, //tips end

    user: {
        checklogin: function () {
            if (Youhui.common.user.info.userid == '') {
                var d = dialog({
                    title: '请先登录',
                    content: '<div style="padding:10px 30px;"><div class="d_content"><div class="gray connect_site clear" ><b>请您使用QQ或微博登录券妈妈</b><br /><br />' + $("#userweibo").html() + '&nbsp;&nbsp;</div></div></div>'
                });
                d.showModal();

                return false;
            }
            return true;
        },
        relogin: function () {
            if (Youhui.common.user.info.userid == '') {
                var d = dialog({
                    title: '请先登录',
                    content: '<div style="padding:10px 30px;"><div class="d_content"><div class="gray connect_site clear" ><b>请您使用QQ或微博登录券妈妈</b><br /><br />' + $("#userweibo").html() + '&nbsp;&nbsp;</div></div></div>'
                });
                d.showModal();

                return false;
            }
            return true;
        },
        login: function () {
            if (Youhui.common.user.info.userid == '') {
                var d = dialog({
                    title: '请先登录',
                    content: '<div style="padding:10px 30px;"><div class="d_content"><div class="gray connect_site clear" ><b>请您使用QQ或微博登录券妈妈</b><br /><br />' + $("#userweibo").html() + '&nbsp;&nbsp;</div></div></div>'
                });
                d.showModal();

                return false;
            }
            return true;
        }
    }, //user end


    marquee: {
        init: function () {
            if ($('.sidebar_f').length > 0) {
                $(".sidebar_f").each(function () {
                    var obj = $(this);
                    var options = {};
                    options.isMarquee = Boolean(parseInt(obj.attr("is_marquee")));
                    var isEqual = obj.attr("is_equal");
                    options.loop = parseInt(obj.attr("loop"));
                    options.isAuto = Boolean(parseInt(obj.attr("is_auto")));

                    options.time = parseInt(obj.attr("time"));
                    options.duration = parseInt(obj.attr("duration"));
                    options.direction = obj.attr("direction");
                    var scrollAmount = obj.attr("scroll_amount");
                    var scrollDelay = obj.attr("scroll_delay");
                    var eventNav = obj.attr("event_nav");
                    if (scrollAmount != '') options.scrollAmount = parseInt(scrollAmount);
                    if (scrollDelay != '') options.scrollDelay = parseInt(scrollDelay);
                    if (isEqual != '') options.isEqual = Boolean(isEqual);
                    if (eventNav != '') options.eventNav = eventNav;

                    obj.css("height", obj.attr("height") + "px");
                    $(".sidebar_f_c", obj).css("height", obj.attr("height") + "px");

                    if (Boolean(parseInt(obj.attr("is_image")))) {
                        options.distance = obj.attr("distance");
                        options.navId = "#" + $(".sidebar_f_m", obj).attr("id");
                    }
                    $('.sidebar_f_c', obj).kxbdSuperMarquee(options);
                });
            }
        }
    },

    error: {
        init: function (url, title) {
            var content = "<div id='test'><div class='d_content d_c_s'><ul class='clear'>";
            content += "<li><b>错误地址：</b><ins><input type='text' name='url' value='" + url + "' /></ins></li>";
            content += "<li><b>页面标题：</b><ins><input type='text' name='title' value='" + title + "' /></ins></li>";
            content += "<li><b>修正内容：</b><ins><textarea name='content'></textarea></ins></li></ul></div></div>";
            Youhui.dialog.layer("挑错误、举报", {
                content: content,
                mask: true,
                buttons: [{
                    title: '提交',
                    type: 'main',
                    close: false,
                    func: function () {
                        var title = this.pannel.find("input[name=title]");
                        var url = this.pannel.find("input[name=url]");
                        var content = this.pannel.find("textarea[name=content]");
                        if (url.val() == '') {
                            Youhui.common.errorAnimation(url);
                            return false;
                        }
                        if (title.val() == '') {
                            Youhui.common.errorAnimation(title);
                            return false;
                        }
                        if (Youhui.form.isInputNull(content)) {
                            Youhui.common.errorAnimation(content);
                            return false;
                        }
                        this.close();
                        var loading = Youhui.dialog.loading("正在提交...");
                        Youhui.api.post("senderror", {
                            url: url.val(),
                            title: title.val(),
                            content: content.val()
                        }, function (json) {
                            if (json.code > 0) {
                                loading.close();
                                Youhui.dialog.notice("提交成功！我们会及时处理您提交的信息！感谢您对券妈妈的支持！");
                            } else {
                                Youhui.dialog.notice(json.result, {
                                    className: "dialog_error"
                                });
                            }
                        });
                    }
                }, {
                    title: '取消',
                    type: 'cancel',
                    close: true
                }]
            });
        }
    },
    suggest: {
        init: function () {
            var content = "<div id='test'><div class='d_content d_c_s'><ul class='clear'>";
            content += "<li><b>您的姓名：</b><ins><input type='text' name='username' value='' /></ins></li>";
            content += "<li><b>电子邮箱：</b><ins><input type='text' value='' onclick=\"this.value='';\" name='email' /></ins></li>";
            content += "<li><b>内　　容：</b><ins><textarea name='content'></textarea></ins></li></ul></div></div>";
            Youhui.dialog.layer("咨询、建议、留言", {
                content: content,
                mask: true,
                buttons: [{
                    title: '提交',
                    type: 'main',
                    close: false,
                    func: function () {
                        var username = this.pannel.find("input[name=username]");
                        var email = this.pannel.find("input[name=email]");
                        var content = this.pannel.find("textarea[name=content]");
                        if (username.val() == '') return Youhui.common.errorAnimation(username);
                        if (email.val() == '') return Youhui.common.errorAnimation(email);
                        if (content.val() == '') return Youhui.common.errorAnimation(content);
                        this.close();
                        var loading = Youhui.dialog.loading("正在提交...");
                        Youhui.api.post("/ajax/sendsuggest.ashx", {
                            username: username.val(),
                            email: email.val(),
                            content: content.val()
                        }, function (json) {
                            if (json.code > 0) {
                                loading.close();
                                Youhui.dialog.notice("提交成功！感谢您对券妈妈的支持！");
                            } else {
                                Youhui.dialog.notice(json.result, {
                                    className: "dialog_error"
                                });
                            }
                        });
                    }
                }, {
                    title: '取消',
                    type: 'cancel',
                    close: true
                }]
            });
        }
    },
    search: {
        //搜索
        init: function () {
            var $search_input = $("#search_input");
            if ($search_input.length <= 0) return;

            if (window.location.href.indexOf("/zhisearch/") != -1 || window.location.href.indexOf("/zhidemai/") != -1
                || window.location.href.indexOf("/faxian") != -1 || window.location.href.indexOf("/haitao") != -1
                || window.location.href.indexOf("/jingyan/") != -1 || window.location.href.indexOf("/category") != -1
                || window.location.href.indexOf("/zixun/") != -1
                || window.location.href.indexOf("/haitaogonglue/") != -1
                || window.location.href.indexOf("zhi.quanmama.com") != -1
                || window.location.href.indexOf("faxian.quanmama.com") != -1) {

                $("#searchform").attr("action", "/zhisearch/");

                //给search输入框赋值
                $search_input.attr("pre", $(".searchtype_zdm").attr("keywords"));
                if ($search_input.val().length == 0) {
                    $search_input.val($(".searchtype_zdm").attr("keywords"));
                }

                //搜索模式切换
                var $this = $(".searchtype_zdm");
                var tmp = $this.clone();
                var pre = $this.prev();
                $this.remove();
                pre.removeClass("searchbox_tab-current").before(tmp.addClass("searchbox_tab-current"));


                $(".search_hot_zdm").show();
                $(".search_hot_coupon").hide();
            }
            else {
                $("#searchform").attr("action", "/search/");

                $search_input.attr("pre", $(".searchtype_coupon").attr("keywords"));
                if ($search_input.val().length == 0) {
                    $search_input.val($(".searchtype_coupon").attr("keywords"));
                }
            }

            //点击搜索框
            $search_input.on('click', function () {
                if ($(this).attr("pre") == $(this).val()) {
                    $(this).css("color", "#000000");
                    $(this).val('');
                }
            }).on("blur", function () {
                if ($(this).val() == '') {
                    $(this).css("color", "#cccccc");
                    $(this).val($(this).attr("pre"));
                }
            });

            //查找
            $("#search_button").click(function () {
                var k = $search_input;
                if (k.click().val() == '') {
                    Youhui.dialog.notice("关键字不能为空！");
                    k.focus();
                    return false;
                } /*else if (Youhui.tools.string.length(k.val()) < 2) {
                 Youhui.dialog.notice("关键字长度不能小于2个字符！");
                 return false;
                 } */
                else {
                    $("#searchform").submit();
                    return true;
                }
            });

            $(".search_container").on("mouseover", function () {
                $(".search_container").addClass("search_container-over");
            }).mouseout(function () {
                $(".search_container").removeClass("search_container-over");
            });

            $(".searchtype_coupon,.searchtype_zdm").on("click", function () {
                $this = $(this);
                if ($this.attr("rel") == "zdm") {
                    if ($this.hasClass("searchbox_tab-current")) {
                        return;
                    }

                    //从优惠券转换为zdm搜索
                    $("#searchform").attr("action", "/zhisearch/");

                    if ($search_input.attr("pre") == $search_input.val()) {
                        $search_input.val($this.attr("keywords"));
                    }

                    $search_input.attr("pre", $this.attr("keywords"));

                    var pre = $this.prev();

                    pre.removeClass("searchbox_tab-current").before($this.addClass("searchbox_tab-current"));

                    $(".search_hot_zdm").show();
                    $(".search_hot_coupon").hide();

                } else {
                    if ($this.hasClass("searchbox_tab-current")) {
                        return;
                    }

                    $("#searchform").attr("action", "/search/");

                    if ($search_input.attr("pre") == $search_input.val()) {
                        $search_input.val($this.attr("keywords"));
                    }

                    $search_input.attr("pre", $this.attr("keywords"));

                    var pre = $this.prev();

                    pre.removeClass("searchbox_tab-current").before($this.addClass("searchbox_tab-current"));

                    $(".search_hot_zdm").hide();
                    $(".search_hot_coupon").show();
                }

                $(".search_container").removeClass("search_container-over");
            });

            if ($search_input.val().length > 0 && $search_input.attr("pre") != $search_input.val()) {
                $search_input.css("color", "#000000");
            }
        }
    },
    trackOrder: {
        doTrack: function (site, trackUrl, style) {
            var cookieKey = "qmmtrack";
            if (trackUrl == '') return;

            var ck = unescape(Youhui.tools.cookie(cookieKey));
            if (ck.indexOf("," + site) == -1) {//

                Youhui.tools.cookie(cookieKey, ck + "," + site, {
                    path: '/',
                    domain: Youhui.CookieDomain
                    //expires: 1.0 / (24 * 6)//cookie只保存10分钟
                });

                if (style != 1) {
                    var trackIfm = document.createElement("iframe");
                    trackIfm.width = 0;
                    trackIfm.height = 0;
                    trackIfm.src = trackUrl;

                    try {
                        trackIfm.style = "display:none;";
                    } catch (ex) { }

                    try {
                        document.body.appendChild(trackIfm);
                    } catch (ex) {
                        try {
                            document.body.insertBefore(trackIfm, document.body.firstChild);
                        } catch (ex2) { }
                    }

                } else {
                    try {
                        //window.open(trackUrl, '_blank')
                    } catch (ex) {
                    }
                }
            } //if(ck!=1) end

        } //function end
    },
    postReview: {
        save: function (postSysNo) {
            if (!Youhui.common.user.checklogin()) return false;

            var reviewContent = $("#add-comment").val();

            if (reviewContent.length < 5) {
                $("#J-comment-tips").addClass("comment-tips-error").text("内容过于简单，请继续输入");
                return;
            }

            $("#J-comment-tips").removeClass("comment-tips-error").text(""); ;

            var loading = Youhui.dialog.loading("评论保存中...");

            Youhui.api.post("/ajax/SaveReview.ashx", {
                postSysNo: postSysNo,
                reviewContent: reviewContent
            }, function (json) {
                loading.close();
                if (json.code >= 1) {
                    //alert(json.msg);
                }
                else {
                    //alert(json.msg);
                }
            }, {
                async: true
            }); //post end
        } //save end
    },
    coupon: {
        //Ware exchage begin
        exchage: function (obj) {
            if (!Youhui.common.user.checklogin()) return false;
            var thisobj = $(obj);
            var id = thisobj.attr('i');
            if (id === undefined) {
                return false;
            }

            var url = thisobj.attr("url");
            var costPoint = parseInt(thisobj.attr("csp"));
            var userCurrentPoint = parseInt(thisobj.attr("ucp"));
            var storeName = thisobj.attr("sn");

            if (userCurrentPoint < costPoint) {
                var d = dialog({
                    title: '积分不够',
                    content: '<div><div class="d_content">对不起，您的积分似乎不太够哦！：(<div class="gray connect_site clear" style="width:330px;">   请参考<a href="http://zhi.quanmama.com/zhidemai/20595.html"><b>券妈妈积分帮助</b></a> </div></div></div>'
                });
                d.showModal();

            } else { //开始兑换
                var tips = "消耗您的会员积分：" + costPoint + "分<br />";
                var totalUser = parseInt(thisobj.attr("total"));
                var content = "<font color='#ff6600'>确定兑换当前礼品吗？<br/>需要消耗" + costPoint
                    + "个积分兑换当前礼品卡<br/></font><br/>领取该优惠券将会进行以下操作：<br /><font color='#ff6600'>" + tips + "</font>是否继续兑换？";

                var d = dialog({
                    title: '券妈妈兑换温馨提示',
                    content: content,
                    okValue: '确定',
                    ok: function () {
                        Youhui.common.coupon.waretrade(id, url, storeName);
                        return true;
                    },
                    cancelValue: '取消',
                    cancel: function () { }
                });
                d.showModal();

            }
            return false;

        }, //Ware exchage end

        //Ware waretrade begin
        waretrade: function (id, url, storeName) {
            //兑换礼品卡
            var loading = Youhui.dialog.loading("兑换中...");

            Youhui.api.post("/lipin/waretrade", {
                id: id
            }, function (json) {
                loading.close();
                if (json.code >= 1) {
                    var content = "<div id='test'><div class='d_content d_c_s'><ul class='clear' id='pullinfo'>";
                    if (json.code == 1 || json.code == 2) {
                        content += "<li><ins>" + "礼品卡编码(复制下面的礼品卡卡号，尽快去<a href=\"" + url + "\" target=\"_blank\">&nbsp;&nbsp;" + storeName + "</a>绑定哦：" + "</ins></li>";
                        content += "<li class='code' id='code_" + id + "'><font color=red><b>" + json.result + "</font></b></li><li class='code'>&nbsp;</li>";

                        content += "<li class='code'>您所兑换的礼品在券妈妈\"账号中心\"一直都可以查到：</li>";
                        content += "<li class='code'><a href=\"/user/coupons/\" target=\"_blank\">&nbsp;&nbsp;我的兑换</a></li>";

                    }
                    else if (json.code == 3) {
                        Youhui.common.user.relogin();
                        return false;
                    }
                    else {
                        content += "<li class='code' id='code_" + id + "'>" + json.result + "</li>";
                    }

                    content += "<li><ins><a href='" + url + "' id='go_shopping' target='_blank'><span>去商家购物</span></a>";

                    content += "</ins></li>";
                    content += "</ul></div></div>";

                    var d = dialog({
                        title: '恭喜你，礼品卡兑换领取成功！',
                        content: content
                    });

                    d.showModal();

                } else {
                    var d = dialog({
                        title: '错误提示',
                        content: json.result,
                        width: 400
                    });

                    d.showModal();
                }
            }, {
                async: true
            });
        },
        //Ware waretrade end

        //礼品卡领取接口
        lipinka_addToCart: function (obj) {

            var thisobj = $(obj);
            var id = thisobj.attr('i');

            //检查是否登录
            if (!Youhui.common.user.checklogin()) return false;

            if (id === undefined) {
                return false;
            }

            var vf = parseInt(thisobj.attr("vf"));

            if (vf >= 1) {
                var verifyCode = $("#verifycode").val();
                if (verifyCode == undefined || verifyCode == "") {
                    var d = dialog({
                        content: '为防止恶意领取，麻烦先输入验证码!',
                        quickClose: true
                    });
                    d.show(document.getElementById('verifycode'));

                    return false;
                }
            }
            var buycount = $("#buycount").val();

            var fee = parseFloat(thisobj.attr("fee")) * buycount;
            fee = fee.toFixed(2);

            var d = dialog({
                title: '购买礼品卡确认',
                content: "<div style='padding:15px 30px;'><font color='#ff6600'>确定购买礼品卡吗？<br/>需要支付" + fee + "元购买选择的礼品卡<br/></font></div>",
                okValue: '确定',
                ok: function () {

                    $('.lipinkaform').submit();

                    return true;
                },
                cancelValue: '取消',
                cancel: function () {
                }
            });
            d.showModal();

            return false;
        },

        //礼品卡订单接口
        submit_lipinka_order: function (obj, bool) {

            var thisobj = $(obj);
            var id = thisobj.attr('i');
            var paytype = thisobj.attr("paytype");
            //检查是否登录
            if (!Youhui.common.user.checklogin()) return false;

            if (id === undefined) {
                return false;
            }

            var vf = parseInt(thisobj.attr("vf"));

            if (vf >= 1) {
                var verifyCode = $("#verifycode").val();
                if (verifyCode == undefined || verifyCode == "") {
                    var d = dialog({
                        content: '为防止恶意领取，麻烦先输入验证码!',
                        quickClose: true
                    });
                    d.show(document.getElementById('verifycode'));

                    return false;
                }
            }

            var buycount = parseInt($("#buycount").val());

            if (!bool) {
                //领取优惠券
                buy();
            } else {
                var aj_dialog = dialog({
                    title: '购买礼品卡确认',
                    content: "<div style='padding:15px 30px;'><font color='#ff6600'>确定购买礼品卡吗？</div>",
                    okValue: '确定',
                    ok: function () {
                        buy();
                        return true;
                    },
                    cancelValue: '取消',
                    cancel: function () {
                    }
                });
                aj_dialog.showModal();
            }

            function buy() {
                var drawing_dialog = dialog({
                    title: '券妈妈正在为您提交订单....',
                    content: "亲,请耐心等待,券妈妈正在为您提交订单..."
                });
                drawing_dialog.show();

                var verifyCode = $("#verifycode").val();

                Youhui.api.post("/order/maika", {
                    id: id,
                    buycount: buycount,
                    verifyCode: verifyCode,
                    paytype: paytype
                }, function (json) {

                    drawing_dialog.close().remove();
                    if (json.code >= 1) {
                        window.location.href = "/order/pay?orderid=" + json.result;
                    } else {
                        var d = dialog({
                            title: '礼品卡订单提交失败提示',
                            content: json.result,
                            width: 400
                        });

                        d.showModal();
                    }

                }, {
                    async: true
                });
            }
            return false;
        },

        changeCaptcha: function () {
            var id = Math.random() * 100000;
            $("#captcha").attr("src", "/t/captcha.aspx?id=" + id);
        },
        // Coupon draw
        lingquan: function (obj) {

            var thisobj = $(obj);

            var id = thisobj.attr('i');

            var redir = parseInt(thisobj.attr("redir"));


            var weixin_follow = thisobj.attr("weixin_follow");

            //收录券直接跳转,无需强制用户登录
            if (redir == 1) {
                // $('.lingquanform').submit();
                Youhui.api.post("/quan/linkpull", {
                    id: id,
                    buycount: 1,
                    verifyCode: ''
                }, function (json) { });

                return true;
            }

            //检查是否登录
            if (!Youhui.common.user.checklogin()) return false;

            if (id === undefined) {
                return false;
            }

            var vf = parseInt(thisobj.attr("vf"));

            if (vf >= 1) {
                var verifyCode = $("#verifycode").val();
                if (verifyCode == undefined || verifyCode == "") {
                    var d = dialog({
                        content: '为防止恶意领取，麻烦先输入验证码!',
                        quickClose: true
                    });
                    d.show(document.getElementById('verifycode'));

                    return false;
                }
            }

            var url = thisobj.attr("href");
            var score = parseInt(thisobj.attr("s"));
            var fee = parseFloat(thisobj.attr("fee"));
            var totalUser = parseInt(thisobj.attr("total"));
            var code = 0;
            var tips = '';
            var stop = false;
            var buycount = 1;


            if (score > 0) {
                tips += "消耗您的会员积分：" + score + "分<br />";
            }
            // if (Youhui.common.user.info.sina == 1) {
            //    tips += "关注券妈妈官方微博<br />"; //与您的新浪微博好友分享并
            // }

            if (tips == '') {
                if (fee > 0.01) {

                    var d = dialog({
                        title: '券妈妈购买优惠券确认',
                        content: "<div style='padding:15px 30px;'><font color='#ff6600'>确定购买该优惠券吗？<br/>需要支付" + fee + "元购买该优惠券<br/></font></div>",
                        okValue: '确定',
                        ok: function () {
                            Youhui.common.coupon.lingquan2(id, url, buycount);
                            return true;
                        },
                        cancelValue: '取消',
                        cancel: function () { }
                    });
                    d.showModal();
                } else {
                    if (weixin_follow == "1") {
                        Youhui.common.coupon.lingquan2(id, url, buycount);
                        return true;
                    }
                    else {

                        var d = dialog({
                            title: '券妈妈领取优惠券确认',
                            content: "<div style='padding:15px 30px;'><font color='#ff6600'>确定领取该优惠券吗？<br/></font></div>",
                            okValue: '确定',
                            ok: function () {
                                Youhui.common.coupon.lingquan2(id, url, buycount);
                                return true;
                            },
                            cancelValue: '取消',
                            cancel: function () { }
                        });
                        d.showModal();
                    }

                }
            } else {
                if (fee > 0.01) {
                    var d = dialog({
                        title: '券妈妈购买优惠券确认',
                        content: "<div style='padding:15px 30px;'><font color='#ff6600'>确定购买该优惠券吗？<br/>需要支付" + fee + "元购买该优惠券<br/></font><br/>领取该优惠券将会进行以下操作：<br /><font color='#ff6600'>" + tips + "</font>是否继续领取？</div>",
                        okValue: '确定',
                        ok: function () {
                            Youhui.common.coupon.lingquan2(id, url, buycount);
                            return true;
                        },
                        cancelValue: '取消',
                        cancel: function () { }
                    });
                    d.showModal();
                } else {

                    var d = dialog({
                        title: '券妈妈领取优惠券确认',
                        content: "<div style='padding:15px 30px;'>领取该优惠券将会进行以下操作<br /><font color='#ff6600'>" + tips + "</font>是否继续领取？</div>",
                        okValue: '确定',
                        ok: function () {
                            Youhui.common.coupon.lingquan2(id, url, buycount);
                            return true;
                        },
                        cancelValue: '取消',
                        cancel: function () { }
                    });

                    d.showModal();

                }
            }
            return false;
        }, // coupon draw

        lingquan2: function (id, url, buycount) {
            //领取优惠券
            var drawing_dialog = dialog({
                title: '券妈妈正在为您提取券....',
                content: "亲,请耐心等待,券妈妈正在为您提取优惠券..."
            });
            drawing_dialog.show();

            var verifyCode = $("#verifycode").val();

            Youhui.api.post("/quan/pull", {
                id: id,
                buycount: buycount,
                verifyCode: verifyCode
            }, function (json) {
                Youhui.common.coupon.changeCaptcha();

                drawing_dialog.close().remove();
                //$("#pull").removeClass("pulling");
                if (json.code >= 1) {
                    var content = "<div id='test'><div class='d_content d_c_s'><form method='post' target='_blank' action='" + url + "'><ul class='clear' id='pullinfo'>";
                    if (json.code == 1 || json.code == 2) {
                        content += "<li><ins>" + "优惠券代码(复制下面代码去使用,注意前后不要有多余空格哦)：" + "</ins></li>";
                        content += "<li class='code' id='code_" + id + "'><font color=red><b>" + json.result + "</font></b></li><li class='code'>&nbsp;</li>";

                        content += "<li class='code'>您所领取的优惠券在券妈妈\"账号中心\"一直都可以查到：</li>";
                        content += "<li class='code'><a href=\"/user/coupons/\" target=\"_blank\">&nbsp;&nbsp;我领取的优惠券</a></li>";

                        var shiyongLink = $("#couponShiyongLink");
                        if (shiyongLink.length > 0) {
                            content += "<li class='code'>&nbsp;</li>";
                            content += "<li class='code'>领取的优惠券如何使用：</li>";
                            content += "<li class='code'>" + shiyongLink.html() + "</li>";
                        }
                    }
                    else if (json.code == 3) {
                        Youhui.common.user.relogin();
                        return false;
                    }
                    else {
                        content += "<li class='code' id='code_" + id + "'>" + json.result + "</li>";
                    }

                    //content += json.result.info.password!= null && json.result.info.password!='' ? "<li class='code' id='pwd_"+id+"'><s id='pwd_i_"+id+"'>密码：<i>"+json.result.info.password+"</i></s><u>点击复制</u></li>" : '';

                    content += "<li><ins><a href='" + url + "' id='go_shopping' target='_blank'><span>去商家购物</span></a>";

                    //content += json.result.subscribe.state!= null && json.result.subscribe.state==0 ? "<a href='javascript:;' class='subscribe' title='订阅《"+json.result.subscribe.shop_name+"》后，将会收到"+json.result.subscribe.shop_name+"的最新优惠券、打折促销信息' style='margin-top:10px;' rel='"+json.result.subscribe.shop_id+"'>订阅该商家</a>" : '';

                    content += "</ins></li>";
                    content += "<li>&nbsp;</li>";
                    content += "<li>关注下面<strong>券妈妈微信号</strong>，以后随时随地免费领取优惠券哦：</li>";
                    content += "<li><img style='width:100px;height:100px;' src='http://www.quanmama.com/AdminImageUpload/265824weixin_%E5%89%AF%E6%9C%AC.jpg'/></li>";
                    content += "</ul></form></div></div>";

                    //alert(content);

                    var d = dialog({
                        title: '恭喜你，已经成功领取优惠券！',
                        content: content
                    });

                    d.showModal();
                } else {
                    var d = dialog({
                        title: '领券失败提示',
                        content: json.result,
                        width: 400
                    });

                    d.showModal();
                }
            }, {
                async: true
            });
        },

        // Coupon draw
        draw: function (obj) {

            var thisobj = $(obj);

            var id = thisobj.attr('i');

            var redir = parseInt(thisobj.attr("redir"));


            var weixin_follow = thisobj.attr("weixin_follow");

            //收录券直接跳转,无需强制用户登录
            if (redir == 1) {
                // $('.lingquanform').submit();
                Youhui.api.post("/coupon/linkpull", {
                    id: id,
                    buycount: 1,
                    verifyCode: ''
                }, function (json) { });

                return true;
            }

            //检查是否登录
            if (!Youhui.common.user.checklogin()) return false;

            if (id === undefined) {
                return false;
            }

            var vf = parseInt(thisobj.attr("vf"));

            if (vf >= 1) {
                var verifyCode = $("#verifycode").val();
                if (verifyCode == undefined || verifyCode == "") {
                    var d = dialog({
                        content: '为防止恶意领取，麻烦先输入验证码!',
                        quickClose: true
                    });
                    d.show(document.getElementById('verifycode'));

                    return false;
                }
            }

            var url = thisobj.attr("href");
            var score = parseInt(thisobj.attr("s"));
            var fee = parseFloat(thisobj.attr("fee"));
            var totalUser = parseInt(thisobj.attr("total"));
            var code = 0;
            var tips = '';
            var stop = false;
            var buycount = 1;


            if (score > 0) {
                tips += "消耗您的会员积分：" + score + "分<br />";
            }
            // if (Youhui.common.user.info.sina == 1) {
            //    tips += "关注券妈妈官方微博<br />"; //与您的新浪微博好友分享并
            // }

            if (tips == '') {
                if (fee > 0.01) {

                    var d = dialog({
                        title: '券妈妈购买优惠券确认',
                        content: "<div style='padding:15px 30px;'><font color='#ff6600'>确定购买该优惠券吗？<br/>需要支付" + fee + "元购买该优惠券<br/></font></div>",
                        okValue: '确定',
                        ok: function () {
                            Youhui.common.coupon.pull(id, url, buycount);
                            return true;
                        },
                        cancelValue: '取消',
                        cancel: function () { }
                    });
                    d.showModal();
                } else {
                    if (weixin_follow == "1") {
                        Youhui.common.coupon.pull(id, url, buycount);
                        return true;
                    }
                    else {

                        var d = dialog({
                            title: '券妈妈领取优惠券确认',
                            content: "<div style='padding:15px 30px;'><font color='#ff6600'>确定领取该优惠券吗？<br/></font></div>",
                            okValue: '确定',
                            ok: function () {
                                Youhui.common.coupon.pull(id, url, buycount);
                                return true;
                            },
                            cancelValue: '取消',
                            cancel: function () { }
                        });
                        d.showModal();
                    }

                }
            } else {
                if (fee > 0.01) {
                    var d = dialog({
                        title: '券妈妈购买优惠券确认',
                        content: "<div style='padding:15px 30px;'><font color='#ff6600'>确定购买该优惠券吗？<br/>需要支付" + fee + "元购买该优惠券<br/></font><br/>领取该优惠券将会进行以下操作：<br /><font color='#ff6600'>" + tips + "</font>是否继续领取？</div>",
                        okValue: '确定',
                        ok: function () {
                            Youhui.common.coupon.pull(id, url, buycount);
                            return true;
                        },
                        cancelValue: '取消',
                        cancel: function () { }
                    });
                    d.showModal();
                } else {

                    var d = dialog({
                        title: '券妈妈领取优惠券确认',
                        content: "<div style='padding:15px 30px;'>领取该优惠券将会进行以下操作<br /><font color='#ff6600'>" + tips + "</font>是否继续领取？</div>",
                        okValue: '确定',
                        ok: function () {
                            Youhui.common.coupon.pull(id, url, buycount);
                            return true;
                        },
                        cancelValue: '取消',
                        cancel: function () { }
                    });

                    d.showModal();

                }
            }
            return false;
        }, // coupon draw

        pull: function (id, url, buycount) {
            //领取优惠券
            var drawing_dialog = dialog({
                title: '券妈妈正在为您提取券....',
                content: "亲,请耐心等待,券妈妈正在为您提取优惠券..."
            });
            drawing_dialog.show();


            var verifyCode = $("#verifycode").val();

            Youhui.api.post("/coupon/pull", {
                id: id,
                buycount: buycount,
                verifyCode: verifyCode
            }, function (json) {

                drawing_dialog.close().remove();
                //$("#pull").removeClass("pulling");
                if (json.code >= 1) {
                    var content = "<div id='test'><div class='d_content d_c_s'><form method='post' target='_blank' action='" + url + "'><ul class='clear' id='pullinfo'>";
                    if (json.code == 1 || json.code == 2) {
                        content += "<li><ins>" + "优惠券代码(复制下面代码去使用,注意前后不要有多余空格哦)：" + "</ins></li>";
                        content += "<li class='code' id='code_" + id + "'><font color=red><b>" + json.result + "</font></b></li><li class='code'>&nbsp;</li>";

                        content += "<li class='code'>您所领取的优惠券在券妈妈\"账号中心\"一直都可以查到：</li>";
                        content += "<li class='code'><a href=\"/user/coupons/\" target=\"_blank\">&nbsp;&nbsp;我领取的优惠券</a></li>";

                        var shiyongLink = $("#couponShiyongLink");
                        if (shiyongLink.length > 0) {
                            content += "<li class='code'>&nbsp;</li>";
                            content += "<li class='code'>领取的优惠券如何使用：</li>";
                            content += "<li class='code'>" + shiyongLink.html() + "</li>";
                        }
                    }
                    else if (json.code == 3) {
                        Youhui.common.user.relogin();
                        return false;
                    }
                    else {
                        content += "<li class='code' id='code_" + id + "'>" + json.result + "</li>";
                    }

                    //content += json.result.info.password!= null && json.result.info.password!='' ? "<li class='code' id='pwd_"+id+"'><s id='pwd_i_"+id+"'>密码：<i>"+json.result.info.password+"</i></s><u>点击复制</u></li>" : '';

                    content += "<li><ins><a href='" + url + "' id='go_shopping' target='_blank'><span>去商家购物</span></a>";

                    //content += json.result.subscribe.state!= null && json.result.subscribe.state==0 ? "<a href='javascript:;' class='subscribe' title='订阅《"+json.result.subscribe.shop_name+"》后，将会收到"+json.result.subscribe.shop_name+"的最新优惠券、打折促销信息' style='margin-top:10px;' rel='"+json.result.subscribe.shop_id+"'>订阅该商家</a>" : '';

                    content += "</ins></li>";
                    content += "<li>&nbsp;</li>";
                    content += "<li>关注下面<strong>券妈妈微信号</strong>，以后随时随地免费领取优惠券哦：</li>";
                    content += "<li><img style='width:100px;height:100px;' src='http://www.quanmama.com/AdminImageUpload/265824weixin_%E5%89%AF%E6%9C%AC.jpg'/></li>";
                    content += "</ul></form></div></div>";

                    //alert(content);

                    var d = dialog({
                        title: '恭喜你，已经成功领取优惠券！',
                        content: content
                    });

                    d.showModal();
                } else {
                    var d = dialog({
                        title: '领券失败提示',
                        content: json.result,
                        width: 400
                    });

                    d.showModal();
                }
            }, {
                async: true
            });
        }
    },
    report: {
        //错误报告
        init: function () {
            $(".report").on("click", function () {
                Youhui.common.error.init(Youhui.SITEURL + $(this).attr("href"), $(this).attr("title"));
                return false;
            });
        }
    },
    favourite: {
        //添加到收藏
        init: function () {
            $(".fav a").click(function () {
                Youhui.tools.addFavourite();
                return false;
            });
            $("a.favourite").click(function () {
                if (!Youhui.common.user.checklogin()) return;
                var obj = $(this);
                Youhui.api.post("addfavourite", {
                    type: obj.attr("type"),
                    id: obj.attr("rel")
                }, function (json) {
                    if (json.code == 1) {
                        obj.text("已收藏").unbind("click");
                        Youhui.dialog.suggest("成功添加到收藏夹");
                    } else {
                        Youhui.dialog.notice(json.result);
                    }
                });
                return false;
            });
        }
    },
    note: {
        filter: function (id) {
            Youhui.api.get("readnotice", {
                id: id,
                status: 2
            }, function (json) {
                if (json.code == 1) {
                    $(this).closest("tbody").fadeOut(function () {
                        if ($(this).siblings().length == 0)
                            $(".index_notice2").remove();
                        else
                            $(this).remove();
                    });
                } else {
                    Youhui.dialog.notice(json.result);
                }
            } .bind(this));
        },
        post: function (user_id, username) {
            if (!Youhui.common.user.checklogin()) return;
            Youhui.dialog.layer("给" + username + "发送私信", {
                content: '<div><div class="d_content">请输入私信内容：<br /><textarea name="content" style="width:100%;height:100px;"></textarea></div></div>',
                className: "dialog_error",
                mask: true,
                buttons: [{
                    title: '提交',
                    type: 'main',
                    close: false,
                    func: function () {
                        var obj = this.pannel.find("textarea[name=content]");
                        if (Youhui.form.isInputNull(obj)) {
                            Youhui.common.errorAnimation(obj);
                            return false;
                        }
                        this.close();
                        var loading = Youhui.dialog.loading("正在发送...");
                        Youhui.api.post("sendnote", {
                            user_id: user_id,
                            content: obj.val()
                        }, function (json) {
                            if (json.code > 0) {
                                loading.hide();
                                Youhui.dialog.notice("发送成功！");
                            } else {
                                Youhui.dialog.notice(json.result, {
                                    className: "dialog_error"
                                });
                            }
                        });
                    }
                }, {
                    title: '取消',
                    type: 'cancel',
                    close: true
                }]
            });
        },
        check: function () {
            var _this = this;
            var mainObj = $(".header");
            var noteTips = $("#note_tips");
            if (noteTips.length <= 0) {
                return;
            }

            $(window).bind("resize.checkmsg", function () {
                noteTips.css("right", mainObj.offset().left + 20);
            }).triggerHandler("resize.checkmsg");

            $.ajax({
                url: "/ajax/checkmsg.ashx",
                type: "GET",
                success: function (json, textStatus) {
                    if (json.code > 0) {
                        if (json.result.length > 0) {
                            noteTips.show().find("em").html(json.result.length);
                            $("ul", noteTips).html('');
                            $(json.result).each(function () {
                                $("ul", noteTips).append("<li><a href='" + this.url + "/' title='发送用户：" + this.from_user + "&#13发送时间：" + this.sendtime + "'>" + this.title + "</a></li>");
                            });
                        } else {
                            //clearInterval(_this.timer);
                            noteTips.hide().find("em").html(0);

                        }
                    }
                },
                error: function (ex) {
                    if (Youhui && Youhui.isadmin == 1) {
                        //alert(ex);
                    }
                }
            });

            //setTimeout(arguments.callee.bind(this), 20000);
        } //check end
    }//note end
    ,
    autocomplete: {
        init: function () {
            $("#search_input").autocomplete("/ajax/search.ashx", {
                //iwidth: 252,
                hasclose: 0,
                dynamicPara: "", //"input[name=type]",
                success: function (data) {
                    //$("input[name=type]").val(data.keyrel);
                    if (data.jumpUrl) {
                        $("form[name=searchform]").attr("action", data.jumpUrl);
                    }
                    $("form[name=searchform]").submit();
                },
                error: function () {
                    $("form[name=searchform]").submit();
                }
            });
        }
    }
};

function daily_sign() {
    if (!Youhui.common.user.checklogin()) return false;

    $.get("/checkin", function (content) {
        Youhui.dialog.iframe("券妈妈每日签到！", { url: "/checkin", width: 600, height: 300, close: {
            callback: function () {
                window.location.reload();
            }
        }
        });
    });
}

//首页今日值得买和热门优惠券切换
function homeTab_switch(id, switch_type) {
    var obj = $(".J_HomeTab" + id);

    if (obj.hasClass("current")) {
        return;
    } else {
        $(".J_tab_switch li").removeClass("current");
        obj.addClass("current");

        $(".hometab").hide();

        $(".hometab" + id).show();

        if (switch_type == 0) {
            $("html,body").animate({
                scrollTop: $(".tabDiv").offset().top - 32
            }, 500);
        }
    }
}

//今日加载好了，看看是否可以自动切换
function hometab_load_callback() {
    var lastchoice_hometab_id = Youhui.tools.cookie("lastchoice_hometab_id");

    if (lastchoice_hometab_id == "2") {
        if ($(window).scrollTop() <= $(".J_coupon_block").offset().top + 40) {
            homeTab_switch(2, 1);
        }
    }
}

$(function () {
    //搜索初始化
    Youhui.common.search.init();

    //是否登陆检查
    $(".J_Login").click(function () {
        if (!Youhui.common.user.checklogin()) return false;
    });

    //签到按钮
    $(".J_Sign").click(function () {
        daily_sign();
        return false;
    });

    //ajax自动加载
    $(".JMyAjax").each(function () {
        var $this = $(this);
        $(this).load($(this).attr("data-url"), function () {
            $this.find(".loading").hide();
            $this.parent().find(".newLoading").hide();

            try {
                var callback = $this.attr('data-callback');
                if (callback) {
                    eval(callback);
                }
            } catch (err) {
                if (Youhui && Youhui.isadmin == 1) {
                    alert(err);
                }
            }

            Youhui.delayLoader.init({ elements: ".JMyAjax img" });
            Youhui.delayLoader.init({ elements: ".JStore img" });
        });
    });

    //图片延时加载
    Youhui.delayLoader.init();

    //领取优惠券初始化
    //    Youhui.common.coupon.init();

    //收藏初始化
    Youhui.common.favourite.init();


    //读取短消息通知
    if (Youhui.common.user.info.userid != '' && Youhui.common.user.info.userid != '0') {

        Youhui.common.note.check();
    }

    Youhui.init("tools.autocomplete", function () {
        Youhui.common.autocomplete.init();
    });

    //滚动图片和公告信息
    //    Youhui.init("tools.marquee", function () {
    //        Youhui.common.marquee.init();
    //        //Youhui.common.autocomplete.init();
    //    });

    //全部消息已读
    $("#note_tips .allread").click(function () {
        $.ajax({
            type: "GET",
            url: "/ajax/msgallread.ashx",
            success: function (s) {
                $("#note_tips").hide();
            }
        });

    });

    //wap上访问pc版
    if (window.location.href.indexOf("utm_source=wap") > -1) {
        Youhui.tools.cookie("pc", "1", {
            path: '/',
            domain: Youhui.CookieDomain,
            expires: 259200
        });
    }

    $(document).on('click', "#search_input", function () {
        var $this = $(this);
        if ($this.attr("pre") == $this.val() || $this.val() == '') {
            var p = $this.offset();
            var w = $this.width() + 12;
            $("#search-hot-stores").css({
                'z-index:': 9999,
                width: w,
                top: parseInt(p.top + $this.outerHeight()) + "px",
                left: parseInt(p.left) + "px"
            }).show();

            $("#new-suggest").hide();
            $("#autocomplete").hide();

            $("#search-hot-stores").out("click", function () {
                $("#search-hot-stores").hide();
            }, true);
        }
    });

    $(document).on('keyup', "#search_input", function () {
        var $this = $(this);
        if ($this.attr("pre") != $this.val() && $this.val().length > 0) {
            $("#search-hot-stores").hide();
        }
    });


    $("#_QMM_ALLSORT").load("/staticfiles/CategoryGuide.html"); //load("/html/category.html");


    //首页头部通栏广告位
    if ($(".top_adv").length > 0) {
        setTimeout(function () {
            $(".top_adv").slideUp("slow");
            $(".top_adv1").show();
        }, 2000);
    }

    $(document).on("mouseover", ".search_suggest li", function () {
        $(".search_suggest li.selected").removeClass("selected");
        $(this).removeClass("unselected").addClass("selected");
    }).on("mouseout", function () {
        $(this).removeClass("selected").addClass("unselected");
    });

    //自动隐藏
    $(".dpnone").each(function () {
        $(this).hide();
    });


    $(document).on("click", ".outarea a", function () {
        var obj = $(this);
        var thislink = obj.attr("href");

        if (thislink && thislink.length > 0 && thislink.indexOf("quanmama") == -1
            && thislink.indexOf("localhost") == -1 && thislink.indexOf("http") > -1) {

            obj.attr("href", "http://www.quanmama.com/t/goto.aspx?url=" + thislink);
            obj.attr("target", "_blank");

            var ie = ! -[1, ];
            if (ie) {
                var txt = obj.text();
                if (txt.indexOf("<") == -1) {
                    obj.text(txt);
                }
            }
        }

        return true;
    });

    $(document).on("click", ".zhidemai-content a", function () {
        var obj = $(this);
        var thislink = obj.attr("href");

        if (thislink && thislink.length > 0 && thislink.indexOf("quanmama") == -1
            && thislink.indexOf("localhost") == -1 && thislink.indexOf("http") > -1) {

            obj.attr("href", "http://www.quanmama.com/t/goto.aspx?union=smzdm&url=" + thislink);
            obj.attr("target", "_blank");

            var ie = ! -[1, ];
            if (ie) {
                var txt = obj.text();
                if (txt.indexOf("<") == -1) {
                    obj.text(txt);
                }
            }
        }

        return true;
    });

    $(".footer_txt span").click(function () {
        $(".bordiv p").removeClass("on");
        $(".bordiv").find(".p" + $(this).attr("data-id")).addClass("on");

        $(".footer_txt span").removeClass("on");
        $(this).addClass("on");
    });


    $(".dealout a").each(function () {
        var obj = $(this);
        var thislink = obj.attr("href");

        if (thislink && thislink.length > 0 && thislink.indexOf("quanmama") == -1
            && thislink.indexOf("localhost") == -1 && thislink.indexOf("http") != -1) {
            obj.attr("target", "_blank").attr("href", "http://www.quanmama.com/t/goto.aspx?from=deal&url=" + thislink);

            var txt = obj.text();
            if (txt.indexOf("<") == -1) {
                obj.text(txt);
            }
        }
    });

    //今日值得买和热门优惠券切换
    $(".J_HomeTab1,.J_HomeTab2").click(function () {
        Youhui.tools.cookie("lastchoice_hometab_id", $(this).attr("data-id"), {
            path: '/',
            domain: Youhui.CookieDomain,
            expires: 1
        });

        homeTab_switch($(this).attr("data-id"), 0);
    });

    if ($(".J_coupon_block").length > 0) {
        $(window).bind("scroll.gotop", function () {
            if ($(window).scrollTop() > $(".J_coupon_block").offset().top + 40) {
                if ($(".float_nav").length == 0) {
                    $(".J_tab_switch").clone(true).addClass("float_nav").css('float', 'none').css("margin-top", "32px").appendTo(".J_coupon_block");
                }
            } else {
                $(".float_nav").remove();
            }
        });
    }

    var is_home = (Youhui.PageType === 'homepage');
    var is_zhihome = (Youhui.PageType === 'zdm');
    var is_haitao = (Youhui.PageType === 'haitao');

    if (is_home) {

        hometab_load_callback();

    }

    //独立商城，天猫和海淘商家切换
    $(document).on("click", ".slide-nav li", function () {
        $(".slide-nav li").removeClass("selected");
        var $this = $(this);
        $this.addClass("selected");

        $('.newLoading').hide();

        $(".J_Store1,.J_Store2,.J_Store3").hide();
        $(".J_Store" + $this.attr("data-id")).show();

        var data_id = $(".J_Store" + $this.attr("data-id")).find(".tit li.cur").attr("data-id");

        if ($(".JPanel" + data_id).length > 0) {
            //$this.closest('.JStore').find('.newLoading').hide();

            $(".JPanel" + data_id).show();

            $(".JPanel" + data_id + " img").each(function () {
                var $this = $(this);
                var arc = $this.attr("arc");
                if (arc && arc.length > 0) {
                    $this.attr("src", arc);
                    $this.removeAttr("arc");
                }
            });
        } else {
            $(".J_Store" + $this.attr("data-id")).find('.newLoading').show();
        }
    });

    //首页商家导航的类别切换
    var g = $("#J_nav_site");
    if (g.length > 0) {

        function toggle(obj) {
            g.find(".JCategoryChange li").removeClass("cur");

            $(obj).addClass("cur");

            $('.newLoading').hide();

            var panelObj = $(".JPanel" + $(obj).attr("data-id"));

            if (panelObj.length <= 0) {
                $(obj).closest('.JStore').find('.newLoading').show();
            } else {
                $(obj).closest('.JStore').find('.newLoading').hide();
            }

            $(obj).addClass("cur").siblings().removeClass("cur");
            $(".mall-pane").hide();
            panelObj.show();

            $(".JPanel" + $(obj).attr("data-id") + " img").each(function () {
                var $this = $(this);
                var arc = $this.attr("arc");
                if (arc && arc.length > 0) {
                    $this.attr("src", arc);
                    $this.removeAttr("arc");
                }
            });
        }

        //滚动
        delayMouseover(g.find(".JCategoryChange li"), toggle);


        g.find(".list-shop-word .item").on("mouseover", function () {
            $(this).addClass("item-hover")
        }).on("mouseout", function () {
            $(this).removeClass("item-hover")
        });

        g.find(".list-mall li").on("mouseover", function () {
            $(this).addClass("hover")
        }).on("mouseout", function () {
            g.find(".list-mall").css("z-index", 1);
            $(this).removeClass("hover")
        });

        $("#J_nav_site .con").on("mouseover", function (ev) {
            var e = ev || window.event,
                target = e.target || e.srcElement,
                obj;
            //bug1
            if (obj = ajIsParentLi(target)) {
                var $this = $(obj);
                $this.addClass("hover");
                var $ops = $this.find(".ops");
                if ($ops.attr("load") != "1") {
                    $ops.attr("load", "1");
                    var goTemplate = '<a href="' + $this.attr("outlink") + '" target="_blank" class="go-shopping" hidefocus="true">去购物</a>'
                        + '<a href="' + $this.attr("quanlink") + '" target="_blank"  class="go-detail" hidefocus="true">优惠券</a>';

                    $ops.html(goTemplate);
                }
                $ops.attr("style", "bottom: 2px;");
            }
            //bug2
            if (obj = ajIsParentPoptipInfo(target)) {
                $(obj).addClass("hover");
                $(obj).find('.homedetail em').html('官网');
            }
        }).on("mouseout", function (ev) {
            var e = ev || window.event,
                target = e.target || e.srcElement,
                obj;
            if (obj = ajIsParentLi(target)) {
                var $this = $(this);
                $this.removeClass("hover");
                $this.find(".ops").attr("style", "bottom: -25px;");
            }
            if (obj = ajIsParentPoptipInfo(target)) {
                $(obj).removeClass("hover")
            }
        });

        function ajIsParentLi(target) {
            var parent = target;
            while (!$(parent).hasClass('hover-ops') && parent !== document) {
                parent = parent.parentNode;
            }
            return $(parent).hasClass('hover-ops') ? parent : false;
        }

        function ajIsParentPoptipInfo(target) {
            var parent = target;
            while (!$(parent).hasClass('poptip-info') && parent !== document) {
                parent = parent.parentNode;
            }
            return $(parent).hasClass('poptip-info') ? parent : false;
        }


    }

    //频道菜单导航
    var $selected_nav = $(".cui_nav li.active");

    if ($selected_nav.length > 0) {
        $("." + $selected_nav.attr("id")).show();
    }


    $(".cui_myctrip").mouseover(function () {
        $(".cui_account").show();
        $(".cui_myctrip b").addClass("b_h");

        $selected_nav.find(".cui_subnav_wrap").show();
    }).mouseout(function () {
        $(".cui_account").hide();
        $(".cui_myctrip b").removeClass("b_h");
    });


    $(document).on("mouseover", ".rightTabs .tabs li", function () {
        $(this).closest('.rightTabs').find(".tabs li").removeClass("current");
        $(this).addClass("current");

        var panelname = $(this).attr("pname");
        $(this).closest('.rightTabs').find(".panel").hide();
        $(".J-panel-" + panelname).show();
        $(".J-panel-" + panelname + " img").each(function () {
            var $this = $(this);
            var arc = $this.attr("arc");
            if (arc && arc.length > 0) {
                $this.attr("src", arc);
                $this.removeAttr("arc");
            }
        });
    });


    $(".share_box").hover(function () {
        $(this).find(".more_share").show();
    }, function () {
        $(this).find(".more_share").hide();
    });


    $(document).on("click", ".rightTabs li a", function () {
        _gaq.push(["_trackEvent", "今日值得买", "值得买榜单", jQuery(this).text()]);
    });

    $(".logoimg").each(function () {
        $(this).bind("error", function () {
            this.src = "http://www.quanmama.com/images/logo.jpg";
        });
    });

    $(".profileimg").each(function () {
        $(this).bind("error", function () {
            this.src = "http://www.quanmama.com/ImageUpload/2013725192533347.jpg";
        });
    });


    if ($.browser.msie) {
        if ($.browser.version == '6.0') {
            $("#warmtips").css({
                position: 'absolute'
            });
            $("li.normal:not([class*='pulls']):not([class*='expire'])").bind("mouseenter", function () {
                $(this).addClass("hover");
            }).bind("mouseleave", function () {
                $(this).removeClass("hover");
            });
            $("#search_c dd").bind("mouseenter", function () {
                $(this).addClass("hover");
            }).bind("mouseleave", function () {
                $(this).removeClass("hover");
            });
        }
    }

    $(".clicktrick").click(function () {
        var obj = $(this);
        var href2 = obj.attr("href2");
        //alert(href2);
        if (href2 && href2 != '') {
            obj.attr("href2", obj.attr("href"));
            obj.attr("href", href2);
        }
    });

    $(document).on("click", ".bannerclick", function () {
        var $this = $(this);

        var cookie_key = $this.attr("key");
        if (cookie_key && cookie_key.length > 0) {
            Youhui.tools.cookie(cookie_key, "1", {
                path: '/',
                domain: Youhui.CookieDomain,
                expires: 259200
            });
        }

        $this.hide();

        return true;
    });

    $(".clickhide").on("click", function () {
        $(this).hide();
    });

    $(document).on("click", "#moreshop:not([class*=less])", function () {
        var o = $(this);
        $("#indexshop ul").animate({
            'height': '+=' + parseInt(o.attr("ht")) + 'px'
        }, 500, 'linear', function () {
            o.addClass("less");
            $(".more-text").hide();
            $(".less-text").show();
        });
    });
    $(document).on("click", ".less", function () {
        var o = $(this);
        $("#indexshop ul").animate({
            'height': '-=' + parseInt(o.attr("ht")) + 'px'
        }, 500, 'linear', function () {
            o.removeClass("less");
            $(".less-text").hide();
            $(".more-text").show();
        });
    });


    var close_weixin = Youhui.tools.cookie("close_wx");
    if (!close_weixin) {
        var ww = (($(window).width() - 990) / 2.0 - 108) / 2.0;
        if (ww > 0) {
            $("#mobileUploadEntry").show().css('margin-left', ww);
        }
    }

    $("#mobileUploadEntry").find('.close_entry').click(function () {
        $("#mobileUploadEntry").hide();

        Youhui.tools.cookie("close_wx", 1, {
            path: '/',
            domain: Youhui.CookieDomain,
            expires: 1
        });
    });

    var tips = Youhui.tools.cookie("indextips");
    if (!tips && $("#warmtips").size() > 0) {
        $("#warmtips").show().animate({
            bottom: '0px'
        }, 1000);
        $("#warmtips h2 em,.wtclose").click(function () {
            Youhui.tools.cookie("indextips", 1, {
                path: '/',
                expires: 864000
            });
            $("#warmtips").animate({
                bottom: '-272px',
                opacity: 0
            }, 1000);
        });
    }

    //回到顶部
    window.mainObj = ((window.mainObj && mainObj.length > 0) ? window.mainObj : $(".empty_container"));
    window.mainObj = ((window.mainObj && mainObj.length > 0) ? window.mainObj : $(".container"));
    window.mainObj = ((window.mainObj && mainObj.length > 0) ? window.mainObj : $("#container"));
    window.mainObj = ((window.mainObj && mainObj.length > 0) ? window.mainObj : $("#main"));
    window.mainObj = ((window.mainObj && mainObj.length > 0) ? window.mainObj : $(".navcss"));

    if (mainObj.length > 0) {
        $(".J_totop").on("click", function () {
            $("html,body").animate({
                scrollTop: 0
            }, 500);
        });

        var goTopObj = $(".J_floatright .hideitem");
        var floatObj = $(".J_floatright");

        var $window_height = $(window).height();
        var $content_ft_div = $("#content_ft_div");
        var $right_empty = $(".right_empty");


        $(window).bind("resize.gotop", function () {
            floatObj.css("left", mainObj.outerWidth() + mainObj.offset().left + 10);
        }).bind("scroll.gotop", function () {

            if ($(window).scrollTop() > 30) {

                goTopObj.fadeIn('fast').css("display", "block");
            } else {
                goTopObj.fadeOut('fast');
            }


            if ($right_empty.length > 0 && $window_height > 700) {
                if ($(window).scrollTop() + $window_height >= $right_empty.offset().top) {
                    var $zdm_hotrank = $("#zdm_hotrank");

                    if ($(".float_zdm_hotrank").length == 0) {
                        $zdm_hotrank.clone(true).addClass("float_zdm_hotrank").appendTo(".right_empty");
                    }

                    if ($(window).scrollTop() >= $right_empty.offset().top && $(window).scrollTop() + $zdm_hotrank.height() < $content_ft_div.offset().top) {
                        $(".float_zdm_hotrank").addClass("float_nav");
                    } else {
                        $(".float_zdm_hotrank").removeClass("float_nav");
                    }
                } else {
                    $(".float_zdm_hotrank").remove();
                }
            }
        }).triggerHandler("resize.gotop");

    }




    //输入框默认值
    $("textarea[default]").each(function () {
        if ($(this).val() == '') {
            $(this).val($(this).attr("default")).css("color", "#AEAEAE");
        }
    });

    $("textarea[default]").on('click', function () {
        if ($(this).attr("default") == $(this).val()) {
            $(this).val('').css("color", "#666666");
        }
    }).on("blur", function () {
        if ($(this).val() == '') {
            $(this).val($(this).attr("default")).css("color", "#AEAEAE");
        }
    });

    $("img").bind("error", function () {
        if (this.src.indexOf('juanlaoda.com') > -1 && this.src.indexOf('imgerror') == -1) {
            this.src = this.src.replace('juanlaoda.com', 'quanmama.com') + "?imgerror=1";
        }
        else if (this.src.indexOf('quanmama.com') > -1 && this.src.indexOf('imgerror') == -1) {
            this.src = this.src.replace('quanmama.com', 'juanlaoda.com') + "?imgerror=1";
        }
        else {
            this.src = "/images/b.gif";
        }
    });
});

function tab(b, c, d, e) {
    if (e == "click") {
        $(b).click(function () {
            $(this).addClass(d).siblings().removeClass(d);
            $(c).hide().eq($(b).index(this)).show();
        });
    } else {
        if (e == "hover") {
            $(b).mouseover(function () {
                $(this).addClass(d).siblings().removeClass(d);
                $(c).hide().eq($(b).index(this)).show();
            });
        }
    }
}

function openClose(c, b, g) {
    if (g == "mallNav") {
        $(c).click(function () {
            $(this).prev().css("height", "auto");
            $(this).hide();
            $(this).next("a").show();
        });
        $(b).click(function () {
            $(this).parent().find("ul").css("height", "64px");
            $(this).hide();
            $(this).prev("a").show();
        });
    } else {
        if (g == "comments") {
            var f = $("blockquote").length;
            for (var d = 0; d < f; d++) {
                var e = $(c).prev(".comment_con").eq(d).height();
                if (parseInt($(c).prev(".comment_con").eq(d).height()) > 120) {
                    $(c).prev(".comment_con").eq(d).height(120);
                    $(c).eq(d).css("display", "block");
                } else {
                    $(c).eq(d).css("display", "none");
                }
            }
            $(c).click(function () {
                $(this).prev().css({
                    "height": "auto",
                    "max-height": "100%"
                });
                $(this).hide();
            });
        }
    }
}

function document_write(msg, cookiename) {
    if (Youhui.tools.cookie(cookiename) != "1") {
        document.write(msg);
    }
}

function floatTips(obj, text) {
    var $tips = $('<div style="background-color:#AEAEAE;z-index:100000" id="J_item_vote_tips" class="tooltip tooltip-tr item-vote-tips"><div style="font-color:white;" class="tooltip-content"></div><i class="tip-arrow"></i></div>');

    $tips.find('.tooltip-content').html(text);

    var offset = $(obj).offset();
    tipWidth = $tips.width();

    $tips.css({ 'left': offset.left - tipWidth / 2 - 30, 'top': offset.top - 42 }).appendTo(document.body);

    timer = setTimeout(function () { $tips.fadeOut('500'); }, 1000);
}

var topHeight = 0;
var timer = null;
function floatAddPointTips(obj, text, left) {
    var $tips = $('<div id="addScore_id" class="addScore"></div>');
    var offset = $(obj).offset();
    topHeight = offset.top - 30;
    $tips.css({ 'left': offset.left + left, 'top': topHeight }).appendTo(document.body);
    $('.addScore').html(text);
    timer = setTimeout("bubbleMiss()", 200);
}
function bubbleMiss() {
    topHeight = topHeight - 5;
    if (topHeight > 80) {
        $('#addScore_id').fadeOut(1500);
        $('#addScore_id').css({ 'top': topHeight });
        setTimeout("bubbleMiss()", 140);
    }
    else {
        $('#addScore_id').remove();
        if (timer != null) {
            clearTimeout(timer);
            timer = null;
        }
    }
}

function post_view(id) {
    var viewCookie = Youhui.tools.cookie("zdm_view");
    if (viewCookie.indexOf("," + id) != -1) {
        return;
    }
    else {
        Youhui.tools.cookie("zdm_view", viewCookie + "," + id, {
            path: '/',
            domain: Youhui.CookieDomain,
            expires: 864000
        });
    }

    $.ajax({
        url: "/ajax/PostUserAction.ashx",
        data: { 'id': id, "type": 3 },
        type: "POST",
        success: function (json, textStatus) {

        },
        error: function (XMLHttpRequest, textStatus, errorThrown) { }
    });
}

function is_post_view(id) {
    var post_view_cookie = Youhui.tools.cookie("zdm_view");
    if (post_view_cookie && post_view_cookie.indexOf("," + id) != -1) {
        return true;
    }

    return false;
}

function post_visit_time() {
    return Youhui.tools.cookie("zdm_lastvisit_time");
}

function track_post_visit_time() {
    Youhui.tools.cookie("zdm_lastvisit_time", new Date(), {
        path: '/',
        domain: Youhui.CookieDomain,
        expires: 864000
    });
}

function jypost_vote(obj) {
    var $this = $(obj);

    //获取当前post的标题
    var title = $this.attr('ctitle');

    var id = $this.attr('id');

    var val = parseInt($this.attr('zannum'));

    var zhiValue = $this.attr('data-type');
    var voteCookie = Youhui.tools.cookie("zdm_vote");
    if (voteCookie.indexOf("," + id) != -1) {
        floatTips(obj, "您已投票");
        return;
    }
    else {
        Youhui.tools.cookie("zdm_vote", voteCookie + "," + id, {
            path: '/',
            domain: Youhui.CookieDomain,
            expires: 864000
        });
    }

    $.ajax({
        url: "/ajax/PostUserAction.ashx",
        data: { 'id': id, "type": 1, "ReportText": zhiValue, "title": title },
        type: "POST",
        success: function (json, textStatus) {
            if (json.code > 0) {
                $this.find("#jyzhinum").text(val + 1);
                floatTips(obj, json.msg);
            } else {
                floatTips(obj, json.msg);
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) { }
    });

    return false;
}

function jypost_shoucang(obj) {

    if (!Youhui.common.user.checklogin()) return false;

    var $this = $(obj);

    var title = $this.attr('ctitle');

    var id = $this.attr('id');

    var val = parseInt($this.attr('favnum'));

    var shoucangCookie = Youhui.tools.cookie("zdm_shoucang");
    if (shoucangCookie.indexOf("," + id) != -1) {
        floatTips(obj, "您已收藏");
        return;
    }
    else {
        Youhui.tools.cookie("zdm_shoucang", shoucangCookie + "," + id, {
            path: '/',
            domain: Youhui.CookieDomain,
            expires: 864000
        });
    }

    $.ajax({
        url: "/ajax/PostUserAction.ashx",
        data: { 'id': id, "type": 100, "title": title },
        type: "POST",
        success: function (json, textStatus) {
            if (json.code > 0) {
                $this.find("#jyfavnum").text(val + 1);
                floatTips(obj, "已经收藏成功，在您账号中心可以查到！");
            } else {
                floatTips(obj, json.msg);
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) { alert(errorThrown); }
    });

    return false;
}

function ajax_collect(article_id, obj) {
    if (!Youhui.common.user.checklogin()) return false;

    var $this = $(obj);

    post_view(article_id);

    //获取当前post的标题
    var title = $this.attr('posttilte');

    var shoucangCookie = Youhui.tools.cookie("zdm_shoucang");
    if (shoucangCookie.indexOf("," + article_id) != -1) {
        floatTips(obj, "您已收藏");
        return;
    }
    else {
        Youhui.tools.cookie("zdm_shoucang", shoucangCookie + "," + article_id, {
            path: '/',
            domain: Youhui.CookieDomain,
            expires: 864000
        });
    }

    $.ajax({
        url: "/ajax/PostUserAction.ashx",
        data: { 'id': article_id, "type": 100, "title": title },
        type: "POST",
        success: function (json, textStatus) {
            if (json.code > 0) {
                var em = $this.find('em');
                if (em.length > 0) {
                    var val = parseInt(em.text());
                    em.text(val + 1);
                } else {
                    var val = parseInt($this.text());
                    $this.text(val + 1);
                }

                floatTips(obj, "已经收藏成功，在您账号中心可以查到！");
            } else {
                floatTips(obj, json.msg);
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) { alert(errorThrown); }
    });

    return false;
}

function post_shoucang(obj) {

    if (!Youhui.common.user.checklogin()) return false;

    var $this = $(obj);

    var $wrap = $this.closest('.J_item_wrap');
    var id = $wrap.attr('data-id');
    post_view(id);

    //获取当前post的标题
    var title = $wrap.find(".rightImg>a>img").attr('alt');
    var val = parseInt($this.text());

    var shoucangCookie = Youhui.tools.cookie("zdm_shoucang");
    if (shoucangCookie.indexOf("," + id) != -1) {
        floatTips(obj, "您已收藏");
        return;
    }
    else {
        Youhui.tools.cookie("zdm_shoucang", shoucangCookie + "," + id, {
            path: '/',
            domain: Youhui.CookieDomain,
            expires: 864000
        });
    }

    $.ajax({
        url: "/ajax/PostUserAction.ashx",
        data: { 'id': id, "type": 100, "title": title },
        type: "POST",
        success: function (json, textStatus) {
            if (json.code > 0) {
                $this.text(val + 1);
                floatTips(obj, "已经收藏成功，在您账号中心可以查到！");
            } else {
                floatTips(obj, json.msg);
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) { alert(errorThrown); }
    });

    return false;
}

function ratingZDM(obj, id, rating_type) {

    var $this = $(obj);
    var $wrap = $this.closest('.lrBot');
    //获取当前post的标题
    var title = $wrap.attr('title');

    var zhi = $("#rating_worthy_" + id);
    var buzhi = $("#rating_unworthy_" + id);

    if (rating_type == 1) {
        zhi.addClass("current").addClass("worthCurrent");
        buzhi.addClass("unworthCurrent");

    } else {
        zhi.addClass("worthCurrent");
        buzhi.addClass("current").addClass("unworthCurrent");

    }

    var voteCookie = Youhui.tools.cookie("zdm_vote");
    if (voteCookie.indexOf("," + id) != -1) {
        floatTips(obj, "您已打分");
        return;
    }
    else {
        Youhui.tools.cookie("zdm_vote", voteCookie + "," + id, {
            path: '/',
            domain: Youhui.CookieDomain,
            expires: 864000
        });
    }

    $.ajax({
        url: "/ajax/PostUserAction.ashx",
        data: { 'id': id, "type": rating_type, "ReportText": '', "title": title },
        type: "POST",
        success: function (json, textStatus) {
            if (json.code > 0) {
                if (rating_type == 1) {
                    zhi.find(".scoreAnimate").fadeIn().animate({
                        top: "-1px"
                    }, "normal").fadeOut(300);
                } else {
                    buzhi.find(".scoreAnimate").fadeIn().animate({
                        top: "1px"
                    }, "normal").fadeOut(300);
                }

                var em = $this.find('em');
                if (em.length > 0) {
                    var val = parseInt(em.text());
                    em.text(val + 1);
                } else {
                    var val = parseInt($this.text());
                    $this.text(val + 1);
                }

            } else {
                floatTips(obj, json.msg);
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) { /*alert(errorThrown);*/ }
    });
}

function ratingFaXainZDM(obj, id, rating_type) {

    var $this = $(obj);
    //获取当前post的标题
    var title = $this.attr('title');

    var zhi = $("#rating_worthy_" + id);
    var buzhi = $("#rating_unworthy_" + id);

    if (rating_type == 1) {
        zhi.addClass("current").addClass("worthCurrent");
        buzhi.addClass("unworthCurrent");

    } else {
        zhi.addClass("worthCurrent");
        buzhi.addClass("current").addClass("unworthCurrent");

    }

    var voteCookie = Youhui.tools.cookie("zdm_vote");
    if (voteCookie.indexOf("," + id) != -1) {
        floatTips(obj, "您已打分");
        return;
    }
    else {
        Youhui.tools.cookie("zdm_vote", voteCookie + "," + id, {
            path: '/',
            domain: Youhui.CookieDomain,
            expires: 864000
        });
    }

    $.ajax({
        url: "/ajax/PostUserAction.ashx",
        data: { 'id': id, "type": rating_type, "ReportText": '', "title": title },
        type: "POST",
        success: function (json, textStatus) {
            if (json.code > 0) {
                if (rating_type == 1) {
                    zhi.find(".scoreAnimate").fadeIn().animate({
                        top: "-1px"
                    }, "normal").fadeOut(300);
                } else {
                    buzhi.find(".scoreAnimate").fadeIn().animate({
                        top: "1px"
                    }, "normal").fadeOut(300);
                }

            } else {
                floatTips(obj, json.msg);
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) { /*alert(errorThrown);*/ }
    });
}


function rating(obj, id, rating_type, zhiNum, buZhiNum) {

    var $this = $(obj);
    var $wrap = $this.closest('.lrBot');
    //获取当前post的标题
    var title = $wrap.attr('title');

    var zhi = $("#rating_worthy_" + id);
    var buzhi = $("#rating_unworthy_" + id);

    zhi.removeAttr("onclick").css("cursor", "default");
    buzhi.removeAttr("onclick").css("cursor", "default");

    if (rating_type == 1) {
        zhi.addClass("current").addClass("worthCurrent");
        buzhi.addClass("unworthCurrent");

    } else {
        zhi.addClass("worthCurrent");
        buzhi.addClass("current").addClass("unworthCurrent");

    }

    var voteCookie = Youhui.tools.cookie("zdm_vote");
    if (voteCookie.indexOf("," + id) != -1) {
        floatTips(obj, "您已投票");
        return;
    }
    else {
        Youhui.tools.cookie("zdm_vote", voteCookie + "," + id, {
            path: '/',
            domain: Youhui.CookieDomain,
            expires: 864000
        });
    }

    $.ajax({
        url: "/ajax/PostUserAction.ashx",
        data: { 'id': id, "type": rating_type, "ReportText": '', "title": title },
        type: "POST",
        success: function (json, textStatus) {
            if (json.code > 0) {
                if (rating_type == 1) {
                    zhi.find(" .scoreAnimate").fadeIn().animate({
                        top: "-30px"
                    }, "normal").fadeOut(300);
                    //zhi.find(" .scoreTotal").html("<b>值</b> " + h.worthy_num);
                } else {
                    buzhi.find(" .scoreAnimate").fadeIn().animate({
                        top: "30px"
                    }, "normal").fadeOut(300);
                    //buzhi.find(" .scoreTotal").html("<b>不值</b> " + h.unworthy_num);
                }

                var em = $this.find('em');
                if (em.length > 0) {
                    var val = parseInt(em.text());
                    em.text(val + 1);
                } else {
                    var val = parseInt($this.text());
                    $this.text(val + 1);
                }

                var rollObj = $this.parents('.aj-zhide-list').find('.aj-roll-wrap');

                var zanNum = 0;
                var buZanNum = 0;
                if (rating_type == 1)//赞
                {
                    zanNum = zhiNum + 1;
                    buZanNum = buZhiNum;
                }
                else {
                    zanNum = zhiNum;
                    buZanNum = buZhiNum + 1;
                }

                var rank = parseInt(10 * zanNum / (zanNum + buZanNum));

                var rate = parseInt(100 * zanNum / (zanNum + buZanNum))

                rollObj.find('.aj-roll').find('.aj-inside').attr("rank", rank);

                rollObj.find('.aj-pian-left').text(rate + "%用户认为可用");

                rollObj.find('.aj-percent').text(rate + "%");

            } else {
                floatTips(obj, json.msg);
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) { /*alert(errorThrown);*/ }
    });
}

function single_rating(id, rating_type, obj) {
    var $rating_obj = $("#rating_" + id);
    var title = $rating_obj.attr("title");

    var zhi = $("#rating_worthy");
    var buzhi = $("#rating_unworthy");
    zhi.removeAttr("onclick").css("cursor", "default").addClass("worthCurrent");
    buzhi.removeAttr("onclick").css("cursor", "default").addClass("unworthCurrent");

    var zhinum = parseInt($("#rating_worthy_num").text());
    var buzhinum = parseInt($("#rating_unworthy_num").text());

    var voteCookie = Youhui.tools.cookie("zdm_vote");
    if (voteCookie.indexOf("," + id) != -1) {
        floatTips(obj, "您已投票");
        return;
    }
    else {
        Youhui.tools.cookie("zdm_vote", voteCookie + "," + id, {
            path: '/',
            domain: Youhui.CookieDomain,
            expires: 864000
        });
    }

    if (rating_type == 1) {
        zhinum += 1;
    }
    else {
        buzhinum += 1;
    }

    $.ajax({
        url: "/ajax/PostUserAction.ashx",
        data: { 'id': id, "type": rating_type, "ReportText": '', "title": title },
        type: "POST",
        success: function (json, textStatus) {
            if (json.code > 0) {
                if (rating_type == 1) {
                    $rating_obj.find(".add").show().animate({
                        "top": "-30px"
                    }, 600).fadeOut("slow", function () {
                        $("#rating_worthy_num").html(zhinum);
                        $("#rating_all_num").html("已有 " + (zhinum + buzhinum) + " 用户参与");
                    });
                } else {
                    $rating_obj.find(".reduce").show().animate({
                        "top": "80px"
                    }, 600).fadeOut("slow", function () {
                        $("#rating_unworthy_num").html(buzhinum);
                        $("#rating_all_num").html("已有 " + (zhinum + buzhinum) + " 用户参与");
                    });
                }

                var m = (zhinum / (zhinum + buzhinum)) * 100;
                var q = m.toString() + "%";

                $rating_obj.find(" .progressing").css("width", q);

            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) { /*alert(errorThrown);*/ }
    });


}

function post_vote(obj, zhiNum, buZhiNum) {
    var $this = $(obj);

    var $wrap = $this.closest('.J_item_wrap');
    //获取当前post的标题
    var title = $wrap.find(".titleLink").attr('title');

    var id = $wrap.attr('data-id');
    post_view(id);

    var type = 1;

    var zhiValue = $this.attr('data-type');

    if (zhiValue == "yes") type = 1;
    else type = 2;

    var voteCookie = Youhui.tools.cookie("zdm_vote");
    if (voteCookie.indexOf("," + id) != -1) {
        floatTips(obj, "您已投票");
        return;
    }
    else {
        Youhui.tools.cookie("zdm_vote", voteCookie + "," + id, {
            path: '/',
            domain: Youhui.CookieDomain,
            expires: 864000
        });
    }

    var num = 0;
    $.ajax({
        url: "/ajax/PostUserAction.ashx",
        data: { 'id': id, "type": type, "ReportText": zhiValue, "title": title },
        type: "POST",
        success: function (json, textStatus) {
            if (json.code > 0) {
                var em = $this.find('em');
                if (em.length > 0) {
                    var val = parseInt(em.text());
                    em.text(val + 1);
                    num = val + 1;
                } else {
                    var val = parseInt($this.text());
                    $this.text(val + 1);
                    num = val + 1;
                }
                floatTips(obj, json.msg);

                var rollObj = $this.parents('.aj-grid-list').find('.aj-roll-wrap');
                if (rollObj.length <= 0) rollObj = $this.parents('.aj-zhide-list').find('.aj-roll-wrap');

                var zanNum = 0;
                var buZanNum = 0;
                if (type == 1)//赞
                {
                    zanNum = zhiNum + 1;
                    buZanNum = buZhiNum;
                }
                else {
                    zanNum = zhiNum;
                    buZanNum = buZhiNum + 1;
                }

                var rank = parseInt(10 * zanNum / (zanNum + buZanNum));

                var rate = parseInt(100 * zanNum / (zanNum + buZanNum))

                rollObj.find('.aj-roll').find('.aj-inside').attr("rank", rank);

                rollObj.find('.aj-pian-left').text(rate + "%用户认为可用");

                rollObj.find('.aj-percent').text(rate + "%");

            } else {
                floatTips(obj, json.msg);
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) { alert(errorThrown); }
    });


    return false;
}

function post_haveproblem(obj, problem_type) {
    var $this = $(obj);

    var $wrap = $this.closest('.J_item_wrap');
    var id = $wrap.attr('data-id');

    $.ajax({
        url: "/ajax/PostUserAction.ashx",
        data: { 'id': id, "type": problem_type },
        type: "POST",
        success: function (json, textStatus) {
            if (json.code > 0) {
                floatTips(obj, "已经收到您的反馈！谢谢！");
            } else {
                floatTips(obj, "您已反馈了哦！");
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) { alert(errorThrown); }
    });

    return false;
}




function loadFeedFormJS() {
    $.get("/MyAjax/feedback", function (data, status) {
        if (status == 'success') {
            $(document.body).append(data);
            AppendFeedBack();
        }
    });
}

function showWeixinImage() {
    var imageObject = document.getElementById('weixinimg'); // 获取image标签对象
    imageObject.style.display = 'block';
}

function hiddenWeixinImage() {
    var imageObject = document.getElementById('weixinimg'); // 获取image标签对象
    imageObject.style.display = 'none';
}

function qmm_write(a) {

}

var is_inited = 0;
var zdmListForDuplicateCheck = new Array();
function initZdmListForDuplicateCheck() {
    if (is_inited == 0) {
        $(".list").each(function () {
            var zdm_id = parseInt($(this).attr("data-id"));
            if (zdm_id > 0 && zdmListForDuplicateCheck.indexOf(zdm_id) < 0) {
                zdmListForDuplicateCheck.push(zdm_id);
            }
        });

        is_inited = 1;
    }
}


slidingFunction = function () {
    var k = navigator.userAgent.toLowerCase();
    var o = {
        IE: /msie/.test(k),
        OPERA: /opera/.test(k),
        MOZ: /gecko/.test(k),
        IE5: /msie 5 /.test(k),
        IE55: /msie 5.5/.test(k),
        IE6: /msie 6/.test(k),
        IE7: /msie 7/.test(k),
        SAFARI: /safari/.test(k)
    };
    var m = $("#pagefooter").height();
    var g = $(window).width();
    var r = $(window).height();
    var f = $(".container").width();
    var h = $("#leftLayer").height();
    var j = $("#rightLayer").height();
    var q = g / 2 - f / 2 - 10 - 48;
    var d = r / 2 - h / 2 - 50;
    if (q > 0) {
        $("#leftLayer").show().css({
            "left": q,
            "top": d
        });
        $("#rightLayer").show().css("right", q);
    } else {
        if (q = 0) {
            $("#leftLayer").show().css({
                "left": 0,
                "top": d
            });
            $("#rightLayer").show().css("right", 0);
        } else {
            $("#leftLayer").hide();
            $("#rightLayer").hide();
        }
    }
    var c = document.body.scrollTop || document.documentElement.scrollTop;
    (c > 300) ? $("#backToTop").css("display", "block") : $("#backToTop").css("display", "none");
    if (o.IE6) {
        $("#rightLayer").css("top", c + r - 166);
    }
    var p = $("body").height();
    var e = document.getElementById("rightLayer");
    if (e) {
        var b = $("#rightLayer").height() + 18;
        if (p <= c + r + m - b + 135) {
            var l = c + r + m + 20 - p;
            $("#rightLayer").css({
                position: "fixed",
                bottom: l
            });
        } else {
            $("#rightLayer").css({
                position: "fixed",
                bottom: 0
            });
        }
    }
};

function fixed_right() {
    var prop = {},
        w = window,
        footer = $('#pagefooter'),
        left_side_dom = $('.left_side'),
        right_side_dom = $('.right_side');
    if (right_side_dom.length <= 0 || left_side_dom.length <= 0) return false;
    var leftHeight = left_side_dom.height(),
        rightHeight = right_side_dom.height(),
        rightOffsetTop = right_side_dom.offset().top,
        fixedTop = 40,
        fixed_height_timer,
        fixedOffsetFromFooter = 0,
        fixedTotalHeight = 0,
        scrollHeight,
        footerTop,
        timer = 0,
        previousSiblingTotalHeight;
    prop.arr = $('.rightPanel.floatFixed');
    function doScroll() {
        prop.arr = $('.rightPanel.floatFixed');
        if (prop.arr.length === 0) { return false; }
        fixedTotalHeight = 0;
        prop.arr.each(function () {
            fixedTotalHeight += $(this).height() + parseInt($(this).css('margin-bottom'), 10);
        });
        if (scrollHeight === $(w).scrollTop()) {       //scroll x
            prop.arr.each(function () {
                $(this).css({
                    'left': right_side_dom.offset().left
                });
            });
            return true;
        }
        scrollHeight = $(w).scrollTop();
        footerTop = footer.offset().top;
        if (leftHeight < rightHeight) { return false; }
        if (scrollHeight > (rightHeight + rightOffsetTop)) {
            fixedOffsetFromFooter = footerTop - (scrollHeight + fixedTop + fixedTotalHeight);
            if (fixedOffsetFromFooter >= 0) {
                fixedOffsetFromFooter = 0;
            }
            previousSiblingTotalHeight = 0;
            prop.arr.each(function () {
                $(this).css({
                    'position': 'fixed',
                    'top': fixedTop + previousSiblingTotalHeight + fixedOffsetFromFooter,
                    'left': right_side_dom.offset().left
                });
                previousSiblingTotalHeight += $(this).height() + parseInt($(this).css('margin-bottom'), 10);
            });
        } else {
            prop.arr.each(function () {
                $(this).css({
                    'position': 'static',
                    'top': '0px'
                });
            });
        }
    }
    if (footer.length > 0 && $(".rightPanel").length > 0) {
        fixed_height_timer = setInterval(function () {
            if (right_side_dom.height() > rightHeight) {
                rightHeight = right_side_dom.height();
            }
            if (left_side_dom.height() > leftHeight) {
                leftHeight = left_side_dom.height();
            }
        }, 1000 / 5);
        setTimeout(function () {
            clearInterval(fixed_height_timer);
        }, 10 * 1000);

        $(w).on('resize', function () {
            prop.arr.each(function () {
                $(this).css({
                    'left': right_side_dom.offset().left
                });
            });
        });
        $(w).on('scroll', function () {
            if (!timer) {
                timer = setTimeout(function () {
                    doScroll();
                    timer = 0;
                }, 200);
            }
        });
    }
}

function showHide(c, b, d) {
    $(c).hover(function () {
        $(this).addClass(b);
        $(this).find(d).show();
    }, function () {
        $(this).removeClass(b);
        $(this).find(d).hide();
    });
}
function showHideClick(b, c) {
    $(b).unbind("click").click(function () {
        var d = $(this).parent().find(c);
        if (d.is(":hidden")) {
            d.css("display", "block");
        } else {
            d.css("display", "none");
            d.find("i.i_checkbox").show().removeClass("icon-loginkuangright").removeClass("icon-rightframe");
            d.find(".checkbox_hide").removeAttr("checked");
            d.find(":text").each(function () {
                var e = $(this).attr("default_value");
                $(this).val(e);
                $(this).css("color", "#999");
            });
            d.find(".link_box").each(function () {
                var e = $(this).find(":button").val();
                if (e == "-") {
                    $(this).remove();
                }
            });
        }
        if ($(this).find("i").hasClass("icon-rightframe")) {
            $(this).find("i").removeClass("icon-rightframe");
            $(this).find("i").prev().removeAttr("checked");
        } else {
            $(this).find("i").addClass("icon-rightframe");
            $(this).find("i").prev().attr("checked", "true");
        }
    });
}

function banner_pages() {
    a = $(".guess_like .slick-dots").find(".slick-active a").html();
    n = $(".guess_like .slick-dots li:last a").html();
    if (a == undefined || n == undefined) {
        $(".custom_page").hide();
    } else {
        $(".custom_page").html(a + " / " + n);
        setTimeout(banner_pages, 0);
    }
}

$(function () {

    fixed_right();

    slidingFunction();

    $(window).scroll(function () {
        slidingFunction();
    });

    $(window).resize(function () {
        slidingFunction();
    });

    showHide(".moreNav", "moreNavHover", ".more_moreNav");
    showHide(".submission", "submissionHover", ".more_submission");
    showHide(".login_Info", "login_InfoHover", ".more_login_Info");
    showHide(".share_box", "", ".more_share");
    showHide(".erweimaWrap", "", ".erweimaContent");


    if ($(".slider").length > 0) {
        $(".banner_page").slick({
            dots: true,
            infinite: true,
            autoplay: true,
            draggable: false,
            pauseOnHover: true,
            autoplaySpeed: 10000,
            speed: 400,
            slidesToShow: 4,
            slidesToScroll: 4
        });

        $(".whole_banner_page").slick({
            dots: true,
            infinite: true,
            autoplay: true,
            draggable: false,
            pauseOnHover: true,
            autoplaySpeed: 10000,
            speed: 400,
            slidesToShow: 6,
            slidesToScroll: 6
        });

        $(".banner_nopage").slick({
            dots: false,
            infinite: true,
            autoplay: true,
            draggable: false,
            pauseOnHover: true,
            autoplaySpeed: 10000,
            speed: 400,
            slidesToShow: 4,
            slidesToScroll: 4
        });
        $(".single-item").slick({
            dots: true,
            infinite: true,
            autoplay: true,
            autoplaySpeed: 5000,
            speed: 400,
            slidesToShow: 1,
            slidesToScroll: 1
        });
        $(".AddSlider").slick({
            dots: true,
            infinite: true,
            autoplay: true,
            autoplaySpeed: 5000,
            speed: 400,
            slidesToShow: 1,
            draggable: false,
            pauseOnHover: true,
            slidesToScroll: 1
        });
        banner_pages();
    }

    $(".weixinlink").mouseover(function () {
        showWeixinImage();
    }).mouseout(function () {
        hiddenWeixinImage();
    });

    $("#weixinimg").mouseover(function () {
        showWeixinImage();
    }).mouseout(function () {
        hiddenWeixinImage();
    });

    $(document).on("mouseover,mouseout", ".item-vote", function () {
        if (event.type == 'mouseover') {
            $(this).find(" .haveproblem").show();
        } else {
            $(this).find(" .haveproblem").hide();
        }
    });



});

function UpdateZdmTodayCount() {
    setInterval(function () {
        $.ajax({
            url: '/ajax/zdm_todaycount.ashx',
            type: "GET",
            success: function (data) {
                if (data != "0" && data.length < 4 && data.length > 0) {
                    $("#zdm_todaycount").text('(新上' + data + '条)');
                }
            }
        });
    }, 10 * 1000);
}

var locUrl = window.location.href;

if (locUrl.indexOf("?s=") > 0) {
    if (window.opener) {
        if ($("#outlink").attr("link").indexOf("www.quanmama.com") > 0) {
            window.opener.location.href = $("#outlink").attr("link");
        } else {
            window.opener.location.href = "http://www.quanmama.com" + $("#outlink").attr("link");
        }
    }
}
$(document).ready(function () {
    if (Youhui.common.user.info.userid != '') {
        var shoucangCookie = Youhui.tools.cookie("haitaocoupon_shoucang");
        $.each($(".js-star-image"), function () {
            if (shoucangCookie.indexOf($(this).parent().attr("cid")) > 0) {
                $(this).parent().attr("data-starred", true);
            }
        });
    }
    var closer = $(".mainCloser");
    if (closer != null) {
        closer.bind("click", function () {
            $("#modal-overlay").remove();
            $("#redemption-modal").remove();
        });
    }
    var dcloser = $(".detail_close");
    if (dcloser != null) {
        dcloser.bind("click", function () {
            $(this).parent().hide();
            $(".description").show();
            $(".haitaostar").show();
        });
    }
    $(".js-out-link").click(function () {
        window.open($(this).attr("link"), "_blank");
    });

    $(".js-store-logo").bind("mouseover", function () {
        $(this).find(".logo-tooltip").show();
    });

    $(".js-store-logo").bind("mouseout", function () {
        $(this).find(".logo-tooltip").hide();
    });

    $(".newarrow-down").bind("click", function () {
        $(this).prev().find(".cpdesc").css("overflow", "visible").css("white-space", "normal").css("word-wrap", "break-word");
        $(this).hide();
        $(this).next().css("display", "block");
    });

    $(".newarrow-up").bind("click", function () {
        $(this).prev().prev().find(".cpdesc").css("overflow", "hide").css("white-space", "nowrap").css("word-wrap", "normal");
        $(this).hide();
        $(this).prev().css("display", "block");
    });

    var copyText = $(".js-copy-btn").text();
    if (copyText != null && copyText == "复制") {
        copytext();
    }

    var copyShouCang = $(".js-star-image");
    if (copyShouCang.parent().attr("cid")) {
        copyShouCang.bind("click", function () {
            var $this = $(this).parent();
            haitaocoupon_shoucang($this);
        });
    }

    $(".js-vote-up").bind("click", function () {
        var $this = $(this);
        haitaocoupon_vote($this);
    });

    $(".js-vote-down").bind("click", function () {
        var $this = $(this);
        haitaocoupon_vote($this);
    });
});

function copytext(clip) {
    var clip = new ZeroClipboard.Client();
    clip.setHandCursor(true);
    clip.glue("btn_submit");

    clip.addEventListener("mouseDown", function () {
        var text = $(".codeValue").text();
        clip.setText(text);
        $(".js-copy-btn").addClass("copied");
        $("#tiptext").html("购物完成后请将优惠码粘贴到优惠券一栏");
    });

}

function ratecount(rate, totalcount, type) {
    var good = (rate * totalcount) / 100;
    if (type == 'yes') {
        return parseInt((good + 1) * 100 / (totalcount + 1));
    } else {
        return parseInt(good * 100 / (totalcount + 1));
    }
}

function haitaocoupon_shoucang(obj) {
    if (!Youhui.common.user.checklogin()) return false;
    var $this = $(obj);
    if ($this.attr("data-starred") == "false") {
        $this.attr("data-starred", "true");
    } else {
        $this.attr("data-starred", "false");
    }

    var id = $this.attr('cid');

    var shoucangCookie = Youhui.tools.cookie("haitaocoupon_shoucang");
    if (shoucangCookie.indexOf("," + id) != -1) {
        Youhui.tools.cookie("haitaocoupon_shoucang", shoucangCookie.replace("," + id, ""), {
            path: '/',
            domain: Youhui.CookieDomain,
            expires: 864000
        });

        $.ajax({
            url: "/ajax/haitaocouponvote.ashx",
            data: { 'id': id, "type": "cancel_shoucang" },
            type: "POST",
            success: function (json, textStatus) {
                if (json.code > 0) {
                    floatTips(obj, "取消收藏成功！");
                } else {
                    floatTips(obj, json.msg);
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) { alert(errorThrown); }
        });


        return;
    }
    else {
        Youhui.tools.cookie("haitaocoupon_shoucang", shoucangCookie + "," + id, {
            path: '/',
            domain: Youhui.CookieDomain,
            expires: 864000
        });
    }

    $.ajax({
        url: "/ajax/haitaocouponvote.ashx",
        data: { 'id': id, "type": "shoucang" },
        type: "POST",
        success: function (json, textStatus) {
            if (json.code > 0) {
                floatTips(obj, "已经收藏成功，在您账号中心可以查到！");
            } else {
                floatTips(obj, json.msg);
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) { alert(errorThrown); }
    });
}

function haitaocoupon_vote(obj) {
    var $this = $(obj);
    var id = $this.attr('cid');
    var type = $this.attr('type');
    var val;
    var rate;

    if ($this.attr('layer') == "float") {
        val = parseInt($(".votetotalcount").text());
        rate = parseInt($("#percentcount").text());
    } else {
        val = parseInt($this.parent().find(".js-vote-count").text());
        rate = parseInt($this.parent().find(".js-percent").text());
    }
    var voteCookie = Youhui.tools.cookie("haitcoupon_vote");
    //alert(voteCookie);
    if (voteCookie.indexOf("," + id) != -1) {
        floatTips(obj, "您已经投票了哦，亲。");
        return;
    }
    else {

        //                if (type == "yes") {
        //                    $("#badvote").hide();
        //                    $("#goodvote").show();
        //                } else {
        //                    $("#badvote").show();
        //                    $("#goodvote").hide();
        //                }

        floatTips(obj, "谢谢您的反馈。您的投票对其他小伙伴将有很大的帮助。");

        Youhui.tools.cookie("haitcoupon_vote", voteCookie + "," + id, {
            path: '/',
            domain: Youhui.CookieDomain,
            expires: 864000
        });
    }

    $.ajax({
        url: "/ajax/haitaocouponvote.ashx",
        data: { 'id': id, "type": type },
        type: "POST",
        success: function (json) {
            if (json.code > 0) {
                if ($this.attr('layer') == "float") {
                    $("#percentcount").text(ratecount(rate, val, type));
                    $(".votetotalcount").text(val + 1);
                } else {
                    $this.parent().find(".js-percent").text(ratecount(rate, val, type));
                    $this.parent().find(".js-vote-count").text(val + 1);
                }
            } else {
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) { alert(errorThrown); }
    });
}



function scrollStart() {
    var b = $(".leftWrap .list").length;
    if (b > 0) {
        loadList();
    }
}

function scrollBind() {
    if ($("#channel").length > 0) {
        $(window).bind("scroll", scrollStart);
    }
}

function scrollUnbind() {
    $(window).unbind("scroll", scrollStart);
}

function loadList() {

    var top = $(".leftWrap .list:last").offset().top;
    var reach = $(window).scrollTop() + $(window).height() - $(".leftWrap .list:last").height() - 100;

    var channel = $("#channel").val();

    var func = youhuiListLoad;
    var page_per_load = 3;

    switch (channel) {
        case "youhui":
            func = youhuiListLoad;
            break;

        case "faxian":
            page_per_load = 5;
            func = faxianListLoad;
            break;

        case "haitao":
            page_per_load = 3;
            func = haitaoListLoad;
            break;
    }


    if (reach > top) {
        if (Qmm_config.youhuiInfo.page % page_per_load != 0) {
            func();
        }
    }
}

function noMoreList() {
    //    if ($(".listNoMore").length == 0) {
    //        $(".leftWrap .list:last").after('<p class="listNoMore">对不起，没有更多优惠值得买了</p>');
    //    }

    scrollUnbind();
}


function youhuiListLoad() {
    // 以下url的滚动加载 不在此触发
//    var black = ['danpin'];
//    for (var i = 0; i < black.length; i++) {
//        if (location.pathname.indexOf(black[i]) !== -1) {
//            return false;
//        }
//    }
    // END
    $(".loadingPic").css("display", "block");

    scrollUnbind();

    var ajaxData = $.extend({}, Qmm_config.youhuiInfo);

    $.ajax({
        type: "get",
        url: "/myajax/youhuipage",
        data: ajaxData,
        dataType: "html",
        success: function (html) {
            //current_page = current_page + 1;
            Qmm_config.youhuiInfo.page += 1;
            $(".pagination a").removeClass("pageCurrent");
            $(".JPage_" + Qmm_config.youhuiInfo.page).addClass("pageCurrent");

            $(".loadingPic").css("display", "none");

            if ($(html).find(".list").length == 0) {
                noMoreList();
            } else {
                initZdmListForDuplicateCheck();

                $(html).find(".list").each(function () {
                    var now_zdm_id = parseInt($(this).attr("data-id"));

                    if (now_zdm_id > 0 && zdmListForDuplicateCheck.indexOf(now_zdm_id) < 0) {
                        zdmListForDuplicateCheck.push(now_zdm_id);

                        $(".leftWrap").append($(this).prop("outerHTML"));
                    }
                });

            }

            scrollBind();
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            //alert(errorThrown);
            $(".loadingPic").hide();
            $(".pagination").before('<p class="center" style="padding:30px 0;">很抱歉，您的网络可能有点问题，请尝试使用翻页浏览方式，或者<a id="ajaxErrorRetry">重试</a></p>');
            $("#ajaxErrorRetry").click(function () {
                youhuiListLoad();
                $(this).parent().remove();
            });
        }
    });
}
function faxianListLoad() {
    $(".loadingPic").css("display", "block");

    scrollUnbind();
    //?page=" + (current_page + 1) + "&sort=" + sort + "&category=" + category + "&site=" + site + "&time=" + time + "&area=" + area + "&status=" + status + "&pagesize=" + pagesize,
    var ajaxData = $.extend({}, Qmm_config.youhuiInfo);
    $.ajax({
        type: "get",
        url: "/myajax/faxianpage",
        data: ajaxData,
        dataType: "html",
        success: function (html) {
            // current_page = current_page + 1;
            Qmm_config.youhuiInfo.page += 1;
            $(".pagination a").removeClass("pageCurrent");
            $(".JPage_" + Qmm_config.youhuiInfo.page).addClass("pageCurrent");

            $(".loadingPic").css("display", "none");

            if ($(html).find(".list").length == 0) {
                noMoreList();
            } else {

                initZdmListForDuplicateCheck();

                $(html).find(".list").each(function () {
                    var now_zdm_id = parseInt($(this).attr("data-id"));

                    if (now_zdm_id > 0 && zdmListForDuplicateCheck.indexOf(now_zdm_id) < 0) {
                        zdmListForDuplicateCheck.push(now_zdm_id);

                        $(".discovery_list").append($(this).prop("outerHTML"));
                    }
                });

            }

            scrollBind();
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            //alert(errorThrown);
            $(".loadingPic").hide();
            $(".pagination").before('<p class="center" style="padding:30px 0;">很抱歉，您的网络可能有点问题，请尝试使用翻页浏览方式，或者<a id="ajaxErrorRetry">重试</a></p>');
            $("#ajaxErrorRetry").click(function () {
                faxianListLoad();
                $(this).parent().remove();
            });
        }
    });
}


function haitaoListLoad() {
    $(".loadingPic").css("display", "block");

    scrollUnbind();

    // ?page=" + (current_page + 1) + "&sort=" + sort + "&category=" + category + "&site=" + site + "&time=" + time + "&status=" + status + "&pagesize=" + pagesize,
    var ajaxData = $.extend({}, Qmm_config.youhuiInfo, {
        page: Qmm_config.youhuiInfo.page + 1
    });
    $.ajax({
        type: "get",
        url: "/myajax/haitaopage",
        data: ajaxData,
        dataType: "html",
        success: function (html) {
            // current_page = current_page + 1;
            Qmm_config.youhuiInfo.page += 1;
            $(".pagination a").removeClass("pageCurrent");
            $(".JPage_" + Qmm_config.youhuiInfo.page).addClass("pageCurrent");

            $(".loadingPic").css("display", "none");

            //$(".leftWrap").append(html);

            if ($(html).find(".list").length == 0) {
                noMoreList();
            } else {
                initZdmListForDuplicateCheck();

                $(html).find(".list").each(function () {
                    var now_zdm_id = parseInt($(this).attr("data-id"));

                    if (now_zdm_id > 0 && zdmListForDuplicateCheck.indexOf(now_zdm_id) < 0) {
                        zdmListForDuplicateCheck.push(now_zdm_id);

                        $(".leftWrap").append($(this).prop("outerHTML"));
                    }
                });

            }

            scrollBind();
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            //alert(errorThrown);
            $(".loadingPic").hide();
            $(".pagination").before('<p class="center" style="padding:30px 0;">很抱歉，您的网络可能有点问题，请尝试使用翻页浏览方式，或者<a id="ajaxErrorRetry">重试</a></p>');
            $("#ajaxErrorRetry").click(function () {
                haitaoListLoad();
                $(this).parent().remove();
            });
        }
    });
}

$(function () {

    $(".mobile_upload_entry").hide();
    if ($("#noListLoad").length == 0) {
        scrollBind();
    }
});


(function () { function k(a, b, c) { if (a.addEventListener) a.addEventListener(b, c, false); else a.attachEvent && a.attachEvent("on" + b, c) } function g(a) { if (typeof window.onload != "function") window.onload = a; else { var b = window.onload; window.onload = function () { b(); a() } } } function h() { var a = {}; for (type in { Top: "", Left: "" }) { var b = type == "Top" ? "Y" : "X"; if (typeof window["page" + b + "Offset"] != "undefined") a[type.toLowerCase()] = window["page" + b + "Offset"]; else { b = document.documentElement.clientHeight ? document.documentElement : document.body; a[type.toLowerCase()] = b["scroll" + type] } } return a } function l() { var a = document.body, b; if (window.innerHeight) b = window.innerHeight; else if (a.parentElement.clientHeight) b = a.parentElement.clientHeight; else if (a && a.clientHeight) b = a.clientHeight; return b } function i(a) { this.parent = document.body; this.createEl(this.parent, a); this.size = Math.random() * 5 + 5; this.el.style.width = Math.round(this.size) + "px"; this.el.style.height = Math.round(this.size) + "px"; this.maxLeft = document.body.offsetWidth - this.size; this.maxTop = document.body.offsetHeight - this.size; this.left = Math.random() * this.maxLeft; this.top = h().top + 1; this.angle = 1.4 + 0.2 * Math.random(); this.minAngle = 1.4; this.maxAngle = 1.6; this.angleDelta = 0.01 * Math.random(); this.speed = 2 + Math.random() } var j = false; g(function () { j = true }); var f = true; window.createSnow = function (a, b) { if (j) { var c = [], m = setInterval(function () { f && b > c.length && Math.random() < b * 0.0025 && c.push(new i(a)); !f && !c.length && clearInterval(m); for (var e = h().top, n = l(), d = c.length - 1; d >= 0; d--) if (c[d]) if (c[d].top < e || c[d].top + c[d].size + 1 > e + n) { c[d].remove(); c[d] = null; c.splice(d, 1) } else { c[d].move(); c[d].draw() } }, 40); k(window, "scroll", function () { for (var e = c.length - 1; e >= 0; e--) c[e].draw() }) } else g(function () { createSnow(a, b) }) }; window.removeSnow = function () { f = false }; i.prototype = { createEl: function (a, b) { this.el = document.createElement("img"); this.el.setAttribute("src", "http://img2.icson.com/IcsonPic/Fixed_Template/" + b + "3289_snow" + Math.floor(Math.random() * 4) + ".gif"); this.el.style.position = "absolute"; this.el.style.display = "block"; this.el.style.zIndex = "99999"; this.parent.appendChild(this.el) }, move: function () { if (this.angle < this.minAngle || this.angle > this.maxAngle) this.angleDelta = -this.angleDelta; this.angle += this.angleDelta; this.left += this.speed * Math.cos(this.angle * Math.PI); this.top -= this.speed * Math.sin(this.angle * Math.PI); if (this.left < 0) this.left = this.maxLeft; else if (this.left > this.maxLeft) this.left = 0 }, draw: function () { this.el.style.top = Math.round(this.top) + "px"; this.el.style.left = Math.round(this.left) + "px" }, remove: function () { this.parent.removeChild(this.el); this.parent = this.el = null } } })();


var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-22799670-1']);
_gaq.push(['_setDomainName', '.quanmama.com'])

_gaq.push(['_addOrganic', 'baidu', 'word']);
_gaq.push(['_addOrganic', 'soso', 'w']);
_gaq.push(['_addOrganic', '3721', 'name']);
_gaq.push(['_addOrganic', 'youdao', 'q']);
_gaq.push(['_addOrganic', 'so.360.cn', 'q']);
_gaq.push(['_addOrganic', 'so.com', 'q']);
_gaq.push(['_addOrganic', 'vnet', 'kw']);
_gaq.push(['_addOrganic', 'sogou', 'query']);

_gaq.push(['_trackPageview']);

(function () {
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();

(function () {
    seajs.config({
        vars: {
            'locale': 'zh-cn'
        },
        alias : {
            'CategoryNavBar' : 'CategoryNavBar/index-nav.js',
	        'ninePicRoll' : 'ninePic/index.js',
	        'imgsRollX' : 'imgsRollX/index.js',
	        'triRanksMostClick' : 'triRanksMostClick/index.js',
	        'rightSideFloatFixed' : 'rightSideFloatFixed/index.js'
        },
        base: '/js/seajs/module/',
        charset: 'utf-8'
    });
    $(document).ready(function () {
        var divs, name;
        divs = $("div[sea_module_name]");
        divs.each(function () {
            if (!$(this).attr('sea_module_name_loaded') && $(this).attr('sea_module_name_loaded') != '1') {

                name = $.trim($(this).attr('sea_module_name'));
                name.split(' ').forEach(function (module_name) {
                    seajs.use(sea_module_name[module_name]);
                });
                $(this).attr('sea_module_name_loaded', 1);
            }
        });
    });
})();

$(function () {
    var div = $('#aj-qmm-weixin-dinyue'),
        key = 'aj-close-dinyue';
    if (Youhui.tools.cookie(key) == '1' || $(window).width() < 1050) {
        $(div).hide();
    }
    $(div).find('.aj-close').on('click', function () {
        $(div).fadeOut();
        Youhui.tools.cookie(key, "1", {
            path: '/',
            domain: Youhui.CookieDomain,
            expires: 1
        });
    });
});

$(function () {
    var cid = 'cid',
        cookieName = 'faxianzdm_shoucang';
    function Stamp(div) {
        if (this instanceof Stamp) {
            this.div = div;
            this.initial();
            this.hover();
            this.event();
        } else {
            return new Stamp(div);
        }
    }
    Stamp.prototype = {
        initial: function () {
            this.calculateMaxleft();
        },
        event: function () {
            var that = this;
            $(window).on('resize',
                function () {
                    that.calculateMaxleft();
                });
        },
        hover: function () {
            var html, that = this;
            $(this.div).on("mouseenter mouseleave", '.list',
                function (event) {
                    if (event.type === 'mouseenter') {
                        if (!$(this).attr('aj-has-hover')) {
                            html = $(this).find('.aj-desc').html() + "<div class='aj-stamps aj-stamps-y'>" + $(this).find('.aj-stamps').html() + "</div>";
                            var target = event.target;
                            $(this).find('.aj-desc').html(html);
                            $(this).attr('aj-has-hover', '1');
                        }
                        that.setStyleOfFavor(this);
                        if (that.isLastInline(this)) {
                            $(this).find('.aj-list-inside-wrap').css({
                                'float': 'right'
                            });
                        }
                    } else if (event.type === 'mouseleave') {
                        $(this).find('.aj-favor').css('display', 'none');
                    }
                });
            $(this.div).on('mouseover', '.itemName .black',
                function () {
                    if (!$(this).attr('title')) {
                        $(this).attr('title', $.trim($(this).html()));
                    }
                });
            $(this.div).on('mouseover', '.aj-favor',
                function () {
                    if (!$(this).attr('title') && !$(this).hasClass('aj-have-favor')) {
                        $(this).attr('title', '添加到收藏');
                    } else if ($(this).hasClass('aj-have-favor')) {
                        $(this).attr('title', '取消收藏');
                    }
                });
            $(this.div).on('click', '.aj-favor',
                function () {
                    if ($(this).hasClass('aj-have-favor')) {
                        faxianzdm_shoucang(this, true);
                    }
                    else {
                        faxianzdm_shoucang(this, false);
                    }
                    $(this).toggleClass('aj-have-favor');
                    $(this).removeAttr('title');
                });
        },
        setStyleOfFavor: function (obj) {
            var aTag = $(obj).find('.aj-favor')[0],
                id = $(aTag).attr(cid);
            if (Youhui.tools.cookie(cookieName).indexOf("," + id) !== -1) {
                $(aTag).addClass('aj-have-favor');
            }
            $(aTag).css('display', 'block');
        },
        calculateMaxleft: function () {
            var divs = $(this.div).find('.list'),
                left = 0,
                i;
            if (divs.length < 4) {
                return false;
            }
            for (i = 0; i <= 5; i++) {
                if ($(divs[i]).offset().left >= left) {
                    left = $(divs[i]).offset().left;
                } else {
                    break;
                }
            }
            this.maxLeft = left;
        },
        isLastInline: function (div) {
            return (Math.abs($(div).offset().left - this.maxLeft) < 10) ? true : false;
        }
    };
    var div = $('.discovery_list')[0];
    if (div) {
        Stamp(div);
    }
    function faxianzdm_shoucang(obj, isSc) {

        if (!Youhui.common.user.checklogin()) return false;

        var $this = $(obj),
            id = $this.attr('cid');

        if (isSc) {
            var shoucangCookie = Youhui.tools.cookie("faxianzdm_shoucang");

            if (shoucangCookie.indexOf("," + id) != -1) {
                Youhui.tools.cookie("faxianzdm_shoucang", shoucangCookie.replace("," + id, ""), {
                    path: '/',
                    domain: Youhui.CookieDomain,
                    expires: 864000
                });
            }

            $.ajax({
                url: "/ajax/PostUserAction.ashx",
                data: {
                    'id': id,
                    "type": 101,
                    "ReportText": ''
                },
                type: "POST",
                success: function (json, textStatus) {
                    if (json.code > 0) {
                        floatTips(obj, "取消收藏成功！");
                    } else {
                        floatTips(obj, json.msg);
                    }
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                }
            });
        } else {
            var title = $this.attr('posttilte');

            var shoucangCookie = Youhui.tools.cookie("faxianzdm_shoucang");

            if (shoucangCookie.indexOf("," + id) != -1) {
                floatTips(obj, "您已收藏");
                return;
            } else {
                Youhui.tools.cookie("faxianzdm_shoucang", shoucangCookie + "," + id, {
                    path: '/',
                    domain: Youhui.CookieDomain,
                    expires: 864000
                });
            }

            $.ajax({
                url: "/ajax/PostUserAction.ashx",
                data: {
                    'id': id,
                    "type": 100,
                    "title": title
                },
                type: "POST",
                success: function (json, textStatus) {
                    if (json.code > 0) {
                        floatTips(obj, "已经收藏成功！");
                    } else {
                        floatTips(obj, json.msg);
                    }
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                }
            });
        }
    }
});


/*
* ajax 获取更多列表项
* 该模块控制页面ajax加载post list
* 触发条件 : 页面包含 prop.container 标签
* PPS : main.js还有另一个加载list的模块"youhuiListLoad", 它的触发条件是 $("#channel").length > 0
* */
$(function () {
    var is_inited = 0,
        zdmListForDuplicateCheck = [],
        isThisPageHaveAnyMoreLis = true; //该页是否有更多列表项
    var prop = {
        url: "/myajax/youhuipage",         // ajax请求地址
        backItemClassName: 'div.list',     // 返回的list的选择器
        container: '.aj-ajaxdata-wrap',    // 返回的list装入的容器
        clickParent: '#aj-ajaxdata',       // 导航点击ajax的容器
        delayArea: '.aj-delay-area',       // ajax时要遮盖并显示"转转"的区域选择器 (也是点击底部更多的容器)
        // delayArea 一定要是 container 的父级
        dataBindTag: '.j_load',             // data-params 所绑定的Tag的选择器
        pagesDelter: 4,                     // 每四页从"滚动ajax"切换到"点击ajax"
        bottomWhenAjax: 900,                // 当滚动至距离页面底部900px以下时触发ajax事件
        delayDivClassName: 'delay-roll-' + rand(),   // "转转转"样式div的classname
        delayShadowClassName: 'delay-shadow-' + rand(),     // ajax时的遮罩层
        clickToAjaxClassName: 'getmore-' + rand()         // 点击ajax的className
    };
    if ((typeof Qmm_config === "undefined") || (typeof Qmm_config.youhuiInfo === "undefined")) {
        //console.log("NO Qmm_config or Qmm_config.youhuiInfo");
        return false;
    }

    try {
        // 仅仅在以下频道, 才使用服务端返回的特定字段
        // 因为某些频道的加载  list 的返回结果不一样
        var url_filter = ["/faxian"];
        $.each(url_filter, function (index, item) {
            if (location.pathname.indexOf(item) === 0) {
                prop.url = Qmm_config.youhuiInfo.ajaxUrl;
                prop.backItemClassName = Qmm_config.youhuiInfo.backItemClassName;
            }
        });
    } catch (ex) { }


    function rand() {
        return Math.round(Math.random() * 10000);
    }
    (function initZdmListForDuplicateCheck() {
        if (is_inited == 0) {
            $(prop.backItemClassName).each(function () {
                var zdm_id = parseInt($(this).attr("data-id"));
                if (zdm_id > 0 && zdmListForDuplicateCheck.indexOf(zdm_id) < 0) {
                    zdmListForDuplicateCheck.push(zdm_id);
                }
            });
            is_inited = 1;
        }
    })();
    function Load(youhuiParams, successCallback) {
        youhuiParams = (typeof youhuiParams == 'object') ? youhuiParams : {};
        var ajaxData = $.extend({}, Qmm_config.youhuiInfo, youhuiParams);
        //console.log(ajaxData);
        $.ajax({
            type: "get",
            url: prop.url,
            data: ajaxData,
            dataType: "html",
            success: function (html) {
                Qmm_config.youhuiInfo = ajaxData;
                var backLists = $(html).find(prop.backItemClassName),
                    backNum = backLists.length,
                    buffer = [],
                    now_zdm_id,
                    responseContainer = $(prop.container);
                //console.log(backNum);
                if (backNum === 0 && parseInt(ajaxData.page) === 1) {
                    responseContainer.load("/html/AJ/noContentPageForWap.htm");
                }
                if (backNum > 0) {
                    if (parseInt(Qmm_config.youhuiInfo.page) === 1) {
                        zdmListForDuplicateCheck = [];
                    }
                    backLists.each(function () {
                        now_zdm_id = parseInt($(this).attr("data-id"));
                        if (now_zdm_id > 0 && zdmListForDuplicateCheck.indexOf(now_zdm_id) < 0) {
                            zdmListForDuplicateCheck.push(now_zdm_id);
                            buffer.push($(this).prop("outerHTML"));
                        }
                    });
                    if (parseInt(Qmm_config.youhuiInfo.page, 10) === 1) {
                        responseContainer.html(buffer.join(''));
                    } else {
                        responseContainer.append(buffer.join(''));
                    }
                }
                if (backNum < ajaxData.pagesize) {
                    $("." + prop.clickToAjaxClassName).hide();
                    isThisPageHaveAnyMoreLis = false;
                    responseContainer.append("<div class='aj-no-more-content-pc' style='clear: both;text-align: center;padding: 15px;font-size: 15px;color:#666;'>没有更多内容了</div>");
                }
                Qmm_config.youhuiInfo.page = parseInt(Qmm_config.youhuiInfo.page, 10) + 1;
                successCallback && successCallback();
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                $(prop.container).append('<p class="center" style="padding:30px 0;">很抱歉, 您的网络可能有点问题, 或者<a id="ajaxErrorRetry">重试</a></p>');
            }
        });
    }
    // 点击导航的分页ajax 效果
    (function () {
        var div = $(prop.clickParent);
        if (div.length <= 0) { return false; }
        var ajaxConfig,
            isAjaxNow = false,
            delayContainer = $(prop.delayArea);
        div.on('click', prop.dataBindTag, function (e) {
            e.preventDefault();
            var params = $(this).attr("data-params");
            if (params.length > 0) {
                ajaxConfig = resetYouhuiObj(params);
                ajaxFunc(ajaxConfig);
            }
        });
        function resetYouhuiObj(params) {
            var prop = {},  // string to object
                one,
                result,
                i,
                arr = params.split(";");
            for (i = 0; i < arr.length; i++) {
                one = arr[i].split('=');
                if (one.length > 0) {
                    prop[one[0]] = one[1];
                }
            }
            result = $.extend({}, Qmm_config.pageInfo, prop);
            return result;
        }
        function ajaxFunc(ajaxConfig) {
            if (!isAjaxNow) {
                showDelay();
                isAjaxNow = true;
                if (parseInt(ajaxConfig.page, 10) === 1) {
                    isThisPageHaveAnyMoreLis = true;
                }
                Load(ajaxConfig, function () {
                    isAjaxNow = false;
                    hideDelay();
                });
            }
        }
        function showDelay() {
            if (!delayContainer.hasClass('aj-has-add-delay-module')) {
                if (delayContainer.css('position').toLowerCase() === 'static') {
                    delayContainer.css({
                        position: 'relative'
                    });
                }
                delayContainer.addClass('aj-has-add-delay-module');
                delayContainer.append('<div class="aj-ajax-delay-shadow ' + prop.delayShadowClassName +
                    '"><img src="http://www.quanmama.com/AdminImageUpload/20148150838532.jpg"></div>');
            }
            delayContainer.find('.' + prop.delayShadowClassName).show();
        }
        function hideDelay(container) {
            delayContainer.hasClass('aj-has-add-delay-module') && delayContainer.find('.' + prop.delayShadowClassName).hide();
        }
    } ());
    // 滚动, 点击 ajax 部分
    (function () {
        var win = window,
            doc = document,
            isAjaxNow = false,
            timer,
            container = $(prop.delayArea),
            delter;
        // 每多少页手动点击ajax
        if (typeof Qmm_config === 'undefined') return false;
        var howManyPagesThenClick = prop.pagesDelter;
        if (isLoadByThisModule()) {
            $(win).on('scroll', function () {
                if (!timer) {
                    timer = setTimeout(function () {
                        timer = 0;
                        if (!isThisPageHaveAnyMoreLis) {
                            return false;
                        }
                        if (isCloseBottom()) {
                            if (needAjax()) {
                                ajax();
                                hideClickModule();
                            } else {
                                addAjaxByClickModule();
                                showClickModule();
                            }
                        }
                    }, 200);
                }
            });
        }
        container.on('click', '.' + prop.clickToAjaxClassName, function () {
            ajax();
        });
        function isCloseBottom() {
            delter = $(doc.body).height() - $(win).scrollTop() - $(win).height();
            if (delter <= prop.bottomWhenAjax) {
                return true;
            } else {
                return false;
            }
        }
        function needAjax() {
            if (parseInt(Qmm_config.youhuiInfo.page) % howManyPagesThenClick !== 0) {
                return true;
            } else {
                return false;
            }
        }
        function addAjaxByClickModule() {
            if (!container.hasClass('aj-ajax-by-click')) {
                container.addClass('aj-ajax-by-click');
                container.append("<div style='clear:both;' class='getmore aj-getmore-by-click " + prop.clickToAjaxClassName + "'>加载更多</div>");
            }
        }
        function hideClickModule() {
            $('.' + prop.clickToAjaxClassName).hide();
        }
        function showClickModule() {
            $('.' + prop.clickToAjaxClassName).show();
        }
        function showDelay() {
            if (!container.hasClass('aj-has-add-delay-img')) {
                container.addClass('aj-has-add-delay-img');
                container.append("<div style='clear:both;' class='aj-delay-div-inside " + prop.delayDivClassName + "'><img  class='img' " +
                    "src='http://www.quanmama.com/AdminImageUpload/20148150838532.jpg'></div>");
            }
            container.find("." + prop.delayDivClassName).slideDown();
        }
        function hideDelay() {
            container.find('.' + prop.delayDivClassName).fadeOut();
        }
        function ajax() {
            var ajaxConfig;
            if (!isAjaxNow) {
                ajaxConfig = {};
                isAjaxNow = true;
                showDelay();
                if (Qmm_config.youhuiInfo) {
                    Load(Qmm_config.youhuiInfo, function () {
                        isAjaxNow = false;
                        hideDelay();
                    });
                }
            }
        }
        function isLoadByThisModule() {
            if ($(prop.container).length > 0) {
                return true;
            }
            return false;
        } // 是否由本模块控制 当前页面的ajax加载
    } ());
});
// ajax 获取更多列表项 END

// "一条"样式的导航的点击切换样式JS
$(function () {
    function Nav(div) {
        this.div = div;
        this.init();
    }
    Nav.prototype = {
        init: function () {
            this.event();
            this.resize();
            this.hideMoreIfNoMore();
            this.fixedTop();
        },
        event: function () {
            var that = this;
            this.div.on('click', '.ul-js .li-js', function () {
                $(this).addClass('aj-select').siblings().removeClass('aj-select');
                $(that.div).find('.li-more').removeClass('aj-select');
            });
            this.div.on('click', '.li-more .ul-w-li a', function () {
                that.chooseThis(this)
            });
        },
        resize: function () {
            var ul = this.div.find('.ul-wrap'),
                lis = ul.find('.ul-w-li'),
                width = lis.eq(0).outerWidth(),
                cols;
            cols = Math.floor(lis.length / 2);
            cols = cols < 1 ? 1 : cols;
            cols = cols > 4 ? 4 : cols;
            ul.css({
                width: cols * width + 'px'
            });
            this.div.css({
                width: this.div.width() + 'px'
            });
        },
        chooseThis: function (from) {
            $(from).parents('.li-more').addClass('aj-select').find('.wrap .span').html($(from).html());
            this.div.find('.li-js').removeClass('aj-select');
        },
        hideMoreIfNoMore: function () {
            if (!this.isMoreInLiMore()) {
                this.div.find('.ul-right').hide();
            }
        },
        isMoreInLiMore: function () {
            return this.div.find('li.li-more .ul-wrap .ul-w-li').length > 0 ? true : false;
        },
        fixedTop: function () {
            var timer = 0,
                offset = this.div.offset(),
                top = offset.top,
                left = offset.left,
                increment = 32,
                scrollTop,
                that = this;
            $(window).on('scroll', function () {
                if (!timer) {
                    timer = setTimeout(function () {
                        if (that.div.css('position') === 'static') {
                            top = that.div.offset().top;
                        }
                        scrollTop = $(window).scrollTop();
                        if (scrollTop + increment >= top) {
                            that.div.addClass('aj-fixed');
                        } else {
                            that.div.removeClass('aj-fixed');
                        }
                        timer = 0;
                    }, 200);
                }
            });
            $(that.div).on('aj.rollTop', function () {
                $("html, body").animate({
                    scrollTop: top - 100 + 'px'
                });
            });
            $(that.div).on('click', '.j_load', function () {
                $(that.div).trigger('aj.rollTop');
            });
        }
    };
    var div = $('.aj-pc-nav-o-o'),
        obj;
    if (div.length > 0) {
        obj = new Nav(div);
    }
});

// 使值得买内容中第一张图片自适应
$(function () {
    var img,
        parent,
        haveimg = true,
        top;
    function isPageForThisModule() {
        var box = $('.article_picwrap');
        return box.length === 0 ? false : true;
    }
    if (isPageForThisModule()) {
        img = $('#pagecontent .left_side .zhidemai-content img');
        img = img.filter(function () {
            return $(this).parents('.article_picwrap').length === 0 ? true : false;
        });
        if (img.length > 0) {
            top = img.eq(0).offset().top - $('.left_side').offset().top;
        } else {
            haveimg = false;
        }
    }
    // 如果第一张图片恰好在 分界线 20px 左右时,则可能上面文字内容不足
    if ((Math.abs(top - 380) < 40) && haveimg) {
        img.eq(0).css({
            'maxWidth': "490px"
        });
    }
});