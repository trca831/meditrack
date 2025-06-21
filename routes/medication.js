// routes/medication.js
const express = require("express");
const router = express.Router();

const {
  createMed,
  getAllMeds,
  getMed,
  updateMed,
  deleteMed,
  renderNewMedForm,
  renderEditMedForm,
} = require("../controllers/medication");

const auth = require("../middleware/auth");

// PROTECTED: Show all medications
router.get("/", auth, getAllMeds);

// PROTECTED: Render form to create new medication
//TESTING
router.get("/medications/new", auth, renderNewMedForm);

// PROTECTED: Show a single medication
router.get("/:id", auth, getMed);

// PROTECTED: Handle form submission for new med
router.post("/", auth, createMed);

// PROTECTED: Render edit form
router.get("/:id/edit", auth, renderEditMedForm);

// PROTECTED: Handle update
router.post("/:id", auth, updateMed);

// PROTECTED: Handle deletion
router.post("/:id/delete", auth, deleteMed);

// // isLoggedIn middleware
// function isLoggedIn(req, res, next) {
//   if (req.isAuthenticated()) return next();
//   req.flash("error", "You must be logged in to view this page.");
//   res.redirect("/sessions/logon");
// }

// const { showForm, submitForm } = require("../controllers/medicationViews");

// router.get("/", auth, showForm);
// router.post("/", auth, submitForm);

// router.get("/new", isLoggedIn, (req, res) => {
//   res.render("medications/form");
// });

// // Router to show ALL Medications
// router.get("/medications", async (req, res) => {
//   const meds = await Medication.find().populate("user"); //to use user ref
//   res.render("medication/index", { meds });
// });

// // GET all meds
// router.get("/", isLoggedIn, getAllMeds);

// // Render form to create new medication
// router.get("/new", isLoggedIn, renderNewMedForm);

// // Route to handle the form submission
// router.post("/", isLoggedIn, createMed);

// // GET a single medication
// router.get("/:id", isLoggedIn, getMed);

// // Render form to edit a med
// router.get("/:id/edit", isLoggedIn, renderEditMedForm);

// // Handle edit form submission
// router.post("/:id", isLoggedIn, updateMed);

// // Handle deletion
// router.post("/:id/delete", isLoggedIn, deleteMed);

module.exports = router;
