# files
```
Get-AppxPackage -allusers Microsoft.WindowsStore | Foreach {Add-AppxPackage -DisableDevelopmentMode -Register "$($_.InstallLocation)\AppXManifest.xml"}
```

```
takeown /f “C:\Program Files\WindowsApps” /r
```

2. dynamic tick 기능 해제 

?

dynamic tick은 절전 기술과 관련된 윈도우 기능이라고 해요. 노트북의 배터리를 절약해 주는 기능인데 이 기능에 버그가 생기면 우클릭 시 멈춤 현상이 나타날 수 있다고 해요. 이 기능을 해제하는 것이 두 번째 해결방법입니다. 

?

해제 방법은 역시 1번의 방법과 같이 '명령 프롬프트'에서 bcdedit /set disabledynamictick yes 라는 명령어를 입력해 주시면 됩니다. 이제 아시죠? 윈도우 키 + X 키를 동시에 누르면 명령 프롬프트가 시작됩니다. 

?

역시 bcdedit 띄우고 슬래쉬 set 띄우고 disabledynamictick 띄우고 yes를 친 후 엔터키까지 누르면 끝입니다 .


HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control

WaitToKillServiceTimeout REG_SZ 1000


HKEY_CURRENT_USER\Control Panel\Desktop

WaitToKillAppTimeout  REG_SZ 5000



다음은 예시로 myapp:// 링크를 클릭하면 C:\Program Files\MyApp\myapp.exe가 실행되게 만드는 방법입니다.

```
Windows Registry Editor Version 5.00

[HKEY_CLASSES_ROOT\myapp]
@="URL:MyApp Protocol"
"URL Protocol"=""

[HKEY_CLASSES_ROOT\myapp\shell]

[HKEY_CLASSES_ROOT\myapp\shell\open]

[HKEY_CLASSES_ROOT\myapp\shell\open\command]
@="\"C:\\Program Files\\MyApp\\myapp.exe\" \"%1\""

```
