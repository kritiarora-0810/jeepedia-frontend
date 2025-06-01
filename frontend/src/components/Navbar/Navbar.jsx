import React, { useState, useEffect } from 'react';
import './Navbar.css';
import mylogo from '../../assets/logo.png';
import { Link, useNavigate } from 'react-router-dom';
import { UserIcon } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [userEmail, setUserEmail] = useState('');
  const navigate = useNavigate();

  // Fetch user details and email from local storage on component mount
  useEffect(() => {
    const userDetails = localStorage.getItem('user_details');
    const storedEmail = localStorage.getItem('user_email');
    
    if (userDetails) {
      try {
        setUser(JSON.parse(userDetails));
      } catch (error) {
        console.error('Error parsing user details:', error);
      }
    }
    setUserEmail(storedEmail);
  }, []);

  // Toggle mobile menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Toggle dropdown menu
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user_details');
    setUser(null);
    setIsDropdownOpen(false);
    navigate('/'); // Redirect to home page
  };

  return (
    <header className="nav-header">
      <nav className="nav-container">
        {/* Logo */}
        <div className="logo-container">
          <Link to="/">
            <img className="logo" src={mylogo} alt="Logo" />
          </Link>
        </div>

        {/* Navigation Links */}
        <div className={`nav-links ${isMenuOpen ? 'open' : ''}`}>
          <ul className="nav-list">
            <li>
              <Link to="/" className="nav-link">
                <span>Home</span>
              </Link>
            </li>
            <li>
              <Link to="/jee-predictor" className="nav-link" onClick={(e) => {
                if (!user) {
                  localStorage.setItem('redirectAfterLogin', '/jee-predictor');
                }
              }}>
                <span>JEE Main College Predictor</span>
              </Link>
            </li>
            <li>
              <Link to="/community" className="nav-link" onClick={(e) => {
                if (!user) {
                  localStorage.setItem('redirectAfterLogin', '/community');
                }
              }}>
                <span>Community</span>
              </Link>
            </li>
            <li>
              <Link to="/feedback" className="nav-link" onClick={(e) => {
                if (!user) {
                  localStorage.setItem('redirectAfterLogin', '/feedback');
                }
              }}>
                <span>Feedback</span>
              </Link>
            </li>
            <li>
              <Link to="/contact-us" className="nav-link" onClick={(e) => {
                if (!user) {
                  localStorage.setItem('redirectAfterLogin', '/contact-us');
                }
              }}>
                <span>Contact Us</span>
              </Link>
            </li>
          </ul>
        </div>

        {/* User Actions */}
        <div className="nav-actions">
          {user ? (
            <div className="user-dropdown">
              <button className="login-button" onClick={toggleDropdown}>
                Hi, {user.first_name} {user.last_name}
              </button>
              {isDropdownOpen && (
                <div className="dropdown-menu">
                  <Link to="/dashboard" className="dropdown-item" onClick={(e) => {
                    if (!user) {
                      localStorage.setItem('redirectAfterLogin', '/dashboard');
                    }
                  }}>
                    Dashboard
                  </Link>
                  <button className="dropdown-item" onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login-register">
              <button className="login-button">Login/Signup</button>
            </Link>
          )}
          <ion-icon
            onClick={toggleMenu}
            name={isMenuOpen ? 'close' : 'menu'}
            className="menu-toggle"
          ></ion-icon>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;