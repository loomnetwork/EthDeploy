FROM scratch
RUN mkdir /app 
ADD . /app/ 
WORKDIR /app 

ADD dashboard /app/dashboard
ADD static /app/static

CMD ["/app/dashboard"]