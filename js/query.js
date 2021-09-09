$(function () {
  $(document).ready(function () {
    // セッションストレージを削除
    sessionStorage.clear();

    var datas = localStorage.getItem("password");
    console.log(datas);

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

    // パスワード削除ボタンで、ローカルからパスワード組を削除
    $("#all_delete_btn").click(function () {
      console.log("alldel");
      // Display.all_delete_password(hash_phrase);
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
