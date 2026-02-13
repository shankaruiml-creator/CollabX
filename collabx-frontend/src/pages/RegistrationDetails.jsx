import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import EventService from "../services/EventService";
import AuthService from "../services/AuthService";
import RegistrationService from "../services/RegistrationService";
import { FaArrowLeft, FaTicketAlt, FaCalendarAlt, FaMapMarkerAlt, FaCheckCircle } from "react-icons/fa";

const RegistrationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [registration, setRegistration] = useState(null);
  const [loading, setLoading] = useState(true);
  const currentUser = AuthService.getCurrentUser();

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      try {
        const eventResponse = await EventService.getEventById(id);
        setEvent(eventResponse.data);

        const regResponse = await RegistrationService.getRegistrationDetails(currentUser.id, id);
        if (regResponse.data && regResponse.data.registrationId) {
          setRegistration(regResponse.data);
        } else {
          // If not registered, redirect back to event page
          navigate(`/event/${id}`);
        }
      } catch (error) {
        console.error("Error fetching registration details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, currentUser, navigate]);

  const formatDateTime = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    }) + ", " + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return <div className="container py-5 text-center">Loading...</div>;
  }

  if (!event || !registration) {
    return <div className="container py-5 text-center">Registration details not found.</div>;
  }

  return (
    <div className="registration-details-page bg-light min-vh-100 py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <button 
              className="btn btn-link text-dark text-decoration-none mb-4 d-flex align-items-center gap-2 p-0"
              onClick={() => navigate(`/event/${id}`)}
            >
              <FaArrowLeft /> Back to Event
            </button>

            <div className="card border-0 shadow-sm rounded-4 overflow-hidden mb-4">
              <div className="bg-success text-white p-4 text-center">
                <FaCheckCircle size={50} className="mb-3" />
                <h3 className="fw-bold mb-0">Registration Confirmed</h3>
                <p className="mb-0 opacity-75">You are all set for {event.title}</p>
              </div>

              <div className="card-body p-4 p-md-5">
                <div className="row mb-4">
                  <div className="col-md-6 mb-4 mb-md-0">
                    <div className="d-flex align-items-start gap-3">
                      <div className="bg-light p-3 rounded-3">
                        <FaTicketAlt className="text-primary" size={24} />
                      </div>
                      <div>
                        <div className="text-muted small text-uppercase fw-bold">Registration ID</div>
                        <div className="fw-bold h5 mb-0 text-primary">{registration.registrationId}</div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 text-md-end">
                    <div className="text-muted small text-uppercase fw-bold">Status</div>
                    <span className="badge bg-success-soft text-success px-3 py-2 rounded-pill fw-bold">
                      {registration.status}
                    </span>
                  </div>
                </div>

                <hr className="my-4" />

                <h5 className="fw-bold mb-4">Event Summary</h5>
                <div className="row g-4 mb-5">
                  <div className="col-md-6">
                    <div className="d-flex align-items-center gap-2 text-muted mb-2">
                      <FaCalendarAlt size={14} />
                      <span className="small fw-bold text-uppercase">Date & Time</span>
                    </div>
                    <div className="fw-bold">{formatDateTime(event.startDate)}</div>
                  </div>
                  <div className="col-md-6">
                    <div className="d-flex align-items-center gap-2 text-muted mb-2">
                      <FaMapMarkerAlt size={14} />
                      <span className="small fw-bold text-uppercase">Venue</span>
                    </div>
                    <div className="fw-bold">{event.venue}</div>
                  </div>
                </div>

                <h5 className="fw-bold mb-4">Attendee Information</h5>
                <div className="table-responsive">
                  <table className="table table-borderless align-middle">
                    <tbody>
                      <tr className="border-bottom">
                        <th className="ps-0 text-muted fw-normal py-3" style={{ width: "200px" }}>Full Name</th>
                        <td className="fw-bold py-3 text-end text-md-start">{registration.fullName}</td>
                      </tr>
                      <tr className="border-bottom">
                        <th className="ps-0 text-muted fw-normal py-3">Email</th>
                        <td className="fw-bold py-3 text-end text-md-start">{registration.email}</td>
                      </tr>
                      <tr className="border-bottom">
                        <th className="ps-0 text-muted fw-normal py-3">Mobile</th>
                        <td className="fw-bold py-3 text-end text-md-start">{registration.mobileNumber}</td>
                      </tr>
                      <tr className="border-bottom">
                        <th className="ps-0 text-muted fw-normal py-3">College</th>
                        <td className="fw-bold py-3 text-end text-md-start">{registration.collegeName} ({registration.collegeCode})</td>
                      </tr>
                      <tr className="border-bottom">
                        <th className="ps-0 text-muted fw-normal py-3">Roll Number</th>
                        <td className="fw-bold py-3 text-end text-md-start">{registration.rollNumber}</td>
                      </tr>
                      <tr>
                        <th className="ps-0 text-muted fw-normal py-3">Amount Paid</th>
                        <td className="fw-bold py-3 text-end text-md-start text-success">₹{registration.amount}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="mt-5 p-4 bg-light rounded-4 border border-dashed text-center">
                  <p className="text-muted small mb-0">
                    Please present this registration ID or a copy of this page at the venue for entry.
                    A confirmation email has also been sent to <strong>{registration.email}</strong>.
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center">
              <Link to="/" className="btn btn-outline-dark px-4 py-2 rounded-3 fw-bold">
                Return to Home
              </Link>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .bg-success-soft {
          background-color: #e8f5e9;
        }
        .text-primary {
          color: #0d6efd !important;
        }
        .border-dashed {
          border-style: dashed !important;
        }
      `}</style>
    </div>
  );
};

export default RegistrationDetails;
