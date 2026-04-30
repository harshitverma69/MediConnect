import React from 'react'
import { motion } from 'framer-motion'
import { spring } from '../lib/motion'

const DoctorCard = ({ doctor, onClick }) => (
  <motion.button
    type='button'
    onClick={onClick}
    className='group w-full overflow-hidden rounded-2xl bg-card text-left shadow-card ring-1 ring-slate-200/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary'
    initial={{ opacity: 0, y: 18 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-40px' }}
    transition={spring}
    whileHover={{ y: -6, boxShadow: '0 20px 40px rgba(15, 23, 42, 0.12)' }}
    whileTap={{ scale: 0.98 }}
  >
    <div className='aspect-[4/5] overflow-hidden bg-gradient-to-b from-slate-50 to-primary-muted/25'>
      <motion.img
        className='h-full w-full object-cover'
        src={doctor.image}
        alt={doctor.name}
        whileHover={{ scale: 1.06 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      />
    </div>
    <div className='p-4'>
      <div className='mb-2 flex items-center gap-2 text-xs font-semibold'>
        <span className={`h-2 w-2 rounded-full ${doctor.available ? 'bg-emerald-500' : 'bg-slate-300'}`} />
        <span className={doctor.available ? 'text-emerald-700' : 'text-muted'}>
          {doctor.available ? 'Available' : 'Unavailable'}
        </span>
      </div>
      <p className='text-lg font-bold text-ink'>{doctor.name}</p>
      <p className='text-sm text-muted'>{doctor.speciality}</p>
    </div>
  </motion.button>
)

export default DoctorCard
