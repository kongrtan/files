# 📌 PlantUML 설계 문서

본 문서는 **클라이언트-API-DB-GitHub** 간의 repo 상태 조회 구조를 설명하고,  
PlantUML 코드에 설명을 포함하여 설계 및 리뷰 시 참고할 수 있도록 작성되었습니다.

---

## 🌱 🔷 컴포넌트 다이어그램 with 설명

```plantuml
@startuml
' 시스템 컴포넌트 다이어그램
' 클라이언트, API 서버, DB 서버, GitHub 서버 구성

package "System" {
  [Client] --> [API Server] : 요청
  [API Server] --> [DB Server] : 암호화된 개인 토큰 조회
  [API Server] --> [GitHub Server] : /user, /repos API 호출
}

[DB Server] - [Encrypted Token Storage] : contains

note right of [Client]
  사용자의 repo 상태 조회 요청
end note

note right of [API Server]
  클라이언트 요청 처리
  DB에서 개인 토큰 조회 후 GitHub 호출
end note

note right of [DB Server]
  개인 토큰을 암호화 상태로 저장
end note

note right of [GitHub Server]
  /user로 유효성 확인
  /repos로 상태 조회
end note
@enduml
```

---

## 🌱 🔷 시퀀스 다이어그램 with 설명

```plantuml
@startuml
' 시퀀스 다이어그램
' 클라이언트가 API 서버에 repo 상태 조회 요청 시 처리 흐름

actor Client
participant "API Server" as API
participant "DB Server" as DB
participant "GitHub Server" as GH

Client -> API : Request repo status
note right of API : 클라이언트 요청 수신

API -> DB : Query user encrypted token
note right of DB : 사용자 토큰 조회 (암호화된 상태)
DB --> API : Return encrypted token
note right of API : DB에서 토큰 수신 후 복호화
API -> API : Decrypt token

API -> GH : GET /user (using decrypted token)
note right of GH : 개인 토큰으로 사용자 정보 조회
GH --> API : Response

alt GET /user successful
    note over API,GH : 사용자 토큰 유효
    API -> GH : GET /repos (using user token)
    note right of GH : 개인 토큰으로 repo 상태 조회
    GH --> API : Repo statuses
else GET /user failed
    note over API,GH : 사용자 토큰 무효 → 공용 토큰 사용
    API -> GH : GET /repos (using public token)
    note right of GH : 공용 토큰으로 repo 상태 조회
    GH --> API : Repo statuses
end

API --> Client : Return repo statuses
note right of Client : repo 상태 수신
@enduml
```

---

## 📝 🔷 요약

- **컴포넌트 다이어그램** : 시스템 구성 및 의존 관계 표현  
- **시퀀스 다이어그램** : 클라이언트 → API → DB → GitHub 전체 플로우 설명  
- **주석(`'`)** : 코드 내 설명용  
- **note** : 다이어그램 렌더링 시 표시

---

### ✅ 추가 요청 가능

- OAuth 인증 흐름
- 토큰 암복호화 처리 상세
- DB 암호화 키 관리 구조
- API 시나리오별 Activity Diagram

필요 시 말씀해 주세요.