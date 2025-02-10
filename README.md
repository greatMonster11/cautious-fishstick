Media Scraper
- Create an API which will accept an array for Web URL in the request Body.
- Add Basic Server Auth Middleware.
- Add Middleware for Logging and Error Handling.
- Scrap Image and Video URLs for requested Web URL's.
- Store All Data into any SQL database.
- Create a simple web page for showing all the Images and Video's.
- Paginate front-end API and we can filter data based upon type and search text.
- Use Node.js for backend and React.js for front-end.
- Dockerize your code using docker-compose or any docker orchestrator that can be run on personal computers.
- Support both server side rendering and client side rendering (React, Angular..) scraper.
- Do have the demo video of the working delivered submission included.
- Imagine you're given 1 CPU and 1GB RAM server to run the BE, how can you scale your scraper to handle ~5000 URL at the same time

# cautious-fishstick

## Getting started
Refer to the `sample.env` to create the `.env` file. This file is madatory for containers.
E.g. `cp sample.env .env`

Note: Please refer the the video demo for the working submission on user authentication and scraping scheduler.

### Start the containers
```sh
docker-compose -f docker-compose-dev.yml up
```

## Prepare the database with sample user
Sometimes the `postgres` container take longer time to finish the intialization than expected in this case.
We should doing something more handly. Please refer to below command.

### Create an `.env` inside `server` directory
```sh
cd server
cp env.sample .env
```

### Install dependencies
Required `npm` to be installed on your machine.
```sh
npm install
```

### Generate sample user
```sh
npx prisma migrate deploy
```

```sh
npx prisma db seed
```
