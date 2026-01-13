
console.log("연결 성공!");

$(document).ready(function () {
    console.log("모든 슬라이드 연결 성공!");

    /* ==========================================
       1. 헤더 
    ========================================== */

    $(document).ready(function () {

        $(window).on('scroll', function () {
            var scTop = $(window).scrollTop();

            // 메인 화면(첫 번째 섹션)의 높이를 측정
            // 만약 메인 섹션에 따로 class나 id가 있다면 $('section') 대신 그걸 써주세요.
            var mainSectionHeight = $('main').first().innerHeight();

            // 스크롤 위치가 메인 섹션 높이보다 커지면 (메인 화면을 지나면)
            if (scTop >= mainSectionHeight) {
                $('header').addClass('on');
            } else {
                $('header').removeClass('on');
            }
        });

        // LNB 호버 (기존 동일)
        $('.gnb > ul > li').on('mouseenter', function () {
            $(this).find('.lnb').stop().fadeIn(200);
        });
        $('.gnb > ul > li').on('mouseleave', function () {
            $(this).find('.lnb').stop().fadeOut(200);
        });

    });

    /* ==========================================
       2. 메인 슬라이드 (1.2초 이동 / 6초 대기)
    ========================================== */
    var $sliderUl = $('.main-slider ul');
    var $dots = $('.slider-dots .dot');
    var liW = $('.main-slider').width();
    var isMainAnimated = false;

    $sliderUl.find('li:last').prependTo($sliderUl);
    $sliderUl.css('margin-left', -liW);

    $(window).resize(function () {
        liW = $('.main-slider').width();
        $sliderUl.css('margin-left', -liW);
    });

    function updateDots(targetIdx) {
        $dots.eq(targetIdx).addClass('active').siblings().removeClass('active');
    }

    function nextSlide() {
        if (isMainAnimated) return;
        var nextIdx = $sliderUl.find('li').eq(2).attr('data-index');
        updateDots(nextIdx);
        isMainAnimated = true;

        $sliderUl.stop().animate({ marginLeft: '-=' + liW }, 1200, function () {
            $sliderUl.find('li').first().appendTo($sliderUl);
            $sliderUl.css('margin-left', -liW);
            isMainAnimated = false;
        });
    }

    function prevSlide() {
        if (isMainAnimated) return;
        var prevIdx = $sliderUl.find('li').eq(0).attr('data-index');
        updateDots(prevIdx);
        isMainAnimated = true;

        $sliderUl.stop().animate({ marginLeft: '+=' + liW }, 1200, function () {
            $sliderUl.find('li:last').prependTo($sliderUl);
            $sliderUl.css('margin-left', -liW);
            isMainAnimated = false;
        });
    }

    $('.next-btn').click(function (e) { if (e) e.preventDefault(); nextSlide(); });
    $('.prev-btn').click(function (e) { if (e) e.preventDefault(); prevSlide(); });

    $dots.click(function () {
        if (isMainAnimated) return;
        var targetIndex = $(this).index();
        var currentIndex = parseInt($sliderUl.find('li').eq(1).attr('data-index'));
        if (targetIndex == currentIndex) return;
        var diff = targetIndex - currentIndex;
        if (diff === 1 || diff === -2) { nextSlide(); } else { prevSlide(); }
    });

    // 메인 타이머 (6초)
    var slideTimer = setInterval(nextSlide, 6000);
    $('.main-slider').hover(
        function () { clearInterval(slideTimer); },
        function () { slideTimer = setInterval(nextSlide, 6000); } // 4000에서 6000으로 수정
    );


    /* ==========================================
       3. 비디오 레시피 (무한 재생)
    ========================================== */
    var video = $('#recipeVideo').get(0);
    var $thumb = $('.recipe-content .thumb');

    $thumb.on('click', function () {
        $(this).hide();
        video.play();
        $('#recipeVideo').attr('controls', true);
    });

    $('#recipeVideo').on('pause', function () {
        if (!video.ended) {
            $(this).removeAttr('controls');
            $thumb.show();
        }
    });

    $('#recipeVideo').on('ended', function () {
        video.currentTime = 0;
        video.play();
    });

    /* ==========================================
           4. 베스트셀러 슬라이드
        ========================================== */
    var $track = $('.best-track');
    var $view = $('.best-view');
    var pageWidth = 851;
    var isBestAnimated = false;

    // 닷 업데이트 함수 (이동 방향에 맞춰 미리 계산)
    function updateBestDots(nextIdx) {
        $('.best-indicator .best-dot').eq(nextIdx).addClass('active').siblings().removeClass('active');
    }

    function moveBest() {
        if (isBestAnimated) return;
        isBestAnimated = true;

        // [수정] 이동하기 전에 "다음" 인덱스를 미리 계산해서 닷을 즉시 바꿉니다.
        var currentIdx = $track.find('.best-content').first().attr('data-index');
        var nextDotIdx = (currentIdx == "0") ? 1 : 0;
        updateBestDots(nextDotIdx);

        // 슬라이드 이동
        $track.css({
            'transform': 'translateX(' + (-pageWidth) + 'px)',
            'transition': 'transform 0.8s ease'
        });

        setTimeout(function () {
            $track.css({ 'transition': 'none' });
            $track.find('.best-content').first().appendTo($track);
            $track.css('transform', 'translateX(0px)');
            isBestAnimated = false;
        }, 800);
    }

    // [수정] 닷 클릭 시 즉각적인 반응을 위한 로직
    $('.best-indicator .best-dot').click(function () {
        if (isBestAnimated || $(this).hasClass('active')) return;

        // 클릭한 닷의 인덱스를 파악해서 닷부터 활성화
        var clickedIdx = $(this).index();
        updateBestDots(clickedIdx);

        // 슬라이드 이동 실행
        moveBestManual();
    });

    // 클릭 전용 이동 함수 (이미 닷이 바뀌었으므로 중복 업데이트 방지)
    function moveBestManual() {
        isBestAnimated = true;
        $track.css({
            'transform': 'translateX(' + (-pageWidth) + 'px)',
            'transition': 'transform 0.8s ease'
        });
        setTimeout(function () {
            $track.css({ 'transition': 'none' });
            $track.find('.best-content').first().appendTo($track);
            $track.css('transform', 'translateX(0px)');
            isBestAnimated = false;
        }, 800);
    }

    // 타이머 및 호버는 기존과 동일
    var bestTimer;
    setTimeout(function () {
        bestTimer = setInterval(moveBest, 4500);
    }, 2500);

    $view.hover(
        function () { clearInterval(bestTimer); },
        function () { bestTimer = setInterval(moveBest, 4500); }
    );


    /* ==========================================
          5. 배너 layout
       ========================================== */
    $(window).on('scroll', function () {
        var scTop = $(this).scrollTop();
        var bannerTop = $('.banner').offset().top;
        var winHeight = $(window).height();
        var gap = winHeight * 0.8;

        if (scTop > bannerTop - gap) {
            // 동일 거리(1193px)를 이동하므로 속도와 도착 시간이 일치함
            $('.banner .banner-info').stop().animate({
                left: '365px',
                opacity: 1
            }, 1200); // 거리가 멀어졌으므로 시간을 조금 늘려주면 더 부드럽습니다

            $('.banner .banner-img').stop().animate({
                right: '0px',
                opacity: 1
            }, 1200);

        } else {
            // 원래 위치로 복귀
            $('.banner .banner-info').stop().animate({ left: '-828px', opacity: 0 }, 800);
            $('.banner .banner-img').stop().animate({ right: '-1193px', opacity: 0 }, 800);
        }
    });

    /* ==========================================
          6. 커스텀 fade Elements
       ========================================== */
       
    $(document).ready(function () {
        $(window).on('scroll', function () {
            var scTop = $(window).scrollTop();
            var customSection = $('.custom');

            if (customSection.length > 0) {
                var customOffset = customSection.offset().top;
                var winHeight = $(window).height();
                var gap = winHeight * 0.8;

                if (scTop > customOffset - gap) {
                    // 영역에 들어오면 자식들에게 .on 클래스 추가
                    $('.custom-grp').addClass('on');
                } else {
                    // 영역 밖으로 나가면 클래스 제거 (초기화)
                    $('.custom-grp').removeClass('on');
                }
            }
        });
    });

});

