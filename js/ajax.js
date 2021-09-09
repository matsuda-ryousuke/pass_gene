$(function () {
  // ユーザーが登録されているか確認→登録済みならばログインをするためのajax関数
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

  // ユーザー登録をするためのajax関数
  function register_ajax(mail, pass) {
    return $.ajax({
      url: "http://192.168.33.13/register.php",
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
        var hash_source = mail + pass;
        var hash_phrase = CryptoJS.SHA256(hash_source);

        window.alert("パスワードを承認しました。");

        $("#login_div").hide();

        // セッションストレージには、暗号鍵作成フラグを登録
        sessionStorage.setItem("crypted", true);

        // モーダルを閉じる
        $(".js-modal").addClass("is_close").removeClass("is_open");
        $("body").removeClass("fixed").css({ top: "" });

        // パスワード登録、表示画面を表示
        register_div.style.display = "block";
        pass_div.style.display = "block";

        console.log(data.pass);
        var passwords = data.pass;

        Display.display_password(hash_phrase, passwords);

        /* =================================
        ユーザー未登録の場合
      ================================= */
      } else if (data.flag == "new") {
        console.log("新規登録");

        var mail = $("#login_mail").val();
        var pass = $("#login_pass").val();

        console.log(mail + pass);

        // パスワードのマスク作成
        var mask = "";
        mask = mask.padStart(pass.length, "*");
        console.log(mask);

        // 確認用のモーダルを表示する
        var scrollPos = $(window).scrollTop();
        var target = "modal_confirm";
        var modal = document.getElementById(target);
        $(modal).addClass("is_open").removeClass("is_close");
        $("body").addClass("fixed").css({ top: -scrollPos });
        $("#confirm_mail").html(mail);
        $("#confirm_pass").html(mask);

        // クリックイベントが連続で発火するバグの対策
        $("#confirm_btn").off("click");
        // 確認ボタンクリック時
        $("#confirm_btn").click(function () {
          // ログインフォームの値取得
          var double = $("#double_confirm_pass").val();
          console.log(double);
          console.log("123123");
          if (pass != double) {
            alert("パスワードが合致しません。");
            console.log(pass);
            console.log(double);
          } else {
            // ajaxで登録処理
            register_ajax(mail, pass).done(function (data, textStatus, jqXHR) {
              // 完了した場合、
              console.log(data);
              // console.log(JSON.parse(data));

              console.log(data.flag);

              // ハッシュフレーズ：入力パスワードのハッシュ化
              var hash_source = mail + pass;
              var hash_phrase = CryptoJS.SHA256(hash_source);

              window.alert("パスワードを承認しました。");

              $("#login_div").hide();

              // セッションストレージには、暗号鍵作成フラグを登録
              sessionStorage.setItem("crypted", true);

              // モーダルを閉じる
              $(".js-modal").addClass("is_close").removeClass("is_open");
              $("body").removeClass("fixed").css({ top: "" });

              // パスワード登録、表示画面を表示
              register_div.style.display = "block";
              pass_div.style.display = "block";

              // 新規登録時にはパスワード登録はされていないのでnullを入力
              Display.display_password(hash_phrase, null);
            });
          }
        });

        /* =================================
        パスワードミスの場合
      ================================= */
      } else if (data.flag == "miss") {
        console.log("パスワードミス");

        window.alert("パスワードが間違っています。");

        /* =================================
        それ以外、想定していない出力の場合
      ================================= */
      } else {
        console.log("エラーが発生しました。");
        window.alert("パスワードが間違っています。");
      }

      console.log(pass);
      console.log(data.id);

      // ログインフォームのパスワードをハッシュ化、パスフレーズとする
      var hash_source = mail + pass;
      var hash_phrase = CryptoJS.SHA256(hash_source);

      /* =================================セッションコメントアウト */
      // // セッションIDを、パスフレーズで暗号化する
      // var encrypt_session = Encrypt.encrypt_password(hash_phrase, data.id);
      // console.log(encrypt_session);

      // // 現在時刻を取得する
      // var dateObj = new Date();
      // var text = "";

      // text =
      //   dateObj.getFullYear() +
      //   "-" + //年の取得
      //   ("00" + (dateObj.getMonth() + 1)).slice(-2) +
      //   "-" + //月の取得 ※0~11で取得になるため+1
      //   ("00" + dateObj.getDate()).slice(-2) +
      //   " " + //日付の取得
      //   ("00" + dateObj.getHours()).slice(-2) +
      //   ":" + //時間の取得
      //   ("00" + dateObj.getMinutes()).slice(-2) +
      //   ":" + //分の取得
      //   ("00" + dateObj.getSeconds()).slice(-2); //秒の取得

      // console.log(text);

      // // セッションストレージに暗号化セッション、有効期限を保存する
      // sessionStorage.setItem("id", encrypt_session);
      // sessionStorage.setItem("limit", data.limit);

      /* =================================セッションコメントアウト */
    });

    // プロミス、ajaxが終わる前にここの処理はされてしまうので、NG
    // console.log(user_id);
    // console.log(user_id["id"]);
  });

  /* =================================session_id => mail */

  function post_ajax(encrypt_password, service, mail, pass) {
    return $.ajax({
      url: "http://192.168.33.13/post.php",
      type: "POST",
      dataType: "json",
      data: {
        encrypt_password: encrypt_password,
        service: service,
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

  $("#post-btn").click(function () {
    // 変数定義

    var service = $("#post_service").val();
    var mail = $("#post_mail").val();
    var pass = $("#post_pass").val();
    var word = Password.unescapeHtml($("#pass_box").html());
    console.log(service);
    console.log(pass);
    console.log(word);

    // 入力パスワードのハッシュ化
    var hash_source = mail + pass;
    var hash_phrase = CryptoJS.SHA256(hash_source);
    var encrypt_password = Encrypt.encrypt_password(hash_phrase, word);
    console.log(encrypt_password);

    /* =================================セッションコメントアウト */
    // // セッションストレージのセッションID（暗号化）を復号
    // var session_id = Encrypt.decrypt_password(
    //   hash_phrase,
    //   sessionStorage.getItem("id")
    // );
    // console.log(session_id);

    // // セッションIDの有効期限を取得
    // var limit = sessionStorage.getItem("limit");
    // console.log(limit);

    // // 現在時刻を取得する
    // var dateObj = new Date();
    // var now = "";

    // now =
    //   dateObj.getFullYear() +
    //   "-" + //年の取得
    //   ("00" + (dateObj.getMonth() + 1)).slice(-2) +
    //   "-" + //月の取得 ※0~11で取得になるため+1
    //   ("00" + dateObj.getDate()).slice(-2) +
    //   " " + //日付の取得
    //   ("00" + dateObj.getHours()).slice(-2) +
    //   ":" + //時間の取得
    //   ("00" + dateObj.getMinutes()).slice(-2) +
    //   ":" + //分の取得
    //   ("00" + dateObj.getSeconds()).slice(-2); //秒の取得

    // console.log(now);

    // console.log(limit <= now);

    // // 有効期限切れの場合、ページ再読み込みをかける
    // if (limit <= now) {
    //   alert("ログインしなおしてください。");
    //   location.reload();
    // }

    /* =================================セッションコメントアウト */

    /* ===========================
    ここからajax
    ============================== */
    // ajax処理;
    post_ajax(encrypt_password, service, mail, pass).done(function (
      data,
      textStatus,
      jqXHR
    ) {
      // 完了した場合、
      console.log(data);
      // console.log(JSON.parse(data));

      console.log(data.flag);

      /* =================================
        パスワード登録成功の場合
      ================================= */
      if (data.flag == "success") {
        console.log("登録済み");

        window.alert("パスワードを登録しました。");

        // ハッシュフレーズ：入力パスワードのハッシュ化
        var hash_source = mail + pass;
        var hash_phrase = CryptoJS.SHA256(hash_source);

        // モーダルを閉じる
        $(".js-modal").addClass("is_close").removeClass("is_open");
        $("body").removeClass("fixed").css({ top: "" });

        // パスワード登録、表示画面を表示
        register_div.style.display = "block";
        pass_div.style.display = "block";

        var passwords = data.pass;
        Display.display_password(hash_phrase, passwords);

        /* =================================
        パスワードミスの場合
      ================================= */
      } else if (data.flag == "miss") {
        window.alert("パスワードが間違っています。");
        /* =================================
        ユーザー未登録の場合
      ================================= */
      } else if (data.flag == "error") {
        window.alert("登録されていないメールアドレスです。");
        /* =================================
        サービス名がすでに登録されている場合
      ================================= */
      } else if (data.flag == "isset") {
        window.alert("サービス名がかぶっています。");
        /* =================================
        それ以外、想定していない出力の場合
      ================================= */
      } else {
        console.log("エラーが発生しました。");
      }

      console.log(pass);
      console.log(data.id);
    });
  });

  function delete_ajax(service, mail, pass, number) {
    return $.ajax({
      url: "http://192.168.33.13/delete.php",
      type: "POST",
      dataType: "json",
      data: {
        service: service,
        mail: mail,
        pass: pass,
        number: number,
      },
    }).fail(function (jqXHR, textStatus, errorThrown) {
      // Ajaxの通信に問題があった場合
      $("#msg").html("エラーが発生しました。");
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    });
  }

  $("#delete_btn").click(function () {
    // 変数定義

    var service = $("#delete_service").html();
    var mail = $("#delete_mail").val();
    var pass = $("#delete_pass").val();
    var number = $("#delete_number").val();
    console.log(mail);
    console.log(pass);
    console.log(number);

    delete_ajax(service, mail, pass, number).done(function (
      data,
      textStatus,
      jqXHR
    ) {
      console.log(data);
      // パスワード一覧表示
      var hash_source = mail + pass;
      var hash_phrase = CryptoJS.SHA256(hash_source);
      Display.display_password(hash_phrase, data.pass);
    });
  });
});
