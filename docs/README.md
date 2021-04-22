# Coding Challenges Collection

> The single source of truth for coding challenges across the web.

## Getting Challenges

### Query all challenges

```
/challenges?name={cname}&difficulty={diff}&dsa={ids of ds or a}&companies={company ids}
```

| Parameter |           | Description            |
|-----------|-----------|------------------------|
| name      | optional  | The name to be contained in returned challenges|
| difficulty| optional  | The difficulty of challenges to return|
| dsa       | optional  | An array of ids of data structures or algorithms that should be tagged on the challenge|
| companies | optional  | An array of ids of  companies that should be tagged on the challenge|

### Get a challenge by id
```
/challenges/<challenge id>
```

### Solving a challenge

> Solutions param should be a json object containing an array of ordered solutions to all tests given in the challenge.

> A response will contain either a success message or a failure message containing the test that caused the failure

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

/users/<user id>

