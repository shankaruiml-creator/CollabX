import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthService from "../services/AuthService";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Register = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("student");
  
  // College specific
  const [collegeName, setCollegeName] = useState("");
  const [regNum, setRegNum] = useState("");
  const [collegeCode, setCollegeCode] = useState("");
  const [city, setCity] = useState("");
  
  const [otp, setOtp] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [successful, setSuccessful] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendOtp = (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    AuthService.sendOtp(email).then(
      (response) => {
        setMessage(response.data.message);
        setShowOtpInput(true);
        setLoading(false);
      },
      (error) => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();

        setMessage(resMessage);
        setLoading(false);
      }
    );
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setMessage("");
    setSuccessful(false);
    setLoading(true);

    const collegeData = role === "college" ? {
      collegeName,
      registrationNumber: regNum,
      collegeCode,
      city
    } : {};

    AuthService.register(username, email, password, role, collegeData, otp).then(
      (response) => {
        setMessage(response.message || "Registration successful!");
        setSuccessful(true);
        setLoading(false);
        
        // If auto-login was successful (JWT token received), redirect to dashboard
        if (response.token) {
          setTimeout(() => {
            if (response.roles.includes("ROLE_ADMIN")) {
              navigate("/admin-dashboard");
            } else if (response.roles.includes("ROLE_COLLEGE")) {
              navigate("/college-dashboard");
            } else {
              navigate("/");
            }
          }, 2000);
        }
      },
      (error) => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();

        setMessage(resMessage);
        setSuccessful(false);
        setLoading(false);
      }
    );
  };

  return (
    <div className="auth-container py-5" style={{ backgroundColor: "#f8f9fa" }}>
      <div className="container">
        <div className="row align-items-center g-5">
          {/* Image Section - Only the Image */}
          <div className="col-lg-6 d-none d-lg-block text-center">
            <img 
              src="/Register.png" 
              alt="Register Visual" 
              className="img-fluid"
              style={{ maxHeight: "600px", objectFit: "contain" }}
            />
          </div>

          {/* Form Section */}
          <div className="col-lg-6">
            <div className="bg-white p-5 rounded-4 shadow-sm border">
              <div className="auth-header text-center mb-4">
                <h2 className="fw-bold mb-1">Create Account</h2>
                <p className="text-muted">Start your journey with CollabX today</p>
              </div>

              <div className="auth-body">
                <form onSubmit={showOtpInput ? handleRegister : handleSendOtp}>
                  {!successful ? (
                    <>
                      {!showOtpInput ? (
                        <>
                          <div className="mb-4">
                            <label className="form-label d-block small mb-2 fw-bold text-uppercase tracking-wider" style={{ fontSize: "0.7rem" }}>I am a:</label>
                            <div className="role-selector">
                              <div 
                                className={`role-option ${role === "student" ? "active" : ""}`}
                                onClick={() => setRole("student")}
                              >
                                Student
                              </div>
                              <div 
                                className={`role-option ${role === "college" ? "active" : ""}`}
                                onClick={() => setRole("college")}
                              >
                                College
                              </div>
                            </div>
                          </div>

                          <div className="mb-3">
                            <label className="form-label small mb-1 fw-bold" htmlFor="username">Username</label>
                            <input
                              type="text"
                              className="form-control custom-input"
                              id="username"
                              value={username}
                              onChange={(e) => setUsername(e.target.value)}
                              placeholder="johndoe"
                              required
                            />
                          </div>

                          <div className="mb-3">
                            <label className="form-label small mb-1 fw-bold" htmlFor="email">Email Address</label>
                            <input
                              type="email"
                              className="form-control custom-input"
                              id="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              placeholder="name@example.com"
                              required
                            />
                          </div>

                          <div className="mb-3">
                            <label className="form-label small mb-1 fw-bold" htmlFor="password">Password</label>
                            <div className="password-wrapper">
                              <input
                                type={showPassword ? "text" : "password"}
                                className="form-control custom-input"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                              />
                              <span 
                                className="password-toggle-icon"
                                onClick={() => setShowPassword(!showPassword)}
                              >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                              </span>
                            </div>
                          </div>

                          {role === "college" && (
                            <div className="college-info-section mt-4 p-4 rounded-3 bg-light border">
                              <h6 className="fw-bold mb-3 small text-uppercase text-primary">College Details</h6>
                              <div className="mb-3">
                                <label className="form-label small mb-1 fw-bold">Full College Name</label>
                                <input
                                  type="text"
                                  className="form-control custom-input"
                                  value={collegeName}
                                  onChange={(e) => setCollegeName(e.target.value)}
                                  placeholder="e.g. Stanford University"
                                  required
                                />
                              </div>
                              <div className="row g-2">
                                <div className="col-4">
                                  <label className="form-label small mb-1 fw-bold">Reg. Number</label>
                                  <input
                                    type="text"
                                    className="form-control custom-input"
                                    value={regNum}
                                    onChange={(e) => setRegNum(e.target.value)}
                                    placeholder="REG12345"
                                    required
                                  />
                                </div>
                                <div className="col-4">
                                  <label className="form-label small mb-1 fw-bold">College code</label>
                                  <input
                                    type="text"
                                    className="form-control custom-input"
                                    value={collegeCode}
                                    onChange={(e) => setCollegeCode(e.target.value)}
                                    placeholder="COL123"
                                    required
                                  />
                                </div>
                                <div className="col-4">
                                  <label className="form-label small mb-1 fw-bold">City</label>
                                  <input
                                    type="text"
                                    className="form-control custom-input"
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                    placeholder="City Name"
                                    required
                                  />
                                </div>
                              </div>
                            </div>
                          )}

                          <button className="auth-btn btn btn-primary w-100 mb-3 mt-4 text-white fw-bold py-3" disabled={loading}>
                            {loading ? (
                              <>
                                <span className="spinner-border spinner-border-sm me-2"></span>
                                Sending OTP...
                              </>
                            ) : (
                              "Create Account"
                            )}
                          </button>
                        </>
                      ) : (
                        <>
                          <div className="mb-4 text-center">
                            <div className="alert alert-info py-2 mb-4">
                              <small>An OTP has been sent to <strong>{email}</strong></small>
                            </div>
                            <label className="form-label small mb-2 fw-bold" htmlFor="otp">Enter OTP</label>
                            <input
                              type="text"
                              className="form-control custom-input text-center fw-bold letter-spacing-lg"
                              id="otp"
                              value={otp}
                              onChange={(e) => setOtp(e.target.value)}
                              placeholder="000000"
                              maxLength="6"
                              style={{ fontSize: "1.5rem", letterSpacing: "0.5rem" }}
                              required
                            />
                          </div>

                          <button className="auth-btn btn btn-primary w-100 mb-3 text-white fw-bold py-3" disabled={loading}>
                            {loading ? (
                              <>
                                <span className="spinner-border spinner-border-sm me-2"></span>
                                Verifying...
                              </>
                            ) : (
                              "Verify & Register"
                            )}
                          </button>
                          
                          <button 
                            type="button"
                            className="btn btn-link w-100 text-decoration-none small" 
                            onClick={() => setShowOtpInput(false)}
                            disabled={loading}
                          >
                            Back to registration
                          </button>
                        </>
                      )}
                    </>
                  ) : (
                    <div className="text-center py-4">
                      <div className="mb-3">
                        <div className="bg-success bg-opacity-10 text-success rounded-circle d-inline-flex p-3">
                          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        </div>
                      </div>
                      <h5 className="fw-bold">Registration Successful!</h5>
                      <p className="text-muted small mb-4">{message}</p>
                      <Link to="/login" className="btn btn-primary w-100 text-white fw-bold py-3">Proceed to Login</Link>
                    </div>
                  )}

                  {!successful && message && (
                    <div className="alert alert-danger py-2" role="alert">
                      <small>{message}</small>
                    </div>
                  )}
                  
                  {!successful && (
                    <div className="auth-footer mt-4 text-center">
                      Already have an account? <Link to="/login" className="text-primary fw-bold text-decoration-none">Log in</Link>
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
