const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { Pool } = require('pg');
const secrets = require('./secrets');

// Configure your DB connection here
const pool = new Pool({
  host: 'db',
  port: '5432',
  database: 'example',
  user: 'postgres',
  password: 'test',
});

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const userSelect = 'SELECT * FROM member WHERE email = $1';
    const { rows } = await pool.query(userSelect, [email]);
    if (rows.length === 0) {
      return res.status(401).send('Invalid credentials');
    }

    const user = rows[0];

    // Compare the plain-text password with the hashed password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).send('Invalid credentials');
    }

    // Create a JWT
    const accessToken = jwt.sign(
      { email: user.email },
      secrets.accessToken,
      {
        expiresIn: '300m',
        algorithm: 'HS256'
      }
    );

    return res.status(200).json({ 
      name: user.name, 
      accessToken 
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send('Server error');
  }
};

// Optional middleware to verify tokens
exports.check = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.sendStatus(401);
  }

  const token = authHeader.split(' ')[1];
  jwt.verify(token, secrets.accessToken, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }
    req.user = user;
    next();
  });
};
