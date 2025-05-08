import React from 'react'
import DoctorDashboard from './pages/doctor/DoctorDashboard'
import { Outlet } from 'react-router-dom'

const Doctorlayout = () => {
  return (
    <div className='w-[100vw] flex '>
      <DoctorDashboard className="w-[16vw]  sm:w-[20vw]"/>
      {/* <Outlet className="w-[84vw] sm:2-[80vw]"/> */}
    </div>
  )
}

export default Doctorlayout