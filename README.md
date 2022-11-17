# Northcoders House of Games API

This is an API that connects to a database in order to retrieve, edit and delete information on reviews of board games. The various tables that the database is composed of are:
- Reviews
- Comments
- Users
- Categories

## Cloning 

```bash 
git clone https://github.com/Susizhou/games-reviews 
```
## Installation of dependencies

Use the package manager [npm](https://docs.npmjs.com/) to install all dependencies.

```bash
npm install
```
## Setup of .env files
In order to run the tests locally and access the databases, you need to do the following:
- create .env.development file and an add PGDATABASE = nc_games into it
- create .env.test file and an add PGDATABASE = nc_games_test into it

Once the envionment variables are set, you're ready to connect to the databases!

### Example:
```bash
PGDATABASE = nc_games
```

## How to run the tests
This command runs all the tests.
```bash
npm t
```

## How to seed local database
This seeds the databse to its initial status locally
```bash
npm run seed
```
## Requirements 
Postgres: 8.7.3

Node.js: 18.10.0
