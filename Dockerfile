FROM scratch

ADD misc/ca-certificates.crt /etc/ssl/certs/
ADD dashboard /dashboard
ADD static /static
ADD templates /templates

CMD ["/dashboard"]