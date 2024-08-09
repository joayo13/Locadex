import React, { useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import ImageUploader from './components/ImageUploader';
import NewLocationGenerator from './components/NewLocationGenerator';
import {app, auth, googleSignIn} from'./services/firebase'
import { useSignInWithGoogle } from 'react-firebase-hooks/auth';
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
  const [signInWithGoogle, user, loading, error] = useSignInWithGoogle(auth);
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Ventura
        </p>
        <div id="firebaseui-auth-container"></div>
<ImageUploader/>
<NewLocationGenerator/>
<button onClick={() => signInWithGoogle()}>Google sign in</button>
<button onClick={() => console.log(user)}>Is there a user</button>
      </header>
    </div>
  );
}

export default App;
