# Coding Challenges Collection

> The single source of truth for coding challenges across the web.

## Getting Challenges

### Query all challenges

```
// GET
/challenges?q={query}&difficulty={diff}}
```

| Parameter |           | Description            |
|-----------|-----------|------------------------|
| q         | optional  | The query string to be contained in returned challenges|
| difficulty| optional  | The difficulty of challenges to return|

### Get a challenge by id
```
// GET
/challenges/<challenge id>
```

### Solving a challenge

> Solutions should be a json object containing an array of ordered solutions to all tests given in the challenge.

> Ex solutions object: {"attempt": [[0, 1, 2], [7, 8, 9]]}

Your solutions object should be inserted into the body of your post request.

A successful attempt response will have a single property:
* success: true

A failed attempt response will be an object with three properties:
* success: false
* failedOn: index of test that failed
* message: user friendly failure message

If a solution is successful it will be applied to the currently logged in user's account

```
// POST
/challenges/<challenge id>/solve
```

## Working with users

### Creating a user
> Creating a user must be done with a POST request with fields: name, email, and password
```
// POST
/create-user/
```

### Getting a user by id
```
// GET
/users/<id>
```

### Logging in a user
> Logging in a user must be done with a POST request with fields: email, password
```
// POST
/login
```

### Logging out a user
```
// GET
/logout
```

###

