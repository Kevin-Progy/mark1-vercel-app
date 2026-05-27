const connectDB = require("../lib/db");
const { getAuthUser, sendError } = require("../lib/auth");
const Profile = require("../models/Profile");
const User = require("../models/User");

const profilePayload = (body, user) => ({
  name: body.name || user.name,
  age: body.age,
  dateOfBirth: body.dateOfBirth || undefined,
  height: body.height,
  gender: body.gender,
  maritalStatus: body.maritalStatus,
  qualification: body.qualification,
  profession: body.profession,
  income: body.income,
  community: body.community,
  languages: Array.isArray(body.languages) ? body.languages : [],
  fatherName: body.fatherName,
  motherName: body.motherName,
  parentsContactNumber: body.parentsContactNumber,
  parentsAlternateContactNumber: body.parentsAlternateContactNumber,
  telegramNumber: body.telegramNumber,
  familyStatus: body.familyStatus,
  parents: body.parents,
  email: body.email || user.email,
  homeTown: body.homeTown,
  currentResidence: body.currentResidence,
  siblings: body.siblings,
  localFaithHome: body.localFaithHome,
  centerFaithHome: body.centerFaithHome,
  expectations: body.expectations,
  photo: body.photo || ""
});

module.exports = async function handler(req, res) {
  if (req.method !== "PUT") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await connectDB();
    const user = await getAuthUser(req);

    if (req.body.parentsContactNumber && !/^\d{10}$/.test(req.body.parentsContactNumber)) {
      return res.status(400).json({ message: "Parent's contact number must be exactly 10 digits" });
    }

    const profile = await Profile.findOneAndUpdate(
      { userId: user._id },
      { $set: profilePayload(req.body, user) },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
    ).populate("userId", "name email role profileCompleted");

    await User.findByIdAndUpdate(user._id, { profileCompleted: true });

    return res.status(200).json(profile);
  } catch (error) {
    return sendError(res, error, "Could not save profile");
  }
};
