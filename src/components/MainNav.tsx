import React, { useEffect, useState } from 'react'
import AnimatedLink from './AnimatedLink';
import { useAuth } from '../contexts/AuthContext';
import { flushSync } from 'react-dom';
import { useNavigate } from 'react-router-dom';

function MainNav() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate()
  function toggleMenu() {
   setMenuOpen(!menuOpen)
  }
  async function handleLogout() {
    await logout()
    document.startViewTransition(() => {
      flushSync(() => {
        navigate("/");
      });
    });
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
    <nav className='bg-stone-900 shadow-lg text-stone-200 flex justify-between items-center pl-4 h-16 fixed w-full z-20'><AnimatedLink to={"/"} onClick={() => setMenuOpen(false)} className='text-xl playfair text-orange-400'>Locadex</AnimatedLink>
    <div onClick={handleOverlayClick} className={`overlay ${menuOpen ? 'animate-overlay-open' : 'animate-overlay-close'}`}></div>
    <nav aria-label='mobile-menu' className={`mobile-menu bg-stone-950 text-stone-200 p-4 ${menuOpen ? 'animate-mobile-menu-open' : 'animate-mobile-menu-close'}`}>
      <ul className='flex flex-col items-start gap-8'>
        <AnimatedLink onClick={() => setMenuOpen(false)} to={"/adventure"} className='underline'>Start Adventure</AnimatedLink>
        <AnimatedLink onClick={() => setMenuOpen(false)}  to={"/location-index"} className='underline'>Location Index</AnimatedLink>
        <span className='h-px bg-stone-200 w-full'></span>
        {currentUser ? <p>Logged in as {currentUser.email}</p> : null}
        {currentUser ? <button onClick={() => {handleLogout(); setMenuOpen(false)}} className='underline'>Sign Out</button> : <AnimatedLink to={'/sign-in'} onClick={() =>{ setMenuOpen(false)}} className='underline'>Sign In</AnimatedLink>}

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
    <div className='h-16 w-full bg-stone-950'></div>
    </>
  )
}

export default MainNav