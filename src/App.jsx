import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ManomilanLogin from "./components/CommonPages/login";
import ProfileDashboard from "./components/UsersFrontend/ProfileDashboard";
import ProfileDetailsPage from "./components/UsersFrontend/ProfileDetail";
import FranchiseDashboard from "./components/FranchiseFrontend/FranchiseDashboard";
import DistributorDashboard from "./components/DistributorFrontend/DistributorDashboard";
import AdminDashboard from "./components/AdminFrontend/AdminDashboard";
import BiodataGenerator from "./components/UsersFrontend/BioData";
import QuickSearchCards from "./components/UsersFrontend/QuickSearch";
import FranchiseFinder from "./components/UsersFrontend/FranchiseFinder";
import SuccessStories from "./components/UsersFrontend/SuccessStories";
import FranchiseDetails from "./components/UsersFrontend/FranchiseDetails";
import CountrySettings from "./components/AdminFrontend/CountrySetting";
import FranchiseRegistrationForm from "./components/FranchiseFrontend/FranchiseRegister";
import DistributorRegistrationForm from "./components/DistributorFrontend/DistributorRegister";
import AdminRegister from "./components/AdminFrontend/AdminRegister";
import Register from "./components/UsersFrontend/Register";
import BiodataProfile from "./components/UsersFrontend/BioData";
import { ToastContainer } from "react-toastify";
import DetailsPage from "./components/AdminFrontend/DetailsPage";
import { Navigate, useLocation } from "react-router-dom";
import TermsCondition from "./components/UsersFrontend/TermsCondition";
import About from "./components/UsersFrontend/AboutPage";
import Contact from "./components/UsersFrontend/ContactPage";
import ForgotPassword from "./components/UsersFrontend/ForgotPassword";
import ForgotAdminPass from "./components/AdminFrontend/ForgotAdminPass";
import ForgotDistPass from "./components/DistributorFrontend/ForgotDistPass";
import ForgotFranchisePass from "./components/FranchiseFrontend/ForgotFranchisePass";
import PageNotFound from "./components/CommonPages/PageNotFound";

const sampleBioData = {
  firstName: "Alkesh",
  midname: "Kumar",
  lastName: "Xy",
  dob: "1995-06-15",
  height: "5'9\"",
  caste: "Deshastha-kunbi-maratha",
  children: [{ name: "helo", age: 4 }],
  sect: "Malkari",
  education: [
    { degree: "CA", category: "Prof. Courses" },
    { degree: "CS", category: "Prof. Courses" },
    { degree: "MBA", category: "Management" },
  ],
  parentsCity: "Nagpur, Maharashtra, India",
  ageFrom: 25,
  ageTo: 30,
  expectedMaritalStatus: "Unmarried",
  heightFrom: "5'4\"",
  heightTo: "6'0\"",
  expectedOccupation: "Software Engineer",
  expectedIncome: "Above ₹10,000",
  parentsContact: "9876543210",
  parentsResidence: "Kachipura",
  candidateEmail: "alkesh@example.com",
  loginEmail: "alkesh@login.com",
  gender: "Male",
  maritalStatus: "married",
  occupation: "Private Services",
  monthlyIncome: "80000",
  motherTongue: "Marathi",
  placeOfBirth: "Nagpur, Maharashtra, India",
  manglik: "Manglik",
  timeOfBirth: "12:00 PM",
  brothers: 1,
  sisters: 2,
  mamkul: "Punear",
};

const tokenMap = {
  "/franchise": "franchiseToken",
  "/distributor": "distributorToken",
  "/admin": "adminToken",
  "/profile": "userToken",
};

function ProtectedRoute({ children, role }) {
  const location = useLocation();
  let tokenKey = tokenMap[role] || "userToken";
  const token = localStorage.getItem(tokenKey);

  if (!token) {
    // Redirect to login page based on role
    let loginPath = "/";
    if (role === "/franchise") loginPath = "/franchise/login";
    else if (role === "/distributor") loginPath = "/distributor/login";
    else if (role === "/admin") loginPath = "/admin/login";
    else loginPath = "/";

    return <Navigate to={loginPath} state={{ from: location }} replace />;
  }
  return children;
}

const App = () => {
  return (
    <Router>
      <Routes>
        {/* user pages */}
        {/* <Route path="/" element ={<PageNotFound/>}></Route> */}
        <Route path="/" element={<ManomilanLogin />}></Route>
        <Route path="/franchise-finder" element={<FranchiseFinder />}></Route>
        <Route path="/quick-search" element={<QuickSearchCards />}></Route>
        <Route path="/success-stories" element={<SuccessStories />}></Route>
        <Route path="/franchise/login" element={<ManomilanLogin />}></Route>
        <Route path="/distributor/login" element={<ManomilanLogin />}></Route>
        <Route path="/admin/login" element={<ManomilanLogin />}></Route>

        {/* protected routes */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute role="/profile">
              <ProfileDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/match-profile"
          element={
            <ProtectedRoute role="/profile">
              <ProfileDetailsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/forgot-pass"
          element={
            <ProtectedRoute role="/forgotPass">
              <ForgotPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path="/forgot-admin-pass"
          element={
            <ProtectedRoute role="/forgotAdminPass">
              <ForgotAdminPass />
            </ProtectedRoute>
          }
        />
        <Route
          path="/forgot-Dist-pass"
          element={
            <ProtectedRoute role="/forgotDistPass">
              <ForgotDistPass />
            </ProtectedRoute>
          }
        />
        <Route
          path="/forgot-Franchisee-pass"
          element={
            <ProtectedRoute role="/forgotFranchisePass">
              <ForgotFranchisePass />
            </ProtectedRoute>
          }
        />
        <Route path="/biodata/:id" element={<BiodataGenerator />} />
        <Route path="/register-user" element={<Register />} />
        <Route path="/terms" element={<TermsCondition />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route
          path="/xyz"
          element={
            <ProtectedRoute role="/profile">
              <FranchiseDetails />
            </ProtectedRoute>
          }
        />

        {/* franchise protected routes */}
        <Route
          path="/franchise/register-franchise"
          element={
            <ProtectedRoute role="/franchise">
              <FranchiseRegistrationForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/franchise/dashboard"
          element={
            <ProtectedRoute role="/franchise">
              <FranchiseDashboard />
            </ProtectedRoute>
          }
        />

        {/* distributor protected routes */}
        <Route
          path="/distributor/register-distributor"
          element={
            <ProtectedRoute role="/distributor">
              <DistributorRegistrationForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/distributor/dashboard"
          element={
            <ProtectedRoute role="/distributor">
              <DistributorDashboard />
            </ProtectedRoute>
          }
        />

        {/* admin protected routes */}
        <Route path="/admin/register-admin" element={<AdminRegister />} />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute role="/admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/update-location"
          element={
            <ProtectedRoute role="/admin">
              <CountrySettings />
            </ProtectedRoute>
          }
        />
        {/* this is the orgnl api */}
        <Route path="/admin/dashboard" element={<AdminDashboard />}></Route>
        <Route path="/admin/update-location" element={<CountrySettings />} />
        <Route
          path="/testing"
          element={<BiodataProfile bioDataDetails={sampleBioData} />}
        />
        <Route path="/details/:id" element={<DetailsPage />} />
      </Routes>
      <ToastContainer />
    </Router>
  );
};

export default App;
