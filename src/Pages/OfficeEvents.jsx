import React from 'react'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'

const OfficeEvents = () => {
    return (
        <div className="d-flex">
            <Sidebar />
            <div className="flex-grow-1">
                <Header />
                <div className="p-4">
                    <h3>Office Events</h3>
                    <p>Explore upcoming and past office events, celebrations, and important dates here.</p>
                </div>

            </div>
        </div>
    )
}

export default OfficeEvents