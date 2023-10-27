	The project focuses on developing a web application for unlogged user, logged user and admin logged user with key features including:
	- authentication
	- events
	- competitions feedback
	- interaction
	Admin user have extended permissions for content management.

How to install and run:
1. Extract files

2.run command in terminal: npm install (install all dependencies used in project)

3.Create and configure .env in back-end:
NODE_ENV=development
APP_NAME
PORT
CLIENT_URL
DATA_BASE
DATABASE_LOCAL
JWT_SECRET
SENDGRID_API_KEY
EMAIL_TO
EMAIL_FROM
JWT_RESET_PASSWORD
JWT_ACCOUNT_ACTIVATION

3.Create and configure next.config.js in front-end:
module.exports = {
  publicRuntimeConfig: {
    APP_NAME: '',
    API_DEVELOPMENT: '',
    API_PRODUCTION: '',
    PRODUCTION: ,
    DOMAIN_DEVELOPMENT: '',
    DOMAIN_PRODUCTION: '',
    FB_APP_ID: '',
    DISQUS_SHORTNAME: '',
  },
};

5.Run front-end and back-end in separated terminals:
front:npm start
back:npm run dev

Enjoy!