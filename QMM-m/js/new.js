 $(function() {
        // 返回顶部
        $(window).bind("scroll.gotop", function() {
            if ($(window).scrollTop() > 30) {
                $(".back").fadeIn('400').css("display", "block");
            } else {
                $(".back").fadeOut('400')
            }
        })
        $(".back").click(function() {
            $(document).scrollTop(0);
        });
        // 登录条
        $(".login").click(function(e) {
            if (!$(".sidbar").is(":visible")) {
                $(".sidbar").show();
            } else {
                $(".sidbar").hide();
            }

            e.stopPropagation();
        });

        $(document).click(function() {
            $(".sidbar").hide();
        });

        $(".sidbar").click(function(e) {
            e.stopPropagation();
        });
    })


    