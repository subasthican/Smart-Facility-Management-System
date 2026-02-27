import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";

function App() {
  return (
    <Router>
      {/* Navigation Bar */}
      <Navbar />

      {/* Routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        {/* You can add more routes later, e.g., Dashboard, Booking, etc. */}
      </Routes>
    </Router>
  );
}

export default App;
