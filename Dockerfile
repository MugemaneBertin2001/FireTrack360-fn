# Dockerfile

FROM node:18 AS builder
WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .
ARG EXPO_PUBLIC_GRAPHQL_ENDPOINT
ENV EXPO_PUBLIC_GRAPHQL_ENDPOINT=$EXPO_PUBLIC_GRAPHQL_ENDPOINT
RUN npm run build:web

FROM nginx:alpine
COPY --from=builder /app/web-build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]