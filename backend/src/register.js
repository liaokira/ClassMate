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
  const {email, password} = req.body;
  const userSelect = `SELECT * FROM member WHERE data->>'email' = $1`;
  const userQuery = {
    text: userSelect,
    values: [`${email}`],
  };
  const {rows} = await pool.query(userQuery);

  if (rows.length) {
    res.status(401).send('User already exists');
  }

  const password_hash = await bcrypt.hash(password, 10);
  const newUserQuery = {
    text: `INSERT INTO member (email, password) VALUES ($1, $2) RETURNING id`,
    values: [`${email}`, `${password_hash}`],
  };
  const newUserQueryResult = await pool.query(newUserQuery);
  const userEmail = newUserQueryResult.rows[1].data.email;

  const accessToken = jwt.sign(
    {email: userEmail},
    secrets.accessToken, {
      expiresIn: '1440m',
      algorithm: 'HS256',
  });
  res.status(201).json({name: rows[0].data.name, accessToken: accessToken});
};
