// server/models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    // renamed to match what we set in the register route
    passwordHash: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);

// no virtual “password” field – we only store the hashed version
export default mongoose.model("User", userSchema);
