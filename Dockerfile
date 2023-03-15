FROM node:18-alpine

ENV PORT=8080
ENV DB_PATH=./database/.db

RUN mkdir -p /app/
RUN mkdir -p /app/front

ADD app/front/package*.json /app/front/
WORKDIR /app/front
RUN npm install
ADD app/front/. /app/front/
WORKDIR /app/front
RUN npm run build

ADD app/back/package*.json /app/
WORKDIR /app
RUN npm install
ADD app/back/. /app/

RUN mkdir -p /app/static
RUN cp -r /app/front/build/* /app/static/
RUN rm -r /app/front

EXPOSE 8080

WORKDIR /app
RUN npm run build
CMD ["npm", "run", "start:prod"]
