# ---------- Builder (มี devDeps เพื่อ build tailwind) ----------
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
# build ไฟล์ CSS ของ Tailwind
RUN npx tailwindcss -i ./src/styles/tailwind.css -o ./public/asset/tailwind.css --minify

# ---------- Runner (เฉพาะ prod deps) ----------
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV TZ=Asia/Bangkok

# ติดตั้งเฉพาะ prod deps (ไม่เอา dev)
COPY package*.json ./
RUN npm ci --omit=dev

# คัดลอกซอร์สและ asset ที่ build แล้วจาก builder
COPY --from=builder /app ./

EXPOSE 3000
CMD ["npm","run","start"]
