import React, { useContext, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { AppContext } from '../context/AppContext'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'
import { spring, easeOut } from '../lib/motion'

const Login = () => {

  const [state, setState] = useState('Sign Up')

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const navigate = useNavigate()
  const { backendUrl, token, setToken } = useContext(AppContext)

  const onSubmitHandler = async (event) => {
    event.preventDefault()

    if (state === 'Sign Up') {
      const registerUrl = `${backendUrl}/api/user/register`
      try {
        const response = await fetch(registerUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password }),
        })
        const data = await response.json()

        if (response.ok && data.success) {
          localStorage.setItem('token', data.token)
          setToken(data.token)
          toast.success('Account created')
        } else {
          toast.error(data.message || `Request failed (${response.status})`)
        }
      } catch (error) {
        toast.error(error.message || 'Network error')
      }
    } else {
      const loginUrl = `${backendUrl}/api/user/login`
      try {
        const response = await fetch(loginUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        })
        const data = await response.json()

        if (response.ok && data.success) {
          localStorage.setItem('token', data.token)
          setToken(data.token)
          toast.success('Welcome back')
        } else {
          toast.error(data.message || `Request failed (${response.status})`)
        }
      } catch (error) {
        toast.error(error.message || 'Network error')
      }
    }
  }

  useEffect(() => {
    if (token) {
      navigate('/')
    }
  }, [token, navigate])

  const input =
    'mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-ink outline-none ring-primary/25 transition focus:border-primary focus:ring-2'

  return (
    <div className='relative flex min-h-[75vh] items-center justify-center overflow-hidden py-10'>
      <div
        className='pointer-events-none absolute inset-0 opacity-25'
        style={{ backgroundImage: `url(https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1600&q=80)`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      />
      <div className='absolute inset-0 bg-gradient-to-br from-white via-slate-50/95 to-primary-muted/30' />

      <motion.div
        className='relative z-10 grid w-full max-w-4xl overflow-hidden rounded-3xl bg-card/95 shadow-2xl ring-1 ring-slate-200/90 backdrop-blur-md md:grid-cols-[1fr_1.1fr]'
        initial={{ opacity: 0, y: 28, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, ease: easeOut }}
      >
        <div className='relative hidden min-h-[420px] md:block'>
          <img src={assets.profile_pic} alt='' className='absolute inset-0 h-full w-full object-cover' />
          <div className='absolute inset-0 bg-gradient-to-t from-primary-dark/90 via-primary/40 to-transparent' />
          <div className='absolute bottom-8 left-8 right-8 text-white'>
            <p className='text-sm font-semibold uppercase tracking-widest text-teal-100'>MediConnect</p>
            <p className='mt-2 text-2xl font-bold leading-tight'>Your health, one login away.</p>
          </div>
        </div>

        <form onSubmit={onSubmitHandler} className='flex flex-col justify-center space-y-4 p-8 sm:p-10'>
          <div>
            <h1 className='text-2xl font-bold text-ink'>{state === 'Sign Up' ? 'Create account' : 'Welcome back'}</h1>
            <p className='mt-1 text-sm text-muted'>
              {state === 'Sign Up' ? 'Sign up to book and manage appointments.' : 'Log in to continue.'}
            </p>
          </div>

          <div className='flex rounded-full bg-surface p-1 ring-1 ring-slate-200/80'>
            <motion.button
              type='button'
              onClick={() => setState('Sign Up')}
              className={`flex-1 rounded-full py-2 text-sm font-semibold transition ${state === 'Sign Up' ? 'bg-white text-primary shadow-sm' : 'text-muted'}`}
              whileTap={{ scale: 0.98 }}
            >
              Sign up
            </motion.button>
            <motion.button
              type='button'
              onClick={() => setState('Login')}
              className={`flex-1 rounded-full py-2 text-sm font-semibold transition ${state === 'Login' ? 'bg-white text-primary shadow-sm' : 'text-muted'}`}
              whileTap={{ scale: 0.98 }}
            >
              Log in
            </motion.button>
          </div>

          {state === 'Sign Up' && (
            <label className='block text-sm font-medium text-ink'>
              Full name
              <input onChange={(e) => setName(e.target.value)} value={name} className={input} type='text' required autoComplete='name' />
            </label>
          )}

          <label className='block text-sm font-medium text-ink'>
            Email
            <input onChange={(e) => setEmail(e.target.value)} value={email} className={input} type='email' required autoComplete='email' />
          </label>

          <label className='block text-sm font-medium text-ink'>
            Password
            <input onChange={(e) => setPassword(e.target.value)} value={password} className={input} type='password' required minLength={8} autoComplete={state === 'Sign Up' ? 'new-password' : 'current-password'} />
          </label>

          <motion.button
            type='submit'
            className='w-full rounded-xl bg-primary py-3 text-base font-semibold text-white shadow-lg'
            whileHover={{ scale: 1.02, boxShadow: '0 12px 32px rgba(15,118,110,0.35)' }}
            whileTap={{ scale: 0.98 }}
            transition={spring}
          >
            {state === 'Sign Up' ? 'Create account' : 'Log in'}
          </motion.button>

          <p className='text-center text-sm text-muted'>
            {state === 'Sign Up' ? (
              <>
                Already have an account?{' '}
                <button type='button' onClick={() => setState('Login')} className='font-semibold text-primary hover:underline'>
                  Log in
                </button>
              </>
            ) : (
              <>
                New here?{' '}
                <button type='button' onClick={() => setState('Sign Up')} className='font-semibold text-primary hover:underline'>
                  Create account
                </button>
              </>
            )}
          </p>
        </form>
      </motion.div>
    </div>
  )
}

export default Login
