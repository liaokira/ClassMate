const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const secrets = require('./secrets');

const {Pool} = require('pg');
const pool = new Pool({
  host: 'db',
  port: '5432',
  database: 'example',
  user: 'postgres',
  password: 'test',
});

//NO IDEA HOW TO USER AUTHENTICATE
exports.getProfile = async (req, res) => {
  const {id} = req.body;
  const userSelect = `SELECT (bio_data, full_name) FROM member_profiles WHERE id = $1`;
  const userQuery = {
    text: userSelect,
    values: [`${id}`],
  };
  const {rows} = await pool.query(userQuery);
  if (rows.length) {
      res.status(200).json({bio: rows[0].bio_data, full_name: rows[0].full_name});
  }
  else {
    const userSelect2 = `SELECT (id) FROM member WHERE id = $1`;
    const userQuery2 = {
      text: userSelect2,
      values: [`${id}`],
    };
    const {rows2} = await pool.query(userQuery2);
    if (rows2.length){
      res.status(200).json({bio: '', full_name: ''});
    }
    else{
      res.status(401).send('Invalid credentials');
    }
  }
};

exports.check = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader.split(' ')[1];
  jwt.verify(token, secrets.accessToken, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }
    req.user = user;
    next();
  });
};