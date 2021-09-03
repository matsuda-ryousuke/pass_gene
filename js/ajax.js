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
    var mail = $("#login_mail").val();
    var pass = $("#login_pass").val();

    // ajax処理
    login_ajax(mail, pass).done(function (data, textStatus, jqXHR) {
      // 完了した場合、
      console.log(data);
      // console.log(JSON.parse(data));

      console.log(data.flag);

      /* =================================
        ユーザー登録済みの場合
      ================================= */
      if (data.flag == "registered") {
        console.log("登録済み");

        // ハッシュフレーズ：入力パスワードのハッシュ化
        var hash_phrase = CryptoJS.SHA256(pass);

        window.alert("パスワードを承認しました。");

        // セッションストレージには、暗号鍵作成フラグを登録
        sessionStorage.setItem("crypted", true);

        // モーダルを閉じる
        $(".js-modal").addClass("is_close").removeClass("is_open");
        $("body").removeClass("fixed").css({ top: "" });

        // パスワード登録、表示画面を表示
        register_div.style.display = "block";

        var passwords = data.pass;
        Display.display_password(hash_phrase, passwords);

        /* =================================
        ユーザー未登録の場合
      ================================= */
      } else if (data.flag == "new") {
        console.log("新規登録");

        /* =================================
        パスワードミスの場合
      ================================= */
      } else if (data.flag == "miss") {
        console.log("パスワードミス");

        /* =================================
        それ以外、想定していない出力の場合
      ================================= */
      } else {
        console.log("エラーが発生しました。");
      }

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

  function register_ajax(encrypt_password, service, session_id) {
    return $.ajax({
      url: "http://192.168.33.13/register.php",
      type: "POST",
      dataType: "json",
      data: {
        pass: pass,
        word: word,
        service: service,
      },
    }).fail(function (jqXHR, textStatus, errorThrown) {
      // Ajaxの通信に問題があった場合
      $("#msg").html("エラーが発生しました。");
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    });
  }

  $("#register-btn").click(function () {
    // 変数定義

    var service = $("#register_service").val();
    var pass = $("#register_pass").val();
    var word = Password.unescapeHtml($("#pass_box").html());
    console.log(service);
    console.log(pass);
    console.log(word);

    // 入力パスワードのハッシュ化
    var hash_phrase = CryptoJS.SHA256(pass);
    var encrypt_password = Encrypt.encrypt_password(hash_phrase, word);
    console.log(encrypt_password);

    // セッションストレージのセッションID（暗号化）を復号
    var session_id = Encrypt.decrypt_password(
      hash_phrase,
      sessionStorage.getItem("id")
    );
    console.log(session_id);

    // セッションIDの有効期限を取得
    var limit = sessionStorage.getItem("limit");
    console.log(limit);

    // 現在時刻を取得する
    var dateObj = new Date();
    var now = "";

    now =
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

    console.log(now);

    console.log(limit <= now);

    // 有効期限切れの場合、ページ再読み込みをかける
    if (limit <= now) {
      alert("ログインしなおしてください。");
      location.reload();
    }

    // ajax処理
    // register_ajax(mail, pass).done(function (data, textStatus, jqXHR) {
    //   // 完了した場合、
    //   console.log(data);
    //   // console.log(JSON.parse(data));

    //   console.log(data.flag);

    //   /* =================================
    //     ユーザー登録済みの場合
    //   ================================= */
    //   if (data.flag == "registered") {
    //     console.log("登録済み");

    //     // ハッシュフレーズ：入力パスワードのハッシュ化
    //     var hash_phrase = CryptoJS.SHA256(pass);

    //     window.alert("パスワードを承認しました。");

    //     // セッションストレージには、暗号鍵作成フラグを登録
    //     sessionStorage.setItem("crypted", true);

    //     // モーダルを閉じる
    //     $(".js-modal").addClass("is_close").removeClass("is_open");
    //     $("body").removeClass("fixed").css({ top: "" });

    //     // パスワード登録、表示画面を表示
    //     register_div.style.display = "block";

    //     var passwords = data.pass;
    //     Display.display_password(hash_phrase, passwords);

    //     /* =================================
    //     ユーザー未登録の場合
    //   ================================= */
    //   } else if (data.flag == "new") {
    //     console.log("新規登録");

    //     /* =================================
    //     パスワードミスの場合
    //   ================================= */
    //   } else if (data.flag == "miss") {
    //     console.log("パスワードミス");

    //     /* =================================
    //     それ以外、想定していない出力の場合
    //   ================================= */
    //   } else {
    //     console.log("エラーが発生しました。");
    //   }

    //   console.log(pass);
    //   console.log(data.id);

    //   // ログインフォームのパスワードをハッシュ化、パスフレーズとする
    //   var hash_phrase = CryptoJS.SHA256(pass);
    //   // セッションIDを、パスフレーズで暗号化する
    //   var encrypt_session = Encrypt.encrypt_password(hash_phrase, data.id);
    //   console.log(encrypt_session);

    //   // 現在時刻を取得する
    //   var dateObj = new Date();
    //   var text = "";

    //   text =
    //     dateObj.getFullYear() +
    //     "-" + //年の取得
    //     ("00" + (dateObj.getMonth() + 1)).slice(-2) +
    //     "-" + //月の取得 ※0~11で取得になるため+1
    //     ("00" + dateObj.getDate()).slice(-2) +
    //     " " + //日付の取得
    //     ("00" + dateObj.getHours()).slice(-2) +
    //     ":" + //時間の取得
    //     ("00" + dateObj.getMinutes()).slice(-2) +
    //     ":" + //分の取得
    //     ("00" + dateObj.getSeconds()).slice(-2); //秒の取得

    //   console.log(text);

    //   // セッションストレージに暗号化セッション、有効期限を保存する
    //   sessionStorage.setItem("id", encrypt_session);
    //   sessionStorage.setItem("limit", data.limit);
    // });
  });
});
