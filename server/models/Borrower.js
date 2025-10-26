import mongoose from "mongoose";

const borrowerSchema = new mongoose.Schema({
  borrowerId: { type: String, required: true, unique: true },
  name: { type: String, required: true }
});

const Borrower = mongoose.model("Borrower", borrowerSchema);

export default Borrower;
