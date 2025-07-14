// src/components/Header.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, NavLink, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useUser } from '../context/UserContext';
import axiosInstance from '../api/axios';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { employee, setEmployee } = useUser(); // ✅ Combined useUser call
  const [unreadCount, setUnreadCount] = useState(0);

  const handleLogout = () => {
    setEmployee(null);
    localStorage.removeItem('employee');
    toast.warn('Logged out successfully!');
    navigate('/');
  };

  // ✅ Fetch unread count safely
  useEffect(() => {
    if (employee?.emp_id) {
      axiosInstance.get(`notifications/unread-count/${employee.emp_id}`)
        .then(res => setUnreadCount(res.data.unread_count))
        .catch(err => console.error(err));
    }
  }, [employee?.emp_id]);

  // ✅ Mark all notifications as read on /dashboard/notification route
  useEffect(() => {
    if (employee?.emp_id && location.pathname === '/dashboard/notification') {
      axiosInstance.post(`notifications/mark-read/${employee.emp_id}`)
        .then(() => setUnreadCount(0))
        .catch(err => console.error(err));
    }
  }, [location.pathname, employee?.emp_id]);

  return (
    <div className="d-flex justify-content-end align-items-center p-3 border-bottom">
      <li style={{ listStyle: 'none' }} className='nav-item'>
        <button className='btn btn-sm btn-danger mx-4 d-flex align-items-center gap-2' onClick={handleLogout}>
          <span>Logout</span>
          <i className="bi bi-box-arrow-right fs-6"></i>
        </button>
      </li>

      <li style={{ listStyle: 'none' }} className="nav-item position-relative">
        <NavLink to="/dashboard/notification" className="position-relative d-inline-block">
          <i className="bi bi-bell-fill me-3 fs-5" role="button" title="Notifications"></i>
          {unreadCount > 0 && (
            <span
              className="badge bg-danger rounded-pill"
              style={{
                position: 'absolute',
                top: '-6px',
                right: '6px',
                fontSize: '0.65rem',
                padding: '2px 5px',
              }}
            >
              {unreadCount}
            </span>
          )}
        </NavLink>
      </li>


      <li style={{ listStyle: 'none' }} className='nav-item'>
        <NavLink to={'/dashboard/profile'}>

          <img
            src={
              employee?.avatar ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(employee?.name || 'User')}&background=0D8ABC&color=fff&size=120`
            }
            alt="Profile"
            className="rounded-circle"
            width="35"
            height="35"
          />
        </NavLink>
      </li>
    </div>
  );
};

export default Header;
