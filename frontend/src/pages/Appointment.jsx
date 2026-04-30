import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { assets } from '../assets/assets'
import RelatedDoctors from '../components/RelatedDoctors'
import axios from 'axios'
import { toast } from 'react-toastify'

const Appointment = () => {

    const { docId } = useParams()
    const { doctors, currencySymbol, backendUrl, token, getDoctosData } = useContext(AppContext)
    const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

    const [docInfo, setDocInfo] = useState(false)
    const [docSlots, setDocSlots] = useState([])
    const [slotIndex, setSlotIndex] = useState(0)
    const [slotTime, setSlotTime] = useState('')

    const navigate = useNavigate()

    const fetchDocInfo = async () => {
        const docInfo = doctors.find((doc) => doc._id === docId)
        setDocInfo(docInfo)
    }

    const getAvailableSolts = async () => {

        setDocSlots([])

        let today = new Date()

        for (let i = 0; i < 7; i++) {

            let currentDate = new Date(today)
            currentDate.setDate(today.getDate() + i)

            let endTime = new Date()
            endTime.setDate(today.getDate() + i)
            endTime.setHours(21, 0, 0, 0)

            if (today.getDate() === currentDate.getDate()) {
                currentDate.setHours(currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10)
                currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0)
            } else {
                currentDate.setHours(10)
                currentDate.setMinutes(0)
            }

            let timeSlots = [];


            while (currentDate < endTime) {
                let formattedTime = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                let day = currentDate.getDate()
                let month = currentDate.getMonth() + 1
                let year = currentDate.getFullYear()

                const slotDate = day + "_" + month + "_" + year
                const slotTime = formattedTime

                const booked = docInfo.slots_booked?.[slotDate] || []
                const isSlotAvailable = !booked.includes(slotTime)

                if (isSlotAvailable) {

                    timeSlots.push({
                        datetime: new Date(currentDate),
                        time: formattedTime
                    })
                }

                currentDate.setMinutes(currentDate.getMinutes() + 30);
            }

            setDocSlots(prev => ([...prev, timeSlots]))

        }

    }

    const bookAppointment = async () => {

        if (!token) {
            toast.warning('Log in to book an appointment')
            return navigate('/login')
        }

        if (!docSlots[slotIndex]?.length || !slotTime) {
            toast.warning('Please select a date and time slot')
            return
        }

        const date = docSlots[slotIndex][0].datetime

        let day = date.getDate()
        let month = date.getMonth() + 1
        let year = date.getFullYear()

        const slotDate = day + "_" + month + "_" + year

        try {

            const { data } = await axios.post(backendUrl + '/api/user/book-appointment', { docId, slotDate, slotTime }, { headers: { token } })
            if (data.success) {
                toast.success(data.message)
                getDoctosData()
                navigate('/my-appointments')
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }

    }

    useEffect(() => {
        if (doctors.length > 0) {
            fetchDocInfo()
        }
    }, [doctors, docId])

    useEffect(() => {
        if (docInfo) {
            getAvailableSolts()
        }
    }, [docInfo])

    return docInfo ? (
        <div className='pb-16'>
            <div className='grid gap-8 lg:grid-cols-[min(320px,100%)_1fr] lg:items-start'>
                <div className='overflow-hidden rounded-2xl bg-card shadow-card ring-1 ring-slate-200/80'>
                    <img className='aspect-[3/4] w-full object-cover lg:aspect-auto lg:max-h-[480px]' src={docInfo.image} alt={docInfo.name} />
                </div>

                <div className='rounded-2xl bg-card p-6 shadow-card ring-1 ring-slate-200/80 sm:p-8'>
                    <div className='flex flex-wrap items-center gap-2'>
                        <h1 className='text-3xl font-bold text-ink'>{docInfo.name}</h1>
                        <img className='h-5 w-5' src={assets.verified_icon} alt='Verified' />
                    </div>
                    <div className='mt-2 flex flex-wrap items-center gap-2 text-muted'>
                        <span className='font-medium text-ink'>{docInfo.degree}</span>
                        <span className='text-slate-300'>·</span>
                        <span>{docInfo.speciality}</span>
                        <span className='rounded-full bg-primary-muted px-3 py-0.5 text-xs font-semibold text-primary-dark'>
                            {docInfo.experience}
                        </span>
                    </div>

                    <div className='mt-6 border-t border-slate-100 pt-6'>
                        <p className='flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-ink'>
                            About
                            <img className='h-3.5 w-3.5 opacity-60' src={assets.info_icon} alt='' />
                        </p>
                        <p className='mt-2 max-w-2xl text-sm leading-relaxed text-muted'>{docInfo.about}</p>
                    </div>

                    <p className='mt-6 text-lg'>
                        <span className='text-muted'>Fee </span>
                        <span className='font-bold text-primary'>{currencySymbol}{docInfo.fees}</span>
                    </p>
                </div>
            </div>

            <section className='mt-12 rounded-2xl bg-card p-6 shadow-card ring-1 ring-slate-200/80 sm:p-8'>
                <h2 className='text-lg font-bold text-ink'>Book a slot</h2>
                <p className='mt-1 text-sm text-muted'>Pick a day, then choose an available time.</p>

                <div className='mt-6 flex gap-2 overflow-x-auto pb-2'>
                    {docSlots.length > 0 && docSlots.map((item, index) => (
                        <button
                            type='button'
                            onClick={() => { setSlotIndex(index); setSlotTime('') }}
                            key={index}
                            className={`min-w-[4.5rem] shrink-0 rounded-2xl px-3 py-4 text-center text-sm font-semibold transition ${
                                slotIndex === index
                                    ? 'bg-primary text-white shadow-md'
                                    : 'bg-surface text-ink ring-1 ring-slate-200 hover:ring-primary/40'
                            }`}
                        >
                            <p className='text-xs opacity-80'>{item[0] && daysOfWeek[item[0].datetime.getDay()]}</p>
                            <p className='text-lg'>{item[0] && item[0].datetime.getDate()}</p>
                        </button>
                    ))}
                </div>

                <div className='mt-6 flex flex-wrap gap-2'>
                    {docSlots.length > 0 && docSlots[slotIndex]?.map((item, index) => (
                        <button
                            type='button'
                            onClick={() => setSlotTime(item.time)}
                            key={index}
                            className={`rounded-full px-5 py-2 text-sm font-medium transition ${
                                item.time === slotTime
                                    ? 'bg-primary text-white shadow-md'
                                    : 'bg-white text-muted ring-1 ring-slate-200 hover:text-ink'
                            }`}
                        >
                            {item.time.toLowerCase()}
                        </button>
                    ))}
                </div>

                <button
                    type='button'
                    onClick={bookAppointment}
                    className='mt-8 rounded-xl bg-primary px-10 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-dark'
                >
                    Confirm booking
                </button>
            </section>

            <RelatedDoctors speciality={docInfo.speciality} docId={docId} />
        </div>
    ) : null
}

export default Appointment
