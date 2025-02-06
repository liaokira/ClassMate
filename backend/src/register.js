const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secrets = require('./secrets');

const pool = new Pool({
  host: 'db',
  port: '5432',
  database: 'example',
  user: 'postgres',
  password: 'test',
});

exports.register = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Check if user already exists
    const userSelect = 'SELECT id FROM member WHERE email = $1';
    const { rows } = await pool.query(userSelect, [email]);
    if (rows.length > 0) {
      return res.status(400).send('User already exists');
    }

    // Hash the password
    const passwordHash = await bcrypt.hash(password, 10);

    // Insert the new user
    const newUserQuery = {
      text: 'INSERT INTO member (email, password, name) VALUES ($1, $2, $3) RETURNING id',
      values: [email, passwordHash, name],
    };
    const newUserResult = await pool.query(newUserQuery);

    // Create a JWT token for the newly registered user
    const accessToken = jwt.sign({ email }, secrets.accessToken, {
      expiresIn: '1440m',
      algorithm: 'HS256',
    });

    return res.status(201).json({ 
      name: newUserResult.rows[0].id, 
      accessToken 
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send('Server error');
  }
};
