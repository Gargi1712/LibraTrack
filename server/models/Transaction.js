import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  borrowerId: String,
  accNo: String,
  date: { type: Date, default: Date.now },
  type: String // issue or return
});

export default mongoose.model("Transaction", transactionSchema);
