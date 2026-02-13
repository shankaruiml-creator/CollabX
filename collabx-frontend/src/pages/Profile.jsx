import React from "react";
import AuthService from "../services/AuthService";
import { useNavigate, Link } from "react-router-dom";
import { 
  FaArrowLeft, 
  FaChevronRight, 
  FaRegListAlt, 
  FaRegCommentDots, 
  FaRegQuestionCircle, 
  FaRegFileAlt, 
  FaSignOutAlt 
} from "react-icons/fa";

const Profile = ({ onClose }) => {
  const currentUser = AuthService.getCurrentUser();
  const navigate = useNavigate();

  if (!currentUser) return <div className="text-center mt-5">Please login to view profile.</div>;

  const handleLogout = () => {
    AuthService.logout();
    window.location.href = "/login";
  };

  const goToUserInfo = () => {
    if (typeof onClose === 'function') {
      onClose();
    }
    navigate("/user-info");
  };

  const getInitials = (name) => {
    return name ? name.charAt(0).toUpperCase() : "U";
  };

  return (
    <div className="profile-container bg-light h-100 overflow-auto">
      {/* Header */}
      <div className="bg-white p-2 px-3 d-flex align-items-center shadow-sm sticky-top">
        <button 
          className="btn btn-link text-dark p-0 me-3 border-0" 
          onClick={() => typeof onClose === 'function' ? onClose() : navigate(-1)}
        >
          <FaArrowLeft size={18} />
        </button>
        <h5 className="mb-0 fw-bold">Profile</h5>
      </div>

      <div className="p-3">
        {/* User Info Section */}
        <div className="d-flex align-items-center mb-4 ps-2">
          <div 
            className="rounded-circle d-flex align-items-center justify-content-center text-primary fw-bold" 
            style={{ 
              width: "60px", 
              height: "60px", 
              backgroundColor: "#E8EAF6", 
              fontSize: "1.5rem" 
            }}
          >
            {getInitials(currentUser.username)}
          </div>
          <div className="ms-3">
            <h5 className="mb-0 fw-bold text-truncate" style={{maxWidth: "180px"}}>{currentUser.username}</h5>
            <p className="text-muted mb-0 small text-truncate" style={{maxWidth: "180px"}}>{currentUser.email}</p>
          </div>
        </div>

        {/* User Info Button Section */}
        <div className="card border-0 shadow-sm rounded-4 mb-3 overflow-hidden">
          <button onClick={goToUserInfo} className="btn btn-white w-100 text-start p-2 px-3 d-flex align-items-center justify-content-between profile-item border-0">
            <div className="d-flex align-items-center">
              <div className="me-3 text-muted"><FaRegListAlt size={18} /></div>
              <span className="fw-medium">User Information</span>
            </div>
            <FaChevronRight size={14} className="text-muted" />
          </button>
        </div>

        {/* Support Section */}
        <div className="mb-3">
          <p className="text-muted fw-bold small text-uppercase mb-2 ps-2">Support</p>
          <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
            <Link to="/" className="text-decoration-none text-dark p-2 px-3 d-flex align-items-center justify-content-between profile-item">
              <div className="d-flex align-items-center">
                <div className="me-3 text-muted"><FaRegCommentDots size={18} /></div>
                <span className="fw-medium">Chat with us</span>
              </div>
              <FaChevronRight size={14} className="text-muted" />
            </Link>
          </div>
        </div>

        {/* More Section */}
        <div className="mb-3">
          <p className="text-muted fw-bold small text-uppercase mb-2 ps-2">More</p>
          <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
            <Link to="/" className="text-decoration-none text-dark p-2 px-3 d-flex align-items-center justify-content-between profile-item border-bottom">
              <div className="d-flex align-items-center">
                <div className="me-3 text-muted"><FaRegQuestionCircle size={18} /></div>
                <span className="fw-medium">Terms & Conditions</span>
              </div>
              <FaChevronRight size={14} className="text-muted" />
            </Link>
            <Link to="/" className="text-decoration-none text-dark p-2 px-3 d-flex align-items-center justify-content-between profile-item">
              <div className="d-flex align-items-center">
                <div className="me-3 text-muted"><FaRegFileAlt size={18} /></div>
                <span className="fw-medium">Privacy Policy</span>
              </div>
              <FaChevronRight size={14} className="text-muted" />
            </Link>
          </div>
        </div>

        {/* Logout Section */}
        <div className="card border-0 shadow-sm rounded-4 overflow-hidden mb-4">
          <button 
            onClick={handleLogout}
            className="btn btn-white w-100 text-start p-2 px-3 d-flex align-items-center border-0 profile-item"
          >
            <div className="me-3 text-muted"><FaSignOutAlt size={18} /></div>
            <span className="fw-medium">Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
