// routes/medication.js
const express = require('express')
const router = express.Router()
const Med = require("../models/Medication");

// isLoggedIn middleware
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  req.flash("error", "You must be logged in to view this page.");
  res.redirect("/sessions/logon");
}

const { showForm, submitForm } = require('../controllers/medicationViews')
const auth = require('../middleware/auth')

router.get('/', auth, showForm)
router.post('/', auth, submitForm)

router.get('/new', isLoggedIn, (req, res) => {
    res.render('medications/form');
});
router.post('/', isLoggedIn, createMed);

module.exports = router