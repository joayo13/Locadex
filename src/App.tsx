import React, { useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import './App.css';
import SignIn from './pages/SignIn';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './services/firebase';
import MainNav from './components/MainNav';
import SignUp from './pages/SignUp';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import LocationIndex from './pages/LocationIndex';
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
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, []);

    return (
        <Router>
            <MainNav user={user}/>
            <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/sign-in' element={<SignIn />} />
                <Route path='/sign-up' element={<SignUp />} />
                <Route path='/location-index' element={<LocationIndex />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Router>
        // <div className='bg-neutral-900 text-neutral-200 px-2'>
        //     <MainNav user={user} setSignInFormVisible={setSignInFormVisible} signInFormVisible={signInFormVisible} />
        //     {signInFormVisible ? (
        //         <SignIn setSignInFormVisible={setSignInFormVisible} />
        //     ) : null}
        //     <ImageUploader />
        //     <NewLocationGenerator />
        //     {isMobileDevice ? <div>Hey mobile</div> : <div>Not Mobile Haha</div>}
        // </div>
    );
};

export default App;
