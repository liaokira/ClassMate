// app.js
const express = require('express');
const cors = require('cors');
const yaml = require('js-yaml');
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');
const path = require('path');
const OpenApiValidator = require('express-openapi-validator');

const login = require('./login');
const register = require('./register');
const study_group = require('./study_group');
const profile = require('./profile');
const classes = require('./classes');

// NEW: Import your auth middleware
const { checkAuth } = require('./auth'); 

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));

// load your OpenAPI spec
const apiSpec = path.join(__dirname, '../api/openapi.yaml');
const apidoc = yaml.load(fs.readFileSync(apiSpec, 'utf8'));

app.use('/v0/api-docs', swaggerUi.serve, swaggerUi.setup(apidoc));
app.use(OpenApiValidator.middleware({ 
  apiSpec, 
  validateRequests: true, 
  validateResponses: true 
}));

// ---------- Public Endpoints ----------
app.post('/v0/login', login.login);
app.post('/v0/register', register.register);


app.use(checkAuth);

// ---------- Authenticated Endpoints ----------
app.get('/v0/group/search', study_group.searchGroups);
app.get('/v0/group/:id', study_group.getGroup);
app.post('/v0/group', study_group.createGroup);
app.put('/v0/group/:id', study_group.updateGroup);

app.get('/v0/profile/:id', profile.getProfile);
app.put('/v0/profile/:id', profile.setProfile);

app.get('/v0/profile/:id/classes', classes.getClasses);
app.get('/v0/classes', classes.getAllClasses);
app.post('/v0/profile/:id/classes', classes.addClass);
app.delete('/v0/profile/:id/classes/:classId', classes.removeClass);

// ---------- Error Handling ----------
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    message: err.message,
    errors: err.errors,
    status: err.status,
  });
});

module.exports = app;
