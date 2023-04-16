import React from 'react'
import Navbar from './components/Navbar'
import { Outlet } from 'react-router-dom'

function Root() {
    return (
        <div className='text-center font-poppins'>
            <Navbar />
            <Outlet />
        </div>
    )
}

export default Root
