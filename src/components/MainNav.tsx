import React from 'react'
import { auth, signOutUser } from '../services/firebase'
import { User } from 'firebase/auth';
interface MainNavProps {
    user: User | null;
    signInFormVisible: boolean;
    setSignInFormVisible: (visible: boolean) => void;
}

function MainNav({user, signInFormVisible, setSignInFormVisible}: MainNavProps) {
  return (
    <nav className='bg-neutral-900 text-neutral-200 flex justify-between items-center px-2 h-16'><p className='text-xl text-blue-400'>Ventura</p>
    {!user ? (
        <button className='bg-blue-800 py-2 px-4 rounded'
            onClick={() => setSignInFormVisible(!signInFormVisible)}
        >
            Sign In
        </button>
    ) : <button onClick={() => signOutUser(auth)}>Sign Out</button>}</nav>
  )
}

export default MainNav