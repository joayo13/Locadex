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
    <nav className='bg-neutral-900 text-neutral-200 flex justify-between items-center px-2 h-16'><p className='text-xl text-blue-400'>Ventura</p>
    {overlay ? <div onClick={handleOverlayClick} className={`overlay ${menuOpen ? 'animate-layout-open' : 'animate-layout-close'}`} onAnimationEnd={() => {if(!menuOpen) setOverlay(false); console.log('okay')}}></div> : null}
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