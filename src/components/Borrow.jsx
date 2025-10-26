import React, { useState, useEffect } from "react";
import axios from "axios";
import './borrow.css';

const Borrow = () => {
  const [borrowerId, setBorrowerId] = useState("");
  const [accNo, setAccNo] = useState("");
  const [log, setLog] = useState([]);
  const [books, setBooks] = useState([]);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/books");
      setBooks(res.data);
    } catch (err) {
      console.error("Error fetching books:", err);
    }
  };

  const searchBorrower = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/borrowers/search", { borrowerId });
      if (res.data) {
        alert(`Found: ${res.data.name}`);
      } else {
        alert("Borrower not found");
      }
    } catch (err) {
      alert("Error: " + (err.response?.data?.error || err.message));
    }
  };

  const searchBook = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/books/search", { accNo });
      if (res.data) {
        alert(`Found: ${res.data.title}`);
      } else {
        alert("Book not found");
      }
    } catch (err) {
      alert("Error: " + (err.response?.data?.error || err.message));
    }
  };

  const issueBook = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/transactions", {
        borrowerId,
        accNo,
        type: "issue"
      });
      alert("✅ Book issued successfully!");
      fetchLog();
      fetchBooks();
    } catch (err) {
      const msg = err.response?.data?.error || "Failed to issue book.";
      alert("❌ " + msg);
    }
  };

  const returnBook = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/transactions", {
        borrowerId,
        accNo,
        type: "return"
      });
      alert("✅ Book returned successfully!");
      fetchLog();
      fetchBooks();
    } catch (err) {
      const msg = err.response?.data?.error || "Failed to return book.";
      alert("❌ " + msg);
    }
  };

  const fetchLog = async () => {
    const res = await axios.get("http://localhost:5000/api/transactions");
    setLog(res.data);
  };

  const clearAll = () => {
    setBorrowerId("");
    setAccNo("");
    setLog([]);
  };

  return (
    <div className="borrow-section">
      <div>
        <label>Borrower's ID:</label>
        <input value={borrowerId} onChange={e => setBorrowerId(e.target.value)} />
        <button onClick={searchBorrower}>Search Borrowers</button>
      </div>

      <div>
        <label>Book ID:</label>
        <input value={accNo} onChange={e => setAccNo(e.target.value)} />
        <button onClick={searchBook}>Search Book</button>
      </div>

      <div>
        <button onClick={clearAll}>Clear All</button>
      </div>

      <div>
        <button onClick={issueBook}>Issue Book</button>
        <button onClick={fetchLog}>Show Log of Tran</button>
        <button onClick={returnBook}>Return Book</button>
      </div>

      <div>
        <h4>Available Books</h4>
        <table>
          <thead>
            <tr>
              <th>Book ID</th>
              <th>Title</th>
              <th>Author</th>
              <th>Quantity</th>
              <th>Available</th>
            </tr>
          </thead>
          <tbody>
            {books.map((b, i) => (
              <tr key={i}>
                <td>{b.accNo}</td>
                <td>{b.title}</td>
                <td>{b.author}</td>
                <td>{b.quantity}</td>
                <td>{b.available ? "Yes" : "No"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div>
        <h4>Log Details</h4>
        <ul>
          {log.map((t, i) => (
            <li key={i}>
              {`BORROWER ${t.borrowerId} ${t.type} BOOK ${t.accNo} on ${new Date(t.date).toLocaleString()}`}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Borrow;
