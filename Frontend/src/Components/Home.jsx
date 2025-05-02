import React from 'react'
import homeImg from '../assets/homeImg.jpeg'
import { useNavigate } from 'react-router-dom'

function Home() {
  const navigate = useNavigate()
  return (
    <div className='min-h-screen flex flex-col-reverse md:flex-row items-center justify-center md:justify-around px-4 py-8 md:py-0 gap-8 md:gap-4'>
      <div className='flex flex-col items-center md:items-start text-center md:text-left space-y-6'>
        <h1 className='text-3xl sm:text-4xl md:text-5xl font-bold text-gray-700 leading-tight'>
          Campus Connect
        </h1>
        <p className='text-lg sm:text-xl text-gray-700 max-w-md'>
          Connect with your peers, share resources, and build a community.
        </p>
        <div className='pt-2'>
          <button
            className="flex w-full justify-center rounded-md bg-orange-700 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-orange-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            onClick={() => navigate('/register')}
          >
            Get Started
          </button>
        </div>
      </div>

      <div className='w-full max-w-lg md:w-auto md:max-w-xl'>
        <img
          src={homeImg}
          alt="Campus Connect illustration"
          className='w-full h-auto object-contain'
        />
      </div>
    </div>
  )
}

export default Home