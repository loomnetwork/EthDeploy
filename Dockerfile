FROM golang:latest 
RUN mkdir /app 
ADD . /app/ 
WORKDIR /app 
RUN go build -o /app/dashboard main.go 
CMD ["/app/dashboard"]