import React from 'react'
import { Outlet } from 'react-router-dom'
import AdminSidebar from '../Components/AdminSidebar'
const Adminlayout = () => {
  return (
    <>
    <div className="flex h-[100vh] overflow-y-hidden">
    <AdminSidebar/>
    <Outlet/>
    </div>
   
    </>
  )
}

export default Adminlayout
