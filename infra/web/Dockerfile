FROM node:13-buster-slim as react
WORKDIR /build
COPY app/frontend/reactapp/ /build
ENV REACT_APP_API=http://82.146.34.128/api
RUN ls -la
RUN npm install && npm run build

FROM nginx:1.17.9
WORKDIR /srv
COPY --from=react build/build /srv/
COPY infra/web/web.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
