import React from 'react'
import Navbar from './components/Navbar'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Home from './pages/Home'
import Doctors from './pages/Doctors'
import Login from './pages/Login'
import Contact from './pages/Contact'
import Appointment from './pages/Appointment'
import MyAppointments from './pages/MyAppointments'
import MyProfile from './pages/MyProfile'
import AIPredictor from './pages/AIPredictor'
import Footer from './components/Footer'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Verify from './pages/Verify'
import { fadeUp, easeOut } from './lib/motion'

const App = () => {
  const location = useLocation()

  return (
    <div className='patient-app-bg flex min-h-screen flex-col'>
      <ToastContainer position="top-right" theme="colored" />
      <div className='mx-auto w-full max-w-6xl flex-1 px-4 pb-16 sm:px-6 lg:px-8'>
        <Navbar />
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={fadeUp.initial}
            animate={fadeUp.animate}
            exit={fadeUp.exit}
            transition={{ duration: 0.32, ease: easeOut }}
          >
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/doctors' element={<Doctors />} />
              <Route path='/doctors/:speciality' element={<Doctors />} />
              <Route path='/login' element={<Login />} />
              <Route path='/contact' element={<Contact />} />
              <Route path='/appointment/:docId' element={<Appointment />} />
              <Route path='/my-appointments' element={<MyAppointments />} />
              <Route path='/my-profile' element={<MyProfile />} />
              <Route path='/verify' element={<Verify />} />
              <Route path='/ai-predictor' element={<AIPredictor />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </div>
      <Footer />
    </div>
  )
}

export default App
