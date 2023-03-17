FROM node:alpine as builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .
COPY .env.prod .env

RUN npm run build --production

FROM nginx:alpine

COPY --from=builder /app/dist /var/www/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]