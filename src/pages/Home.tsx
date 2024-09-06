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
    <div className='bg-stone-950 min-h-screen text-stone-200 p-2'>
        {isMobileDevice ? <div></div> : null}
        <h1 className='text-6xl py-4 playfair text-orange-400'>Your next adventure awaits.</h1>
        <p>The Locadex is an all-in-one travel companion that uses GPS and Google Maps and gives you fun things to do near you.</p>
        <p>Track your progress over time and eventually have hundreds or even thousands of locations. With all the pictures in your personal in-app photo album.</p>
    </div>
  )
}

export default Home