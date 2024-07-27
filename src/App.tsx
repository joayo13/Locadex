import React from 'react';
import logo from './logo.svg';
import './App.css';
import initMap from './services/google';
import getLocation from './services/geolocation';
const App: React.FC = () => {
  async function nextVentura() {
    try {
      let latLng = await getLocation();
      if (latLng && latLng.length === 2) {
        initMap(latLng[0], latLng[1]);
      } else {
        console.error("Invalid location data:", latLng);
      }
    } catch (error) {
      console.error("Failed to get location:", error);
    }
  }
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Ventura
        </p>


<label htmlFor="picture">Take a picture using back facing camera:</label>

<input type="file" id="picture" name="picture" accept="image/*" capture="environment" />
<button onClick={() => nextVentura()}>get new location</button>
<div id="map" style={{ height: '500px', width: '100%' }}></div>
      </header>
    </div>
  );
}

export default App;
