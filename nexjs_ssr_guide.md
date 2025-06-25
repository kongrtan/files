
# Next.js SSR + .NET Core API 연동 및 배포 전략

## ✅ 기본 구조

```
사용자
  ↓
[Nginx 또는 CDN]
  ↓
[Next.js (SSR)]
  ↓
[.NET Core Web API]
  ↓
[DB / 기타 서비스]
```

- Next.js는 SSR(서버 사이드 렌더링) 모드로 동작
- .NET Core는 API 서버 역할

---

## ✅ SSR의 장점 (프론트엔드만 Next.js 사용 시)

### 1. SEO 향상
- 초기 HTML에 콘텐츠 포함 → 검색 엔진 인덱싱 가능
- React CSR보다 미리 콘텐츠가 노출됨

### 2. 초기 로딩 속도 개선
- HTML 완성본을 브라우저에 직접 전송
- JS 실행 이전에도 콘텐츠가 보여짐

### 3. 사용자 맞춤 콘텐츠 제공
- SSR에서는 쿠키/세션을 서버에서 읽고, 사용자 맞춤 데이터 렌더링 가능

### 4. SNS 공유 최적화
- SSR로 메타태그 렌더링 가능 → OpenGraph / Twitter Card 대응

---

## ✅ SSR 코드 예시 (Next.js → .NET Core API 호출)

```tsx
export async function getServerSideProps(context) {
  const res = await fetch("https://api.mybackend.com/news")
  const data = await res.json()
  return { props: { data } }
}
```

```tsx
export default function NewsPage({ data }) {
  return (
    <ul>
      {data.map(item => <li key={item.id}>{item.title}</li>)}
    </ul>
  )
}
```

---

## ✅ 사용자별 SSR 예시 (with 쿠키)

```tsx
export async function getServerSideProps(context) {
  const token = context.req.cookies['auth_token']
  const res = await fetch("https://api.mybackend.com/profile", {
    headers: { Authorization: `Bearer ${token}` }
  })
  const profile = await res.json()

  return { props: { profile } }
}
```

---

## ✅ SSR + 캐싱 전략

### A. ISR (Incremental Static Regeneration)

```tsx
export async function getStaticProps() {
  const res = await fetch("https://api.mybackend.com/articles")
  const data = await res.json()
  return {
    props: { data },
    revalidate: 60 // 60초마다 캐시 재생성
  }
}
```

### B. Nginx 캐싱 설정 예시

```nginx
location /news {
  proxy_pass http://nextjs:3000;
  add_header Cache-Control "public, max-age=60";
}
```

---

## ✅ Docker 기반 배포 구조

```yaml
# docker-compose.yml
version: '3.8'
services:
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production

  backend:
    build: ./backend
    ports:
      - "5000:80"

  nginx:
    image: nginx:latest
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
    depends_on:
      - frontend
      - backend
```

### nginx.conf 예시

```nginx
server {
  listen 80;

  location / {
    proxy_pass http://frontend:3000;
  }

  location /api/ {
    proxy_pass http://backend:80;
  }
}
```

---

## ✅ 요약

| 항목 | SSR 도입 시 이점 |
|------|------------------|
| SEO | ✅ HTML 사전 렌더링 |
| 속도 | ✅ 초기 TTFB 개선 |
| 개인화 | ✅ 사용자별 페이지 처리 |
| API 연동 | ✅ 서버에서 API 호출 처리 가능 |
| SNS 공유 | ✅ 메타 태그 서버에서 렌더링 |

---

## ✅ 추가 옵션 (필요 시)

- `.NET Core API`와 JWT 기반 인증 연동
- `getServerSideProps`에서 요청 IP, UA 기반 렌더링
- Cloudflare 또는 Nginx를 통한 SSR 캐싱 최적화
