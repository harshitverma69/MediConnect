import React, { useContext, useState } from 'react'
import { assets } from '../../assets/assets'
import { toast } from 'react-toastify'
import axios from 'axios'
import { AdminContext } from '../../context/AdminContext'
import { AppContext } from '../../context/AppContext'

const inputClass =
  'mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-ink outline-none ring-primary/25 transition focus:border-primary focus:ring-2'

const AddDoctor = () => {

    const [docImg, setDocImg] = useState(false)
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [experience, setExperience] = useState('1 Year')
    const [fees, setFees] = useState('')
    const [about, setAbout] = useState('')
    const [speciality, setSpeciality] = useState('General physician')
    const [degree, setDegree] = useState('')
    const [address1, setAddress1] = useState('')
    const [address2, setAddress2] = useState('')

    const { backendUrl } = useContext(AppContext)
    const { aToken } = useContext(AdminContext)

    const onSubmitHandler = async (event) => {
        event.preventDefault()

        try {

            if (!docImg) {
                return toast.error('Image Not Selected')
            }

            const formData = new FormData();

            formData.append('image', docImg)
            formData.append('name', name)
            formData.append('email', email)
            formData.append('password', password)
            formData.append('experience', experience)
            formData.append('fees', Number(fees))
            formData.append('about', about)
            formData.append('speciality', speciality)
            formData.append('degree', degree)
            formData.append('address', JSON.stringify({ line1: address1, line2: address2 }))

            const { data } = await axios.post(backendUrl + '/api/admin/add-doctor', formData, { headers: { aToken } })
            if (data.success) {
                toast.success(data.message)
                setDocImg(false)
                setName('')
                setPassword('')
                setEmail('')
                setAddress1('')
                setAddress2('')
                setDegree('')
                setAbout('')
                setFees('')
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
            console.log(error)
        }

    }

    return (
        <form onSubmit={onSubmitHandler} className='p-4 sm:p-8'>
            <div className='mb-6'>
                <h1 className='text-2xl font-bold text-ink'>Add doctor</h1>
                <p className='mt-1 text-sm text-muted'>Onboard a clinician to the platform.</p>
            </div>

            <div className='max-h-[calc(100vh-140px)] overflow-y-auto rounded-2xl bg-card p-6 shadow-card ring-1 ring-slate-200/80 sm:p-8'>
                <div className='mb-8 flex flex-wrap items-center gap-5'>
                    <label htmlFor='doc-img' className='cursor-pointer'>
                        <img
                            className='h-24 w-24 rounded-2xl border-2 border-dashed border-slate-200 bg-surface object-cover shadow-inner'
                            src={docImg ? URL.createObjectURL(docImg) : assets.upload_area}
                            alt='Upload'
                        />
                    </label>
                    <input onChange={(e) => setDocImg(e.target.files[0])} type='file' id='doc-img' hidden />
                    <div>
                        <p className='font-semibold text-ink'>Profile photo</p>
                        <p className='text-sm text-muted'>Clear face, good light — builds trust with patients.</p>
                    </div>
                </div>

                <div className='grid gap-10 lg:grid-cols-2'>

                    <div className='flex flex-col gap-4'>
                        <label className='text-sm font-medium text-ink'>
                            Full name
                            <input onChange={e => setName(e.target.value)} value={name} className={inputClass} type='text' placeholder='Dr. Name' required />
                        </label>

                        <label className='text-sm font-medium text-ink'>
                            Work email
                            <input onChange={e => setEmail(e.target.value)} value={email} className={inputClass} type='email' placeholder='doctor@clinic.com' required />
                        </label>

                        <label className='text-sm font-medium text-ink'>
                            Initial password
                            <input onChange={e => setPassword(e.target.value)} value={password} className={inputClass} type='password' placeholder='Min. 8 characters' required />
                        </label>

                        <label className='text-sm font-medium text-ink'>
                            Experience
                            <select onChange={e => setExperience(e.target.value)} value={experience} className={inputClass} >
                                <option value='1 Year'>1 Year</option>
                                <option value='2 Year'>2 Years</option>
                                <option value='3 Year'>3 Years</option>
                                <option value='4 Year'>4 Years</option>
                                <option value='5 Year'>5 Years</option>
                                <option value='6 Year'>6 Years</option>
                                <option value='8 Year'>8 Years</option>
                                <option value='9 Year'>9 Years</option>
                                <option value='10 Year'>10 Years</option>
                            </select>
                        </label>

                        <label className='text-sm font-medium text-ink'>
                            Consultation fee
                            <input onChange={e => setFees(e.target.value)} value={fees} className={inputClass} type='number' placeholder='e.g. 500' required />
                        </label>
                    </div>

                    <div className='flex flex-col gap-4'>
                        <label className='text-sm font-medium text-ink'>
                            Speciality
                            <select onChange={e => setSpeciality(e.target.value)} value={speciality} className={inputClass}>
                                <option value='General physician'>General physician</option>
                                <option value='Gynecologist'>Gynecologist</option>
                                <option value='Dermatologist'>Dermatologist</option>
                                <option value='Pediatricians'>Pediatricians</option>
                                <option value='Neurologist'>Neurologist</option>
                                <option value='Gastroenterologist'>Gastroenterologist</option>
                            </select>
                        </label>

                        <label className='text-sm font-medium text-ink'>
                            Degree
                            <input onChange={e => setDegree(e.target.value)} value={degree} className={inputClass} type='text' placeholder='e.g. MBBS, MD' required />
                        </label>

                        <label className='text-sm font-medium text-ink'>
                            Address line 1
                            <input onChange={e => setAddress1(e.target.value)} value={address1} className={inputClass} type='text' required />
                        </label>
                        <label className='text-sm font-medium text-ink'>
                            Address line 2
                            <input onChange={e => setAddress2(e.target.value)} value={address2} className={inputClass} type='text' required />
                        </label>
                    </div>

                </div>

                <label className='mt-8 block text-sm font-medium text-ink'>
                    About
                    <textarea onChange={e => setAbout(e.target.value)} value={about} className={`${inputClass} mt-1.5 min-h-[140px] resize-y`} rows={5} placeholder='Short bio for the profile page' />
                </label>

                <button type='submit' className='mt-8 rounded-xl bg-primary px-10 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-dark'>
                    Add doctor
                </button>
            </div>
        </form>
    )
}

export default AddDoctor
