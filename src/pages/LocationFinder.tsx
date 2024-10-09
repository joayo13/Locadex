import { useEffect, useState } from 'react';
import {
    getLocation,
    getDistanceFromLatLonInKm,
} from '../services/geolocation';
import { generateLocation } from '../services/google';
import { useAuth } from '../contexts/AuthContext';
import { updateDoc, getDoc, doc, setDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useError } from '../contexts/ErrorContext';

function LocationFinder() {
    const [place, setPlace] = useState<google.maps.places.PlaceResult | null>(
        null
    );
    const [loading, setLoading] = useState(false);
    const [placeCaptured, setPlaceCaptured] = useState(false);
    const { currentUser } = useAuth();
    const { setError } = useError();
    const [distance, setDistance] = useState(0);
    useEffect(() => {
        loadSavedPlace();
    }, []);
    useEffect(() => {
        async function getDistanceFromLatLon() {
            const location = place?.geometry?.location;
            const lat1 = Number(location?.lat) ?? 0;
            const lon1 = Number(location?.lng) ?? 0;
            const [lat2, lon2] = await getLocation();
            setDistance(getDistanceFromLatLonInKm([lat2, lon2], [lat1, lon1]));
        }
        if (place?.geometry?.location) {
            getDistanceFromLatLon();
        }
    }, [place]);

    async function capturePlace() {
        try {
            const d = distance;
            if (d !== 0 && d < 0.1) {
                if (currentUser) {
                    const userDocRef = doc(db, 'users', currentUser.uid);

                    // Get the current array of places
                    const userDocSnap = await getDoc(userDocRef);
                    if (userDocSnap.exists()) {
                        const currentPlaces = userDocSnap.data().places || [];

                        // Append the new place name if it's not already in the array
                        if (!currentPlaces.includes(place?.name)) {
                            const updatedPlaces = [
                                ...currentPlaces,
                                place?.name,
                            ];

                            // Update the user's document with the new places array
                            await updateDoc(userDocRef, {
                                places: updatedPlaces,
                            });
                            setPlaceCaptured(true);
                        } else {
                            setError('Place is already captured.');
                        }
                    } else {
                        // If no document exists, create it with the initial array
                        await setDoc(userDocRef, {
                            places: [place?.name],
                        });
                        setPlaceCaptured(true);
                    }
                } else {
                    setError('No User Logged In');
                }
            } else {
                setError(
                    'Place is too far away. Get within 100m and try again.'
                );
            }
        } catch (error) {
            // Handle errors here
            console.error(
                'An error occurred while capturing the place:',
                error
            );
            if (error instanceof Error) {
                setError(error.message);
                return;
            }
            setError(
                'An error occurred while capturing the place. Please try again.'
            );
        }
    }

    function loadSavedPlace() {
        // In case we already have a location set in local storage. We want to avoid using apis/ firebase as much as possible.
        let savedPlace: google.maps.places.PlaceResult | null = null;

        const placeFromStorage = localStorage.getItem('place');

        if (placeFromStorage) {
            savedPlace = JSON.parse(
                placeFromStorage
            ) as google.maps.places.PlaceResult | null;
            if (savedPlace) {
                setPlace(savedPlace);
                setLoading(false);
                return;
            }
        }
    }
    function removeLocation() {
        setPlace(null);
        setDistance(0);
        localStorage.removeItem('place');
    }
    const selectedLocation = () => {
        return (
            <div className="w-full text-orange-400">
                <p>Selected Place:</p>
                <div className="h-px w-full bg-orange-400"></div>
                <p className="text-stone-200">{place?.name ?? 'N/A'}</p>
                <p>Rating:</p>
                <div className="h-px w-full bg-orange-400"></div>
                <p className="text-stone-200">
                    {place?.rating
                        ? `${place?.rating?.toString()} (${place?.user_ratings_total?.toString()} Reviews)`
                        : 'N/A'}
                </p>
                <p>Distance:</p>
                <div className="h-px w-full bg-orange-400"></div>
                <p className="text-stone-200">
                    {distance ? `${distance.toFixed(1)}km` : 'N/A'}
                </p>
                <div className="absolute flex w-screen h-screen top-0 left-0 justify-center items-center">
                    <div
                        onClick={() => removeLocation()}
                        className="bg-orange-800 justify-center items-center flex bg-opacity-30 text-orange-400 w-48 h-48 rounded-full"
                    >
                        <div
                            onClick={() => getPlace()}
                            className={`${place ? 'transition-locator-btn-dark-orange' : 'transition-locator-btn-orange'} transition-locator-btn absolute flex items-center justify-center rounded-full z-10 h-0 w-0 bg-orange-400 overflow-hidden text-nowrap`}
                        >
                            <p className="text-black">
                                {loading ? 'Loading...' : 'Search Place'}
                            </p>
                        </div>
                        <p>Remove Place</p>
                    </div>
                </div>
            </div>
        );
    };
    async function getPlace() {
        setLoading(true);
        console.log('Loading started');

        try {
            const latlng = await getLocation();
            console.log('Location retrieved:', latlng);

            const newPlace = await generateLocation(latlng[0], latlng[1]);
            console.log('New place generated:', newPlace);

            if (newPlace) {
                localStorage.setItem('place', JSON.stringify(newPlace));
            }
        } catch (e) {
            if (e instanceof Error) {
                setError(e.message);
            } else {
                setError('An unknown error occurred');
            }
        } finally {
            console.log('Finally block executed');
            loadSavedPlace()
            setLoading(false); // Reset loading state
        }
    }
    return (
        <div className="min-h-screen bg-stone-950 text-stone-200 px-4">
            <h1 className="text-6xl py-4 playfair text-orange-400">Locator</h1>
            {/* using this empty div id=map to give init map something to attach to, we init map in generateLocation */}
            <div id="map"></div>

            {selectedLocation()}
            <button
                className=" cursor-pointer absolute bg-red-400"
                onClick={() => {
                    capturePlace();
                }}
            >
                {placeCaptured ? 'captured' : 'not captured'}
            </button>
        </div>
    );
}

export default LocationFinder;
