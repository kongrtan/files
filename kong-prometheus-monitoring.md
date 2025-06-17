# Kong Gateway Helm 설치 기반 Prometheus 모니터링 설정 가이드

## ✅ 개요

이 문서는 Helm으로 설치된 Kong Gateway에 대해 Prometheus + Grafana 기반 모니터링을 설정하는 방법을 안내합니다.

---

## ✅ 1. Kong Helm Chart에서 Prometheus 플러그인 활성화

Helm Chart에서 Prometheus Exporter 플러그인을 활성화하려면 아래와 같이 설정합니다.

### `values.yaml` 예시

```yaml
env:
  plugins: bundled,prometheus

plugins:
  configMaps:
    enabled: true

prometheus:
  enabled: true
  global: true   # 전역 플러그인으로 활성화
```

### 또는 CLI 설치 시

```bash
helm upgrade --install kong kong/kong   --set env.plugins="bundled,prometheus"   --set prometheus.enabled=true   --set prometheus.global=true
```

---

## ✅ 2. Kong `/metrics` 엔드포인트 확인

Kong Prometheus 플러그인이 활성화되면 아래 경로에서 메트릭 확인 가능:

```
http://<KONG_ADMIN_API>:8001/metrics
```

### kubectl 포트 포워딩 예시:

```bash
kubectl port-forward svc/kong-admin 8001:8001 -n <kong-namespace>
curl http://localhost:8001/metrics
```

---

## ✅ 3. Prometheus에서 Kong 메트릭 수집

### 방법 1: ServiceMonitor 사용 (Prometheus Operator 기반)

```yaml
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  name: kong
  labels:
    release: prometheus  # Prometheus 설치 시의 release 이름과 일치해야 함
spec:
  selector:
    matchLabels:
      app.kubernetes.io/name: kong
  namespaceSelector:
    matchNames:
      - kong
  endpoints:
    - port: admin
      path: /metrics
      interval: 15s
```

> Prometheus Operator가 설치된 경우 사용

---

## ✅ 4. Grafana에서 Kong 대시보드 구성

### 방법 1: 공식 Dashboard Import

- Grafana → Dashboards → Import
- Dashboard ID 입력: **7424**
- URL: https://grafana.com/grafana/dashboards/7424

### 방법 2: Helm 기반 자동 대시보드 로딩 (선택)

Prometheus + Grafana를 Helm Chart로 함께 설치했다면, `sidecar`를 통해 ConfigMap으로 자동 로딩 가능.

---

## ✅ 주요 메트릭 예시

| 메트릭 이름 | 설명 |
|-------------|------|
| `kong_http_requests_total` | HTTP 요청 수 |
| `kong_bandwidth_bytes`     | 송수신 바이트 |
| `kong_latency_*`           | Latency (전체 / Kong / Upstream) |
| `kong_connections_*`       | 연결 수 |
| `kong_memory_*`            | Lua 메모리 사용량 |

---

## ✅ 전체 아키텍처 구성

```
[Kubernetes Cluster]
     |
[ Helm 설치된 Kong Gateway (Admin /metrics 활성화) ]
     |
[ Prometheus (Helm, Operator or Raw) ]
     |
[ Grafana (Kong Dashboard #7424) ]
```

---

## ✅ Troubleshooting 체크리스트

| 항목 | 확인 방법 |
|------|------------|
| `/metrics` 노출 여부 | `curl http://localhost:8001/metrics` |
| Prometheus 대상 포함 여부 | Prometheus UI → Status → Targets |
| Grafana datasource 확인 | Grafana → Configuration → Data Sources |
| Helm namespace/label 일치 여부 | `ServiceMonitor`, `values.yaml` 확인 |

---

## ✅ 필요 시 제공 가능한 항목

- Kong + Prometheus + Grafana용 `values.yaml` 예시
- `ServiceMonitor` + `GrafanaDashboard` 자동 구성 예제
- `docker-compose` 기반 테스트 예시
