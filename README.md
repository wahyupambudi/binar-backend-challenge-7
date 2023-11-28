# BINAR ACADEMY BACKEND CHALLENGE 7
### Debugging, Logging, Sentry, Socket Io, Mailer 

#### Address Server Backend REST API [https://binar-backend-challenge-7-production.up.railway.app/api/v1/auth/](https://binar-backend-challenge-7-production.up.railway.app/api/v1/auth/)
#### Address View EJS [https://binar-backend-challenge-7-production.up.railway.app](https://binar-backend-challenge-7-production.up.railway.app/)

## Backend

### Register
[https://binar-backend-challenge-7-production.up.railway.app/api/v1/auth/register](https://binar-backend-challenge-7-production.up.railway.app/api/v1/auth/register)

```
POST /api/v1/auth/register HTTP/1.1
Content-Type: application/json
Host: binar-backend-challenge-7-production.up.railway.app
Content-Length: 71

{
	"name": "user",
	"email": "email@gmail.com",
	"password": "123123"
}
```

### Login
[https://binar-backend-challenge-7-production.up.railway.app/api/v1/auth/login](https://binar-backend-challenge-7-production.up.railway.app/api/v1/auth/login)

```
POST /api/v1/auth/login HTTP/1.1
Content-Type: application/json
Host: binar-backend-challenge-7-production.up.railway.app
Content-Length: xx

{
	"email": "email@gmail.com",
	"password": "123123"
}
```

### Forgot Password
[https://binar-backend-challenge-7-production.up.railway.app/api/v1/auth/forgotpassword](https://binar-backend-challenge-7-production.up.railway.app/api/v1/auth/forgotpassword)

```
POST /api/v1/auth/forgotpassword HTTP/1.1
Content-Type: application/json
Host: binar-backend-challenge-7-production.up.railway.app
Content-Length: 45

{
	"email": "email@gmail.com"
}
```

### Reset Password (get link from email)

## Test with views ejs

### Homepage
[https://binar-backend-challenge-7-production.up.railway.app/](https://binar-backend-challenge-7-production.up.railway.app/)

### Login
[https://binar-backend-challenge-7-production.up.railway.app/login](https://binar-backend-challenge-7-production.up.railway.app/login)

### Register
[https://binar-backend-challenge-7-production.up.railway.app/register](https://binar-backend-challenge-7-production.up.railway.app/register)

### Forget Password
[https://binar-backend-challenge-7-production.up.railway.app/forgotpassword](https://binar-backend-challenge-7-production.up.railway.app/forgotpassword)


