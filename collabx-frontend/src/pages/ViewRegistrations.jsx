import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import RegistrationService from "../services/RegistrationService";
import AuthService from "../services/AuthService";
import EventService from "../services/EventService";
import { FaArrowLeft, FaUser, FaIdCard, FaEnvelope, FaPhone, FaUniversity, FaCreditCard, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const ViewRegistrations = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [registrations, setRegistrations] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRegistration, setSelectedRegistration] = useState(null);
  const currentUser = AuthService.getCurrentUser();

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      try {
        const eventRes = await EventService.getEventById(eventId);
        setEvent(eventRes.data);

        const regRes = await RegistrationService.getEventRegistrations(eventId);
        const allRegs = Array.isArray(regRes.data) ? regRes.data : [];
        console.log("Total registrations for this event:", allRegs.length);
        setTotalCount(allRegs.length);
        
        let filtered = [];
        // More robust role check
        const hasRole = (roleName) => {
          if (!currentUser || !currentUser.roles) return false;
          return currentUser.roles.some(role => 
            role.toUpperCase() === roleName.toUpperCase() || 
            role.toUpperCase() === ("ROLE_" + roleName).toUpperCase()
          );
        };

        if (hasRole("ESP_REGISTER_1")) {
          filtered = allRegs.slice(0, 10);
        } else if (hasRole("ESP_REGISTER_2")) {
          filtered = allRegs.slice(10, 20);
        } else if (hasRole("ESP_REGISTER_3")) {
          filtered = allRegs.slice(20, 30);
        } else {
          // Default to showing all for other ESP roles or admin
          filtered = allRegs;
        }

        setRegistrations(filtered);
        // If we have total regs but filtered is 0, it's a range issue
        if (allRegs.length > 0 && filtered.length === 0) {
          console.warn("Registrations exist but none in your assigned range (1-10, 11-20, etc.)");
        }
        setError(null);
      } catch (error) {
        console.error("Error fetching data:", error);
        const msg = error.response?.data?.message || error.response?.data || error.message;
        setError(`Failed to load registrations: ${msg}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [eventId, currentUser, navigate]);

  const handleViewDetails = (registration) => {
    setSelectedRegistration(registration);
  };

  if (loading) {
    return <div className="container py-5 text-center">Loading...</div>;
  }

  return (
    <div className="view-registrations-page bg-light min-vh-100 py-5">
      <div className="container">
        <button 
          className="btn btn-link text-dark text-decoration-none mb-4 d-flex align-items-center gap-2 p-0"
          onClick={() => navigate(`/event/${eventId}`)}
        >
          <FaArrowLeft /> Back to Event
        </button>

        <div className="row">
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm rounded-4 overflow-hidden mb-4">
              <div className="card-header bg-white border-bottom p-4">
                <h4 className="fw-bold mb-0">Registrations for {event?.title}</h4>
                <div className="d-flex justify-content-between align-items-center mt-1">
                  <p className="text-muted small mb-0">Showing registrations assigned to you</p>
                  <span className="badge bg-light text-dark border">Total: {totalCount}</span>
                </div>
              </div>
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="bg-light">
                      <tr>
                        <th className="px-4 py-3 border-0">Roll No</th>
                        <th className="py-3 border-0">Name</th>
                        <th className="py-3 border-0 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {error ? (
                        <tr>
                          <td colSpan="3" className="text-center py-5 text-danger">
                            {error}
                          </td>
                        </tr>
                      ) : registrations.length > 0 ? (
                        registrations.map((reg) => (
                          <tr key={reg.id}>
                            <td className="px-4 py-3 fw-bold">{reg.rollNumber}</td>
                            <td className="py-3">{reg.fullName}</td>
                            <td className="py-3 text-center">
                              <button 
                                className="btn btn-sm btn-dark px-3 rounded-pill"
                                onClick={() => handleViewDetails(reg)}
                              >
                                View
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="3" className="text-center py-5 text-muted">
                            {totalCount > 0 
                              ? "No registrations found in your assigned range." 
                              : "No registrations found for this event."}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            {selectedRegistration ? (
              <div className="card border-0 shadow-sm rounded-4 overflow-hidden sticky-top" style={{ top: "100px" }}>
                <div className="card-header bg-dark text-white p-4">
                  <h5 className="fw-bold mb-0">Student Details</h5>
                </div>
                <div className="card-body p-4">
                  <div className="detail-item mb-4">
                    <div className="d-flex align-items-center gap-3 mb-2">
                      <div className="bg-light p-2 rounded-3 text-muted">
                        <FaUser />
                      </div>
                      <div>
                        <div className="text-muted small">Full Name</div>
                        <div className="fw-bold">{selectedRegistration.fullName}</div>
                      </div>
                    </div>
                  </div>

                  <div className="detail-item mb-4">
                    <div className="d-flex align-items-center gap-3 mb-2">
                      <div className="bg-light p-2 rounded-3 text-muted">
                        <FaIdCard />
                      </div>
                      <div>
                        <div className="text-muted small">Roll Number</div>
                        <div className="fw-bold">{selectedRegistration.rollNumber}</div>
                      </div>
                    </div>
                  </div>

                  <div className="detail-item mb-4">
                    <div className="d-flex align-items-center gap-3 mb-2">
                      <div className="bg-light p-2 rounded-3 text-muted">
                        <FaEnvelope />
                      </div>
                      <div>
                        <div className="text-muted small">Email Address</div>
                        <div className="fw-bold">{selectedRegistration.email}</div>
                      </div>
                    </div>
                  </div>

                  <div className="detail-item mb-4">
                    <div className="d-flex align-items-center gap-3 mb-2">
                      <div className="bg-light p-2 rounded-3 text-muted">
                        <FaPhone />
                      </div>
                      <div>
                        <div className="text-muted small">Mobile Number</div>
                        <div className="fw-bold">{selectedRegistration.mobileNumber}</div>
                      </div>
                    </div>
                  </div>

                  <div className="detail-item mb-4">
                    <div className="d-flex align-items-center gap-3 mb-2">
                      <div className="bg-light p-2 rounded-3 text-muted">
                        <FaUniversity />
                      </div>
                      <div>
                        <div className="text-muted small">College</div>
                        <div className="fw-bold">{selectedRegistration.collegeName} ({selectedRegistration.collegeCode})</div>
                      </div>
                    </div>
                  </div>

                  <div className="detail-item mb-4">
                    <div className="d-flex align-items-center gap-3 mb-2">
                      <div className="bg-light p-2 rounded-3 text-muted">
                        <FaCreditCard />
                      </div>
                      <div>
                        <div className="text-muted small">Amount Paid</div>
                        <div className="fw-bold text-success">₹{selectedRegistration.amount}</div>
                      </div>
                    </div>
                  </div>

                  <div className="detail-item">
                    <div className="d-flex align-items-center gap-3 mb-2">
                      <div className="bg-light p-2 rounded-3 text-muted">
                        {selectedRegistration.status === "CONFIRMED" ? <FaCheckCircle className="text-success" /> : <FaTimesCircle className="text-danger" />}
                      </div>
                      <div>
                        <div className="text-muted small">Status</div>
                        <div className={`fw-bold ${selectedRegistration.status === "CONFIRMED" ? "text-success" : "text-danger"}`}>
                          {selectedRegistration.status}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="card border-0 shadow-sm rounded-4 p-5 text-center bg-white h-100 d-flex flex-column justify-content-center align-items-center text-muted">
                <FaUser size={40} className="mb-3 opacity-25" />
                <p>Select a student to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewRegistrations;
