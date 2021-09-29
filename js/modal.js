$(function () {
  // モーダル表示前のスクロール量を入れる為の変数
  var scrollPos;
  // モーダル表示用の関数
  $(".js-modal-open").each(function () {
    $(this).on("click", function () {
      scrollPos = $(window).scrollTop();
      var target = $(this).data("target");
      var modal = document.getElementById(target);
      $(modal).addClass("is_open").removeClass("is_close");
      $("body").addClass("fixed").css({ top: -scrollPos });
      return false;
    });
  });

  // モーダルを閉じる用の関数
  $(".js-modal-close").on("click", function () {
    $(".js-modal").addClass("is_close").removeClass("is_open");
    $("body").removeClass("fixed").css({ top: "" });
    $(window).scrollTop(scrollPos);
    return false;
  });
});
