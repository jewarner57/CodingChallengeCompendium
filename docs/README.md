# Coding Challenges Collection

> The single source of truth for coding challenges across the web.

## Getting Challenges

### Query all challenges

```
/challenges?q={query}&difficulty={diff}&dsa={ids of ds or a}&companies={company ids}
```

| Parameter |           | Description            |
|-----------|-----------|------------------------|
| q         | optional  | The query string to be contained in returned challenges|
| difficulty| optional  | The difficulty of challenges to return|
| dsa       | optional  | An array of ids of data structures or algorithms that should be tagged on the challenge|
| companies | optional  | An array of ids of  companies that should be tagged on the challenge|

### Get a challenge by id
```
/challenges/<challenge id>
```

### Solving a challenge

> Solutions param should be a json object containing an array of ordered solutions to all tests given in the challenge.

> Ex solutions object: {"solutions": [{[0, 1, 2]}, {[7, 8, 9]}]}

A response will contain either an object {success: true} or an object: {success: false, failedOn: [test that failed]}

If a solution is successful it will be applied to the currently logged in user's account

```
/challenges/<challenge id>/solve?solutions={test solutions}
```

## Getting Companies
Get all companies
```
/companies
```

Get one company by id
```
/companies/id
```


## Getting Data Structures and Algorithms Tags
Get all data structures and algorithms
```
/dsa
```

Get one data structure or algorithm by id
```
/dsa/id
```

## Working with users

### Creating a user
> Creating a user must be done with a POST request with fields: name, email, and password
```
/create-user/
```

### Getting a user by id
```
/users/<id>
```

### Logging in a user
> Logging in a user must be done with a POST request with fields: email, password
```
/login
```

### Logging out a user
```
/logout
```

###

