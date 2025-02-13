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


exports.getProfile = async (req, res) => {
  const id = req.params.id;
  const userSelect = `SELECT * FROM member_profiles WHERE id = $1`;
  const userQuery = {
    text: userSelect,
    values: [`${id}`],
  };
  const {rows} = await pool.query(userQuery);
  if (rows.length) {
    console.log("rows", rows);
    console.log("bio data", rows[0].bio_data);
    console.log("name data", rows[0].full_name);
    res.status(200).json({id: id, bio: rows[0].bio_data, full_name: rows[0].full_name});
  }
  else {
    const userSelect2 = `SELECT id FROM member WHERE id = $1`;
    const userQuery2 = {
      text: userSelect2,
      values: [`${id}`],
    };
    const {rows2} = await pool.query(userQuery2);
    if (rows2 && rows2.length){
      res.status(200).json({id: id, bio: '', full_name: ''});
    }
    else{
      res.status(404).send('Error: No Profile for user found');
    }
  }
};

exports.setProfile = async (req, res) => {
  const {id, full_name, bio} = req.body;
  const userINSERT = `INSERT INTO member_profiles(id, bio_data, full_name) 
                      VALUES ($1, $2, $3) 
                      ON CONFLICT (id) DO UPDATE SET 
                        bio_data = EXCLUDED.bio_data,
                        full_name = EXCLUDED.full_name
                      RETURNING id, bio_data, full_name`;
  const userQuery = {
    text: userINSERT,
    values: [`${id}`, `${bio}`, `${full_name}`],
  };
  const {rows} = await pool.query(userQuery);
  if (rows.length) {
    if(rows[0].xmax === 0){
      res.status(200).json({id});
    }
    else{
      res.status(201).json({id});
    }
      console.log("id", rows[0].id);

      console.log("bio data", rows[0].bio_data);
      console.log("name data", rows[0].full_name);
  }
  else {
    res.status(404).send('Error: No Profile for User Found');
  }
};

