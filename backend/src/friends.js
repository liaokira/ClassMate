// friends.js

const { Pool } = require('pg');
const pool = new Pool({
  host: 'db',
  port: '5432',
  database: 'example',
  user: 'postgres',
  password: 'test',
});

// --------------------
// GET /v0/users/searchFriend?userId=XYZ&email=ABC
// --------------------
exports.searchFriend = async (req, res) => {
  try {
    const userId = req.query.userId;
    const email = decodeURIComponent(req.query.email);
    if (!userId || !email) {
      return res.status(400).json({ error: `Missing userId or email`, });
    }

    const userSelect = `
      SELECT id, data->>'email' AS email, data->>'name' AS full_name
      FROM member
      WHERE data->>'email' = $1
    `;
    const { rows } = await pool.query(userSelect, [email]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'No user with that email' });
    }

    const friendId = rows[0].id;
    const sorted = [userId, friendId].sort();

    if (sorted[0] === sorted[1]) {
      return res.status(405).json({ error: 'Cannot friend yourself' });
    }

    const friendCheckQuery = `
      SELECT 1
      FROM member_friends
      WHERE member_id = $1
        AND friend_id = $2
    `;
    const friendCheck = await pool.query(friendCheckQuery, [sorted[0], sorted[1]]);
    if (friendCheck.rowCount > 0) {
      return res.status(200).json({
        id: rows[0].id,
        full_name: rows[0].full_name,
        email: rows[0].email
      });
    } else {
      return res.status(404).json({ error: 'Not a friend yet' });
    }
  } catch (err) {
    console.error('Error in searchFriend:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};

// --------------------
// GET /v0/users/search?email=ABC
// --------------------
exports.searchUser = async (req, res) => {
  try {
    const email = decodeURIComponent(req.query.email);
    if (!email) {
      return res.status(400).json({ error: 'Missing email' });
    }

    const userSelect = `
      SELECT id, data->>'email' AS email, data->>'name' AS full_name
      FROM member
      WHERE data->>'email' = $1
    `;
    const { rows } = await pool.query(userSelect, [email]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json({
      user: {
        id: rows[0].id,
        full_name: rows[0].full_name,
        email: rows[0].email
      }
    });
  } catch (err) {
    console.error('Error in searchUser:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};

// --------------------
// PUT /v0/users/addFriend
// Body: { userId, id, full_name, email }
// --------------------
exports.addFriend = async (req, res) => {
  try {
    const { userId, id } = req.body;
    if (!userId || !id) {
      return res.status(400).json({ error: 'Missing userId or friend id' });
    }

    const checkQuery = `
      SELECT id
      FROM member
      WHERE id = $1 OR id = $2
    `;
    const checkResult = await pool.query(checkQuery, [userId, id]);
    if (checkResult.rowCount < 2) {
      return res.status(404).json({ error: 'One or both users do not exist' });
    }

    const sorted = [userId, id].sort();
    if (sorted[0] === sorted[1]) {
      return res.status(400).json({ error: 'Cannot friend yourself' });
    }

    const insertQuery = `
      INSERT INTO member_friends (member_id, friend_id)
      VALUES ($1, $2)
      ON CONFLICT DO NOTHING
      RETURNING *
    `;
    const result = await pool.query(insertQuery, [sorted[0], sorted[1]]);

    if (result.rowCount === 0) {
      return res.status(409).json({ error: 'Already friends' });
    }

    return res.status(201).json({ message: 'Friend added successfully' });

  } catch (err) {
    console.error('Error in addFriend:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};

// --------------------
// GET /v0/users/getFriends?userID=XYZ
// --------------------
exports.getFriends = async (req, res) => {
  try {
    const userId = req.query.userId;
    if (!userId) {
      return res.status(400).json({ error: 'Missing userId'});
    }

    const friendsQuery = `
      SELECT
        friends.friend_id AS id,
        member.data->>'name' AS full_name,
        member.data->>'email' AS email
      FROM (
        SELECT
          CASE 
            WHEN member_id = $1 THEN friend_id
            ELSE member_id 
          END AS friend_id
        FROM member_friends
        WHERE member_id = $1 OR friend_id = $1
      ) AS friends
      JOIN member ON member.id = friends.friend_id;
    `;

    const { rows } = await pool.query(friendsQuery, [userId]);

    return res.status(200).json({ friends: rows });
  } catch (err) {
    console.error('Error in getFriends:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};

exports.getMessages = async (req, res) => {
  const id = req.params.id;
  const recepientId = req.params.recepientId;
  const groupSearchQuery = {
    text:`SELECT sender_id, sender_name, recepient_id, message, timestamp FROM dm_messages 
          WHERE (sender_id = $1 AND recepient_id = $2) OR (recepient_id = $1 AND sender_id = $2)
          ORDER BY timestamp DESC`,
    values: [`${id}`, `${recepientId}`],
  };
  const {rows} = await pool.query(groupSearchQuery);
  if (rows.length) {
    res.status(200).send(rows);
  }
  else {
    res.status(404).send("No Messages found");
  }
};
