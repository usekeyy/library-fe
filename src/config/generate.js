import dotenv from "dotenv";
const CryptoJS = require("crypto-js");
dotenv.config();
const key = process.env.REACT_APP_SECRET;

export const encrypt = (dataEncrypt) => CryptoJS.AES.encrypt(dataEncrypt, key).toString();
export const decrypt = (dataDecrypt) => CryptoJS.AES.decrypt(dataDecrypt, key).toString(CryptoJS.enc.Utf8);