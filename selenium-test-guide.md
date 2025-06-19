
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




# 🔁 testIds.ts 네이밍 재사용 가이드 (C# + Selenium)

## 🎯 목적

- 프론트엔드에서 정의한 `testIds.ts`의 테스트 식별자를 C# 기반 Selenium 테스트에서 재사용하여 **테스트 유지보수성**과 **일관성** 확보

---

## ✅ 재사용 방법 요약

1. **testIds.ts를 JSON으로 변환** (빌드 또는 배포 시 자동화 가능)
2. C#에서 이 JSON 파일을 파싱하여 상수로 사용
3. Selenium에서 `By.CssSelector` 또는 `By.XPath`로 선택

---

## 🧪 예시 1: JSON 변환 후 C#에서 로딩

### testIds.json (FE에서 자동 추출 예시)

```json
{
  "button": {
    "submit": "button-submit"
  },
  "form": {
    "emailInput": "form-email-input"
  }
}
```

### C# 클래스 예시

```csharp
public static class TestIds
{
    public static class Button
    {
        public const string Submit = "button-submit";
    }

    public static class Form
    {
        public const string EmailInput = "form-email-input";
    }
}
```

### Selenium 테스트 코드

```csharp
driver.FindElement(By.CssSelector($"[data-testid='{TestIds.Button.Submit}']")).Click();
driver.FindElement(By.CssSelector($"[data-testid='{TestIds.Form.EmailInput}']")).SendKeys("user@example.com");
```

---

## 🔄 자동 변환 팁

- `testIds.ts` → `testIds.json` 변환은 Node.js 스크립트로 자동화
- 변환 후 C# 템플릿 코드 생성은 T4 템플릿 또는 CodeGen 도구 활용 가능

---

## 📎 보너스: XPath 대신 CSS Selector 사용 권장

- XPath 예:
  ```csharp
  By.XPath("//*[@data-testid='button-submit']")
  ```
- CSS Selector 예 (더 빠름, 간결):
  ```csharp
  By.CssSelector("[data-testid='button-submit']")
  ```

---

## ✅ 정리

| 항목 | 권장 방식 |
|------|-----------|
| FE → BE 공유 방법 | testIds.ts → testIds.json → C# Constants |
| 테스트 셀렉터 방식 | data-testid 기반 CSS Selector |
| 관리 방식 | 공통 저장소에 JSON 정의 후 FE/QA 양측 활용 |



# 📌 테스트 자동화 도입 시 문서 책임 및 작성자 정의 가이드

테스트 자동화의 전체 흐름에서 종종 누락되기 쉬운 **요구사항 정의, 화면 설계, 테스트 케이스 작성**에 대한 책임자와 작성자 정의를 아래와 같이 정리합니다.

---

## 🧭 전체 문서 흐름 요약

| 단계 | 산출물 | 책임자 | 작성자 | 협업 대상 |
|------|--------|--------|--------|------------|
| 1. 기획 | 기능 정의서, 요구사항 명세 | 기획자 (또는 PO/PM) | 기획자 / PO | FE, QA |
| 2. 화면 설계 | 와이어프레임, Figma 디자인 | 디자이너 | 디자이너 | FE, QA, 기획 |
| 3. 테스트 ID 명세 | `data-testid` 목록 | FE + QA 공동 | FE 주도 작성 | QA |
| 4. 테스트 케이스 설계 | 테스트 시나리오, 엑셀 케이스 | QA | QA | FE, 기획 |
| 5. 테스트 스크립트 구현 | Selenium 코드 | QA 자동화 담당자 | QA (또는 테스트 엔지니어) | FE |
| 6. 테스트 결과 리포트 | Allure 리포트, 로그 | QA | QA | 전체 팀 |

---

## 🧩 각 문서별 설명

### 📄 기능 정의서
- **작성자**: 기획자/PO
- **내용**: 기능 목적, 요구조건, 예외 처리 기준
- **참고**: 테스트 기준이 되므로 명확해야 함

### 🎨 화면 설계 (Figma)
- **작성자**: 디자이너
- **내용**: UI 구성, 상태, 인터랙션 설계
- **추가**: `data-testid` 주석 가능 (Annotations 플러그인 등 활용)

### 🏷️ testIds.ts (또는 JSON 목록)
- **작성자**: 프론트엔드 개발자
- **내용**: 테스트 식별자 상수화 및 일관된 네이밍 제공
- **활용**: QA는 이를 기반으로 스크립트 작성

### 🧪 테스트 케이스
- **작성자**: QA
- **형태**: 엑셀 또는 테스트 관리 시스템 (TCMS)
- **포함**: 시나리오, 예상 결과, 테스트 조건, 우선순위

### 🤖 자동화 테스트 코드
- **작성자**: QA
- **도구**: Selenium / Playwright / Cypress 등

---

## ✅ 전체 협업 흐름 예시

```text
[기획자]
  ↓ 기능 정의서
[디자이너]
  ↓ Figma 설계 및 컴포넌트 구조
[FE + QA]
  ↓ testId 정의 및 적용
[QA]
  ↓ 테스트 케이스 설계 및 자동화
```

---

## 🔚 결론

> 테스트 자동화가 성공적으로 작동하기 위해서는 기획, 디자인, 개발, QA 모두의 **문서화 협업**이 필수적입니다.  
> 특히 **요구사항 정의 → 화면 설계 → 테스트 ID 문서화 → 테스트 케이스 작성**까지의 연계는 매우 중요합니다.



# 📘 TypeDoc & React Testing Library 설명 가이드

---

## 📌 1. TypeDoc 소개

### 📖 개요

- **TypeDoc**는 TypeScript로 작성된 코드에서 **자동으로 문서를 생성**해주는 도구입니다.
- JSDoc 스타일 주석과 타입 정보를 기반으로 HTML 또는 Markdown 문서를 생성합니다.

### 🔧 주요 특징

- TypeScript 타입 정보를 그대로 활용
- 클래스, 함수, 인터페이스, enum, 타입 별칭 등을 자동 문서화
- HTML, JSON, Markdown 등 다양한 포맷 출력 지원
- 커스텀 테마 또는 플러그인 지원

### 🛠️ 설치 방법

```bash
npm install typedoc --save-dev
```

### 🚀 사용 예시

```bash
npx typedoc src/ --out docs/
```

### 🧩 활용 예시

- `testIds.ts` 파일에 주석을 작성하면 테스트 식별자 목록 문서 자동 생성 가능
- 팀의 공통 상수/유틸리티 함수/타입 문서화를 위한 정적 사이트 구성 가능

---

## 🔎 2. React Testing Library (https://github.com/testing-library/react-testing-library)

### 📖 개요

- **React Testing Library(RTL)**는 **React 컴포넌트의 실제 동작을 중심으로 테스트**할 수 있도록 설계된 테스트 프레임워크입니다.
- 사용자 관점에서의 상호작용에 집중 → DOM 구조보다는 "무엇을 보여주고, 어떻게 반응하는가"에 초점

### 🔧 주요 특징

- DOM 요소를 `data-testid`, 텍스트, 라벨 등으로 탐색
- 사용자 이벤트 시뮬레이션 (버튼 클릭, 입력 등)
- Jest와 통합되어 사용 (테스트 러너로)

### 📦 설치 방법

```bash
npm install --save-dev @testing-library/react
```

### ✅ 기본 테스트 예시

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import LoginForm from './LoginForm';

test('로그인 버튼을 누르면 이벤트가 호출된다', () => {
  render(<LoginForm />);
  const button = screen.getByTestId('button-login-submit');
  fireEvent.click(button);
  expect(someLoginFunction).toHaveBeenCalled();
});
```

### 🔍 탐색 API

| 함수 | 설명 |
|------|------|
| `getByTestId()` | `data-testid` 속성으로 탐색 |
| `getByText()` | 버튼/라벨 텍스트로 탐색 |
| `getByRole()` | 접근성 역할 기반 탐색 (추천) |

---

## 🧠 정리

| 도구 | 목적 | 비고 |
|------|------|------|
| **TypeDoc** | TypeScript 코드 → 자동 문서 생성 | 테스트 ID, 상수 문서화 |
| **React Testing Library** | React UI 테스트 | 사용자 중심 테스트, 자동화 친화적 |



# 📊 자동화 테스트에서 가장 많이 사용하는 Selector 방식 정리

---

## ✅ 실무에서 가장 많이 사용하는 방식 순위

| 순위 | 방식 | 설명 | 사용 비율 (경험 기반) | 특징 |
|------|------|------|----------------------|------|
| 🥇 1위 | `data-testid`, `data-e2e-id` | FE가 명시적으로 넣어주는 테스트 식별자 | ✅ **80% 이상** (테스트 자동화 도입 조직) | 유지보수성 최강 |
| 🥈 2위 | `getByRole`, `getByLabelText` | 접근성 속성 (aria-role, label) 기반 탐색 | ✅ 점점 증가 중 | UI 변경에 강함 |
| 🥉 3위 | CSS Selector (직접 추출) | `#login > div > button` 등 개발자 도구에서 추출 | ✅ 예전 방식 / 간단 테스트에 여전히 사용 | 구조 변경에 약함 |
| 4위 | XPath | 복잡한 요소 접근에 사용됨 | ❗ 유지보수 부담 커서 점점 감소 | 정교하지만 취약 |
| 보조 | SelectorGadget, SelectorsHub | 위 방식들 보조 추출 도구 | 일부 QA/개발팀 사용 | 자동화 편의성 높임 |

---

## 🎯 가장 많이 쓰는 방식은?

> **“프론트에서 `data-testid`를 넣어주고, QA는 `By.CssSelector("[data-testid='xxx']")`로 접근”**  
> → **현재 가장 안정적이고 유지보수하기 쉬운 방식입니다.**

---

## 🔍 이유는?

| 조건 | 설명 |
|------|------|
| ✅ UI 변경에 강함 | 클래스명/DOM 구조가 바뀌어도 testId는 고정됨 |
| ✅ 코드/테스트 간 명시적 연결 | FE와 QA가 같은 식별자를 공유 |
| ✅ 협업 효율성 ↑ | 문서화와 자동화 시나리오 대응이 쉬움 |
| ✅ Storybook/Excel 연동 | testId 기반 문서화가 가능 |

---

## 🔄 추출 도구 사용은 언제?

- **SelectorGadget** 등은 testId가 없는 기존 서비스에 **빠르게 자동화 입히기 위해 임시로 사용**
- 장기적으로는 **FE에 testId 삽입 요청 + 규칙 관리**가 필수

---

## 🔚 결론

| 상황 | 추천 방법 |
|------|------------|
| 테스트 자동화 체계 도입 | **data-testid 기반 CSS Selector** (가장 추천) |
| FE 수정 어려운 상태 | SelectorGadget, SelectorsHub로 임시 Selector 추출 |
| 접근성 대응 UI | `getByRole`, `getByLabelText` |
| 복잡한 구조 탐색 | XPath (보조적 용도) |





# 🧩 SelectorGadget & SelectorsHub 설치 및 사용 가이드

---

## ✅ 1. SelectorGadget (크롬 확장 프로그램)

### 📍 목적

- 클릭만으로 가장 **간단한 CSS Selector**를 추출해주는 크롬 확장 프로그램  
- `data-testid`가 없는 레거시 페이지에서 유용

### 🔗 설치

- [Chrome Web Store - SelectorGadget](https://chrome.google.com/webstore/detail/selectorgadget/idhccdnokmppcfjgcgjhkepdcbjdgcjo)

### 🛠️ 설치 방법

1. 위 링크 접속
2. **Chrome에 추가 → 확장 프로그램 설치**

### 🚀 사용 방법

1. 웹사이트 접속
2. 크롬 상단의 SelectorGadget 아이콘 클릭
3. 마우스를 가져다 대면 요소가 강조됨
4. 클릭하면 **CSS Selector가 자동 추출됨**
5. 하단 Selector 표시창에서 복사

### 🎯 사용 예

```csharp
driver.FindElement(By.CssSelector(".btn.primary")).Click();
```

---

## ✅ 2. SelectorsHub (크롬/엣지 확장 프로그램)

### 📍 목적

- **고급 XPath & CSS Selector** 생성기
- iframe, shadow DOM, SVG 등 복잡한 구조 지원
- 접근성 속성 검사 기능 포함

### 🔗 설치

- [SelectorsHub 공식 사이트](https://selectorshub.com/)
- [Chrome Web Store - SelectorsHub](https://chrome.google.com/webstore/detail/selectorshub/xpath-chrome-plugin)

### 🛠️ 설치 방법

1. 위 사이트에서 `Install for Chrome` 클릭
2. Chrome 웹 스토어에서 설치 진행

### 🚀 사용 방법

1. 웹사이트 열기 → F12(개발자 도구) 실행
2. `SelectorsHub` 탭 클릭
3. 요소 클릭 → 자동 Selector 생성
4. XPath 또는 CSS 복사하여 사용

### 🎯 사용 예

```xpath
//button[text()='Login']
```

```css
button.login-button
```

---

## 📊 SelectorGadget vs SelectorsHub

| 항목 | SelectorGadget | SelectorsHub |
|------|----------------|---------------|
| 설치 위치 | 브라우저 확장 | 브라우저 확장 (DevTools 탭 포함) |
| 지원 형식 | CSS Selector | XPath + CSS Selector |
| 구조 지원 | 단순 구조 | iframe, shadow DOM 포함 |
| 사용 난이도 | 매우 쉬움 | 중급 이상 |
| 추천 사용 | 빠른 추출 | 고급 요소 대응 필요시 |

---

## ✅ 결론

| 상황 | 추천 도구 |
|------|-----------|
| 간단한 선택자 빠르게 추출 | SelectorGadget |
| 정확한 XPath/CSS + 복잡한 구조 | SelectorsHub |
| QA 테스트 자동화용 | 둘 다 사용 가능 (보완적 활용) |



# 🎭 Playwright Codegen 사용 가이드 및 C# 코드 샘플

---

## 📌 개요

**Playwright Codegen**은 Microsoft가 만든 Playwright 프레임워크의 기능으로,  
브라우저에서 사용자의 클릭/입력/이동 등을 **실시간으로 녹화하여 테스트 코드로 자동 변환**해주는 도구입니다.

---

## ✅ 주요 기능

- 브라우저를 열고 모든 동작을 **자동으로 코드화**
- 지원 언어: **JavaScript**, **Python**, **C#**, **Java**
- 다양한 브라우저: Chromium, Firefox, WebKit 지원
- 로그인 흐름, 입력, 선택, 클릭 등 사용자 인터랙션 추적

---

## 🛠️ 설치 방법

### 1. Node.js 설치 (필수)
- [https://nodejs.org/](https://nodejs.org/)

### 2. Playwright 설치

```bash
npm init playwright@latest
```

또는

```bash
npm i -D @playwright/test
npx playwright install
```

---

## 🚀 Codegen 실행 방법

```bash
npx playwright codegen https://example.com
```

옵션 예시:

```bash
npx playwright codegen --target=csharp https://example.com
```

- --target=csharp : C# 코드로 출력
- --browser=chromium|firefox|webkit 선택 가능

---

## 🧪 예제 시나리오 (로그인 페이지 자동화)

1. 사이트 진입
2. 이메일 입력
3. 비밀번호 입력
4. 로그인 버튼 클릭

---

## ✨ Codegen 자동 생성 결과 (C# 예제)

```csharp
using Microsoft.Playwright;
using System.Threading.Tasks;

class Program
{
    public static async Task Main()
    {
        using var playwright = await Playwright.CreateAsync();
        var browser = await playwright.Chromium.LaunchAsync(new BrowserTypeLaunchOptions { Headless = false });
        var page = await browser.NewPageAsync();

        await page.GotoAsync("https://example.com/login");

        await page.FillAsync("input[name='email']", "user@example.com");
        await page.FillAsync("input[name='password']", "mypassword123");
        await page.ClickAsync("button[type='submit']");

        // 결과 확인 또는 assert 추가 가능
    }
}
```

---

## 📎 자주 사용하는 Selector 방식

| 방식 | 설명 | 예시 |
|------|------|------|
| `text=` | 텍스트 기준 선택 | `text=로그인` |
| `css=` | CSS Selector | `css=input[name="email"]` |
| `xpath=` | XPath 사용 | `xpath=//button[text()='Login']` |

---

## 📘 공식 문서

- Playwright Codegen: https://playwright.dev/docs/codegen
- C# API: https://playwright.dev/dotnet/

---

## ✅ 정리

| 항목 | 내용 |
|------|------|
| 녹화 방식 | 브라우저에서 실시간 사용 행위 추적 |
| 출력 포맷 | JavaScript, Python, C#, Java |
| 장점 | 빠르고 정확한 자동화 테스트 생성 |
| 추천 대상 | Selenium보다 더 빠르고 유지보수 쉬운 도구 찾는 경우 |

