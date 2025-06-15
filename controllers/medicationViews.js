// controllers/medicationViews.js
const Med = require('../models/Medication')

const showForm = (req, res) => {
  res.render('medications/form', { user: req.user })
}

const submitForm = async (req, res) => {
  try {
    await Med.create({
      ...req.body,
      createdBy: req.user.userId,
    })
    res.redirect('/medications') // redirect after saving
  } catch (err) {
    console.log(err)
    res.status(500).send('Error submitting medication')
  }
}

module.exports = {
  showForm,
  submitForm,
}