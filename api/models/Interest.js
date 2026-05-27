const mongoose = require("mongoose");

const interestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending"
    },
    date: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

interestSchema.index({ fromUserId: 1, toUserId: 1 }, { unique: true });

module.exports = mongoose.models.Interest || mongoose.model("Interest", interestSchema);
