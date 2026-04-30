import axios from 'axios';
import React, { useContext, useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';

const Verify = () => {

    const [searchParams] = useSearchParams()

    const success = searchParams.get("success")
    const appointmentId = searchParams.get("appointmentId")

    const { backendUrl, token } = useContext(AppContext)

    const navigate = useNavigate()
    const ran = useRef(false)

    const verifyStripe = async () => {
        try {
            const { data } = await axios.post(backendUrl + "/api/user/verifyStripe", { success, appointmentId }, { headers: { token } })

            if (data.success) {
                toast.success(data.message)
            } else {
                toast.error(data.message)
            }

            navigate("/my-appointments")

        } catch (error) {
            toast.error(error.message)
            console.log(error)
            navigate("/my-appointments")
        }
    }

    useEffect(() => {
        if (ran.current) return
        if (token && appointmentId != null && success != null) {
            ran.current = true
            verifyStripe()
        }
    }, [token, appointmentId, success])

    return (
        <div className='flex min-h-[50vh] flex-col items-center justify-center gap-4 py-16'>
            <div className="h-14 w-14 animate-spin rounded-full border-4 border-slate-200 border-t-primary" />
            <p className='text-sm font-medium text-muted'>Confirming payment…</p>
        </div>
    )
}

export default Verify
