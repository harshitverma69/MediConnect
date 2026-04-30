import React from 'react'
import { motion } from 'framer-motion'
import { assets } from '../assets/assets'
import { spring } from '../lib/motion'

const HERO_BG =
  'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1400&q=80'

const Header = () => {
  return (
    <div className='relative overflow-hidden rounded-3xl shadow-card ring-1 ring-primary-dark/20'>
      <div
        className='absolute inset-0 bg-cover bg-center opacity-40'
        style={{ backgroundImage: `url(${HERO_BG})` }}
      />
      <div className='absolute inset-0 bg-gradient-to-br from-primary/95 via-primary/90 to-primary-dark/95' />

      <div className='relative flex flex-col gap-8 px-6 py-12 md:flex-row md:items-center md:justify-between md:px-12 lg:px-16 lg:py-16'>
        <div className='max-w-xl space-y-5'>
          <motion.p
            className='text-3xl font-bold leading-tight text-white md:text-4xl lg:text-5xl lg:leading-tight'
            initial={{ opacity: 0, x: -28 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ ...spring, delay: 0.06 }}
          >
            Book appointments with trusted doctors
          </motion.p>
          <motion.div
            className='flex flex-col gap-3 text-sm leading-relaxed text-teal-50 sm:flex-row sm:items-center sm:gap-4'
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...spring, delay: 0.12 }}
          >
            <motion.img
              className='h-12 w-auto shrink-0 drop-shadow-lg'
              src={assets.group_profiles}
              alt=''
              whileHover={{ scale: 1.06, rotate: -2 }}
              transition={spring}
            />
            <p>Browse specialists, pick a slot, and manage visits in one place.</p>
          </motion.div>
          <motion.a
            href='#speciality'
            className='inline-flex w-fit items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-primary shadow-lg'
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...spring, delay: 0.18 }}
            whileHover={{ scale: 1.05, boxShadow: '0 14px 40px rgba(0,0,0,0.18)' }}
            whileTap={{ scale: 0.97 }}
          >
            Find by speciality
            <img className='h-3 w-3' src={assets.arrow_icon} alt='' />
          </motion.a>
        </div>

        <motion.div
          className='relative hidden shrink-0 md:block md:w-[min(100%,380px)]'
          initial={{ opacity: 0, scale: 0.9, rotate: -3 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ ...spring, delay: 0.1 }}
        >
          <motion.div
            className='relative overflow-hidden rounded-2xl border border-white/25 bg-white/10 shadow-2xl backdrop-blur-md'
            whileHover={{ y: -4, transition: spring }}
          >
            <img
              src={assets.header_img}
              alt='Healthcare'
              className='h-[280px] w-full object-cover object-top lg:h-[320px]'
            />
            <div className='absolute inset-0 bg-gradient-to-t from-primary-dark/80 via-transparent to-transparent' />
            <p className='absolute bottom-4 left-4 right-4 text-sm font-medium text-white drop-shadow'>
              Real doctors. Simple booking.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default Header
