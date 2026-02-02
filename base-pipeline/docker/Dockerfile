FROM nginx:alpine

COPY website /usr/share/nginx/html

HEALTHCHECK --interval=30s --timeout=5s \
  CMD wget -qO- http://localhost || exit 1

EXPOSE 80
