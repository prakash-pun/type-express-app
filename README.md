## Test Driven Development with Typescript Express Nodejs Mocha

- create `.env` file in root folder
   ```
   PORT=3000
   ```


```
> npm install --save express dotenv
> npm install -D mocha chai typescript nodemon supertest ts-node tsconfig-paths
> npm install -D @types/express @types/mocha @types/chai @types/node @types/supertest
> npm install typeorm --save
```

```
tsc --init
npm test -- -w
```

- change `package.json` file from 
```
"dev": "set NODE_ENV=dev & nodemon -r tsconfig-paths/register src/app.ts",
"test": "set NODE_ENV=test & mocha --check-leaks -r tsconfig-paths/register -r ts-node/register \"src/test/**/*.spec.ts\""
```
## TO below setting for mac
```
"dev": "NODE_ENV=dev nodemon -r tsconfig-paths/register src/app.ts",
"test": "NODE_ENV=test mocha --check-leaks -r tsconfig-paths/register -r ts-node/register \"src/test/**/*.spec.ts\""
```

TDD Approach
```
- write test first
- execute a test 
- write code to pass the test
```

```mermaid
graph
A[Add a test] --> B(Execute a test) -- Fail --> C(Make Chage to code) --> D(Execute a test) --> E((Pass))
B -- Pass --> A
D -- Fail --> C
D -- Pass --> A
```

- STATUS code
   ```
   200 OK
   201 CREATED
   204 NO CONTENT
   302 MOVED PERMANENT
   401 UNAUTHORIZED
   403 FORBIDDEN
   404 PAGE NOT FOUND
   405 METHOD NOT ALLOWED
   406 NOT ACCEPTABLE
   408 REQUEST TIMEOUT
   500 INTERNAL SERVER ERROR
   501 NOT IMPLEMENTED
   502 BAD GETWAY
   503 SERVICE UNAVAILABLE
   504 GATEWAY TIMEOUT
   505 HTTP VERSION NOT SUPPORTED`
   ```