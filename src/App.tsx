import React from 'react';
import logo from './logo.svg';
import './App.css';
import GoogleMap from './GoogleMap';

const App: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Ventura
        </p>
        <GoogleMap/>

<label htmlFor="picture">Take a picture using back facing camera:</label>

<input type="file" id="picture" name="picture" accept="image/*" capture="environment" />

      </header>
    </div>
  );
}

export default App;
