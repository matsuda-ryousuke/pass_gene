$(function () {
  function login_ajax(mail, pass) {
    return $.ajax({
      url: "http://192.168.33.13/login.php",
      type: "POST",
      dataType: "json",
      data: {
        mail: mail,
        pass: pass,
      },
    }).fail(function (jqXHR, textStatus, errorThrown) {
      // Ajaxの通信に問題があった場合
      $("#msg").html("エラーが発生しました。");
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    });
  }

  // ログインボタンをクリック時にajax発動
  $("#login-btn").click(function () {
    // ログインフォームの値取得
    var mail = $("input[name=mail]").val();
    var pass = $("input[name=pass]").val();

    // ajax処理
    login_ajax(mail, pass).done(function (data, textStatus, jqXHR) {
      // 完了した場合、
      console.log(data);
      // console.log(JSON.parse(data));
      $("#msg").html("お問合せありがとうございました。");
      console.log(pass);
      console.log(data.id);

      // ログインフォームのパスワードをハッシュ化、パスフレーズとする
      var hash_phrase = CryptoJS.SHA256(pass);
      // セッションIDを、パスフレーズで暗号化する
      var encrypt_session = Encrypt.encrypt_password(hash_phrase, data.id);
      console.log(encrypt_session);

      // 現在時刻を取得する
      var dateObj = new Date();
      var text = "";

      text =
        dateObj.getFullYear() +
        "-" + //年の取得
        ("00" + (dateObj.getMonth() + 1)).slice(-2) +
        "-" + //月の取得 ※0~11で取得になるため+1
        ("00" + dateObj.getDate()).slice(-2) +
        " " + //日付の取得
        ("00" + dateObj.getHours()).slice(-2) +
        ":" + //時間の取得
        ("00" + dateObj.getMinutes()).slice(-2) +
        ":" + //分の取得
        ("00" + dateObj.getSeconds()).slice(-2); //秒の取得

      console.log(text);

      // セッションストレージに暗号化セッション、有効期限を保存する
      sessionStorage.setItem("id", encrypt_session);
      sessionStorage.setItem("limit", data.limit);
    });

    // プロミス、ajaxが終わる前にここの処理はされてしまうので、NG
    // console.log(user_id);
    // console.log(user_id["id"]);
  });

  $("#register-btn").click(function () {
    // 変数定義
    // var apiurl =
    //   "https://qguuxg2u91.execute-api.ap-northeast-1.amazonaws.com/login_dev";
    var apiurl = "http://192.168.33.13/login.php";
    // var apiurl = "http://192.168.33.13";
    // var apiurl = "http://192.168.33.13/ajax.php";

    // formタグの中身を取得
    var form = $("#contact-form");

    var mail = $("input[name=mail]").val();
    var pass = $("input[name=pass]").val();

    var data = {
      mail: mail,
      pass: pass,
    };

    // formタグ内のvalue値を取得
    // var formdata = JSON.stringify(form.serializeArray());
    // var data = JSON.parse(formdata);

    // // 日本語の文字化け対策
    // var text = "name=" + data[0].value + "&email=" + data[1].value;
    // console.log(text);

    // Ajax通信
    $.ajax({
      // Ajax定義
      type: "POST",
      url: apiurl,
      data: data,
      dataType: "json",
    })
      .done(function (data, textStatus, jqXHR) {
        console.log(data);
        // console.log(JSON.parse(data));

        $("#msg").html("お問合せありがとうございました。");
      })
      .fail(function (jqXHR, textStatus, errorThrown) {
        // Ajaxの通信に問題があった場合
        $("#msg").html("エラーが発生しました。");
        console.log(jqXHR);
        console.log(textStatus);
        console.log(errorThrown);
      });
  });
});
