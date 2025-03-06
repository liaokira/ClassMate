const multer = require("multer");

const {Pool} = require('pg');
const pool = new Pool({
  host: 'db',
  port: '5432',
  database: 'example',
  user: 'postgres',
  password: 'test',
});

exports.uploadNewImage = async (req, res) =>  {
    const path = req.path;
    const id = req.params.id;
    // assume perfect data
    const buffer = req.files[0].buffer;
    const mimetype = req.files[0].mimetype;
    const query = "INSERT INTO images (file_data, mimetype) VALUES ($1, $2) RETURNING id";
    const {rows} = await pool.query(query, [buffer, mimetype]);
    if(rows.length){
        const image_id = rows[0].id;
        // This is a profile pic
        if(path.includes('profile')){
            const profile_query = "UPDATE member_profiles SET profile_pic_id = $1 WHERE id = $2 RETURNING id";
            const {rows: profile_rows} = await pool.query(profile_query, [image_id, id]);
            if (profile_rows.length){
                res.status(200).send("member profile image updated");
            }
            else{
                res.status(404).send("No member profile found");
            }
        }
        else if (path.includes('group')){
            const group_query = "UPDATE study_groups SET group_pic_id = $1 WHERE id = $2 RETURNING id";
            const {rows: group_rows} = await pool.query(group_query, [image_id, id]);
            if (group_rows.length){
                res.status(200).send("group image updated");
            }
            else{
                res.status(404).send("No group found");
            }
        }
        else{
            res.status(500).send("Invalid path");
        }
    }
    else{
        res.status(500).send('Image Insertion Failed');
    }
};

exports.getImage = async (req, res) =>  {
    const path = req.path;
    const id = req.params.id;
    image_id = null;
    if(path.includes('profile')){
        const profile_query = "SELECT profile_pic_id FROM member_profiles WHERE id = $1";
        const {rows: profile_rows} = await pool.query(profile_query, [id]);
        if (profile_rows.length){
            image_id = profile_rows[0].profile_pic_id;
        }
        else{
            res.status(404).send("No member profile found");
        }
    }
    else if (path.includes('group')){
        const group_query = "SELECT group_pic_id FROM study_groups WHERE id = $1";
        const {rows: group_rows} = await pool.query(group_query, [id]);
        if (group_rows.length){
            image_id = group_rows[0].group_pic_id;
        }
        else{
            res.status(404).send("No member profile found");
        }
    }
    else{
        res.status(500).send("Invalid path");
    }
    if (image_id === null){
        res.status(404).send("No image for this user exists");
    }
    const query = "SELECT file_data, mimetype FROM images WHERE id = $1";
    const result = await pool.query(query, [image_id]);

    if (result.rows.length === 0) {
        return res.status(404).json({ error: "Image not found" });
    }

    const {file_data, mimetype } = result.rows[0];
    res.status(200);
    res.setHeader("Content-Type", mimetype);
    res.send(file_data);
}
