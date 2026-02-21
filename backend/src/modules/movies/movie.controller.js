const { readDb } = require("../../config/db");
const s3 = require("../../config/s3");

exports.getMovies = (req,res)=>{
  readDb.query("SELECT * FROM movies",(err,results)=>{
    if(err) return res.status(500).json(err);
    res.json(results);
  });
};

exports.streamMovie = (req,res)=>{
  readDb.query(
    "SELECT video_key FROM movies WHERE id=?",
    [req.params.id],
    (err,results)=>{
      if(!results.length) return res.status(404).json({message:"Not found"});
      const url = s3.getSignedUrl("getObject",{
        Bucket:process.env.S3_BUCKET,
        Key:results[0].video_key,
        Expires:300
      });
      res.json({url});
    }
  );
};