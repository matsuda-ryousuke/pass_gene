class Display {
  /**=============================================================================
     * 取得したパスワードを表示する関数
     =============================================================================*/
  static display_password(pass_phrase, object) {
    if (object == null) {
      display_pass.innerHTML = "";
    } else {
      // オブジェクトを表に出力
      var text = "<dl>";
      for (var key in object) {
        console.log(Encrypt.decrypt_password(pass_phrase, object[key]));
        text += "<div>";
        text += "<dt>" + key + "</dt>";
        text +=
          "<dd>" +
          Password.escapeHtml(
            Encrypt.decrypt_password(pass_phrase, object[key])
          ) +
          "</dd>";
        text += '<a href="#" class="copy_btn">copy</a>';
        text += '<a href="#" class="delete_btn">delete</a>';
        text += "</div>";
      }
      text += "</dl>";
      display_pass.innerHTML = text;

      // コピー、削除ボタンの挙動を登録
      Display.copy_password(pass_phrase);
      Display.delete_password(pass_phrase);
    }
  }

  /**=============================================================================
     * パスワード登録時、指定したサービス名が登録済みかチェック
     =============================================================================*/
  static check_service(object, service) {
    var flag = false;
    if (object == null) {
    } else {
      for (var key in object) {
        if (key == service) {
          flag = true;
        }
      }
    }
    console.log(flag);
    return flag;
  }

  /**=============================================================================
     * パスワードをコピーする関数
     =============================================================================*/
  static copy_password(pass_phrase) {
    const copy_btn = document.getElementsByClassName("copy_btn");
    // パスワード内の特殊文字をアンエスケープする関数
    var unescapeHtml = function (target) {
      if (typeof target !== "string") return target;

      var patterns = {
        "&lt;": "<",
        "&gt;": ">",
        "&amp;": "&",
        "&quot;": '"',
        "&#x27;": "'",
        "&#x60;": "`",
      };

      return target.replace(/&(lt|gt|amp|quot|#x27|#x60);/g, function (match) {
        return patterns[match];
      });
    };

    for (let i = 0; i < copy_btn.length; i++) {
      // 各コピーボタンに対して、クリックイベントを登録
      copy_btn[i].addEventListener("click", function () {
        var data = Register.local_storage_get("password");
        console.log(data);

        // コピーする対象の名前
        var copy_name = this.parentNode.children[0].innerHTML;
        // var copy_name_test = Object.keys(data)[i];

        // コピーするパスワード本体
        var copy_item = this.parentNode.children[1].innerHTML;
        var copy_item_test = Object.values(data)[i];

        var copy_item_decrypt = Encrypt.decrypt_password(
          pass_phrase,
          copy_item_test
        );

        copy_item = unescapeHtml(copy_item);
        if (copy_item == copy_item_decrypt) {
          var listener = function (e) {
            e.clipboardData.setData("text/plain", copy_item);
            // 本来のイベントをキャンセル
            e.preventDefault();
            // 終わったら一応削除
            document.removeEventListener("copy", listener);
          };
          // コピーのイベントが発生したときに、クリップボードに書き込むようにしておく
          document.addEventListener("copy", listener);
          // コピー
          document.execCommand("copy");

          alert(copy_name + " のパスワードをコピーしました");
        } else {
          alert("不正な入力を検知しましたあ。");
          // console.log(copy_item);
          // console.log(copy_item_decrypt);
        }
      });
    }
  }

  /**=============================================================================
     * 指定パスワードを削除する関数
     =============================================================================*/
  static delete_password(pass_phrase) {
    const delete_btn = document.getElementsByClassName("delete_btn");

    for (let i = 0; i < delete_btn.length; i++) {
      delete_btn[i].addEventListener("click", function () {
        var data = Register.local_storage_get("password");

        // コピーする対象の名前
        var delete_name = this.parentNode.children[0].innerHTML;
        var delete_name_test = Object.keys(data)[i];

        if (delete_name == delete_name_test) {
          var result = window.confirm(
            delete_name + " のパスワードを削除してもよろしいですか？"
          );
          if (result) {
            let object = JSON.parse(localStorage.getItem("password"));
            delete object[delete_name];
            localStorage.setItem("password", JSON.stringify(object));
            var data = Register.local_storage_get("password");
            // パスワード一覧表示
            Display.display_password(pass_phrase, data);
          }
        } else {
          alert("不正な入力を検知しましたい。");
        }
      });
    }
  }

  /**=============================================================================
     * すべてのパスワードを削除する関数
     =============================================================================*/
  static all_delete_password(pass_phrase) {
    var result = window.confirm("パスワードを削除してもよろしいですか？");
    if (result) {
      Register.local_storage_delete();
    }

    // パスワード一覧表示
    var data = Register.local_storage_get("password");
    Display.display_password(pass_phrase, data);
  }
}
