class Encrypt {
  // データをUTF8にエンコード
  static crypt_encode(data) {
    return CryptoJS.enc.Utf8.parse(data);
  }

  // 暗号鍵用のパスフレーズ、暗号対象のパスワードから、暗号化を行う
  static encrypt_password(pass_phrase, password) {
    // 暗号鍵のパスフレーズはUTF-8エンコーディング
    var utf8_passphrase = Encrypt.crypt_encode(pass_phrase);
    // 暗号化内容パスワードはUTF-8エンコーディング
    var utf8_password = Encrypt.crypt_encode(password);

    // salt を設定
    var salt = CryptoJS.lib.WordArray.random(128 / 8);
    // console.log(salt);

    // 256ビット鍵、イテレーション500として鍵空間を定義
    var key256Bits500Iterations = CryptoJS.PBKDF2(utf8_passphrase, salt, {
      keySize: 256 / 32,
      iterations: 500,
    });
    // 初期化ベクトル（ブロック長と同じ）
    var iv = CryptoJS.lib.WordArray.random(128 / 8);
    // 暗号化オプション（IV:初期化ベクトル, CBCモード, パディングモード：PKCS7
    var options = {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    };

    // ここで暗号化を行う
    var encrypted = CryptoJS.AES.encrypt(
      utf8_password,
      key256Bits500Iterations,
      options
    );

    // iv + 暗号結果データ を、バイナリとして保存
    var binary_data = CryptoJS.enc.Hex.stringify(salt);
    binary_data += "," + CryptoJS.enc.Hex.stringify(iv);
    binary_data += "," + encrypted;
    // console.log(binary_data);
    return binary_data;
  }

  static decrypt_password(pass_phrase, encrypted) {
    // 暗号鍵のパスフレーズはUTF-8エンコーディング
    var utf8_passphrase = Encrypt.crypt_encode(pass_phrase);
    // あからじめ仕込んでおいた暗号化データのカンマ","を使って文字列をそれぞれに分割
    var array_rawData = encrypted.split(",");

    var salt = CryptoJS.enc.Hex.parse(array_rawData[0]); // ソルト
    var iv = CryptoJS.enc.Hex.parse(array_rawData[1]); // 初期化ベクトル（IV）
    var encrypted_data = CryptoJS.enc.Base64.parse(array_rawData[2]); //暗号化データ本体
    // console.log(salt);
    // console.log(iv);
    // console.log(encrypted_data);

    //パスフレーズ（鍵空間の定義）
    var key256Bits500Iterations = CryptoJS.PBKDF2(utf8_passphrase, salt, {
      keySize: 256 / 32,
      iterations: 500,
    });

    //復号オプション（暗号化と同様）
    var options = {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    };

    // ここで復号を行う
    var decrypted = CryptoJS.AES.decrypt(
      { ciphertext: encrypted_data },
      key256Bits500Iterations,
      options
    );

    // console.log(decrypted);
    // 文字コードをUTF-8にする
    var decrypted_txt = decrypted.toString(CryptoJS.enc.Utf8);
    return decrypted_txt;
  }
}
