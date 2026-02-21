const express = require("express");
const router = express.Router();
const controller = require("./movie.controller");
const { authenticate } = require("../../middleware/auth.middleware");

router.get("/", controller.getMovies);
router.get("/stream/:id", authenticate, controller.streamMovie);

module.exports = router;