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
import LoadingScreen from './LoadingScreen';
import { useNavigate } from 'react-router-dom';

function LocationFinder() {
    const [place, setPlace] = useState<google.maps.places.PlaceResult | null>(
        null
    );
    const [loading, setLoading] = useState(false);
    const [placeCaptured, setPlaceCaptured] = useState(false);
    const { currentUser } = useAuth();
    const { setError } = useError();
    const [distance, setDistance] = useState(0);
    const navigate = useNavigate();
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
                console.log(savedPlace)
                return;
            }
        }
    }
    function removeLocation() {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
        }, 500);
        setPlace(null);
        setDistance(0);
        localStorage.removeItem('place');
    }
    const selectedLocation = () => {
        const items = [
            { label: 'Selected Place:', value: place?.name ?? 'N/A' },
            {
                label: 'Rating:',
                value: place?.rating
                    ? `${place?.rating.toString()} (${place?.user_ratings_total?.toString()} Reviews)`
                    : 'N/A',
            },
            {
                label: 'Distance:',
                value: distance ? `${distance.toFixed(1)}km` : 'N/A',
            },
        ];

        return (
            <div className="w-full text-orange-400">
                <h1 className="text-6xl py-4 playfair text-orange-400">
                    Locator
                </h1>
                {items.map((item, index) => (
                    <div
                        key={index}
                        className="fade-in-animation"
                        style={{ animationDelay: `${index * 0.2}s` }} // Stagger effect with delay
                    >
                        <p>{item.label}</p>
                        <div className="h-px w-full bg-orange-400"></div>
                        <p className="text-stone-200">{item.value}</p>
                    </div>
                ))}
            </div>
        );
    };
    function buttonsIfCurrentPlace() {
        return (
            <div
                style={{ animationDelay: '0.6s' }}
                className="mt-2 fade-in-animation"
            >
                <button
                    className="text-green-500 w-44 border-green-500 px-4 py-2 rounded-sm border flex items-center justify-center gap-2"
                    onClick={() => {
                        capturePlace();
                    }}
                >
                    {placeCaptured ? 'Already Captured' : 'Capture Place'}
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        className="size-6"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                        />
                    </svg>
                </button>

                <button
                    className="text-red-500 w-44 border-red-500 border px-4 py-2 rounded-sm flex items-center justify-center gap-2 mt-2"
                    onClick={() => {
                        removeLocation();
                    }}
                >
                    Remove Place
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        className="size-6 inline-block"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                        />
                    </svg>
                </button>
                <button
                    className="text-orange-400 mt-2 w-44 border-orange-400 px-4 py-2 rounded-sm border flex items-center justify-center gap-2"
                    onClick={() => {
                        navigate('/map');
                    }}
                >
                    Show in Map
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        className="size-6"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z"
                        />
                    </svg>
                </button>
            </div>
        );
    }
    function buttonsIfNotCurrentPlace() {
        return (
            <button
                style={{ animationDelay: '0.6s' }}
                className="fade-in-animation text-orange-400 mt-2 w-44 border-orange-400 border px-4 py-2 rounded-sm flex items-center justify-center gap-2"
                onClick={() => {
                    getPlace();
                }}
            >
                Get Location
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    className="size-6"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                    />
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                    />
                </svg>
            </button>
        );
    }
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
            loadSavedPlace();
            setLoading(false); // Reset loading state
        }
    }
    return (
        <div className="min-h-screen bg-stone-950 text-stone-200 px-4">
            {/* using this empty div id=map to give init map something to attach to, we init map in generateLocation */}
            <div id="map"></div>

            {loading ? <LoadingScreen /> : selectedLocation()}
            {place ? buttonsIfCurrentPlace() : buttonsIfNotCurrentPlace()}
        </div>
    );
}

export default LocationFinder;
