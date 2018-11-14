# TODO Backend

## Auth API

### For Login:
- email
- password
### For Register:
- name
- email
- password

| Method |  route | descryption |
|--------|--------|-------------|
| POST | /login | get access token |
| POST | /register | create new user |

## Todo API

> Need access token as `token` header

| Method |  route | descryption |
|--------|--------|-------------|
| GET | /todos | list all todos |
| GET | /todos/:id | get todo by id |
| POST | /todos | create new todo |
| PUT | /todos/:id | edit todo |
| DELETE | /todos/:id | delete todo by id |
