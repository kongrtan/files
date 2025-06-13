# 📘 Next.js를 SPA로만 동작시키기 (React Server Components 비활성화)

Next.js 13 이상에서 도입된 **React Server Component(RSC)** 기능은 `_rsc=...` 쿼리로 서버와 통신하는 내부 메커니즘을 사용합니다.  
하지만 **SPA(Single Page Application)** 용도로만 사용하고자 한다면, 해당 기능을 완전히 비활성화할 수 있습니다.

---

## ✅ 목표

- Next.js를 **SPA 전용**으로 구성
- `_rsc` 요청 등 **Server Component 관련 요청 비활성화**
- `.txt` 등 정적 파일 요청 시도 시 RSC 처리 방지

---

## 📁 1. `app/` 디렉토리 제거

Next.js에서 `app/` 디렉토리는 **React Server Component 기반 라우팅**에 사용됩니다.  
SPA 전용으로 운영하려면 해당 디렉토리를 **완전히 제거**해야 합니다.

```diff
- /app/page.tsx
+ /pages/index.tsx
```

> 👉 `pages/` 디렉토리 기반으로 라우팅을 구성하면 Next.js는 RSC 기능을 사용하지 않습니다.

---

## ⚙️ 2. `next.config.js` 설정

RSC 및 관련 실험 기능을 명시적으로 비활성화하려면, `next.config.js`에 다음 설정을 추가하세요:

```js
// next.config.js
module.exports = {
  reactStrictMode: true,
  experimental: {
    serverActions: false,
    serverComponentsExternalPackages: [],
  },
};
```

> ⚠️ 일부 옵션은 생략 가능하지만, 명시적으로 false로 설정하는 것이 좋습니다.

---

## 🗂️ 3. 정적 파일은 `/public` 폴더에 저장

`.txt`, `.csv`, `.json` 등 정적 리소스 파일은 반드시 `/public` 디렉토리에 위치시켜야 합니다.

```bash
/public/test001.txt
```

### 접근 방법:

```url
http://localhost:3000/test001.txt
```

> Next.js는 `/public` 아래 파일에 대해 라우팅을 시도하지 않으므로, `_rsc` 쿼리가 자동으로 붙지 않습니다.

---

## 🚫 주의사항

| 항목 | 설명 |
|------|------|
| ❌ `app/` 디렉토리 사용 금지 | 자동 RSC 요청 발생 (`?_rsc=...`) |
| ❌ `.txt` 파일을 라우트로 처리하지 말 것 | Next.js가 API나 서버컴포넌트로 처리할 수 있음 |
| ❌ SSR이나 Streaming 사용 금지 | `_rsc` 프리로드 요청 발생 가능성 있음 |

---

## ✅ 요약

| 구성 요소 | 설정 |
|-----------|------|
| 라우팅 방식 | `pages/` 디렉토리 기반 |
| 정적 파일 제공 | `/public` 폴더 사용 |
| RSC 비활성화 | `next.config.js`에서 `experimental` 옵션 설정 |
| SPA 전용 설정 | ✅ 서버 컴포넌트, 서버 액션 사용 안함 |

---

## 🛠️ 참고: `.txt` 다운로드 처리 예시

```html
<a href="/test001.txt" download>Download File</a>
```

- `download` 속성을 사용하면 브라우저가 열지 않고 자동 다운로드 처리
