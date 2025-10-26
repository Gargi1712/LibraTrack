import express from "express";
import Borrower from "../models/Borrower.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const borrowers = await Borrower.find();
  res.json(borrowers);
});

router.post("/search", async (req, res) => {
  const { borrowerId } = req.body;
  const borrower = await Borrower.findOne({ borrowerId });
  res.json(borrower);
});


router.post("/", async (req, res) => {
    try {
      const newBorrower = new Borrower(req.body);
      await newBorrower.save();
      res.status(201).json(newBorrower);
    } catch (err) {
      console.error("Error adding borrower:", err);
      res.status(500).json({ error: err.message });
    }
  });

  router.post("/add", async (req, res) => {
    try {
      const { borrowerId, name } = req.body;
  
      
      if (!borrowerId || !name) {
        return res.status(400).json({ error: "borrowerId and name are required" });
      }
  
      // Check if already exists
      const exists = await Borrower.findOne({ borrowerId });
      if (exists) {
        return res.status(400).json({ error: "Borrower already exists" });
      }
  
      const newBorrower = new Borrower({ borrowerId, name });
      await newBorrower.save();
      res.status(201).json(newBorrower);
    } catch (err) {
      console.error("Error adding borrower:", err);
      res.status(500).json({ error: "Failed to add borrower" });
    }
  });
  
  

  router.post("/search", async (req, res) => {
    const { borrowerId } = req.body;
    if (!borrowerId) return res.status(400).json({ error: "Borrower ID required" });
  
    try {
      const borrower = await Borrower.findOne({ borrowerId });
      if (!borrower) return res.status(404).json(null);
      res.json(borrower);
    } catch (err) {
      res.status(500).json({ error: "Search failed" });
    }
  });
  
export default router;
