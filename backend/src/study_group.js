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

exports.getGroup = async (req, res) => {
  console.log("getGroup");
  const id = req.params.id;
  const groupSelect = `SELECT * FROM study_groups WHERE id = $1`;
  const groupQuery = {
    text: groupSelect,
    values: [`${id}`],
  };
  const {rows} = await pool.query(groupQuery);
  if (rows.length) {
    console.log("group name:", rows[0].group_name);
    res.status(200).json({id: id, group_name: rows[0].group_name});
  }
  else {
    const groupSelect2 = `SELECT id FROM study_groups WHERE id = $1`;
    const groupQuery2 = {
      text: groupSelect2,
      values: [`${id}`],
    };
    const {rows2} = await pool.query(groupQuery2);
    if (rows2.length){
      res.status(200).json({id: id, group_name: ''});
    }
    else {
      res.status(404).send('No study group found');
    }
  }
};

// may need to add checks if group with already existing name exists>
exports.createGroup = async (req, res) => {
  const {group_name} = req.body;
  const groupInsert = `INSERT INTO study_groups(group_name) VALUES ($1) RETURNING id`;
  const groupQuery = {
      text: groupInsert,
      values: [`${group_name}`],
  };
  const {rows} = await pool.query(groupQuery);
  if (rows.length) {
    res.status(201).json({id: rows[0].id});
  }
};

exports.updateGroup = async (req, res) => {
  const id = req.params.id;
  const {group_name} = req.body;
  const groupSelect = `SELECT * FROM study_groups WHERE id = $1`;
  const groupQuery = {
    text: groupSelect,
    values: [`${id}`],
  };
  const {rows} = await pool.query(groupQuery);
  if (rows.length) {
    const updateGroup = `UPDATE study_groups SET group_name = $1 WHERE id = $2 RETURNING id`;
    const updateQuery = {
      text: updateGroup,
      values: [`${group_name}`, `${id}`],
    };
    const rows2 = await pool.query(updateQuery);
    console.log(rows2);
    res.status(200).send();
  }
  else {
    res.status(404).send('No study group found');
  }
};

exports.searchGroups = async (req, res) => {
  console.log("correct");
  const searchFor = req.query.searchFor;
  const groupSearchSelect = `SELECT * FROM study_groups WHERE group_name ILIKE $1`;
  const groupSearchQuery = {
    text: groupSearchSelect,
    values: [`%${searchFor}%`],
  };
  const {rows} = await pool.query(groupSearchQuery);
  if (rows.length) {
    res.status(200).send(rows);
  }
  else {
    res.status(404).send();
  }
};
