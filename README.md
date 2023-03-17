# MEVN-template
A MEVN stack template using Lerna and Docker compose

## Structure

This project contains three parts the `server`, the `client` and the `database` you will find them in the `packages` folder.

The `database` will be run using the `mongo` docker image from dockerhub.
All you need to do is run: 
`docker run -p 27017:27017 --name ${PROJECT_NAME}-db-container -v ${PATH_TO_FOLDER}/packages/db/data:/data/db -d mongo`
Replace the `${PROJECT_NAME}` with your project name and the `${PATH_TO_FOLDER}` with the path from root to this folder.

The `server` uses my `Express-template` which already has validation, authentication and a structure to start with. I find using the controller, service, repository layers in express is better when scaling to a larger application.

The `client` uses `Vue.js` this folder is left empty in the project and will be created by using `vue create .` I made the decision to do it like this because then I will not have to maintain the version in the repository and since the `@vue/cli` tool works great this is not necessary.

## Building the app

To build the application I decided to manage the monorepository using `lerna`. Lerna is more efficient than `yarn` and is easy to handle multiple repositories in a single repository.
To build and run this application I decided to go for `docker compose`, docker compose is not ideal for scaling to millions of users but I think it works fine for most use cases.
This project's scope is to give a template for building application that can be used to a certain point. I think this point is okay for most use cases.
