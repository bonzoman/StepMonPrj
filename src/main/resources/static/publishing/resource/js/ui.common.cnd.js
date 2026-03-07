function TimerStart(){
    var setTime = $(".time").text();
    var setTime = setTime.split(":");
    var thisTime = (Number(setTime[0])*60)+Number(setTime[1]);
    isPause = false;
    TimerFunction = setInterval(function(){
        var min = 0;
        var sec = 0;
        min = Math.floor(thisTime/60);
        sec = thisTime%60;
        thisTime++;
        var thisMM = min;
        var thisSS = sec;
        if(thisMM < 10){
            thisMM = "0" + min;
        }
        if(thisSS < 10){
            thisSS = "0" + sec;
        }
        if(thisMM >= 45){
            $(".timer").addClass("warning")
        }
        if(thisMM >= 50){
            TimerPause()
            $(".area-action,.answer-choice").removeClass("pause");
            $(".play").attr("disabled","");
            $(".timer").removeClass("warning").addClass("time-out");
            ui.toast("계속해서 풀어보세요!");
        }
        $(".time").text(thisMM+":"+thisSS)
    }, 1000)
    $(".hint").addClass("disabled")
    setTimeout(function(){
        $(".hint").removeClass("disabled")
    }, 15000)
    $(".timer, .area-action , .answer-choice").removeClass("pause")
}
function TimerPause(){
    isPause = true;
    clearInterval(TimerFunction)
    $("").addClass("pause")
    $(".timer , .area-action , .answer-choice").addClass("pause");
}

function radiochecked(){
    $(".answer-choice [type='radio']").on("click", function(){
        if ($(this).is(":checked")){
            $("label").removeClass("checked");
            $(this).next().parent("label").addClass("checked");
        }
    });
}

function LocationTabSize(){
}


// 모의고사 진행
// 문제 진행률
function popupMockexam01(){
    var locationNumber = $(".location button").text().split("/")
    var currentNumber = Number(locationNumber[0])
    var totalNumber = Number(locationNumber[1])
    $(".progress-bar span").text(currentNumber+"번 문제").css({width:((currentNumber/totalNumber)*100)+"%"})
}

// 문제 바로가기 on/off
function popupMockexam02(){
    $(".location .value-data").on("click", function(){
        $(this).parent(".location").toggleClass("active")
    })
}

// 문제 선택
function popupMockexam03(){
    $("[type='radio']:checked").parent("label").addClass("checked");
}

// 합격가능성, 팁 레이어팝업 on/off
function popupMockexam04(){
    $(".area-action .btn").bind("click", function(){
        if(!$(this).parent().is(".active")){
            $(this).parent().siblings().removeClass("active");
            $(this).parent().addClass("active");
        }else{
            $(this).parent().removeClass("active");
        }
    });
}

// 합격가능성, 팁 레이어팝업 닫기버튼
function popupMockexam05(){
    $(".area-action .close").bind("click", function(){
        $(this).parents("div").removeClass("active");
    })
}

// 합격가능성 프로그래스바 & 합격률
function popupMockexam06(){
    $(".pass-rate .graph li").each(function(){
        var em = $(this).find("em").text().replace(/[^\.\-|^0(0)+|^0-9\.]/g, '')
        var p = $(this).find("p,i")
        $(p).css({width:(em)+"%"})
        if(em >= 60){
            $(this).addClass("pass")
        }
    })
}

// DPREC1305 문제풀이 정답 체크여부
function popupMockexam07(){
    $(".answer-choice [type='radio']").attr("disabled", "disabled")
    $(".answer-choice:not(:has(.checked))").addClass("no-checkd");
}

// 도입앱 header 관련
function introHeader(){
    if($('.pagecnd1').length>0 || ($('.pagecnd2').length>0 && $('.banner-box1').length>0) || $('.pagecnd4').length>0 && $('.pagecnd2').length>0 || ($('.banner-con2').length>0)){
        $(window).scrollTop(0);
        $('header').removeClass('active')
        $(window).scroll(function(){
            if($(window).scrollTop()+$('header').outerHeight()>$('.container>div:first').offset().top + 90){
                $('header').addClass('active');
            }else{
                $('header').removeClass('active');
            }
        }).trigger('scroll');
    }
}
// 도입앱 팝업 header 관련
function uiPopHeader(){
    if($('.popup-mockexam .page5').length>0){
        uiPopCtrl('.lightbox');
    }else if($('.popup-mockexam .page4').length>0){
        uiPopCtrl('.moreinformation');
    }else if($('.popup-wrapper .pagecnd3').length>0){
        uiPopCtrl($('.container>div:first').next('div:not(.pop-mes4)'));
    };
    function uiPopCtrl(_el){
        $(window).scrollTop(0);
        $('header').removeClass('active move');
        $(window).scroll(function(){
            if($(window).scrollTop()>0 && $(window).scrollTop() < $(_el).offset().top - $('header').outerHeight()){
                $('header').removeClass('active');
                $('header').addClass('move');
            }else if($(window).scrollTop() + $('header').outerHeight() > $(_el).offset().top){
                $('header').removeClass('move');
                $('header').addClass('active');
            }else{
                $('header').removeClass('active move');
            }
        }).trigger('scroll');

    }
}

// 보험가이드 Tab 옵션 추가
function insureGuideTab(){
    if($('.insure-tab').length>0){
        $('.insure-tab').find('a').bind({
            'click' : function(e){
                $(window).scrollTop(0)
            }
        });
    };
}

function mainVisualCrtl(){

    if($('.main-wrap').length>0 && !$('.main-wrap').hasClass('swiper-creative')){
        var _el;
        mainSwiper();
        function mainSwiper(){
            _el = new Swiper(".main-wrap", {
                slideClass : 'item',
                slideActiveClass : 'active',
                wrapperClass : 'main-list',
                observer : true,
                observerParents : true,
                watchOverflow : true,
                loop : false,
                direction: "vertical",
                effect: "creative",
                creativeEffect: {
                    prev: {
                        translate: [0, 0, -500],
                    },
                    next: {
                        translate: [0, "100%", 0]
                    },
                }
            });
            $(window).trigger('resize');
        }
        $('.main-wrap + .btn-util1').on('click',function(e){
            $(window).scrollTop(0);
            $('.main-wrap').scrollTop(0);
            if($('.main-wrap').hasClass('active')){
                $('.main-wrap').removeClass('active');
                mainSwiper();
            }else{
                _el.destroy();
                $('.main-wrap').addClass('active');
                e.preventDefault();
            };
        });
    }
}


$(function(){
    if($(".popup-mockexam").length){
        popupMockexam01()
        popupMockexam02()
        popupMockexam03()
        popupMockexam04()
        popupMockexam05()
        popupMockexam06()
    }
    if($(".popup-mockexam .page2").length){
        popupMockexam07()
    }
    mainVisualCrtl()
    introHeader();
    uiPopHeader()
    insureGuideTab();
})