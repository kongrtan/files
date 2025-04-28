```
yarn remove webpack webpack-cli webpack-dev-server html-webpack-plugin mini-css-extract-plugin css-loader style-loader babel-loader
```

```
yarn add vite --dev
yarn add @vitejs/plugin-react --dev
```

### vite.config.ts
```
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    port: 3000,
  },
});

```


## package.json

```
"scripts": {
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview"
}

```


5. .env 파일 확인

만약 .env 설정 있으면 VITE_ prefix 붙여야 Vite에서 인식해. (예를 들어 API_URL=http://localhost:3000 → VITE_API_URL=http://localhost:3000)


```
yarn dev
```

