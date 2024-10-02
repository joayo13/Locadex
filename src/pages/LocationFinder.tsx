import { useEffect, useState } from "react";
import getLocation from "../services/geolocation";
import { generateLocation } from "../services/google";
import { useAuth } from "../contexts/AuthContext";
import { updateDoc, getDoc, doc, setDoc } from "firebase/firestore";
import { db } from "../services/firebase";
import { useError } from "../contexts/ErrorContext";


function LocationFinder() {
    const [place, setPlace] = useState<google.maps.places.PlaceResult | null>(null);
    const [loading, setLoading] = useState(true)
    const [placeCaptured, setPlaceCaptured] = useState(false)
    const { currentUser } = useAuth()
    const { setError } = useError()
    useEffect(() => {
        loadSavedPlace()
    },[])

    async function capturePlace() {
        try {
            const d = await getDistanceFromLatLonInKm(); // Get distance
            if (d !== undefined && d < 0.5) {
                if (currentUser) {
                    const userDocRef = doc(db, "users", currentUser.uid);
    
                    // Get the current array of places
                    const userDocSnap = await getDoc(userDocRef);
                    if (userDocSnap.exists()) {
                        const currentPlaces = userDocSnap.data().places || [];
    
                        // Append the new place name if it's not already in the array
                        if (!currentPlaces.includes(place?.name)) {
                            const updatedPlaces = [...currentPlaces, place?.name];
    
                            // Update the user's document with the new places array
                            await updateDoc(userDocRef, { places: updatedPlaces });
                            setPlaceCaptured(true);
                        } else {
                            console.log("Place is already captured.");
                        }
                    } else {
                        // If no document exists, create it with the initial array
                        await setDoc(userDocRef, {
                            places: [place?.name],
                        });
                        setPlaceCaptured(true);
                    }
                } else {
                    setError("No User Logged In");
                }
            } else {
                setError("Place is too far away. Get closer and try again.");
            }
        } catch (error) {
            // Handle errors here
            console.error("An error occurred while capturing the place:", error);
            setError("An error occurred while capturing the place. Please try again.");
        }
    }

    async function getDistanceFromLatLonInKm() {
        try {
            const location = place?.geometry?.location;
            console.log(location);
            
            const lat1 = location?.lat ?? 0;
            const lon1 = location?.lng ?? 0;
    
            // Get user's latitude and longitude
            const userLatLon = await getLocation(); // This can throw an error
            const lat2 = userLatLon[0] ?? 0;
            const lon2 = userLatLon[1] ?? 0;
    
            const R = 6371; // Radius of the earth in km
            const dLat = deg2rad(lat2 - (lat1 as number));  // deg2rad below
            const dLon = deg2rad(lon2 - (lon1 as number)); 
            
            const a = 
                Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(deg2rad(lat1 as number)) * Math.cos(deg2rad(lat2)) * 
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
            
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
            const d = R * c; // Distance in km
            console.log(d);
            
            return d;
        } catch (error) {
            if(error instanceof Error) {
                setError(error.message)
            }
            
        }
    }
    
    function deg2rad(deg: number) {
        return deg * (Math.PI / 180);
    }

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
        // Store new place in localStorage
        localStorage.setItem('place', JSON.stringify(newPlace));
        loadSavedPlace()
    }
    return (
        <div className='min-h-screen bg-stone-950 text-stone-200 px-4'>
            <h1 className='text-6xl py-4 playfair text-orange-400'>Locator</h1>
            {/* using this empty div id=map to give init map something to attach to, we init map in generateLocation */}
            <div id="map"></div>

            {!loading && place ? selectedLocation() : null}
            {place ? null : <button onClick={() => getPlace()}>Search</button>}
            <button onClick={() => {capturePlace()}}>Distance</button>
            <p>{placeCaptured ? 'place captured' : null}</p>
        </div>
  )
}

export default LocationFinder