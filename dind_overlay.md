dind overlay2

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
