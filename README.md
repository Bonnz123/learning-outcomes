# Setup Project

Create .env File

```
DATABASE_URL="mysql://root:your password@localhost:3306/your databases"
SECRET_KEY="your secret"
SECRET_KEY_DATABASE="your secret database"
SECRET_KEY_COOKIE="your secret signed cookie"
```


## Instalasi

```Shell

npm install

npx prisma migrate dev

npm run build

```

## Run Project

```Shell

sudo redis-server

npm run start

```