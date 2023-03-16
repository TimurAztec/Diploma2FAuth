# 2 factor authentication made in NestJS and React

## Installation

```bash
$ cd app/back
$ npm install
$ cd app/front
$ npm install
```

## Example .env file for back

```bash
APP_SECRET=admin
PORT=3000
DOMAIN="http://localhost:3000"
EMAIL_ID=johndoe@gmail.com
EMAIL_PASS=admin
MONGO_DB_URL=mongodb://admin:admin@localhost:27017/diploma2fauth
```

## Example .env file for front

```bash
REACT_APP_API_BASE_URL="http://localhost:3000"
```

## Running the app in dev

```bash
$ cd app/front
$ npm start
$ cd app/back
$ npm run start:dev
```

## Running the app in docker prod

```bash
$ docker build .
```

## Stay in touch

- Author - [ Tymur Ptashchenko ](https://github.com/TimurAztec)

## License

Nest is [MIT licensed](LICENSE).
