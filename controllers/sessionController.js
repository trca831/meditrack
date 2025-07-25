const User = require("../models/User");
const parseVErr = require("../util/parseValidationErr");

const registerShow = (req, res) => {
  res.render("register");
};

const registerDo = async (req, res, next) => {
  console.log("register endpoint");
  console.log(req.body);
  if (req.body.password != req.body.password1) {
    req.flash("error", "The passwords entered do not match.");
    return res.render("register", { errors: req.flash("error") });
  }
  try {
    console.log("try create user");

    const newUser = await User.create({
      username: req.body.name,
      email: req.body.email,
      password: req.body.password,
    });
    console.log("User created:", newUser.email); //take out when it works

    req.login(newUser, function (err) {
      if (err) return next(err);
      return res.redirect("/");
    });
  } catch (e) {
    console.log(`error ${e}`);
    if (e.constructor.name === "ValidationError") {
      parseVErr(e, req);
    } else if (e.name === "MongoServerError" && e.code === 11000) {
      req.flash("error", "That email address is already registered.");
    } else {
      return next(e);
    }
    return res.render("register", { errors: req.flash("errors") });
  }
};

const logoff = (req, res) => {
  req.session.destroy(function (err) {
    if (err) {
      console.log(err);
    }
    res.redirect("/");
  });
};

const logonShow = (req, res) => {
  if (req.user) {
    return res.redirect("/medications");
  }
  res.render("logon", { csrfToken: req.csrfToken() });
};

module.exports = {
  registerShow,
  registerDo,
  logoff,
  logonShow,
};
