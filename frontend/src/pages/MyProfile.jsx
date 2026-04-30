import React, { useContext, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { assets } from '../assets/assets'

const field = 'mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-ink outline-none ring-primary/20 focus:border-primary focus:ring-2'

const MyProfile = () => {

    const [isEdit, setIsEdit] = useState(false)
    const [image, setImage] = useState(false)

    const { token, backendUrl, userData, setUserData, loadUserProfileData } = useContext(AppContext)

    const updateUserProfileData = async () => {
        try {
            const formData = new FormData();
            formData.append('name', userData.name)
            formData.append('phone', userData.phone)
            formData.append('address', JSON.stringify(userData.address))
            formData.append('gender', userData.gender)
            formData.append('dob', userData.dob)
            image && formData.append('image', image)

            const { data } = await axios.post(backendUrl + '/api/user/update-profile', formData, { headers: { token } })

            if (data.success) {
                toast.success(data.message)
                await loadUserProfileData()
                setIsEdit(false)
                setImage(false)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    return userData ? (
        <div className='mx-auto max-w-2xl pb-16'>
            <h1 className='text-3xl font-bold text-ink'>My profile</h1>
            <p className='mt-2 text-sm text-muted'>Keep your details up to date for smoother bookings.</p>

            <div className='mt-8 overflow-hidden rounded-2xl bg-card shadow-card ring-1 ring-slate-200/80'>
                <div className='flex flex-col gap-6 border-b border-slate-100 p-8 sm:flex-row sm:items-start'>
                    {isEdit ? (
                        <label htmlFor='image' className='relative inline-block cursor-pointer'>
                            <img
                                className='h-36 w-36 rounded-2xl object-cover ring-2 ring-slate-100'
                                src={image ? URL.createObjectURL(image) : userData.image}
                                alt=''
                            />
                            <span className='absolute bottom-2 right-2 rounded-lg bg-white/90 p-1.5 shadow'>
                                <img className='h-6 w-6' src={assets.upload_icon} alt='' />
                            </span>
                            <input onChange={(e) => setImage(e.target.files[0])} type='file' id='image' hidden />
                        </label>
                    ) : (
                        <img className='h-36 w-36 rounded-2xl object-cover ring-2 ring-slate-100' src={userData.image} alt='' />
                    )}

                    <div className='flex-1'>
                        {isEdit ? (
                            <input className='text-2xl font-bold text-ink outline-none' type='text' onChange={(e) => setUserData(prev => ({ ...prev, name: e.target.value }))} value={userData.name} />
                        ) : (
                            <h2 className='text-2xl font-bold text-ink'>{userData.name}</h2>
                        )}
                        <p className='mt-1 text-sm text-primary'>{userData.email}</p>
                    </div>
                </div>

                <div className='space-y-8 p-8'>
                    <div>
                        <p className='text-xs font-bold uppercase tracking-wider text-primary'>Contact</p>
                        <div className='mt-4 grid gap-4 sm:grid-cols-[120px_1fr] sm:gap-x-4'>
                            <span className='text-sm font-medium text-muted'>Phone</span>
                            {isEdit ? (
                                <input className={field} type='text' onChange={(e) => setUserData(prev => ({ ...prev, phone: e.target.value }))} value={userData.phone} />
                            ) : (
                                <span className='text-sm text-ink'>{userData.phone}</span>
                            )}

                            <span className='text-sm font-medium text-muted'>Address</span>
                            {isEdit ? (
                                <div className='space-y-2'>
                                    <input className={field} type='text' onChange={(e) => setUserData(prev => ({ ...prev, address: { ...prev.address, line1: e.target.value } }))} value={userData.address.line1} />
                                    <input className={field} type='text' onChange={(e) => setUserData(prev => ({ ...prev, address: { ...prev.address, line2: e.target.value } }))} value={userData.address.line2} />
                                </div>
                            ) : (
                                <span className='text-sm text-ink'>{userData.address.line1}<br />{userData.address.line2}</span>
                            )}
                        </div>
                    </div>

                    <div>
                        <p className='text-xs font-bold uppercase tracking-wider text-primary'>Basic</p>
                        <div className='mt-4 grid gap-4 sm:grid-cols-[120px_1fr] sm:gap-x-4'>
                            <span className='text-sm font-medium text-muted'>Gender</span>
                            {isEdit ? (
                                <select className={field} onChange={(e) => setUserData(prev => ({ ...prev, gender: e.target.value }))} value={userData.gender} >
                                    <option value="Not Selected">Not selected</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                </select>
                            ) : (
                                <span className='text-sm text-ink'>{userData.gender}</span>
                            )}

                            <span className='text-sm font-medium text-muted'>Birthday</span>
                            {isEdit ? (
                                <input className={field} type='date' onChange={(e) => setUserData(prev => ({ ...prev, dob: e.target.value }))} value={userData.dob} />
                            ) : (
                                <span className='text-sm text-ink'>{userData.dob}</span>
                            )}
                        </div>
                    </div>

                    <div className='flex flex-wrap gap-3 pt-2'>
                        {isEdit ? (
                            <>
                                <button type='button' onClick={updateUserProfileData} className='rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-dark'>
                                    Save
                                </button>
                                <button
                                    type='button'
                                    onClick={() => { setIsEdit(false); setImage(false); loadUserProfileData(); }}
                                    className='rounded-xl border border-slate-200 bg-white px-6 py-2.5 text-sm font-semibold text-muted hover:bg-surface'
                                >
                                    Cancel
                                </button>
                            </>
                        ) : (
                            <button type='button' onClick={() => setIsEdit(true)} className='rounded-xl border border-slate-200 bg-white px-6 py-2.5 text-sm font-semibold text-ink shadow-sm hover:border-primary hover:text-primary'>
                                Edit profile
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    ) : null
}

export default MyProfile
