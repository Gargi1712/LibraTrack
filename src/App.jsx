import React, { useState } from "react";
import Borrow from "./components/Borrow";
import AddBorrower from "./components/AddBorrower";

const App = () => {
  const [page, setPage] = useState("borrow");

  return (
    <div style={{ display: "flex" }}>
      
      {page === "borrow" && <Borrow />}
      <AddBorrower />
    </div>
  );
};

export default App;
