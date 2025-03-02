import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Contact from "./pages/Contact";
import Home from "./pages/Home";
import FarmerRegister from "./pages/FarmerRegister";
import FarmerLogin from "./pages/FarmerLogin";
import FarmerDashboard from "./pages/FarmerDashboard";
import AddProducts from "./pages/AddProducts";
import AdminLogin from "./pages/AdminLogin";
import { FarmerProvider } from "./context/FarmerProvider";

function App() {
  return (
    <FarmerProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/FarmerRegister" element={<FarmerRegister />} />
          <Route path="/FarmerLogin" element={<FarmerLogin />} />
          <Route path="/FarmerDashboard" element={<FarmerDashboard />} />
          <Route path="/AddProducts" element={<AddProducts />} />
          <Route path="/AdminLogin" element={<AdminLogin />} />
          <Route path="/Contact" element={<Contact />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </FarmerProvider>
  );
}

export default App;
