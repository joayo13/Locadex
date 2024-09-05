import React, { useEffect, useState } from 'react'
import { auth, signOutUser } from '../services/firebase'
import { User } from 'firebase/auth';
import { Link } from 'react-router-dom';
interface MainNavProps {
    user: User | null;
}

function MainNav({user}: MainNavProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  function toggleMenu() {
   setMenuOpen(!menuOpen)
  }
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden'; // Disable scrolling
    } else {
      document.body.style.overflow = 'auto'; // Enable scrolling
    }

    // Cleanup function to reset overflow when the component unmounts or when menuOpen changes
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [menuOpen]);
  function handleOverlayClick() {
		toggleMenu();
	}
  return (
    <>
    <nav className='bg-neutral-900 shadow-lg text-neutral-200 flex justify-between items-center px-2 h-16 fixed w-full z-20'><Link to={"/"} className='text-xl text-blue-400'>Ventura</Link>
    <div onClick={handleOverlayClick} className={`overlay ${menuOpen ? 'animate-overlay-open' : 'animate-overlay-close'}`}></div>
    <nav aria-label='mobile-menu' className={`mobile-menu bg-neutral-950 text-neutral-200 p-4 ${menuOpen ? 'animate-mobile-menu-open' : 'animate-mobile-menu-close'}`}>
      <ul className='flex flex-col items-start gap-8'>
        <button className='underline'>My Adventure</button>
        <button className='underline'>Location Index</button>
        <span className='h-px bg-neutral-200 w-full'></span>
        {user ? <p>Logged in as {user.email}</p> : null}
        {user ? <button onClick={() => {setMenuOpen(false);signOutUser(auth)}} className='underline'>Sign Out</button> : <Link to={'/sign-in'} onClick={() =>{ setMenuOpen(false)}} className='underline'>Sign In</Link>}

      </ul>
    </nav>
    <button
					className={`hamburger hamburger--collapse ${menuOpen ? 'is-active' : ''}`}
					onClick={toggleMenu}
					aria-expanded={menuOpen}
					aria-controls="mobile-menu"
				>
					<span className="hamburger-box">
						<span className="hamburger-inner"></span>
					</span>
				</button>
    </nav>
    {/* to create a consistent margin at top for any content or pages so we don't have to do it manually for every page */}
    <div className='h-16 w-full bg-neutral-950'></div>
    </>
  )
}

export default MainNav