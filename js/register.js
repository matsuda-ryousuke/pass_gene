class Register {
  /**=============================================================================
     * ローカルストレージにパスワードを保存する関数
     =============================================================================*/
  static local_storage_set(key, value) {
    let object = JSON.parse(localStorage.getItem("password"));
    if (object == null) {
      object = {};
    }

    object[key] = value;

    localStorage.setItem("password", JSON.stringify(object));
    alert("Local Storage: データーをセットしました。");
  }

  /**=============================================================================
     * ローカルストレージからパスワードを取得する関数
     =============================================================================*/
  static local_storage_get(key) {
    var item = localStorage.getItem(key);
    var object = JSON.parse(item);

    return object;
  }

  /**=============================================================================
     * ローカルストレージからパスワードを削除する関数
     =============================================================================*/
  static local_storage_delete() {
    localStorage.removeItem("password");
  }


  /**=============================================================================
     * セッションストレージにパスワードを保存する関数
     =============================================================================*/
  static session_storage_set(key, value) {
    let object = JSON.parse(sessionStorage.getItem(key));
    if (object == null) {
      sessionStorage.setItem(key, value);
    }

  }

  /**=============================================================================
     * ローカルストレージからパスワードを取得する関数
     =============================================================================*/
  static session_storage_get(key) {
    var item = sessionStorage.getItem(key);
    var object = JSON.parse(item);

    return object;
  }

  /**=============================================================================
     * ローカルストレージからパスワードを削除する関数
     =============================================================================*/
  static session_storage_delete(key) {
    sessionStorage.removeItem(key);
  }
}
