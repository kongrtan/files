
# TCP KeepAlive 설정 및 PostgreSQL 연결 가이드

## 1. Windows 10에서 TCP KeepAlive 설정값 조회 방법

Windows에서는 TCP KeepAlive 설정이 레지스트리에 저장되어 있으며 PowerShell로 확인 가능합니다.

### 📌 설정값 조회 (PowerShell)
```powershell
# 연결 유휴 후 첫 keepalive 패킷 전송 시간 (기본: 7200000ms = 2시간)
Get-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Services\Tcpip\Parameters" -Name "KeepAliveTime"

# KeepAlive 패킷 간의 간격 (기본: 1000ms)
Get-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Services\Tcpip\Parameters" -Name "KeepAliveInterval"

# 최대 재전송 횟수
Get-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Services\Tcpip\Parameters" -Name "TcpMaxDataRetransmissions"
```

## 2. Linux에서 TCP KeepAlive 설정값 조회 방법

Linux에서는 `sysctl` 또는 `/proc/sys`를 통해 설정 확인이 가능합니다.

### 📌 설정값 조회 (Linux)
```bash
sysctl net.ipv4.tcp_keepalive_time
sysctl net.ipv4.tcp_keepalive_intvl
sysctl net.ipv4.tcp_keepalive_probes
```

또는:

```bash
cat /proc/sys/net/ipv4/tcp_keepalive_time
cat /proc/sys/net/ipv4/tcp_keepalive_intvl
cat /proc/sys/net/ipv4/tcp_keepalive_probes
```

## 3. PostgreSQL 연결 시 언어별 주요 라이브러리

| 언어 | 라이브러리 명칭 |
|------|-----------------|
| .NET / C# | Npgsql |
| Java      | PostgreSQL JDBC Driver (org.postgresql.Driver) |
| Python    | psycopg2, psycopg |
| Node.js   | pg (node-postgres) |

## 4. 언어별 PostgreSQL 연결 설정 예시

### 🔹 .NET / C#
```csharp
var connString = "Host=localhost;Port=5432;Database=mydb;Username=user;Password=pass;Keepalive=30;";
```

### 🔹 Java
```java
String url = "jdbc:postgresql://localhost:5432/mydb?tcpKeepAlive=true";
```

### 🔹 Python (psycopg2)
```python
conn = psycopg2.connect(
    dbname="mydb", user="user", password="pass", host="localhost",
    keepalives=1,
    keepalives_idle=30,
    keepalives_interval=10,
    keepalives_count=5
)
```

### 🔹 Node.js
```javascript
const { Client } = require('pg');
const client = new Client({
  host: 'localhost',
  user: 'user',
  password: 'pass',
  database: 'mydb'
});

client.connect().then(() => {
  client.connection.stream.setKeepAlive(true, 30000); // 30초
});
```

## 5. KeepAlive 지원 여부 및 시간 설정 가능 여부

| 언어 | KeepAlive 지원 | 시간 설정 가능 여부 | 비고 |
|------|----------------|----------------------|------|
| .NET / C# (Npgsql) | ✅ Keepalive=30 | ❌ (OS 설정 따름) | idle 시간만 설정 가능 |
| Java (JDBC)         | ✅ tcpKeepAlive=true | ❌ | 모든 설정 OS 의존 |
| Python (psycopg2)   | ✅ keepalives=1 외 | ✅ idle, interval, count 모두 설정 가능 | 최상위 제어 가능 |
| Node.js (pg)        | ✅ setKeepAlive | ⭕ (idle만 설정) | 내부 socket 접근 필요 |

## 6. OS별 TCP KeepAlive 설정 변경 방법

### 🔹 Windows (PowerShell)
```powershell
Set-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Services\Tcpip\Parameters" -Name "KeepAliveTime" -Value 30000
Set-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Services\Tcpip\Parameters" -Name "KeepAliveInterval" -Value 1000
Set-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Services\Tcpip\Parameters" -Name "TcpMaxDataRetransmissions" -Value 5
```
> ⚠️ 재부팅 필요

### 🔹 Linux (sysctl)
```bash
sudo sysctl -w net.ipv4.tcp_keepalive_time=30
sudo sysctl -w net.ipv4.tcp_keepalive_intvl=10
sudo sysctl -w net.ipv4.tcp_keepalive_probes=5
```

**영구 적용**: `/etc/sysctl.conf` 또는 `/etc/sysctl.d/keepalive.conf` 파일에 추가

## ✅ 참고

- KeepAlive는 유휴 연결을 유지하거나 죽은 연결을 감지하기 위해 필요함.
- 설정을 제대로 하지 않으면 장시간 연결 유지 시 timeout, FIN_WAIT, CLOSE_WAIT 문제가 발생할 수 있음.
