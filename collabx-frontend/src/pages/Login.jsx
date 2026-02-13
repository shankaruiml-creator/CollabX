import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import AuthService from "../services/AuthService";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
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
      (user) => {
        if (user.roles.includes("ROLE_COLLEGE") || user.roles.some(role => role.startsWith("ROLE_ESP_"))) {
          navigate("/college");
        } else if (user.roles.includes("ROLE_ADMIN")) {
          navigate("/admin");
        } else {
          navigate("/");
        }
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
    <div className="auth-container py-5">
      <div className="container">
        <div className="auth-card-wrapper split-layout mx-auto">
          <div className="auth-visual-side">
            <img 
              src="/login.gif" 
              alt="Login Visual" 
              className="login-gif" 
            />
            <div className="visual-overlay">
              <h1 className="display-4 fw-bold text-white">CollabX</h1>
              <p className="lead text-white">Connect, Collaborate, Create.</p>
            </div>
          </div>
          
          <div className="auth-form-side">
            <div className="auth-card-content w-100">
              <div className="auth-header text-center mb-4">
                <h2 className="fw-bold mb-1">Welcome Back</h2>
                <p className="text-muted small">Enter your details to continue</p>
              </div>
              
              <div className="auth-body">
                <form onSubmit={handleLogin}>
                  <div className="mb-3">
                    <label className="form-label mb-1" htmlFor="username">Username</label>
                    <input
                      type="text"
                      className="form-control custom-input"
                      id="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Enter username"
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
                        placeholder="Enter password"
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
                        Please wait...
                      </>
                    ) : (
                      "Login"
                    )}
                  </button>

                  {message && (
                    <div className="alert alert-danger py-2" role="alert">
                      <small>{message}</small>
                    </div>
                  )}
                  
                  <div className="auth-footer mt-4 text-center">
                    New to CollabX? <Link to="/register" className="text-primary fw-bold">Create account</Link>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
