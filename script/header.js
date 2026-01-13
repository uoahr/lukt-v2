
  console.log("연결 성공!");
  
$(document).ready(function(){
    // .gnb 안에 있는 ul 안의 li를 선택하도록 수정
    $('.gnb > ul > li').hover(function(){
        $(this).find('.lnb').stop().fadeIn(300);
    }, function(){
        $(this).find('.lnb').stop().fadeOut(200);
    });
});