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

// POST /v0/profile/:id/classes
exports.addClass = async (req, res, next) => {
  const userId = req.params.id;
  const { class_name } = req.body; 

  if (!class_name) {
    return res.status(400).json({ error: 'class_name is required' });
  }

  try {
    const normalizedClassName = class_name.toLowerCase().trim();

    const selectQuery = 'SELECT * FROM classes WHERE class_name = $1';
    let result = await pool.query(selectQuery, [normalizedClassName]);
    let classRecord;

    if (result.rows.length > 0) {
      classRecord = result.rows[0];
    } else {
      const insertQuery = 'INSERT INTO classes (class_name) VALUES ($1) RETURNING *';
      result = await pool.query(insertQuery, [normalizedClassName]);
      classRecord = result.rows[0];
    }

    const joinQuery = `
      INSERT INTO member_classes (member_id, class_id)
      VALUES ($1, $2)
      ON CONFLICT DO NOTHING
      RETURNING *
    `;
    await pool.query(joinQuery, [userId, classRecord.id]);

    res.status(201).json(classRecord);
  } catch (error) {
    console.error('Error in addClass:', error);
    next(error);
  }
};


// GET /v0/profile/:id/classes
exports.getClasses = async(req, res, next) => {
  const userId = req.params.id;
  try {
    const query = `
      SELECT c.id, c.class_name
      FROM classes c
      INNER JOIN member_classes mc ON c.id = mc.class_id
      WHERE mc.member_id = $1
    `;
    const result = await pool.query(query, [userId]);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error in getClasses:', error);
    next(error);
  }
};

// DELETE /v0/profile/:id/classes/:classId
exports.removeClass = async(req, res, next) => {
  const userId = req.params.id;
  const { classId } = req.params;
  try {
    const deleteQuery = 'DELETE FROM member_classes WHERE member_id = $1 AND class_id = $2 RETURNING *';
    const result = await pool.query(deleteQuery, [userId, classId]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Association not found' });
    }
    res.status(200).json({ message: 'Class removed successfully' });
  } catch (error) {
    console.error('Error in removeClass:', error);
    next(error);
  }
};

