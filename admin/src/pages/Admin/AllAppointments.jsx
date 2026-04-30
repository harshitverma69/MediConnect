import React, { useEffect } from 'react'
import { assets } from '../../assets/assets'
import { useContext } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { AppContext } from '../../context/AppContext'

const AllAppointments = () => {

  const { aToken, appointments, cancelAppointment, getAllAppointments } = useContext(AdminContext)
  const { slotDateFormat, calculateAge, currency } = useContext(AppContext)

  useEffect(() => {
    if (aToken) {
      getAllAppointments()
    }
  }, [aToken])

  return (
    <div className='w-full max-w-6xl p-4 sm:p-8'>
      <div className='mb-6'>
        <h1 className='text-2xl font-bold text-ink'>All appointments</h1>
        <p className='mt-1 text-sm text-muted'>Every booking across the network.</p>
      </div>

      <div className='overflow-hidden rounded-2xl bg-card shadow-card ring-1 ring-slate-200/80'>
        <div className='hidden grid-cols-[0.5fr_2.2fr_0.7fr_1.4fr_1.8fr_0.8fr_1fr] gap-2 border-b border-slate-100 bg-surface/50 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-muted sm:grid'>
          <span>#</span>
          <span>Patient</span>
          <span>Age</span>
          <span>Schedule</span>
          <span>Doctor</span>
          <span>Fees</span>
          <span className='text-right'>Action</span>
        </div>
        <div className='max-h-[75vh] overflow-y-auto'>
          {appointments.map((item, index) => (
            <div
              className='grid grid-cols-1 gap-3 border-b border-slate-100 px-5 py-4 text-sm transition last:border-0 hover:bg-surface/50 sm:grid-cols-[0.5fr_2.2fr_0.7fr_1.4fr_1.8fr_0.8fr_1fr] sm:items-center sm:gap-2'
              key={index}
            >
              <p className='hidden font-medium text-muted sm:block'>{index + 1}</p>
              <div className='flex items-center gap-3'>
                <img src={item.userData.image} className='h-10 w-10 rounded-full object-cover ring-2 ring-white shadow-sm' alt='' />
                <span className='font-semibold text-ink'>{item.userData.name}</span>
              </div>
              <p className='text-muted sm:text-ink'>{calculateAge(item.userData.dob)} yrs</p>
              <p className='text-ink'>
                {slotDateFormat(item.slotDate)}
                <span className='text-muted'> · </span>
                {item.slotTime}
              </p>
              <div className='flex items-center gap-2 min-w-0'>
                <img src={item.docData.image} className='h-9 w-9 shrink-0 rounded-full object-cover bg-slate-100' alt='' />
                <span className='truncate font-medium text-ink'>{item.docData.name}</span>
              </div>
              <p className='font-semibold text-primary'>{currency}{item.amount}</p>
              <div className='flex justify-start sm:justify-end'>
                {item.cancelled ? (
                  <span className='rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-600'>Cancelled</span>
                ) : item.isCompleted ? (
                  <span className='rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700'>Completed</span>
                ) : (
                  <button
                    type='button'
                    onClick={() => cancelAppointment(item._id)}
                    className='rounded-xl p-2 text-red-600 transition hover:bg-red-50'
                    title='Cancel'
                  >
                    <img className='h-9 w-9' src={assets.cancel_icon} alt='' />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default AllAppointments
