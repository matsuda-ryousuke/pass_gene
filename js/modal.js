$(function(){

    $(document).ready(function(){
        var target = "modal_login";
        var modal = document.getElementById(target);
        $(modal).addClass('is_open').removeClass('is_close');
        $('body').addClass('fixed').css({'top':-scrollPos});
        return false;
    });

    var scrollPos;
    $('.js-modal-open').each(function(){
        $(this).on('click',function(){
            console.log("clicked");
            scrollPos = $(window).scrollTop();
            var target = $(this).data('target');
            var modal = document.getElementById(target);
            $(modal).addClass('is_open').removeClass('is_close');
            $('body').addClass('fixed').css({'top':-scrollPos});
            return false;
        });
    });
    $('.js-modal-close').on('click',function(){
        $('.js-modal').addClass('is_close').removeClass('is_open');
        $('body').removeClass('fixed').css({'top':''});
        $(window).scrollTop(scrollPos);
        return false;
    }); 
});