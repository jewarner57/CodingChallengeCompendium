# Coding Challenge Compendium

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

### Example Challenge Object:
``` json
    {
        "testcases": [
            "[5, 10, 14]"
        ],
        "_id": "6092b7382f0e6144367d9895",
        "name": "challenge name 4",
        "difficulty": 5,
        "description": "some desc",
        "testsolutionsID": "6092b7382f0e6144367d9894",
        "author": "6092b72e2f0e6144367d9893",
        "created_at": "2021-05-05T15:18:16.613Z",
        "updatedAt": "2021-05-05T15:18:16.613Z",
        "__v": 0
    }
```

## Solving a challenge

> Solutions should be a json object containing a matrix of ordered solutions to all tests given in the challenge.

> Ex solutions object: {"attempt": [[0, 1, 2], [7, 8, 9]]}

Your solutions object should be inserted into the body of your post request.

A successful attempt response will have a single property:
* success: true

A failed attempt response will be an object with three properties:
* success: false
* failedOn: index of test that failed
* message: user friendly failure message

If a solution is successful it will be applied to the current user's account
```
// POST
/challenges/<challenge id>/solve
```

## Working with users

### Creating a user
> Creating a user must be done with a POST request with fields: email, and password
```
// POST
/sign-up
```

If the user is created successfully the new user will be returned.

### Get a user by id
```
// GET
/users/<id>
```

### Delete a user by id
```
// DELETE
/users/<id>
```

### Example User Object
``` json
{
    "user": {
        "createdChallenges": [],
        "solvedChallenges": [],
        "_id": "6092b72e2f0e6144367d9893",
        "email": "mytest@user.com",
        "created_at": "2021-05-05T15:18:06.877Z",
        "updatedAt": "2021-05-05T15:18:06.877Z",
        "__v": 0
    }
}
```

### Logging in a user
> Logging in a user must be done with a POST request with fields: email, password
```
// POST
/login
```

### Logging out a user
```
// POST
/logout
```


