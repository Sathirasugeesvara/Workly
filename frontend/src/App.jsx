import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Contact from './pages/Contact';
import AiBot from './pages/AiBot';
import About from './pages/About';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Cookies from './pages/Cookies';
import Blog from './pages/Blog';
import Services from './pages/Services';
import Providers from './pages/Providers';
import Profile from './pages/Profile';
import Request from './pages/Request';
import History from './pages/History';
import Unauthorized from "./pages/Unauthorized";

import AdminDashboard from "./pages/AdminDashboard";
import AdminPendingVerifications from './pages/AdminPendingVerifications';
import AdminCustomers from './pages/AdminCustomers';
import AdminProviders from './pages/AdminProviders';
import AdminServices from './pages/AdminServices';

import CustomerDashboard from "./pages/CustomerDashboard";

import ProviderDashboard from "./pages/ProviderDashboard";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/aibot" element={<AiBot />} />
        <Route path="/about" element={<About />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/cookies" element={<Cookies />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/services" element={<Services />} />
        <Route path="/providers" element={<Providers />} />
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="/request/:providerId" element={<Request />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        
        <Route
                  path="/history"
                  element={
                    <ProtectedRoute>
                      <History />
                    </ProtectedRoute>
                  }
                />
        
                <Route
                  path="/customer/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={["CUSTOMER"]}>
                      <CustomerDashboard />
                    </ProtectedRoute>
                  }
                />
        
                <Route
                  path="/provider/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={["PROVIDER"]}>
                      <ProviderDashboard />
                    </ProtectedRoute>
                  }
                />
        
                <Route
                  path="/admin/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={["ADMIN"]}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
        
                <Route
                  path="/admin/pending-verifications"
                  element={
                    <ProtectedRoute allowedRoles={["ADMIN"]}>
                      <AdminPendingVerifications />
                    </ProtectedRoute>
                  }
                />
        
                <Route
                  path="/admin/customers"
                  element={
                    <ProtectedRoute allowedRoles={["ADMIN"]}>
                      <AdminCustomers />
                    </ProtectedRoute>
                  }
                />
        
                <Route
                  path="/admin/providers"
                  element={
                    <ProtectedRoute allowedRoles={["ADMIN"]}>
                      <AdminProviders />
                    </ProtectedRoute>
                  }
                />
        
                <Route
                  path="/admin/services"
                  element={
                    <ProtectedRoute allowedRoles={["ADMIN"]}>
                      <AdminServices />
                    </ProtectedRoute>
                  }
                />
        
                {/* other routes like /forgot-password, etc. */}
              </Routes>
            </BrowserRouter>
          );
        }
        
        export default App;