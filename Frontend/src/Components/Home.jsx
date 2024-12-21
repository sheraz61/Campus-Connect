import React from 'react'
import Button from '../Components/Button'
import homeImg from '../assets/homeImg.jpeg'
function Home() {
  return (
    <div className='flex items-center justify-around h-screen'>
      
      <div className=' flex flex-col items-center justify-center '>
        <h1 className='text-5xl font-bold p-6 text-gray-700'>Campus Connect</h1>
        <p className='w-80 text-gray-700 text-xl'>Connect with your peers, share resources, and build a community.</p>
        <div className='p-6'>
        <Button text='Get Started' />
        </div>
      </div>
      <div className=' mt-8'>
        <img src={homeImg} alt="home-img" width={500} />
      </div>
    </div>
  )
}

export default Home