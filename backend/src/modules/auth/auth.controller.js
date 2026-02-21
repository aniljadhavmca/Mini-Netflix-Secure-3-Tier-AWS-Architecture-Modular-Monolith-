const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { writeDb } = require("../../config/db");

exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  const hash = await bcrypt.hash(password, 10);

  writeDb.query(
    "INSERT INTO users (name,email,password) VALUES (?,?,?)",
    [name, email, hash],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "User registered" });
    }
  );
};

exports.login = (req, res) => {
  const { email, password } = req.body;

  writeDb.query(
    "SELECT * FROM users WHERE email=?",
    [email],
    async (err, results) => {
      if (err) return res.status(500).json(err);
      if (!results.length) return res.status(404).json({ message: "User not found" });

      const user = results[0];
      const valid = await bcrypt.compare(password, user.password);
      if (!valid) return res.status(401).json({ message: "Invalid credentials" });

      const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "2h" }
      );

      res.json({ token });
    }
  );
};