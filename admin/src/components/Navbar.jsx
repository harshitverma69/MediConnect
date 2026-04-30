import React, { useContext } from 'react'
import { motion } from 'framer-motion'
import { assets } from '../assets/assets'
import { DoctorContext } from '../context/DoctorContext'
import { AdminContext } from '../context/AdminContext'
import { useNavigate } from 'react-router-dom'
import { spring } from '../lib/motion'

const Navbar = () => {

  const { dToken, setDToken } = useContext(DoctorContext)
  const { aToken, setAToken } = useContext(AdminContext)

  const navigate = useNavigate()

  const logout = () => {
    navigate('/')
    dToken && setDToken('')
    dToken && localStorage.removeItem('dToken')
    aToken && setAToken('')
    aToken && localStorage.removeItem('aToken')
  }

  const role = aToken ? 'Admin' : 'Doctor'

  return (
    <motion.header
      className='sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-slate-200/80 bg-white/90 px-4 py-3 shadow-nav backdrop-blur-md sm:px-8'
      initial={{ y: -12, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={spring}
    >
      <div className='flex min-w-0 items-center gap-3'>
        <motion.img
          onClick={() => navigate(aToken ? '/admin-dashboard' : '/doctor-dashboard')}
          className='h-8 w-auto shrink-0 cursor-pointer sm:h-9'
          src={assets.admin_logo}
          alt='MediConnect'
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          transition={spring}
        />
        <motion.span
          className='hidden rounded-full border border-primary/20 bg-primary-muted px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary sm:inline'
          layout
        >
          {role} console
        </motion.span>
      </div>
      <motion.button
        type='button'
        onClick={() => logout()}
        className='shrink-0 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white shadow-md'
        whileHover={{ scale: 1.05, boxShadow: '0 8px 24px rgba(15,118,110,0.35)' }}
        whileTap={{ scale: 0.96 }}
        transition={spring}
      >
        Log out
      </motion.button>
    </motion.header>
  )
}

export default Navbar
