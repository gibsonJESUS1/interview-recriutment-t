const axios = require("axios");
const env = require("dotenv");
const rateLimit = require("express-rate-limit");
const Movie = require("../model/movie.model.js");

exports.movieCreate = async (req, res) => {
  const { title } = req.body;
  const movieapikey = process.env.MOVIEKEY;
  let result;

  await axios
    .get(`http://www.omdbapi.com/?i=tt3896198&apikey=${movieapikey}&t=${title}`)
    .then((response) => {
      console.log(response.data);
      result = response.data;
    })
    .catch((error) => {
      console.log(error);
    });

  const { Title, Released, Genre, Director } = result;

  Movie.findOne({ Title: Title }).exec((error, movie) => {
    if (movie)
      return res.status(200).json({ msg: "duplicate movie not allowed" });
    const _movie = new Movie({
      Title,
      Released,
      Genre,
      Director,
      CreatedBy: req.user.userId,
    });
    _movie.save((error, savedMovie) => {
      if (error) res.status(400).json({ msg: error });
      if (savedMovie)
        return res.status(201).json({ msg: "new movie created successfully" });
    });
  });
};

exports.fetchMovies = (req, res) => {
  const { userId } = req.user;

  const aut = Movie.find((CreatedBy) => CreatedBy);

  Movie.find({ userId }).exec((error, movies) => {
    if (error) res.status(401).json({ error });
    if (movies) res.status(200).json({ movies });
  });
};
