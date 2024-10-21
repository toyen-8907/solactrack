# 使用 Node.js 作為基礎映像
FROM node:18-alpine AS build

# 設定工作目錄
WORKDIR /app

# 複製 package.json 和 package-lock.json
COPY frontend/package*.json ./

# 安裝依賴
RUN npm install

# 複製整個應用程式碼
COPY frontend/ .

# 構建應用
RUN npm run build

# 使用 Nginx 提供服務
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html

# 暴露端口
EXPOSE 80

# 默認命令
CMD ["nginx", "-g", "daemon off;"]
