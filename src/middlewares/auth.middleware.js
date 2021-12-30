const jwt = require("jsonwebtoken");
const Movie = require("../model/movie.model.js");

exports.requireSignIn = (req, res, next) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(" ")[1];
    const user = jwt.verify(token, process.env.JWT_SECRET);
    console.log(user);
    req.user = user;
  } else {
    return res.status(401).json({ msg: "Autorisation Requiredss" });
  }
  next();
};

exports.authedUserMiddleWare = (req, res, next) => {
  if (req.user.role !== "premium" || req.user.role !== "basic") {
    return res.status(401).json({ msg: "Acess Denied !" });
  }
  next();
};
