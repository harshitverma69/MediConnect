import React, { useContext, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { assets } from '../assets/assets'
import { NavLink, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { spring } from '../lib/motion'

const navLinkClass = ({ isActive }) =>
  isActive ? 'nav-link nav-link-active' : 'nav-link hover:text-ink'

const Navbar = () => {

  const navigate = useNavigate()

  const [showMenu, setShowMenu] = useState(false)
  const { token, setToken, userData } = useContext(AppContext)

  const logout = () => {
    localStorage.removeItem('token')
    setToken(false)
    setShowMenu(false)
    navigate('/login')
  }

  const closeMobile = () => setShowMenu(false)

  return (
    <motion.header
      className='sticky top-0 z-40 mb-8 border-b border-slate-200/80 bg-white/90 py-3 shadow-nav backdrop-blur-md'
      initial={{ y: -16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={spring}
    >
      <div className='flex items-center justify-between gap-4'>
        <motion.img
          onClick={() => { navigate('/'); closeMobile() }}
          className='h-9 w-auto cursor-pointer sm:h-10'
          src={assets.logo}
          alt='MediConnect'
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          transition={spring}
        />

        <nav className='hidden items-center gap-1 md:flex'>
          <NavLink to='/' className={navLinkClass}>Home</NavLink>
          <NavLink to='/doctors' className={navLinkClass}>Doctors</NavLink>
          <NavLink to='/ai-predictor' className={navLinkClass}>AI predictor</NavLink>
          <NavLink to='/contact' className={navLinkClass}>Contact</NavLink>
        </nav>

        <div className='flex items-center gap-3'>
          {token && userData ? (
            <div className='group relative hidden cursor-pointer sm:block'>
              <motion.div
                className='flex items-center gap-2 rounded-full py-1 pl-1 pr-3 ring-1 ring-slate-200 transition hover:bg-surface'
                whileHover={{ scale: 1.02 }}
                transition={spring}
              >
                <img className='h-9 w-9 rounded-full object-cover ring-2 ring-primary/20' src={userData.image} alt='' />
                <img className='h-3 w-3 opacity-60' src={assets.dropdown_icon} alt='' />
              </motion.div>
              <div className='absolute right-0 top-full z-30 hidden min-w-[200px] pt-2 group-hover:block'>
                <div className='overflow-hidden rounded-xl border border-slate-200 bg-white py-2 text-sm font-medium shadow-card'>
                  <button type='button' onClick={() => navigate('/my-profile')} className='block w-full px-4 py-2.5 text-left text-ink hover:bg-surface'>My profile</button>
                  <button type='button' onClick={() => navigate('/my-appointments')} className='block w-full px-4 py-2.5 text-left text-ink hover:bg-surface'>My appointments</button>
                  <button type='button' onClick={logout} className='block w-full px-4 py-2.5 text-left text-red-600 hover:bg-red-50'>Log out</button>
                </div>
              </div>
            </div>
          ) : (
            <motion.button
              type='button'
              onClick={() => navigate('/login')}
              className='hidden rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white shadow-md md:inline-block'
              whileHover={{ scale: 1.05, boxShadow: '0 8px 28px rgba(15,118,110,0.35)' }}
              whileTap={{ scale: 0.97 }}
              transition={spring}
            >
              Sign in
            </motion.button>
          )}

          <motion.button
            type='button'
            onClick={() => setShowMenu(true)}
            className='rounded-lg p-2 ring-1 ring-slate-200 md:hidden'
            whileTap={{ scale: 0.94 }}
            aria-label='Open menu'
          >
            <img className='h-6 w-6' src={assets.menu_icon} alt='' />
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {showMenu && (
          <>
            <motion.div
              key='backdrop'
              className='fixed inset-0 z-50 bg-ink/40 backdrop-blur-sm md:hidden'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMobile}
            />
            <motion.div
              key='drawer'
              className='fixed right-0 top-0 z-[60] flex h-full w-[min(100%,320px)] flex-col bg-white shadow-2xl md:hidden'
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 34 }}
            >
              <div className='flex items-center justify-between border-b border-slate-100 px-5 py-4'>
                <img src={assets.logo} className='h-8 w-auto' alt='' />
                <button type='button' onClick={closeMobile} className='rounded-lg p-2 hover:bg-surface'>
                  <img className='h-6 w-6' src={assets.cross_icon} alt='Close' />
                </button>
              </div>
              <nav className='flex flex-1 flex-col gap-1 p-4'>
                <NavLink to='/' onClick={closeMobile} className={({ isActive }) => `rounded-xl px-4 py-3 text-base font-semibold ${isActive ? 'nav-link-mobile-active' : 'text-ink hover:bg-surface'}`}>Home</NavLink>
                <NavLink to='/doctors' onClick={closeMobile} className={({ isActive }) => `rounded-xl px-4 py-3 text-base font-semibold ${isActive ? 'nav-link-mobile-active' : 'text-ink hover:bg-surface'}`}>All doctors</NavLink>
                <NavLink to='/ai-predictor' onClick={closeMobile} className={({ isActive }) => `rounded-xl px-4 py-3 text-base font-semibold ${isActive ? 'nav-link-mobile-active' : 'text-ink hover:bg-surface'}`}>AI predictor</NavLink>
                <NavLink to='/contact' onClick={closeMobile} className={({ isActive }) => `rounded-xl px-4 py-3 text-base font-semibold ${isActive ? 'nav-link-mobile-active' : 'text-ink hover:bg-surface'}`}>Contact</NavLink>
                {token && userData ? (
                  <>
                    <hr className='my-2 border-slate-100' />
                    <button type='button' onClick={() => { navigate('/my-profile'); closeMobile() }} className='rounded-xl px-4 py-3 text-left text-base font-semibold text-ink hover:bg-surface'>My profile</button>
                    <button type='button' onClick={() => { navigate('/my-appointments'); closeMobile() }} className='rounded-xl px-4 py-3 text-left text-base font-semibold text-ink hover:bg-surface'>My appointments</button>
                    <button type='button' onClick={logout} className='rounded-xl px-4 py-3 text-left text-base font-semibold text-red-600 hover:bg-red-50'>Log out</button>
                  </>
                ) : (
                  <motion.button
                    type='button'
                    onClick={() => { navigate('/login'); closeMobile() }}
                    className='mt-4 rounded-xl bg-primary py-3 text-center text-base font-semibold text-white'
                    whileTap={{ scale: 0.98 }}
                  >
                    Sign in
                  </motion.button>
                )}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  )
}

export default Navbar
