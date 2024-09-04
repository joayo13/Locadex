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
    <nav><p>Ventura</p>
    <p>Logged in as {user ? user.email : 'guest'}</p>
    {!user ? (
        <button
            onClick={() => setSignInFormVisible(!signInFormVisible)}
        >
            Sign In
        </button>
    ) : <button onClick={() => signOutUser(auth)}>Sign Out</button>}</nav>
  )
}

export default MainNav