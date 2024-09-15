import React, { useEffect, useState } from 'react'
import AnimatedLink from '../components/AnimatedLink';

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
        <p>The Locadex (Location-Index) is an all-in-one travel companion that uses GPS and Google Maps to give you fun things to do near you.</p>
        <p>Track your progress over time and keep on hunting down new locations. It's as simple as that.</p>
        <p>The Locadex features a built in map, built in GPS, locator, and an index that contains all the places you've been.</p>
        <p>Open up the app, and let it be your guide. It's an answer to the question "What should I do today?"</p>
        <h2 className='text-3xl py-4 playfair text-stone-200'>Security is our number one priority</h2>
        <p>We take user security very seriously, and have ensured that any location data is kept private from anyone other than you. Find more details about security and privacy here:</p>
        <AnimatedLink to={'/security'} className='underline'>Security Details</AnimatedLink>
    </div>
  )
}

export default Home