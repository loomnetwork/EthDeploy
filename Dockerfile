FROM scratch

ADD dashboard /dashboard
ADD static /static
ADD templates /templates

CMD ["/dashboard"]