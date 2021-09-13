class Display {
  /**=============================================================================
     * 取得したパスワードを表示する関数
     =============================================================================*/
  static display_password(pass_phrase, object) {
    // console.log(object);
    // console.log(object == null);

    if (object == null) {
      display_pass.innerHTML = "";
    } else {
      // オブジェクトを表に出力
      var text = '<div class="pagination">';
      for (var key in object) {
        // console.log(object[key]);
        // console.log(pass_phrase);
        // console.log(Encrypt.decrypt_password(pass_phrase, object[key]));
        text += '<div class="pass_line">';
        text += '<div class="pass_ttl">' + key + "</div>";
        text +=
          '<div class="pass_content">' +
          Password.escapeHtml(
            Encrypt.decrypt_password(pass_phrase, object[key])
          ) +
          "</div>";
        text += '<div class="pass_btns">';
        text += '<a href="#" class="btn copy_btn">copy</a>';
        text += '<a href="#" class="btn delete_btn">delete</a>';
        text += "</div></div>";
      }
      text += "</div>";
      display_pass.innerHTML = text;

      // コピー、削除ボタンの挙動を登録
      Display.copy_password(pass_phrase);
      Display.delete_password(pass_phrase);

      $(function () {
        $(".pagination").paginathing({
          //親要素のclassを記述
          perPage: 5, //1ページあたりの表示件数
          prevText: "前へ", //1つ前のページへ移動するボタンのテキスト
          nextText: "次へ", //1つ次のページへ移動するボタンのテキスト
          activeClass: "navi-active", //現在のページ番号に任意のclassを付与できます
        });
      });
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
    // console.log(flag);
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
        // コピーする対象の名前
        var copy_name = this.parentNode.children[0].innerHTML;
        // var copy_name_test = Object.keys(data)[i];

        // コピーするパスワード本体
        var copy_item = this.parentNode.children[1].innerHTML;
        // var copy_item_test = Object.values(data)[i];

        copy_item = unescapeHtml(copy_item);
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
      });
    }
  }

  /**=============================================================================
     * 指定パスワードを削除する関数
     =============================================================================*/
  static delete_password(pass_phrase) {
    $(function () {
      const delete_btn = document.getElementsByClassName("delete_btn");

      for (let i = 0; i < delete_btn.length; i++) {
        delete_btn[i].addEventListener("click", function () {
          // 削除する対象の名前

          // var delete_name = this.parentNode.children[0].innerHTML;
          // var delete_pass = this.parentNode.children[1].innerHTML;
          var delete_name = $(this).parent().find("dt").html();
          var delete_pass = $(this).closest("div").find("dd").html();
          var scrollPos;

          // console.log(delete_name);
          // console.log(delete_pass);
          // console.log(i);

          // 未登録の場合モーダルを表示し、削除するか確認
          var target = "modal_delete";
          var modal = document.getElementById(target);
          $(modal).addClass("is_open").removeClass("is_close");
          $("#delete_service").html(delete_name);
          $("#delete_number").val(i);

          // 削除用のモーダル表示
          // モーダル表示
          // console.log("clicked");
          scrollPos = $(window).scrollTop();
          var target = $(this).data("target");
          var modal = document.getElementById(target);
          $(modal).addClass("is_open").removeClass("is_close");
          $("body").addClass("fixed").css({ top: -scrollPos });
        });
      }
    });
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
