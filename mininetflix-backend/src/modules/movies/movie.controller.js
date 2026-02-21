const { readDb } = require("../../config/db");
const AWS = require("aws-sdk");

const s3 = new AWS.S3({ region: process.env.AWS_REGION });

exports.getMovies = (req, res) => {
  readDb.query("SELECT * FROM movies", (err, results) => {
    res.json(results);
  });
};

exports.streamMovie = (req, res) => {
  readDb.query(
    "SELECT video_key FROM movies WHERE id=?",
    [req.params.id],
    (err, results) => {
      const url = s3.getSignedUrl("getObject", {
        Bucket: process.env.S3_BUCKET,
        Key: results[0].video_key,
        Expires: 300
      });
      res.json({ url });
    }
  );
};