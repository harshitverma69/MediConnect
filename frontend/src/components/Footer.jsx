import React from 'react'
import { motion } from 'framer-motion'
import { assets } from '../assets/assets'
import { Link } from 'react-router-dom'
import { spring } from '../lib/motion'

const Footer = () => {
  return (
    <motion.footer
      className='relative mt-auto overflow-hidden border-t border-slate-200/80 bg-slate-900 py-14 text-slate-200'
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div
        className='pointer-events-none absolute inset-0 opacity-20'
        style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1600&q=80)', backgroundSize: 'cover', backgroundPosition: 'center' }}
      />
      <div className='absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/95 to-slate-900/90' />
      <div className='relative mx-auto grid max-w-6xl gap-10 px-4 sm:grid-cols-[2fr_1fr_1fr] sm:px-6 lg:px-8'>
        <div>
          <motion.img
            className='mb-4 h-9 w-auto brightness-0 invert'
            src={assets.logo}
            alt='MediConnect'
            whileHover={{ scale: 1.05 }}
            transition={spring}
          />
          <p className='max-w-sm text-sm leading-relaxed text-slate-400'>
            Book trusted doctors online. MediConnect helps you find care, manage appointments, and stay on top of your health.
          </p>
        </div>

        <div>
          <p className='mb-4 text-sm font-bold uppercase tracking-wider text-white'>Explore</p>
          <ul className='flex flex-col gap-2 text-sm text-slate-400'>
            <li><Link to='/' className='transition hover:text-teal-300'>Home</Link></li>
            <li><Link to='/doctors' className='transition hover:text-teal-300'>Doctors</Link></li>
            <li><Link to='/ai-predictor' className='transition hover:text-teal-300'>AI predictor</Link></li>
            <li><Link to='/contact' className='transition hover:text-teal-300'>Contact</Link></li>
          </ul>
        </div>

        <div>
          <p className='mb-4 text-sm font-bold uppercase tracking-wider text-white'>Contact</p>
          <ul className='flex flex-col gap-2 text-sm text-slate-400'>
            <li>+91-8562930574</li>
            <li>
              <a href='mailto:harshit.2226cseml110@kiet.edu' className='hover:text-teal-300'>
                harshit.2226cseml110@kiet.edu
              </a>
            </li>
          </ul>
        </div>
      </div>
      <p className='relative mt-10 text-center text-xs text-slate-500'>MediConnect — learning project</p>
    </motion.footer>
  )
}

export default Footer
