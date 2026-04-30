import React, { useContext } from 'react'
import { motion } from 'framer-motion'
import { assets } from '../assets/assets'
import { NavLink } from 'react-router-dom'
import { DoctorContext } from '../context/DoctorContext'
import { AdminContext } from '../context/AdminContext'
import { spring } from '../lib/motion'

const linkClass = ({ isActive }) =>
  [
    'flex items-center gap-3 rounded-xl py-3 pl-3 pr-2 md:pl-4 md:pr-3 transition-all duration-200',
    isActive
      ? 'bg-white font-semibold text-primary shadow-card ring-1 ring-slate-200/80'
      : 'text-muted hover:bg-white/70 hover:text-ink',
  ].join(' ')

const Sidebar = () => {

  const { dToken } = useContext(DoctorContext)
  const { aToken } = useContext(AdminContext)

  const links = aToken
    ? [
        { to: '/admin-dashboard', icon: assets.home_icon, label: 'Dashboard' },
        { to: '/all-appointments', icon: assets.appointment_icon, label: 'Appointments' },
        { to: '/add-doctor', icon: assets.add_icon, label: 'Add doctor' },
        { to: '/doctor-list', icon: assets.people_icon, label: 'Doctors' },
      ]
    : [
        { to: '/doctor-dashboard', icon: assets.home_icon, label: 'Dashboard' },
        { to: '/doctor-appointments', icon: assets.appointment_icon, label: 'Appointments' },
        { to: '/doctor-profile', icon: assets.people_icon, label: 'Profile' },
      ]

  return (
    <motion.aside
      className='w-[200px] shrink-0 self-stretch border-r border-slate-200/80 bg-white/70 py-6 backdrop-blur-sm sm:w-[260px]'
      initial={{ x: -16, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={spring}
    >
      <p className='mb-3 px-5 text-xs font-semibold uppercase tracking-wider text-muted'>
        {aToken ? 'Operations' : 'Practice'}
      </p>
      <nav className='flex flex-col gap-0.5'>
        {links.map((item, i) => (
          <motion.div
            key={item.to}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ ...spring, delay: 0.05 * i }}
          >
            <NavLink to={item.to} className={linkClass}>
              <img className='h-5 w-5 opacity-80' src={item.icon} alt='' />
              <span>{item.label}</span>
            </NavLink>
          </motion.div>
        ))}
      </nav>
    </motion.aside>
  )
}

export default Sidebar
