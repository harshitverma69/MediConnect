import React from 'react'
import { assets } from '../assets/assets'

const Contact = () => {
  return (
    <div className='pb-16'>
      <div className='mx-auto max-w-xl text-center'>
        <p className='text-sm font-bold uppercase tracking-widest text-primary'>Contact</p>
        <h1 className='mt-2 text-4xl font-bold text-ink'>We&apos;re here to help</h1>
        <p className='mt-3 text-muted'>Reach the MediConnect team for support or partnerships.</p>
      </div>

      <div className='mt-12 grid gap-10 lg:grid-cols-2 lg:items-stretch'>
        <div className='overflow-hidden rounded-2xl bg-card shadow-card ring-1 ring-slate-200/80'>
          <img className='h-full max-h-[420px] w-full object-cover lg:max-h-none lg:min-h-[360px]' src={assets.contact_image} alt='Office' />
        </div>

        <div className='flex flex-col justify-center gap-8 rounded-2xl bg-card p-8 shadow-card ring-1 ring-slate-200/80 sm:p-10'>
          <div>
            <p className='text-xs font-bold uppercase tracking-wider text-primary'>Office</p>
            <p className='mt-2 text-lg font-semibold text-ink'>KIET Group of Institutions</p>
            <p className='mt-2 text-sm leading-relaxed text-muted'>
              Survey No. 140 - 141/1<br />Ghaziabad (IIITN)
            </p>
          </div>
          <div>
            <p className='text-xs font-bold uppercase tracking-wider text-primary'>Direct</p>
            <p className='mt-2 text-sm text-muted'>Tel: <span className='font-medium text-ink'>(91) 8562930574</span></p>
            <p className='mt-1 text-sm text-muted'>
              Email:{' '}
              <a href='mailto:harshit.2226cseml110@kiet.edu' className='font-medium text-primary hover:underline'>
                harshit.2226cseml110@kiet.edu
              </a>
            </p>
          </div>
          <div>
            <p className='text-xs font-bold uppercase tracking-wider text-primary'>Careers</p>
            <p className='mt-2 text-sm text-muted'>Learn more about our teams and openings.</p>
            <button
              type='button'
              className='mt-4 rounded-xl border-2 border-ink bg-ink px-8 py-3 text-sm font-semibold text-white transition hover:bg-white hover:text-ink'
            >
              Explore jobs
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact
