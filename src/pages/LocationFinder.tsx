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
            <div id="map"></div>
            <button onClick={() => getPlace()}>getplace</button>
            <button onClick={() => console.log(place)}>logplace</button>
            {!loading ? <p>{place?.name ?? 'no results'}</p> : null}
        </div>
  )
}

export default LocationFinder