const express = require("express");
require("express-async-errors");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const csrf = require("csurf");

const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));
const bodyParser = require("body-parser");
require("dotenv").config(); // to load the .env file into the process.env object

const connectDB = require("./db/connect");
const MongoDBStore = require("connect-mongodb-session")(session);
const url = process.env.MONGO_URI;

const store = new MongoDBStore({
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

const helmet = require("helmet");
const xss = require("xss-clean");

// Middleware order matters
app.use(cookieParser(process.env.SESSION_SECRET)); // 1. cookie parser
app.use(session(sessionParms)); // 2. session
app.use(bodyParser.urlencoded({ extended: true })); // 3. body parser
app.use(csrf());

// Set security HTTP headers
app.use(helmet());

// Prevent XSS attacks
app.use(xss());

app.use((req, res, next) => {
  res.locals.csrfToken = req.csrfToken ? req.csrfToken() : null;
  res.locals.user = req.user || null;
  next();
});

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

const medicationRoutes = require("./routes/medication"); //added

// app.get("/", (req, res) => {
//   res.render("index");
// });

app.use("/sessions", require("./routes/sessionRoutes"));
app.use("/medications", medicationRoutes); //added

const secretWordRouter = require("./routes/secretWord");
app.use("/secretWord", secretWordRouter);

//middleware
const errorHandlerMiddleware = require("./middleware/error-handler");

app.get("/", (req, res) => {
  return res.redirect("/medications"); // added
});

// app.use(errorHandlerMiddleware);

app.use((req, res) => {
  res.status(404).send(`That page (${req.url}) was not found.`);
});

app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
