const mongoose = require("mongoose");

const MedicationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Medication name must be provided"],
    minlength: [2, "Medication name must be at least 2 characters long"],
    trim: true,
    maxlength: [100, "Medication name cannot be more than 100 characters long"],
  },
  dosage: {
    type: Number,
    required: [true, "Dosage number must be provided"],
    min: [1, "Dosage must be at least 1mg"],
    max: [10000, "Dosage must be less than 10,000mg"],
  },
  frequency: {
    type: String,
    required: [true, "Please provide how often this medication is taken"],
    enum: ["Once a day", "Twice a day", "Three times a day", "As needed"],
  },
  taken: {
    type: Boolean,
    default: false,
  },
  date: {
    type: Date,
    default: Date.now,
    required: [true, "Date must be provided"],
  },
  notes: {
    type: [String],
    validate: {
      validator: function (arr) {
        return arr.every(
          (note) => typeof note === "string" && note.trim().length > 0
        );
      },
      message: "Notes must be non-empty strings",
    },
    default: [],
  },
  createdBy: {
    //stores ID of a document from another model
    //tells Mongoose that:
    //userID is not just a string, its a ObjectId
    //a unique ID mongoDB
    //"this record is owned by this user"
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model("Med", MedicationSchema);
