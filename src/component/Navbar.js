import React, { useEffect, useState } from 'react';
import { CgProfile } from 'react-icons/cg';
import { useNavigate, Link } from 'react-router-dom';
import '../component/Dashboard.css';
import logo from '../component/Photo/Screenshot.png'; // Adjust the path as necessary

const Dashboard = () => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');

  useEffect(() => {
    const storedFirstName = localStorage.getItem('firstName');
    if (storedFirstName) {
      setFirstName(storedFirstName);
    }
  }, []);

  const handleLogout = () => {
    // Clear local storage or any other logout logic
    localStorage.clear();
    navigate('/');
  };

  return (
    <div>
      <nav className="navbar">
        <div className="navbar-brand">
        <img src={logo} alt="Logo" className="logo-image12344" />
        </div>
        <div className="navbar-menu">
          <ul className="nav-list">
            <li><Link to="/dashboard"><h3>Home</h3></Link></li>
            <li><Link to="/employee-list"><h3 className='employeelistspace'>Employee List</h3></Link></li>
          </ul>
        </div>
        <div className="navbar-profile">
          <CgProfile size={40} className="profile-icon" />
          <div className="tooltip">
            <p>Name: {firstName}</p>
            <button type="button" className="log_dash" onClick={handleLogout}>Logout</button>
          </div>
        </div>
      </nav>
      
    </div>
  );
};

export default Dashboard;
