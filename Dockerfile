FROM node:18 AS builder

WORKDIR /app



COPY package.json yarn.lock ./

 
RUN yarn install

RUN yarn global add expo-cli

COPY . .

ARG EXPO_PUBLIC_GRAPHQL_ENDPOINT
ENV EXPO_PUBLIC_GRAPHQL_ENDPOINT=$EXPO_PUBLIC_GRAPHQL_ENDPOINT

RUN yarn expo export --platform web

FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]