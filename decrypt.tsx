"use client";

import React, { useState } from "react";
import CryptoJS from "crypto-js";

const AESDecryptSample = () => {
  const [encryptedText, setEncryptedText] = useState(
    "YOUR_BASE64_ENCRYPTED_DATA_HERE"
  );
  const [key, setKey] = useState("YOUR_AES_KEY_IN_HEX_OR_UTF8");
  const [iv, setIv] = useState("YOUR_IV_IN_HEX_OR_UTF8");
  const [decryptedText, setDecryptedText] = useState("");

  const handleDecrypt = () => {
    try {
      // CryptoJS는 key와 iv를 WordArray 형태로 만들어야 합니다.
      const keyWA = CryptoJS.enc.Utf8.parse(key);
      const ivWA = CryptoJS.enc.Utf8.parse(iv);

      // Base64로 인코딩된 암호문을 WordArray로 변환
      const encryptedWA = CryptoJS.enc.Base64.parse(encryptedText);

      // 복호화 수행
      const decrypted = CryptoJS.AES.decrypt(
        { ciphertext: encryptedWA },
        keyWA,
        {
          iv: ivWA,
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.Pkcs7,
        }
      );

      const decryptedStr = decrypted.toString(CryptoJS.enc.Utf8);
      setDecryptedText(decryptedStr);
    } catch (error) {
      setDecryptedText("복호화 실패: " + (error as Error).message);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>AES 복호화 샘플 (crypto-js)</h2>
      <div>
        <label>암호화된 텍스트 (Base64):</label>
        <br />
        <textarea
          rows={4}
          cols={60}
          value={encryptedText}
          onChange={(e) => setEncryptedText(e.target.value)}
        />
      </div>
      <div>
        <label>Key (16/24/32바이트 UTF-8 문자열):</label>
        <br />
        <input
          type="text"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          style={{ width: 400 }}
        />
      </div>
      <div>
        <label>IV (16바이트 UTF-8 문자열):</label>
        <br />
        <input
          type="text"
          value={iv}
          onChange={(e) => setIv(e.target.value)}
          style={{ width: 400 }}
        />
      </div>
      <button onClick={handleDecrypt} style={{ marginTop: 10 }}>
        복호화하기
      </button>
      <div style={{ marginTop: 20 }}>
        <label>복호화 결과:</label>
        <pre>{decryptedText}</pre>
      </div>
    </div>
  );
};

export default AESDecryptSample;
