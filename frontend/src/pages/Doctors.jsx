import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { useNavigate, useParams } from 'react-router-dom'
import DoctorCard from '../components/DoctorCard'

const filters = [
  'General physician',
  'Gynecologist',
  'Dermatologist',
  'Pediatricians',
  'Neurologist',
  'Gastroenterologist',
]

const Doctors = () => {

  const { speciality } = useParams()

  const [filterDoc, setFilterDoc] = useState([])
  const [showFilter, setShowFilter] = useState(false)
  const navigate = useNavigate();

  const { doctors } = useContext(AppContext)

  useEffect(() => {
    if (speciality) {
      setFilterDoc(doctors.filter(doc => doc.speciality === speciality))
    } else {
      setFilterDoc(doctors)
    }
  }, [doctors, speciality])

  const goFilter = (label) => {
    if (speciality === label) {
      navigate('/doctors')
    } else {
      navigate(`/doctors/${label}`)
    }
    setShowFilter(false)
  }

  return (
    <div className='pb-12'>
      <div className='mb-8'>
        <h1 className='text-3xl font-bold text-ink'>Our doctors</h1>
        <p className='mt-2 text-muted'>Browse by speciality and book a slot that works for you.</p>
      </div>

      <div className='flex flex-col gap-8 lg:flex-row lg:items-start'>
        <button
          type='button'
          onClick={() => setShowFilter(!showFilter)}
          className={`flex w-full items-center justify-center rounded-xl py-3 text-sm font-semibold ring-1 transition lg:hidden ${showFilter ? 'bg-primary text-white ring-primary' : 'bg-card text-ink ring-slate-200'}`}
        >
          {showFilter ? 'Hide filters' : 'Show filters'}
        </button>

        <aside className={`lg:w-56 lg:shrink-0 ${showFilter ? 'block' : 'hidden lg:block'}`}>
          <p className='mb-3 text-xs font-bold uppercase tracking-wider text-muted'>Speciality</p>
          <div className='flex flex-col gap-2'>
            {filters.map((label) => (
              <button
                key={label}
                type='button'
                onClick={() => goFilter(label)}
                className={`rounded-xl px-4 py-3 text-left text-sm font-medium transition ${
                  speciality === label
                    ? 'bg-primary text-white shadow-md'
                    : 'bg-card text-ink shadow-card ring-1 ring-slate-200/80 hover:border-primary hover:text-primary'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </aside>

        <div className='grid flex-1 grid-cols-auto gap-5 sm:gap-6'>
          {filterDoc.map((item, index) => (
            <DoctorCard
              key={index}
              doctor={item}
              onClick={() => { navigate(`/appointment/${item._id}`); scrollTo(0, 0) }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Doctors
