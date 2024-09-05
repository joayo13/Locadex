import React, { useEffect, useState } from 'react'

function Home() {
    const [isMobileDevice, setIsMobileDevice] = useState(false);
    useEffect(() => {
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        if (isMobile) {
            setIsMobileDevice(true);
        }
    },[])
    
  return (
    <div className='bg-neutral-950 min-h-screen text-neutral-200 p-2'>
        {isMobileDevice ? <div>NON-MOBILE DEVICE DETECTED</div> : null}
        <h1 className='text-6xl text-center py-4'>Your next adventure awaits.</h1>
        <p>Welcome to your all-in-one travel companion. Looking for something fun to do? Ventura makes it easy by giving you interesting locations near you.</p>
        <p>Once you get there, snap a pic in the app and consider that location completed. Track your progress over time and eventually have hundreds or even thousands of locations under your belt. With all the pictures in your personal in-app photo album. Happy Adventuring.</p>
    </div>
  )
}

export default Home