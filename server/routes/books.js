import express from "express";
import Book from "../models/Book.js";

const router = express.Router();
router.get("/", async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



router.post("/search", async (req, res) => {
  const { accNo } = req.body;
  if (!accNo) return res.status(400).json({ error: "Accession number required" });

  try {
    const book = await Book.findOne({ accNo });
    if (!book) return res.status(404).json(null);
    res.json(book);
  } catch (err) {
    res.status(500).json({ error: "Search failed" });
  }
});



router.post("/", (req, res) => {
  res.status(403).json({ message: "Adding books is not allowed." });
});


export default router;
