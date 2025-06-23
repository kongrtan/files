
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





# 언어별 PostgreSQL 연결 유휴 시간 대응 및 KeepAlive 설정 가이드

## 📌 개요

PostgreSQL과 장시간 연결된 상태에서 유휴 시간이 발생하면, 서버 재시작, 네트워크 오류, NAT 타임아웃 등으로 인해 **끊긴 커넥션이 커넥션 풀에 남아 장애**로 이어질 수 있습니다. 이를 방지하기 위한 각 언어별 보완 방법을 정리합니다.

---

## ✅ Java

### 🔹 대응 방법

- `validationQuery="SELECT 1"`
- `validationInterval=5000` (ms 단위, 너무 자주 검증 방지)
- `testOnBorrow=true`
- `idleTimeout`, `maxLifetime` 설정

### 🔹 설정 예시 (HikariCP + Spring Boot)

```properties
spring.datasource.hikari.connection-test-query=SELECT 1
spring.datasource.hikari.validation-timeout=3000
spring.datasource.hikari.test-while-idle=true
spring.datasource.hikari.idle-timeout=600000
spring.datasource.hikari.max-lifetime=1800000
```

### 🔹 설정 예시 (Apache DBCP)

```xml
<Resource
  name="jdbc/postgres"
  auth="Container"
  type="javax.sql.DataSource"
  driverClassName="org.postgresql.Driver"
  url="jdbc:postgresql://localhost:5432/mydb"
  username="user"
  password="pass"
  validationQuery="SELECT 1"
  validationInterval="5000"
  testOnBorrow="true"
/>
```

---

## ✅ .NET / C# (Npgsql)

### 🔹 대응 방법

- `Keepalive=30` → TCP 수준에서 유휴 연결 감지
- 커넥션을 사용할 때 `SELECT 1` 직접 실행
- 실패 시 `ClearPool()` 또는 `ClearAllPools()` 호출로 커넥션 풀 재정비

### 🔹 설정 예시

```csharp
var connStr = "Host=localhost;Username=foo;Password=bar;Database=mydb;Keepalive=30;";
using var conn = new NpgsqlConnection(connStr);
await conn.OpenAsync();

using var cmd = new NpgsqlCommand("SELECT 1", conn);
await cmd.ExecuteScalarAsync();
```

---

## ✅ Python (psycopg2 + SQLAlchemy)

### 🔹 대응 방법

- `pool_pre_ping=True` → 연결 꺼낼 때 자동 `SELECT 1`
- `pool_recycle=1800` → N초 지나면 강제로 연결 재설정

### 🔹 설정 예시

```python
from sqlalchemy import create_engine

engine = create_engine(
    "postgresql+psycopg2://user:pass@localhost/mydb",
    pool_pre_ping=True,
    pool_recycle=1800
)
```

---

## ✅ Node.js (pg, pg-pool)

### 🔹 대응 방법

- `setInterval()`로 주기적으로 `SELECT 1` 실행
- 커넥션 풀에서 꺼낸 뒤 직접 ping
- `idleTimeoutMillis` 설정

### 🔹 설정 예시

```javascript
const { Pool } = require('pg');

const pool = new Pool({
  user: 'user',
  host: 'localhost',
  database: 'mydb',
  password: 'pass',
  port: 5432,
  idleTimeoutMillis: 30000
});

setInterval(async () => {
  try {
    await pool.query('SELECT 1');
  } catch (e) {
    // 재시도 또는 알림
  }
}, 10000);
```

---

## ✅ Go (database/sql + pq/pgx)

### 🔹 대응 방법

- `db.Ping()` 수동 유효성 검사
- `SetConnMaxIdleTime`, `SetConnMaxLifetime`으로 유휴 제한

### 🔹 설정 예시

```go
db.SetConnMaxIdleTime(5 * time.Minute)
db.SetConnMaxLifetime(1 * time.Hour)

err := db.Ping()
if err != nil {
  // 연결 재설정
}
```

---

## ✅ 전략 요약

| 언어 | 보완 방법 요약 |
|------|----------------|
| Java | `validationQuery`, `validationInterval`, `idleTimeout` |
| .NET | `Keepalive`, 수동 `SELECT 1`, 예외 시 `ClearPool()` |
| Python | `pool_pre_ping`, `pool_recycle` |
| Node.js | `setInterval(SELECT 1)`, `idleTimeoutMillis` |
| Go | `db.Ping()`, `SetConnMaxIdleTime()` |

---

## ✅ 공통 권장 전략

- OS 수준 KeepAlive 설정 병행 (Windows, Linux)
- 연결 실패 시 자동 재시도 로직 추가
- 가능하다면 커넥션 풀에서 유효성 검증 기능 활용


