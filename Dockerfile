FROM nginx:alpine

COPY . /usr/share/nginx/html
COPY nginx.conf.template /etc/nginx/templates/default.conf.template

EXPOSE 8080

CMD ["sh", "-c", "export PORT=${PORT:-8080}; envsubst '$PORT' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf; nginx -g 'daemon off;'"]
