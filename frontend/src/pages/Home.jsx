import React from 'react'
import { motion } from 'framer-motion'
import Header from '../components/Header'
import SpecialityMenu from '../components/SpecialityMenu'
import TopDoctors from '../components/TopDoctors'
import Banner from '../components/Banner'
import { spring } from '../lib/motion'

const Home = () => {
  return (
    <motion.div
      className='space-y-6'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={spring}
    >
      <Header />
      <SpecialityMenu />
      <TopDoctors />
      <Banner />
    </motion.div>
  )
}

export default Home
