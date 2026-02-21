const express = require("express");
const cors = require("cors");

const authRoutes = require("./modules/auth/auth.routes");
const movieRoutes = require("./modules/movies/movie.routes");

const app = express();
app.use(express.json());
app.use(cors());

app.get("/health", (req, res) => res.send("OK"));

app.use("/api/auth", authRoutes);
app.use("/api/movies", movieRoutes);

module.exports = app;