import { useEffect, useState } from "react";
import getLocation from "../services/geolocation";
import { generateLocation } from "../services/google";


function LocationFinder() {
    const [place, setPlace] = useState<google.maps.places.PlaceResult | null>(null);
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        loadSavedPlace()
    },[])

    function loadSavedPlace() {
        // In case we already have a location set in local storage. We want to avoid using apis/ firebase as much as possible.
        let savedPlace: google.maps.places.PlaceResult | null = null;
        
        const placeFromStorage = localStorage.getItem('place');
        
        if (placeFromStorage) {
            
            savedPlace = JSON.parse(placeFromStorage) as google.maps.places.PlaceResult | null;
            if (savedPlace) {
                setPlace(savedPlace);
                setLoading(false)
                return;
            }
        }
    }
    function removeLocation() {
        setPlace(null)
        localStorage.removeItem('place')
    }
    const selectedLocation = () => {
        return (
            <div className="w-full text-orange-400">
            <p>Selected Place:</p>
            <div className="h-px w-full bg-orange-400"></div>
            <p className="text-stone-200">{place?.name}</p>
            <button type="button" onClick={() => removeLocation()} className='bg-orange-800 w-fit mx-auto text-stone-200 px-4 py-2 mt-5 rounded-sm'>
                Remove Place
            </button>
            </div>
        )
    }
    async function getPlace() {
        const latlng = await getLocation();
        const newPlace = await generateLocation(latlng[0], latlng[1], setLoading);
        setPlace(newPlace);
        
        // Store new place in localStorage
        localStorage.setItem('place', JSON.stringify(newPlace));
    }
    return (
        <div className='min-h-screen bg-stone-950 text-stone-200 px-4'>
            <h1 className='text-6xl py-4 playfair text-orange-400'>Locator</h1>
            {/* using this empty div id=map to give init map something to attach to, we init map in generateLocation */}
            <div id="map"></div>

            {!loading && place ? selectedLocation() : null}
            {place ? null : <button onClick={() => getPlace()}>Search</button>}
            
        </div>
  )
}

export default LocationFinder