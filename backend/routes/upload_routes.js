const express = require("express");
const router = express.Router();
const upload = require("../upload"); //import multer instance from upload.js
const db = require("../database/db");

router.post("/upload-resume", upload.single("resume"), (req, res) => {
  try {
    const { filename: FILENAME, path: FILEPATH } = req.file;
    console.log("Filename :", req.file.filename);
    console.log("Filepath :", req.file.path);

    const sql = "INSERT INTO  resume(FILENAME , FILEPATH) VALUES (? , ?)";
    db.query(sql, [FILENAME, FILEPATH], (err, result) => {
      if (err) throw err;

      res.status(200).json({
        message: "Resume uploaded and saved in DB!",
        filepath: FILEPATH,
      });
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
module.exports = router;
