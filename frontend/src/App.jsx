// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import MapPage from "./pages/MapPage";   // ← import MapPage

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Landing Page */}
        <Route path="/" element={<Landing />} />

        {/* Map Page */}
        <Route path="/map" element={<MapPage />} />
      </Routes>
    </BrowserRouter>
  );
}
