const express = require("express");
const bodyParser = require("body-parser");
const { authFactory, AuthError } = require("./auth");
const env = require("dotenv");
const mongoose = require("mongoose");

env.config();

const PORT = 3000;
const { JWT_SECRET } = process.env;

if (!JWT_SECRET) {
  throw new Error("Missing JWT_SECRET env var. Set it and restart the server");
}

//connecting to mongodb via mongoose
// db .evn details
const userName = process.env.DATABASE_USERNAME;
const password = process.env.DATABASE_PASSWORD;
const dbName = process.env.DATABASE_NAME;
mongoose
  .connect(
    `mongodb+srv://${userName}:${password}@cluster0.g53h9.mongodb.net/${dbName}?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("DATABASE CONNECTED");
  })
  .catch((error) => {
    console.log(error);
  });

// Import Routes

const MovieRoute = require("./routes/movie.route.js");

const auth = authFactory(JWT_SECRET);

const app = express();

app.use(bodyParser.json());

app.post("/auth", (req, res, next) => {
  if (!req.body) {
    return res.status(400).json({ error: "invalid payload" });
  }

  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "invalid payloadss" });
  }

  try {
    const token = auth(username, password);
    console.log(token);
    return res.status(200).json({ token });
  } catch (error) {
    if (error instanceof AuthError) {
      return res.status(401).json({ error: error.message });
    }

    next(error);
  }
});

app.use(MovieRoute);

app.use((error, _, res, __) => {
  console.error(
    `Error processing request ${error}. See next message for details`
  );
  console.error(error);

  return res.status(500).json({ error: "internal server error" });
});

app.listen(PORT, () => {
  console.log(`auth svc running at port hhh ${PORT}`);
});
