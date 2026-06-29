import React from 'react'
import { Link } from 'react-router'

function LandingPage() {
  return (
    <div className='etm-board min-h-screen w-full flex items-center justify-center px-6 py-16'>

      {/* Scattered background notes — purely decorative */}
      <div className='etm-bg-notes'>
        <div className='etm-bg-note etm-bg-note--1'>Can I be him?😞</div>
        <div className='etm-bg-note etm-bg-note--2'>Mahalin mo na ko please🥺</div>
        <div className='etm-bg-note etm-bg-note--3'>You don't know how much I think about you❤️</div>
        <div className='etm-bg-note etm-bg-note--4'>Ako na lang please😔</div>
        <div className='etm-bg-note etm-bg-note--5'>I want you so baaaaad🥰</div>
        <div className='etm-bg-note etm-bg-note--6'>Araw-Gabi✨</div>
      </div>

      <div className='etm-board__content w-full max-w-md flex flex-col items-center text-center gap-5'>

        <h1 className="etm-display etm-display--xl">
          Each Thoughts Matter
        </h1>

        <p className="etm-hero__subtitle">
          A space where every thought matters.
        </p>

        <div className='flex flex-col md:flex-row gap-3 w-full mt-2'>
          <Link to='/login' className='w-full'>
            <button className='etm-btn etm-btn--primary w-full justify-center'>
              Log in
            </button>
          </Link>

          <Link to='/register' className='w-full'>
            <button className='etm-btn etm-btn--outline-rust w-full justify-center'>
              Sign Up
            </button>
          </Link>
        </div>

      </div>
    </div>
  )
}

export default LandingPage