import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from './component/Login';
import Register from './component/Register';
import Dashboard from './component/Dashboard';
import EmployeeList from './component/EmployeeList';
import Home from './component/Home'
import navbar from './component/Navbar'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <div>
      <ToastContainer />
      <Router>
      <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />}></Route>
          <Route path="/home" element={<Home />} />
          <Route path="/employee-list" element={<EmployeeList />} />
          <Route path="/Navbar1234" element={<navbar />} />
        
      </Routes>
    </Router>
    </div>
  );
}

export default App;
