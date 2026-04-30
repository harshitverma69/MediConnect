import React, { useContext } from 'react'
import { DoctorContext } from './context/DoctorContext';
import { AdminContext } from './context/AdminContext';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Admin/Dashboard';
import AllAppointments from './pages/Admin/AllAppointments';
import AddDoctor from './pages/Admin/AddDoctor';
import DoctorsList from './pages/Admin/DoctorsList';
import Login from './pages/Login';
import DoctorAppointments from './pages/Doctor/DoctorAppointments';
import DoctorDashboard from './pages/Doctor/DoctorDashboard';
import DoctorProfile from './pages/Doctor/DoctorProfile';
import { easeOut } from './lib/motion'

const AnimatedMain = () => {
  const location = useLocation()
  const { aToken } = useContext(AdminContext)

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.28, ease: easeOut }}
      >
        <Routes>
          <Route path='/' element={<Navigate to={aToken ? '/admin-dashboard' : '/doctor-dashboard'} replace />} />
          <Route path='/admin-dashboard' element={<Dashboard />} />
          <Route path='/all-appointments' element={<AllAppointments />} />
          <Route path='/add-doctor' element={<AddDoctor />} />
          <Route path='/doctor-list' element={<DoctorsList />} />
          <Route path='/doctor-dashboard' element={<DoctorDashboard />} />
          <Route path='/doctor-appointments' element={<DoctorAppointments />} />
          <Route path='/doctor-profile' element={<DoctorProfile />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  )
}

const App = () => {

  const { dToken } = useContext(DoctorContext)
  const { aToken } = useContext(AdminContext)

  return dToken || aToken ? (
    <div className='admin-app-bg flex min-h-screen flex-col'>
      <ToastContainer position="top-right" theme="colored" />
      <Navbar />
      <div className='flex min-h-0 flex-1'>
        <Sidebar />
        <main className='min-h-0 flex-1 overflow-x-auto overflow-y-auto'>
          <AnimatedMain />
        </main>
      </div>
    </div>
  ) : (
    <>
      <ToastContainer position="top-right" theme="colored" />
      <Login />
    </>
  )
}

export default App
