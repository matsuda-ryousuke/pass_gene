$(function () {
  // ユーザーが登録されているか確認→登録済みならばログインをするためのajax関数
  function login_ajax(mail, pass) {
    return $.ajax({
      url: "https://wecbfv78ol.execute-api.ap-northeast-1.amazonaws.com/dynamo_dev/dynamodb",
      type: "POST",
      dataType: "json",
      data: JSON.stringify({
        OperationType: "LOGIN",
        Keys: {
          partition: mail,
          sort: mail,
          user_pass: pass,
        },
      }),
    }).fail(function (jqXHR, textStatus, errorThrown) {
      // Ajaxの通信に問題があった場合
      window.alert("エラーが発生しました。");
    });
  }

  // ユーザー登録をするためのajax関数
  function register_ajax(mail, pass) {
    return $.ajax({
      url: "https://wecbfv78ol.execute-api.ap-northeast-1.amazonaws.com/dynamo_dev/dynamodb",
      type: "POST",
      dataType: "json",
      data: JSON.stringify({
        OperationType: "PUTUSER",
        Keys: {
          partition: mail,
          sort: mail,
          user_pass: pass,
        },
      }),
    }).fail(function (jqXHR, textStatus, errorThrown) {
      // Ajaxの通信に問題があった場合
      window.alert("エラーが発生しました。");
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
      data = JSON.parse(data);

      /* =================================
        ユーザー登録済みの場合
      ================================= */
      if (data.flag == "registered") {
        // 入力メールアドレス＋パスワードをハッシュ化したものを暗号化キーとする
        var hash_source = data.mail + data.pass;
        var hash_phrase = CryptoJS.SHA256(hash_source);
        window.alert("パスワードを承認しました。");

        // ログインフォームは非表示
        $("#login_div").hide();

        // モーダルを閉じる
        $(".js-modal").addClass("is_close").removeClass("is_open");
        $("body").removeClass("fixed").css({ top: "" });

        // パスワード登録、表示画面を表示
        register_div.style.display = "block";
        pass_div.style.display = "block";
        var passwords = data.passwords;
        Display.display_password(hash_phrase, passwords);

        /* =================================
        ユーザー未登録の場合
      ================================= */
      } else if (data.flag == "new") {
        // パスワードのマスク作成
        var mask = "";
        mask = mask.padStart(pass.length, "*");

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
          // 入力パスワードが異なる場合
          if (pass != double) {
            alert("パスワードが合致しません。");
            // 合致した場合
          } else {
            // ajaxで登録処理
            register_ajax(mail, pass).done(function (data, textStatus, jqXHR) {
              // 完了した場合、
              // 入力メールアドレス＋パスワードをハッシュ化したものを暗号化キーとする
              var hash_source = mail + pass;
              var hash_phrase = CryptoJS.SHA256(hash_source);
              window.alert("パスワードを承認しました。");

              // ログインフォームは非表示
              $("#login_div").hide();

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
        パスワードが未入力の場合
      ================================= */
      } else if (data.flag == "nopass") {
        window.alert("パスワードを入力してください。");

        /* =================================
        パスワードミスの場合

      ================================= */
      } else if (data.flag == "miss") {
        window.alert("パスワードが間違っています。");

        /* =================================
        それ以外、想定していない出力の場合
      ================================= */
      } else {
        window.alert("エラーが発生しました。");
      }
    });
  });

  // ユーザーが新規パスワードを登録するためのajax関数
  function post_ajax(encrypt_password, service, mail, pass) {
    return $.ajax({
      url: "https://wecbfv78ol.execute-api.ap-northeast-1.amazonaws.com/dynamo_dev/dynamodb",
      type: "POST",
      dataType: "json",
      data: JSON.stringify({
        OperationType: "PUTPASS",
        Keys: {
          partition: mail,
          sort: service,
          user_pass: pass,
          encrypt_password: encrypt_password,
        },
      }),
    }).fail(function (jqXHR, textStatus, errorThrown) {
      // Ajaxの通信に問題があった場合
      window.alert("エラーが発生しました。");
    });
  }

  // パスワード登録ボタンのクリック時にajax発動
  $("#post-btn").click(function () {
    // 変数定義
    var service = $("#post_service").val();
    var mail = $("#post_mail").val();
    var pass = $("#post_pass").val();
    var word = Password.unescapeHtml($("#pass_box").html());

    // 入力パスワードの暗号化
    var hash_source = mail + pass;
    var hash_phrase = CryptoJS.SHA256(hash_source);
    var encrypt_password = Encrypt.encrypt_password(hash_phrase, word);

    /* ===========================
    ここからajax
    ============================== */
    post_ajax(encrypt_password, service, mail, pass).done(function (
      data,
      textStatus,
      jqXHR
    ) {
      // 完了した場合、
      data = JSON.parse(data);
      /* =================================
        パスワード登録成功の場合
      ================================= */
      if (data.flag == "success") {
        window.alert("パスワードを登録しました。");

        // 入力メールアドレス＋パスワードをハッシュ化したものを暗号化キーとする
        var hash_source = mail + pass;
        var hash_phrase = CryptoJS.SHA256(hash_source);

        // モーダルを閉じる
        $(".js-modal").addClass("is_close").removeClass("is_open");
        $("body").removeClass("fixed").css({ top: "" });

        // パスワード登録、表示画面を表示
        register_div.style.display = "block";
        pass_div.style.display = "block";

        var passwords = data.passwords;
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
        window.alert("エラーが発生しました。");
      }
    });
  });

  // ユーザーが登録済みパスワードを削除するためのajax関数
  function delete_ajax(service, mail, pass) {
    return $.ajax({
      url: "https://wecbfv78ol.execute-api.ap-northeast-1.amazonaws.com/dynamo_dev/dynamodb",
      type: "POST",
      dataType: "json",
      data: JSON.stringify({
        OperationType: "DELETE",
        Keys: {
          partition: mail,
          sort: service,
          user_pass: pass,
        },
      }),
    }).fail(function (jqXHR, textStatus, errorThrown) {
      // Ajaxの通信に問題があった場合
      window.alert("エラーが発生しました。");
    });
  }

  // パスワード削除ボタンクリック時
  $("#delete_btn").click(function () {
    // 変数定義
    var service = $("#delete_service").html();
    var mail = $("#delete_mail").val();
    var pass = $("#delete_pass").val();

    /* ===========================
    ここからajax
    ============================== */
    delete_ajax(service, mail, pass).done(function (data, textStatus, jqXHR) {
      // 完了した場合、
      data = JSON.parse(data);

      // 削除に成功していた場合
      if (data.flag == "deleted") {
        window.alert("パスワードを削除しました。");

        // モーダルを閉じる
        $(".js-modal").addClass("is_close").removeClass("is_open");
        $("body").removeClass("fixed").css({ top: "" });

        // パスワード一覧表示
        var hash_source = data.mail + data.pass;
        var hash_phrase = CryptoJS.SHA256(hash_source);
        Display.display_password(hash_phrase, data.passwords);
        // 削除に失敗した場合
      } else {
        window.alert("エラーが発生しました。");

        // モーダルを閉じる
        $(".js-modal").addClass("is_close").removeClass("is_open");
        $("body").removeClass("fixed").css({ top: "" });
      }
    });
  });
});
