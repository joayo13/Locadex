import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import ImageUploader from './components/ImageUploader';
import NewLocationGenerator from './components/NewLocationGenerator';
import SignIn from './components/SignIn'
import SignUp from './components/SignUp';
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
  const [signInFormVisible, setSignInFormVisible] = useState<boolean>(false)
  const [signUpFormVisible, setSignUpFormVisible] = useState<boolean>(false)
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Ventura
        </p>
<ImageUploader />
<NewLocationGenerator />
<button onClick={() => setSignInFormVisible(!signInFormVisible)}>Sign In</button>
{signInFormVisible? <SignIn setSignInFormVisible={setSignInFormVisible}/> : null}
<button onClick={() => setSignInFormVisible(!signInFormVisible)}>Create Account</button>
{signUpFormVisible? <SignUp setSignUpFormVisible={setSignUpFormVisible}/> : null}
      </header>
    </div>
  );
}

export default App;
