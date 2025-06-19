
# Selenium 테스트 자동화를 위한 기본 가이드

## 📌 셀레니움은 코딩이 필요한가요?
네, Selenium은 브라우저를 자동으로 제어하는 도구이기 때문에 **프로그래밍이 필요합니다.** 주로 사용하는 언어는 다음과 같습니다:

- **Python** (가장 많이 사용됨)
- Java
- C#
- JavaScript (WebDriverIO 등과 함께)

## ✅ 기본 코드 예시 (Python 기준)

```python
from selenium import webdriver
from selenium.webdriver.common.by import By

driver = webdriver.Chrome()
driver.get("https://example.com")

# 요소 찾기 및 클릭
login_button = driver.find_element(By.ID, "button-login-submit")
login_button.click()

# 입력창에 텍스트 입력
email_input = driver.find_element(By.ID, "form-email-input")
email_input.send_keys("tester@example.com")
```

## 💡 왜 코딩이 필요한가요?
Selenium은 사용자의 동작을 코드로 재현해야 합니다:
- 페이지 로드 기다리기
- 특정 요소가 나올 때까지 대기
- 조건 분기 처리 (예: 팝업이 있을 때만 닫기)

## 📚 학습 곡선이 있는 대신 얻는 이점

| 장점 | 설명 |
|------|------|
| ✅ 반복 테스트 자동화 | 회귀 테스트, 로그인, 등록 등 반복 작업을 자동 수행 |
| ✅ 다양한 브라우저 지원 | Chrome, Firefox, Edge 등 |
| ✅ CI/CD 연동 가능 | GitHub Actions, Jenkins 등에서 자동 테스트 실행 |

## 🛠 자동화 코드 유지보수 팁

- `data-testid` 속성을 활용해 안정적인 요소 선택
- Page Object Pattern을 사용하여 코드 재사용성 향상
- 테스트 실패 시 스크린샷/로그 자동 저장

---

📎 참고:
- 공식 문서: https://www.selenium.dev/documentation/
- Python 바인딩: https://selenium-python.readthedocs.io/

