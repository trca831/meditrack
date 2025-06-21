// const Med = require('../models/Medication')
// //need to make a http-status-codes
// const { StatusCodes } = require('http-status-codes')
// //need to create errors folder with these middlewares
// const { BadRequestError, NotFoundError } = require('../errors')

// //need to connect to Postman and Mongoose
// const getAllMed = async(req, res) => {
//     // res.send('Hello, this is a route for medication')
//     const med = await Med.find({createdBy: req.user.userId}).sort('createdAt')
//     res.render('medications/index', { med }); // This view must exist!
//     res.status(StatusCodes.OK).json({ med, count: med.length })
// }

// const getMed = async (req, res) => {
//     const {
//         user: { userId },
//         //params is ...
//         params: { id: medId }
//     } = req

//     const med = await Med.findOne({
//         _id: medId,
//         createdBy: userId,
//     })
//     if (!med) {
//         throw new NotFoundError(`No medication with id ${medId}`)
//     }
//     res.status(StatusCodes.OK).json({ med })
// }

// const createMed = async (req, res ) => {
//     // req.body.createdBy = req.user.userId
//     // const med = await Med.create(req.body)
//     // res.status(StatusCodes.CREATED).json({ med })
//     try {
//         const med = await Med.create({
//           ...req.body,
//           createdBy: req.user._id,
//         });
//         res.redirect('/medications');
//       } catch (err) {
//         req.flash('error', 'Failed to add medication.');
//         res.redirect('/medications/new');
//       }
// }

// const updateMed = async (req, res) => {
//     const {
//         body: { name, dosage },
//         user: { userId },
//         params: { id: medId }
//     } = req

//     if (name === '' || dosage === ''){
//         throw new BadRequestError('Name or Dosage fields cannot be empty')
//     }
//     const med = await Med.findByIdAndUpdate(
//         { _id: medId, createdBy: userId },
//         req.body,
//         { new: true, runValidators: true})
//     if (!med) {
//         throw new NotFoundError(`No medication with id ${medId}`)
//     }
//     res.status(StatusCodes.OK).json({ med })
// }

// const deleteMed = async (req, res) => {
//     const {
//         user: { userId },
//         params: { id: medId }
//     } = req

//     const med = await Med.findByIdAndDelete({
//         _id:medId,
//         createdBy:userId,
//     })

//     if (!med){
//         throw new NotFoundError(`No medication with id ${medId}`)
//     }
//     res.status(StatusCodes.OK).json({ msg: "The medication entry was deleted."});
// }

// module.exports = {
//     getAllMed,
//     getMed,
//     createMed,
//     updateMed,
//     deleteMed,
// }

// const Med = require("../models/Medication");
// const { StatusCodes } = require("http-status-codes");
// const { BadRequestError, NotFoundError } = require("../errors");

// const getAllMeds = async (req, res) => {
//   const meds = await Med.find({ createdBy: req.user.userId }).sort("createdAt");
//   res.status(StatusCodes.OK).json({ meds, count: meds.length });
// };
// const getMed = async (req, res) => {
//   const {
//     user: { userId },
//     params: { id: medId },
//   } = req;

//   const med = await Med.findOne({
//     _id: medId,
//     createdBy: userId,
//   });
//   if (!med) {
//     throw new NotFoundError(`No job with id ${medId}`);
//   }
//   res.status(StatusCodes.OK).json({ med });
// };

// const createMed = async (req, res) => {
//   req.body.createdBy = req.user.userId;
//   const med = await Med.create(req.body);
//   res.status(StatusCodes.CREATED).json({ med });
// };
// const updateMed = async (req, res) => {
//   const {
//     body: { name, dosage, date, notes },
//     user: { userId },
//     params: { id: medId },
//   } = req;

//   if (name === "" || dosage === "" || date === "" || notes === "") {
//     throw new BadRequestError(
//       "Medication name, dosage, date, and note fields cannot be empty"
//     );
//   }
//   const med = await Med.findByIdAndUpdate(
//     { _id: medId, createdBy: userId },
//     req.body,
//     { new: true, runValidators: true }
//   );
//   if (!med) {
//     throw new NotFoundError(`No medication with id ${medId}`);
//   }
//   res.status(StatusCodes.OK).json({ med });
// };
// const deleteMed = async (req, res) => {
//   const {
//     user: { userId },
//     params: { id: medId },
//   } = req;

//   const med = await Med.findByIdAndDelete({
//     _id: medId,
//     createdBy: userId,
//   });

//   if (!med) {
//     throw new NotFoundError(`No medication with id ${medId}`);
//   }
//   res.status(StatusCodes.OK).json({ msg: "The entry was deleted." });
// };

// module.exports = {
//   getAllMeds,
//   getMed,
//   createMed,
//   updateMed,
//   deleteMed,
// };

const Medication = require("../models/Medication");
const { BadRequestError, NotFoundError } = require("../errors");

// GET /medications - Show all meds
const getAllMeds = async (req, res) => {
  try {
    const meds = await Medication.find({ createdBy: req.user.userId }).sort(
      "createdAt"
    );
    res.render("medications/index", { meds }); // render meds/index.ejs
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

// GET /medications/:id - Show a single med
const getMed = async (req, res) => {
  const {
    user: { userId },
    params: { id: medId },
  } = req;

  const med = await Medication.findOne({
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
  res.render("medications/new", { medication: null }); // render meds/new.ejs
};

// POST /medications - Create a new med
const createMed = async (req, res) => {
  req.body.createdBy = req.user.userId;
  await Medication.create(req.body);
  res.redirect("/medications"); // redirect to meds list
};

// GET /medications/:id/edit - Render form to edit a med
const renderEditMedForm = async (req, res) => {
  const med = await Medication.findOne({
    _id: req.params.id,
    createdBy: req.user.userId,
  });

  if (!med) {
    throw new NotFoundError(`No medication with id ${req.params.id}`);
  }

  res.render("medications/edit", { med }); // render meds/edit.ejs
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

  const med = await Medication.findOneAndUpdate(
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

  const med = await Medication.findOneAndDelete({
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
