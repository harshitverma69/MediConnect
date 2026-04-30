import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { assets } from '../assets/assets'

const MyAppointments = () => {

    const { backendUrl, token } = useContext(AppContext)

    const [appointments, setAppointments] = useState([])
    const [payment, setPayment] = useState('')

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const slotDateFormat = (slotDate) => {
        const dateArray = slotDate.split('_')
        return dateArray[0] + " " + months[Number(dateArray[1])] + " " + dateArray[2]
    }

    const getUserAppointments = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/user/appointments', { headers: { token } })
            setAppointments(data.appointments.reverse())
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    const cancelAppointment = async (appointmentId) => {
        try {
            const { data } = await axios.post(backendUrl + '/api/user/cancel-appointment', { appointmentId }, { headers: { token } })
            if (data.success) {
                toast.success(data.message)
                getUserAppointments()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    const initPay = (order) => {
        const key = import.meta.env.VITE_RAZORPAY_KEY_ID
        if (!key) {
            toast.error('Razorpay is not configured. Set VITE_RAZORPAY_KEY_ID in frontend .env.')
            return
        }
        const options = {
            key,
            amount: order.amount,
            currency: order.currency,
            name: 'MediConnect',
            description: 'Appointment payment',
            order_id: order.id,
            handler: async (response) => {
                try {
                    const { data } = await axios.post(backendUrl + '/api/user/verifyRazorpay', response, { headers: { token } })
                    if (data.success) {
                        toast.success(data.message)
                        getUserAppointments()
                    } else {
                        toast.error(data.message)
                    }
                } catch (error) {
                    console.log(error)
                    toast.error(error.response?.data?.message || error.message)
                }
            },
            modal: {
                ondismiss: () => setPayment('')
            }
        }
        const rzp = new window.Razorpay(options)
        rzp.on('payment.failed', (response) => {
            const msg = response.error?.description || 'Payment failed'
            toast.error(msg)
        })
        rzp.open()
    };

    const appointmentRazorpay = async (appointmentId) => {
        try {
            const { data } = await axios.post(backendUrl + '/api/user/payment-razorpay', { appointmentId }, { headers: { token } })
            if (data.success) {
                initPay(data.order)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    const appointmentStripe = async (appointmentId) => {
        try {
            const { data } = await axios.post(backendUrl + '/api/user/payment-stripe', { appointmentId }, { headers: { token } })
            if (data.success) {
                const { session_url } = data
                window.location.replace(session_url)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    useEffect(() => {
        if (token) {
            getUserAppointments()
        }
    }, [token])

    const btnBase = 'rounded-xl px-4 py-2.5 text-sm font-semibold transition ring-1'

    return (
        <div className='pb-16'>
            <div className='mb-8'>
                <h1 className='text-3xl font-bold text-ink'>My appointments</h1>
                <p className='mt-2 text-muted'>Pay, reschedule context, or cancel from here.</p>
            </div>

            <div className='space-y-6'>
                {appointments.map((item, index) => (
                    <article
                        key={index}
                        className='grid gap-6 rounded-2xl bg-card p-6 shadow-card ring-1 ring-slate-200/80 sm:grid-cols-[140px_1fr_auto] sm:items-start sm:gap-8'
                    >
                        <div className='overflow-hidden rounded-xl bg-surface'>
                            <img className='aspect-square w-full max-w-[140px] object-cover sm:max-w-none' src={item.docData.image} alt='' />
                        </div>

                        <div className='min-w-0 text-sm'>
                            <h2 className='text-xl font-bold text-ink'>{item.docData.name}</h2>
                            <p className='mt-1 font-medium text-primary'>{item.docData.speciality}</p>
                            <p className='mt-4 text-xs font-bold uppercase tracking-wide text-muted'>Clinic</p>
                            <p className='text-muted'>{item.docData.address.line1}</p>
                            <p className='text-muted'>{item.docData.address.line2}</p>
                            <p className='mt-4'>
                                <span className='text-xs font-bold uppercase tracking-wide text-muted'>When </span>
                                <span className='font-medium text-ink'>{slotDateFormat(item.slotDate)}</span>
                                <span className='text-muted'> · </span>
                                <span className='font-medium text-ink'>{item.slotTime}</span>
                            </p>
                        </div>

                        <div className='flex flex-col gap-2 sm:min-w-[200px]'>
                            {!item.cancelled && !item.payment && !item.isCompleted && payment !== item._id && (
                                <button type='button' onClick={() => setPayment(item._id)} className={`${btnBase} border-transparent bg-slate-100 text-ink ring-slate-200 hover:bg-primary hover:text-white hover:ring-primary`}>
                                    Pay online
                                </button>
                            )}
                            {!item.cancelled && !item.payment && !item.isCompleted && payment === item._id && import.meta.env.VITE_RAZORPAY_KEY_ID && (
                                <button type='button' onClick={() => appointmentRazorpay(item._id)} className={`${btnBase} flex items-center justify-center bg-white ring-slate-200 hover:bg-surface`}>
                                    <img className='h-6 w-auto' src={assets.razorpay_logo} alt='Pay with Razorpay' />
                                </button>
                            )}
                            {!item.cancelled && !item.payment && !item.isCompleted && payment === item._id && (
                                <button type='button' onClick={() => appointmentStripe(item._id)} className={`${btnBase} flex items-center justify-center bg-white ring-slate-200 hover:bg-surface`}>
                                    <img className='h-6 w-auto' src={assets.stripe_logo} alt='Pay with Stripe' />
                                </button>
                            )}
                            {!item.cancelled && item.payment && !item.isCompleted && (
                                <span className={`${btnBase} cursor-default bg-primary-muted text-center text-primary-dark ring-primary/20`}>Paid</span>
                            )}
                            {item.isCompleted && (
                                <span className={`${btnBase} cursor-default bg-emerald-50 text-center text-emerald-700 ring-emerald-200`}>Completed</span>
                            )}
                            {!item.cancelled && !item.isCompleted && (
                                <button type='button' onClick={() => cancelAppointment(item._id)} className={`${btnBase} bg-white text-red-600 ring-red-200 hover:bg-red-50`}>
                                    Cancel
                                </button>
                            )}
                            {item.cancelled && !item.isCompleted && (
                                <span className={`${btnBase} cursor-default bg-red-50 text-center text-red-600 ring-red-100`}>Cancelled</span>
                            )}
                        </div>
                    </article>
                ))}
            </div>
        </div>
    )
}

export default MyAppointments
