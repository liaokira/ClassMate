const { Pool } = require('pg');

const pool = new Pool({
  host: 'db',
  port: '5432',
  database: 'example',
  user: 'postgres',
  password: 'test',
});

exports.getProfile = async (req, res) => {
  const userId = req.query.userId;
  try {
    const query = `
      SELECT m.name, mp.bio_data, array_agg(c.class_name) AS classes
      FROM member m
      LEFT JOIN member_profiles mp ON m.id = mp.id
      LEFT JOIN member_classes mc ON m.id = mc.member_id
      LEFT JOIN classes c ON mc.class_id = c.id
      WHERE m.id = $1
      GROUP BY m.name, mp.bio_data
    `;

    const { rows } = await pool.query(query, [userId]);
    if (rows.length) {
      return res.status(200).json(rows[0]);
    } else {
      return res.status(404).send('Profile not found');
    }
  } catch (err) {
    console.error(err);
    return res.status(500).send('Server error');
  }
};
