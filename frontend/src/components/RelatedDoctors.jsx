import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import DoctorCard from './DoctorCard'

const RelatedDoctors = ({ speciality, docId }) => {

    const navigate = useNavigate()
    const { doctors } = useContext(AppContext)

    const [relDoc, setRelDoc] = useState([])

    useEffect(() => {
        if (doctors.length > 0 && speciality) {
            const doctorsData = doctors.filter((doc) => doc.speciality === speciality && doc._id !== docId)
            setRelDoc(doctorsData)
        }
    }, [doctors, speciality, docId])

    if (relDoc.length === 0) return null

    return (
        <section className='py-16'>
            <div className='mx-auto max-w-2xl text-center'>
                <h2 className='text-3xl font-bold text-ink'>Related doctors</h2>
                <p className='mt-3 text-sm text-muted'>More {speciality} specialists you may like.</p>
            </div>
            <div className='mt-10 grid grid-cols-auto gap-5 sm:gap-6'>
                {relDoc.map((item, index) => (
                    <DoctorCard
                        key={index}
                        doctor={item}
                        onClick={() => { navigate(`/appointment/${item._id}`); scrollTo(0, 0) }}
                    />
                ))}
            </div>
        </section>
    )
}

export default RelatedDoctors
