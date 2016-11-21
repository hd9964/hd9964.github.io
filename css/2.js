/**
 * Created by HuangD on 2016/11/21.
 */
$(function() {
    var div = $('#aj-mobile-search-module'),
        form = $('#aj-search-form'),
        contentBody = $('#aj-mobile-wrap');

    // search cookie
    (function() {
        var btn = div.find('.aj-search-input .aj-right'),
            recentSearch = div.find('.aj-recent-search-block'),
            input = div.find('.aj-s-i-wrap input'),
            cookieName = 'aj-wap-search-history'; // ???????¡±¡§??¡¤??????¨¨?¡ã??????cookie key?¢ã?,value??? ","???¨¦?¡±
        // ¨¨?¡ã?????????
        form.on('submit', function() {
            var val = encodeURIComponent($.trim(input.val())),
                arr = [],
                bool = true, // default all values are unique
                cookie = Youhui.tools.cookie(cookieName);
            if (val === '') {
                return false;
            }
            if (cookie !== '') {
                arr = cookie.split(',');
            }
            arr.forEach(function(item) {
                if (item === val) {
                    bool = false;
                }
            });
            if (bool) {
                arr.push(val);
            }
            arr = arr.reverse().slice(0, 10).reverse();
            Youhui.tools.cookie(cookieName, arr.join(','), {
                expires: 10 //10 ?¡è????¨¨?????
            });
        });
        // submit form
        btn.on('click', function() {
            form.submit();
        });

        // ?¡À???¡ã recent search
        $(div).on('aj-show', function() {
            recentSearch.hide();
            var cookie = Youhui.tools.cookie(cookieName),
                wrap = recentSearch.find('.aj-self-hotkey'),
                span = document.createElement('span'),
                li = document.createElement('li'),
                arr = cookie.split(',');
            if (cookie === '') return false;
            recentSearch.show();
            arr = arr.reverse().slice(0, 10); // qu??¢ã¨¨?¡®?????????10???¨¨?¡ã???
            arr.forEach(function(item) {
                var clone = $(li).clone();
                clone.html(decodeURIComponent(item));
                $(span).append(clone);
            });
            $(wrap).html(span);
        });
        // clear recent search
        recentSearch.on('click', '.aj-clear-recent-search-cookie', function() {
            Youhui.tools.cookie(cookieName, Youhui.tools.cookie(cookieName), {
                expires: -1
            });
            recentSearch.fadeOut();
        });
        // ?????? ??????¨¨?¡ã???
        recentSearch.on('click', '.aj-self-hotkey li', function() {
            searchThisWord($(this).text());
        });
        div.on('click', '.aj-sugges-hotkey li', function() {
            searchThisWord($(this).text());
        });

        function searchThisWord(val) {
            form[0]['keyword'].value = val;
            form.submit();
        }
    })();
    // types of search
    (function() {
        var btn = div.find('.aj-s-types'),
            name = btn.find('.aj-s-t-name'),
            wrap = div.find('.aj-s-types-list');
        // ????¡ì???¨C¨¦¢ã¡ë??????type
        saveType();
        // ??????????¡À?
        btn.on('click', function() {
            $(wrap).toggle();
        });
        wrap.on('click', '.aj-li', function(e) {
            e.stopPropagation();
            name.html($(this).html());
            wrap.hide();
            saveType();
        });
        // ¨¨?¡ã????¡±¡§??¡¤¨¦¢ã¡ë??????type
        function saveType() {
            wrap.find('.aj-li').each(function() {
                if ($(this).text() === name.text()) {
                    form[0]['type'].value = $(this).attr('aj-type-value');
                }
            });
        }
    })();
    // ??????,????¡À? ??¡ë??¡ëarea ??????????¡è?
    (function() {
        var wrap = div.find('.aj-nopading-blocks'),
            blocks = wrap.find('.aj-block'),
            arr = ['?¡À??¡è?????¡è?', '????????¡°?¡ë?'];
        $.each(blocks, function(index, item, arr) {
            var ul = $(this).find('.aj-ul'),
                lis = ul.find('.aj-li'),
                showMoreBtn = $(this).find('.aj-show-more');
            if (lis.length > 8) {
                showMoreBtn.show();
            }
        });
        wrap.find('.aj-show-more').on('click', function(e) {
            $(this).parents('.aj-content').find('.aj-ul').toggleClass('aj-no-max-height');
            $(this).html(arr[(arr.indexOf($.trim($(this).html())) + 1) % arr.length]);
        });
    })();
    //  show search page
    (function() {
        var btn = $('#top .login-wrapper');
        //        btn.on('click', function (e) {
        //            e.preventDefault();
        //            if (div.css('display').toLowerCase() === 'none') {
        //                showSearch();
        //            } else {
        //                hideSearch();
        //            }
        //        });
        showSearch();

        function showSearch() {
            div.show();
            contentBody.hide();
            $(div).trigger('aj-show');
        }

        function hideSearch() {
            div.hide();
            contentBody.show();
        }
    })();
});