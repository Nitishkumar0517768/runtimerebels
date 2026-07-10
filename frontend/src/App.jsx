import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Approvals from "./pages/Approvals";

export default function App() {
  return (
    <BrowserRouter>
      <div style={{ minHeight: "100vh" }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/approvals" element={<Approvals />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
