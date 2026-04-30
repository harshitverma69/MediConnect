import React, { useContext, useEffect } from 'react'
import { motion } from 'framer-motion'
import { assets } from '../../assets/assets'
import { AdminContext } from '../../context/AdminContext'
import { AppContext } from '../../context/AppContext'
import { spring } from '../../lib/motion'

const StatCard = ({ icon, label, value, accent, index }) => (
  <motion.div
    className='group flex min-w-[160px] flex-1 items-center gap-4 rounded-2xl bg-card p-5 shadow-card ring-1 ring-slate-200/80'
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ ...spring, delay: 0.08 * index }}
    whileHover={{ y: -4, boxShadow: '0 16px 40px rgba(15, 23, 42, 0.1)' }}
  >
    <motion.div
      className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${accent}`}
      whileHover={{ rotate: [0, -6, 6, 0] }}
      transition={{ duration: 0.5 }}
    >
      <img className='h-8 w-8' src={icon} alt='' />
    </motion.div>
    <div>
      <p className='text-2xl font-bold tracking-tight text-ink'>{value}</p>
      <p className='text-sm font-medium text-muted'>{label}</p>
    </div>
  </motion.div>
)

const Dashboard = () => {

  const { aToken, getDashData, cancelAppointment, dashData } = useContext(AdminContext)
  const { slotDateFormat } = useContext(AppContext)

  useEffect(() => {
    if (aToken) {
      getDashData()
    }
  }, [aToken])

  return dashData && (
    <div className='p-4 sm:p-8'>
      <motion.div
        className='mb-8'
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={spring}
      >
        <h1 className='text-2xl font-bold text-ink sm:text-3xl'>Dashboard</h1>
        <p className='mt-1 text-sm text-muted'>Overview of your platform at a glance.</p>
      </motion.div>

      <div className='mb-10 flex flex-wrap gap-4'>
        <StatCard index={0} icon={assets.doctor_icon} label='Doctors' value={dashData.doctors} accent='bg-sky-50' />
        <StatCard index={1} icon={assets.appointments_icon} label='Appointments' value={dashData.appointments} accent='bg-primary-muted' />
        <StatCard index={2} icon={assets.patients_icon} label='Patients' value={dashData.patients} accent='bg-violet-50' />
      </div>

      <motion.section
        className='overflow-hidden rounded-2xl bg-card shadow-card ring-1 ring-slate-200/80'
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...spring, delay: 0.15 }}
      >
        <div className='flex items-center gap-2 border-b border-slate-100 px-5 py-4'>
          <img src={assets.list_icon} alt='' className='h-5 w-5 opacity-70' />
          <h2 className='font-semibold text-ink'>Latest bookings</h2>
        </div>

        <div className='divide-y divide-slate-100'>
          {dashData.latestAppointments.slice(0, 5).map((item, index) => (
            <motion.div
              className='flex items-center gap-4 px-5 py-4 transition hover:bg-surface/80'
              key={index}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ ...spring, delay: 0.2 + index * 0.05 }}
            >
              <img className='h-11 w-11 rounded-full object-cover ring-2 ring-white shadow-sm' src={item.docData.image} alt='' />
              <div className='min-w-0 flex-1 text-sm'>
                <p className='font-semibold text-ink'>{item.docData.name}</p>
                <p className='text-muted'>Booked for {slotDateFormat(item.slotDate)}</p>
              </div>
              {item.cancelled ? (
                <span className='shrink-0 rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-600'>Cancelled</span>
              ) : item.isCompleted ? (
                <span className='shrink-0 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700'>Completed</span>
              ) : (
                <motion.button
                  type='button'
                  onClick={() => cancelAppointment(item._id)}
                  className='shrink-0 rounded-xl p-2 text-red-600 transition hover:bg-red-50'
                  title='Cancel appointment'
                  whileTap={{ scale: 0.92 }}
                >
                  <img className='h-9 w-9' src={assets.cancel_icon} alt='Cancel' />
                </motion.button>
              )}
            </motion.div>
          ))}
        </div>
      </motion.section>
    </div>
  )
}

export default Dashboard
