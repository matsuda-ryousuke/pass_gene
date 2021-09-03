$(function () {
  // ログイン時のajax
  $("#login_btn").click(function () {
    // ajax先のPHPURLを指定
    var apiurl = "http://192.168.33.13";

    // input の中身を取得
    var userid = $("input[name=userid]").val();
    var password = $("input[name=password]").val();

    var data = {
      userid: userid,
      password: password,
    };

    // Ajax通信
    $.ajax({
      // Ajax定義
      type: "POST",
      url: apiurl,
      data: data,
      dataType: "json",
    })
      .beforeSend(function (xhr) {
        xhr.setRequestHeader(
          "X-CSRF-Token",
          $('meta[name="csrf-token"]').attr("content")
        );
        withCredentials: true;
      })
      .done(function (data, textStatus, jqXHR) {
        console.log(data);
        $("#msg").html("お問合せありがとうございました。");
      })
      .fail(function (jqXHR, textStatus, errorThrown) {
        // Ajaxの通信に問題があった場合
        $("#msg").html("エラーが発生しました。");
      });
  });
});
