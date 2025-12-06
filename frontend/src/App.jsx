// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Root route shows the Landing page */}
        <Route path="/" element={<Landing />} />

        {/* Optional: keep a catch-all that redirects to landing */}
        <Route path="*" element={<Landing />} />
      </Routes>
    </BrowserRouter>
  );
}
