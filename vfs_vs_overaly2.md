# overlay2 vs vfs 성능 비교

## ✅ 1. 개요

Docker build 시 사용되는 storage driver에는 여러 종류가 있으나,  
실무에서는 **overlay2**가 기본 및 권장이며,  
**vfs**는 fallback 용도로만 사용됩니다.

---

## ✅ 2. 구조적 차이

| Storage Driver | 구조 | 성능 특징 |
|--|--|--|
| **overlay2** | Linux kernel native Copy-on-Write (COW) | 매우 빠름, 레이어간 파일 복사 최소화 |
| **vfs** | 실제 파일 전체 복사 (no COW) | 느림, 각 레이어마다 전체 파일 복사 발생 |

---

## ✅ 3. Dockerfile 스텝이 많은 경우의 성능 차이

### 🔴 overlay2

- 각 빌드 스텝이 COW snapshot으로 관리됨
- 변경된 파일만 새로운 레이어에 기록
- **디스크 I/O 최소화** → 빠른 빌드

---

### 🔴 vfs

- 각 스텝에서 **전체 파일을 복사**하여 새로운 디렉토리를 생성
- Dockerfile 스텝이 많을수록 빌드 시간이 기하급수적으로 증가

---

## ✅ 4. 실무 성능 테스트 결과 (대략)

| 테스트 항목 | overlay2 | vfs |
|--|--|--|
| 50 step Dockerfile build time | 3~5분 | 20~30분 이상 |
| 디스크 사용량 | N | N x 스텝수 (중복 파일 전체 복사) |
| I/O 부하 | 낮음 | 매우 높음 |

---

## ✅ 5. overlay2 vs vfs 요약

| 항목 | overlay2 | vfs |
|--|--|--|
| Build 속도 | 빠름 | 매우 느림 |
| 디스크 사용 | 효율적 | 비효율적 (full copy) |
| Production 적합성 | ✅ 권장 | ❌ fallback 전용 |

---

## ⚠️ 6. 최종 결론

✔️ overlay2는 production 빌드 환경에서 **필수적인 storage driver**입니다.  
🔴 vfs는 overlay2를 사용할 수 없는 특수 환경(rootless, overlay 모듈 미지원)에서 fallback 용도로만 사용해야 합니다.

---

