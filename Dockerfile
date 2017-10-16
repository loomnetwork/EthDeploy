FROM scratch

ADD dashboard /dashboard
ADD static /static

CMD ["/dashboard"]