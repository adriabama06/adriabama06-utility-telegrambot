FROM node:24-alpine

# pnpm via corepack (viene con la imagen oficial)
RUN corepack enable

WORKDIR /app

COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile --prod 2>/dev/null || pnpm install --prod

COPY . .

CMD ["node", "index.js"]
