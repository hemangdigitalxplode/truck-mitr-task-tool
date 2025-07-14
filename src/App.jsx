// src/App.jsx
import { Routes, Route } from 'react-router-dom'
import EmployeeLogin from './Pages/EmployeeLogin'
import Dashboard from './Pages/Dashboard'
import './index.css'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Tasks from './Pages/Tasks'
// import AddTask from './Pages/AddTask'
import AddTask from './Pages/AddTask'
import Attendance from './Pages/Attendance'
import OfficeEvents from './Pages/OfficeEvents'
import DXChat from './Pages/DXChat'
import TaskDetails from './Pages/TaskDetails';
import Notifications from './Pages/Notifications';
import Profile from './Pages/Profile';
import PrivateRoute from './hooks/PrivateRoute';

function App() {
  return (
    <>
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<EmployeeLogin />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard/home"
          element={<PrivateRoute><Dashboard /></PrivateRoute>}
        />
        <Route
          path="/dashboard/task"
          element={<PrivateRoute><Tasks /></PrivateRoute>}
        />
        <Route
          path="/dashboard/task/:id"
          element={<PrivateRoute><TaskDetails /></PrivateRoute>}
        />
        <Route
          path="/dashboard/add-task"
          element={<PrivateRoute><AddTask /></PrivateRoute>}
        />
        <Route
          path="/dashboard/attendance"
          element={<PrivateRoute><Attendance /></PrivateRoute>}
        />
        <Route
          path="/dashboard/leave-management"
          element={<PrivateRoute><Attendance /></PrivateRoute>}
        />
        <Route
          path="/dashboard/office-events"
          element={<PrivateRoute><OfficeEvents /></PrivateRoute>}
        />
        <Route
          path="/dashboard/team-chat"
          element={<PrivateRoute><DXChat /></PrivateRoute>}
        />
        <Route
          path="/dashboard/notification"
          element={<PrivateRoute><Notifications /></PrivateRoute>}
        />
        <Route
          path="/dashboard/profile"
          element={<PrivateRoute><Profile /></PrivateRoute>}
        />
      </Routes>

      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </>

  )
}

export default App
