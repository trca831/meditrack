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

  return res.redirect("/medications");
};

const getAllMeds = async (req, res) => {
  const meds = await Med.find({ createdBy: req.user._id });
  return res.render("medications", {
    meds,
    _csrf: req.csrfToken(),
    user: req.user,
  });
};

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

  return res.render("medications", { med });
};

const renderNewMedForm = (req, res) => {
  return res.render("medication", { med: null });
};

const createMed = async (req, res) => {
  req.body.createdBy = req.user._id;
  await Med.create(req.body);
  return res.redirect("/medications");
};

const renderEditMedForm = async (req, res) => {
  const med = await Med.findOne({
    _id: req.params.id,
    createdBy: req.user._id,
  });

  if (!med) {
    throw new NotFoundError(`No medication with id ${req.params.id}`);
  }

  return res.render("medication", { med });
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

  return res.redirect("/medications");
};

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

  return res.redirect("/medications");
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
