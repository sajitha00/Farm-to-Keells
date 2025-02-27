import { useState } from "react";
import FarmerRegister from "./pages/FarmerRegister";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AdminLogin from "./pages/AdminLogin";
import Footer from "./components/footer";
import Navbar from "./components/Navbar";
import FarmerLogin from "./pages/FarmerLogin";
import FarmerDashboard from "./pages/FarmerDashboard";
import AddProducts from "./pages/AddProducts";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Navbar />
      {/* <FarmerRegister /> */}
      {/* <Home /> */}
      {/* <FarmerLogin /> */}
      {/* <FarmerDashboard /> */}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/FarmerRegister" element={<FarmerRegister />} />
          <Route path="/FarmerLogin" element={<FarmerLogin />} />
          <Route path="/FarmerDashboard" element={<FarmerDashboard />} />
          <Route path="/AddProducts" element={<AddProducts />} />
          <Route path="/AdminLogin" element={<AdminLogin />} />
        </Routes>
      </BrowserRouter>
      {/* <AddProducts /> */}
      {/* <Footer /> */}
    </>
  );
}

export default App;
