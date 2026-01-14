$(function () {
    let stat = false;
    const $pages = $(".brand-wrap .page");
    const $pagination = $(".slide-pagination");

    $(document).on("wheel", function (e) {
        e.preventDefault();
        if (stat) return;

        let delta = e.originalEvent.deltaY;
        let scrollTop = $(window).scrollTop();
        let currentIndex = 0;

        $pages.each(function (i) {
            if (scrollTop >= $(this).offset().top - 10) {
                currentIndex = i;
            }
        });

        if (delta > 0 && currentIndex < $pages.length - 1) {
            movePage(currentIndex + 1);
        } else if (delta < 0 && currentIndex > 0) {
            movePage(currentIndex - 1);
        }
    });

    function movePage(n) {
        stat = true;

        $("html, body").stop().animate({
            scrollTop: $pages.eq(n).offset().top
        }, 700, function () {
            stat = false;
        });

        $pagination
            .find("li")
            .removeClass("active")
            .eq(n)
            .addClass("active");
    }

    $pagination.find("li a").on("click", function (e) {
        e.preventDefault();
        movePage($(this).parent().index());
    });

    // 푸터 감지해서 도트 숨기기
    $(window).on("scroll", function () {
        const footerTop = $("footer").offset().top;
        const scrollBottom = $(window).scrollTop() + $(window).height();

        if (scrollBottom >= footerTop) {
            $pagination.fadeOut(200);
        } else {
            $pagination.fadeIn(200);
        }
    });


});


    $(document).ready(function() {
    $(".gnb > ul > li").hover(
        function() {
            $(this).find(".lnb").stop().slideDown(200);
        },
        function() {
            $(this).find(".lnb").stop().slideUp(200);
        }
    );
});
