import CryptoJS from "crypto-js";
const usePasswordEncryptEffects = (token) => {


  // Move iv outside so it can be returned
  const iv = "1234567812345678";
 

  const encryptPassword = (password) => {
     if (!token) return "";
    const key = CryptoJS.enc.Utf8.parse(token);
    const encrypted = CryptoJS.AES.encrypt(password, key, {
      iv: CryptoJS.enc.Utf8.parse(iv),
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
    return encrypted.toString();
  };

  return {
    encryptPassword,
    iv,
  };
};

export default usePasswordEncryptEffects;
