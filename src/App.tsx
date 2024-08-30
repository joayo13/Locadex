import React, { useEffect, useState } from 'react';
import './App.css';
import ImageUploader from './components/ImageUploader';
import NewLocationGenerator from './components/NewLocationGenerator';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth, signOutUser } from './services/firebase';
//TODO: Implement this haversine equation for checking distance between lat longs
// function distance(lat1, lon1, lat2, lon2) {
//   const r = 6371; // km
//   const p = Math.PI / 180;

//   const a = 0.5 - Math.cos((lat2 - lat1) * p) / 2
//                 + Math.cos(lat1 * p) * Math.cos(lat2 * p) *
//                   (1 - Math.cos((lon2 - lon1) * p)) / 2;

//   return 2 * r * Math.asin(Math.sqrt(a));
// }

const App: React.FC = () => {
    const [signInFormVisible, setSignInFormVisible] = useState<boolean>(false);
    const [signUpFormVisible, setSignUpFormVisible] = useState<boolean>(false);
    const [user, setUser] = useState<User | null>(null);
    const [isMobileDevice, setIsMobileDevice] = useState(false);
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) {
        setIsMobileDevice(true);
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, []);
    return (
        <div className="App">
            <p>Ventura</p>
            <p>Logged in as {user ? user.email : 'guest'}</p>
            {!user ? (
                <button
                    onClick={() => setSignInFormVisible(!signInFormVisible)}
                >
                    Sign In
                </button>
            ) : null}
            {signInFormVisible ? (
                <SignIn setSignInFormVisible={setSignInFormVisible} />
            ) : null}
            {!user ? (
                <button
                    onClick={() => setSignUpFormVisible(!signUpFormVisible)}
                >
                    Create Account
                </button>
            ) : null}
            {signUpFormVisible ? (
                <SignUp setSignUpFormVisible={setSignUpFormVisible} />
            ) : null}
            {user ? (
                <button onClick={() => signOutUser(auth)}>Sign Out</button>
            ) : null}
            <ImageUploader />
            <NewLocationGenerator />
            <div>{isMobile ? 'heelo its mobile device' : null}</div>
        </div>
    );
};

export default App;
