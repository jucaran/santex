# Santex challenge

## How to run the project

**To run the project you just need to**

Put the default ports/credentials on the `.env` file <br> 
```
cp .env.template .env
```
You can edit the `.env` file as you like, by default the graphql server is on ``localhost:4000`` <br>

Install and build the needed images and run the project.<br>
```
docker-compose up --build
```

<br>

**If you would like to start a dev server you can run** <br>
(with the .env file already added)
```
docker-compose up --build &&
cd server &&
npm i &&
npm run dev
```
This command builds and starts the project, install the package dependencies and runs the dev server <br>
It watches for changes on the ``./server/src`` directory and restarts the node app with every change

<br>

## About the decision making
Because of the tight relationships between the data types and the fact that we have little writing on db I thought that the best choice in this case was a SQL database. <br>
Then I added a redis cache to handle the API request limitations.

I chose to use prisma as an ORM beacause of its type safety models.
