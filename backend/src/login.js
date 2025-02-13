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

exports.login = async (req, res) => {
  const {email, password} = req.body;
  const userSelect = `SELECT * FROM member WHERE data->>'email' = $1`;
  const userQuery = {
    text: userSelect,
    values: [`${email}`],
  };
  const {rows} = await pool.query(userQuery);
  if (rows.length) {
    if (bcrypt.compareSync(password, rows[0].data.password)) {
      const accessToken = jwt.sign(
        {email: rows[0].data.email},
        secrets.accessToken, {
          expiresIn: '300m',
          algorithm: 'HS256',
        });
      res.status(200).json({name: rows[0].id, accessToken: accessToken});
    } else {
      res.status(401).send('Invalid credentials');
    }
  } else {
    res.status(401).send('Invalid credentials');
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
