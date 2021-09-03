// This is a JavaScript file

window.addEventListener("DOMContentLoaded", function () {
  // セッションストレージを削除
  sessionStorage.clear();

  var datas = localStorage.getItem("password");
  console.log(datas);

  // aタグによる画面遷移を無効化
  var a = document.getElementsByTagName("a");
  for (var n of a) {
    n.addEventListener("click", function (e) {
      // return false;
      e.preventDefault();
    });
  }

  // パスワード生成、登録表示セクションの定義
  const pass_div = document.querySelector("#pass_div");
  const register_div = document.querySelector("#register_div");
  const password = document.querySelector("#password");

  // パスワード生成セクション以外を非表示にする
  pass_div.style.display = "block";
  register_div.style.display = "none";
  password.style.opacity = 0;

  // パスワードを入力させる
  const pass_phrase = window.prompt(
    "ユーザー認証用のパスワードを入力してください。",
    ""
  );

  // パスフレーズはハッシュ化をする
  const hash_phrase = CryptoJS.SHA256(pass_phrase);

  // パスワードが入力されたなら、
  if (pass_phrase) {
    // 初期登録時にはその時刻、及びそれを元にしたソルトをローカルストレージに保存
    if (localStorage.getItem("crypt_date") == null) {
      var now = Date.now();
      encrypt_date = Encrypt.encrypt_password(hash_phrase, now);
      localStorage.setItem("crypt_date", encrypt_date);
      localStorage.setItem("salt", CryptoJS.SHA256(hash_phrase + now));

      register_div.style.display = "block";

      // セッションストレージには、暗号鍵作成フラグを登録
      sessionStorage.setItem("crypted", true);

      window.alert("パスワードを承認しました。");
      // 認証パスワードを送信しなかったらキャンセル

      // pass_div.style.display = "none";
      register_div.style.display = "block";
      var data = Register.local_storage_get("password");

      Display.display_password(hash_phrase, data);

      // 登録済みなら、登録されていたsalt と 入力したパスワードから作成したsalt_test を確認
      // = 登録済みのパスワードと、入力パスワードが合致したかをチェック
    } else {
      var crypt_date = Encrypt.decrypt_password(
        hash_phrase,
        localStorage.getItem("crypt_date")
      );
      var salt_test = CryptoJS.SHA256(hash_phrase + crypt_date).toString();
      var salt = localStorage.getItem("salt");

      // salt の比較が違った場合、処理を抜ける
      if (salt_test !== salt) {
        window.alert("異なる入力値です。");
        // return;
      } else {
        register_div.style.display = "block";

        // セッションストレージには、暗号鍵作成フラグを登録
        sessionStorage.setItem("crypted", true);

        window.alert("パスワードを承認しました。");
        // 認証パスワードを送信しなかったらキャンセル

        // pass_div.style.display = "none";
        register_div.style.display = "block";
        var data = Register.local_storage_get("password");

        Display.display_password(hash_phrase, data);
      }
    }
  } else {
    window.alert("キャンセルされました。");
  }

  // Generate Passwordボタンでパスワード生成
  const gene_btn = document.querySelector("#gene_btn");
  gene_btn.addEventListener("click", function () {
    password.style.display = "block";
    password.style.opacity = 1;

    Password.get_pass2();
  });

  // パスワード登録ボタンクリック
  // var service;
  // const modal_btn = document.getElementById("modal_btn");
  // modal_btn.addEventListener("click", function () {
  //   if (sessionStorage.getItem("crypted")) {
  //     // service = window.prompt(
  //     //   "パスワードに紐づけるサービス名を登録してください。",
  //     //   ""
  //     // );
  //     service = "testtest";
  //     if (service) {
  //       var password = Password.unescapeHtml(
  //         document.getElementById("pass_box").innerHTML
  //       );
  //       var session_password = sessionStorage.getItem("new_pass");
  //       var data = Register.local_storage_get("password");

  //       // サービス名を記入 ＋ パスワードを表示している場合にのみ登録が可能
  //       if (service !== "" && password !== "") {
  //         // パスワード表示欄を弄られていた場合、不正処理とする
  //         if (password != session_password) {
  //           alert("不正な入力を検知しました。");
  //         } else {
  //           if (Display.check_service(data, service)) {
  //             alert("確認");
  //           }
  //           password = Encrypt.encrypt_password(hash_phrase, password);
  //           Register.local_storage_set(service, password);
  //         }
  //       } else {
  //         alert("サービス名 もしくは パスワード欄が空欄です。");
  //       }

  //       var data = Register.local_storage_get("password");
  //       Display.display_password(hash_phrase, data);
  //     }
  //   } else {
  //     alert("不正な入力を検知しました。");
  //   }
  // });

  // パスワード削除ボタンで、ローカルからパスワード組を削除
  const all_delete_btn = document.querySelector("#all_delete_btn");
  all_delete_btn.addEventListener("click", function () {
    Display.all_delete_password(hash_phrase);
  });
});
