$(function () {
  $(document).ready(function () {
    // セッションストレージを削除
    sessionStorage.clear();

    $("a").click(function () {
      return false;
    });

    // パスワード生成、登録表示セクションの定義
    const pass_div = $("#pass_div");
    const register_div = $("#register_div");
    const login_div = $("#login_div");
    const password = $("#password");

    // ログインセクション以外を非表示にする
    login_div.css("display", "block");
    pass_div.css("display", "none");
    register_div.css("display", "none");
    password.css("opacity", 0);

    // Generate Passwordボタンでパスワード生成
    $("#gene_btn").click(function () {
      password.css("display", "block");
      password.css("opacity", 1);

      Password.get_pass2();
    });

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
    $("#pass_box").click(function () {
      // コピーするパスワード本体
      var copy_item = this.innerHTML;

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

      alert("パスワードをコピーしました");
    });

    $("#non-login").click(function () {
      // パスワード生成セクション以外を非表示にする
      login_div.css("display", "none");
      pass_div.css("display", "block");
      register_div.css("display", "none");
      password.css("opacity", 0);
      alert("かんたんログインしました。");
    });
  });
});
