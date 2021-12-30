const express = require("express");
const {
  movieCreate,
  fetchMovies,
} = require("../controller/movie.controler.js");
const {
  requireSignIn,
  authedUserMiddleWare,
} = require("../middlewares/auth.middleware.js");
const router = express.Router();
const rateLimit = require("express-rate-limit");

//   Rate limit
const apiLimiter = rateLimit({
  windowMs: 31 * 24 * 60 * 60 * 1000, // 1 month
  max: (req, res) => {
    if (req.user.role !== "premium") return 1;
  },
  message:
    "You can only create 5 movies in a month. Please upgrade your plan to continue",
});

router.post("/create-movie", requireSignIn, apiLimiter, movieCreate);
router.post("/fetch-movies", requireSignIn, fetchMovies);

module.exports = router;
