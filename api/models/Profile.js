const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    age: {
      type: Number,
      min: 18,
      max: 100
    },
    dateOfBirth: {
      type: Date
    },
    height: {
      type: String,
      trim: true
    },
    gender: {
      type: String,
      enum: ["Male", "Female", ""],
      default: "",
      trim: true
    },
    maritalStatus: {
      type: String,
      enum: ["Single", "Married", "Widowed", "Separated", "Divorced", ""],
      default: "",
      trim: true
    },
    qualification: {
      type: String,
      trim: true
    },
    profession: {
      type: String,
      trim: true
    },
    income: {
      type: String,
      trim: true
    },
    community: {
      type: String,
      trim: true
    },
    languages: {
      type: [String],
      default: []
    },
    fatherName: {
      type: String,
      trim: true
    },
    motherName: {
      type: String,
      trim: true
    },
    parentsContactNumber: {
      type: String,
      validate: {
        validator(value) {
          return !value || /^\d{10}$/.test(value);
        },
        message: "Parent's contact number must be exactly 10 digits"
      },
      trim: true
    },
    parentsAlternateContactNumber: {
      type: String,
      trim: true
    },
    telegramNumber: {
      type: String,
      trim: true
    },
    familyStatus: {
      type: String,
      trim: true
    },
    parents: {
      type: String,
      trim: true
    },
    email: {
      type: String,
      lowercase: true,
      trim: true
    },
    homeTown: {
      type: String,
      trim: true
    },
    currentResidence: {
      type: String,
      trim: true
    },
    siblings: {
      type: String,
      trim: true
    },
    localFaithHome: {
      type: String,
      trim: true
    },
    centerFaithHome: {
      type: String,
      trim: true
    },
    expectations: {
      type: String,
      trim: true
    },
    photo: {
      type: String,
      default: ""
    }
  },
  { timestamps: true }
);

module.exports = mongoose.models.Profile || mongoose.model("Profile", profileSchema);
