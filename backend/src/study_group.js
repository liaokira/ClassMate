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

exports.discoverGroups = async (req, res) => {
  const user_id = req.user.id;
  console.log(user_id);
  const groupSelect = `
    SELECT id, group_name, group_description, color, associated_class
    FROM group_members
    INNER JOIN study_groups ON group_members.group_id = study_groups.id AND NOT user_id = $1
  `;
  const groupQuery = {
    text: groupSelect,
    values: [user_id],
  };
  const {rows} = await pool.query(groupQuery);
  res.status(200).send(rows);
}

exports.getAllGroups = async (req, res) => {
  const groupSelect = `SELECT * FROM study_groups`;
  const groupQuery = {
    text: groupSelect,
    values: [],
  };
  const {rows} = await pool.query(groupQuery);
  res.status(200).send(rows);
};

exports.getGroup = async (req, res) => {
  const id = req.params.id;
  const groupSelect = `SELECT * FROM study_groups WHERE id = $1`;
  const groupQuery = {
    text: groupSelect,
    values: [`${id}`],
  };
  const {rows} = await pool.query(groupQuery);
  if (rows.length) {
    const members = await getMembers(id);
    console.log(members);
    console.log("group name:", rows[0].group_name);
    res.status(200).json({id: id, group_name: rows[0].group_name, group_description: rows[0].group_description, color: rows[0].color, associated_class: rows[0].associated_class, members: members.map(member => ({id: member.user_id, name: member.full_name}))});
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
  const {group_name, group_description, color, associated_class} = req.body;
  const groupInsert = `INSERT INTO study_groups(group_name, group_description, color, associated_class) VALUES ($1, $2, $3, $4) RETURNING id`;
  const groupQuery = {
      text: groupInsert,
      values: [`${group_name}`, `${group_description ? group_description : "Add a group description..."}`, `${color}`, `${associated_class.toLowerCase().trim().replace(/[\s-]/g, '')}`],
  };
  const {rows} = await pool.query(groupQuery);
  if (rows.length) {
    const user_id = req.user.id;
    const addQuery = {
      text: `INSERT INTO group_members (user_id, group_id) VALUES ($1, $2)`,
      values: [`${user_id}`, `${rows[0].id}`],
    };
    await pool.query(addQuery);
    res.status(201).json({id: rows[0].id});
  }
};

exports.updateGroup = async (req, res) => {
  const id = req.params.id;
  const {group_name, group_description, color, associated_class} = req.body;
  const groupSelect = `SELECT * FROM study_groups WHERE id = $1`;
  const groupQuery = {
    text: groupSelect,
    values: [`${id}`],
  };
  const {rows} = await pool.query(groupQuery);
  if (rows.length) {
    // const updateGroup = `UPDATE study_groups SET group_name = $1, group_description = $2 WHERE id = $3 RETURNING id`;
    // const updateQuery = {
    //   text: updateGroup,
    //   values: [`${group_name}`, `${group_description}`, `${id}`],
    // };
    let updateGroup = `UPDATE study_groups SET `;
    let query_values = [];
    let value_index = 1;

    if (group_name) {
      updateGroup += `group_name = $${value_index}, `;
      query_values.push(group_name);
      value_index++;
    }

    if (group_description) {
      updateGroup += `group_description = $${value_index}, `;
      query_values.push(group_description);
      value_index++;
    }

    if (color) {
      updateGroup += `color = $${value_index}, `;
      query_values.push(color);
      value_index++;
    }

    if (associated_class) {
      updateGroup += `associated_class = $${value_index}, `;
      query_values.push(associated_class);
      value_index++;
    }
    
    /*
    if no new values have been detected, then exit early.
    this is only here to demonstrate it in tests.
    see below.

    NOTE TO FRONTEND:
    disable confirming updates if no new values have been entered into the textboxes.
    you can either disable the button or just return to previous page when it is clicked.
    */ 
    if (value_index == 1) {
      return res.status(200).send();
    }

    updateGroup = updateGroup.slice(0, -2);
    updateGroup += ` WHERE id = $${value_index}`;
    query_values.push(id);
    const updateQuery = {
      text: updateGroup,
      values: query_values,
    };
    await pool.query(updateQuery);
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
    text: `SELECT sender_id, sender_name, group_id, message FROM messages WHERE group_id = $1 ORDER BY timestamp DESC`,
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

const getMembers = async (group_id) => {
  // SELECT group_members.user_id, member_profiles.full_name
  const getMembersSelect = `
    SELECT user_id, full_name
    FROM group_members
    INNER JOIN member_profiles ON group_members.user_id = member_profiles.id AND group_members.group_id = $1
  `;
  // const getMembersSelect = `SELECT user_id FROM group_members WHERE group_id = $1`;
  const getMembersQuery = {
    text: getMembersSelect,
    values: [group_id],
    // values: [],
  };
  const {rows: members} = await pool.query(getMembersQuery);
  return members;
};

/*
NOT IN USE
*/
exports.getMembers = async (req, res) => {
  const id = req.params.id;
  const groupSelect = `SELECT * FROM study_groups WHERE id = $1`;
  const groupQuery = {
    text: groupSelect,
    values: [`${id}`],
  };
  const {rows} = await pool.query(groupQuery);
  if (rows.length) {
    const members = await getMembers(id);
    console.log(members);
    res.status(200).json({members: members.map(member => ({id: member.user_id, name: member.full_name}))});
  }
};

// checks if a given user is in a requested group
/*
returns:
  0 if user is a member of the requested group
  1 if user does not exist
  2 if group does not exist
  3 if user is not a member of the requested group
*/
const checkMembership = async (member_id, group_id) => {
  const memberCheckQuery = {
    text: `SELECT id FROM member WHERE id = $1`,
    values: [`${member_id}`],
  };
  const {rows: userRows} = await pool.query(memberCheckQuery);
  if (!userRows.length) {
    console.log("user not found");
    return 1;
  }

  const groupCheckQuery = {
    text: `SELECT id FROM study_groups WHERE id = $1`,
    values: [`${group_id}`],
  };
  const {rows: groupRows} = await pool.query(groupCheckQuery);
  if (!groupRows.length) {
    console.log("study group not found");
    return 2;
  }

  const membershipCheckQuery = {
    text: 'SELECT * FROM group_members WHERE user_id = $1 AND group_id = $2',
    values: [`${member_id}`, `${group_id}`],
  };
  const {rows: membershipRows} = await pool.query(membershipCheckQuery);
  if (!membershipRows.length) {
    console.log("user not in study group");
    return 3;
  }
  console.log("user in study group");
  return 0;
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
    values: [`${member_id}`, `${group_id}`],
  };
  const {rows: membershipRows} = await pool.query(membershipCheckQuery);
  if (membershipRows.length) {
    return res.status(400).send();
  }

  const addQuery = {
    text: `INSERT INTO group_members (user_id, group_id) VALUES ($1, $2)`,
    values: [`${member_id}`, `${group_id}`],
  };
  await pool.query(addQuery);
  res.status(200).send();
};

exports.leaveGroup = async (req, res) => {
  const group_id = req.params.id;
  const {member_id} = req.body;

  const membership = await checkMembership(member_id, group_id);
  switch (membership) {
    case 0:
      const leaveGroupQuery = {
        text: `DELETE FROM group_members WHERE user_id = $1 and group_id = $2`,
        values: [member_id, group_id],
      };
      await pool.query(leaveGroupQuery);
      return res.status(200).send();
      // break;
    case 1:
      return res.status(404).send("User not found");
      // break;
    case 2:
      return res.status(404).send("Study group not found");
      // break;
    case 3:
      return res.status(403).send("User is not a member of the study group");
      // break;
  }
};
