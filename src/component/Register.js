import React, { useState } from 'react';
import '../component/Register.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify'; // Import ToastContainer and toast
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS for react-toastify

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    password: '',
  });

  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    username: '',
    password: '',
    form: ''
  });

  const navigate = useNavigate();
  
  const { firstName, lastName, username, password } = formData;

  const validateForm = () => {
    const newErrors = {
      firstName: '',
      lastName: '',
      username: '',
      password: '',
      form: ''
    };

    if (!firstName) newErrors.firstName = 'First Name is required';
    else if (firstName.length > 20) newErrors.firstName = 'First Name must be at most 30 characters';

    if (!lastName) newErrors.lastName = 'Last Name is required';
    else if (lastName.length > 20) newErrors.lastName = 'Last Name must be at most 30 characters';

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
      await axios.post('http://localhost:5000/api/register', formData);
      toast.success('Registration successful!'); // Display success toast
      navigate('/');
    } catch (err) {
      console.error(err.response?.data || err.message);
      const errorMessage = err.response?.data?.msg || 'An unexpected error occurred';
      toast.error(errorMessage); // Display error toast
      setErrors({ ...errors, form: errorMessage });
    }
  };

  return (
    <div className="main-reg">
      <div className="register-container">
        <div className="register-form">
          <h2>Register</h2>
          {errors.form && <p className="error-message">{errors.form}</p>}
          <form onSubmit={onSubmit}>
            <div className="form-group2343434553">
              <label htmlFor="firstName">First Name:</label>
              <input 
                type="text" 
                placeholder='Enter your First Name'
                id="firstName" 
                name="firstName" 
                value={firstName} 
                onChange={onChange} 
                required 
                maxLength="20" // Restrict to max 20 characters
              />
              {errors.firstName && <p className="error-message">{errors.firstName}</p>}
            </div>
            <div className="form-group2343434553">
              <label htmlFor="lastName">Last Name:</label>
              <input 
                type="text" 
                placeholder='Enter Your Last Name'
                id="lastName" 
                name="lastName" 
                value={lastName} 
                onChange={onChange} 
                required 
                maxLength="20" // Restrict to max 20 characters
              />
              {errors.lastName && <p className="error-message">{errors.lastName}</p>}
            </div>
            <div className="form-group2343434553">
              <label htmlFor="username">Username:</label>
              <input 
                type="text" 
                placeholder='Enter Your User Name'
                id="username" 
                name="username" 
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
            <div className='alreadyregisterlogin1234'>
              <p>Already registered? <Link to="/">Login here!</Link></p>
            </div>
            <button type="submit" className='butt_reg'>Register</button>
          </form>
        </div>
      </div>
     
    </div>
  );
};

export default Register;
