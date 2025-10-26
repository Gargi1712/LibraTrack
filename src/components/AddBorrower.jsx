import React, { useState } from "react";
import axios from "axios";
import './addBorrower.css';


const AddBorrower = () => {
  const [borrowerId, setBorrowerId] = useState("");
  const [name, setName] = useState("");

  const addBorrower = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/borrowers/add", {
        borrowerId,
        name,
      });
      alert("Borrower added: " + res.data.name);
    } catch (err) {
      alert("Error: " + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div className="add-borrower-section">
      <h3>Add Borrower</h3>
      <input
        placeholder="Borrower ID"
        value={borrowerId}
        onChange={(e) => setBorrowerId(e.target.value)}
      />
      <input
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button onClick={addBorrower}>Add</button>
    </div>
  );
};

export default AddBorrower;
