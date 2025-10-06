# 1. Chọn Node image
FROM node:22

# 2. Set working directory
WORKDIR /usr/src/app

# 3. Copy package.json và package-lock.json
COPY package*.json ./

# 4. Cài dependencies
RUN npm install

# 5. Copy toàn bộ source code
COPY . .

# 7. Expose port
EXPOSE 3000

# 8. Command để chạy server
CMD ["npm", "run", "dev"]
