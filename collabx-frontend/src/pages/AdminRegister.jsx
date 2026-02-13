import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import AuthService from "../services/AuthService";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const AdminRegister = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [successful, setSuccessful] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    AuthService.checkAdminExists().then(
      (response) => {
        if (response.data) {
          navigate("/login");
        }
      }
    );
  }, [navigate]);

  const handleRegister = (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    AuthService.register(username, email, password, "admin", {}).then(
      (response) => {
        setMessage(response.message);
        setSuccessful(true);
        setLoading(false);
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      },
      (error) => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();

        setLoading(false);
        setMessage(resMessage);
      }
    );
  };

  return (
    <div className="auth-container py-5">
      <div className="container">
        <div className="auth-card-wrapper split-layout mx-auto">
          <div className="auth-visual-side">
            <img 
              src="/login.gif" 
              alt="Admin Visual" 
              className="login-gif" 
            />
            <div className="visual-overlay">
              <h1 className="display-4 fw-bold text-white">Platform Admin</h1>
              <p className="lead text-white">Control and Manage CollabX.</p>
            </div>
          </div>
          
          <div className="auth-form-side">
            <div className="auth-card-content w-100">
              <div className="auth-header text-center mb-4">
                <h2 className="fw-bold mb-1">Admin Registration</h2>
                <p className="text-muted small">Register as the platform administrator</p>
              </div>
              
              <div className="auth-body">
                {!successful ? (
                  <form onSubmit={handleRegister}>
                    <div className="mb-3">
                      <label className="form-label mb-1" htmlFor="username">Username</label>
                      <input
                        type="text"
                        className="form-control custom-input"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Admin username"
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label mb-1" htmlFor="email">Email</label>
                      <input
                        type="email"
                        className="form-control custom-input"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Admin email"
                        required
                      />
                    </div>

                    <div className="mb-4">
                      <label className="form-label mb-1" htmlFor="password">Password</label>
                      <div className="password-wrapper">
                        <input
                          type={showPassword ? "text" : "password"}
                          className="form-control custom-input"
                          id="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Admin password"
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

                    <button className="auth-btn btn btn-primary w-100 mb-3 text-white fw-bold" disabled={loading}>
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2"></span>
                          Registering...
                        </>
                      ) : (
                        "Register Admin"
                      )}
                    </button>

                    {message && (
                      <div className="alert alert-danger py-2" role="alert">
                        <small>{message}</small>
                      </div>
                    )}
                  </form>
                ) : (
                  <div className="text-center py-4">
                    <div className="alert alert-success">
                      {message}. Redirecting to login...
                    </div>
                    <Link to="/login" className="btn btn-primary w-100 text-white">Go to Login</Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminRegister;
