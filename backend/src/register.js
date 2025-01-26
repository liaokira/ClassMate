const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const secrets = require('./secrets');

const {Pool} = require('pg');
const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: process.env.POSTGRES_DB,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
});

exports.register = async (req, res) => {
  const {email, password} = req.body;
  const userSelect = `SELECT * FROM user WHERE data->>'email' = $1`;
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
  res.status(200).json({name: rows[0].data.name, accessToken: accessToken});
};
