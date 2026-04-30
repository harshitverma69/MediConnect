import React, { useContext, useEffect } from 'react'
import { AdminContext } from '../../context/AdminContext'

const DoctorsList = () => {

  const { doctors, changeAvailability , aToken , getAllDoctors} = useContext(AdminContext)

  useEffect(() => {
    if (aToken) {
        getAllDoctors()
    }
}, [aToken])

  return (
    <div className='p-4 sm:p-8'>
      <div className='mb-6'>
        <h1 className='text-2xl font-bold text-ink'>Doctors</h1>
        <p className='mt-1 text-sm text-muted'>Toggle availability for booking.</p>
      </div>

      <div className='flex flex-wrap gap-5'>
        {doctors.map((item, index) => (
          <div
            className='group w-full max-w-[220px] overflow-hidden rounded-2xl bg-card shadow-card ring-1 ring-slate-200/80 transition hover:-translate-y-0.5 hover:shadow-lg sm:max-w-[240px]'
            key={index}
          >
            <div className='aspect-[4/5] overflow-hidden bg-gradient-to-b from-slate-50 to-primary-muted/30'>
              <img className='h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]' src={item.image} alt='' />
            </div>
            <div className='p-4'>
              <p className='text-lg font-semibold text-ink'>{item.name}</p>
              <p className='text-sm text-muted'>{item.speciality}</p>
              <label className='mt-4 flex cursor-pointer items-center gap-2 text-sm font-medium text-ink'>
                <input
                  onChange={() => changeAvailability(item._id)}
                  type='checkbox'
                  checked={item.available}
                  className='h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary'
                />
                Available for booking
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default DoctorsList
