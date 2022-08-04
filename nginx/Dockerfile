FROM  nginx:latest
COPY  ./nginx.conf  /etc/nginx/nginx.conf
COPY  ./ssl         /etc/ssl/certs/nginx
COPY  ./public      /usr/share/nginx/html
EXPOSE 80/tcp
EXPOSE 443/tcp
