const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { writeDb } = require("../../config/db");

exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  const hash = await bcrypt.hash(password, 10);

  writeDb.query(
    "INSERT INTO users (name,email,password) VALUES (?,?,?)",
    [name, email, hash],
    () => res.send("Registered")
  );
};

exports.login = (req, res) => {
  const { email, password } = req.body;

  writeDb.query(
    "SELECT * FROM users WHERE email=?",
    [email],
    async (err, results) => {
      if (!results.length) return res.status(404).send("Not found");

      const valid = await bcrypt.compare(password, results[0].password);
      if (!valid) return res.status(401).send("Invalid");

      const token = jwt.sign(
        { id: results[0].id, role: results[0].role },
        process.env.JWT_SECRET
      );

      res.json({ token });
    }
  );
};