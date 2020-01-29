FROM node:10-alpine

MAINTAINER Sergio Rodríguez <sergio.rdzsg@gmail.com>

ADD . /pdn_s2_backend
WORKDIR /pdn_s2_backend

RUN yarn add global yarn \
&& yarn install \
&& yarn cache clean

EXPOSE ${PORT}

CMD ["yarn", "start"]
