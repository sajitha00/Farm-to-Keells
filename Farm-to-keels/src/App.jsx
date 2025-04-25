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
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ManageProfile from "./pages/ManageProfile";
import ViewFarmers from "./pages/ViewFarmer";
import ViewPlacedOrders from "./pages/ViewPlacedOrders";
import AboutUs from "./pages/AboutUs";
import FarmerNotification from "./pages/FarmerNotification";
import Analytics from "./pages/Analytics";
import Payment from "./pages/Payment";
import FarmerPayments from "./pages/FarmerPayments";
import SuperMarketNotification from "./pages/SuperMarketNotification";
import emailjs from "@emailjs/browser";

// Initialize EmailJS with your Public Key
emailjs.init("C4aRx3HcJU1ycYJqk"); // Replace with your EmailJS Public Key

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
            <Route path="/ViewFarmer" element={<ViewFarmers />} />
            <Route path="/ViewPlacedOrders" element={<ViewPlacedOrders />} />
            <Route path="/AboutUs" element={<AboutUs />} />
            <Route
              path="/FarmerNotification"
              element={<FarmerNotification />}
            />
            <Route path="/Analytics" element={<Analytics />} />
            <Route path="/Payment" element={<Payment />} />
            <Route path="/FarmerPayments" element={<FarmerPayments />} />
            <Route
              path="/SuperMarketNotification"
              element={<SuperMarketNotification />}
            />
          </Routes>
        </BrowserRouter>
      </FarmerProvider>
    </QueryClientProvider>
  );
}

export default App;
