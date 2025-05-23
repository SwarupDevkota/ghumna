import React from "react";
import { Route, Routes } from "react-router-dom";
import LandingPage from "./LandingPage";
import BlogsPage from "./BlogsPage";
import AboutUs from "./AboutUs";
import FAQPage from "./FAQPage";
import HotelsBooking from "./HotelsBooking";
import HotelSubmissionForm from "./Hotels/HotelSubmissionForm";
import AdminDashboard from "./AdminPanel/AdminDashboard";
import HotelRequestsPage from "./AdminPanel/HotelRequestsPage";
import Navbar from "./Navbar";
import FeedbackPage from "./AdminPanel/FeedbackPage";
import EventRegistrationPage from "./EventRegistrationPage";
import RegisteredEventsPage from "./AdminPanel/RegisteredEvents";
import VerifiedHoteliers from "./AdminPanel/VerifiedHoteliers";
import RejectedHoteliers from "./AdminPanel/RejectedHoteliers";
import LocalEventsPage from "./LocalEventsPage";
import Footer from "./Footer";
import HotelDetail from "./HotelDetail";
import RoomSelectionPage from "./Hotels/RoomSelectionPage";
import PaymentPage from "./Hotels/PaymentPage";
import Login from "./Login";
import Signup from "./Signup";
import EmailVerification from "./EmailVerification";
import ResetPassword from "./ResetPassword";
import Profile from "./profile/Profile";
import ManageUsers from "./AdminPanel/ManageUsers";
import HotelierDashboard from "./Hotelier/HotelierDashboard";
import RoomManagement from "./Hotelier/RoomManagement";
import AvailabilityDetails from "./Hotelier/AvailabilityDetails";
import HotelierBookings from "./Hotelier/HotelierBookings";
import AllBookings from "./AdminPanel/AllBookings";
import ConfirmationPage from "./Hotels/ConfirmationPage";
import FinancialLedger from "./Hotelier/FinancialLedger";
import ProtectedRoute from "./ProtectedRoute";
import HotelierRoute from "./HotelierRoute";
import AdminRoute from "./AdminRoute";
import NotFoundPage from "./NotFoundPage";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/email-verification" element={<EmailVerification />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/aboutUs" element={<AboutUs />} />
        <Route path="/fullblogs" element={<BlogsPage />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/hotel-bookings" element={<HotelsBooking />} />
        <Route path="/hoteliers-form" element={<HotelSubmissionForm />} />
        <Route path="/hotel-detail/:id" element={<HotelDetail />} />
        <Route path="/local-events" element={<LocalEventsPage />} />
        <Route path="/confirmation" element={<ConfirmationPage />} />
        <Route path="/event-registration" element={<EventRegistrationPage />} />
        {/* Booking flow - protected but doesn't require specific role */}
        <Route element={<ProtectedRoute />}>
          <Route path="/room-selection/:id" element={<RoomSelectionPage />} />
          <Route path="/payment" element={<PaymentPage />} />

          <Route path="/profile" element={<Profile />} />
        </Route>

        {/* Hotelier-only routes */}
        <Route element={<HotelierRoute />}>
          <Route path="/hotelier-dashboard" element={<HotelierDashboard />} />
          <Route path="/hotelier-rooms" element={<RoomManagement />} />
          <Route path="/hotelier-bookings" element={<HotelierBookings />} />
          <Route path="/hotel-financials" element={<FinancialLedger />} />
          <Route
            path="/hotelier/availability-details"
            element={<AvailabilityDetails />}
          />
        </Route>

        {/* Admin-only routes */}
        <Route element={<AdminRoute />}>
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/admin-bookings" element={<AllBookings />} />
          <Route path="/hotel-requests" element={<HotelRequestsPage />} />
          <Route path="/feedback-data" element={<FeedbackPage />} />
          <Route path="/registered-events" element={<RegisteredEventsPage />} />
          <Route path="/verified-hoteliers" element={<VerifiedHoteliers />} />
          <Route path="/rejected-hoteliers" element={<RejectedHoteliers />} />
          <Route path="/manage-users" element={<ManageUsers />} />
        </Route>

        {/* Fallback routes */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
