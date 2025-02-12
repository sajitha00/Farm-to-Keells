import { useState } from "react";
import FarmerRegister from "./components/FarmerRegister";
import Home from "./components/Home";
import Footer from "./components/footer";
import Navbar from "./components/Navbar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import FarmerLogin from "./components/FarmerLogin";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Navbar />
      {/* <FarmerRegister /> */}
      {/* <Home /> */}
      {/* <FarmerLogin /> */}
      {/* <Footer /> */}
    </>
  );
}

export default App;
