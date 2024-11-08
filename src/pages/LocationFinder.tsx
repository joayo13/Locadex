import Slider from '../components/Slider';
import UseLocationPopup from '../components/UseLocationPopup';
import { useError } from '../contexts/ErrorContext';
import { getUserLocation } from '../services/geolocation';
import {
    addMarkers,
    getPlaces,
    initMap,
    initUserPosition,
    removeMarkers,
} from '../services/google';
import LoadingScreen from './LoadingScreen';
import { useEffect, useRef, useState } from 'react';

type PlaceType =
    | 'restaurant'
    | 'cafe'
    | 'tourist_attraction'
    | 'museum'
    | 'park'
    | 'gym'
    | 'library';

function LocationFinder() {
    const [loading, setLoading] = useState(false);
    const [radius, setRadius] = useState(1000); // Default radius in meters
    const [ratingMinimum, setRatingMinimum] = useState(3); // Default rating
    const [reviewAmountMinimum, setReviewAmountMinimum] = useState(10); // Default review count
    const [placeTypes, setPlaceTypes] = useState<Array<PlaceType>>([]); // Default place type
    const [useGeolocation, setUseGeolocation] = useState(false);
    const [useLocationPopup, setUseLocationPopup] = useState(false);
    const { setError } = useError();
    const setErrorRef = useRef(setError);
    useEffect(() => {
        if (localStorage.getItem('useLocation') === 'true') {
            setUseGeolocation(true);
            return;
        } else if (localStorage.getItem('useLocation') === 'false') {
            //since usegeolocation is false by default we can just return outta here
            return;
        } else {
            //here we'll initiate popup since they haven't been to site before
            setUseLocationPopup(true);
        }
    }, []);
    useEffect(() => {
        const initializeMapAndPosition = async () => {
            try {
                // Use a timeout to delay the execution of the following code
                // await new Promise((resolve) => setTimeout(resolve, 2000));

                let latlng: [number, number] = [
                    51.50737789462524, -0.12766368781412313,
                ];
                if (useGeolocation) {
                    latlng = await getUserLocation();
                }
                await initMap(latlng);
                if (useGeolocation) {
                    await initUserPosition();
                }
            } catch (e) {
                if (e instanceof Error) {
                    setErrorRef.current(e.message);
                }
            }
        };

        initializeMapAndPosition();
    }, [useGeolocation]);

    function selectIconFromFirstType(type: string): string {
        switch (type) {
            case 'restaurant':
                return '/icons/restaurant.png';
            case 'cafe':
                return '/icons/cafe.png';
            case 'park':
                return '/icons/park.png';
            case 'museum':
                return '/icons/museum.png';
            case 'tourist_attraction':
                return '/icons/tourist-attraction.png';
            case 'gym':
                return '/icons/gym.png';
            case 'library':
                return '/icons/library.png';
            // Add more cases as needed
            default:
                return '/icons/tourist-attraction.png'; // Fallback icon if type is unrecognized
        }
    }

    const handleSearch = async () => {
        removeMarkers(); // Remove any previous markers
        setLoading(true); // Set loading state to true
        try {
            const { places, error } = await getPlaces(
                radius,
                ratingMinimum,
                reviewAmountMinimum,
                placeTypes
            );
    
            // Process the places (add markers) even if there's an error message
            if (places.length > 0) {
                addMarkers(
                    places.map((result) =>
                        result.geometry?.location && result.types?.length
                            ? {
                                  latlng: result.geometry.location,
                                  icon: selectIconFromFirstType(result.types[0]),
                                  name: result.name ?? "Unknown Name", // Default name
                                  address: result.vicinity ?? "Address not available", // Default address
                                  rating: result.rating ?? 0, // Default rating
                                  reviewAmount: result.user_ratings_total ?? 0 // Default review count
                              }
                            : null
                    )
                );
                console.log(places); // Log places for debugging
            }
    
            // Handle error case (if error exists)
            if (error) {
                setError(error); // Set the error message to state
                console.log(error); // Optionally log the error for debugging or user feedback
            }
    
        } catch (error) {
            // Handle unexpected errors that occur during the API call
            if (error instanceof Error) setError(error.message);
        } finally {
            setLoading(false); // Set loading state to false after completion
        }
    };

    const handlePlaceTypeChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const { value, checked } = event.target;
        if (checked) {
            // Add place type if checked
            setPlaceTypes((prev) => [...prev, value as PlaceType]);
        } else {
            // Remove place type if unchecked
            setPlaceTypes((prev) => prev.filter((type) => type !== value));
        }
    };

    return (
        <div className="bg-stone-950 text-stone-200 flex flex-col lg:flex-row">
            {useLocationPopup ? (
                <UseLocationPopup
                    setUseGeolocation={setUseGeolocation}
                    setUseLocationPopup={setUseLocationPopup}
                />
            ) : null}
            <div className="flex flex-col gap-2 mt-2 px-4">
                <Slider
                    value={radius}
                    min={100}
                    max={5000}
                    step={50}
                    onChange={setRadius}
                    label="Search Radius"
                />

                <label>
                    Set Minimum Rating:
                    <input
                        type="number"
                        min="0"
                        max="5"
                        step="0.1"
                        value={ratingMinimum}
                        onChange={(e) =>
                            setRatingMinimum(Number(e.target.value))
                        }
                        className="block p-1 mt-2 text-black"
                    />
                </label>

                <label>
                    Set Minimum Review Count:
                    <input
                        type="number"
                        min="0"
                        value={reviewAmountMinimum}
                        onChange={(e) =>
                            setReviewAmountMinimum(Number(e.target.value))
                        }
                        className="p-1 mt-2 block text-black"
                    />
                </label>

                <div className="flex flex-col items-start">
                    <h3>Select Place Types:</h3>
                    <label>
                        <input
                            type="checkbox"
                            value="restaurant"
                            className="mr-1 mt-2"
                            checked={placeTypes.includes('restaurant')}
                            onChange={handlePlaceTypeChange}
                        />
                        Restaurant
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            value="cafe"
                            className="mr-1"
                            checked={placeTypes.includes('cafe')}
                            onChange={handlePlaceTypeChange}
                        />
                        Café
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            value="tourist_attraction"
                            className="mr-1"
                            checked={placeTypes.includes('tourist_attraction')}
                            onChange={handlePlaceTypeChange}
                        />
                        Tourist Attraction
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            value="museum"
                            className="mr-1"
                            checked={placeTypes.includes('museum')}
                            onChange={handlePlaceTypeChange}
                        />
                        Museum
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            value="park"
                            className="mr-1"
                            checked={placeTypes.includes('park')}
                            onChange={handlePlaceTypeChange}
                        />
                        Park
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            value="gym"
                            className="mr-1"
                            checked={placeTypes.includes('gym')}
                            onChange={handlePlaceTypeChange}
                        />
                        Gym
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            value="library"
                            className="mr-1"
                            checked={placeTypes.includes('library')}
                            onChange={handlePlaceTypeChange}
                        />
                        Library
                    </label>
                </div>

                <button
                    onClick={handleSearch}
                    className="py-2 pl-2 mb-2 w-fit flex items-center bg-transparent hover:bg-orange-400 border border-orange-400  text-orange-400 hover:text-stone-950 rounded-sm transition-all"
                >
                    Search Places
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="size-5 inline-block"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m8.25 4.5 7.5 7.5-7.5 7.5"
                        />
                    </svg>
                </button>
            </div>
            <div
                className="relative"
                style={{ height: 'calc(100vh - 4rem)', width: '100%' }}
                id="map"
            >
                {loading ? (
                    <div className="absolute top-0 left-0 right-0 bottom-0 w-full h-full">
                        <LoadingScreen />
                    </div>
                ) : null}
            </div>
        </div>
    );
}

export default LocationFinder;
