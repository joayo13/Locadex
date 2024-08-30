import React from 'react';
import '../App.css';
import { initMap } from '../services/google';
import getLocation from '../services/geolocation';
const NewLocationGenerator: React.FC = () => {
    async function nextVentura() {
        try {
            let latLng = await getLocation();
            if (latLng && latLng.length === 2) {
                initMap(latLng[0], latLng[1]);
            } else {
                console.error('Invalid location data:', latLng);
            }
        } catch (error) {
            console.error('Failed to get location:', error);
        }
    }
    return (
        <div style={{ height: '20rem', width: '100%' }}>
            <button onClick={() => nextVentura()}>initMap</button>
            <div id="map" style={{ height: '500px', width: '100%' }}></div>
        </div>
    );
};

export default NewLocationGenerator;
