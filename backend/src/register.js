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

exports.register = async (req, res) => {
  const {email, password, name} = req.body;
  const userSelect = `SELECT * FROM member WHERE data->>'email' = $1`;
  const userQuery = {
    text: userSelect,
    values: [`${email}`],
  };
  const {rows} = await pool.query(userQuery);

  if (rows.length) {
    res.status(401).send('User already exists');
    return;
  }

  const password_hash = await bcrypt.hash(password, 10);
  const userData = {
    email: email,
    password: password_hash,
    name: name
  };
  const newUserQuery = {
    text: `INSERT INTO member (data) VALUES ($1) RETURNING id`,
    values: [userData],
  };
  const newUserQueryResult = await pool.query(newUserQuery);

  const accessToken = jwt.sign(
    {email: email},
    secrets.accessToken, {
      expiresIn: '1440m',
      algorithm: 'HS256',
  });
  res.status(201).json({name: newUserQueryResult.rows[0].id, accessToken: accessToken});
};
