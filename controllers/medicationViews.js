// controllers/medicationViews.js
const Med = require("../models/Medication");

const showForm = (req, res) => {
  res.render("medications/new", { user: req.user });
};

const submitForm = async (req, res) => {
  try {
    console.log(req.user);
    await Med.create({
      ...req.body,
      userId: req.user._id,
    });
    res.redirect("/medications"); // redirect after saving
  } catch (err) {
    console.log(err);
    res.status(500).send("Error submitting medication");
  }
};

module.exports = {
  showForm,
  submitForm,
};
