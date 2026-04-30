import axios from 'axios'
import React, { useContext, useState } from 'react'
import { motion } from 'framer-motion'
import { DoctorContext } from '../context/DoctorContext'
import { AdminContext } from '../context/AdminContext'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { easeOut, spring } from '../lib/motion'

const PANEL_IMG =
  'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1200&q=80'

const Login = () => {

  const [state, setState] = useState('Admin')

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000"
  const navigate = useNavigate()

  const { setDToken } = useContext(DoctorContext)
  const { setAToken } = useContext(AdminContext)

  const onSubmitHandler = async (event) => {
    event.preventDefault()
    if (state === 'Admin') {

      const { data } = await axios.post(backendUrl + '/api/admin/login', { email, password })
      if (data.success) {
        setAToken(data.token)
        localStorage.setItem('aToken', data.token)
        navigate('/admin-dashboard', { replace: true })
      } else {
        toast.error(data.message)
      }

    } else {

      const { data } = await axios.post(backendUrl + '/api/doctor/login', { email, password })
      if (data.success) {
        setDToken(data.token)
        localStorage.setItem('dToken', data.token)
        navigate('/doctor-dashboard', { replace: true })
      } else {
        toast.error(data.message)
      }

    }

  }

  return (
    <div className='admin-app-bg relative flex min-h-screen items-center justify-center overflow-hidden p-4'>
      <motion.div
        className='pointer-events-none absolute -left-20 top-1/4 h-72 w-72 rounded-full bg-primary/20 blur-3xl'
        animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.6, 0.4] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className='pointer-events-none absolute -right-16 bottom-1/4 h-80 w-80 rounded-full bg-teal-300/25 blur-3xl'
        animate={{ scale: [1.1, 1, 1.1], opacity: [0.35, 0.55, 0.35] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        className='relative z-10 grid w-full max-w-[440px] overflow-hidden rounded-3xl bg-card shadow-2xl ring-1 ring-slate-200/80 md:max-w-4xl md:grid-cols-[1.1fr_1fr]'
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, ease: easeOut }}
      >
        <div className='relative hidden min-h-[440px] md:block'>
          <div
            className='absolute inset-0 bg-cover bg-center'
            style={{ backgroundImage: `url(${PANEL_IMG})` }}
          />
          <div className='absolute inset-0 bg-gradient-to-br from-primary-dark/95 via-primary/80 to-teal-900/90' />
          <div className='relative flex h-full flex-col justify-between p-10 text-white'>
            <div>
              <p className='text-sm font-semibold uppercase tracking-widest text-teal-100'>MediConnect</p>
              <h1 className='mt-4 text-3xl font-bold leading-tight'>Care operations, simplified.</h1>
              <p className='mt-3 text-sm leading-relaxed text-teal-50'>
                Manage doctors, appointments, and your practice from one focused workspace.
              </p>
            </div>
            <p className='text-xs text-teal-200'>Authorized staff access only.</p>
          </div>
        </div>

        <form onSubmit={onSubmitHandler} className='flex flex-col justify-center gap-5 p-8 sm:p-10'>
          <div>
            <h2 className='text-2xl font-bold text-ink'>
              {state === 'Admin' ? 'Admin' : 'Doctor'} sign in
            </h2>
            <p className='mt-1 text-sm text-muted'>Use the credentials issued for your role.</p>
          </div>

          <div className='inline-flex rounded-full bg-surface p-1 ring-1 ring-slate-200/80'>
            <motion.button
              type='button'
              onClick={() => setState('Admin')}
              className={`flex-1 rounded-full px-4 py-2 text-sm font-semibold transition ${state === 'Admin' ? 'bg-white text-primary shadow-sm' : 'text-muted'}`}
              whileTap={{ scale: 0.97 }}
            >
              Admin
            </motion.button>
            <motion.button
              type='button'
              onClick={() => setState('Doctor')}
              className={`flex-1 rounded-full px-4 py-2 text-sm font-semibold transition ${state === 'Doctor' ? 'bg-white text-primary shadow-sm' : 'text-muted'}`}
              whileTap={{ scale: 0.97 }}
            >
              Doctor
            </motion.button>
          </div>

          <label className='block text-sm font-medium text-ink'>
            Email
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              className='mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-ink outline-none ring-primary/30 transition focus:border-primary focus:ring-2'
              type='email'
              required
              autoComplete='email'
            />
          </label>

          <label className='block text-sm font-medium text-ink'>
            Password
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              className='mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-ink outline-none ring-primary/30 transition focus:border-primary focus:ring-2'
              type='password'
              required
              autoComplete='current-password'
            />
          </label>

          <motion.button
            type='submit'
            className='mt-2 w-full rounded-xl bg-primary py-3 text-base font-semibold text-white shadow-lg'
            whileHover={{ scale: 1.02, boxShadow: '0 12px 32px rgba(15,118,110,0.35)' }}
            whileTap={{ scale: 0.98 }}
            transition={spring}
          >
            Continue
          </motion.button>
        </form>
      </motion.div>
    </div>
  )
}

export default Login
