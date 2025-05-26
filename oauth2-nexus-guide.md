
# OAuth2 Proxy + Nexus 연동 가이드

## 개요

이 문서는 OAuth2 Proxy를 사용하여 OIDC 인증을 처리하고, 인증된 사용자 정보를 Nexus Repository Manager에 전달하여 인증 연동하는 방법을 설명합니다.

---

## 구성 요소

- **OAuth2 Proxy (Binary 설치 + Dockerfile 기반 실행)**
- **OIDC Provider**: 예) Keycloak, Google, GitHub
- **Nexus OSS**: HTTP Header 인증 사용

---

## 1. Nexus 설정

1. Nexus 접속 → **Security > Realms**
2. **HTTP Header Authentication Realm** 을 활성화
3. **순서**는 다음과 같이 배치:
   - `HTTP Header Authentication Realm`
   - `Local Authentication Realm`
NEXUS_SECURITY_REALMS=HttpHeader,LDAP,LocalAuthorizingRealm
---

## 2. OAuth2 Proxy 설정 파일 (`oauth2_proxy.cfg`)

```ini
provider = "oidc"
client_id = "<클라이언트 ID>"
client_secret = "<클라이언트 Secret>"
redirect_url = "http://<your-domain>/oauth2/callback"
oidc_issuer_url = "https://<issuer-url>/realms/<realm-name>"

http_address = "0.0.0.0:4180"
#cookie_secret = "<랜덤 32바이트 base64 값>"
cookie_secret = "SIQHoEqrWfJ/wHJ54F67l6gh9W+MjNYG6Xk4Ggqlubs="


email_domains = ["*"]
upstreams = ["http://nexus:8081/"]

# 헤더를 통해 사용자 정보 전달
pass_authorization_header = true
pass_user_headers = true
set_authorization_header = true
set_xauthrequest = true

# 로그인 후 전달할 헤더
user_id_claim = "preferred_username"
```

> `preferred_username`은 Keycloak 기준, GitHub은 `login`, Google은 `email` 등 OIDC 공급자에 따라 다를 수 있음

---

## 3. Dockerfile 예시

```Dockerfile
FROM alpine:latest

# 바이너리 복사 (다운로드 받은 oauth2-proxy-linux-amd64 파일)
COPY oauth2-proxy /usr/local/bin/oauth2-proxy
COPY oauth2_proxy.cfg /etc/oauth2_proxy.cfg

EXPOSE 4180

ENTRYPOINT ["oauth2-proxy", "--config", "/etc/oauth2_proxy.cfg"]
```

---

## 4. NGINX 리버스 프록시 설정 (예시)

```nginx
server {
    listen 80;

    location /oauth2/ {
        proxy_pass http://oauth2-proxy:4180;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Scheme $scheme;
    }

    location / {
        auth_request /oauth2/auth;
        error_page 401 = /oauth2/sign_in;

        auth_request_set $user $upstream_http_x_auth_request_user;
        proxy_set_header Remote-User $user;

        proxy_pass http://nexus:8081;
        proxy_set_header Host $host;
    }
}
```

---

## 5. docker-compose 예시 (옵션)

```yaml
version: '3'

services:
  nexus:
    image: sonatype/nexus3
    ports:
      - "8081:8081"

  oauth2-proxy:
    build: .
    ports:
      - "4180:4180"
    environment:
      OAUTH2_PROXY_CLIENT_ID: your-client-id
      OAUTH2_PROXY_CLIENT_SECRET: your-secret
    depends_on:
      - nexus

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/conf.d/default.conf
    depends_on:
      - oauth2-proxy
      - nexus
```

---

## 6. 테스트

1. `http://<your-domain>/` 접속
2. 자동으로 OIDC 로그인 화면으로 리디렉션
3. 로그인 후 Nexus로 리디렉션되고, HTTP Header를 통해 인증됨

---

## 참고

- OAuth2 Proxy 공식 문서: https://oauth2-proxy.github.io/oauth2-proxy/
- 지원 Provider 목록: Google, GitHub, Keycloak 등
- Nexus 공식 문서: https://help.sonatype.com/repomanager3

---

## ✅ 체크리스트

| 항목 | 설명 |
|------|------|
| `cookie_secret` | 반드시 32바이트 base64 (예: `openssl rand -base64 32`) |
| `redirect_url` | OIDC Provider에 등록된 콜백 URL과 일치해야 함 |
| `oidc_issuer_url` | Keycloak이면: `https://<host>/realms/<realm>` |
| `Remote-User` 헤더 | Nexus에서 인식하도록 설정 필수 |
| 인증 실패 시 | 로그에서 `invalid_token`, `redirect_uri mismatch` 등 확인 필요 |
