const connectDB = require("../lib/db");
const { getAuthUser, sendError } = require("../lib/auth");
const Interest = require("../models/Interest");

const populateInterest = (query) =>
  query
    .populate("fromUserId", "name email role")
    .populate("toUserId", "name email role");

module.exports = async function handler(req, res) {
  try {
    await connectDB();
    const user = await getAuthUser(req);

    if (req.method === "PUT") {
      const { id, status } = req.body;

      if (!id) {
        return res.status(400).json({ message: "Interest id is required" });
      }

      if (!["approved", "rejected", "pending"].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }

      const interest = await Interest.findById(id);
      if (!interest) {
        return res.status(404).json({ message: "Interest not found" });
      }

      if (user.role !== "admin") {
        return res.status(403).json({ message: "Only admin can update interest status" });
      }

      interest.status = status;
      await interest.save();

      const populated = await populateInterest(Interest.findById(interest._id));
      return res.status(200).json(populated);
    }

    if (req.method !== "GET") {
      return res.status(405).json({ message: "Method not allowed" });
    }

    const { type } = req.query;

    if (type === "all") {
      if (user.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }

      const interests = await populateInterest(Interest.find().sort({ date: -1 }));
      return res.status(200).json(interests);
    }

    if (type === "received") {
      const interests = await populateInterest(Interest.find({ toUserId: user._id }).sort({ date: -1 }));
      return res.status(200).json(interests);
    }

    const interests = await populateInterest(Interest.find({ fromUserId: user._id }).sort({ date: -1 }));
    return res.status(200).json(interests);
  } catch (error) {
    return sendError(res, error, "Could not fetch interests");
  }
};
