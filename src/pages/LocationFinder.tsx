import { useState } from "react";
import getLocation from "../services/geolocation";
import { generateLocation } from "../services/google";


function LocationFinder() {
    const [place, setPlace] = useState<google.maps.places.PlaceResult | null>(null);
    async function getPlace() {
        let latlng = await getLocation()
        const newPlace = await generateLocation(latlng[0], latlng[1])
        setPlace(newPlace)
    }
    return (
        <div className='min-h-screen bg-stone-950 text-stone-200 px-4'>
            <h1 className='text-6xl py-4 playfair text-orange-400'>Locator</h1>
            <div id="map"></div>
            <button onClick={() => getPlace()}>getplace</button>
            <button onClick={() => console.log(place)}>logplace</button>
            <p>{place?.name}</p>
        </div>
  )
}

export default LocationFinder