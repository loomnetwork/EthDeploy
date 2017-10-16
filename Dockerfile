FROM golang:latest 
RUN mkdir /app 
ADD . /app/ 
WORKDIR /app 

ADD dashboard /
CMD ["/app/dashboard"]

#todo add static