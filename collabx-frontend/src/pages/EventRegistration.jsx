import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import EventService from "../services/EventService";
import AuthService from "../services/AuthService";
import RegistrationService from "../services/RegistrationService";
import { FaBookmark, FaMapMarkerAlt, FaClock } from "react-icons/fa";

const EventRegistration = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const currentUser = AuthService.getCurrentUser();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState("form"); // form, payment, success
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const [formData, setFormData] = useState({
    fullName: "",
    dob: "",
    email: currentUser ? currentUser.email : "",
    mobileNumber: "",
    collegeName: "",
    collegeCode: "",
    rollNumber: ""
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [registrationId, setRegistrationId] = useState("");

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
      return;
    }
    
    // Only students can register
    if (!currentUser.roles.includes("ROLE_STUDENT")) {
      navigate(`/event/${id}`);
      return;
    }

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

    // Check if already registered
    RegistrationService.getRegistrationDetails(currentUser.id, id).then(
      (response) => {
        if (response.data && response.data.registrationId) {
          navigate(`/event/${id}`, { state: { registrationSuccess: false } });
        }
      },
      (error) => {
        // Not registered, continue
      }
    );
  }, [id, currentUser, navigate]);

  // Timer logic for payment step
  useEffect(() => {
    let timerId;
    if (step === "payment" && timeLeft > 0) {
      timerId = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (step === "payment" && timeLeft === 0) {
      setStep("form");
      alert("Payment timed out. Please try again.");
    }
    return () => clearTimeout(timerId);
  }, [step, timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePayNow = (e) => {
    e.preventDefault();
    setStep("payment");
    setTimeLeft(300);
  };

  const confirmPayment = () => {
    setSubmitting(true);
    setMessage("");

    const registrationData = {
      ...formData,
      student: { id: currentUser.id },
      event: { id: event.id },
      amount: event.amount,
      paymentStatus: "PAID",
      status: "CONFIRMED"
    };

    RegistrationService.registerForEvent(registrationData).then(
      (response) => {
        setSubmitting(false);
        setRegistrationId(response.data.registrationId);
        setStep("success");
        // Redirect after 1 second of success animation
        setTimeout(() => {
          navigate(`/event/${id}`, { state: { registrationSuccess: true } });
        }, 1000);
      },
      (error) => {
        setSubmitting(false);
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        setMessage(resMessage);
        setStep("form");
      }
    );
  };

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

  return (
    <div className="event-registration-page bg-white min-vh-100">
      <div className="container py-4">
        <div className="row">
          <div className="col-lg-8">
            {step === "form" && (
              <div className="card border-0 shadow-sm rounded-4 p-4 mb-4">
                <h4 className="fw-bold mb-4">Registration Form</h4>
                <form onSubmit={handlePayNow}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-bold">Full Name</label>
                      <input
                        type="text"
                        className="form-control rounded-3"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-bold">Date of Birth</label>
                      <input
                        type="date"
                        className="form-control rounded-3"
                        name="dob"
                        value={formData.dob}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-bold">Email Address</label>
                      <input
                        type="email"
                        className="form-control rounded-3"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-bold">Mobile Number</label>
                      <input
                        type="tel"
                        className="form-control rounded-3"
                        name="mobileNumber"
                        value={formData.mobileNumber}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-md-12">
                      <label className="form-label small fw-bold">College Name</label>
                      <input
                        type="text"
                        className="form-control rounded-3"
                        name="collegeName"
                        value={formData.collegeName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-bold">College Code</label>
                      <input
                        type="text"
                        className="form-control rounded-3"
                        name="collegeCode"
                        value={formData.collegeCode}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-bold">Roll Number</label>
                      <input
                        type="text"
                        className="form-control rounded-3"
                        name="rollNumber"
                        value={formData.rollNumber}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  {message && (
                    <div className="alert alert-danger mt-3 small rounded-3" role="alert">
                      {message}
                    </div>
                  )}

                  <div className="mt-5 pt-3 border-top d-flex justify-content-between align-items-center">
                    <div>
                      <div className="text-muted small">Total Amount</div>
                      <div className="fw-bold h4 mb-0">₹{event.amount}</div>
                    </div>
                    <button 
                      type="submit" 
                      className="btn btn-dark px-5 py-2 fw-bold rounded-3"
                    >
                      Pay Now
                    </button>
                  </div>
                </form>
              </div>
            )}

            {step === "payment" && (
              <div className="card border-0 shadow-sm rounded-4 p-5 mb-4 text-center">
                <h4 className="fw-bold mb-4">Scan QR to Pay</h4>
                <div className="payment-qr-container mb-4 d-inline-block p-3 border rounded-4 bg-light">
                  <img 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=collabx@upi&pn=CollabX&am=${event.amount}`} 
                    alt="Payment QR Code" 
                    className="img-fluid"
                    style={{ width: "200px", height: "200px" }}
                  />
                </div>
                <div className="mb-4">
                  <h5 className="fw-bold">Amount: ₹{event.amount}</h5>
                  <p className="text-muted small">Merchant: CollabX Events</p>
                </div>
                <div className="timer-container mb-4">
                  <div className="text-muted small mb-1">QR expires in</div>
                  <div className={`fw-bold h4 ${timeLeft < 60 ? 'text-danger' : 'text-primary'}`}>
                    {formatTime(timeLeft)}
                  </div>
                </div>
                <div className="alert alert-info small rounded-3 mx-auto" style={{ maxWidth: "400px" }}>
                  Please scan the QR code using any UPI app (GPay, PhonePe, Paytm) and complete the payment.
                </div>
                <button 
                  className="btn btn-dark px-5 py-3 fw-bold rounded-3 mt-3 w-100 shadow-sm"
                  onClick={confirmPayment}
                  disabled={submitting}
                >
                  {submitting ? "Processing..." : "I have paid"}
                </button>
                <button 
                  className="btn btn-link text-muted small mt-3 text-decoration-none"
                  onClick={() => setStep("form")}
                  disabled={submitting}
                >
                  Go Back
                </button>
              </div>
            )}

            {step === "success" && (
              <div className="card border-0 shadow-sm rounded-4 p-5 mb-4 text-center py-5">
                <div className="success-animation mb-4">
                  <div className="checkmark-circle">
                    <div className="background"></div>
                    <div className="checkmark draw"></div>
                  </div>
                </div>
                <h2 className="fw-bold mb-3 mt-4 text-success">Registration Successful!</h2>
                <p className="text-muted mb-4">
                  Thank you for registering. Your spot for <strong>{event.title}</strong> is confirmed.
                </p>
                <div className="p-3 bg-light rounded-3 d-inline-block mb-4">
                  <div className="small text-muted mb-1">Registration ID</div>
                  <div className="fw-bold">{registrationId}</div>
                </div>
                <p className="text-muted small mt-3">Redirecting you to the event page...</p>
              </div>
            )}
          </div>

          <div className="col-lg-4">
            <div className="card border-0 shadow-sm rounded-4 p-4 sticky-top" style={{ top: "100px", zIndex: 10 }}>
              <div className="mb-3">
                <img 
                  src={event.image1 ? `http://localhost:8080/uploads/${event.image1}` : ""} 
                  alt={event.title} 
                  className="w-100 rounded-3 mb-3" 
                  style={{ height: "150px", objectFit: "cover" }}
                />
                <h5 className="fw-bold mb-2">{event.title}</h5>
                <div className="text-muted small mb-2">
                  <FaBookmark className="me-2" />
                  <span>{event.category}, {event.type}</span>
                </div>
                <div className="text-muted small mb-2">
                  <FaMapMarkerAlt className="me-2" />
                  <span>{event.venue}</span>
                </div>
                <div className="text-muted small mb-2">
                  <FaClock className="me-2" />
                  <span>{formatDateTime(event.startDate)} - {formatDateTime(event.endDate)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .checkmark-circle {
          width: 100px;
          height: 100px;
          position: relative;
          display: inline-block;
          vertical-align: top;
          margin-bottom: 20px;
        }
        .checkmark-circle .background {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          background: #28a745;
          position: absolute;
        }
        .checkmark-circle .checkmark {
          border-radius: 5px;
        }
        .checkmark-circle .checkmark.draw:after {
          animation-duration: 800ms;
          animation-timing-function: ease;
          animation-name: checkmark;
          transform: scaleX(-1) rotate(135deg);
        }
        .checkmark-circle .checkmark:after {
          opacity: 1;
          height: 50px;
          width: 25px;
          transform-origin: left top;
          border-right: 5px solid white;
          border-top: 5px solid white;
          content: "";
          left: 25px;
          top: 50px;
          position: absolute;
        }
        @keyframes checkmark {
          0% {
            height: 0;
            width: 0;
            opacity: 1;
          }
          20% {
            height: 0;
            width: 25px;
            opacity: 1;
          }
          40% {
            height: 50px;
            width: 25px;
            opacity: 1;
          }
          100% {
            height: 50px;
            width: 25px;
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default EventRegistration;
