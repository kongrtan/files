
# React에서 JWT 사용 및 파싱

React에서 JWT(Json Web Token)를 사용하는 방법과 파싱 및 보안에 대한 정보를 정리한 문서입니다.

---

## ✅ JWT 기본 흐름

1. 사용자가 로그인하면 서버에서 JWT를 발급합니다.
2. 클라이언트는 이 토큰을 `localStorage` 또는 `sessionStorage`, 혹은 `cookie`에 저장합니다.
3. 클라이언트는 이후 요청 시 JWT를 Authorization 헤더에 `Bearer {token}` 형태로 전송합니다.
4. 서버는 JWT를 검증하여 사용자를 인증합니다.

---

## ✅ JWT 로그인 예시

```tsx
import axios from "axios";

async function login(username: string, password: string) {
  const res = await axios.post("https://your-api.com/auth/login", {
    username,
    password,
  });

  const token = res.data.token;
  localStorage.setItem("jwtToken", token);
}
```

---

## ✅ JWT를 이용한 인증 요청

```tsx
const token = localStorage.getItem("jwtToken");

const res = await axios.get("https://your-api.com/protected", {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
```

---

## ✅ JWT 디코딩 (`jwt-decode` 사용)

### 설치

```bash
npm install jwt-decode
```

### 사용 예시

```tsx
import jwt_decode from "jwt-decode";

const token = localStorage.getItem("jwtToken");
if (token) {
  const decoded = jwt_decode(token);
  console.log("디코딩 결과:", decoded);
}
```

### 타입 정의 (선택)

```tsx
interface JwtPayload {
  sub: string;
  name?: string;
  email?: string;
  exp: number;
  iat?: number;
}

const decoded = jwt_decode<JwtPayload>(token);
```

---

## ✅ JWT 만료 여부 확인

```tsx
function isTokenExpired(token: string): boolean {
  try {
    const decoded: any = jwt_decode(token);
    const now = Date.now() / 1000;
    return decoded.exp < now;
  } catch {
    return true;
  }
}
```

---

## ✅ 디코딩된 JWT를 문자열로 보기 좋게 출력

```tsx
const decoded = jwt_decode(token);
const decodedStr = JSON.stringify(decoded, null, 2);
console.log("디코딩된 토큰:
", decodedStr);
```

### React 컴포넌트에서 출력

```tsx
<pre>{JSON.stringify(decoded, null, 2)}</pre>
```

---

## ❌ 잘못된 방법: toString 사용

```tsx
const str = decoded.toString(); // [object Object] ← 의미 없음
```

---

## ✅ 참고

- 디코딩된 JWT는 클라이언트에서 보안 검증용으로 사용하지 않고 **정보 표시** 용도로만 사용해야 합니다.
- 실제 검증은 서버에서 수행되어야 합니다.
