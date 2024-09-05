import React, { useState } from 'react'
import { auth, signOutUser } from '../services/firebase'
import { User } from 'firebase/auth';
interface MainNavProps {
    user: User | null;
    signInFormVisible: boolean;
    setSignInFormVisible: (visible: boolean) => void;
}

function MainNav({user, signInFormVisible, setSignInFormVisible}: MainNavProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [overlay, setOverlay] = useState(false)
  function toggleMenu() {
    setMenuOpen(!menuOpen);
    if(overlay === false) {
      setOverlay(true)
    }
    document.body.style.overflow = menuOpen ? 'hidden' : 'auto';
  }
  function handleOverlayClick() {
		toggleMenu();
	}
  return (
    <nav className='bg-neutral-900 shadow-lg text-neutral-200 flex justify-between items-center px-2 h-16'><button className='text-xl text-blue-400'>Ventura</button>
    <div onClick={handleOverlayClick} className={`overlay ${menuOpen ? 'animate-overlay-open' : 'animate-overlay-close'}`}></div>
    <nav aria-label='mobile-menu' className={`mobile-menu bg-blue-950 text-neutral-200 p-4 ${menuOpen ? 'animate-mobile-menu-open' : 'animate-mobile-menu-close'}`}>
      <ul className='flex flex-col items-start gap-8'>
        <button className='underline'>My Adventure</button>
        <button className='underline'>Location Index</button>
        <span className='h-px bg-neutral-200 w-full'></span>
        {user ? <p>Logged in as {user.email}</p> : null}
        {user ? <button onClick={() => signOutUser(auth)} className='underline'>Sign Out</button> : <button onClick={() =>{ setSignInFormVisible(true); setMenuOpen(false)}} className='underline'>Sign In</button>}

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
  )
}

export default MainNav