const connectDB = require("../lib/db");
const { getAuthUser, sendError } = require("../lib/auth");
const Interest = require("../models/Interest");
const Profile = require("../models/Profile");

const publicProfile = (profile, canViewDetails = false) => ({
  _id: profile._id,
  userId: profile.userId,
  name: profile.name,
  age: profile.age,
  gender: profile.gender,
  photo: profile.photo,
  canViewDetails
});

async function canViewFullProfile(viewer, profile) {
  const ownerId = String(profile.userId?._id || profile.userId);

  if (String(viewer._id) === ownerId || viewer.role === "admin") {
    return true;
  }

  const approvedInterest = await Interest.findOne({
    status: "approved",
    $or: [
      { fromUserId: viewer._id, toUserId: ownerId },
      { fromUserId: ownerId, toUserId: viewer._id }
    ]
  });

  return Boolean(approvedInterest);
}

async function getAllProfiles(req, res, user) {
  const { search, minAge, maxAge, location } = req.query;
  const filter = {};
  const myProfile = await Profile.findOne({ userId: user._id });

  if (myProfile?.gender === "Male") {
    filter.gender = "Female";
  }

  if (myProfile?.gender === "Female") {
    filter.gender = "Male";
  }

  if (minAge || maxAge) {
    filter.age = {};
    if (minAge) filter.age.$gte = Number(minAge);
    if (maxAge) filter.age.$lte = Number(maxAge);
  }

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { profession: { $regex: search, $options: "i" } },
      { qualification: { $regex: search, $options: "i" } },
      { community: { $regex: search, $options: "i" } },
      { languages: { $regex: search, $options: "i" } }
    ];
  }

  if (location) {
    filter.$or = [
      ...(filter.$or || []),
      { homeTown: { $regex: location, $options: "i" } },
      { currentResidence: { $regex: location, $options: "i" } }
    ];
  }

  const profiles = await Profile.find(filter)
    .populate("userId", "name email role profileCompleted")
    .sort({ createdAt: -1 });

  return res.status(200).json(profiles.map((profile) => publicProfile(profile)));
}

module.exports = async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await connectDB();
    const user = await getAuthUser(req);
    const { id, all, me } = req.query;

    if (all === "true") {
      return getAllProfiles(req, res, user);
    }

    if (me === "true") {
      const profile = await Profile.findOne({ userId: user._id }).populate("userId", "name email role profileCompleted");

      if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
      }

      return res.status(200).json(profile);
    }

    if (!id) {
      return res.status(400).json({ message: "Profile id is required" });
    }

    const profile = await Profile.findById(id).populate("userId", "name email role profileCompleted");

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    const canViewDetails = await canViewFullProfile(user, profile);

    if (!canViewDetails) {
      return res.status(200).json(publicProfile(profile, false));
    }

    return res.status(200).json({
      ...profile.toObject(),
      canViewDetails: true
    });
  } catch (error) {
    return sendError(res, error, "Could not fetch profile");
  }
};
