const express = require("express");
require("express-async-errors");

const app = express();

app.set("view engine", "ejs");
app.use(require("body-parser").urlencoded({ extended: true }));

require("dotenv").config(); // to load the .env file into the process.env object
const session = require("express-session");

const connectDB = require("./db/connect");
// might not need this
const MongoDBStore = require("connect-mongodb-session")(session);
const url = process.env.MONGO_URI;

const store = new MongoDBStore({
  // may throw an error, which won't be caught
  uri: url,
  collection: "mySessions",
});
store.on("error", function (error) {
  console.log(error);
});

const sessionParms = {
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  store: store,
  cookie: { secure: false, sameSite: "strict" },
};

if (app.get("env") === "production") {
  app.set("trust proxy", 1); // trust first proxy
  sessionParms.cookie.secure = true; // serve secure cookies
}

app.use(session(sessionParms));
const passport = require("passport");
const passportInit = require("./passport/passportInit");

passportInit();
app.use(passport.initialize());
app.use(passport.session());

app.use(require("connect-flash")());
app.use((req, res, next) => {
  res.locals.successMessages = req.flash("success");
  res.locals.errorMessages = req.flash("error");
  next();
});

app.use(require("./middleware/storeLocals"));
app.get("/", (req, res) => {
  res.render("index");
});

const medicationRoutes = require("./routes/medication"); //added
// const medicationApiRouter = require('./routes/medicationApi')   // Postman API

app.use("/sessions", require("./routes/sessionRoutes"));
app.use("/medication", medicationRoutes); //added
// app.use('/api/medications', medicationApiRouter)  // Postman API route

// secret word handling
// let secretWord = "syzygy";
const secretWordRouter = require("./routes/secretWord");
const auth = require("./middleware/auth");
app.use("/secretWord", secretWordRouter);

//middleware
const errorHandlerMiddleware = require("./middleware/error-handler");

app.get("/", (req, res) => {
  res.redirect("/medication"); // added
});

app.use((req, res) => {
  res.status(404).send(`That page (${req.url}) was not found.`);
});

app.use((err, req, res, next) => {
  res.status(500).send(err.message);
  console.log(err);
});

app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    // await require("./db/connect")(process.env.MONGO_URI);
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
