
# 🐳 Kubernetes DIND 배포 및 Dockerfile 설정 가이드

## ✅ 1. 목적

- **dotnet8-node-dind:303** 이미지를 기반으로
- **Kubernetes에 DIND Pod를 배포**
- overlay2 storage driver를 사용하여 빠른 Docker build 환경을 구성

---

## 🚀 2. Kubernetes Deployment 예제

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: dotnet8-node-dind-deploy
  namespace: default
spec:
  replicas: 1
  selector:
    matchLabels:
      app: dotnet8-node-dind
  template:
    metadata:
      labels:
        app: dotnet8-node-dind
    spec:
      containers:
      - name: dotnet8-node-dind
        image: dotnet8-node-dind:303
        securityContext:
          privileged: true
        args:
        - dockerd
        - --host=unix:///var/run/docker.sock
        - --storage-driver=overlay2
        ports:
        - containerPort: 2375
        volumeMounts:
        - name: docker-storage
          mountPath: /var/lib/docker
      volumes:
      - name: docker-storage
        hostPath:
          path: /tmp/docker-dind
          type: DirectoryOrCreate
```

✅ **포인트**
- privileged: true 필수
- `/tmp/docker-dind`를 `/var/lib/docker`에 HostPath로 마운트
- overlay2 storage driver 사용

---

## 📝 3. Dockerfile (dotnet8-node-dind:303)

```dockerfile
# ------------------------------------------------------------
# Symlink node and npm for global access
# ------------------------------------------------------------
RUN ln -s /usr/local/bin/node /usr/bin/node &&     ln -s /usr/local/bin/npm /usr/bin/npm &&     node -v && npm -v

# ------------------------------------------------------------
# (Optional) Copy docker (dind) tarball (airgap)
# ------------------------------------------------------------
# wget https://download.docker.com/linux/static/stable/x86_64/docker-20.10.22.tgz
#COPY docker-26.1.4.tgz /tmp/

# Extract to /usr/local/bin
#RUN tar -xzf /tmp/docker-26.1.4.tgz -C /tmp && #    mv /tmp/docker/* /usr/local/bin/ && #    chmod +x /usr/local/bin/docker* && #    rm -rf /tmp/docker*

# ------------------------------------------------------------
# Copy entrypoint.sh
# ------------------------------------------------------------
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# ------------------------------------------------------------
# Expose Docker daemon port (optional)
# ------------------------------------------------------------
EXPOSE 2375

# ------------------------------------------------------------
# Entrypoint
# ------------------------------------------------------------
ENTRYPOINT ["/entrypoint.sh"]
```

---

## 🔽 4. 필요 파일 다운로드

### 📁 docker binary (airgap 설치 시)

```bash
wget https://download.docker.com/linux/static/stable/x86_64/docker-26.1.4.tgz
```

### 📁 entrypoint.sh 예시

```bash
#!/bin/sh
set -e

# Start dockerd with overlay2 storage driver
exec dockerd --host=unix:///var/run/docker.sock --storage-driver=overlay2
```

---

## ⚠️ 5. 주의사항

- `/tmp/docker-dind`는 ephemeral storage로 Node 재부팅 시 데이터가 사라질 수 있습니다.
- overlay2 사용을 위해 HostPath mount는 ext4 또는 xfs(ftype=1) 파일시스템이어야 합니다.
- privileged Pod는 클러스터 보안 정책에 따라 제한될 수 있습니다.

---

## ✅ 6. 참고

- [docker:dind 공식 Docker Hub](https://hub.docker.com/_/docker)
- [BuildKit rootless 대체 가이드](https://github.com/moby/buildkit/blob/master/docs/rootless.md)

---
