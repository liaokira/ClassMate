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
    const membersSelect = `
      SELECT member.id, member_profiles.full_name
      FROM group_members
      JOIN member_profiles ON group_members.user_id = member_profiles.id
      JOIN member ON group_members.user_id = member.id
      WHERE group_members.group_id = $1
    `;
    const membersQuery = {
      text: membersSelect,
      values: [`${id}`]
    };
    const {rows: members} = await pool.query(membersQuery);
    console.log("group name:", rows[0].group_name);
    res.status(200).json({id: id, group_name: rows[0].group_name, members: members.map(member => ({id: member.member_id, name: member.full_name}))});
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

exports.getMessages = async (req, res) => {
  const group_id = req.params.id;
  const groupSearchQuery = {
    text: `SELECT sender_id, group_id, message FROM messages WHERE group_id = $1 ORDER BY timestamp DESC`,
    values: [`${group_id}`],
  };
  const {rows} = await pool.query(groupSearchQuery);
  console.log(rows);
  if (rows.length) {
    res.status(200).send(rows);
  }
  else {
    res.status(404).send();
  }
};

exports.joinGroup = async (req, res) => {
  const group_id = req.params.id;
  const {member_id} = req.body;

  const memberCheckQuery = {
    text: `SELECT id FROM member WHERE id = $1`,
    values: [`${member_id}`],
  };
  const {rows: userRows} = await pool.query(memberCheckQuery);
  if (!userRows.length) {
    return res.status(404).send();
  }

  const groupCheckQuery = {
    text: `SELECT id FROM study_groups WHERE id = $1`,
    values: [`${group_id}`],
  };
  const {rows: groupRows} = await pool.query(groupCheckQuery);
  if (!groupRows.length) {
    return res.status(404).send();
  }

  const membershipCheckQuery = {
    text: 'SELECT * FROM group_members WHERE user_id = $1 AND group_id = $2',
    values: [`${userId}`, `${groupId}`],
  };
  const {rows: membershipRows} = await pool.query(membershipCheckQuery);
  if (membershipRows.length) {
    return res.status(400).send();
  }

  const addQuery = {
    text: `INSERT INTO group_members (user_id, group_id) VALUES ($1, $2)`,
    values: [`${userId}`, `${group_id}`],
  };
  await pool.query(addQuery);
  res.status(200).send();
};
