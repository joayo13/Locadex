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
    <div className='bg-stone-950 min-h-screen text-stone-200 px-4'>
        {isMobileDevice ? <div></div> : null}
        <h1 className='text-6xl py-4 playfair text-orange-400'>Your next adventure awaits.</h1>
        <h2 className='text-3xl pb-4 playfair text-stone-200'>Introducing Locadex</h2>
        <p>The Locadex is an all-in-one travel companion that uses GPS and Google Maps to give you fun things to do near you.</p>
        <p>Track your progress over time and keep on hunting down new locations. It's as simple as that.</p>
    </div>
  )
}

export default Home