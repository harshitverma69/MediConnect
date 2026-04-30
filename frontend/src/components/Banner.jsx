import React from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'
import { spring } from '../lib/motion'

const Banner = () => {

    const navigate = useNavigate()

    return (
        <section className='relative my-16 overflow-hidden rounded-3xl shadow-card ring-1 ring-primary-dark/20'>
            <div
                className='absolute inset-0 bg-cover bg-right opacity-30'
                style={{ backgroundImage: `url(https://images.unsplash.com/photo-1666214280557-f1f502d2d6d1?auto=format&fit=crop&w=1200&q=80)` }}
            />
            <div className='absolute inset-0 bg-gradient-to-r from-primary-dark/95 via-primary/92 to-primary-light/88' />
            <div className='relative flex flex-col items-start gap-8 px-8 py-12 sm:px-12 lg:flex-row lg:items-center lg:justify-between lg:py-16'>
                <motion.div
                    className='max-w-xl'
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={spring}
                >
                    <h2 className='text-2xl font-bold text-white sm:text-3xl lg:text-4xl'>
                        Join thousands booking care online
                    </h2>
                    <p className='mt-3 max-w-md text-sm leading-relaxed text-teal-50 sm:text-base'>
                        Create a free account to save your profile, book faster, and pay securely when your doctor enables online payment.
                    </p>
                    <motion.button
                        type='button'
                        onClick={() => { navigate('/login'); scrollTo(0, 0) }}
                        className='mt-6 rounded-full bg-white px-8 py-3 text-sm font-semibold text-primary shadow-lg'
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.97 }}
                        transition={spring}
                    >
                        Create account
                    </motion.button>
                </motion.div>
                <motion.div
                    className='relative hidden w-full max-w-xs shrink-0 overflow-hidden rounded-2xl border border-white/25 shadow-2xl lg:block'
                    initial={{ opacity: 0, scale: 0.92 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ ...spring, delay: 0.08 }}
                    whileHover={{ y: -6 }}
                >
                    <img src={assets.appointment_img} alt='Book care' className='h-56 w-full object-cover' />
                    <div className='absolute inset-0 bg-gradient-to-t from-primary-dark/70 to-transparent' />
                </motion.div>
            </div>
        </section>
    )
}

export default Banner
