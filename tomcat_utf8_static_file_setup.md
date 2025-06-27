# Tomcat 정적 파일(예: .log) UTF-8 인코딩 설정 및 테스트 방법

## ✅ 목적

Tomcat이 서빙하는 정적 `.log` 파일이 브라우저 또는 클라이언트에서 한글이 깨지지 않도록 `Content-Type: text/plain; charset=UTF-8` 헤더를 응답에 포함시킨다.

---

## 📁 1. 설정 파일 위치

Tomcat 설치 경로의 `conf/web.xml`을 수정한다.

경로 예:
```
<TOMCAT_HOME>/conf/web.xml
```

---

## ✍️ 2. web.xml에 MIME 타입 설정 추가

```xml
<mime-mapping>
    <extension>log</extension>
    <mime-type>text/plain; charset=UTF-8</mime-type>
</mime-mapping>
```

> 🔄 이미 `log` 확장자가 있는 경우 위처럼 `charset=UTF-8`이 명시되어 있는지 확인하고, 없다면 수정한다.

---

## 🔄 3. Tomcat 재시작

설정 반영을 위해 Tomcat을 재시작한다.

Windows 명령어 예시:

```cmd
net stop Tomcat9
net start Tomcat9
```

또는 서비스 관리자에서 수동으로 재시작

---

## 🧪 4. 적용 여부 테스트

### ✅ 방법 A. curl로 응답 헤더 확인 (정확)

```bash
curl -I http://localhost:8080/winlogs/sample.log
```

출력 예시:
```
HTTP/1.1 200 OK
Content-Type: text/plain;charset=UTF-8
...
```

### ✅ 방법 B. 브라우저에서 확인

1. 브라우저에서 해당 URL 접속  
   예: `http://localhost:8080/winlogs/sample.log`

2. [F12] → Network 탭 → 해당 요청 클릭 → Response Headers 확인

   ```text
   Content-Type: text/plain;charset=UTF-8
   ```

---

## 🧹 5. 브라우저 캐시 무효화 (필요시)

브라우저가 이전 헤더를 캐시했을 수 있으므로 다음을 수행:

- `Ctrl + Shift + R` (강력 새로고침)
- 또는 파일명을 변경 (`test2.log`)해서 새로 요청

---

## ✅ 결과

Tomcat이 `.log` 파일에 대해 UTF-8 인코딩이 명시된 Content-Type 헤더를 응답하게 되어 한글이 깨지지 않음.

```
Content-Type: text/plain; charset=UTF-8
```
