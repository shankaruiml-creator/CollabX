import React, { useState, useEffect } from "react";
import EventService from "../services/EventService";
import AuthService from "../services/AuthService";
import ESPService from "../services/ESPService";
import { Link } from "react-router-dom";
import { FiUser, FiMail, FiLock, FiShield, FiPlus, FiX, FiUsers } from "react-icons/fi";

const CollegeDashboard = ({ searchQuery = "" }) => {
  const [events, setEvents] = useState([]);
  const [esps, setEsps] = useState([]);

  const filteredEvents = events.filter(event => {
    const query = searchQuery.toLowerCase();
    return (
      event.title?.toLowerCase().includes(query) ||
      event.category?.toLowerCase().includes(query) ||
      event.type?.toLowerCase().includes(query)
    );
  });
  const [showESPModal, setShowESPModal] = useState(false);
  const [espData, setEspData] = useState({
    username: "",
    email: "",
    password: "",
    role: "esp_president"
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);

  const currentUser = AuthService.getCurrentUser();

  useEffect(() => {
    if (currentUser) {
      loadData();
    }
  }, [currentUser?.id]);

  const loadData = () => {
    setDataLoading(true);
    const collegeId = currentUser.collegeId || currentUser.id;
    
    Promise.all([
      EventService.getEventsByCollege(collegeId),
      ESPService.getESPsByCollege(collegeId)
    ]).then(
      ([eventsRes, espsRes]) => {
        setEvents(eventsRes.data);
        setEsps(espsRes.data);
        setDataLoading(false);
      },
      (error) => {
        console.error(error);
        setDataLoading(false);
      }
    );
  };

  const handleESPChange = (e) => {
    const { name, value } = e.target;
    setEspData({ ...espData, [name]: value });
  };

  const handleESPAdd = (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const collegeId = currentUser.collegeId || currentUser.id;

    ESPService.addESP(
      espData.username,
      espData.email,
      espData.password,
      espData.role,
      collegeId
    ).then(
      () => {
        setLoading(false);
        setShowESPModal(false);
        setEspData({
          username: "",
          email: "",
          password: "",
          role: "esp_president"
        });
        loadData();
      },
      (error) => {
        setLoading(false);
        setMessage(error.response?.data?.message || "Failed to add ESP");
      }
    );
  };

  return (
    <div className="home-container py-4">
      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="section-title mb-1">Dashboard</h2>
            <p className="text-muted small">
              {currentUser?.roles?.some(role => role.startsWith("ROLE_ESP_")) 
                ? "Manage your published opportunities." 
                : "Manage your published opportunities and team."}
            </p>
          </div>
          <div className="d-flex gap-2">
            {!currentUser?.roles?.some(role => role.startsWith("ROLE_ESP_")) && (
              <button 
                className="btn btn-outline-primary shadow-sm px-4 rounded-pill fw-bold small"
                onClick={() => setShowESPModal(true)}
              >
                Add ESP's
              </button>
            )}
            {currentUser?.roles?.some(role => 
              ["ROLE_COLLEGE", "ROLE_ADMIN", "ROLE_ESP_PRESIDENT", "ROLE_ESP_VICE_PRESIDENT"].includes(role)
            ) && (
              <Link to="/create-event" className="btn btn-register shadow-sm px-4">
                Create Event
              </Link>
            )}
          </div>
        </div>

        {dataLoading ? (
          <div className="d-flex flex-column align-items-center justify-content-center py-5">
            <div className="spinner-border text-primary mb-3" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="text-muted">Loading your dashboard data...</p>
          </div>
        ) : (
          <>
            {/* ESP Modal */}
        {showESPModal && (
          <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", zIndex: 1050 }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content border-0 rounded-4 shadow-lg overflow-hidden">
                <div className="modal-header border-0 bg-light p-4">
                  <div className="d-flex align-items-center gap-3">
                    <div className="bg-primary bg-opacity-10 p-2 rounded-3 text-primary">
                      <FiUsers size={24} />
                    </div>
                    <div>
                      <h5 className="modal-title fw-bold mb-0">Add Executive Support</h5>
                      <p className="text-muted small mb-0">Create a new personnel account</p>
                    </div>
                  </div>
                  <button type="button" className="btn-close shadow-none" onClick={() => setShowESPModal(false)}></button>
                </div>
                <form onSubmit={handleESPAdd}>
                  <div className="modal-body p-4">
                    {message && (
                      <div className="alert alert-danger border-0 rounded-3 py-2 small d-flex align-items-center gap-2">
                        <FiShield size={16} /> {message}
                      </div>
                    )}
                    
                    <div className="mb-4">
                      <label className="form-label small fw-bold text-uppercase tracking-wider text-muted mb-2">Account Details</label>
                      
                      <div className="input-group mb-3 custom-input-group">
                        <span className="input-group-text bg-white border-end-0 rounded-start-3 text-muted">
                          <FiUser size={18} />
                        </span>
                        <input 
                          type="text" 
                          name="username" 
                          placeholder="Username"
                          className="form-control border-start-0 rounded-end-3 py-2" 
                          value={espData.username} 
                          onChange={handleESPChange} 
                          required 
                        />
                      </div>

                      <div className="input-group mb-3 custom-input-group">
                        <span className="input-group-text bg-white border-end-0 rounded-start-3 text-muted">
                          <FiMail size={18} />
                        </span>
                        <input 
                          type="email" 
                          name="email" 
                          placeholder="Email Address"
                          className="form-control border-start-0 rounded-end-3 py-2" 
                          value={espData.email} 
                          onChange={handleESPChange} 
                          required 
                        />
                      </div>

                      <div className="input-group mb-3 custom-input-group">
                        <span className="input-group-text bg-white border-end-0 rounded-start-3 text-muted">
                          <FiLock size={18} />
                        </span>
                        <input 
                          type="password" 
                          name="password" 
                          placeholder="Password"
                          className="form-control border-start-0 rounded-end-3 py-2" 
                          value={espData.password} 
                          onChange={handleESPChange} 
                          required 
                        />
                      </div>
                    </div>

                    <div className="mb-2">
                      <label className="form-label small fw-bold text-uppercase tracking-wider text-muted mb-2">Assign Role</label>
                      <div className="input-group custom-input-group">
                        <span className="input-group-text bg-white border-end-0 rounded-start-3 text-muted">
                          <FiShield size={18} />
                        </span>
                        <select 
                          name="role" 
                          className="form-select border-start-0 rounded-end-3 py-2" 
                          value={espData.role} 
                          onChange={handleESPChange}
                        >
                          <option value="esp_president">President</option>
                          <option value="esp_vice_president">Vice President</option>
                          <option value="esp_register_1">Register 1</option>
                          <option value="esp_register_2">Register 2</option>
                          <option value="esp_register_3">Register 3</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer border-0 p-4 bg-light bg-opacity-50">
                    <button type="button" className="btn btn-light px-4 rounded-pill small fw-bold" onClick={() => setShowESPModal(false)}>Cancel</button>
                    <button type="submit" className="btn btn-primary px-4 rounded-pill text-white fw-bold small shadow-sm" disabled={loading}>
                      {loading ? (
                        <span className="spinner-border spinner-border-sm me-2"></span>
                      ) : (
                        <FiPlus className="me-2" />
                      )}
                      Create Account
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* My Team Section */}
        {esps.length > 0 && (
          <div className="mb-5">
            <div className="d-flex align-items-center gap-2 mb-3">
              <h4 className="fw-bold mb-0" style={{ fontSize: "1.1rem" }}>Executive Team</h4>
              <span className="badge bg-primary bg-opacity-10 text-primary rounded-pill small">{esps.length} Members</span>
            </div>
            <div className="row g-3">
              {esps.map(esp => (
                <div key={esp.id} className="col-12 col-md-4 col-lg-3">
                  <div className="bg-white p-3 rounded-4 shadow-sm border border-light d-flex align-items-center gap-3 team-card h-100">
                    <div className="avatar-circle bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center fw-bold" style={{ width: "48px", height: "48px", fontSize: "1.2rem" }}>
                      {esp.user.username.charAt(0).toUpperCase()}
                    </div>
                    <div className="overflow-hidden">
                      <div className="fw-bold text-truncate" style={{ fontSize: "0.9rem" }}>{esp.user.username}</div>
                      <div className="text-primary text-uppercase fw-bold mt-1" style={{ fontSize: "0.65rem", letterSpacing: "0.5px" }}>
                        {esp.user.roles[0].name.replace('ROLE_ESP_', '').replace('_', ' ')}
                      </div>
                      <div className="text-muted text-truncate mt-1" style={{ fontSize: "0.7rem" }}>{esp.user.email}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="mb-4">
          <h4 className="fw-bold mb-0" style={{ fontSize: "1.1rem" }}>My Published Events</h4>
        </div>

        <div className="row g-4">
          {filteredEvents.map(event => {
            const date = new Date(event.startDate);
            const formattedDate = date.toLocaleDateString('en-US', { 
              weekday: 'short', 
              day: 'numeric', 
              month: 'short' 
            }) + ", " + date.toLocaleTimeString('en-US', { 
              hour: 'numeric', 
              minute: '2-digit' 
            });

            return (
              <div key={event.id} className="col-12 col-sm-6 col-md-4" style={{ flex: "0 0 auto", width: "20%" }}>
                <Link to={`/event/${event.id}`} className="text-decoration-none">
                  <div className="card shadow-sm rounded-4 overflow-hidden h-100 bg-white" style={{ border: "1px solid #ebebeb" }}>
                    <div className="position-relative" style={{ height: "260px" }}>
                      <img 
                        src={event.image1 ? `http://localhost:8080/uploads/${event.image1}` : "https://images.unsplash.com/photo-1585135497273-1a86b0997173?q=80&w=400&auto=format&fit=crop"} 
                        alt={event.title} 
                        className="w-100 h-100" 
                        style={{ objectFit: "cover" }}
                      />
                    </div>
                    <div className="p-3">
                      <div className="text-danger fw-bold small mb-1" style={{ fontSize: "0.75rem" }}>
                        {formattedDate}
                      </div>
                      <h6 className="fw-bold mb-1 text-dark" style={{ fontSize: "0.95rem", lineHeight: "1.2" }}>
                        {event.title}
                      </h6>
                      <p className="text-muted small mb-1" style={{ fontSize: "0.8rem" }}>
                        {event.venue}
                      </p>
                      <p className="fw-bold mb-0 text-dark" style={{ fontSize: "0.85rem" }}>
                        ₹{event.amount}
                      </p>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
          {filteredEvents.length === 0 && (
            <div className="col-12 text-center py-5 text-muted bg-white rounded-4 shadow-sm border">
              No events found matching your search.
            </div>
          )}
        </div>
      </>
    )}
      </div>
    </div>
  );
};

export default CollegeDashboard;
