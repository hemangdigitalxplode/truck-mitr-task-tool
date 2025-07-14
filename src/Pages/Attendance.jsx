import React from 'react'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'

const Attendance = () => {
  return (
    <div className="d-flex">
      <Sidebar />
      <div className="flex-grow-1">
        <Header />
        <div className="p-4">
          <h3>Attendance</h3>
          <p>View and manage your attendance records here. Check in/out timings, leave status, and more.</p>
        </div>
      </div>
    </div>
  )
}

export default Attendance