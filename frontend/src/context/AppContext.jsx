import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from 'axios'

export const AppContext = createContext()

const DEFAULT_BACKEND = 'http://localhost:4000'
/** Optional: set in DevTools to fix wrong production API without redeploying: localStorage.setItem(MEDICONNECT_BACKEND_URL_KEY, 'https://your-express.onrender.com'); location.reload() */
export const MEDICONNECT_BACKEND_URL_KEY = 'MEDICONNECT_BACKEND_URL'

/** Base URL for Express only (no trailing slash, no trailing /api — routes already start with /api/). */
function normalizeBackendBase(raw) {
    if (raw == null || String(raw).trim() === '') return DEFAULT_BACKEND
    let s = String(raw).trim().replace(/\/+$/, '')
    s = s.replace(/\/api$/i, '')
    return s || DEFAULT_BACKEND
}

function readBackendOverrideFromStorage() {
    try {
        if (typeof localStorage === 'undefined') return null
        const v = localStorage.getItem(MEDICONNECT_BACKEND_URL_KEY)
        if (!v || !String(v).trim()) return null
        const n = normalizeBackendBase(v)
        if (!/^https?:\/\//i.test(n)) return null
        return n
    } catch {
        return null
    }
}

const AppContextProvider = (props) => {

    const currencySymbol = '₹'
    const viteBackendRaw = import.meta.env.VITE_BACKEND_URL
    const storedOverride = readBackendOverrideFromStorage()
    const backendUrl = storedOverride ?? normalizeBackendBase(viteBackendRaw)
    const backendUrlSource = storedOverride ? 'localStorage' : viteBackendRaw ? 'VITE_BACKEND_URL' : 'default'
    /** Production build still using default localhost → API calls fail in the browser. */
    const prodBackendEnvMissing =
        import.meta.env.PROD &&
        !storedOverride &&
        (!viteBackendRaw ||
            /^https?:\/\/(localhost|127\.0\.0\.1)(\b|:)/i.test(backendUrl))

    const [doctors, setDoctors] = useState([])
    const [token, setToken] = useState(localStorage.getItem('token') ? localStorage.getItem('token') : '')
    const [userData, setUserData] = useState(false)

    // Getting Doctors using API
    const getDoctosData = async () => {

        try {

            const { data } = await axios.get(backendUrl + '/api/doctor/list')
            if (data.success) {
                setDoctors(data.doctors)
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }

    }

    // Getting User Profile using API
    const loadUserProfileData = async () => {

        try {

            const { data } = await axios.get(backendUrl + '/api/user/get-profile', { headers: { token } })

            if (data.success) {
                setUserData(data.userData)
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }

    }

    useEffect(() => {
        getDoctosData()
    }, [])

    useEffect(() => {
        if (token) {
            loadUserProfileData()
        }
    }, [token])

    const value = {
        doctors, getDoctosData,
        currencySymbol,
        backendUrl,
        backendUrlSource,
        prodBackendEnvMissing,
        token, setToken,
        userData, setUserData, loadUserProfileData
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )

}

export default AppContextProvider