import { useState } from "react";
import FarmerRegister from "./components/FarmerRegister";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import AdminLogin from "./components/AdminLogin";
import Footer from "./components/footer";
import Navbar from "./components/Navbar";
import FarmerLogin from "./components/FarmerLogin";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Navbar />
      {/* <FarmerRegister /> */}
      {/* <Home /> */}
      {/* <FarmerLogin /> */}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/FarmerRegister" element={<FarmerRegister />} />
          <Route path="/FarmerLogin" element={<FarmerLogin />} />
          <Route path="/AdminLogin" element={<AdminLogin />} />
        </Routes>
      </BrowserRouter>
      {/* <Footer /> */}
    </>
  );
}

export default App;
