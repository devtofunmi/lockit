import CryptoJS from "crypto-js";

export const encryptMessage = (message: string, secretKey: string) => {
  return CryptoJS.AES.encrypt(message, secretKey).toString();
};

export const decryptMessage = (encryptedMessage: string, secretKey: string) => {
  const bytes = CryptoJS.AES.decrypt(encryptedMessage, secretKey);
  return bytes.toString(CryptoJS.enc.Utf8);
};
