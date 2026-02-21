const express = require("express");
const cors = require("cors");
const { register, login } = require("./modules/auth/auth.controller");
const { getMovies, streamMovie } = require("./modules/movies/movie.controller");
const { authenticate } = require("./middleware/auth.middleware");

const app = express();
app.use(express.json());
app.use(cors());

app.post("/api/auth/register", register);
app.post("/api/auth/login", login);
app.get("/api/movies", getMovies);
app.get("/api/movies/stream/:id", authenticate, streamMovie);

module.exports = app;