FROM node:16-alpine

WORKDIR /app

COPY package.json .
COPY package-lock.json .

RUN npm ci --only=production

COPY prisma/ prisma/
RUN npx prisma generate

COPY . .

EXPOSE 3333
USER node
CMD ["npm", "start"]