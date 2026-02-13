import React, { useState, useEffect } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import EventService from "../services/EventService";
import AuthService from "../services/AuthService";
import RegistrationService from "../services/RegistrationService";
import { FaMapMarkerAlt, FaCalendarAlt, FaClock, FaTicketAlt, FaInfoCircle, FaBan, FaChevronDown, FaChevronUp, FaBookmark, FaShareAlt, FaEdit } from "react-icons/fa";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { MdOutlineTimer, MdOutlineConfirmationNumber, MdOutlinePeople } from "react-icons/md";

const EventDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [openAccordion, setOpenAccordion] = useState(null);
  const [registration, setRegistration] = useState(null);
  const [showDetails, setShowDetails] = useState(location.state?.registrationSuccess || false);
  const currentUser = AuthService.getCurrentUser();
  const isStudent = currentUser && currentUser.roles.includes("ROLE_STUDENT");
  const isCollege = currentUser && (
    currentUser.roles.includes("ROLE_COLLEGE") || 
    currentUser.roles.includes("ROLE_ADMIN") ||
    currentUser.roles.includes("ROLE_ESP_PRESIDENT") || 
    currentUser.roles.includes("ROLE_ESP_VICE_PRESIDENT")
  );

  const isESPRegister = currentUser && (
    currentUser.roles.includes("ROLE_ESP_REGISTER_1") ||
    currentUser.roles.includes("ROLE_ESP_REGISTER_2") ||
    currentUser.roles.includes("ROLE_ESP_REGISTER_3")
  );

  useEffect(() => {
    EventService.getEventById(id).then(
      (response) => {
        setEvent(response.data);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching event details:", error);
        setLoading(false);
      }
    );

    if (currentUser && isStudent) {
      console.log("Checking registration for student:", currentUser.id, "event:", id);
      RegistrationService.getRegistrationDetails(currentUser.id, id).then(
        (response) => {
          // Check if it's a real registration object (has registrationId)
          if (response.data && response.data.registrationId) {
            console.log("Registration confirmed:", response.data.registrationId);
            setRegistration(response.data);
          } else {
            console.log("No registration found (empty response)");
            setRegistration(null);
          }
        },
        (error) => {
          console.error("Error checking registration status:", error);
          setRegistration(null);
        }
      );
    }

    // Clear location state after using it to prevent stale state on refresh
    if (location.state?.registrationSuccess) {
      window.history.replaceState({}, document.title);
    }
  }, [id, currentUser?.id, isStudent, location.state?.registrationSuccess]);

  if (loading) {
    return <div className="container py-5 text-center">Loading...</div>;
  }

  if (!event) {
    return <div className="container py-5 text-center">Event not found.</div>;
  }

  const formatDateTime = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    }) + ", " + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const toggleAccordion = (index) => {
    setOpenAccordion(openAccordion === index ? null : index);
  };

  return (
    <div className="event-details-page bg-white">
      {/* Banner Section */}
      <div className="container py-4">
        <div className="row position-relative">
          <div className="col-lg-8">
            <div className="banner-wrapper rounded-4 overflow-hidden" style={{ height: "450px" }}>
              <img 
                src={event.image2 ? `http://localhost:8080/uploads/${event.image2}` : `http://localhost:8080/uploads/${event.image1}`} 
                alt={event.title} 
                className="w-100 h-100" 
                style={{ objectFit: "cover" }}
              />
            </div>
          </div>
          
          {/* Floating Info Card */}
          <div className="col-lg-4">
            <div className="card border-0 shadow-sm rounded-4 p-4 sticky-top" style={{ top: "100px", zIndex: 10 }}>
              <div className="d-flex justify-content-between align-items-start mb-3">
                <h3 className="fw-bold mb-0" style={{ fontSize: "1.5rem", lineHeight: "1.2" }}>{event.title}</h3>
              </div>

              <div className="mb-4">
                <div className="d-flex align-items-center text-muted mb-2 small">
                  <FaBookmark className="me-2" />
                  <span>{event.category}, {event.type}</span>
                </div>
                <div className="d-flex align-items-center text-muted mb-2 small">
                  <FaMapMarkerAlt className="me-2" />
                  <span>{event.venue}</span>
                </div>
                <div className="d-flex align-items-center text-muted small mb-2">
                  <FaClock className="me-2" />
                  <span>Open: {formatDateTime(event.startDate)} - {formatDateTime(event.endDate)}</span>
                </div>
                <div className="d-flex align-items-center text-muted small">
                  <FaCalendarAlt className="me-2" />
                  <span>Entry starts at {formatDateTime(event.registrationDate)}</span>
                </div>
              </div>

              <div className="d-flex justify-content-between align-items-center mt-auto pt-3 border-top">
                <div>
                  <div className="fw-bold h4 mb-0">₹{event.amount}</div>
                </div>
                {isCollege ? (
                  <Link to={`/edit-event/${event.id}`} className="btn btn-dark px-4 py-2 fw-bold rounded-3 text-decoration-none">
                    Edit
                  </Link>
                ) : isESPRegister ? (
                  <Link to={`/view-registrations/${event.id}`} className="btn btn-dark px-4 py-2 fw-bold rounded-3 text-decoration-none text-center">
                    View registrations
                  </Link>
                ) : (
                  <div className="d-flex flex-column gap-2">
                    {registration ? (
                      <>
                        <button 
                          className="btn btn-secondary px-4 py-2 fw-bold rounded-3 border-0" 
                          disabled
                          style={{ backgroundColor: "#ccc", cursor: "not-allowed" }}
                        >
                          Register here
                        </button>
                        <Link 
                          to={`/registration-details/${event.id}`}
                          className="btn btn-success px-4 py-2 fw-bold rounded-3 text-decoration-none text-center"
                        >
                          View registration details
                        </Link>
                      </>
                    ) : (
                      <Link 
                        to={currentUser ? `/register-event/${event.id}` : "/login"} 
                        className="btn btn-dark px-4 py-2 fw-bold rounded-3 text-decoration-none text-center"
                      >
                        Register here
                      </Link>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <hr className="my-5" />
        
        {/* About Section */}
        <div className="row mt-5">
          <div className="col-lg-8">
            <h4 className="fw-bold mb-3">About the Event</h4>
            <div className={`description-text ${showFullDescription ? '' : 'text-truncate-multi'}`} 
                 style={{ 
                   fontSize: "0.95rem", 
                   lineHeight: "1.6", 
                   color: "#4a4a4a",
                   display: showFullDescription ? 'block' : '-webkit-box',
                   WebkitLineClamp: showFullDescription ? 'unset' : '3',
                   WebkitBoxOrient: 'vertical',
                   overflow: 'hidden'
                 }}>
              {event.description}
            </div>
            <button 
              className="btn btn-link p-0 text-decoration-none fw-bold mt-2 small" 
              onClick={() => setShowFullDescription(!showFullDescription)}
              style={{ color: "#000" }}
            >
              {showFullDescription ? "Show less" : "Show more"} {showFullDescription ? <FaChevronUp size={10} /> : <FaChevronDown size={10} />}
            </button>

            <hr className="my-5" />

            {/* Guide Section */}
            <h4 className="fw-bold mt-5 mb-3" style={{ fontSize: "1.1rem" }}>Event Guide</h4>
            <div className="row g-3">
              <div className="col-md-4">
                <div className="d-flex align-items-center p-3 rounded-4 border bg-light">
                  <div className="bg-white rounded-circle p-2 me-3 shadow-sm d-flex align-items-center justify-content-center" style={{ width: "40px", height: "40px" }}>
                    <MdOutlineTimer className="text-muted" size={20} />
                  </div>
                  <div>
                    <div className="text-muted small" style={{ fontSize: "0.7rem" }}>Duration</div>
                    <div className="fw-bold small">60 Days</div>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="d-flex align-items-center p-3 rounded-4 border bg-light">
                  <div className="bg-white rounded-circle p-2 me-3 shadow-sm d-flex align-items-center justify-content-center" style={{ width: "40px", height: "40px" }}>
                    <MdOutlineConfirmationNumber className="text-muted" size={20} />
                  </div>
                  <div>
                    <div className="text-muted small" style={{ fontSize: "0.7rem" }}>Tickets Needed For</div>
                    <div className="fw-bold small">All ages</div>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="d-flex align-items-center p-3 rounded-4 border bg-light">
                  <div className="bg-white rounded-circle p-2 me-3 shadow-sm d-flex align-items-center justify-content-center" style={{ width: "40px", height: "40px" }}>
                    <MdOutlinePeople className="text-muted" size={20} />
                  </div>
                  <div>
                    <div className="text-muted small" style={{ fontSize: "0.7rem" }}>Entry Allowed For</div>
                    <div className="fw-bold small">All ages</div>
                  </div>
                </div>
              </div>
            </div>

            <hr className="my-5" />

            {/* Gallery Section */}
            <h4 className="fw-bold mt-5 mb-3">Gallery</h4>
            <div className="row g-2">
              <div className="col-8">
                <img 
                  src={event.image1 ? `http://localhost:8080/uploads/${event.image1}` : "https://via.placeholder.com/600x400"} 
                  className="w-100 rounded-4" 
                  style={{ height: "300px", objectFit: "cover" }} 
                  alt="Gallery 1"
                />
              </div>
              <div className="col-4">
                <img 
                  src={event.image2 ? `http://localhost:8080/uploads/${event.image2}` : "https://via.placeholder.com/300x400"} 
                  className="w-100 rounded-4 mb-2" 
                  style={{ height: "145px", objectFit: "cover" }} 
                  alt="Gallery 2"
                />
                <img 
                   src={event.image1 ? `http://localhost:8080/uploads/${event.image1}` : "https://via.placeholder.com/300x400"} 
                  className="w-100 rounded-4" 
                  style={{ height: "145px", objectFit: "cover" }} 
                  alt="Gallery 3"
                />
              </div>
            </div>

            <hr className="my-5" />

            {/* Prohibited Items Section */}
            <h4 className="fw-bold mt-5 mb-3">Prohibited Items</h4>
            <div className="d-flex flex-wrap gap-3 mb-5">
              {[
                "Smoking or Tobacco"
              ].map((item, idx) => (
                <div key={idx} className="d-flex align-items-center text-muted small">
                  <FaBan className="me-2 text-danger" size={12} />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <hr className="my-5" />

            {/* Venue Section */}
            <h4 className="fw-bold mt-5 mb-3">Venue</h4>
            <div className="card border-0 shadow-sm rounded-4 p-4 bg-light mb-5">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="fw-bold mb-1">{event.venue}</h6>
                  <p className="text-muted small mb-0">Campus Location, College Address, City, State, India</p>
                </div>
                <button 
                  className="btn btn-outline-dark btn-sm px-3 rounded-3 d-flex align-items-center gap-2"
                  onClick={() => {
                    if (event.venue.startsWith('http')) {
                      window.open(event.venue, '_blank');
                    } else {
                      window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.venue)}`, '_blank');
                    }
                  }}
                >
                  <FaMapMarkerAlt /> GET DIRECTIONS
                </button>
              </div>
            </div>

            <hr className="my-5" />

            {/* Accordion Sections */}
            <div className="accordion-sections mt-5">
              {[
                { title: "Frequently Asked Questions", content: "Details about FAQs go here..." },
                { title: "Terms & Conditions", content: "Details about Terms & Conditions go here..." }
              ].map((section, idx) => (
                <div key={idx} className="border-top py-3">
                  <div 
                    className="d-flex justify-content-between align-items-center cursor-pointer" 
                    onClick={() => toggleAccordion(idx)}
                    style={{ cursor: "pointer" }}
                  >
                    <h5 className="fw-bold mb-0" style={{ fontSize: "1rem" }}>{section.title}</h5>
                    {openAccordion === idx ? <FaChevronUp /> : <FaChevronDown />}
                  </div>
                  {openAccordion === idx && (
                    <div className="mt-3 text-muted small">
                      {section.content}
                    </div>
                  )}
                </div>
              ))}
              <div className="border-top"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
