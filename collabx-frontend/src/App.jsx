import React, { useState, useEffect } from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import "./services/axios-config"; // Import axios configuration

import AuthService from "./services/AuthService";

import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Home from "./pages/Home.jsx";
import Profile from "./pages/Profile.jsx";
import EventDiscovery from "./pages/EventDiscovery.jsx";
import CreateEvent from "./pages/CreateEvent.jsx";
import EditEvent from "./pages/EditEvent.jsx";
import CollegeDashboard from "./pages/CollegeDashboard.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import AdminLogin from "./pages/AdminLogin.jsx";
import AdminRegister from "./pages/AdminRegister.jsx";
import UserInfo from "./pages/UserInfo.jsx";
import EventDetails from "./pages/EventDetails.jsx";
import EventRegistration from "./pages/EventRegistration.jsx";
import RegistrationDetails from "./pages/RegistrationDetails.jsx";
import ViewRegistrations from "./pages/ViewRegistrations.jsx";

import { FaSearch, FaMapMarkerAlt, FaUserCircle, FaCrosshairs, FaCity } from "react-icons/fa";
import { MdMyLocation } from "react-icons/md";

const App = () => {
  const [currentUser, setCurrentUser] = useState(undefined);
  const [showCollegeBoard, setShowCollegeBoard] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [userLocation, setUserLocation] = useState({
    city: "Visakhapatnam",
    region: "Andhra Pradesh"
  });
  const [citySearchQuery, setCitySearchQuery] = useState("");
  const [eventSearchQuery, setEventSearchQuery] = useState("");
  const [selectedLetter, setSelectedLetter] = useState("V");

  const popularCities = [
    { city: "Ahmedabad", region: "Gujarat", image: "https://in.bmscdn.com/m6/images/common-modules/regions/ahd.png" },
    { city: "Bengaluru", region: "Karnataka", image: "https://in.bmscdn.com/m6/images/common-modules/regions/bang.png" },
    { city: "Chandigarh", region: "Punjab", image: "https://in.bmscdn.com/m6/images/common-modules/regions/chd.png" },
    { city: "Chennai", region: "Tamil Nadu", image: "https://in.bmscdn.com/m6/images/common-modules/regions/chen.png" },
    { city: "Delhi NCR", region: "Delhi", image: "https://in.bmscdn.com/m6/images/common-modules/regions/ncr.png" },
    { city: "Hyderabad", region: "Telangana", image: "https://in.bmscdn.com/m6/images/common-modules/regions/hyd.png" },
    { city: "Kolkata", region: "West Bengal", image: "https://in.bmscdn.com/m6/images/common-modules/regions/kolk.png" },
    { city: "Mumbai", region: "Maharashtra", image: "https://in.bmscdn.com/m6/images/common-modules/regions/mumbai.png" },
    { city: "Pune", region: "Maharashtra", image: "https://in.bmscdn.com/m6/images/common-modules/regions/pune.png" }
  ];

  const allCitiesList = [
    { city: "Agra", region: "Uttar Pradesh" },
    { city: "Ahmedabad", region: "Gujarat" },
    { city: "Ajmer", region: "Rajasthan" },
    { city: "Akola", region: "Maharashtra" },
    { city: "Alappuzha", region: "Kerala" },
    { city: "Aligarh", region: "Uttar Pradesh" },
    { city: "Allahabad", region: "Uttar Pradesh" },
    { city: "Alwar", region: "Rajasthan" },
    { city: "Ambala", region: "Haryana" },
    { city: "Amravati", region: "Maharashtra" },
    { city: "Amritsar", region: "Punjab" },
    { city: "Anand", region: "Gujarat" },
    { city: "Anantapur", region: "Andhra Pradesh" },
    { city: "Arrah", region: "Bihar" },
    { city: "Asansol", region: "West Bengal" },
    { city: "Aurangabad", region: "Maharashtra" },
    { city: "Bangalore", region: "Karnataka" },
    { city: "Bareilly", region: "Uttar Pradesh" },
    { city: "Belgaum", region: "Karnataka" },
    { city: "Bhagalpur", region: "Bihar" },
    { city: "Bhavnagar", region: "Gujarat" },
    { city: "Bhilai", region: "Chhattisgarh" },
    { city: "Bhilwara", region: "Rajasthan" },
    { city: "Bhiwandi", region: "Maharashtra" },
    { city: "Bhopal", region: "Madhya Pradesh" },
    { city: "Bhubaneswar", region: "Odisha" },
    { city: "Bikaner", region: "Rajasthan" },
    { city: "Bilaspur", region: "Chhattisgarh" },
    { city: "Bokaro", region: "Jharkhand" },
    { city: "Chandigarh", region: "Punjab" },
    { city: "Chennai", region: "Tamil Nadu" },
    { city: "Coimbatore", region: "Tamil Nadu" },
    { city: "Cuttack", region: "Odisha" },
    { city: "Dehradun", region: "Uttarakhand" },
    { city: "Delhi", region: "Delhi" },
    { city: "Dhanbad", region: "Jharkhand" },
    { city: "Durgapur", region: "West Bengal" },
    { city: "Erode", region: "Tamil Nadu" },
    { city: "Faridabad", region: "Haryana" },
    { city: "Firozabad", region: "Uttar Pradesh" },
    { city: "Gandhinagar", region: "Gujarat" },
    { city: "Ghaziabad", region: "Uttar Pradesh" },
    { city: "Gopalpur", region: "Odisha" },
    { city: "Gorakhpur", region: "Uttar Pradesh" },
    { city: "Gulbarga", region: "Karnataka" },
    { city: "Guntur", region: "Andhra Pradesh" },
    { city: "Gurgaon", region: "Haryana" },
    { city: "Guwahati", region: "Assam" },
    { city: "Gwalior", region: "Madhya Pradesh" },
    { city: "Haldia", region: "West Bengal" },
    { city: "Howrah", region: "West Bengal" },
    { city: "Hubli", region: "Karnataka" },
    { city: "Hyderabad", region: "Telangana" },
    { city: "Imphal", region: "Manipur" },
    { city: "Indore", region: "Madhya Pradesh" },
    { city: "Jabalpur", region: "Madhya Pradesh" },
    { city: "Jaipur", region: "Rajasthan" },
    { city: "Jalandhar", region: "Punjab" },
    { city: "Jalgaon", region: "Maharashtra" },
    { city: "Jammu", region: "Jammu and Kashmir" },
    { city: "Jamnagar", region: "Gujarat" },
    { city: "Jamshedpur", region: "Jharkhand" },
    { city: "Jhansi", region: "Uttar Pradesh" },
    { city: "Jodhpur", region: "Rajasthan" },
    { city: "Junagadh", region: "Gujarat" },
    { city: "Kakinada", region: "Andhra Pradesh" },
    { city: "Kalyan", region: "Maharashtra" },
    { city: "Kannur", region: "Kerala" },
    { city: "Kanpur", region: "Uttar Pradesh" },
    { city: "Kochi", region: "Kerala" },
    { city: "Kolhapur", region: "Maharashtra" },
    { city: "Kolkata", region: "West Bengal" },
    { city: "Kollam", region: "Kerala" },
    { city: "Kota", region: "Rajasthan" },
    { city: "Kottayam", region: "Kerala" },
    { city: "Kozhikode", region: "Kerala" },
    { city: "Kurnool", region: "Andhra Pradesh" },
    { city: "Lucknow", region: "Uttar Pradesh" },
    { city: "Ludhiana", region: "Punjab" },
    { city: "Madurai", region: "Tamil Nadu" },
    { city: "Malappuram", region: "Kerala" },
    { city: "Mangalore", region: "Karnataka" },
    { city: "Mathura", region: "Uttar Pradesh" },
    { city: "Meerut", region: "Uttar Pradesh" },
    { city: "Moradabad", region: "Uttar Pradesh" },
    { city: "Mumbai", region: "Maharashtra" },
    { city: "Muzaffarnagar", region: "Uttar Pradesh" },
    { city: "Muzaffarpur", region: "Bihar" },
    { city: "Mysore", region: "Karnataka" },
    { city: "Nadiad", region: "Gujarat" },
    { city: "Nagpur", region: "Maharashtra" },
    { city: "Nanded", region: "Maharashtra" },
    { city: "Nashik", region: "Maharashtra" },
    { city: "Nellore", region: "Andhra Pradesh" },
    { city: "Nizamabad", region: "Telangana" },
    { city: "Noida", region: "Uttar Pradesh" },
    { city: "Palakkad", region: "Kerala" },
    { city: "Panihati", region: "West Bengal" },
    { city: "Panipat", region: "Haryana" },
    { city: "Parbhani", region: "Maharashtra" },
    { city: "Patiala", region: "Punjab" },
    { city: "Patna", region: "Bihar" },
    { city: "Pondicherry", region: "Puducherry" },
    { city: "Pune", region: "Maharashtra" },
    { city: "Raipur", region: "Chhattisgarh" },
    { city: "Rajkot", region: "Gujarat" },
    { city: "Ranchi", region: "Jharkhand" },
    { city: "Ratlam", region: "Madhya Pradesh" },
    { city: "Raurkela", region: "Odisha" },
    { city: "Rohtak", region: "Haryana" },
    { city: "Saharanpur", region: "Uttar Pradesh" },
    { city: "Salem", region: "Tamil Nadu" },
    { city: "Sangli", region: "Maharashtra" },
    { city: "Satara", region: "Maharashtra" },
    { city: "Shimla", region: "Himachal Pradesh" },
    { city: "Siliguri", region: "West Bengal" },
    { city: "Solapur", region: "Maharashtra" },
    { city: "Srinagar", region: "Jammu and Kashmir" },
    { city: "Surat", region: "Gujarat" },
    { city: "Thane", region: "Maharashtra" },
    { city: "Thiruvananthapuram", region: "Kerala" },
    { city: "Thrissur", region: "Kerala" },
    { city: "Tiruchirappalli", region: "Tamil Nadu" },
    { city: "Tirunelveli", region: "Tamil Nadu" },
    { city: "Tiruppur", region: "Tamil Nadu" },
    { city: "Ujjain", region: "Madhya Pradesh" },
    { city: "Vadakara", region: "Kerala" },
    { city: "Vadakkencherry", region: "Kerala" },
    { city: "Vadalur", region: "Tamil Nadu" },
    { city: "Vadipatti", region: "Tamil Nadu" },
    { city: "Vadodara", region: "Gujarat" },
    { city: "Vaikom", region: "Kerala" },
    { city: "Valparai", region: "Tamil Nadu" },
    { city: "Valsad", region: "Gujarat" },
    { city: "Vaniyambadi", region: "Tamil Nadu" },
    { city: "Vapi", region: "Gujarat" },
    { city: "Varanasi", region: "Uttar Pradesh" },
    { city: "Varkala", region: "Kerala" },
    { city: "Vasai", region: "Maharashtra" },
    { city: "Vasco da Gama", region: "Goa" },
    { city: "Vellore", region: "Tamil Nadu" },
    { city: "Veraval", region: "Gujarat" },
    { city: "Vidisha", region: "Madhya Pradesh" },
    { city: "Vijayawada", region: "Andhra Pradesh" },
    { city: "Visakhapatnam", region: "Andhra Pradesh" },
    { city: "Vizianagaram", region: "Andhra Pradesh" },
    { city: "Vyara", region: "Gujarat" },
    { city: "Warangal", region: "Telangana" }
  ];

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  useEffect(() => {
    // Set initial selected letter based on available data or default to 'A'
    if (allCitiesList.length > 0) {
      setSelectedLetter("A");
    }
  }, []);

  const location = useLocation();
  const isAuthPage = location.pathname === "/login" || location.pathname === "/register";
  const isUserInfoPage = location.pathname === "/user-info";
  const isCreateEventPage = location.pathname === "/create-event";
  const isEditEventPage = location.pathname.startsWith("/edit-event/");

  useEffect(() => {
    // Detect user location
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`,
              {
                headers: {
                  "User-Agent": "CollabX-App"
                }
              }
            );
            const data = await response.json();
            const city = data.address.city || data.address.town || data.address.village || "Visakhapatnam";
            const state = data.address.state || "Andhra Pradesh";
            setUserLocation({ city, region: state });
          } catch (error) {
            console.error("Error fetching location details:", error);
          }
        },
        (error) => {
          console.error("Error getting geolocation:", error);
        }
      );
    }

    const user = AuthService.getCurrentUser();

    if (user) {
      setCurrentUser(user);
      setShowCollegeBoard(user.roles.includes("ROLE_COLLEGE") || user.roles.some(role => role.startsWith("ROLE_ESP_")));
    }
  }, []);

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const logOut = () => {
    AuthService.logout();
    setCurrentUser(undefined);
    setShowCollegeBoard(false);
    setIsProfileOpen(false);
  };

  return (
    <div className="app-wrapper">
      <nav className="navbar navbar-expand-lg navbar-light custom-navbar sticky-top">
        <div className="container-fluid d-flex align-items-center">
          {/* Logo Section */}
          <Link to={"/"} className="navbar-brand d-flex flex-column lh-1 me-3">
            <span className="fw-bold" style={{ fontSize: "1.6rem", letterSpacing: "-1px" }}>Collab<span className="text-primary">X</span></span>
          </Link>

          {/* Location Section */}
          <div 
            className="d-flex align-items-center ms-2 me-4 border-start ps-3 d-none d-md-flex" 
            style={{ height: "32px", borderColor: "#eee !important", cursor: "pointer" }}
            onClick={() => setIsLocationModalOpen(true)}
          >
            <FaMapMarkerAlt className="text-primary me-2" style={{ fontSize: "1.1rem" }} />
            <div className="d-flex flex-column lh-1">
              <span className="fw-bold" style={{ fontSize: "0.9rem" }}>{userLocation.city}</span>
              <span className="text-muted" style={{ fontSize: "0.7rem" }}>{userLocation.region}</span>
            </div>
          </div>

          {/* Search Bar - Right Side */}
          <div className="search-container d-none d-md-block ms-auto" style={{ maxWidth: "450px" }}>
            <FaSearch className="position-absolute translate-middle-y top-50 ms-3 text-muted" style={{ zIndex: "10" }} />
            <input
              type="text"
              className="search-input w-100 ps-5 py-2"
              placeholder="search for events, hackathons and workshops"
              style={{ borderRadius: "15px", border: "1px solid #ddd", backgroundColor: "#fff", fontSize: "0.85rem", boxShadow: "none" }}
              value={eventSearchQuery}
              onChange={(e) => setEventSearchQuery(e.target.value)}
            />
          </div>

          {/* User Profile / Auth Section */}
          <div className="d-flex align-items-center ms-3">
            {currentUser ? (
              <button onClick={toggleProfile} className="btn btn-link p-0 nav-link border-0">
                <div className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold"
                  style={{ width: "40px", height: "40px", backgroundColor: "#001f3f", fontSize: "1.1rem" }}>
                  {currentUser.username.charAt(0).toUpperCase()}
                </div>
              </button>
            ) : (
              <div className="d-flex align-items-center">
                <Link to={"/admin-login"} className="nav-link btn-login fw-bold me-2">Admin</Link>
                <Link to={"/login"} className="nav-link btn-login fw-bold">Login</Link>
                <Link to={"/register"} className="nav-link btn-register ms-2">Sign Up</Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      <main className={(isUserInfoPage || isCreateEventPage || isEditEventPage) ? "" : "content-area"}>
        <Routes>
          <Route path="/" element={<Home searchQuery={eventSearchQuery} />} />
          <Route path="/home" element={<Home searchQuery={eventSearchQuery} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/events" element={<EventDiscovery searchQuery={eventSearchQuery} />} />
          <Route path="/create-event" element={<CreateEvent />} />
          <Route path="/edit-event/:id" element={<EditEvent />} />
          <Route path="/college" element={<CollegeDashboard searchQuery={eventSearchQuery} />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin-register" element={<AdminRegister />} />
          <Route path="/user-info" element={<UserInfo />} />
          <Route path="/event/:id" element={<EventDetails />} />
          <Route path="/register-event/:id" element={<EventRegistration />} />
          <Route path="/registration-details/:id" element={<RegistrationDetails />} />
          <Route path="/view-registrations/:eventId" element={<ViewRegistrations />} />
        </Routes>
      </main>

      {/* Profile Drawer Overlay */}
      {isProfileOpen && (
        <div className="drawer-overlay" onClick={toggleProfile}></div>
      )}

      {/* Profile Drawer */}
      <div className={`profile-drawer ${isProfileOpen ? "open" : ""}`}>
        <Profile onClose={toggleProfile} />
      </div>

      {/* Location Selection Modal */}
      {isLocationModalOpen && (
        <div 
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" 
          style={{ zIndex: 2000, backgroundColor: "rgba(0,0,0,0.5)" }}
          onClick={() => setIsLocationModalOpen(false)}
        >
          <div 
            className="bg-white rounded-4 p-3 shadow-lg overflow-auto hide-scrollbar" 
            style={{ width: "90%", maxWidth: "700px", maxHeight: "85vh" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="mb-0 fw-bold text-dark opacity-75">Select Location</h5>
              <button 
                className="btn-close" 
                onClick={() => setIsLocationModalOpen(false)}
              ></button>
            </div>

            {/* Search Bar */}
            <div className="position-relative mb-3">
              <input 
                type="text" 
                className="form-control py-1 ps-3 pe-5 border-light-subtle rounded-4" 
                placeholder="Search city, area or locality"
                style={{ fontSize: "0.85rem" }}
                value={citySearchQuery}
                onChange={(e) => setCitySearchQuery(e.target.value)}
              />
              {citySearchQuery && (
                <button 
                  className="position-absolute end-0 top-50 translate-middle-y btn border-0 pe-3"
                  style={{ zIndex: 10 }}
                  onClick={() => setCitySearchQuery("")}
                >
                  <span className="text-muted fs-4">×</span>
                </button>
              )}
            </div>

            {citySearchQuery ? (
              <div className="search-results-list overflow-auto hide-scrollbar" style={{ maxHeight: "60vh" }}>
                {allCitiesList
                  .filter(c => 
                    c.city.toLowerCase().includes(citySearchQuery.toLowerCase()) || 
                    c.region.toLowerCase().includes(citySearchQuery.toLowerCase())
                  )
                  .map((loc, index) => (
                    <div 
                      key={index} 
                      className="d-flex align-items-center p-2 cursor-pointer rounded-3 mb-1 location-result-item"
                      onClick={() => {
                        setUserLocation(loc);
                        setIsLocationModalOpen(false);
                        setCitySearchQuery("");
                      }}
                    >
                      <FaMapMarkerAlt className="text-muted me-3" style={{ fontSize: "1.1rem" }} />
                      <div className="d-flex flex-column">
                        <span className="fw-bold text-dark" style={{ fontSize: "0.95rem" }}>{loc.city}</span>
                        <span className="text-muted" style={{ fontSize: "0.75rem" }}>{loc.city}, {loc.region}</span>
                      </div>
                    </div>
                  ))
                }
                {allCitiesList.filter(c => 
                    c.city.toLowerCase().includes(citySearchQuery.toLowerCase()) || 
                    c.region.toLowerCase().includes(citySearchQuery.toLowerCase())
                  ).length === 0 && (
                    <div className="text-center py-4 text-muted">No cities found matching "{citySearchQuery}"</div>
                  )
                }
              </div>
            ) : (
              <>
                {/* Detect Location */}
                <div 
                  className="d-flex align-items-center text-primary mb-3 cursor-pointer" 
                  style={{ fontSize: "0.85rem", fontWeight: "600" }}
                  onClick={() => {
                    if ("geolocation" in navigator) {
                      navigator.geolocation.getCurrentPosition(
                        async (position) => {
                          const { latitude, longitude } = position.coords;
                          try {
                            const response = await fetch(
                              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`,
                              { headers: { "User-Agent": "CollabX-App" } }
                            );
                            const data = await response.json();
                            const city = data.address.city || data.address.town || data.address.village || "Visakhapatnam";
                            const state = data.address.state || "Andhra Pradesh";
                            setUserLocation({ city, region: state });
                            setIsLocationModalOpen(false);
                          } catch (error) {
                            console.error("Error fetching location details:", error);
                          }
                        },
                        (error) => console.error("Error getting geolocation:", error)
                      );
                    }
                  }}
                >
                  <MdMyLocation className="me-2" style={{ fontSize: "1.2rem" }} />
                  Use Current Location
                </div>

                {/* Popular Cities */}
                <div className="mb-4">
                  <h6 className="fw-bold mb-3 text-dark opacity-75" style={{ fontSize: "0.9rem" }}>Popular Cities</h6>
                  <div className="row g-2 row-cols-2 row-cols-sm-3 row-cols-md-4 row-cols-lg-6">
                    {popularCities.map((loc, index) => (
                      <div key={index} className="col">
                        <div 
                          className={`city-card p-2 border rounded-4 text-center cursor-pointer h-100 d-flex flex-column align-items-center justify-content-center ${userLocation.city === loc.city ? 'active' : ''}`}
                          onClick={() => {
                            setUserLocation(loc);
                            setIsLocationModalOpen(false);
                          }}
                        >
                          <div className="city-image-wrapper mb-1">
                            <img src={loc.image} alt={loc.city} className="img-fluid" style={{ width: "60px", height: "60px", objectFit: "contain" }} />
                          </div>
                          <span className="small fw-semibold city-name text-nowrap" style={{ fontSize: "0.75rem" }}>{loc.city}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* All Cities */}
                <div className="mb-2">
                  <h6 className="fw-bold mb-3 text-dark opacity-75" style={{ fontSize: "0.9rem" }}>All Cities</h6>
                  
                  {/* Alphabet Strip */}
                  <div className="d-flex flex-wrap gap-1 mb-4 border-bottom pb-3">
                    {alphabet.map(letter => (
                      <span 
                        key={letter} 
                        className={`cursor-pointer small px-1 ${selectedLetter === letter ? 'text-primary fw-bold border-bottom border-primary border-2' : 'text-muted'}`}
                        style={{ fontSize: "0.7rem", minWidth: "18px", textAlign: "center" }}
                        onClick={() => setSelectedLetter(letter)}
                      >
                        {letter}
                      </span>
                    ))}
                  </div>

                  {/* Cities List */}
                  <div className="row g-3">
                    {allCitiesList.filter(c => c.city.startsWith(selectedLetter)).map((loc, index) => (
                      <div key={index} className="col-md-3 col-sm-6">
                        <div 
                          className="cursor-pointer py-1 hover-text-primary small"
                          onClick={() => {
                            setUserLocation(loc);
                            setIsLocationModalOpen(false);
                          }}
                        >
                          {loc.city}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {!currentUser && !isCreateEventPage && !isEditEventPage && (
        <footer className="footer mt-5">
          <div className="container">
            <div className="row">
              <div className="col-lg-3 col-md-6 mb-4">
                <h6 className="fw-bold mb-3 small text-uppercase">Collab<span className="text-primary">X</span></h6>
                <p className="text-muted" style={{ fontSize: "0.75rem", lineHeight: "1.6" }}>Discover the best academic, technical, and cultural events in your CollabX.</p>
              </div>
              <div className="col-lg-2 col-md-3 mb-4">
                <h6 className="fw-bold mb-3 small text-uppercase">Categories</h6>
                <ul className="list-unstyled">
                  <li><Link to="/" className="footer-link" style={{ fontSize: "0.75rem" }}>Academic</Link></li>
                  <li><Link to="/" className="footer-link" style={{ fontSize: "0.75rem" }}>Technical</Link></li>
                  <li><Link to="/" className="footer-link" style={{ fontSize: "0.75rem" }}>Workshops</Link></li>
                  <li><Link to="/" className="footer-link" style={{ fontSize: "0.75rem" }}>Hackathons</Link></li>
                </ul>
              </div>
              <div className="col-lg-2 col-md-3 mb-4">
                <h6 className="fw-bold mb-3 small text-uppercase">For You</h6>
                <ul className="list-unstyled">
                  <li><Link to="/" className="footer-link" style={{ fontSize: "0.75rem" }}>Academic Events</Link></li>
                  <li><Link to="/" className="footer-link" style={{ fontSize: "0.75rem" }}>Technical Events</Link></li>
                  <li><Link to="/" className="footer-link" style={{ fontSize: "0.75rem" }}>Cultural Events</Link></li>
                  <li><Link to="/" className="footer-link" style={{ fontSize: "0.75rem" }}>Workshops</Link></li>
                  <li><Link to="/" className="footer-link" style={{ fontSize: "0.75rem" }}>Sports</Link></li>
                </ul>
              </div>
              <div className="col-lg-2 col-md-6 mb-4">
                <h6 className="fw-bold mb-3 small text-uppercase">Support</h6>
                <ul className="list-unstyled">
                  <li><Link to="/" className="footer-link" style={{ fontSize: "0.75rem" }}>Terms</Link></li>
                  <li><Link to="/" className="footer-link" style={{ fontSize: "0.75rem" }}>Privacy</Link></li>
                  <li><Link to="/" className="footer-link" style={{ fontSize: "0.75rem" }}>Contact</Link></li>
                </ul>
              </div>
              <div className="col-lg-3 col-md-6 mb-4">
                <h6 className="fw-bold mb-3 small text-uppercase">Download App</h6>
                <div className="bg-white p-2 rounded d-inline-block border">
                  <img src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=https://collabx.com" alt="QR Code" style={{ width: "60px" }} />
                </div>
              </div>
            </div>
            <hr className="my-3" />
            <div className="d-flex justify-content-between align-items-center flex-wrap">
              <p className="mb-0 text-muted" style={{ fontSize: "0.7rem" }}>&copy; 2026 Collab<span className="text-primary">X</span>. All rights reserved.</p>
              <div className="text-muted" style={{ fontSize: "0.7rem" }}>Made for college Collaboration with Collab<span className="text-primary">X</span></div>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export default App;
