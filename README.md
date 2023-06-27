# Up-Monitor
![GitHub contributors](https://img.shields.io/github/contributors/AbdullahAlabd/Up-Monitor)


A URL monitoring service built with NodeJs and MongoDB.

That provides the user with API add URL checks, view statistical reports of the URL availability and be notified once the URL is down or up again.


## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

To be able to run the project on your system you should have:
 - [Node 18.16.1+](https://nodejs.org/en) - A cross-platform JavaScript runtime environment.
 - [MongoDB 6.0+](https://www.mongodb.com/docs/manual/administration/install-community) - A cross-platform document-oriented database program.
 - [Git](https://git-scm.com/downloads) - A free and open-source distributed version control system.

### Installation
To install the project on your system first open the terminal, then follow the given steps and execute the commands on your terminal.

 1. Clone the project from GitHub:
 ``` git clone https://github.com/AbdullahAlabd/Up-Monitor```
 2. Switch to the project's directory:
 ```cd Up-Monitor/``` 
 3. Install the required packages from *"package.json"*:
 ```npm install```
 4. Take a copy of config.env.example file and name it config.env or by running: 
```cp ./src/configs/config.env.example ./src/configs/config.env```
 5. to be able to send actual emails you can use Twilio SendGrid [free plan](https://sendgrid.com/pricing/) Find a step-by-step integration guide [here](https://www.twilio.com/blog/send-smtp-emails-node-js-sendgrid)
 6. update your credentials in config.env.
 7. Finally run the app on localhost: ```node app.js``` or using Nodemon for easier development ```npm run dev```

## Documentation
View the full API documentation:
[![Run in Postman](https://run.pstmn.io/button.svg)](https://god.gw.postman.com/run-collection/5901918-7b50badc-62e6-4cfc-9e38-6794d4824277?action=collection%2Ffork&source=rip_markdown&collection-url=entityId%3D5901918-7b50badc-62e6-4cfc-9e38-6794d4824277%26entityType%3Dcollection%26workspaceId%3D894a70f4-165e-46ac-b8a3-eb3fae565cde)


## Author
* **Abdullah Alabd** - *Initial work* - [Abdullahalabd](https://github.com/Abdullahalabd)

See also the list of [contributors](https://github.com/AbdullahAlabd/Up-Monitor/graphs/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
