const mongoose = require('mongoose');

const MedicationSchema = new mongoose.Schema({
  userId: {
    //stores ID of a document from another model
    //tells Mongoose that:
    //userID is not just a string, its a ObjectId
    //a unique ID mongoDB
    //"this record is owned by this user"
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: [true, 'Please provide the medication name'],
    trim: true,
    maxlength: 100,
  },
  dosage: {
    type: String,
    required: [true, 'Please provide the dosage (e.g. 10mg)'],
  },
  frequency: {
    type: String,
    required: [true, 'Please provide how often this medication is taken'],
    enum: ['Once a day', 'Twice a day', 'Three times a day', 'As needed'],
  },
  timeOfDay: {
    type: String,
    enum: ['Morning', 'Afternoon', 'Evening', 'Night'],
    default: 'Morning',
  },
  startDate: {
    type: Date,
    required: [true, 'Please provide a start date'],
  },
  endDate: {
    type: Date,
  },
  taken: {
    type: [Date], // array of timestamps when the med was taken
    default: [],
  },
  notes: {
    type: String,
    maxlength: 250,
  },
}, { timestamps: true });

module.exports = mongoose.model('Medication', MedicationSchema);