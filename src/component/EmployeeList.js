import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import Navbar from './Navbar'
import '../component/EmployeeList.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

Modal.setAppElement('#root');

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const courses = ['BCA', 'MCA', 'BSC'];
  const [newEmployee, setNewEmployee] = useState({
    name: '',
    email: '',
    mobile: '',
    designation: '',
    gender: '',
    course: '',
    picture: null
  });
  const [editEmployee, setEditEmployee] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [editModalIsOpen, setEditModalIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2;
  useEffect(() => {
    // Fetch the list of employees from the database
    axios.get('http://localhost:5000/api/employees')
      .then(response => {
        setEmployees(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the employees!', error);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewEmployee({
      ...newEmployee,
      [name]: value
    });
  };

  const handleFileChange = (e) => {
    setNewEmployee({
      ...newEmployee,
      picture: e.target.files[0]
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const isEmailDuplicate = employees.some(employee => employee.email === newEmployee.email);
    if (isEmailDuplicate) {
      toast.error('Email already exists.');
      return;
    }
    const formData = new FormData();
    for (let key in newEmployee) {
      formData.append(key, newEmployee[key]);
    }

    // Add the new employee to the database
    axios.post('http://localhost:5000/api/employees', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
      .then(response => {
        setEmployees([...employees, response.data]);
        setNewEmployee({
          name: '',
          email: '',
          mobile: '',
          designation: '',
          gender: '',
          course: '',
          picture: null
        });
        setModalIsOpen(false);
        toast.success('Employee added successfully!');
      })
      .catch(error => {
        if (error.response && error.response.status === 400) {
          toast.error('Invalid email or mobile number already exists.');
        } else {
          toast.error('There was an error adding the employee!');
        }
        console.error('There was an error adding the employee!', error);
      });
  };

  const handleEdit = (employee) => {
    setEditEmployee(employee);
    setEditModalIsOpen(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditEmployee({
      ...editEmployee,
      [name]: value
    });
  };

  const handleEditFileChange = (e) => {
    setEditEmployee({
      ...editEmployee,
      picture: e.target.files[0]
    });
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    for (let key in editEmployee) {
      formData.append(key, editEmployee[key]);
    }

    // Update the employee in the database
    axios.put(`http://localhost:5000/api/employees/${editEmployee._id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
      .then(response => {
        setEmployees(employees.map(emp => (emp._id === response.data._id ? response.data : emp)));
        setEditModalIsOpen(false);
        setEditEmployee(null);
        toast.success('Employee updated successfully!');
      })
      .catch(error => {
        if (error.response.status === 400) {
          toast.error('Invalid email or mobile number already exists.');
        } else {
          toast.error('There was an error updating the employee!');
        }
        console.error('There was an error updating the employee!', error);
      });
  };

  const handleDelete = (id) => {
    axios.delete(`http://localhost:5000/api/employees/${id}`)
      .then(() => {
        setEmployees(employees.filter(emp => emp._id !== id));
      })
      .catch(error => {
        console.error('There was an error deleting the employee!', error);
      });
  };

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const closeEditModal = () => {
    setEditModalIsOpen(false);
  };

  // Function to format date as DD-MM-YYYY
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  const handleActivate = (id) => {
    axios.put(`http://localhost:5000/api/employees/activate/${id}`)
      .then(response => {
        setEmployees(employees.map(emp => (emp._id === response.data._id ? response.data : emp)));
        toast.success('Employee activated successfully!');
      })
      .catch(error => {
        toast.error('There was an error activating the employee!');
        console.error('There was an error activating the employee!', error);
      });
  };

  const handleDeactivate = (id) => {
    axios.put(`http://localhost:5000/api/employees/deactivate/${id}`)
      .then(response => {
        setEmployees(employees.map(emp => (emp._id === response.data._id ? response.data : emp)));
        toast.success('Employee deactivated successfully!');
      })
      .catch(error => {
        toast.error('There was an error deactivating the employee!');
        console.error('There was an error deactivating the employee!', error);
      
      });
  };

  // Function to filter employees based on search query
  const filteredEmployees = employees.filter(employee => {
    return (
      employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.mobile.includes(searchQuery) ||
      employee.designation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.gender.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.course.toLowerCase().includes(searchQuery.toLowerCase())||
      employee.unique_id.toLowerCase().includes(searchQuery.toLowerCase())||
      employee.createdAt.toLowerCase().includes(searchQuery.toLowerCase())
      
    );
  });
  const indexOfLastEmployee = currentPage * itemsPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - itemsPerPage;
  const currentEmployees = filteredEmployees.slice(
    indexOfFirstEmployee,
    indexOfLastEmployee
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const nextPage = () => {
    if (currentPage < Math.ceil(filteredEmployees.length / itemsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div>
      <Navbar />
    <div className="employee-list">
      <h1>Employee List</h1>
      <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="search-box"
        />
      <button onClick={openModal} className="add-employee-button">Add Employee</button>
    
      <Modal
  isOpen={modalIsOpen}
  onRequestClose={closeModal}
  contentLabel="Add Employee"
  className="modal"
  overlayClassName="overlay"
>
  <h2>Add Employee</h2>
  <form onSubmit={handleSubmit} className="add-employee-form" encType="multipart/form-data">
    <div className="form-groupasgdada">
      <label>Name:</label>
      <input
        type="text"
        name="name"
        value={newEmployee.name}
        onChange={handleChange}
        placeholder="Name"
        maxLength="25"
        pattern="[A-Za-z ]+"
        title="Name should only contain letters and spaces."
        required
      />
    </div>
    <div className="form-groupasgdada">
      <label>Email:</label>
      <input
        type="email"
        name="email"
        value={newEmployee.email}
        onChange={handleChange}
        placeholder="Email"
        maxLength="30"
        required
      />
    </div>
    <div className="form-groupasgdada">
      <label>Mobile Number:</label>
      <input
        type="text"
        name="mobile"
        value={newEmployee.mobile}
        onChange={handleChange}
        placeholder="Mobile Number"
        maxLength="10"
        pattern="[0-9]+"
        title="Mobile number should only contain digits."
        required
      />
    </div>
    <div className="form-groupasgdadaasgdada">
      <label>Designation:</label>
      <select
        name="designation"
        value={newEmployee.designation}
        onChange={handleChange}
        required
      >
        <option value="">Select Designation</option>
        <option value="HR">HR</option>
        <option value="Manager">Manager</option>
        <option value="Sales">Sales</option>
      </select>
    </div>
    <div className="form-groupasgdada">
      <label>Gender:</label>
      <div className="radiogender-container">
        <label>
          <input
            type="radio"
            name="gender"
            value="Male"
            checked={newEmployee.gender === 'Male'}
            onChange={handleChange}
            required
          />
          Male
        </label>
        <label>
          <input
            type="radio"
            name="gender"
            value="Female"
            checked={newEmployee.gender === 'Female'}
            onChange={handleChange}
          />
          Female
        </label>
      </div>
    </div>
    <div className="form-groupasgdada">
  <label>Courses:</label>
  <div className="course-checkboxes">
    {courses.map(course => (
      <label key={course}>
        <input
          type="checkbox"
          name="course"
          value={course}
          checked={newEmployee.course.includes(course)}
          onChange={(e) => {
            const selectedCourses = [...newEmployee.course];
            if (e.target.checked) {
              selectedCourses.push(e.target.value);
            } else {
              const index = selectedCourses.indexOf(e.target.value);
              if (index > -1) {
                selectedCourses.splice(index, 1);
              }
            }
            setNewEmployee({ ...newEmployee, course: selectedCourses.join(',') });
          }}
        />
        {course}
      </label>
    ))}
  </div>
</div>

    <div className="form-groupasgdada">
      <label>Picture:</label>
      <input
        type="file"
        name="picture"
        onChange={handleFileChange}
        accept="image/png, image/jpg"
        required
      />
    </div>
    <div className='form-actions'>
      <button type="submit">Submit</button>
      <button type="button" onClick={closeModal}>Cancel</button>
    </div>
  </form>
</Modal>
<Modal
  isOpen={editModalIsOpen}
  onRequestClose={closeEditModal}
  contentLabel="Edit Employee"
  className="modal"
  overlayClassName="overlay"
>
  <h2>Edit Employee</h2>
  {editEmployee && (
    <form onSubmit={handleEditSubmit} className="edit-employee-form" encType="multipart/form-data">
      <div className="form-groupasgdada">
        <label>Name:</label>
        <input
          type="text"
          name="name"
          value={editEmployee.name}
          onChange={handleEditChange}
          placeholder="Name"
          maxLength="25"
          pattern="[A-Za-z ]+"
          title="Name should only contain letters and spaces."
          required
        />
      </div>
      <div className="form-groupasgdada">
        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={editEmployee.email}
          onChange={handleEditChange}
          placeholder="Email"
          maxLength="30"
          required
        />
      </div>
      <div className="form-groupasgdada">
        <label>Mobile Number:</label>
        <input
          type="text"
          name="mobile"
          value={editEmployee.mobile}
          onChange={handleEditChange}
          placeholder="Mobile Number"
          maxLength="10"
          pattern="[0-9]+"
          title="Mobile number should only contain digits."
          required
        />
      </div>
      <div className="form-groupasgdada">
        <label>Designation:</label>
        <select
          name="designation"
          value={editEmployee.designation || ''}
          onChange={handleEditChange}
          required
        >
          <option value="">Select Designation</option>
          <option value="HR">HR</option>
          <option value="Manager">Manager</option>
          <option value="Sales">Sales</option>
        </select>
      </div>
      <div className="form-groupasgdada">
        <label>Gender:</label>
        <div className="radio-group">
          <label>
            <input
              type="radio"
              name="gender"
              value="Male"
              checked={editEmployee.gender === 'Male'}
              onChange={handleEditChange}
              required
            />
            Male
          </label>
          <label>
            <input
              type="radio"
              name="gender"
              value="Female"
              checked={editEmployee.gender === 'Female'}
              onChange={handleEditChange}
            />
            Female
          </label>
        </div>
      </div>
      <div className="form-groupasgdada">
        <label>Courses:</label>
        <div className="course-section">
          {courses.map(course => (
            <label key={course}>
              <input
                type="checkbox"
                name="course"
                value={course}
                checked={editEmployee.course.split(',').includes(course)}
                onChange={handleEditChange}
              />
              {course}
            </label>
          ))}
        </div>
      </div>
      <div className="form-groupasgdada">
        <label>Picture:</label>
        <input
          type="file"
          name="picture"
          accept="image/png, image/jpeg"
          onChange={handleEditFileChange}
        />
      </div>
      <div className='form-actions'>
        <button type="submit">Update</button>
        <button type="button" onClick={closeEditModal}>Cancel</button>
      </div>
    </form>
  )}
</Modal>

      <table className="employee-table">
        <thead>
          <tr>
            <th>Employee ID</th>
            <th>Picture</th>
            <th>Name</th>
            <th>Email</th>
            <th>Mobile</th>
            <th>Designation</th>
            <th>Gender</th>
            <th>Course</th>
            <th>Create Date</th>
            <th>Status Action</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
        {currentEmployees.map((employee) => (
              <tr key={employee._id}>
              <td>{employee.unique_id}</td>
              <td>
                {employee.picture && (
                  <img
                    src={`http://localhost:5000/uploads/${employee.picture}`}
                    alt={employee.name}
                    className="employee-picture"
                  />
                )}
              </td>
              <td>{employee.name}</td>
              <td>{employee.email}</td>
              <td>{employee.mobile}</td>
              <td>{employee.designation}</td>
              <td>{employee.gender}</td>
              <td>{employee.course}</td>
              <td>{formatDate(employee.createdAt)}</td>
              <td>
  {employee.status === 'active' ? (
    <button className="btn btn-deactivate" onClick={() => handleDeactivate(employee._id)}>Deactivate</button>
  ) : (
    <button className="btn btn-activate" onClick={() => handleActivate(employee._id)}>Activate</button>
  )}
</td>

             
             <td>{employee.status}</td>
              <td>
                  <button className="edit-button" onClick={() => handleEdit(employee)}>Edit</button>
                  <button className="delete-button" onClick={() => handleDelete(employee._id)}>Delete</button>
                </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <div className="pagination">
          <button onClick={prevPage} disabled={currentPage === 1}>
            Previous
          </button>
          {Array.from(
            { length: Math.ceil(filteredEmployees.length / itemsPerPage) },
            (_, index) => (
              <button
                key={index + 1}
                onClick={() => paginate(index + 1)}
                className={currentPage === index + 1 ? 'active' : ''}
              >
                {index + 1}
              </button>
            )
          )}
          <button
            onClick={nextPage}
            disabled={
              currentPage === Math.ceil(filteredEmployees.length / itemsPerPage)
            }
          >
            Next
          </button>
        </div>
    </div>
  );
};

export default EmployeeList;
