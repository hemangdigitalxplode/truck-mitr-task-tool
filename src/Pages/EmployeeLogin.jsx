import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext'
import axiosInstance from '../api/axios';
import { toast } from 'react-toastify';
import logo from '../assets/updated-logo.jpg';
// import backgroundImg from '../assets/background.jpg'

const EmployeeLogin = () => {
  const navigate = useNavigate();
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);


  const { setEmployee } = useUser()


  const handleLogin = async (e) => {
    e.preventDefault();

    if (!employeeId || !password) {
      toast.warn('Please enter both Employee ID and Password');
      return;
    }

    setLoading(true); // ⏳ Start loading state

    try {
      const response = await axiosInstance.post('/employee/login', {
        emp_id: employeeId,
        password: password,
      });

      if (response.status === 200) {
        const empData = response.data.employee;

        toast.success('Login successful!');
        setEmployee(empData); // Store in context
        localStorage.setItem('employee', JSON.stringify(empData)); // Persist to localStorage
        navigate('/dashboard/home');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false); // ✅ End loading state
    }
  };


  return (
    <div
      className="container-fluid d-flex justify-content-center align-items-center min-vh-100"
      style={{
        backgroundColor: "white"
      }}
    >
      <div className="card shadow p-4 customLoginCard" style={{ maxWidth: '400px', width: '100%' }}>
        <div className="text-center mb-4">
          <img src={logo} alt="Logo" className="mb-3 mainLogo" />
          <h4 className="fw-bold heading">Member Login</h4>
          <p className="text-dark">Access your task dashboard by logging in</p>
        </div>

        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label htmlFor="employeeId" className="form-label">Member ID</label>
            <input
              type="text"
              className="form-control"
              id="employeeId"
              placeholder="Enter your Member ID"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="d-grid">
            <button
              type="submit"
              className="btn btn-primary loginBtn"
              disabled={loading}
            >
              {loading ? 'Wait...' : 'Login'}
            </button>
          </div>
        </form>
      </div>
    </div>

  );
};

export default EmployeeLogin;
