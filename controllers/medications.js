const Med = require("../models/Medication");
const { BadRequestError, NotFoundError } = require("../errors");

// GET /medications - Show all meds
const getAllMeds = async (req, res) => {
  const meds = await Med.find({ createdBy: req.user.userId });
  res.render("medications", { meds });
};

// GET /medications/:id - Show a single med
const getMed = async (req, res) => {
  const {
    user: { userId },
    params: { id: medId },
  } = req;

  const med = await Med.findOne({
    _id: medId,
    createdBy: userId,
  });

  if (!med) {
    throw new NotFoundError(`No medication with id ${medId}`);
  }

  res.render("medications/show", { med }); // render meds/show.ejs
};

// GET /medications/new - Render form to create a new med
const renderNewMedForm = (req, res) => {
  res.render("medications", { medication: null }); // render meds/new.ejs
};

// POST /medications - Create a new med
const createMed = async (req, res) => {
  req.body.createdBy = req.user.userId;
  await Med.create(req.body);
  res.redirect("/medications"); // redirect to meds list
};

// GET /medications/:id/edit - Render form to edit a med
const renderEditMedForm = async (req, res) => {
  const med = await Med.findOne({
    _id: req.params.id,
    createdBy: req.user.userId,
  });

  if (!med) {
    throw new NotFoundError(`No medication with id ${req.params.id}`);
  }

  res.render("medications", { med }); // render meds/edit.ejs
};

// POST /medications/:id - Update med (form submission)
const updateMed = async (req, res) => {
  const {
    body: { name, dosage, date, notes },
    user: { userId },
    params: { id: medId },
  } = req;

  if (!name || !dosage || !date || !notes) {
    throw new BadRequestError("All fields are required.");
  }

  const med = await Med.findOneAndUpdate(
    { _id: medId, createdBy: userId },
    req.body,
    { new: true, runValidators: true }
  );

  if (!med) {
    throw new NotFoundError(`No medication with id ${medId}`);
  }

  res.redirect(`/medications/${medId}`); // redirect to the updated med
};

// POST /medications/:id/delete - Delete a med
const deleteMed = async (req, res) => {
  const {
    user: { userId },
    params: { id: medId },
  } = req;

  const med = await Med.findOneAndDelete({
    _id: medId,
    createdBy: userId,
  });

  if (!med) {
    throw new NotFoundError(`No medication with id ${medId}`);
  }

  res.redirect("/medication");
};

module.exports = {
  getAllMeds,
  getMed,
  renderNewMedForm,
  createMed,
  renderEditMedForm,
  updateMed,
  deleteMed,
};
