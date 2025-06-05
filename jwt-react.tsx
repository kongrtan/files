// App.jsx (React)
import { useEffect, useState } from "react";
import jwtDecode from "jwt-decode";

export default function App() {
  const [token, setToken] = useState("");
  const [result, setResult] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    const subSystemId = urlParams.get("subSystemId");
    if (!token || !subSystemId) return;

    setToken(token);
    fetch(`http://localhost:5000/v1/api/sub-system/${subSystemId}/keys`)
      .then(res => res.json())
      .then(data => {
        const publicKey = data.publicKey;
        window.crypto.subtle.importKey(
          "spki",
          str2ab(atob(publicKey.replace(/-----(BEGIN|END) PUBLIC KEY-----/g, "").replace(/\s+/g, ""))),
          {
            name: "RSASSA-PKCS1-v1_5",
            hash: "SHA-256"
          },
          false,
          ["verify"]
        ).then((key) => {
          // If key imported, decode JWT
          const payload = jwtDecode(token);
          setResult(`✅ 유효한 토큰입니다: ${JSON.stringify(payload)}`);
        }).catch(err => {
          setResult("❌ 공개키 검증 실패: " + err.message);
        });
      }).catch(() => {
        setResult("❌ 공개키 가져오기 실패");
      });
  }, []);

  return (
    <div>
      <h2>JWT 검증 결과</h2>
      <pre>{result}</pre>
    </div>
  );
}

function str2ab(str) {
  const binary = atob(str);
  const len = binary.length;
  const buffer = new ArrayBuffer(len);
  const view = new Uint8Array(buffer);
  for (let i = 0; i < len; i++) {
    view[i] = binary.charCodeAt(i);
  }
  return buffer;
}
