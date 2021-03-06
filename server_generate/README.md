# research

## Overview

This server was generated using the [OpenAPI Generator](https://openapi-generator.tech) project. The code generator, and it's generated code allows you to develop your system with an API-First attitude, where the API contract is the anchor and definer of your project, and your code and business-logic aims to complete and comply to the terms in the API contract.

### prerequisites

- NodeJS >= 10.6
- NPM >= 6.10.0

### Running the server

1.  Use the OpenAPI Generator to generate your application:
    Assuming you have Java (1.8+), and [have the jar](https://github.com/openapitools/openapi-generator#13---download-jar) to generate the application, run:
    `java -jar openapi-generator-cli.jar generate -i swagger.yaml -t templates\nodejs-express-server -g nodejs-express-server`
    Or use the command that appears in the project
    `run_swagger.cmd`
    -i The file to generate.
    -t A template we will use to create the code.
    -g The type of server we want to create.
    -o The location of the folder where we want the project.

2.  There's a fully working NodeJS-ExpressJs server.
    the server will run on port 3000.
    files will be uploaded to a new directory 'uploaded_files'.

3.  The server will base itself on an openapi.yaml file which is located under /api/openapi.yaml. This is not exactly the same file that you used to generate the app.

4.  All calls to endpoints that were configured in the openapi.yaml document go to `controllers/{name_of_tag_which_the_operation_was_associated_with}.js`,
    which is a very small method. All the business-logic lies in `controllers/Controller.js`, from there - to `services/{name_of_tag_which_the_operation_was_associated_with}.js`,
    and from there - to `models/{name_of_tag_which_the_operation_was_associated_with}.js`.

5.  Middleware managed by [express-openapi-validator](https://github.com/cdimascio/express-openapi-validator) in the expressServer.js file

```
npm start
```

### View and test the API

(Assuming no changes were made to config.js)

1. API documentation, and to check the available endpoints: http://localhost:8080/api-docs/.

2. Download the oepnapi.yaml document: http://localhost:8080/openapi.

3. Every call to an endpoint that was defined in the openapi document will return a 200 and a list of all the parameters and objects that were sent in the request.

4. Endpoints that require security need to have security handlers configured before they can return a successful response.
   At this point they will return [ a response code of 401 or 403](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/401).

5. ##### At this stage the server does not support document body sent in xml format.

### Node version and guidelines

The code was written using Node version 10.6, and complies to the [Airbnb .eslint guiding rules](https://github.com/airbnb/javascript).

### Project Files

#### Root Directory:

In the root directory we have (besides package.json, config.js, and log files):

- **logger.js** - where we define the logger for the project. The project uses winston, but the purpose of this file is to enable users to change and modify their own logger behavior.

- **index.js** - This is the project's 'main' file, and from here we launch the application. This is a very short and concise file, and the idea behind launching from this short file is to allow use-cases of launching the server with different parameters (changing config and/or logger) without affecting the rest of the code.

- **expressServer.js** - The core of the Express.js server. This is where the express server is initialized, together with the OpenAPI validator, OpenAPI UI, and other libraries needed to start our server. If we want to add external links, that's where they would go. The project uses the [express-openapi-validator](https://www.npmjs.com/package/express-openapi-validator) library that acts as a first step in the routing process - requests that are directed to paths defined in the `openapi.yaml` file are caught by this process, and it's parameters and bodyContent are validated against the schema. A successful result of this validation will be a new 'openapi' object added to the request. If the path requested is not part of the openapi.yaml file, the validator ignores the request and passes it on, as is, down the flow of the Express server.

#### api/

- **openapi.yaml** - This is the OpenAPI contract to which this server will comply. The file was generated using the codegen, and should contain everything needed to run the API Gateway - no references to external models/schemas.

#### utils/

Currently a single file:

- **openapiRouter.js** - This is where the routing to our back-end code happens. If the request object includes an `openapi` object, it picks up the following values (that are part of the `openapi.yaml` file): 'x-openapi-router-controller', and 'x-openapi-router-service'. These variables are names of files/classes in the controllers and services directories respectively. The operationId of the request is also extracted. The operationId is a method in the controller and the service that was generated as part of the codegen process. The routing process sends the request and response objects to the controller, which will extract the expected variables from the request, and send it to be processed by the service, returning the response from the service to the caller.

- **db.js** - This is where you connect to the mysql server by the settings in the .env file.

- **Authorization.js** - This file verifies the access to the user whether he is allowed to reach a particular path.

- **Authenticate.js** - In this file the request to verify the token is made by the jsonwebtoken directory.

#### controllers/

After validating the request, and ensuring this belongs to our API gateway, we send the request to a `controller`, where the variables and parameters are extracted from the request and sent to the relevant `service` for processing. The `controller` handles the response from the `service` and builds the appropriate HTTP response to be sent back to the user.

- **index.js** - load all the controllers that were generated for this project, and export them to be used dynamically by the `openapiRouter.js`. If you would like to customize your controller, it is advised that you link to your controller here, and ensure that the codegen does not rewrite this file.

- **Controller.js** - The core processor of the generated controllers. The generated controllers are designed to be as slim and generic as possible, referencing to the `Controller.js` for the business logic of parsing the needed variables and arguments from the request, and for building the HTTP response which will be sent back. The `Controller.js` is a class with static methods.

- **.js** - auto-generated code, processing all the operations. The Controller is a class that is constructed with the service class it will be sending the request to. Every request defined by the `openapi.yaml` has an operationId. The operationId is the name of the method that will be called. Every method receives the request and response, and calls the `Controller.js` to process the request and response, adding the service method that should be called for the actual business-logic processing.

#### services/

This is where the API Gateway ends, and the unique business-logic of your application kicks in. Every endpoint in the `openapi.yaml` has a variable 'x-openapi-router-service', which is the name of the service class that is generated. The operationID of the endpoint is the name of the method that will be called. The generated code provides a simple promise with a try/catch clause. A successful operation ends with a call to the generic `Service.js` to build a successful response (payload and response code), and a failure will call the generic `Service.js` to build a response with an error object and the relevant response code. It is recommended to have the services be generated automatically once, and after the initial build add methods manually.

- **index.js** - load all the services that were generated for this project, and export them to be used dynamically by the `openapiRouter.js`. If you would like to customize your service, it is advised that you link to your controller here, and ensure that the codegen does not rewrite this file.

- **Service.js** - A utility class, very simple and thin at this point, with two static methods for building a response object for successful and failed results in the service operation. The default response code is 200 for success and 500 for failure. It is recommended to send more accurate response codes and override these defaults when relevant.

- **.js** - auto-generated code, providing a stub Promise for each operationId defined in the `openapi.yaml`. Each method receives the variables that were defined in the `openapi.yaml` file, and wraps a Promise. The Promise will first call to execute the command on the server in the file then resolves both success and failure in a call to the `Service.js` utility class for building the appropriate response that will be sent back to the Controller and then to the caller of this endpoint.

#### models/

Here are all the calls to the server to change add and delete at the request of our user.

- **.js** - This code is built independently without the generator, from this file are the commands to execute on the mysql server.

#### templates/

This folder stores all the templates that the generator uses to create the server in case one of the templates is changed. This will affect the code directly when we run the server build command.

- **.openapi-generator-ignore** - A file that allows you to ignore files in the project when we do not want them to change in the construction ordinance.
  The default is to ignore the following files:
  - package.json