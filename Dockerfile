FROM scratch

ADD misc/ca-certificates.crt /etc/ssl/certs/
ADD dashboard /dashboard
ADD static /static
ADD templates /templates
ADD misc/kube-test.yml /kube-test.yml

CMD ["/dashboard"]