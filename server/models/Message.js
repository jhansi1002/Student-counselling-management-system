import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  read: { type: Boolean, default: false },
});

export default mongoose.model("Message", messageSchema);