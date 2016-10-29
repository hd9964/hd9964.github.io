/**
* 券妈妈基础对象
* 
* @author  quanmama
* @url     http://www.quanmama.com/
* @name    base.js
* @since   2011-5-18 17:21:10
*/




(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as anonymous module.
        define(['jquery'], factory);
    } else {
        // Browser globals.
        factory(jQuery);
    }
} (function ($) {

    var pluses = /\+/g;

    function raw(s) {
        return s;
    }

    function decoded(s) {
        return decodeURIComponent(s.replace(pluses, ' '));
    }

    function converted(s) {
        if (s.indexOf('"') === 0) {
            // This is a quoted cookie as according to RFC2068, unescape
            s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
        }
        try {
            return config.json ? JSON.parse(s) : s;
        } catch (er) { }
    }

    var config = $.cookie = function (key, value, options) {

        // write
        if (value !== undefined) {
            options = $.extend({}, config.defaults, options);

            if (typeof options.expires === 'number') {
                var days = options.expires, t = options.expires = new Date();
                t.setDate(t.getDate() + days);
            }

            value = config.json ? JSON.stringify(value) : String(value);

            return (document.cookie = [
				config.raw ? key : encodeURIComponent(key),
				'=',
				config.raw ? value : encodeURIComponent(value),
				options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
				options.path ? '; path=' + options.path : '',
				options.domain ? '; domain=' + options.domain : '',
				options.secure ? '; secure' : ''
			].join(''));
        }

        // read
        var decode = config.raw ? raw : decoded;
        var cookies = document.cookie.split('; ');
        var result = key ? undefined : {};
        for (var i = 0, l = cookies.length; i < l; i++) {
            var parts = cookies[i].split('=');
            var name = decode(parts.shift());
            var cookie = decode(parts.join('='));

            if (key && key === name) {
                result = converted(cookie);
                break;
            }

            if (!key) {
                result[name] = converted(cookie);
            }
        }

        return result;
    };

    config.defaults = {};

    $.removeCookie = function (key, options) {
        if ($.cookie(key) !== undefined) {
            // Must not alter options, thus extending a fresh object...
            $.cookie(key, '', $.extend({}, options, { expires: -1 }));
            return true;
        }
        return false;
    };

}));

var Youhui = {
    module: {
        "core.form": "jquery.formvalidator",
        "tools.imgareaselect": "jquery.imgareaselect",
        "tools.marquee": "jquery.marquee",
        "tools.autocomplete": "jquery.autocomplete",
        "core.widget": "widget",
        "tools.zeroclipboard": "zeroclipboard"
    },
    _loadModule: [],
    _loadedModule: [],
    init: function (module, fn) {
        if (arguments.length == 1 && module.constructor == Function) {
            fn = module;
            module = "";
        }
        var flag = [],
        timer = 0,
        overtime = 10, //超时秒数
        arr_module = module.split(",");
        var self = this;
        if (module) {
            $.each(arr_module, function (n, item) {
                if (self._loadModule.unique().include(item)) return;
                self._loadModule.push(item);
                if (!self._loadedModule.include(item)) {
                    self.include(self.RESOURCEURL + "/js/" + self.module[item] + ".js", function () {
                        switch (item) {
                            case "core.form":
                                $.extend(true, $.formValidator.settings, {
                                    alertmessage: false,
                                    autotip: true,
                                    errorfocus: false,
                                    submitonce: false
                                });
                                self._loadedModule.push(item);
                                self.include(self.RESOURCEURL + "/css2/jquery.formvalidator.css");
                                break;
                            case "tools.imgareaselect":
                                self.include(self.RESOURCEURL + "/css2/jquery.imgareaselect.css");
                                self._loadedModule.push(item);
                                break;
                            case "tools.autocomplete":
                                //self.include(self.RESOURCEURL + "/css2/jquery.autocomplete.css");
                                self._loadedModule.push(item);
                                break;
                            default:
                                self._loadedModule.push(item);
                                break;
                        }
                    });
                }
            });
        }
        var checkInterval = setInterval(function () {
            if (this._loadedModule.length == $.merge(this._loadModule, this._loadedModule).unique().length || timer / 10 > overtime) {
                clearInterval(checkInterval);
                typeof fn == "function" ? fn() : eval(fn);
            }
            timer++;
        } .bind(this), 100);
    },
    include: function (url, callback) {
        var afile = url.toLowerCase().replace(/^\s|\s$/g, "").match(/([^\/\\]+)\.(\w+)$/);
        if (!afile) return false;
        switch (afile[2]) {
            case "css":
                var el = $('<link rel="stylesheet" id="' + afile[1] + '" type="text/css" />').appendTo("head").attr("href", url);
                if ($.browser.msie) {
                    el.load(function () {
                        if (typeof callback == 'function') callback();
                    });
                } else {
                    var i = 0;
                    var checkInterval = setInterval(function () {
                        if ($("head>link").index(el) != -1) {
                            if (i < 10) clearInterval(checkInterval)
                            if (typeof callback == 'function') callback();
                            i++;
                        }
                    }, 200);
                }
                break;
            case "js":
                $.ajax({
                    global: false,
                    cache: true,
                    ifModified: false,
                    dataType: "script",
                    url: url,
                    success: callback
                });
                break;
            default:
                break;
        }
    },
    namespace: function (module) {
        var space = module.split('.');
        var s = '';
        for (var i in space) {
            if (space[i].constructor == String) {
                if (0 == s.length)
                    s = space[i];
                else
                    s += '.' + space[i];
                eval("if ((typeof(" + s + ")) == 'undefined') " + s + " = {};");
            }
        }
    },
    register: function (module) {
        var _this = this;
        var _func = function (module) {
            if (module && _this[module]) {
                for (var i in _this[module]) {
                    this[i] = _this[module][i];
                }
            }
            return this;
        };
        return new _func(module);
    },
    tools: {
        copy: function (txt) {
            if (window.clipboardData) {
                window.clipboardData.clearData();
                window.clipboardData.setData("Text", txt);
            } else if (navigator.userAgent.indexOf("Opera") != -1) {
                window.location = txt;
            } else if (window.netscape) {
                try {
                    netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
                } catch (e) {
                    alert("您的firefox安全限制限制您进行剪贴板操作，请打开'about:config'将signed.applets.codebase_principal_support'设置为true'之后重试");
                    return false;
                }
                var clip = Components.classes['@mozilla.org/widget/clipboard;1'].createInstance(Components.interfaces.nsIClipboard);
                if (!clip) return false;
                var trans = Components.classes['@mozilla.org/widget/transferable;1'].createInstance(Components.interfaces.nsITransferable);
                if (!trans) return false;
                trans.addDataFlavor('text/unicode');
                var str = new Object();
                var len = new Object();
                var str = Components.classes['@mozilla.org/supports-string;1'].createInstance(Components.interfaces.nsISupportsString);
                var copytext = txt;
                str.data = copytext;
                trans.setTransferData("text/unicode", str, copytext.length * 2);
                var clipid = Components.interfaces.nsIClipboard;
                if (!clip) return false;
                clip.setData(trans, null, clipid.kGlobalClipboard);
            }
            return true;
        },
        string: {
            format: function () {
                if (arguments.length == 0) return "";
                var args = arguments;
                var str = args[0];
                return str.replace(/\{(\d+)\}/gm, function () {
                    return args[parseInt(arguments[1]) + 1];
                });
            },
            length: function (str) {
                var len = 0;
                for (var i = 0; i < str.length; i++) {
                    if (str.charCodeAt(i) >= 0x4e00 && str.charCodeAt(i) <= 0x9fa5) {
                        len += 2;
                    } else {
                        len++;
                    }
                }
                return len;
            }
        },
        date: {
            format: function (date, mask, utc) {  //格式化日期
                var token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
                timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
                timezoneClip = /[^-+\dA-Z]/g,
                pad = function (val, len) {
                    val = String(val);
                    len = len || 2;
                    while (val.length < len) val = "0" + val;
                    return val;
                };
                this.i18n = {
                    dayNames: [
                    "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat",
                    "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
                    ],
                    monthNames: [
                    "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
                    "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
                    ]
                };
                if (arguments.length == 1 && Object.prototype.toString.call(date) == "[object String]" && !/\d/.test(date)) {
                    mask = date;
                    date = undefined;
                }
                date = date ? new Date(date) : new Date;
                if (isNaN(date)) throw SyntaxError("invalid date");

                mask = mask || "ddd mmm dd yyyy HH:MM:ss";
                if (mask.slice(0, 4) == "UTC:") {
                    mask = mask.slice(4);
                    utc = true;
                }
                var _ = utc ? "getUTC" : "get",
                d = date[_ + "Date"](),
                D = date[_ + "Day"](),
                m = date[_ + "Month"](),
                y = date[_ + "FullYear"](),
                H = date[_ + "Hours"](),
                M = date[_ + "Minutes"](),
                s = date[_ + "Seconds"](),
                L = date[_ + "Milliseconds"](),
                o = utc ? 0 : date.getTimezoneOffset(),
                flags = {
                    d: d,
                    dd: pad(d),
                    ddd: this.i18n.dayNames[D],
                    dddd: this.i18n.dayNames[D + 7],
                    m: m + 1,
                    mm: pad(m + 1),
                    mmm: this.i18n.monthNames[m],
                    mmmm: this.i18n.monthNames[m + 12],
                    yy: String(y).slice(2),
                    yyyy: y,
                    h: H % 12 || 12,
                    hh: pad(H % 12 || 12),
                    H: H,
                    HH: pad(H),
                    M: M,
                    MM: pad(M),
                    s: s,
                    ss: pad(s),
                    l: pad(L, 3),
                    L: pad(L > 99 ? Math.round(L / 10) : L),
                    t: H < 12 ? "a" : "p",
                    tt: H < 12 ? "am" : "pm",
                    T: H < 12 ? "A" : "P",
                    TT: H < 12 ? "AM" : "PM",
                    Z: utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
                    o: (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
                    S: ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10]
                };
                return mask.replace(token, function ($0) {
                    return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
                });
            }
        },
        hashString: function (item) {  //获取中的地址参数
            if (!item) return location.hash.substring(1);
            var sValue = location.hash.match(new RegExp("[\#\&]" + item + "=([^\&]*)(\&?)", "i"));
            sValue = sValue ? sValue[1] : "";
            return sValue == location.hash.substring(1) ? "" : sValue == undefined ? location.hash.substring(1) : decodeURIComponent(sValue);
        },
        cookie: function (name, value, options) {  //COOKIE操作
            if (typeof value != 'undefined') {
                options = options || {};
                if (value === null) {
                    value = '';
                    $.extend({}, options);
                    options.expires = -1;
                }
                var expires = '';
                if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
                    var date;
                    if (typeof options.expires == 'number') {
                        date = new Date();
                        date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
                    } else {
                        date = options.expires;
                    }
                    expires = '; expires=' + date.toUTCString(); // use expires attribute, max-age is not supported by IE
                }
                var path = options.path ? '; path=' + (options.path) : '';
                var domain = options.domain ? '; domain=' + (options.domain) : '';
                var secure = options.secure ? '; secure' : '';
                document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
            } else {
                var cookieValue = '';
                if (document.cookie && document.cookie != '') {
                    var cookies = document.cookie.split(';');
                    for (var i = 0; i < cookies.length; i++) {
                        var cookie = cookies[i].trim();
                        if (cookie.substring(0, name.length + 1) == (name + '=')) {
                            cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                            break;
                        }
                    }
                }
                return cookieValue;
            }
        },
        checkAll: function (obj, elName) { //选中所有
            $(obj).closest("form").find("input:checkbox[name=" + elName + "]").attr("checked", $(obj).attr("checked"));
        },
        insertSelection: function (obj, str) { //在光标位置插入数据 obj为dom元素
            var tc = obj;
            var tclen = tc.value.length;
            tc.focus();
            if (typeof document.selection != "undefined") {
                document.selection.createRange().text = str;
                obj.createTextRange().duplicate().moveStart("character", -str.length);
            } else {
                var m = tc.selectionStart;
                tc.value = tc.value.substr(0, tc.selectionStart) + str + tc.value.substring(tc.selectionStart, tclen);
                tc.selectionStart = m + str.length;
                tc.setSelectionRange(m + str.length, m + str.length);
            }
        },
        addFavourite: function () {  //添加进收藏夹
            var a = "http://www.quanmama.com/?source=favourite";
            var b = "网购优惠券，就上券妈妈！";
            if (document.all) {
                window.external.AddFavorite(a, b)
            } else if (window.sidebar) {
                window.sidebar.addPanel(b, a, "")
            } else {
                Youhui.dialog.notice("对不起，您的浏览器不支持此操作!\n请您拖动该链接到收藏夹或使用Ctrl+D收藏本站。")
            }
        },
        openWindow: function (url, width, height) {  //弹出窗口
            var top = ($(window).height() - height) / 2;
            var left = ($(window).width() - width) / 2;
            var popup = window.open(url, '', 'height=' + height + ', width=' + width + ', toolbar =no, menubar=no, scrollbars=yes, resizable=yes,top=' + top + ',left=' + left + ', location=no, status=no');
            return popup;
        },
        isadmin:0

    },
    widget: {},
    api: {	//AJAX接口调用
        ajax: function (type, action, data, callback, options) {
            if (action != undefined)
                var url = Youhui.SERVICEURL + action;
            else
                var url = location.pathname;
            $.ajax($.extend({
                url: url,
                data: data,
                async: true,
                type: typeof type != "undefined" ? type : "GET",
                //dataType: "json",
                //contentTypeString:"appliction/json; charset=UTF-8",
                ifModified: false,
                //timeout: 8000,
                traditional: true,
                cache: true,
                success: callback,
                //dataFilter: function(data) {
                //return eval("(" + data + ")");
                //},
                error: function () {
                    $("#dialog_loading").remove();
                    return false;
                },
                beforeSend: function (XMLHttpRequest) {
                }
            }, options || {}));
        },
        get: function (action, data, callback, options) {
            this.ajax("GET", action, data, callback, options);
        },
        post: function (action, data, callback, options) {
            this.ajax("POST", action, data, callback, options);
        }
    },
    template: function (tplname, data) {	//模板
        return $("#_" + tplname.toUpperCase() + "_TPL_").html().process(data);
    },
    dialog: {	//模态框
        init: function (options) {
            this.opt = $.extend({
                title: "",
                content: "",
                className: "",
                foot: "",
                width: 420,
                height: "",
                pos: false,
                mask: false,
                close: null,
                blur: false,
                maximize: false,
                minimize: false,
                open: null,
                drag: true,
                buttons: [],
                config: null,
                parentEl: null,
                func: $.noop
            },
            options || {});
            this.buttons = [];
            this._config = $.extend({}, this.config);
            return Youhui.register("dialog");
        },
        _init: function () {
            $("#dialog_loading").remove();
            this.pannel = this.pannel || $('<div />').appendTo(this.opt.parentEl || document.body);
            if (this.opt.mask) {
                this.mask = this.mask || $('<div class="Iframe_HideSelect" scrolling="no" frameborder="0" />').appendTo(document.body).hide();
                if (this.opt.blur) {
                    this.pannel.out("click", this.close.bind(this), true)
                }
            }
            this._createLayer();
        },
        config: {
            title: "div.title",
            head: "div.d_header",
            body: "div.d_body",
            foot: "div.d_footer",
            content: "div.d_content",
            button: "div.d_footer .button",
            closeEl: "a.btn_close",
            frame: "iframe.Iframe_Content",
            dialogBox: "div.dialog",
            mainButtonClass: "submit",
            subButtonsClass: "cancel",
            buttonClass: "button",
            loaddingHtml: "<div class='load-page'></div>"
        },
        _getEls: function () {
            this._els = {
                title: $(this._config.title, this.pannel),
                head: $(this._config.head, this.pannel),
                body: $(this._config.body, this.pannel),
                foot: $(this._config.foot, this.pannel),
                content: $(this._config.content, this.pannel),
                closeEl: $(this._config.closeEl, this.pannel),
                dialogBox: $(this._config.dialogBox, this.pannel)
            }
        },
        _createLayer: function () {
            var _html = [];
            _html.push('<div class="dialog ');
            _html.push(this.opt.className);
            _html.push('" style="width:');
            _html.push(this.opt.width);
            _html.push('px;"><iframe class="maskIframe" scrolling="no" frameborder="0"></iframe><div class="d_layout"><span class="d_tl"><span class="d_tr"><span class="d_br"><span class="d_bl"></span></span></span></span></div><div class="d_main">');
            if (typeof this.opt.title != null) {
                _html.push('<div class="d_header" style="display:none"><div class="d_header_tr"></div><h4 class="title">');
                _html.push(this.opt.title);
                _html.push('</h4>');
                _html.push('<div class="options">');
                if (this.opt.minimize) _html.push('<a href="javascript:void(0)" class="icon btn_minimize" title="最小化"></a>');
                if (this.opt.maximize) _html.push('<a href="javascript:void(0)" class="icon btn_maximize" title="最大化"></a>');
                if (this.opt.close) _html.push('<a href="javascript:void(0)" class="icon btn_close" title="关闭"></a>');
                _html.push('</div></div>');
            }
            _html.push('<div class="d_body" style="height:')
            _html.push(this.opt.height);
            _html.push('px;"><div class="d_content">');
            _html.push(this.opt.content);
            _html.push('</div></div>');
            _html.push('<div class="d_footer">');
            _html.push(this.opt.foot);
            _html.push('</div>');
            _html.push('</div></div>');
            this.pannel.hide().html(_html.join(""));
            this.body = $(this._config.body, this.pannel).length > 0 || this.pannel;
            this._getEls();
            this.setButtons(this.opt.buttons);
            this.inUse = true;
            this._regEvent();
            if (this.opt.foot) {
                this._els.foot.show();
            }
            if (this.opt.title != null && this.opt.title) {
                this._els.head.show();
            }
        },
        resize: function (options) {
            if (options) {
                if (options.width)
                    this._els.dialogBox.width(options.width);
                if (options.height)
                    this._els.body.height(options.height);
            }
            if ($.browser.msie6)
                $(".maskIframe", this.pannel).height(this._els.dialogBox.height() - 4).width(this._els.dialogBox.width() - 4);
            if (this.opt.mask && !$.browser.msie6)
                this._els.dialogBox[0].style.position = "fixed";
            return this;
        },
        _regEvent: function () {
            var _dialog = this._els.dialogBox;
            if (this._els.closeEl && this._els.closeEl.length > 0) {
                this._els.closeEl.click(this.close.bind(this));
            }
            $(document).bind('keydown', this._keyEvent.bindEvent(this));
            $(window).resize(function () {
                if (!this.windowSize) {
                    this.windowSize = {
                        width: $(window).width(),
                        height: $(window).height()
                    };
                }
                if ($.browser.msie) {	//ie resize bug
                    if ($(window).width() == this.windowSize.width && $(window).height() == this.windowSize.height)
                        return;
                }
                this.setPos(this.opt.pos);
            } .bind(this));
            if (this.opt.drag) this._els.head.drag(window, _dialog, {
                x: 10,
                y: 10
            });
        },
        _show: function () {
            this.pannel.show();
            this.resize();
            this.setPos(this.opt.pos);
            if (this.opt.mask) {
                this.mask.show();
            }
            if (this.opt.close && this.opt.close.time) {
                this.close(this.opt.close.time);
            }
            if (this._mainButton != undefined && this.buttons[this._mainButton] && this.buttons[this._mainButton].find('button').length > 0) {
                this.buttons[this._mainButton].find('button').focus();
            }
            if (this.opt.open && this.opt.open.callback) {
                this.opt.open.callback.bind(this)();
            }
            return this;
        },
        _close: function () {
            this.inUse = false;
            if (this.opt.close && this.opt.close.callback) {
                this.opt.close.callback.bind(this)();
            }
            if (this.opt.mask && this.mask && this.mask.length > 0) {
                this.mask.remove();
            }
            if (this.pannel && this.pannel.length > 0) {
                this.pannel.remove();
                this._clearDom();
            }
        },
        _clearDom: function () {
            this._els = null;
            this.body = null;
            this.pannel = null;
            this.buttons = null;
            this.mask = null;
            this.timer = null;
        },
        _keyEvent: function (e) {
            if (e.keyCode == 27 && this.inUse) {
                this.close();
            }
        },
        setClassName: function (name, reset) {
            reset = reset || false;
            if (reset)
                this._els.dialogBox.attr("class", name);
            else
                this._els.dialogBox.addClass(name);
            return this;
        },
        setButtons: function (_buttons) {
            if (_buttons && _buttons != [] && _buttons != {}) {
                if (_buttons.constructor == Object) {
                    _buttons = [_buttons];
                }
                if (_buttons.length > 0) {
                    $.each(_buttons, function (i, item) {
                        if (item && item.constructor == String) {
                            var _title = item;
                            item = {};
                            item.title = _title;
                            item.classType = this._config.subButtonsClass;
                            item.type = '';
                        }
                        if (!item.type) {
                            item.type = '';
                        }
                        if (item && item.constructor == Object) {
                            item.classType = item.type.indexOf("main") > -1 ? this._config.mainButtonClass : this._config.subButtonsClass;
                            item.buttonType = item.form ? item.form : 'button';
                        }

                        this.setFoot($("<span class='button " + item.classType + "'><span><button type='" + item.buttonType + "' title='" + item.title + "'>" + item.title + "</button></span></span>"));
                    } .bind(this));
                }
                var buttons = this.pannel.find(this._config.button);
                if (buttons.length > 0) {
                    this.buttons = [];
                    buttons.each(function (i, item) {
                        if (_buttons[i]) {
                            this.buttons.push($(item));
                            if (_buttons[i].func && _buttons[i].func.constructor == Function) {
                                $(item).click(_buttons[i].func.bind(this));
                            }
                            if (_buttons[i].close == true) {
                                $(item).click(this.close.bind(this));
                            }
                            if (_buttons[i].focus || _buttons[i].type == 'main') {
                                if (this.pannel.is(":visible")) {
                                    $(item).find('button').focus();
                                } else {
                                    this._mainButton = i;
                                }
                            }
                        }
                    } .bind(this));
                }
            } else {
                this.setFoot(this.opt.foot);
                this._mainButton = undefined;
            }
            return this;
        },
        setPos: function (pos) {
            if (!this.inUse) {
                return;
            };
            var pannelBox = (this._els.dialogBox && this._els.dialogBox.length > 0) ? this._els.dialogBox : this.pannel;
            if (pos && pos.left != undefined && pos.top != undefined) {
                this.opt.pos = pos;
                pannelBox.css(pos);
            } else {
                if (this.opt.parentEl) {
                    pannelBox.css({
                        "top": "auto",
                        "left": "auto"
                    });
                } else {
                    var top = pannelBox.offset().top;
                    var dHeight = pannelBox.height() == 0 ? 180 : pannelBox.height();
                    var dWidth = pannelBox.width() == 0 ? 180 : pannelBox.width();
                    var bHeight = $(window).height();
                    var bWidth = $(window).width();
                    var bTop = (this.opt.mask && !$.browser.msie6) ? 0 : $(document).scrollTop();
                    pannelBox.css("left", (bWidth - dWidth) / 2 + "px");
                    if (dHeight < bHeight - 30) {
                        pannelBox.css("top", (bHeight - dHeight) / 2 - 30 + bTop + "px");
                    } else {
                        pannelBox.css("top", "30px");
                    }
                }
            }
            return this;
        },
        setTitle: function (html) {
            if (this._els.title && this._els.title.length > 0) {
                this._els.title.html(html);
            }
            return this;
        },
        setFoot: function (html) {
            if (this._els.foot && this._els.foot.length > 0) {
                if ((html.constructor == Object && html.length == 0) || (html.constructor == String && html.trim() == "")) {
                    this._els.foot.empty().hide();
                    this._mainButton = null;
                    return this;
                } else {
                    this._els.foot.show();
                }
                if (html.constructor == Object)
                    this._els.foot.append(html);
                else {
                    this._els.foot.html(html);
                }
            }
            return this;
        },
        setContent: function (html) {
            if (this._els.body && this._els.body.length > 0) {
                if (html.constructor == Object)
                    this._els.content.append(html);
                else
                    this._els.content.html(html);
            }
            this.setPos(this.opt.pos);
            var _iframe = this._els.content.find(this.config.frame);
            if (_iframe.length > 0) {
                _iframe.css('height', this.opt.height + "px");
            }
            return this;
        },
        setHtml: function (html) {
            if (this._els.body && this._els.body.length > 0) {
                this._els.body.empty().append(html);
            }
            this.setPos(this.opt.pos);
            var _iframe = this._els.body.find(this.config.frame);
            if (_iframe.length > 0) {
                _iframe.css('height', this.opt.height + "px");
            }
            return this;
        },
        _optionsExtend: function (opt, options) {
            var _options = options;
            if (options.buttons) {
                var _temp = _options.buttons;
                delete _options.buttons;
                if (_temp.constructor == Array) {
                    if (!opt.buttons) {
                        opt.buttons = [];
                    } else if (opt.buttons.constructor == Object) {
                        opt.buttons = [opt.buttons];
                    };
                    for (var i = 0; i < _temp.length; i++) {
                        opt.buttons[i] = $.extend(opt.buttons[i], _temp[i]);
                    }
                } else if (_temp.constructor == Object) {
                    if (!opt.buttons) {
                        opt.buttons = {};
                    };
                    opt.buttons = $.extend(opt.buttons, _temp)
                }
            };
            if (options.close) {
                var _temp = _options.close;
                delete _options.close;
                if (!opt.close) {
                    opt.close = {}
                };
                opt.close = $.extend(opt.close, _temp);
            };
            return $.extend(opt, _options);
        },
        show: function () {
            if (this.timer) clearTimeout(this.timer);
            if (this.opt.open && this.opt.open.time) {
                this.show.timeout(this.opt.open.time);
            } else {
                this._show();
            }
            if (this.opt.mask) $(document).bind("DOMMouseScroll.dialog", function () {
                return false;
            });
            this.hideStatus = false;
            return this;
        },
        hide: function (time) {
            if (time && time.constructor == Number) {
                this.timer = this.hide.bind(this).timeout(time);
                return;
            }
            this.pannel.hide();
            if (this.mask) {
                this.mask.hide();
            }
            if (this.opt.mask) $(document).unbind("DOMMouseScroll.dialog");
            this.hideStatus = true;
            return this;
        },
        toggle: function () {
            if (this.hideStatus)
                return this.show();
            else
                return this.hide();
        },
        close: function (time) {
            if (time && time.constructor == Number) {
                if (!$.browser.msie && this.opt.close.duration) {
                    this.timer = function () {
                        this._els.dialogBox.animate({
                            opacity: 0.1
                        }, function () {
                            this.close.bind(this)();
                        } .bind(this));
                    } .bind(this).timeout(time);
                } else {
                    this.timer = this.close.bind(this).timeout(time);
                }
                return;
            }
            if (this.opt.mask) $(document).unbind("DOMMouseScroll.dialog");
            clearTimeout(this.timer);
            this._close();
            return false;
        },
        setClose: function (num) {
            var _num = num || 2;
            setTimeout(function () {
                this.close();
            } .bind(this), _num * 1000);
        },
        setCloseOptions: function (options) {
            if (!this.opt) this.opt = {};
            this.opt.close = options
        },
        alert: function (info, options) {  //弹出提示框
            var _this = this.init();
            var options = options || {};
            _this.opt.content = info;
            _this.opt.mask = true;
            _this.opt.buttons = {
                title: '确定',
                type: 'main',
                close: true,
                func: options.callback || $.noop
            };
            _this.opt.title = "提示";
            _this._optionsExtend(_this.opt, options);
            _this._init();
            _this.show();
            return _this;
        },
        notice: function (info, options) { //提示窗口，自动关闭
            var _this = this.init();
            var options = options || {};
            _this.opt.content = info;
            _this.opt.mask = true;
            _this.opt.close = {
                duration: true,
                time: 2.5
            };
            _this.opt.buttons = {
                title: '关闭',
                type: 'main',
                close: true,
                func: options.callback || $.noop
            };
            _this.opt.title = "提示";
            _this._optionsExtend(_this.opt, options);
            _this._init();
            _this.show();
            return _this;
        },
        confirm: function (info, options) {  //确认窗口
            var _this = this.init();
            var options = options || {};
            _this.opt.content = info;
            _this.opt.mask = true;
            _this.opt.buttons = [{
                title: '确定',
                type: 'main',
                close: true,
                func: options.yes || $.noop
            },
            {
                title: '取消',
                type: 'cancel',
                close: true,
                func: options.no || $.noop
            }
            ];
            _this.opt.title = "提示";
            _this._optionsExtend(_this.opt, options);
            _this._init();
            _this.show();
            return _this;
        },
        confirmNew: function (info, footer, options) {  //确认窗口
            var _this = this.init();
            var options = options || {};
            _this.opt.content = info;
            _this.opt.footer = footer;
            _this.opt.mask = true;
            _this.opt.buttons = [{
                title: '确定',
                type: 'main',
                close: true,
                func: options.yes || $.noop
            },
            {
                title: '取消',
                type: 'cancel',
                close: true,
                func: options.no || $.noop
            }
            ];
            _this.opt.title = "提示";
            _this._optionsExtend(_this.opt, options);
            _this._init();
            _this.show();
            return _this;
        },
        loading: function (title, options) {
            var _this = this.init();
            var options = options || {};
            _this.opt.title = title || "加载中...";
            _this.opt.drag = false;
            _this.opt.content = _this._config.loaddingHtml;
            _this.opt.close = {};
            _this.opt.buttons = [];
            _this._optionsExtend(_this.opt, options);
            _this._init();
            _this.pannel.attr("id", "dialog_loading");
            _this.show();
            return _this;
        },
        ajax: function (title, options) { //AJAX加载内容到窗口
            var _this = this.init();
            var options = options || {};
            if (options.action) {
                if (title) {
                    _this.opt.title = title;
                }
                _this.opt.content = _this._config.loaddingHtml;
                _this.opt.mask = true;
                _this.opt.close = {};
                _this._optionsExtend(_this.opt, options);
                _this._init();
                _this.show();
                Youhui.api.get(options.action, options.params || {}, function (html) {
                    if (!this) return;
                    this.setContent(html);
                    this.show();
                } .bind(_this), {
                    dataType: "text/html"
                });
            }
            return _this;
        },
        layer: function (title, options) { //以页面内容形式
            var _this = this.init();
            var options = options || {};
            _this.opt.title = title;
            _this.opt.close = true;
            var olayer = $(options.content);
            options.content = "";
            _this._optionsExtend(_this.opt, options);
            _this._init();
            if (olayer.data("tpl_dialog") == null) {
                if ($.browser.msie) {
                    //olayer.data("tpl_dialog", olayer.contents().clone(true)).empty();
                } else {
                    olayer.data("tpl_dialog", olayer.contents().clone(true)).empty();
                }
            }
            var content = $.browser.msie ? olayer : olayer.data("tpl_dialog");
            _this.setHtml(content);
            if (options.footer && options.footer.length > 0) {
                _this.setFoot(options.footer);
            }
            _this.show();
            return _this;
        },
        iframe: function (title, options) { //以iframe形式
            var _this = this.init();
            if (options.url) {
                var options = options || {};
                if (title) {
                    this.opt.title = title;
                }
                _this.opt.close = {};
                _this.opt.mask = true;
                _this.opt.content = _this._config.loaddingHtml;
                _this.opt.buttons = options.buttons || [];
                _this._optionsExtend(_this.opt, options);
                _this._init();
                _this.show();
                $(_this._config.loaddingHtml, _this.dialogBox).remove();
                _this.setHtml($('<iframe />', {
                    "class": "Iframe_Content",
                    "src": options.url,
                    "css": {
                        "border": "none",
                        "width": "100%"
                    },
                    "frameborder": "0"
                }).clone());
            }
            return _this;
        },
        tooltip: function (tiptype, title, options) {  //提示框
            options = $.extend({
                mask: false,
                className: "tooltip",
                drag: false,
                buttons: []
            }, options || {});
            return this[tiptype](title, options);
        },
        suggest: function (info, options) { //通知操作结果
            var _this = this.init();
            _this.opt.title = "";
            _this.opt.content = "";
            _this.opt.mask = false;
            _this.opt.width = 230;
            _this.opt.close = null;
            _this.opt.head = null;
            _this.opt.drag = false;
            _this.opt.className = "suggest";
            _this._optionsExtend(_this.opt, options || {});
            _this._init();
            _this.setHtml(info);
            _this.show();
            var bTop = $(document).scrollTop();
            _this._els.dialogBox.stop(true, true).css({
                "top": ($(window).height() - _this.pannel.height()) / 4 * 3 + bTop,
                "opacity": 0.1
            }).animate({
                "opacity": 1,
                "top": _this._els.dialogBox.position().top - 30
            }, 800, function () {
                this._els.dialogBox.delay(1200).animate({
                    "opacity": 0.1,
                    "top": this._els.dialogBox.position().top - 30
                }, 1200, function () {
                    this.close();
                } .bind(this))
            } .bind(_this));
            return _this;
        }
    },
    tabs: {	//选项卡
        bind: function (obj, cobj) {
            //普通选项卡切换
            $("ul:eq(0)>li", obj).live("hover", function () {
                var _class = this.className.split(" ");
                if ($.inArray("none", _class) == -1 && $.inArray("more", _class) == -1) {
                    var _index = $(this).parent().children(":not(.more,.none)").index($(this).addClass("current").siblings().removeClass("current").end()[0]);
                    //var tab_content = $(obj).siblings(cobj);//取消同级参考
                    var tab_content = $(cobj);
                    if (tab_content.length > 0)
                        tab_content.hide().eq(_index).show();
                }
            });
            //子选项卡
            $("ul.tabs_sub>li>a", obj).live("hover", function () {
                var _this = $(this).parent();
                var _class = _this[0].className.split(" ");
                if ($.inArray("none", _class) == -1) {
                    _this.addClass("curr").siblings().removeClass("curr");
                }
            });
            //更多
            if ($(".more_list li", obj).length > 0) {
                $("li.more>a:eq(0)", obj).click(function () {
                    var _this = $(".more_list", obj);
                    _this.toggle().out("click", function (e) {
                        var found = $(e.target).closest(_this).length || e.target == this;
                        if (found == 0) _this.hide();
                    } .bind(this), true);
                });
            }
        }
    },
    form: {
        bindDefault: function (obj) {
            $(obj || "input.default,textarea.default").live("focus", function () {
                if (this.value == this.defaultValue) {
                    this.value = '';
                    this.style.color = "#000";
                }
            }).live("blur", function () {
                if (this.value == '') {
                    this.value = this.defaultValue;
                    this.style.color = '#ccc';
                }
            });
        },
        bindFocus: function (obj) {
            $(obj || "input.text,textarea.textarea").live("focus", function () {
                $(this).addClass("focus");
            }).live("blur", function () {
                $(this).removeClass("focus");
            });
        },
        isInputNull: function (obj) {
            obj = $(obj);
            if (obj.length == 0) return false;
            var _value = obj.val().trim();
            if (_value == "" || _value == obj[0].defaultValue) {
                return true;
            }
            return false;
        },
        bindSelect: function (obj) {
            var self = $(obj);
            var box = $('<div class="dropselectbox" />').appendTo(self.hide().wrap('<div class="dropdown" />').parent());
            $('<h4><span class="symbol arrow">▼</span><strong>' + self.children("option:selected").text() + '</strong></h4>').hover(function () {
                $(this).toggleClass("hover", option.is(":visible") ? true : null);
            }).appendTo(box).one("click", function () {
                self.children("option").each(function (i, item) {
                    $('<li><a href="javascript:void(0)">' + $(item).text() + '</a></li>').appendTo(option).click(function () {
                        option.prev().children("strong").html($(item).text());
                        self.val(item.value).change();
                        option.hide();
                    });
                });
            }).click(function () {
                option.toggle();
            }).out("click", function () {
                $(this).removeClass("hover");
                option.hide();
            }, true);
            var option = $('<ul />').appendTo(box);
        }
    },
    pager: {	//分页控件
        init: function (obj, options) {
            this.element = $(obj);
            this.opt = $.extend({
                pageindex: 1,
                pagesize: 10,
                totalcount: -1,
                type: "numeric", //text
                total: false,
                skip: false,
                breakpage: 3,
                ajaxload: false
            }, options || {});
            return Youhui.register("pager");
        },
        bind: function (obj, options) {
            var _this = this.init(obj, options);
            if (_this.opt.pageindex < 1) _this.opt.pageindex = 1;
            if (_this.opt.totalcount > -1) {
                _this.opt.pagecount = Math.ceil(_this.opt.totalcount / _this.opt.pagesize);
                if (_this.opt.pageindex > _this.opt.pagecount) _this.opt.pageindex = _this.opt.pagecount;
            } else {
                _this.opt.pagecount = 99999;
            }
            if (_this.opt.breakpage > _this.opt.pagecount - 2) {
                _this.opt.breakpage = _this.opt.pagecount - 2;
                _ellipsis = [true, true];
            } else {
                _ellipsis = [false, false];
            }
            var _html = [];
            if (_this.opt.pagecount > 1 || _this.opt.total)
                _html.push('<div class="pager ' + (_this.opt.type == "numeric" ? "pager_numeric" : "") + '">\n');
            if (_this.opt.total) {
                _html.push('<div class="p_options">');
                _html.push('<span class="p_ptotal">' + _this.opt.pageindex + '页/' + _this.opt.pagecount + '页</span>\n');
                _html.push('<span class="p_total">共' + _this.opt.totalcount + '条</span>\n');
                _html.push('</div>');
            }
            if (_this.opt.pagecount > 1) {
                if (_this.opt.type == "text") {
                    if (_this.opt.pageindex > 1) {
                        if (_this.opt.pagecount < 9999) _html.push('<a class="p_start" href="' + _this._getUrl(1) + '">首页</a>\n');
                        _html.push('<a class="p_prev" href="' + _this._getUrl(_this.opt.pageindex - 1) + '">上一页</a>\n');
                    }
                    if (_this.opt.pageindex != _this.opt.pagecount) {
                        _html.push('<a class="p_next" href="' + _this._getUrl(_this.opt.pageindex + 1) + '">下一页</a>\n');
                        if (_this.opt.pagecount < 9999) _html.push('<a class="p_end" href="' + _this._getUrl(_this.opt.pagecount) + '">尾页</a>\n');
                    }
                }
                if (_this.opt.type == "numeric") {
                    if (_this.opt.pageindex > 1) {	//第一页
                        _html.push('<a class="p_prev" href="' + _this._getUrl(_this.opt.pageindex - 1) + '">上页</a>\n');
                    }
                    var _page = [1, _this.opt.pagecount, _this.opt.pageindex, _this.opt.pageindex - 1, _this.opt.pageindex + 1];
                    _page = $.grep(_page, function (item, i) {
                        return item > 0 && item <= _this.opt.pagecount;
                    }).unique();
                    var _count = _page.length;
                    for (var i = 1; i <= _this.opt.breakpage + 2 - _count; i++) {
                        _page.push(_this.opt.pageindex + (_this.opt.pageindex + i < _this.opt.pagecount ? i + 1 : -i - 1));
                    }
                    _page = _page.sort(function sortNumber(a, b) {
                        return a - b;
                    }).unique();
                    var title = "";
                    $.each(_page, function (i, item) {
                        if (this.opt.pageindex == item) {
                            _html.push('<strong>' + item + '</strong>\n');
                        } else {
                            if (item == 1) {
                                title = "首页";
                            } else if (item == _this.opt.pagecount) {
                                title = "尾页";
                            } else {
                                title = "第" + item + "页";
                            }
                            if (_ellipsis[1] == false && this.opt.pageindex <= this.opt.pagecount - this.opt.breakpage && this.opt.pagecount == item) {
                                _html.push('<span>...</span>\n');
                                _ellipsis[1] = true;
                            }
                            _html.push('<a class="p_start" href="' + this._getUrl(item) + '" title="' + title + '">' + item + '</a>\n');
                            if (_ellipsis[0] == false && this.opt.pageindex > this.opt.breakpage) {
                                _html.push('<span>...</span>\n');
                                _ellipsis[0] = true;
                            }
                        }
                    } .bind(_this));
                    if (_this.opt.pageindex < _this.opt.pagecount) {
                        _html.push('<a class="p_next" href="' + _this._getUrl(_this.opt.pageindex + 1) + '">下页</a>\n');
                    }
                }
                if (_this.opt.skip) {
                    _html.push('<div class="p_skip">跳转到:');
                    _html.push('<input type="text" class="p_text" maxlength="8" onclick="this.select()" size="3" name="page" value="' + _this.opt.pageindex + '" />');
                    _html.push('<button class="p_btn" onclick="location.href=\'' + _this._getUrl() + '\'">GO</button>');
                    _html.push('</div>');
                }
            }
            if (_this.opt.pagecount > 1 || _this.opt.total)
                _html.push('</div>');
            _this.element.html(_html.join(""));
        },
        _getUrl: function (page) {
            if (this.opt.ajaxload) {
                return "javascript:goPageIndex(" + page + ");";
            }
            var _url = location.pathname + "?";
            if (page && page.constructor == Number) {
                if (page <= 0) page = 1;
                return _url + Youhui.params.set({
                    page: page
                }).serialize() + location.hash;
            }
            return _url + location.hash;
        },
        goPageIndex: function (page) {
            this.element.html("数据加载中...");
            this.bind(this.element, $.extend(this.opt, {
                pageindex: page
            }));
        }
    },
    params: {	//参数操作
        init: function (url) {
            this.list = {};
            $.each(location.search.match(/(?:[\?|\&])[^\=]+=[^\&|#|$]*/gi) || [], function (n, item) {
                var _item = item.substring(1);
                var _key = _item.split("=", 1)[0];
                var _value = _item.replace(eval("/" + _key + "=/i"), "");
                this.list[_key.toLowerCase()] = _value;
            } .bind(this));
            return this;
        },
        get: function (item) {
            if (typeof this.list == "undefined") this.init();
            var _item = this.list[item.toLowerCase()];
            return _item ? _item : "";
        },
        set: function (options) {
            if (typeof this.list == "undefined") this.init();
            this.list = $.extend(true, this.list, options || {});
            return this;
        },
        serialize: function () {
            if (typeof this.list == "undefined") this.init();
            return $.param(this.list);
        }
    },
    delayLoader: { //延迟加载
        init: function (options) {
            var opt = $.extend({
                srcname: 'drc',
                elements: "img",
                threshold: 0,
                placeholder: '/images/b.gif',
                failurelimit: 1,
                event: "scroll",
                direction: 1, //0:横、纵   1:纵   2:横
                effect: "fadeIn",
                effectspeed: 0,
                container: window
            }, options || {});
            var _this = this;

            var _elements = opt.elements;
            opt.elements = $(opt.elements + "[" + opt.srcname + "]");

            opt.container = $(opt.container);
            if (opt.event == "scroll") {
                $(opt.container).bind("scroll.loader resize.loader", function (event) {

                    opt.elements.each(function () {
                        if (_this._scrollY(this, opt)) {//&& _this._scrollX(this, opt)
                            if (!this.loaded) {
                                this.src = this.getAttribute(opt.srcname);
                                this.removeAttribute(opt.srcname);
                                this.loaded = true;
                                //alert($(this).parent().html());
                                if (_elements != "img" && $.browser.msie) {
                                    $(this).css("width", "auto");
                                }
                            }
                        }
                    });

                    var temp = $.grep(opt.elements, function (element) {
                        return !element.loaded;
                    });
                    opt.elements = $(temp);
                });
            }

            //首屏
            opt.container.triggerHandler(opt.event);
            return this;
        },
        _scrollY: function (element, opt) {
            if (opt.direction == 0 || opt.direction == 1) {
                var fold = 0;
                if (opt.container[0] === window) {
                    fold = $(window).height() + $(window).scrollTop();
                } else {
                    fold = opt.container.offset().top + opt.container.height();
                }
                return fold > $(element).offset().top - opt.threshold;
            } else {
                return true;
            }
        },
        _scrollX: function (element, opt) {
            if (opt.direction == 0 || opt.direction == 2) {
                var fold = 0;
                if (opt.container[0] === window) {
                    fold = $(window).width() + $(window).scrollLeft();
                } else {
                    fold = opt.container.offset().left + opt.container.width();
                }
                return fold > $(element).offset().left - opt.threshold;
            } else {
                return true;
            }
        }
    }
};

jQuery.extend({
    out: function (el, name, func, canMore) {
        var callback = function (e) {
            var src = e.target || e.srcElement;
            var isIn = false;
            while (src) {
                if (src == el) {
                    isIn = true;
                    break;
                }
                src = src.parentNode;
            }
            if (!isIn) {
                func.call(el, e);
                if (!canMore) {
                    jQuery.event.remove(document.body, name, c);
                    if (el._EVENT && el._EVENT.out && el._EVENT.out.length) {
                        var arr = el._EVENT.out;
                        for (var i = 0, il = arr.length; i < il; i++) {
                            if (arr[i].efunc == c && arr[i].name == name) {
                                arr.splice(i, 1);
                                return;
                            }
                        }
                    }
                }
            }
        }
        var c = callback.bindEvent(window);
        if (!el._EVENT) {
            el._EVENT = {
                out: []
            }
        }
        el._EVENT.out.push({
            name: name,
            func: func,
            efunc: c
        });
        jQuery.event.add(document.body, name, c);
    },
    unout: function (el, name, func) {
        if (el._EVENT && el._EVENT.out && el._EVENT.out.length) {
            var arr = el._EVENT.out;
            for (var i = 0, il = arr.length; i < il; i++) {
                if ((func == undefined || arr[i].func == func) && arr[i].name == name) {
                    jQuery.event.remove(document.body, name, arr[i].efunc);
                    arr.splice(i, 1);
                    return;
                }
            }
        }
    }
});


jQuery.fn.extend({	//jQuery 扩展
    drag: function (position, target, offset) {
        target = jQuery(target || this);
        position = position || window;
        offset = offset || {
            x: 0,
            y: 0
        };
        return this.css("cursor", "move").bind("mousedown.drag", function (e) {
            e.preventDefault();
            e.stopPropagation();
            //if (e.which && (e.which != 1)) return;
            //if (e.originalEvent.mouseHandled) { return; }
            if (document.defaultView) {
                var _top = document.defaultView.getComputedStyle(target[0], null).getPropertyValue("top");
                var _left = document.defaultView.getComputedStyle(target[0], null).getPropertyValue("left");
            } else {
                if (target[0].currentStyle) {
                    var _top = target.css("top");
                    var _left = target.css("left");
                }
            }
            var width = target.outerWidth(),
            height = target.outerHeight();
            if (position == window) {
                var mainW = jQuery(position).width() - offset.x,
                mainH = jQuery(position).height() - offset.y;
            } else {
                var mainW = jQuery(position).outerWidth() - offset.x,
                mainH = jQuery(position).outerHeight() - offset.y;
            }
            target.posX = e.pageX - parseInt(_left);
            target.posY = e.pageY - parseInt(_top);
            if (target[0].setCapture) target[0].setCapture();
            else if (window.captureEvents) window.captureEvents(Event.MOUSEMOVE | Event.MOUSEUP);
            jQuery(document).unbind(".drag").bind("mousemove.drag", function (e) {
                var posX = e.pageX - target.posX,
                posY = e.pageY - target.posY;
                target.css({
                    left: function () {
                        if (posX > 0 && posX + width < mainW)
                            return posX;
                        else if (posX <= 0)
                            return offset.x;
                        else if (posX + width >= mainW)
                            return mainW - width
                    },
                    top: function () {
                        if (posY > 0 && posY + height < mainH)
                            return posY;
                        else if (posY <= 0)
                            return offset.y;
                        else if (posY + height >= mainH)
                            return mainH - height;
                    }
                });
            }).bind("mouseup.drag", function (e) {
                if (target[0].releaseCapture) target[0].releaseCapture();
                else if (window.releaseEvents) window.releaseEvents(Event.MOUSEMOVE | Event.MOUSEUP);
                jQuery(this).unbind(".drag");
            });
        });
    },
    out: function (name, listener, canMore) {
        return this.each(function () {
            jQuery.out(this, name, listener, canMore);
        });
    },
    unout: function (name, listener) {
        return this.each(function () {
            jQuery.unout(this, name, listener);
        });
    },
    scrolling: function (options, func) {
        var defaults = {
            target: 1,
            timer: 1000,
            offset: 0
        };
        func = func || $.noop;
        var o = jQuery.extend(defaults, options || {});
        this.each(function (i) {
            switch (o.target) {
                case 1:
                    var targetTop = jQuery(this).offset().top + o.offset;
                    jQuery("html,body").animate({
                        scrollTop: targetTop
                    }, o.timer, func.bind(this));
                    break;
                case 2:
                    var targetLeft = jQuery(this).offset().left + o.offset;
                    jQuery("html,body").animate({
                        scrollLeft: targetLeft
                    }, o.timer, func.bind(this));
                    break;
            }
            return false;
        });
        return this;
    }
});
$.browser = {}
$.browser.mozilla = /firefox/.test(navigator.userAgent.toLowerCase());
$.browser.webkit = /webkit/.test(navigator.userAgent.toLowerCase());
$.browser.opera = /opera/.test(navigator.userAgent.toLowerCase());
$.browser.msie = /msie/.test(navigator.userAgent.toLowerCase()); ;
$.browser.msie6 = $.browser.msie && /MSIE 6\.0/i.test(window.navigator.userAgent) && !/MSIE 7\.0/i.test(window.navigator.userAgent);


//函数扩展
Function.prototype.bind = function () {	//绑定域
    var method = this,
    _this = arguments[0],
    args = [];
    for (var i = 1,
        il = arguments.length; i < il; i++) {
        args.push(arguments[i]);
    }
    return function () {
        var thisArgs = args.concat();
        for (var i = 0,
            il = arguments.length; i < il; i++) {
            thisArgs.push(arguments[i]);
        }
        return method.apply(_this, thisArgs);
    };
};
Function.prototype.timeout = function (time) {	//延时执行
    if ($.browser.mozilla) {
        var f = this;
        return setTimeout(function () {
            f();
        },
        time * 1000);
    }
    return setTimeout(this, time * 1000);
};
Function.prototype.interval = function (time) {	//循环执行
    return setInterval(this, time * 1000);
};
Function.prototype.bindEvent = function () {	//绑定Event
    var method = this,
    _this = arguments[0],
    args = [];
    for (var i = 1,
        il = arguments.length; i < il; i++) {
        args.push(arguments[i]);
    }
    return function (e) {
        var thisArgs = args.concat();
        thisArgs.unshift(e || window.event);
        return method.apply(_this, thisArgs);
    };
};

//数组扩展
Array.prototype.include = function (value) {		//是否包含
    if (this.constructor != Array) return;
    return this.index(value) != -1;
};
Array.prototype.index = function (value) {	//查找值索引
    for (var i = 0,
        il = this.length; i < il; i++) {
        if (this[i] == value) return i;
    }
    return -1;
};
Array.prototype.unique = function () {	//删除重复
    for (var i = 0; i < this.length; i++) {
        var it = this[i];
        for (var j = this.length - 1; j > i; j--) {
            if (this[j] == it) this.splice(j, 1);
        }
    }
    return this;
};
Array.prototype.del = function (obj) {	//删除元素
    if (this.constructor != Array) return;
    var index = this.index(obj);
    if (index >= 0 && index < this.length) {
        this.splice(index, 1);
    }
    return this;
};

//字符串扩展
String.prototype.trim = function () {		//是否包含
    return $.trim(this);
};

if (!Array.prototype.forEach) {
  Array.prototype.forEach = function (fun /*, thisp*/) {
        var len = this.length;
        if (typeof fun != "function")
            throw new TypeError();

        var thisp = arguments[1];
        for (var i = 0; i < len; i++) {
            if (i in this)
                fun.call(thisp, this[i], i, this);
        }
    };
} 

function adminAlert(msg) {
    if (typeof (Youhui) == "undefined" || Youhui.isadmin != 1) {
        return;
    }

    var alertArea = '<div class="alertArea" style="max-width:200px;border-style: solid; border-width: 1px; border-color: red;top:100px;right:5px;position:fixed;z-index:200;" ></div>';

    if ($(".alertArea").length == 0) {
        $("body").append(alertArea);
    }

    $(".alertArea").html(msg + "<br/>" + $(".alertArea").html());
}


function redirectForMobile() {
    return;
}


var qfs = {
    copy2Clipboard: function (txt) {
        if (window.clipboardData) {
            window.clipboardData.clearData();
            window.clipboardData.setData("Text", txt);
        }
        else if (navigator.userAgent.indexOf("Opera") != -1) {
            window.location = txt;
        }
        else if (window.netscape) {
            try {
                netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
            }
            catch (e) {
                //alert("您的firefox安全限制限制您进行剪贴板操作，请打开’about:config’将signed.applets.codebase_principal_support’设置为true’之后重试，相对路径为firefox根目录/greprefs/all.js");
                return false;
            }
            var clip = Components.classes['@mozilla.org/widget/clipboard;1'].createInstance(Components.interfaces.nsIClipboard);
            if (!clip) return;
            var trans = Components.classes['@mozilla.org/widget/transferable;1'].createInstance(Components.interfaces.nsITransferable);
            if (!trans) return;
            trans.addDataFlavor('text/unicode');
            var str = new Object();
            var len = new Object();
            var str = Components.classes["@mozilla.org/supports-string;1"].createInstance(Components.interfaces.nsISupportsString);
            var copytext = txt; str.data = copytext;
            trans.setTransferData("text/unicode", str, copytext.length * 2);
            var clipid = Components.interfaces.nsIClipboard;
            if (!clip) return false;
            clip.setData(trans, null, clipid.kGlobalClipboard);
        }
    },
    hasFlash: function () {
        if (document.all) {
            try {
                var swf1 = new ActiveXObject('ShockwaveFlash.ShockwaveFlash');
                return true;
            }
            catch (e) {
                return false;
            }
        }
        else {
            try {
                var swf2 = navigator.plugins['Shockwave Flash'];
                if (swf2 == undefined) {
                    return false;
                }
                else {
                    return true;
                }
            }
            catch (e) {
                return false;
            }
        }
    } 
}

/*! artDialog v6.0.2 | https://github.com/aui/artDialog */
!function () { function a(b) { var d = c[b], e = "exports"; return "object" == typeof d ? d : (d[e] || (d[e] = {}, d[e] = d.call(d[e], a, d[e], d) || d[e]), d[e]) } function b(a, b) { c[a] = b } var c = {}; b("jquery", function () { return jQuery }), b("popup", function (a) { function b() { this.destroyed = !1, this.__popup = c("<div />").attr({ tabindex: "-1" }).css({ display: "none", position: "absolute", outline: 0 }).html(this.innerHTML).appendTo("body"), this.__backdrop = c("<div />"), this.node = this.__popup[0], this.backdrop = this.__backdrop[0], d++ } var c = a("jquery"), d = 0, e = !("minWidth" in c("html")[0].style), f = !e; return c.extend(b.prototype, { node: null, backdrop: null, fixed: !1, destroyed: !0, open: !1, returnValue: "", autofocus: !0, align: "bottom left", backdropBackground: "#000", backdropOpacity: .7, innerHTML: "", className: "ui-popup", show: function (a) { if (this.destroyed) return this; var b = this, d = this.__popup; return this.__activeElement = this.__getActive(), this.open = !0, this.follow = a || this.follow, this.__ready || (d.addClass(this.className), this.modal && this.__lock(), d.html() || d.html(this.innerHTML), e || c(window).on("resize", this.__onresize = function () { b.reset() }), this.__ready = !0), d.addClass(this.className + "-show").attr("role", this.modal ? "alertdialog" : "dialog").css("position", this.fixed ? "fixed" : "absolute").show(), this.__backdrop.show(), this.reset().focus(), this.__dispatchEvent("show"), this }, showModal: function () { return this.modal = !0, this.show.apply(this, arguments) }, close: function (a) { return !this.destroyed && this.open && (void 0 !== a && (this.returnValue = a), this.__popup.hide().removeClass(this.className + "-show"), this.__backdrop.hide(), this.open = !1, this.blur(), this.__dispatchEvent("close")), this }, remove: function () { if (this.destroyed) return this; this.__dispatchEvent("beforeremove"), b.current === this && (b.current = null), this.__unlock(), this.__popup.remove(), this.__backdrop.remove(), e || c(window).off("resize", this.__onresize), this.__dispatchEvent("remove"); for (var a in this) delete this[a]; return this }, reset: function () { var a = this.follow; return a ? this.__follow(a) : this.__center(), this.__dispatchEvent("reset"), this }, focus: function () { var a = this.node, d = b.current; if (d && d !== this && d.blur(!1), !c.contains(a, this.__getActive())) { var e = this.__popup.find("[autofocus]")[0]; !this._autofocus && e ? this._autofocus = !0 : e = a, this.__focus(e) } return b.current = this, this.__popup.addClass(this.className + "-focus"), this.__zIndex(), this.__dispatchEvent("focus"), this }, blur: function () { var a = this.__activeElement, b = arguments[0]; return b !== !1 && this.__focus(a), this._autofocus = !1, this.__popup.removeClass(this.className + "-focus"), this.__dispatchEvent("blur"), this }, addEventListener: function (a, b) { return this.__getEventListener(a).push(b), this }, removeEventListener: function (a, b) { for (var c = this.__getEventListener(a), d = 0; d < c.length; d++) b === c[d] && c.splice(d--, 1); return this }, __getEventListener: function (a) { var b = this.__listener; return b || (b = this.__listener = {}), b[a] || (b[a] = []), b[a] }, __dispatchEvent: function (a) { var b = this.__getEventListener(a); this["on" + a] && this["on" + a](); for (var c = 0; c < b.length; c++) b[c].call(this) }, __focus: function (a) { try { this.autofocus && !/^iframe$/i.test(a.nodeName) && a.focus() } catch (b) { } }, __getActive: function () { try { var a = document.activeElement, b = a.contentDocument, c = b && b.activeElement || a; return c } catch (d) { } }, __zIndex: function () { var a = b.zIndex++; this.__popup.css("zIndex", a), this.__backdrop.css("zIndex", a - 1), this.zIndex = a }, __center: function () { var a = this.__popup, b = c(window), d = c(document), e = this.fixed, f = e ? 0 : d.scrollLeft(), g = e ? 0 : d.scrollTop(), h = b.width(), i = b.height(), j = a.width(), k = a.height(), l = (h - j) / 2 + f, m = 382 * (i - k) / 1e3 + g, n = a[0].style; n.left = Math.max(parseInt(l), f) + "px", n.top = Math.max(parseInt(m), g) + "px" }, __follow: function (a) { var b = a.parentNode && c(a), d = this.__popup; if (this.__followSkin && d.removeClass(this.__followSkin), b) { var e = b.offset(); if (e.left * e.top < 0) return this.__center() } var f = this, g = this.fixed, h = c(window), i = c(document), j = h.width(), k = h.height(), l = i.scrollLeft(), m = i.scrollTop(), n = d.width(), o = d.height(), p = b ? b.outerWidth() : 0, q = b ? b.outerHeight() : 0, r = this.__offset(a), s = r.left, t = r.top, u = g ? s - l : s, v = g ? t - m : t, w = g ? 0 : l, x = g ? 0 : m, y = w + j - n, z = x + k - o, A = {}, B = this.align.split(" "), C = this.className + "-", D = { top: "bottom", bottom: "top", left: "right", right: "left" }, E = { top: "top", bottom: "top", left: "left", right: "left" }, F = [{ top: v - o, bottom: v + q, left: u - n, right: u + p }, { top: v, bottom: v - o + q, left: u, right: u - n + p}], G = { left: u + p / 2 - n / 2, top: v + q / 2 - o / 2 }, H = { left: [w, y], top: [x, z] }; c.each(B, function (a, b) { F[a][b] > H[E[b]][1] && (b = B[a] = D[b]), F[a][b] < H[E[b]][0] && (B[a] = D[b]) }), B[1] || (E[B[1]] = "left" === E[B[0]] ? "top" : "left", F[1][B[1]] = G[E[B[1]]]), C += B.join("-") + " " + this.className + "-follow", f.__followSkin = C, b && d.addClass(C), A[E[B[0]]] = parseInt(F[0][B[0]]), A[E[B[1]]] = parseInt(F[1][B[1]]), d.css(A) }, __offset: function (a) { var b = a.parentNode, d = b ? c(a).offset() : { left: a.pageX, top: a.pageY }; a = b ? a : a.target; var e = a.ownerDocument, f = e.defaultView || e.parentWindow; if (f == window) return d; var g = f.frameElement, h = c(e), i = h.scrollLeft(), j = h.scrollTop(), k = c(g).offset(), l = k.left, m = k.top; return { left: d.left + l - i, top: d.top + m - j} }, __lock: function () { var a = this, d = this.__popup, e = this.__backdrop, g = { position: "fixed", left: 0, top: 0, width: "100%", height: "100%", overflow: "hidden", userSelect: "none", opacity: 0, background: this.backdropBackground }; d.addClass(this.className + "-modal"), b.zIndex = b.zIndex + 2, this.__zIndex(), f || c.extend(g, { position: "absolute", width: c(window).width() + "px", height: c(document).height() + "px" }), e.css(g).animate({ opacity: this.backdropOpacity }, 150).insertAfter(d).attr({ tabindex: "0" }).on("focus", function () { a.focus() }) }, __unlock: function () { this.modal && (this.__popup.removeClass(this.className + "-modal"), this.__backdrop.remove(), delete this.modal) } }), b.zIndex = 1024, b.current = null, b }), b("dialog-config", { content: '<span class="ui-dialog-loading">Loading..</span>', title: "", statusbar: "", button: null, ok: null, cancel: null, okValue: "ok", cancelValue: "cancel", cancelDisplay: !0, width: "", height: "", padding: "", skin: "", quickClose: !1, cssUri: "../css/ui-dialog.css", innerHTML: '<div i="dialog" class="ui-dialog"><div class="ui-dialog-arrow-a"></div><div class="ui-dialog-arrow-b"></div><table class="ui-dialog-grid"><tr><td i="header" class="ui-dialog-header"><button i="close" class="ui-dialog-close">&#215;</button><div i="title" class="ui-dialog-title"></div></td></tr><tr><td i="body" class="ui-dialog-body"><div i="content" class="ui-dialog-content"></div></td></tr><tr><td i="footer" class="ui-dialog-footer"><div i="statusbar" class="ui-dialog-statusbar"></div><div i="button" class="ui-dialog-button"></div></td></tr></table></div>' }), b("dialog", function (a) { var b = a("jquery"), c = a("popup"), d = a("dialog-config"), e = d.cssUri; if (e) { var f = a[a.toUrl ? "toUrl" : "resolve"]; f && (e = f(e), e = '<link rel="stylesheet" href="' + e + '" />', b("base")[0] ? b("base").before(e) : b("head").append(e)) } var g = 0, h = new Date - 0, i = !("minWidth" in b("html")[0].style), j = "createTouch" in document && !("onmousemove" in document) || /(iPhone|iPad|iPod)/i.test(navigator.userAgent), k = !i && !j, l = function (a, c, d) { var e = a = a || {}; ("string" == typeof a || 1 === a.nodeType) && (a = { content: a, fixed: !j }), a = b.extend(!0, {}, l.defaults, a), a._ = e; var f = a.id = a.id || h + g, i = l.get(f); return i ? i.focus() : (k || (a.fixed = !1), a.quickClose && (a.modal = !0, e.backdropOpacity || (a.backdropOpacity = 0)), b.isArray(a.button) || (a.button = []), void 0 !== d && (a.cancel = d), a.cancel && a.button.push({ id: "cancel", value: a.cancelValue, callback: a.cancel, display: a.cancelDisplay }), void 0 !== c && (a.ok = c), a.ok && a.button.push({ id: "ok", value: a.okValue, callback: a.ok, autofocus: !0 }), l.list[f] = new l.create(a)) }, m = function () { }; m.prototype = c.prototype; var n = l.prototype = new m; return l.create = function (a) { var d = this; b.extend(this, new c); var e = b(this.node).html(a.innerHTML); return this.options = a, this._popup = e, b.each(a, function (a, b) { "function" == typeof d[a] ? d[a](b) : d[a] = b }), a.zIndex && (c.zIndex = a.zIndex), e.attr({ "aria-labelledby": this._$("title").attr("id", "title:" + this.id).attr("id"), "aria-describedby": this._$("content").attr("id", "content:" + this.id).attr("id") }), this._$("close").css("display", this.cancel === !1 ? "none" : "").attr("title", this.cancelValue).on("click", function (a) { d._trigger("cancel"), a.preventDefault() }), this._$("dialog").addClass(this.skin), this._$("body").css("padding", this.padding), a.quickClose && b(this.backdrop).on("onmousedown" in document ? "mousedown" : "click", function () { return d._trigger("cancel"), !1 }), this._esc = function (a) { var b = a.target, e = b.nodeName, f = /^input|textarea$/i, g = c.current === d, h = a.keyCode; !g || f.test(e) && "button" !== b.type || 27 === h && d._trigger("cancel") }, b(document).on("keydown", this._esc), this.addEventListener("remove", function () { b(document).off("keydown", this._esc), delete l.list[this.id] }), g++, l.oncreate(this), this }, l.create.prototype = n, b.extend(n, { content: function (a) { return this._$("content").empty("")["object" == typeof a ? "append" : "html"](a), this.reset() }, title: function (a) { return this._$("title").text(a), this._$("header")[a ? "show" : "hide"](), this }, width: function (a) { return this._$("content").css("width", a), this.reset() }, height: function (a) { return this._$("content").css("height", a), this.reset() }, button: function (a) { a = a || []; var c = this, d = "", e = 0; return this.callbacks = {}, "string" == typeof a ? (d = a, e++) : b.each(a, function (a, b) { b.id = b.id || b.value, c.callbacks[b.id] = b.callback; var f = ""; b.display === !1 ? f = ' style="display:none"' : e++, d += '<button type="button" data-id="' + b.id + '"' + f + (b.disabled ? " disabled" : "") + (b.autofocus ? ' autofocus class="ui-dialog-autofocus"' : "") + ">" + b.value + "</button>" }), this._$("footer")[e ? "show" : "hide"](), this._$("button").html(d).on("click", "[data-id]", function (a) { var d = b(this); d.attr("disabled") || c._trigger(d.data("id")), a.preventDefault() }), this }, statusbar: function (a) { return this._$("statusbar").html(a)[a ? "show" : "hide"](), this }, _$: function (a) { return this._popup.find("[i=" + a + "]") }, _trigger: function (a) { var b = this.callbacks[a]; return "function" != typeof b || b.call(this) !== !1 ? this.close().remove() : this } }), l.oncreate = b.noop, l.getCurrent = function () { return c.current }, l.get = function (a) { return void 0 === a ? l.list : l.list[a] }, l.list = {}, l.defaults = d, l }), window.dialog = a("dialog") } ();

/*! Sea.js 2.2.1 | seajs.org/LICENSE.md */
!function(a,b){function c(a){return function(b){return{}.toString.call(b)=="[object "+a+"]"}}function d(){return A++}function e(a){return a.match(D)[0]}function f(a){for(a=a.replace(E,"/");a.match(F);)a=a.replace(F,"/");return a=a.replace(G,"$1/")}function g(a){var b=a.length-1,c=a.charAt(b);return"#"===c?a.substring(0,b):".js"===a.substring(b-2)||a.indexOf("?")>0||".css"===a.substring(b-3)||"/"===c?a:a+".js"}function h(a){var b=v.alias;return b&&x(b[a])?b[a]:a}function i(a){var b=v.paths,c;return b&&(c=a.match(H))&&x(b[c[1]])&&(a=b[c[1]]+c[2]),a}function j(a){var b=v.vars;return b&&a.indexOf("{")>-1&&(a=a.replace(I,function(a,c){return x(b[c])?b[c]:a})),a}function k(a){var b=v.map,c=a;if(b)for(var d=0,e=b.length;e>d;d++){var f=b[d];if(c=z(f)?f(a)||a:a.replace(f[0],f[1]),c!==a)break}return c}function l(a,b){var c,d=a.charAt(0);if(J.test(a))c=a;else if("."===d)c=f((b?e(b):v.cwd)+a);else if("/"===d){var g=v.cwd.match(K);c=g?g[0]+a.substring(1):a}else c=v.base+a;return 0===c.indexOf("//")&&(c=location.protocol+c),c}function m(a,b){if(!a)return"";a=h(a),a=i(a),a=j(a),a=g(a);var c=l(a,b);return c=k(c)}function n(a){return a.hasAttribute?a.src:a.getAttribute("src",4)}function o(a,b,c){var d=S.test(a),e=L.createElement(d?"link":"script");if(c){var f=z(c)?c(a):c;f&&(e.charset=f)}p(e,b,d,a),d?(e.rel="stylesheet",e.href=a):(e.async=!0,e.src=a),T=e,R?Q.insertBefore(e,R):Q.appendChild(e),T=null}function p(a,c,d,e){function f(){a.onload=a.onerror=a.onreadystatechange=null,d||v.debug||Q.removeChild(a),a=null,c()}var g="onload"in a;return!d||!V&&g?(g?(a.onload=f,a.onerror=function(){C("error",{uri:e,node:a}),f()}):a.onreadystatechange=function(){/loaded|complete/.test(a.readyState)&&f()},b):(setTimeout(function(){q(a,c)},1),b)}function q(a,b){var c=a.sheet,d;if(V)c&&(d=!0);else if(c)try{c.cssRules&&(d=!0)}catch(e){"NS_ERROR_DOM_SECURITY_ERR"===e.name&&(d=!0)}setTimeout(function(){d?b():q(a,b)},20)}function r(){if(T)return T;if(U&&"interactive"===U.readyState)return U;for(var a=Q.getElementsByTagName("script"),b=a.length-1;b>=0;b--){var c=a[b];if("interactive"===c.readyState)return U=c}}function s(a){var b=[];return a.replace(X,"").replace(W,function(a,c,d){d&&b.push(d)}),b}function t(a,b){this.uri=a,this.dependencies=b||[],this.exports=null,this.status=0,this._waitings={},this._remain=0}if(!a.seajs){var u=a.seajs={version:"2.2.1"},v=u.data={},w=c("Object"),x=c("String"),y=Array.isArray||c("Array"),z=c("Function"),A=0,B=v.events={};u.on=function(a,b){var c=B[a]||(B[a]=[]);return c.push(b),u},u.off=function(a,b){if(!a&&!b)return B=v.events={},u;var c=B[a];if(c)if(b)for(var d=c.length-1;d>=0;d--)c[d]===b&&c.splice(d,1);else delete B[a];return u};var C=u.emit=function(a){var b=B[a],c;if(b){b=b.slice();for(var d=Array.prototype.slice.call(arguments,1);c=b.shift();)c.apply(null,d)}return u},D=/[^?#]*\//,E=/\/\.\//g,F=/\/[^/]+\/\.\.\//,G=/([^:/])\/\//g,H=/^([^/:]+)(\/.+)$/,I=/{([^{]+)}/g,J=/^\/\/.|:\//,K=/^.*?\/\/.*?\//,L=document,M=e(L.URL),N=L.scripts,O=L.getElementById("seajsnode")||N[N.length-1],P=e(n(O)||M);u.resolve=m;var Q=L.head||L.getElementsByTagName("head")[0]||L.documentElement,R=Q.getElementsByTagName("base")[0],S=/\.css(?:\?|$)/i,T,U,V=+navigator.userAgent.replace(/.*(?:AppleWebKit|AndroidWebKit)\/(\d+).*/,"$1")<536;u.request=o;var W=/"(?:\\"|[^"])*"|'(?:\\'|[^'])*'|\/\*[\S\s]*?\*\/|\/(?:\\\/|[^\/\r\n])+\/(?=[^\/])|\/\/.*|\.\s*require|(?:^|[^$])\brequire\s*\(\s*(["'])(.+?)\1\s*\)/g,X=/\\\\/g,Y=u.cache={},Z,$={},_={},ab={},bb=t.STATUS={FETCHING:1,SAVED:2,LOADING:3,LOADED:4,EXECUTING:5,EXECUTED:6};t.prototype.resolve=function(){for(var a=this,b=a.dependencies,c=[],d=0,e=b.length;e>d;d++)c[d]=t.resolve(b[d],a.uri);return c},t.prototype.load=function(){var a=this;if(!(a.status>=bb.LOADING)){a.status=bb.LOADING;var c=a.resolve();C("load",c,a);for(var d=a._remain=c.length,e,f=0;d>f;f++)e=t.get(c[f]),e.status<bb.LOADED?e._waitings[a.uri]=(e._waitings[a.uri]||0)+1:a._remain--;if(0===a._remain)return a.onload(),b;var g={};for(f=0;d>f;f++)e=Y[c[f]],e.status<bb.FETCHING?e.fetch(g):e.status===bb.SAVED&&e.load();for(var h in g)g.hasOwnProperty(h)&&g[h]()}},t.prototype.onload=function(){var a=this;a.status=bb.LOADED,a.callback&&a.callback();var b=a._waitings,c,d;for(c in b)b.hasOwnProperty(c)&&(d=Y[c],d._remain-=b[c],0===d._remain&&d.onload());delete a._waitings,delete a._remain},t.prototype.fetch=function(a){function c(){u.request(g.requestUri,g.onRequest,g.charset)}function d(){delete $[h],_[h]=!0,Z&&(t.save(f,Z),Z=null);var a,b=ab[h];for(delete ab[h];a=b.shift();)a.load()}var e=this,f=e.uri;e.status=bb.FETCHING;var g={uri:f};C("fetch",g);var h=g.requestUri||f;return!h||_[h]?(e.load(),b):$[h]?(ab[h].push(e),b):($[h]=!0,ab[h]=[e],C("request",g={uri:f,requestUri:h,onRequest:d,charset:v.charset}),g.requested||(a?a[g.requestUri]=c:c()),b)},t.prototype.exec=function(){function a(b){return t.get(a.resolve(b)).exec()}var c=this;if(c.status>=bb.EXECUTING)return c.exports;c.status=bb.EXECUTING;var e=c.uri;a.resolve=function(a){return t.resolve(a,e)},a.async=function(b,c){return t.use(b,c,e+"_async_"+d()),a};var f=c.factory,g=z(f)?f(a,c.exports={},c):f;return g===b&&(g=c.exports),delete c.factory,c.exports=g,c.status=bb.EXECUTED,C("exec",c),g},t.resolve=function(a,b){var c={id:a,refUri:b};return C("resolve",c),c.uri||u.resolve(c.id,b)},t.define=function(a,c,d){var e=arguments.length;1===e?(d=a,a=b):2===e&&(d=c,y(a)?(c=a,a=b):c=b),!y(c)&&z(d)&&(c=s(""+d));var f={id:a,uri:t.resolve(a),deps:c,factory:d};if(!f.uri&&L.attachEvent){var g=r();g&&(f.uri=g.src)}C("define",f),f.uri?t.save(f.uri,f):Z=f},t.save=function(a,b){var c=t.get(a);c.status<bb.SAVED&&(c.id=b.id||a,c.dependencies=b.deps||[],c.factory=b.factory,c.status=bb.SAVED)},t.get=function(a,b){return Y[a]||(Y[a]=new t(a,b))},t.use=function(b,c,d){var e=t.get(d,y(b)?b:[b]);e.callback=function(){for(var b=[],d=e.resolve(),f=0,g=d.length;g>f;f++)b[f]=Y[d[f]].exec();c&&c.apply(a,b),delete e.callback},e.load()},t.preload=function(a){var b=v.preload,c=b.length;c?t.use(b,function(){b.splice(0,c),t.preload(a)},v.cwd+"_preload_"+d()):a()},u.use=function(a,b){return t.preload(function(){t.use(a,b,v.cwd+"_use_"+d())}),u},t.define.cmd={},a.define=t.define,u.Module=t,v.fetchedList=_,v.cid=d,u.require=function(a){var b=t.get(t.resolve(a));return b.status<bb.EXECUTING&&(b.onload(),b.exec()),b.exports};var cb=/^(.+?\/)(\?\?)?(seajs\/)+/;v.base=(P.match(cb)||["",P])[1],v.dir=P,v.cwd=M,v.charset="utf-8",v.preload=function(){var a=[],b=location.search.replace(/(seajs-\w+)(&|$)/g,"$1=1$2");return b+=" "+L.cookie,b.replace(/(seajs-\w+)=1/g,function(b,c){a.push(c)}),a}(),u.config=function(a){for(var b in a){var c=a[b],d=v[b];if(d&&w(d))for(var e in c)d[e]=c[e];else y(d)?c=d.concat(c):"base"===b&&("/"!==c.slice(-1)&&(c+="/"),c=l(c)),v[b]=c}return C("config",a),u}}}(this);
