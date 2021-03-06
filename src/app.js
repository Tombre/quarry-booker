'use strict';

const path = require('path');
const serveStatic = require('feathers').static;
const favicon = require('serve-favicon');
const compress = require('compression');
const cors = require('cors');
const feathers = require('feathers');
const configuration = require('feathers-configuration');
const hooks = require('feathers-hooks');
const rest = require('feathers-rest');
const bodyParser = require('body-parser');
const nunjucks = require('nunjucks');

const middleware = require('./middleware');
const services = require('./services');

const app = feathers();

nunjucks.configure(path.join(__dirname, 'views'), {
    autoescape: true,
    express: app
});

app.configure(configuration(path.join(__dirname, '..')));

app.use(compress())
	.options('*', cors())
	.use(cors())
	// .use(favicon( path.join(app.get('public'), 'favicon.ico') ))
	.use('/assets', serveStatic( app.get('public') ))
	.use(bodyParser.json())
	.use(bodyParser.urlencoded({ extended: true }))
	.configure(hooks())
	.configure(rest())
	.configure(services)
	.configure(middleware);

module.exports = app;
