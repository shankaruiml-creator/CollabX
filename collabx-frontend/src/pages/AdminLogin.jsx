import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../services/AuthService";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    AuthService.login(username, password).then(
      () => {
        navigate("/admin");
        window.location.reload();
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
    <div className="auth-container py-5" style={{ backgroundColor: "#f8f9fa" }}>
      <div className="container">
        <div className="row align-items-center g-5">
          {/* Image Section - Only the Image */}
          <div className="col-lg-6 d-none d-lg-block text-center">
            <img 
              src="/admin.png" 
              alt="Admin Login Visual" 
              className="img-fluid"
              style={{ maxHeight: "600px", objectFit: "contain" }}
            />
          </div>
          
          {/* Form Section */}
          <div className="col-lg-6">
            <div className="bg-white p-5 rounded-4 shadow-sm border">
              <div className="auth-header text-center mb-4">
                <div className="mb-3">
                    <span className="badge bg-dark text-white p-2">SECURE ADMIN PORTAL</span>
                </div>
                <h2 className="fw-bold mb-1">Admin Login</h2>
                <p className="text-muted small">Enter credentials to access dashboard</p>
              </div>
              
              <div className="auth-body">
                <form onSubmit={handleLogin}>
                  <div className="mb-3">
                    <label className="form-label mb-1 small fw-bold" htmlFor="username">Admin Username</label>
                    <input
                      type="text"
                      className="form-control custom-input"
                      id="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Username"
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label className="form-label mb-1 small fw-bold" htmlFor="password">Password</label>
                    <div className="password-wrapper">
                      <input
                        type={showPassword ? "text" : "password"}
                        className="form-control custom-input"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
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

                  <button className="auth-btn btn btn-dark w-100 mb-3 text-white fw-bold py-3" disabled={loading}>
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Authenticating...
                      </>
                    ) : (
                      "Login to Dashboard"
                    )}
                  </button>

                  {message && (
                    <div className="alert alert-danger py-2" role="alert">
                      <small>{message}</small>
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

export default AdminLogin;
