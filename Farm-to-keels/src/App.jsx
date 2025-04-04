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
import SuperMarketDashboard from "./pages/SuperMarketDashboard";
import { FarmerProvider } from "./context/FarmerProvider";
import ViewProduct from "./pages/ViewProduct";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ManageProfile from "./pages/ManageProfile";
import ViewFarmers from "./pages/ViewFarmer";
const queryClient = new QueryClient();
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      
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
          <Route
            path="/SuperMarketDashboard"
            element={<SuperMarketDashboard />}
          />
          <Route path="/ViewProduct" element={<ViewProduct />} />
          <Route path="/ManageProfile" element={<ManageProfile />} />
        </Routes>
        {/* <ViewProduct /> */}
        {/* <SuperMarketDashboard /> */}
        {/* <Footer /> */}
        {/* <ViewFarmers /> */}
      </BrowserRouter>
    </FarmerProvider>
    </QueryClientProvider>
  );
}

export default App;
