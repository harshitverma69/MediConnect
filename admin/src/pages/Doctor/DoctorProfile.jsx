import React, { useContext, useEffect, useState } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { AppContext } from '../../context/AppContext'
import { toast } from 'react-toastify'
import axios from 'axios'

const field =
  'mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-ink outline-none ring-primary/25 focus:border-primary focus:ring-2'

const DoctorProfile = () => {

    const { dToken, profileData, setProfileData, getProfileData } = useContext(DoctorContext)
    const { currency, backendUrl } = useContext(AppContext)
    const [isEdit, setIsEdit] = useState(false)

    const updateProfile = async () => {

        try {

            const updateData = {
                address: profileData.address,
                fees: profileData.fees,
                about: profileData.about,
                available: profileData.available
            }

            const { data } = await axios.post(backendUrl + '/api/doctor/update-profile', updateData, { headers: { dToken } })

            if (data.success) {
                toast.success(data.message)
                setIsEdit(false)
                getProfileData()
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
            console.log(error)
        }

    }

    useEffect(() => {
        if (dToken) {
            getProfileData()
        }
    }, [dToken])

    return profileData && (
        <div className='p-4 sm:p-8'>
            <div className='mb-6'>
                <h1 className='text-2xl font-bold text-ink'>Profile</h1>
                <p className='mt-1 text-sm text-muted'>How patients see you on MediConnect.</p>
            </div>

            <div className='grid gap-8 lg:grid-cols-[min(320px,100%)_1fr]'>
                <div className='overflow-hidden rounded-2xl bg-card shadow-card ring-1 ring-slate-200/80'>
                    <img className='aspect-[3/4] w-full object-cover' src={profileData.image} alt='' />
                </div>

                <div className='rounded-2xl bg-card p-6 shadow-card ring-1 ring-slate-200/80 sm:p-8'>
                    <p className='text-2xl font-bold text-ink'>{profileData.name}</p>
                    <div className='mt-2 flex flex-wrap items-center gap-2 text-muted'>
                        <span>{profileData.degree} · {profileData.speciality}</span>
                        <span className='rounded-full bg-surface px-3 py-0.5 text-xs font-semibold text-ink ring-1 ring-slate-200'>
                            {profileData.experience}
                        </span>
                    </div>

                    <div className='mt-6 border-t border-slate-100 pt-6'>
                        <p className='text-sm font-semibold text-ink'>About</p>
                        <div className='mt-2 text-sm leading-relaxed text-muted'>
                            {isEdit ? (
                                <textarea
                                    onChange={(e) => setProfileData(prev => ({ ...prev, about: e.target.value }))}
                                    className={`${field} min-h-[160px]`}
                                    rows={6}
                                    value={profileData.about}
                                />
                            ) : (
                                profileData.about
                            )}
                        </div>
                    </div>

                    <p className='mt-6 text-sm'>
                        <span className='font-semibold text-ink'>Fee </span>
                        <span className='text-primary'>
                            {currency}{' '}
                            {isEdit ? (
                                <input type='number' className={`${field} inline-block w-28`} onChange={(e) => setProfileData(prev => ({ ...prev, fees: e.target.value }))} value={profileData.fees} />
                            ) : (
                                <span className='font-semibold text-ink'>{profileData.fees}</span>
                            )}
                        </span>
                    </p>

                    <div className='mt-4 text-sm'>
                        <p className='font-semibold text-ink'>Address</p>
                        <p className='mt-1 text-muted'>
                            {isEdit ? (
                                <>
                                    <input type='text' className={field} onChange={(e) => setProfileData(prev => ({ ...prev, address: { ...prev.address, line1: e.target.value } }))} value={profileData.address.line1} />
                                    <input type='text' className={`${field} mt-2`} onChange={(e) => setProfileData(prev => ({ ...prev, address: { ...prev.address, line2: e.target.value } }))} value={profileData.address.line2} />
                                </>
                            ) : (
                                <>
                                    {profileData.address.line1}
                                    <br />
                                    {profileData.address.line2}
                                </>
                            )}
                        </p>
                    </div>

                    <label className='mt-6 flex cursor-pointer items-center gap-2 text-sm font-medium text-ink'>
                        <input
                            type='checkbox'
                            onChange={() => isEdit && setProfileData(prev => ({ ...prev, available: !prev.available }))}
                            checked={profileData.available}
                            className='h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary'
                        />
                        Accepting new appointments
                    </label>

                    <div className='mt-8 flex flex-wrap gap-3'>
                        {isEdit ? (
                            <>
                                <button type='button' onClick={updateProfile} className='rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-dark'>
                                    Save changes
                                </button>
                                <button
                                    type='button'
                                    onClick={() => { setIsEdit(false); getProfileData(); }}
                                    className='rounded-xl border border-slate-200 bg-white px-6 py-2.5 text-sm font-semibold text-muted shadow-sm transition hover:bg-surface'
                                >
                                    Cancel
                                </button>
                            </>
                        ) : (
                            <button type='button' onClick={() => setIsEdit(true)} className='rounded-xl border border-slate-200 bg-white px-6 py-2.5 text-sm font-semibold text-ink shadow-sm transition hover:bg-surface'>
                                Edit profile
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DoctorProfile
