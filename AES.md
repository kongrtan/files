
# 🔐 QueryString 기밀 보호: AES 암호화 (.NET → JavaScript 복호화)

## 📌 목적

서버에서 AES-256-CBC로 QueryString 데이터를 암호화하고, 클라이언트(JavaScript)에서 복호화하여 **QueryString의 기밀성을 보호**합니다.

---

## ✅ 암호화 구조

| 구분         | 내용                          |
|--------------|-------------------------------|
| 암호화       | .NET Core (.NET 6 이상 권장) |
| 복호화       | JavaScript (`crypto-js`)      |
| 암호화 방식  | AES-256-CBC                    |
| 전달 방식    | Base64 인코딩된 암호문을 QueryString에 포함 |
| 전송 채널    | HTTPS 필수                     |

---

## 🧩 1. .NET Core: AES 암호화 예제

```csharp
using System.Security.Cryptography;
using System.Text;

public static class AesEncryptor
{
    public static string Encrypt(string plainText, string keyString, string ivString)
    {
        byte[] key = Encoding.UTF8.GetBytes(keyString); // 32바이트
        byte[] iv = Encoding.UTF8.GetBytes(ivString);   // 16바이트

        using var aes = Aes.Create();
        aes.Key = key;
        aes.IV = iv;
        aes.Mode = CipherMode.CBC;

        var encryptor = aes.CreateEncryptor();
        byte[] plainBytes = Encoding.UTF8.GetBytes(plainText);
        byte[] encrypted = encryptor.TransformFinalBlock(plainBytes, 0, plainBytes.Length);

        return Convert.ToBase64String(encrypted);
    }
}
```

### 🔑 샘플 키/IV

```csharp
string key = "01234567890123456789012345678901"; // 32 bytes
string iv = "abcdef1234567890"; // 16 bytes
string query = "userId=admin&role=admin";

string encrypted = AesEncryptor.Encrypt(query, key, iv);
// 결과 예: Zr65YrPIGh0urFfAY8u2og==

public static string GenerateRandomIVString()
{
    const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var random = new Random();
    return new string(Enumerable.Repeat(chars, 16)
        .Select(s => s[random.Next(s.Length)]).ToArray());
}

```

---

## 🌐 2. JavaScript: AES 복호화 (`crypto-js` 사용)

### 📦 설치

```bash
npm install crypto-js
```

### 📜 복호화 코드

```js
import CryptoJS from "crypto-js";

const encryptedBase64 = new URLSearchParams(window.location.search).get("q");

const key = CryptoJS.enc.Utf8.parse("01234567890123456789012345678901"); // 32 bytes
const iv = CryptoJS.enc.Utf8.parse("abcdef1234567890"); // 16 bytes

const decrypted = CryptoJS.AES.decrypt(encryptedBase64, key, {
  iv: iv,
  mode: CryptoJS.mode.CBC,
  padding: CryptoJS.pad.Pkcs7,
});

const plainText = decrypted.toString(CryptoJS.enc.Utf8);
console.log("복호화된 QueryString:", plainText);
```

---

## 🧪 예시 동작

- **전송된 URL**

```
https://example.com/page?q=Zr65YrPIGh0urFfAY8u2og==
```

- **브라우저 콘솔 출력**

```txt
userId=admin&role=admin
```

---

## 🔐 보안 주의사항

- 반드시 **HTTPS**를 사용하여 QueryString 전송
- 키와 IV는 하드코딩하지 말고, 가능한 경우 서버에서 동적으로 전달
- 키는 세션 단위 또는 일회성으로 관리하는 것이 이상적
- Base64 인코딩 시 `URL-safe` 변환이 필요한 경우 있음

---

## 📦 요약

| 항목            | 설명                                           |
|----------------|------------------------------------------------|
| 알고리즘        | AES-256-CBC                                    |
| 키 길이         | 32 bytes (256-bit)                             |
| IV 길이         | 16 bytes                                       |
| 클라이언트 복호화 | JavaScript + crypto-js                         |
| 보안 추천       | HTTPS 사용, 키 동적 전달, 세션/일회용 키 사용 |
