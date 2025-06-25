const Med = require("../models/Medication");
const { BadRequestError, NotFoundError } = require("../errors");

const toggleTaken = async (req, res) => {
  const med = await Med.findOne({
    _id: req.params.id,
    createdBy: req.user._id,
  });

  if (!med) {
    throw new NotFoundError("Medication not found");
  }

  med.taken = !med.taken;
  await med.save();

  res.redirect("/medications");
};

// GET /medications - Show all meds
const getAllMeds = async (req, res) => {
  const meds = await Med.find({ createdBy: req.user._id });
  res.render("medications", {
    meds,
    _csrf: req.csrfToken(),
    user: req.user,
  });
};

// GET /medications/:id - Show a single med
const getMed = async (req, res) => {
  const {
    user: { _id: userId },
    params: { id: medId },
  } = req;

  const med = await Med.findOne({
    _id: medId,
    createdBy: userId,
  });

  if (!med) {
    throw new NotFoundError(`No medication with id ${medId}`);
  }

  res.render("medications", { med }); // render meds/show.ejs
};

// GET /medications/new - Render form to create a new med
const renderNewMedForm = (req, res) => {
  // res.redirect("/medications/new"); // render meds/new.ejs
  res.render("medication", { med: null });
};

// POST /medications - Create a new med
const createMed = async (req, res) => {
  const { name } = req.body;

  // check if name is missing
  if (!name || name.trim() === "") {
    req.flash("error", "Medication name is required.");
    return res.redirect("/medications");
  }
  try {
    req.body.createdBy = req.user._id;
    await Med.create(req.body);

    req.flash("success", "Medication added successfully!");
    res.redirect("/medications");
  } catch (err) {
    console.error(err);
    req.flash("error", "Something went wrong while creating medication.");
    res.redirect("/medications");
  }
};

// GET /medications/:id/edit - Render form to edit a med
const renderEditMedForm = async (req, res) => {
  const med = await Med.findOne({
    _id: req.params.id,
    createdBy: req.user._id,
  });

  if (!med) {
    throw new NotFoundError(`No medication with id ${req.params.id}`);
  }

  // res.redirect("/medications"); // render meds/edit.ejs
  res.render("medication", { med });
};

const updateMed = async (req, res) => {
  const {
    user: { _id: userId },
    params: { id: medId },
  } = req;

  if (!req.body.name || !req.body.dosage || !req.body.date || !req.body.notes) {
    throw new BadRequestError("All fields are required.");
  }

  await Med.updateOne({ _id: medId, createdBy: userId }, req.body);

  res.redirect("/medications");
};

// POST /medications/:id/delete - Delete a med
const deleteMed = async (req, res) => {
  const {
    user: { _id: userId },
    params: { id: medId },
  } = req;

  const med = await Med.findOneAndDelete({
    _id: medId,
    createdBy: userId,
  });

  if (!med) {
    throw new NotFoundError(`No medication with id ${medId}`);
  }

  res.redirect("/medications");
};

module.exports = {
  toggleTaken,
  getAllMeds,
  getMed,
  renderNewMedForm,
  createMed,
  renderEditMedForm,
  updateMed,
  deleteMed,
};
