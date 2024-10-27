import { useEffect, useState } from 'react';
import {
    getLocation,
    getDistanceFromLatLonInKm,
} from '../services/geolocation';
import { generateLocation } from '../services/google';
import { useError } from '../contexts/ErrorContext';
import LoadingScreen from './LoadingScreen';

function LocationFinder() {
    const [place, setPlace] = useState<google.maps.places.PlaceResult | null>(
        null
    );
    const [loading, setLoading] = useState(false);
    const [placeCaptured, setPlaceCaptured] = useState(false);
    const { setError } = useError();
    const [distance, setDistance] = useState(0);

    return (
        <div className="min-h-screen bg-stone-950 text-stone-200 px-4">
            {/* using this empty div id=map to give init map something to attach to, we init map in generateLocation */}
            <div id="map"></div>
            {loading ? <LoadingScreen /> : <p>Hello</p>}
        </div>
    );
}

export default LocationFinder;
