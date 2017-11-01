FROM node:6

RUN apt install -y make gcc g++ python git bash
COPY package.json /src/package.json

WORKDIR /src
RUN npm install

ADD tmp/testrpc .

EXPOSE 8081

CMD ["/bin/bash"]

