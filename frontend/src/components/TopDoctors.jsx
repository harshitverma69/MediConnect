import React, { useContext } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import DoctorCard from './DoctorCard'
import { spring } from '../lib/motion'

const TopDoctors = () => {

    const navigate = useNavigate()

    const { doctors } = useContext(AppContext)

    return (
        <section className='py-12'>
            <motion.div
                className='mx-auto max-w-2xl text-center'
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={spring}
            >
                <h2 className='text-3xl font-bold text-ink sm:text-4xl'>Top doctors</h2>
                <p className='mt-3 text-sm text-muted sm:text-base'>
                    Highly rated clinicians available to book now.
                </p>
            </motion.div>
            <div className='mt-10 grid grid-cols-auto gap-5 sm:gap-6'>
                {doctors.slice(0, 10).map((item, index) => (
                    <DoctorCard
                        key={index}
                        doctor={item}
                        onClick={() => { navigate(`/appointment/${item._id}`); scrollTo(0, 0) }}
                    />
                ))}
            </div>
            <div className='mt-12 flex justify-center'>
                <motion.button
                    type='button'
                    onClick={() => { navigate('/doctors'); scrollTo(0, 0) }}
                    className='rounded-full border border-slate-200 bg-white px-10 py-3 text-sm font-semibold text-ink shadow-sm'
                    whileHover={{ scale: 1.05, borderColor: 'rgb(15 118 110)', color: 'rgb(15 118 110)' }}
                    whileTap={{ scale: 0.97 }}
                    transition={spring}
                >
                    View all doctors
                </motion.button>
            </div>
        </section>
    )
}

export default TopDoctors
