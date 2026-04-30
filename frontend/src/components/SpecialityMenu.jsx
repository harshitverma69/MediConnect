import React from 'react'
import { motion } from 'framer-motion'
import { specialityData } from '../assets/assets'
import { Link } from 'react-router-dom'
import { spring } from '../lib/motion'

const SpecialityMenu = () => {
    return (
        <section id='speciality' className='py-16'>
            <motion.div
                className='mx-auto max-w-2xl text-center'
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={spring}
            >
                <h2 className='text-3xl font-bold text-ink sm:text-4xl'>Find by speciality</h2>
                <p className='mt-3 text-sm text-muted sm:text-base'>
                    Jump straight to the type of care you need.
                </p>
            </motion.div>
            <div className='mt-10 flex gap-4 overflow-x-auto pb-2 pt-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'>
                {specialityData.map((item, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ ...spring, delay: index * 0.05 }}
                    >
                        <Link
                            to={`/doctors/${item.speciality}`}
                            onClick={() => scrollTo(0, 0)}
                            className='flex min-w-[100px] flex-shrink-0 flex-col items-center gap-2 rounded-2xl bg-card p-4 shadow-card ring-1 ring-slate-200/80 sm:min-w-[112px]'
                        >
                            <motion.div
                                className='flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-muted/80 sm:h-20 sm:w-20'
                                whileHover={{ scale: 1.08, rotate: -3 }}
                                whileTap={{ scale: 0.95 }}
                                transition={spring}
                            >
                                <img className='h-10 w-10 object-contain sm:h-12 sm:w-12' src={item.image} alt='' />
                            </motion.div>
                            <p className='text-center text-xs font-semibold text-ink sm:text-sm'>{item.speciality}</p>
                        </Link>
                    </motion.div>
                ))}
            </div>
        </section>
    )
}

export default SpecialityMenu
