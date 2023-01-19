//팝업 열고 닫기
$(document).ready(function() {
    var wndOtrW = $(window).outerWidth();
    var wndOtrH = $(window).outerHeight();
    var scrlTp = $(window).scrollTop();
    var mobMde = wndOtrW > 768 ? false : true;

    $(window).resize(function() {
        wndOtrW = $(window).outerWidth();
        wndOtrH = $(window).outerHeight();
        scrlTp = $(window).scrollTop();
        mobMde = wndOtrW > 768 ? false : true;
    });

    $(".suppt_btn").on("click", function(){
        $(".pop_wr").show();
    });
    $("#popUpClose, .black_bg").on("click", function(){
        $(".pop_wr").hide();
    });


    
    // 폭죽 효과
    $('.btnFirecracker').on('click',function(e){
        e.preventDefault();
        const targetLink = $(this).attr('href');
        // console.log(targetLink);
        
        setTimeout(function() {
            window.location.href = targetLink;
            
        }, 2000);
    });

    // 꽃가루 효과
    function reAction() {
        $("#startButton").trigger("click");
        setTimeout(function(){
            $("#stopButton").trigger("click");
        }, 6000);
    }
    reAction();

    // 모바일 편지봉투 fadein 효과
    setTimeout(function() {
        $('.text_fadeIn').addClass('active');
    }, 1000)
    setTimeout(function() {
        $('.text_fadeIn').removeClass('active');
    }, 2500);

    setTimeout(function() {
        $('.orginal_fadeIn').addClass('active');
    }, 4000);

    // 편지봉투 클릭 효과
    if(!mobMde){
        function letterClick(){
            setTimeout(function() {
                $('#worldSupportContWrap .birday_card.orginal_fadeIn').trigger('click');
            }, 2000);
        }
        letterClick();
    } else {
        setTimeout(function() {
            $('#worldSupportContWrap .birday_card.orginal_fadeIn').trigger('click');
        }, 6000);
    }
    
});












