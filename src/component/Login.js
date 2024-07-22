import React, { useState } from 'react';
import '../component/Login.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from '../component/Photo/Screenshot.png'; // Adjust the path as necessary
import { ToastContainer, toast } from 'react-toastify'; // Import ToastContainer and toast
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS for react-toastify

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const [errors, setErrors] = useState({
    username: '',
    password: '',
    form: ''
  });

  const navigate = useNavigate();
  
  const { username, password } = formData;

  const validateForm = () => {
    const newErrors = {
      username: '',
      password: '',
      form: ''
    };

    if (!username) newErrors.username = 'Username is required';
    else if (username.length > 16) newErrors.username = 'Username must be at most 16 characters';
    
    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    else if (password.length > 16) newErrors.password = 'Password must be at most 16 characters';

    return newErrors;
  };

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' }); // Clear individual field error
  };

  const onSubmit = async e => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (Object.values(validationErrors).some(error => error)) {
      setErrors({ ...validationErrors, form: 'Please fix the errors above' });
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/login', { username, password });
      localStorage.setItem('username', username); // Save username in local storage
      localStorage.setItem('firstName', response.data.firstName); // Save first name in local storage
      toast.success('Login successful!'); // Display success toast
      navigate('/dashboard'); // Redirect to dashboard upon successful login
    } catch (err) {
      console.error(err.response?.data || err.message);
      const errorMessage = err.response?.data?.msg || 'An unexpected error occurred';
      toast.error(errorMessage); // Display error toast
      setErrors({ ...errors, form: errorMessage });
   }
  };

  return (
    <div>  <nav className="navbar">
    <div className="navbar-brand">
    <img src={logo} alt="Logo" className="logo-image12344" />
    </div>
   
  </nav>
    <div className="main-log">
      <div className="login-container">
        <div className="login-form">
          <h2 className='loginheading'>Login</h2>
          <form onSubmit={onSubmit}>
            <div className="form-group2343434553">
              <label htmlFor="username">Username:</label>
              <input 
                type="text" 
                id="username" 
                name="username" 
                placeholder='Enter your User Name'
                value={username} 
                onChange={onChange} 
                required 
                maxLength="16" // Restrict to max 16 characters
              />
              {errors.username && <p className="error-message">{errors.username}</p>}
            </div>
            <div className="form-group2343434553">
              <label htmlFor="password">Password:</label>
              <input 
                type="password" 
                id="password" 
                name="password" 
                  placeholder='Enter your password'
                value={password} 
                onChange={onChange} 
                required 
                minLength="8" // Minimum length of 8 characters
                maxLength="16" // Maximum length of 16 characters
              />
              {errors.password && <p className="error-message">{errors.password}</p>}
            </div>
            <div className='registerlink1234'>
              <p>Want to register? <Link to="/Register">Register</Link></p>
            </div>
            {errors.form && <p className="error-message">{errors.form}</p>}
            <button type="submit" className='butt_log'>Login</button>
          </form>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Login;
