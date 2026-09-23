import { Routes, Route, Navigate } from 'react-router-dom';

import CustomerLayout from './layouts/CustomerLayout.jsx';
import AdminLayout from './layouts/AdminLayout.jsx';
import { CustomerRoute, AdminRoute } from './components/common/ProtectedRoute.jsx';

import Home from './pages/Home.jsx';
import NotFound from './pages/NotFound.jsx';

import CustomerLogin from './pages/auth/CustomerLogin.jsx';
import CustomerRegister from './pages/auth/CustomerRegister.jsx';
import ForgotPassword from './pages/auth/ForgotPassword.jsx';
import AdminLogin from './pages/auth/AdminLogin.jsx';

import CustomerHome from './pages/customer/CustomerHome.jsx';
import Destinations from './pages/customer/Destinations.jsx';
import DestinationDetails from './pages/customer/DestinationDetails.jsx';
import Packages from './pages/customer/Packages.jsx';
import PackageDetails from './pages/customer/PackageDetails.jsx';
import CustomizePackage from './pages/customer/CustomizePackage.jsx';
import Booking from './pages/customer/Booking.jsx';
import Payment from './pages/customer/Payment.jsx';
import BookingConfirmation from './pages/customer/BookingConfirmation.jsx';
import MyBookings from './pages/customer/MyBookings.jsx';
import Profile from './pages/customer/Profile.jsx';
import Settings from './pages/customer/Settings.jsx';

import Dashboard from './pages/admin/Dashboard.jsx';
import AdminDestinations from './pages/admin/AdminDestinations.jsx';
import AdminHotels from './pages/admin/AdminHotels.jsx';
import AdminTransport from './pages/admin/AdminTransport.jsx';
import AdminPackages from './pages/admin/AdminPackages.jsx';
import AdminBookings from './pages/admin/AdminBookings.jsx';
import AdminCustomers from './pages/admin/AdminCustomers.jsx';
import AdminAnalytics from './pages/admin/AdminAnalytics.jsx';

export default function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<CustomerLogin />} />
      <Route path="/register" element={<CustomerRegister />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* Customer routes (protected, share CustomerLayout) */}
      <Route
        path="/customer"
        element={
          <CustomerRoute>
            <CustomerLayout />
          </CustomerRoute>
        }
      >
        <Route index element={<Navigate to="home" replace />} />
        <Route path="home" element={<CustomerHome />} />
        <Route path="destinations" element={<Destinations />} />
        <Route path="destinations/:id" element={<DestinationDetails />} />
        <Route path="packages" element={<Packages />} />
        <Route path="packages/:id" element={<PackageDetails />} />
        <Route path="customize-package" element={<CustomizePackage />} />
        <Route path="booking" element={<Booking />} />
        <Route path="payment" element={<Payment />} />
        <Route path="booking-confirmation" element={<BookingConfirmation />} />
        <Route path="bookings" element={<MyBookings />} />
        <Route path="profile" element={<Profile />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      {/* Admin routes (protected, share AdminLayout) */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="destinations" element={<AdminDestinations />} />
        <Route path="hotels" element={<AdminHotels />} />
        <Route path="transport" element={<AdminTransport />} />
        <Route path="packages" element={<AdminPackages />} />
        <Route path="bookings" element={<AdminBookings />} />
        <Route path="customers" element={<AdminCustomers />} />
        <Route path="analytics" element={<AdminAnalytics />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}