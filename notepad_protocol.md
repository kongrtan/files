
# Windows 10 크롬에서 Notepad 실행 방법

## ⚠️ 사전 설명

1. **Chrome은 기본적으로 로컬 프로그램 실행을 허용하지 않습니다.**
   - 보안상 `file://` 링크 외 실행은 차단됩니다.
2. **레지스트리 등록 후** 특정 프로토콜을 정의하여 `notepad://filename.txt` 형식으로 호출할 수 있습니다.
3. 실습은 로컬 PC에서만 작동하며, 기업 PC 정책에 따라 차단될 수 있습니다.

---

## ✅ 1. 레지스트리 등록 방법

아래 예시는 **`notepad`라는 커스텀 프로토콜**을 등록하여 실행하는 방법입니다.

### 📄 reg 파일 예시

아래 내용을 메모장으로 작성 후 `notepad_protocol.reg`로 저장 후 실행합니다.

```reg
Windows Registry Editor Version 5.00

[HKEY_CLASSES_ROOT\notepad]
@="URL:notepad Protocol"
"URL Protocol"=""

[HKEY_CLASSES_ROOT\notepad\shell]

[HKEY_CLASSES_ROOT\notepad\shell\open]

[HKEY_CLASSES_ROOT\notepad\shell\open\command]
@="C:\\Windows\\System32\\notepad.exe \"%1\""
```

🔧 **적용 방법:**

1. 위 내용을 `notepad_protocol.reg`로 저장
2. 더블클릭하여 레지스트리에 병합
3. 실행 경로가 다를 경우 경로 수정 (기본 경로는 `C:\Windows\System32\notepad.exe`)

---

## ✅ 2. HTML `<a>` 태그 샘플

아래는 프로토콜 링크를 통해 Notepad를 실행하는 예시입니다.

```html
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <title>Notepad Protocol Test</title>
</head>
<body>
    <a href="notepad:test.txt">메모장 열기 (test.txt)</a>
</body>
</html>
```

- `test.txt`는 현재 경로 기준으로 열리므로, **절대 경로**를 지정하는 것이 안전합니다.

예:

```html
<a href="notepad:C:\Users\YourName\Documents\test.txt">문서 폴더의 test.txt 열기</a>
```

---

## ⚠️ 추가 주의사항

- **Chrome 보안 정책** 때문에 바로 실행되지 않을 수 있으며, 사용자 확인 팝업이 뜨거나 무시될 수 있습니다.
- 이러한 방식은 **사내 포털, 인트라넷, Kiosk 환경에서만** 사용하고, 공개 웹사이트에서는 보안상 지양해야 합니다.

---

```
reg add "HKCR\notepad" /ve /d "URL:notepad Protocol" /f
reg add "HKCR\notepad" /v "URL Protocol" /d "" /f
reg add "HKCR\notepad\shell" /f
reg add "HKCR\notepad\shell\open" /f
reg add "HKCR\notepad\shell\open\command" /ve /d "\"C:\Windows\System32\notepad.exe\" \"%1\"" /f

```
