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
const friends = require('./friends');

const { checkAuth } = require('./auth'); 

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));

const apiSpec = path.join(__dirname, '../api/openapi.yaml');
const apidoc = yaml.load(fs.readFileSync(apiSpec, 'utf8'));

app.use(
  '/v0/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(apidoc),
);

app.use(
  OpenApiValidator.middleware({
    apiSpec: apiSpec,
    validateRequests: true,
    validateResponses: true,
  }),
);

/* 
Endpoints for registering and logging in
(sprint 1)
*/

// ---------- Public Endpoints ----------
app.post('/v0/login', login.login);
app.post('/v0/register', register.register);

app.get('/v0/profile/:id', auth.checkAuth, profile.getProfile);
app.put('/v0/profile/:id', auth.checkAuth, profile.setProfile);

app.get('/v0/profile/:id/classes', auth.checkAuth, classes.getClasses);
app.get('/v0/classes', auth.checkAuth, classes.getAllClasses);
app.post('/v0/profile/:id/classes', auth.checkAuth, classes.addClass);
app.delete('/v0/profile/:id/classes/:classId', auth.checkAuth, classes.removeClass);

app.get('/v0/users/searchFriend', auth.checkAuth, friends.searchFriend);
app.get('/v0/users/search', auth.checkAuth, friends.searchUser);
app.put('/v0/users/addFriend', auth.checkAuth, friends.addFriend);
app.get('/v0/users/getFriends', auth.checkAuth, friends.getFriends);

/*
Endpoints for study groups
(sprint 2 / 3)
*/
app.get('/v0/group/search', auth.checkAuth, study_group.searchGroups); // define /search before /{id} in order to prioritize matching by search query, then by UUID
app.get('/v0/group/:id', auth.checkAuth, study_group.getGroup);
app.post('/v0/group', auth.checkAuth, study_group.createGroup);
app.put('/v0/group/:id', auth.checkAuth, study_group.updateGroup);
app.post('/v0/group/:id/join', auth.checkAuth, study_group.joinGroup);
app.delete('/v0/group/:id/leave', auth.checkAuth, study_group.leaveGroup);

app.get('/v0/messages/:id/', auth.checkAuth, study_group.getMessages);

// ---------- Error Handling ----------
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    message: err.message,
    errors: err.errors,
    status: err.status,
  });
});

module.exports = app;
