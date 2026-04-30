import React, { useContext, useEffect } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { AppContext } from '../../context/AppContext'
import { assets } from '../../assets/assets'

const DoctorAppointments = () => {

  const { dToken, appointments, getAppointments, cancelAppointment, completeAppointment } = useContext(DoctorContext)
  const { slotDateFormat, calculateAge, currency } = useContext(AppContext)

  useEffect(() => {
    if (dToken) {
      getAppointments()
    }
  }, [dToken])

  return (
    <div className='w-full max-w-6xl p-4 sm:p-8'>
      <div className='mb-6'>
        <h1 className='text-2xl font-bold text-ink'>Appointments</h1>
        <p className='mt-1 text-sm text-muted'>Patients scheduled with you.</p>
      </div>

      <div className='overflow-hidden rounded-2xl bg-card shadow-card ring-1 ring-slate-200/80'>
        <div className='hidden grid-cols-[0.5fr_2fr_0.9fr_0.7fr_1.5fr_0.7fr_1.1fr] gap-2 border-b border-slate-100 bg-surface/50 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-muted lg:grid'>
          <span>#</span>
          <span>Patient</span>
          <span>Payment</span>
          <span>Age</span>
          <span>Schedule</span>
          <span>Fees</span>
          <span className='text-right'>Action</span>
        </div>
        <div className='max-h-[75vh] overflow-y-auto'>
          {appointments.map((item, index) => (
            <div
              className='grid grid-cols-1 gap-3 border-b border-slate-100 px-5 py-4 text-sm transition last:border-0 hover:bg-surface/50 lg:grid-cols-[0.5fr_2fr_0.9fr_0.7fr_1.5fr_0.7fr_1.1fr] lg:items-center lg:gap-2'
              key={index}
            >
              <p className='hidden text-muted lg:block'>{index + 1}</p>
              <div className='flex items-center gap-3'>
                <img src={item.userData.image} className='h-10 w-10 rounded-full object-cover ring-2 ring-white shadow-sm' alt='' />
                <span className='font-semibold text-ink'>{item.userData.name}</span>
              </div>
              <div>
                <span
                  className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                    item.payment ? 'bg-primary-muted text-primary-dark' : 'bg-slate-100 text-muted'
                  }`}
                >
                  {item.payment ? 'Paid' : 'Cash'}
                </span>
              </div>
              <p className='text-muted lg:text-ink'>{calculateAge(item.userData.dob)} yrs</p>
              <p className='text-ink'>
                {slotDateFormat(item.slotDate)}
                <span className='text-muted'> · </span>
                {item.slotTime}
              </p>
              <p className='font-semibold text-primary'>{currency}{item.amount}</p>
              <div className='flex justify-start gap-1 lg:justify-end'>
                {item.cancelled ? (
                  <span className='rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-600'>Cancelled</span>
                ) : item.isCompleted ? (
                  <span className='rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700'>Completed</span>
                ) : (
                  <>
                    <button
                      type='button'
                      onClick={() => cancelAppointment(item._id)}
                      className='rounded-xl p-2 text-red-600 transition hover:bg-red-50'
                      title='Cancel'
                    >
                      <img className='h-9 w-9' src={assets.cancel_icon} alt='' />
                    </button>
                    <button
                      type='button'
                      onClick={() => completeAppointment(item._id)}
                      className='rounded-xl p-2 text-emerald-600 transition hover:bg-emerald-50'
                      title='Complete'
                    >
                      <img className='h-9 w-9' src={assets.tick_icon} alt='' />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default DoctorAppointments
