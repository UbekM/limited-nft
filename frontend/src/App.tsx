/** @format */

import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Gallery from "./pages/Gallery";
import Minted from "./pages/Minted";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/minted" element={<Minted />} />
      </Routes>
    </>
  );
}

export default App;
