const express = require("express");
const router = express.Router();

const {
  toggleTaken,
  createMed,
  getAllMeds,
  getMed,
  updateMed,
  deleteMed,
  renderNewMedForm,
  renderEditMedForm,
} = require("../controllers/medications");

router.post("/toggle/:id", isLoggedIn, toggleTaken);
router.get("/", isLoggedIn, getAllMeds);
router.get("/new", isLoggedIn, renderNewMedForm);
router.get("/:id", isLoggedIn, getMed);
router.post("/", isLoggedIn, createMed);
router.get("/edit/:id", isLoggedIn, renderEditMedForm);
router.post("/update/:id", isLoggedIn, updateMed);
router.post("/delete/:id/", isLoggedIn, deleteMed);

// isLoggedIn middleware
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  req.flash("error", "You must be logged in to view this page.");
  res.redirect("/sessions/logon");
}

// router.get("/new", isLoggedIn, (req, res) => {
//   res.render("medications/form");
// });

module.exports = router;
