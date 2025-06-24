const express = require("express");
const helmet = require("helmet");
require("express-async-errors");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const csrf = require("csurf");
// const bodyParser = require("body-parser");
const flash = require("connect-flash");

const app = express();
app.set("view engine", "ejs");
const bodyParser = require("body-parser");
const { xss } = require("express-xss-sanitizer");

// app.use(require("body-parser").urlencoded({ extended: true }));
// const cookieParser = require("cookie-parser");
// const csrf = require("csurf");

require("dotenv").config(); // to load the .env file into the process.env object
// const session = require("express-session");

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

// Middleware order matters
app.use(cookieParser(process.env.SESSION_SECRET)); // 1. cookie parser
app.use(session(sessionParms)); // 2. session
app.use(bodyParser.urlencoded({ extended: true })); // 3. body parser
app.use(xss());
app.use(helmet());
app.use(csrf());

// Make CSRF token available to EJS views
app.use((req, res, next) => {
  // res.locals._csrf = req.csrfToken(); //might need to add this again
  res.locals.csrfToken = req.csrfToken ? req.csrfToken() : null;
  res.locals.user = req.user || null;
  next();
});

// app.use(session(sessionParms)); //remove if app works fine afterward
const passport = require("passport");
const passportInit = require("./passport/passportInit");

passportInit();
app.use(passport.initialize());
app.use(passport.session());

// app.use(require("connect-flash")());
app.use(flash());
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
app.use("/medications", medicationRoutes); //added
// app.use('/api/medications', medicationApiRouter)  // Postman API route

// secret word handling
// let secretWord = "syzygy";
const secretWordRouter = require("./routes/secretWord");
app.use("/secretWord", secretWordRouter);

//middleware
const errorHandlerMiddleware = require("./middleware/error-handler");

// app.get("/", (req, res) => {
//   res.redirect("/medications"); // added
// });

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
