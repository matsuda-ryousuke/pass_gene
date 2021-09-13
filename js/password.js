// This is a JavaScript file

class Password {
  /**=============================================================================
     * パスワード文字列長の指定数値を取得する関数
     * @returns length 文字列の長さ（int）
     =============================================================================*/
  static get_length() {
    var length_num = document.getElementById("pass_length").value;

    // 文字列長の指定がなく、空白 or 整数以外が入った場合 文字列は12文字
    if (length_num == "") {
      var length = 12;
    } else {
      var length = length_num;
    }
    return length;
  }

  /**=============================================================================
     * パスワード表示用のDOM、pass_box のinnerHTML を指定する関数
     * @param {*} pass 文字列 string
     =============================================================================*/
  static print_pass(pass) {
    // 引数のパスワード文字列を、
    var box = document.getElementById("pass_box");
    var box2 = document.getElementById("pass_box2");

    box.innerHTML = pass;
    box2.value = pass;

    // 表示と同時に、セッションストレージにパスワードを最新一件追加
    if (sessionStorage.getItem("new_pass") != null) {
      sessionStorage.removeItem("new_pass");
    }
    Register.session_storage_set("new_pass", Password.unescapeHtml(pass));

    // ログイン済みならばパスワード登録用のボタンを表示
    var modal_btn = document.getElementById("modal_btn");
    if (sessionStorage.getItem("crypted")) {
      if (modal_btn.classList.contains("hidden")) {
        modal_btn.classList.remove("hidden");
      }
      // ログインしていないなら、非表示のまま
    } else {
      if (!modal_btn.classList.contains("hidden")) {
        modal_btn.classList.add("hidden");
      }
    }
  }

  /**=============================================================================
     * パスワードの強度を調べる関数
     =============================================================================*/
  static check_strength() {
    var length = Password.get_length();
    // 文字種を指定するチェックボックスのチェック数を取得
    var checked = document.querySelectorAll("input[name=type]:checked");

    var pattern = 0;
    // 何もチェックされていなければ、88パターンとする
    if (checked.length == 0) {
      pattern = 88;
    } else {
      for (let i = 0; i < checked.length; i++) {
        // チェックされた文字種のパターン数を足し合わせ、一文字あたりのパターン数を出す
        switch (checked[i].value) {
          // 英小文字が選択された場合
          case "lowercase":
            pattern += 26;
            break;

          // 英大文字が選択された場合
          case "uppercase":
            pattern += 26;
            break;

          // 数字が選択された場合
          case "number":
            pattern += 10;
            break;

          // 記号が選択された場合
          case "symbol":
            pattern += 26;
            break;
          default:
            break;
        }
      }
    }
    // 全パターンの組み合わせ総数
    var all_pattern = 1;
    for (let i = 0; i < length; i++) {
      all_pattern *= pattern;
    }
    // 分析にかかる時間（200億/s の解析能力と仮定）
    var analysis = Math.floor(all_pattern / 20000000000);
    var analysis_sec = 0;
    var analysis_min = 0;
    var analysis_hr = 0;
    var analysis_d = 0;
    var analysis_yr = 0;

    // パスワード強度の判定： 1分未満で非常に危険、1日未満で低、1年以内で中、10年以内で高、10年以上で非常に高い
    var strength = "非常に危険";
    var pass_color = document.getElementById("password");
    pass_color.className = "password_danger";

    var result = "";
    if (analysis < 1) {
      result = "1秒以下";
    } else {
      analysis_sec = analysis % 60;
      result = Math.floor(analysis_sec) + "秒";
      if (analysis > 60) {
        analysis_min = analysis % 60;
        analysis /= 60;
        strength = "低";
        result = Math.floor(analysis_min) + "分";

        if (analysis > 60) {
          analysis_min = analysis % 60;
          analysis_hr = analysis / 60;
          analysis /= 60;
          result = Math.floor(analysis_hr) + "時間";

          if (analysis > 24) {
            analysis_hr = analysis % 24;
            analysis_d = analysis / 24;
            analysis /= 24;
            strength = "中";
            pass_color.className = "password_normal";

            result = Math.floor(analysis_d) + "日";

            if (analysis > 365) {
              analysis_d = analysis % 365;
              analysis_yr = analysis / 365;
              result = Math.floor(analysis_yr) + "年";
              pass_color.className = "password_safe";

              if (analysis_yr >= 10) {
                strength = "非常に高い";
              } else {
                strength = "高";
              }
            }
          }
        }
      }
    }

    var strength_box = document.getElementById("strength_box");
    strength_box.innerHTML =
      "パスワード強度： " + strength + "<br>解析にかかる時間の目安： " + result;
  }

  /**=============================================================================
     * パスワード生成、英数字記号全部入りの場合
     =============================================================================*/
  static get_pass() {
    var length = Password.get_length();
    var flag = false;
    let password = "";

    while (!flag) {
      // ASCIIコード表を利用して、文字列長の回数分、ランダムに文字を取得して password 文字列に挿入
      password = "";
      let flag_low = false;
      let flag_up = false;
      let flag_num = false;
      let flag_sym = false;

      for (let i = 0; i < length; i++) {
        // pass_num: ASCIIに対応させるための10進数字
        var pass_num = 33 + Math.floor(Math.random() * 88);
        if (pass_num >= 48 && pass_num <= 57) {
          flag_num = true;
        } else if (pass_num >= 65 && pass_num <= 90) {
          flag_up = true;
        } else if (pass_num >= 97 && pass_num <= 122) {
          flag_low = true;
        } else {
          flag_sym = true;
        }
        // pass_num_ascii: pass_num=10進数字から変換した ascii文字
        var pass_num_ascii = String.fromCharCode(pass_num);

        switch (pass_num_ascii) {
          case "<":
            pass_num_ascii = "&lt;";
            break;
          case ">":
            pass_num_ascii = "&gt;";
            break;
          case "&":
            pass_num_ascii = "&amp;";
            break;
          case '"':
            pass_num_ascii = "&quot;";
            break;
          case "'":
            pass_num_ascii = "&#x27;";
            break;

          default:
            break;
        }

        password += String(pass_num_ascii);
      }
      if (flag_low && flag_up && flag_num && flag_sym) {
        flag = true;
      }
    }

    // password = Password.escapeHtml(password);

    Password.check_strength();
    Password.print_pass(password);
  }

  /**=============================================================================
     * パスワード生成関数、英数字記号を指定できる
     * パスワード一文字を生成する度、英小文字、大文字、数字、記号のいずれの種別であるか？
     * を確定させてから、実際どの文字を入れるかを判断する仕様となっている
     =============================================================================*/
  static get_pass2() {
    var length = Password.get_length();

    // 文字種を指定するチェックボックスのチェック数を取得
    var checked = document.querySelectorAll("input[name=type]:checked");

    // 何もチェックされていなければ、文字種全部入りで生成
    if (checked.length == 0) {
      Password.get_pass();
    } else {
      let password = "";
      while (true) {
        password = "";
        let flag_low = 0;
        let flag_up = 0;
        let flag_num = 0;
        let flag_sym = 0;

        // どの種別がチェックされているかを確認。flag = 0:選択されていない 1:選択されたがパスワードに入っていない 2:選択されてパスワードにも入っている
        for (let i = 0; i < checked.length; i++) {
          switch (checked[i].value) {
            case "lowercase":
              flag_low = 1;
              break;
            case "uppercase":
              flag_up = 1;
              break;
            case "number":
              flag_num = 1;
              break;
            case "symbol":
              flag_sym = 1;
              break;
          }
        }

        for (let i = 0; i < length; i++) {
          // チェックされた要素内でランダムに指定し、どの文字種を入れるかを判断する
          var pass_num = Math.floor(Math.random() * checked.length);

          // 次の文字として、どの文字種を挿入するか？
          switch (checked[pass_num].value) {
            // 英小文字を挿入する場合
            case "lowercase":
              var low = 97 + Math.floor(Math.random() * 26);
              var low_ascii = String.fromCharCode(low);
              password += String(low_ascii);
              flag_low = 2;
              break;

            // 英大文字を挿入する場合
            case "uppercase":
              var up = 65 + Math.floor(Math.random() * 26);
              var up_ascii = String.fromCharCode(up);
              password += String(up_ascii);
              flag_up = 2;
              break;

            // 数字を挿入する場合
            case "number":
              var num = Math.floor(Math.random() * 10);
              password += String(num);
              flag_num = 2;
              break;

            // 記号を挿入する場合
            case "symbol":
              var sym_src = Math.floor(Math.random() * 26);
              // ASCIIにおいて、記号はバラバラな位置に配置されているため、ifで分岐させている
              if (sym_src <= 14) {
                var sym = 33 + sym_src;
              } else if (sym_src <= 21) {
                var sym = 58 + sym_src - 15;
              } else if (sym_src <= 27) {
                var sym = 91 + sym_src - 22;
              } else {
                var sym = 123 + sym_src - 28;
              }

              var sym_ascii = String.fromCharCode(sym);

              // // HTMLにおける特殊文字については、文字参照で扱う
              switch (sym_ascii) {
                case "<":
                  sym_ascii = "&lt;";
                  break;
                case ">":
                  sym_ascii = "&gt;";
                  break;
                case "&":
                  sym_ascii = "&amp;";
                  break;
                case '"':
                  sym_ascii = "&quot;";
                  break;
                case "'":
                  sym_ascii = "&#x27;";
                  break;

                default:
                  break;
              }
              password += String(sym_ascii);
              flag_sym = 2;
              break;

            //
            default:
              var sym2 = 33 + Math.floor(Math.random() * 15);
              var sym2_ascii = String.fromCharCode(sym2);
              password += String(sym2_ascii);
              flag_sym = 2;
              // console.log(sym_ascii);
              break;
          }
        }
        if (flag_up != 1 && flag_low != 1 && flag_num != 1 && flag_sym != 1) {
          break;
        }
      }

      // password = Password.escapeHtml(password);
      Password.check_strength();
      Password.print_pass(password);
    }
  }

  static unescapeHtml(target) {
    if (typeof target !== "string") return target;

    var patterns = {
      "&lt;": "<",
      "&gt;": ">",
      "&amp;": "&",
      "&quot;": '"',
      "&#x27;": "'",
    };

    return target.replace(/&(lt|gt|amp|quot|#x27);/g, function (match) {
      return patterns[match];
    });
  }
  static escapeHtml(target) {
    if (typeof target !== "string") return target;

    var patterns = {
      "<": "&lt;",
      ">": "&gt;",
      "&": "&amp;",
      '"': "&quot;",
      "'": "&#x27;",
    };

    return target.replace(/(<|>|&|"|')/g, function (match) {
      return patterns[match];
    });
  }
}
