
# Selenium 기반 테스트 자동화 협업 가이드

## 🧭 1. 목적
- 본 가이드는 **Selenium 자동화 테스트를 테스터 업무 프로세스에 통합**하고,
- **프론트엔드 개발자와 QA 간의 효율적인 협업**을 가능하게 하며,
- 자동화 테스트의 **신뢰도, 유지보수성, 생산성**을 향상시키기 위함입니다.

## 👥 2. 참여자 및 역할 정의

| 역할 | 담당자 | 책임 |
|------|--------|------|
| **QA (테스터)** | 자동화 테스트 작성자 | 테스트 시나리오 설계, 테스트 케이스 문서화 및 구현, 오류 리포팅 및 테스트 유지보수 |
| **FE 개발자** | 프론트 개발자 | data-testid 등 테스트 식별자 제공, UI 변경 시 QA에 영향 공유, 테스트 커버리지 확인 시 협업 |
| **Tech Lead (선택)** | QA 및 FE 리딩 | 자동화 테스트 범위 결정, 도구 도입, 표준 검토, 테스트 환경 표준화 |

## 🏷️ 3. FE 개발자 규칙 및 의무 사항

| 항목 | 내용 |
|------|------|
| `data-testid` 제공 | 모든 주요 상호작용 엘리먼트에 `data-testid` 명시 (`버튼`, `입력`, `모달`, `테이블`, `탭`, `알림`) |
| 네이밍 규칙 준수 | `[페이지명]-[기능]-[역할]` 형식 준수. 하이픈(-) 기반, 소문자만 사용 |
| 테스트 변경 알림 | 구조 변경, 기능 추가/삭제 시 QA에게 반드시 공유 (슬랙/이슈 등록 등) |
| 공통 컴포넌트 테스트 ID 포함 | 공통 컴포넌트에도 조건부로 식별자 포함 옵션 제공 |
| 문서 유지 | `/docs/test-ids/[기능명].md` 에 테스트 식별자 문서화 필요 |

## 🧪 4. QA 규칙 및 의무 사항

| 항목 | 내용 |
|------|------|
| 테스트 ID 기준 테스트 작성 | 가능한 한 `data-testid` 기준으로 엘리먼트 탐색. XPath/CSS Selector 최소화 |
| 테스트 시나리오 문서화 | `/test-scenarios/[페이지].md` 형식으로 명세서 작성 |
| 자동화 테스트 Git 관리 | `tests/selenium` 폴더에서 코드 관리. 주요 시나리오 분리 작성 |
| CI 연동 | Github Actions 또는 Jenkins 등을 통해 테스트 자동 실행 가능하게 구성 |
| 실패 로그 기록 | 테스트 실패 시 원인 로그 기록 및 공유 |
| 테스트 변경 시 알림 | 신규 케이스 추가 시 FE 공유 (슬랙, PR 리뷰 등으로) |

## 📚 5. 공통 네이밍 규칙 (data-testid)

- 형식: `[페이지명]-[컴포넌트]-[역할]`
- 예시:
  - `login-email-input`
  - `user-table-row`
  - `modal-close-button`
- 문서화 위치: `/docs/test-ids/[기능명].md`

## 🔁 6. 협업 프로세스 예시

1. ✅ FE 기능 개발 시작 전
   - QA와 협의하여 테스트 포인트 정의
   - `data-testid` 설계 공유
2. 🚧 개발 중
   - FE는 테스트 ID 삽입
   - QA는 테스트 시나리오 초안 작성
3. 🚀 기능 배포 전
   - QA는 자동화 스크립트 작성
   - 사전 테스트 자동 실행
4. 🛠 유지보수
   - 기능 변경 시 QA에 변경 통보
   - 테스트 코드와 문서 업데이트

## 🔧 7. 폴더 및 문서 구조 예시

```
/docs
  └─ test-ids/
       └─ login.md
       └─ user-management.md

/tests
  └─ selenium/
       ├─ login_test.py
       ├─ user_test.py
       └─ utils/
           └─ base_driver.py

/test-scenarios/
  └─ login.md
  └─ product.md
```

## 🛠 8. 도구 및 기술 스택

- 테스트 프레임워크: `Selenium + Python`
- 실행 환경: `pytest`, `ChromeDriver`, `CI/CD`
- 선택 도구: `Selenium IDE`, `Allure Report`, `BrowserStack`

## 🗂 9. 참고 문서

- Selenium 공식 문서: https://www.selenium.dev/
- 테스트 ID 가이드: `/docs/test-ids/README.md`
- 테스트 시나리오 양식: `/test-scenarios/template.md`
