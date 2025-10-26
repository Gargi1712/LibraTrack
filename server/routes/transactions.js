import express from "express";
import Transaction from "../models/Transaction.js";
import Borrower from '../models/Borrower.js';
import Book from '../models/Book.js';

const router = express.Router();

router.get("/", async (req, res) => {
  const transactions = await Transaction.find().sort({ date: -1 });
  res.json(transactions);
});

router.post("/", async (req, res) => {
  const { borrowerId, accNo, type } = req.body;

  try {
    console.log("Incoming request:", req.body);

    const borrower = await Borrower.findOne({ borrowerId });
    if (!borrower) {
      console.log("Borrower not found");
      return res.status(404).json({ error: "Borrower not found" });
    }

    const book = await Book.findOne({ accNo });
    if (!book) {
      console.log("Book not found");
      return res.status(404).json({ error: "Book not found" });
    }

    console.log("Book found:", book);

    if (type === "issue") {
      if (book.quantity <= 0) {
        console.log("Book not available for issue");
        return res.status(400).json({ error: "Book is not available" });
      }

      
      book.quantity -= 1;
    } else if (type === "return") {
      
      const lastIssue = await Transaction.findOne({
        borrowerId,
        accNo,
        type: "issue",
      }).sort({ date: -1 });

      const lastReturn = await Transaction.findOne({
        borrowerId,
        accNo,
        type: "return",
      }).sort({ date: -1 });

      if (!lastIssue || (lastReturn && lastReturn.date > lastIssue.date)) {
        return res.status(400).json({
          error: "This borrower has not issued this book or already returned it",
        });
      }

      book.quantity += 1;
    } else {
      return res.status(400).json({ error: "Invalid transaction type" });
    }

    
    book.available = book.quantity > 0;
    await book.save();

  
    const transaction = new Transaction({
      borrowerId,
      accNo,
      type,
      date: new Date(),
    });
    await transaction.save();

    console.log("Transaction created:", transaction);
    res.status(201).json(transaction);
  } catch (err) {
    console.error("Transaction error:", err);
    res.status(500).json({ error: "Transaction failed" });
  }
});

  
  
export default router;
