
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




# Selenium 기반 테스트 자동화 협업 가이드

## 🧭 목적

- Selenium 자동화 테스트를 테스터 업무 프로세스에 통합
- 프론트엔드 개발자와 QA 간의 효율적인 협업 체계 수립
- 테스트의 신뢰성, 유지보수성 향상

---

## 👥 참여자 역할 정의

| 역할 | 책임 |
|------|------|
| **QA (테스터)** | 테스트 시나리오 작성, 자동화 구현, 테스트 유지보수 |
| **FE 개발자** | `data-testid` 제공, UI 변경 공유, 테스트 지원 |
| **Tech Lead** | 테스트 전략 수립, 도구 선택, 표준 정의 (선택적) |

---

## 🏷️ FE 개발자 규칙 및 의무사항

- 모든 주요 엘리먼트에 `data-testid` 속성 부여
- `[페이지명]-[컴포넌트명]-[역할]` 형식의 명확한 네이밍
- 공통 `testIds.ts`에 상수로 정의 및 관리
- 변경사항 발생 시 QA에 사전 공유
- 문서화는 `/docs/test-ids/[기능명].md` 형태로 관리

---

## 🧪 QA 규칙 및 의무사항

- `data-testid` 기준 자동화 테스트 작성
- 테스트 시나리오를 `/test-scenarios/[페이지].md`로 문서화
- 실패 원인 로깅 및 공유
- CI/CD 연동하여 자동 테스트 실행

---

## 🧱 테스트 ID 네이밍 예시 (`testIds.ts`)

```ts
export const TEST_IDS = {
  layout: {
    header: 'layout-header',
    footer: 'layout-footer',
  },
  button: {
    save: 'button-save',
    cancel: 'button-cancel',
    submit: 'button-submit',
  },
  form: {
    emailInput: 'form-email-input',
    passwordInput: 'form-password-input',
  },
  modal: {
    login: 'modal-login',
    confirm: 'modal-confirm',
  },
  table: {
    row: (id: string) => `table-row-${id}`,
    cell: (row: string, col: string) => `table-cell-${row}-${col}`,
  },
};
```

---

## 🔍 ESLint 커스텀 룰 예시 (`require-testid.js`)

```js
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Require data-testid attribute for interactive elements',
    },
    messages: {
      missingTestId: 'Interactive element missing data-testid.',
    },
  },
  create(context) {
    return {
      JSXOpeningElement(node) {
        const interactiveTags = ['button', 'input', 'a', 'select', 'textarea'];
        if (!interactiveTags.includes(node.name.name)) return;

        const hasTestId = node.attributes.some(attr =>
          attr.name && attr.name.name === 'data-testid'
        );

        if (!hasTestId) {
          context.report({
            node,
            messageId: 'missingTestId',
          });
        }
      },
    };
  },
};
```

---

## 🧩 Storybook 연계

Storybook 스토리 파일에서 다음과 같이 testId 명시:

```tsx
Primary.parameters = {
  docs: {
    description: {
      story: 'testId: `button-submit`',
    },
  },
};
```

---

## 📊 Excel 템플릿 샘플

| 페이지 | 컴포넌트명 | 설명 | testId | 스토리북 링크 | 실제 적용 여부 |
|--------|------------|------|--------|----------------|----------------|
| Login  | EmailInput | 이메일 입력창 | `form-email-input` | `https://storybook.com/ui-email` | ✅ |
| Login  | PasswordInput | 비밀번호 입력창 | `form-password-input` | `https://storybook.com/ui-password` | ✅ |
| Login  | SubmitButton | 로그인 버튼 | `button-login-submit` | `https://storybook.com/ui-login-button` | ✅ |
| Header | Logo        | 로고 영역     | `layout-header-logo` | `https://storybook.com/ui-logo` | ⛔ |

> 📎 Excel 파일은 별도 제공됨



# 🧩 Figma와 테스트 자동화 연동 가이드

## 🎯 목적

- Figma에서 UI 설계 시 `data-testid`를 사전에 정의하여, 프론트엔드 개발과 테스트 자동화에 일관된 기준을 제공
- 테스트 식별자 누락 방지, 중복 방지, 문서화 자동화 가능
- Storybook/Excel과 함께 연동하여 품질/테스트 생산성 향상

---

## 🔌 추천 Figma 플러그인

### 1. 🔖 [Figma Tokens (by Jan Six)](https://www.figma.com/community/plugin/843461159747178978/Figma-Tokens)

- 디자인 시스템 토큰(Figma 변수) 정의/적용/내보내기 가능
- `data-testid` 같은 커스텀 속성을 토큰 형태로 관리 가능
- JSON 내보내기 → FE/QA 시스템과 연동

**활용 예:**
- Figma 요소에 `{ data-testid: 'button-submit' }` 같은 JSON 구조를 부여
- 팀에서 이 데이터를 기준으로 testIds.ts 자동 생성 가능

---

### 2. 🧼 [Design Lint](https://www.figma.com/community/plugin/801560610260462048/Design-Lint)

- 누락된 스타일, 일관되지 않은 속성 탐지
- `data-testid` 주석 또는 메타데이터 누락 여부 확인을 위한 보조 수단으로 사용

**활용 예:**
- 버튼 컴포넌트에서 testId가 정의되지 않은 컴포넌트를 감지

---

### 3. 🗂 [Annotations](https://www.figma.com/community/plugin/747985167520091199/Annotations)

- 컴포넌트에 주석 형식으로 설명 추가
- `testId: button-login-submit` 등 명확히 표시

**활용 예:**
- QA가 Figma 내 주석에서 테스트 ID를 직접 수집 가능

---

## 🧰 기타 활용 팁

| 기능 | 설명 |
|------|------|
| 🔍 검색 | `testId:` 또는 `data-testid:` 문자열 기준으로 전역 검색 |
| 🧾 Export | Tokens 플러그인으로 `testId 목록`을 JSON으로 추출하여 FE 코드와 연동 |
| 📊 QA 연계 | Excel 템플릿과 연결하여 Figma 기준의 컴포넌트 정합성 검토 가능 |

---

## 📎 연계 예시 흐름

```text
Figma (Tokens/Annotation)
   ⬇
testId 정의 (JSON / 주석)
   ⬇
FE 개발자가 testIds.ts 생성
   ⬇
Storybook + Selenium 테스트 + Excel 문서 동시 활용
```

---

## ✅ 요약

| 플러그인 | 목적 | 링크 |
|----------|------|------|
| Figma Tokens | testId, 변수 등 속성 관리 | [링크](https://www.figma.com/community/plugin/843461159747178978/Figma-Tokens) |
| Design Lint | 누락 검사/일관성 확인 | [링크](https://www.figma.com/community/plugin/801560610260462048/Design-Lint) |
| Annotations | 요소에 설명/주석 추가 | [링크](https://www.figma.com/community/plugin/747985167520091199/Annotations) |


