import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import EventService from "../services/EventService";
import AuthService from "../services/AuthService";
import { FaGraduationCap, FaCode, FaTheaterMasks, FaLightbulb, FaBriefcase, FaTrophy, FaUsers, FaThLarge, FaClock, FaCalendarAlt, FaEdit } from "react-icons/fa";

const Home = ({ searchQuery = "" }) => {
  const [realEvents, setRealEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const currentUser = AuthService.getCurrentUser();
  const isCollege = currentUser && currentUser.roles.includes("ROLE_COLLEGE");

  const filteredEvents = realEvents.filter(event => {
    const query = searchQuery.toLowerCase();
    return (
      event.title?.toLowerCase().includes(query) ||
      event.category?.toLowerCase().includes(query) ||
      event.type?.toLowerCase().includes(query)
    );
  });

  useEffect(() => {
    EventService.getAllEvents().then(
      (response) => {
        setRealEvents(response.data);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching events:", error);
        setLoading(false);
      }
    );
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      day: 'numeric', 
      month: 'short',
      year: 'numeric'
    });
  };

  const formatDateRange = (startStr, endStr) => {
    if (!startStr || !endStr) return "N/A";
    const start = new Date(startStr);
    const end = new Date(endStr);
    
    const startMonth = start.toLocaleDateString('en-US', { month: 'short' });
    const startDay = start.getDate();
    const endMonth = end.toLocaleDateString('en-US', { month: 'short' });
    const endDay = end.getDate();
    const year = start.getFullYear();

    if (startMonth === endMonth) {
      return `${startMonth} ${startDay} - ${endDay}, ${year}`;
    }
    return `${startMonth} ${startDay} - ${endMonth} ${endDay}, ${year}`;
  };

  const categories = [
    {
      icon: <FaThLarge />,
      label: "For you",
      active: true,
      subCategories: []
    },
    {
      icon: <FaGraduationCap />,
      label: "Academic Events",
      subCategories: ["Seminars", "Guest Lectures", "Paper Presentations", "Research Conferences", "Symposiums"]
    },
    {
      icon: <FaCode />,
      label: "Technical Events",
      subCategories: ["Hackathons", "Coding Competitions", "Tech Fests", "Project Expos", "Robotics Challenges", "UI/UX Battles"]
    },
    {
      icon: <FaTheaterMasks />,
      label: "Cultural Events",
      subCategories: ["Cultural Fests", "Dance/Music Events", "Drama/Theater", "Art Competitions", "Fashion Shows"]
    },
    {
      icon: <FaLightbulb />,
      label: "Workshops & Training",
      subCategories: ["Skill Workshops", "Certification Sessions", "Bootcamps", "Hands-on Labs", "Entrepreneurship & Startup Workshops"]
    },
    {
      icon: <FaBriefcase />,
      label: "Career & Placement",
      subCategories: ["Job Melas", "Placement Drives", "Internship Fairs", "Resume/GD Training", "Company Campus Sessions"]
    },
    {
      icon: <FaTrophy />,
      label: "Sports Events",
      subCategories: ["Tournaments", "Sports Fests", "Inter-college Championships"]
    },
    {
      icon: <FaUsers />,
      label: "Clubs & Activities",
      subCategories: ["NSS Events", "Rotaract / Youth Club", "Community Outreach", "Environmental Drives"]
    },
  ];

  const colleges = [
    { id: 1, name: "AUCE", logo: "/AUCE-Visakhapatnam-Logo.png" },
    { id: 2, name: "GITAM", logo: "/gitam_deemed_university_logo.jfif" },
    { id: 3, name: "GVPCE", logo: "/GVPCE.jpg" },
    { id: 4, name: "VIIT", logo: "/VIIT.png" },
    { id: 5, name: "RAGHU", logo: "/RAGHU.jpg" },
  ];

  return (
    <div className="home-container">
      <div className="container">
        {/* Category Strip */}
        <div className="category-strip">
          {categories.map((cat, idx) => (
            <div key={idx} className={`category-item ${cat.active ? 'active' : ''} dropdown-wrapper`}>
              <div className="category-icon">{cat.icon}</div>
              <span className="small fw-bold text-center">{cat.label}</span>

              {cat.subCategories.length > 0 && (
                <div className="category-dropdown">
                  <ul className="list-unstyled mb-0">
                    {cat.subCategories.map((sub, sIdx) => (
                      <li key={sIdx} className="dropdown-item-custom">
                        {sub}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Section: Trending Events */}
        <h2 className="section-title">Trending in Your Collab<strong className="text-primary">X</strong></h2>
        <div className="scrolling-wrapper">
          {loading ? (
            <div className="text-muted small p-3">Loading events...</div>
          ) : (
            <>
              {filteredEvents.map(event => (
                <div key={event.id} className="position-relative">
                  <Link to={`/event/${event.id}`} className="text-decoration-none">
                    <div className="collabx-card">
                      <div className="card-img-container">
                        <img
                          src={event.image1 ? `http://localhost:8080/uploads/${event.image1}` : "https://images.unsplash.com/photo-1585135497273-1a86b0997173?q=80&w=400&auto=format&fit=crop"}
                          alt={event.title}
                          className="card-img"
                        />
                      </div>
                      <div className="card-content">
                        <div className="text-primary fw-bold mb-1" style={{ fontSize: "0.65rem", textTransform: "uppercase", border: "1px dotted #ff385c", padding: "2px 6px", borderRadius: "4px", display: "inline-block" }}>
                          {event.category} | {event.type}
                        </div>
                        <h5 className="text-dark">{event.title}</h5>
                        <p className="card-subtitle mb-1"><FaClock className="me-1" /> Open: {formatDateRange(event.startDate, event.endDate)}</p>
                        <p className="card-subtitle mb-1"><FaCalendarAlt className="me-1" /> Entry starts at {formatDate(event.registrationDate)}</p>
                        <div className="d-flex justify-content-between align-items-center mt-2">
                          <p className="card-price text-dark mb-0">Registration fee :  ₹{event.amount}</p>
                          {!isCollege && <span className="text-primary fw-bold small">Register here</span>}
                        </div>
                      </div>
                    </div>
                  </Link>

                </div>
              ))}
              {filteredEvents.length === 0 && <div className="text-muted small p-3">No trending events found.</div>}
            </>
          )}
        </div>

        {/* Section: Popular Workshops */}
        <h2 className="section-title">Popular Workshops</h2>
        <div className="scrolling-wrapper">
          {loading ? (
            <div className="text-muted small p-3">Loading workshops...</div>
          ) : (
            <>
              {filteredEvents.filter(e => e.category === "Workshops & Training" || e.category === "Workshop" || e.type === "Workshop").map(event => (
                <div key={event.id} className="position-relative">
                  <Link to={`/event/${event.id}`} className="text-decoration-none">
                    <div className="collabx-card">
                      <div className="card-img-container">
                        <img
                          src={event.image1 ? `http://localhost:8080/uploads/${event.image1}` : "https://images.unsplash.com/photo-1585135497273-1a86b0997173?q=80&w=400&auto=format&fit=crop"}
                          alt={event.title}
                          className="card-img"
                        />
                      </div>
                      <div className="card-content">
                        <div className="text-primary fw-bold mb-1" style={{ fontSize: "0.65rem", textTransform: "uppercase", border: "1px dotted #ff385c", padding: "2px 6px", borderRadius: "4px", display: "inline-block" }}>
                          {event.category} | {event.type}
                        </div>
                        <h5 className="text-dark">{event.title}</h5>
                        <p className="card-subtitle mb-1"><FaClock className="me-1" /> Open: {formatDateRange(event.startDate, event.endDate)}</p>
                        <p className="card-subtitle mb-1"><FaCalendarAlt className="me-1" /> Entry starts at {formatDate(event.registrationDate)}</p>
                        <div className="d-flex justify-content-between align-items-center mt-2">
                          <p className="card-price text-dark mb-0">Registration fee :  ₹{event.amount}</p>
                          {!isCollege && <span className="text-primary fw-bold small">Register here</span>}
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
              {filteredEvents.filter(e => e.category === "Workshops & Training" || e.category === "Workshop" || e.type === "Workshop").length === 0 && <div className="text-muted small p-3">No workshops found.</div>}
            </>
          )}
        </div>

        {/* Section: Most Events Conducted Colleges */}
        <h2 className="section-title">More Events Conducted and Collaborated with Collab<strong className="text-primary">X</strong></h2>
        <div className="scrolling-wrapper mb-5">
          {colleges.map(college => (
            <div key={college.id} className="text-center" style={{ minWidth: "150px" }}>
              <div className="rounded-circle overflow-hidden mx-auto mb-2 bg-white d-flex align-items-center justify-content-center" style={{ width: "120px", height: "120px", border: "1px solid #eee" }}>
                <img
                  src={college.logo}
                  alt={college.name}
                  style={{
                    maxWidth: college.name === "GITAM" ? "100%" : "80%",
                    maxHeight: college.name === "GITAM" ? "100%" : "80%",
                    objectFit: college.name === "GITAM" ? "cover" : "contain"
                  }}
                  onError={(e) => { e.target.src = "https://via.placeholder.com/150?text=" + college.name }}
                />
              </div>
              <span className="small fw-bold">{college.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
