## Chat-App

WebChat app using websocket.

Dependencies : 
- NodeJs
- Express
- Postgres & Sequalize
- MUI4
- ReactJs
- Docker-Compose
- Socket.io
- CommonJs

## Docker Databases & API

If you don't want to install postgres, dependecies and create all database or API service manually, you can create docker container with all you need already installed.

1. Install [docker](https://www.docker.com/get-started)
2. Linux users must install [docker-compose](https://docs.docker.com/compose/install/) as well. For MacOS and Windows, docker-compose is included into **Docker for Desktop**.
3. Execute `docker-compose up -d  ` [Postgres, WebApp & Backend should be up and running now. ]
4. Wait for container services to be up & running.
5. Visit [Chat-app](http://localhost:3000) in browser.


## Access WebApp & API

To prepare and start the front-end chat app use below command.
- `docker-componse up ui`
-   [Chat-app](http://localhost:3000)
- `docker-componse up api`
-   [Node-app](http://127.0.0.1:8080/)

## Functionality
-   User can register with unique email
-   User can login with email and Password
-   All Users can chat via public channel
-   User can see list of other users and initiate for chat
-   User can chat with other user via private channel | 1:1
-   User can Logout
-   User can see message history

## Docker DB, webapp & API Commands/Scripts

- `docker-compose up -d ` to only start database, web & api containers.
- `docker-componse up postgres ` to only start database container.
- `docker-compose build --no-cache ` to only build.
- `docker-compose down ` to stop and remove all containers.
- `docker-compose stop ` to only stop running containers.

#### Docker Logs
- `docker-compose logs --follow postgres ` to view logs of postgres service
- `docker-compose logs --follow api ` to view logs of api service
- `docker-compose logs --follow ui ` to view logs of webapp service

- `docker exec -it chat-app-postgres sh -c \"PGPASSWORD=password psql -U postgres\"  ` to access postgres cli

##
Made with `:heart:`
