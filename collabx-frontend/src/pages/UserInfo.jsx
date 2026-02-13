import React from "react";
import AuthService from "../services/AuthService";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaUser, FaEnvelope, FaShieldAlt, FaCalendarAlt } from "react-icons/fa";

const UserInfo = () => {
  const currentUser = AuthService.getCurrentUser();
  const navigate = useNavigate();

  if (!currentUser) return <div className="text-center mt-5">Please login to view information.</div>;

  const getInitials = (name) => {
    return name ? name.charAt(0).toUpperCase() : "U";
  };

  return (
    <div className="bg-light d-flex flex-column overflow-hidden" style={{ height: "calc(100vh - 64px)" }}>
      <div className="container-fluid flex-grow-1 d-flex align-items-center justify-content-center p-3 overflow-auto">
        <div className="card border-0 shadow-sm rounded-4 overflow-hidden w-100" style={{ maxWidth: "1250px", height: "auto" }}>
          <div className="row g-0">
            {/* Left Section: Personal Information Summary */}
            <div className="col-md-5 bg-white border-end p-5 d-flex flex-column align-items-center text-center justify-content-center">
              <div className="mb-3">
                <h4 className="fw-bold mb-1">Personal Information</h4>
                <p className="text-muted small">Manage your account details and preferences</p>
              </div>
              
              <div 
                className="rounded-circle d-flex align-items-center justify-content-center text-primary fw-bold shadow-sm mb-3" 
                style={{ 
                  width: "120px", 
                  height: "120px", 
                  backgroundColor: "#f8f9fa", 
                  fontSize: "3rem",
                  border: "4px solid #fff"
                }}
              >
                {getInitials(currentUser.username)}
              </div>
              
              <h3 className="fw-bold mb-2">{currentUser.username}</h3>
              <span className="badge bg-primary-soft text-primary px-4 py-2 rounded-pill fw-bold text-uppercase" style={{ letterSpacing: "1px", fontSize: "0.7rem" }}>
                {currentUser.roles?.[0]?.replace('ROLE_', '') || 'USER'}
              </span>
            </div>

            {/* Right Section: Details */}
            <div className="col-md-7 bg-white p-5">
              <div className="row g-3">
                <div className="col-md-6">
                  <div className="info-box p-3 px-4 rounded-3 border bg-light border-0">
                    <div className="d-flex align-items-center mb-1">
                      <div className="text-muted me-2"><FaUser size={14} /></div>
                      <label className="text-muted small fw-bold text-uppercase mb-0" style={{fontSize: "0.65rem"}}>Username</label>
                    </div>
                    <p className="mb-0 fw-medium ps-4 small">{currentUser.username}</p>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="info-box p-3 px-4 rounded-3 border bg-light border-0">
                    <div className="d-flex align-items-center mb-1">
                      <div className="text-muted me-2"><FaEnvelope size={14} /></div>
                      <label className="text-muted small fw-bold text-uppercase mb-0" style={{fontSize: "0.65rem"}}>Email Address</label>
                    </div>
                    <p className="mb-0 fw-medium ps-4 small text-truncate">{currentUser.email}</p>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="info-box p-3 px-4 rounded-3 border bg-light border-0">
                    <div className="d-flex align-items-center mb-1">
                      <div className="text-muted me-2"><FaShieldAlt size={14} /></div>
                      <label className="text-muted small fw-bold text-uppercase mb-0" style={{fontSize: "0.65rem"}}>Account Security</label>
                    </div>
                    <p className="mb-0 fw-medium ps-4 small">Password: ••••••••••••</p>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="info-box p-3 px-4 rounded-3 border bg-light border-0">
                    <div className="d-flex align-items-center mb-1">
                      <div className="text-muted me-2"><FaCalendarAlt size={14} /></div>
                      <label className="text-muted small fw-bold text-uppercase mb-0" style={{fontSize: "0.65rem"}}>Member Since</label>
                    </div>
                    <p className="mb-0 fw-medium ps-4 small">Active Account</p>
                  </div>
                </div>
              </div>

              <div className="mt-3 p-3 rounded-3 bg-light-soft border-0 d-flex align-items-start">
                <FaShieldAlt className="text-primary opacity-50 mt-1" size={18} />
                <p className="mb-0 small text-muted ms-3" style={{fontSize: "0.75rem"}}>
                  Your data is securely managed. We use industry-standard encryption to protect your sensitive information.
                </p>
              </div>

              <div className="mt-3 text-end">
                <button className="btn btn-primary px-4 py-2 rounded-pill fw-bold text-white shadow-sm small">
                  Edit Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;