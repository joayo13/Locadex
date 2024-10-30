import Slider from '../components/Slider';
import { useError } from '../contexts/ErrorContext';
import { getUserLocation } from '../services/geolocation';
import {
    addMarkers,
    getPlaces,
    initMap,
    initUserPosition,
} from '../services/google';
import LoadingScreen from './LoadingScreen';
import { useEffect, useRef, useState } from 'react';

type PlaceType =
    | 'restaurant'
    | 'cafe'
    | 'tourist_attraction'
    | 'museum'
    | 'park'
    | 'hotel'
    | 'shopping_mall'
    | 'night_club'
    | 'gym'
    | 'library';

function LocationFinder() {
    const [loading, setLoading] = useState(false);
    const [radius, setRadius] = useState(1000); // Default radius in meters
    const [ratingMinimum, setRatingMinimum] = useState(3); // Default rating
    const [reviewAmountMinimum, setReviewAmountMinimum] = useState(10); // Default review count
    const [placeTypes, setPlaceTypes] = useState<Array<PlaceType>>([
        'restaurant',
    ]); // Default place type
    const [useGeolocation, setUseGeolocation] = useState(false);
    const [latitude, setLatitude] = useState<number | null>(null);
    const [longitude, setLongitude] = useState<number | null>(null);
    const [latLngInput, setLatLngInput] = useState<string>('');
    const { setError } = useError();
    const setErrorRef = useRef(setError);

    useEffect(() => {
        const initializeMapAndPosition = async () => {
            try {
                // Use a timeout to delay the execution of the following code
                await new Promise((resolve) => setTimeout(resolve, 2000));

                let latlng: [number, number] = [
                    51.50737789462524, -0.12766368781412313,
                ];
                if (useGeolocation) {
                    latlng = await getUserLocation();
                } else if (latitude !== null && longitude !== null) {
                    latlng = [latitude, longitude];
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
    }, [useGeolocation, latLngInput, latitude, longitude]);

    const handleSearch = async () => {
        setLoading(true);
        try {
            const results = await getPlaces(
                radius,
                ratingMinimum,
                reviewAmountMinimum,
                placeTypes
            );
            // Handle the results (e.g., display them, update state, etc.)
            console.log(results);
            addMarkers(
                results.map((result) => result.geometry?.location ?? null)
            );
        } catch (error) {
            if (error instanceof Error) setError(error.message);
        } finally {
            setLoading(false);
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

    const handleToggleGeolocation = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setUseGeolocation(event.target.checked);
        if (event.target.checked) {
            setLatitude(null);
            setLongitude(null);
            setLatLngInput('');
        }
    };

    const handleLatLngInputChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const value = event.target.value;
        setLatLngInput(value);

        // Try to parse the latitude and longitude from the input
        const [lat, lng] = value
            .split(',')
            .map((coord) => parseFloat(coord.trim()));

        if (!isNaN(lat) && !isNaN(lng)) {
            setLatitude(lat);
            setLongitude(lng);
        } else {
            setLatitude(null);
            setLongitude(null);
        }
    };
    const UserPreferences = () => {
        return (
            <div>
                <h2 className="text-orange-400 text-2xl playfair underline">
                    User Preferences
                </h2>

                {/* Geolocation Toggle */}
                <div className="mt-2">
                    <input
                        id="geolocation-toggle"
                        type="checkbox"
                        checked={useGeolocation}
                        onChange={handleToggleGeolocation}
                        className="mr-1"
                    />
                    <label htmlFor="geolocation-toggle">
                        Use Geolocation
                    </label>
                </div>

                {/* Custom Latitude and Longitude Input */}
                {!useGeolocation && (
                    <div>
                        <label htmlFor="latLng">Latitude, Longitude:</label>
                        <input
                            id="latLng"
                            type="text"
                            value={latLngInput}
                            onChange={handleLatLngInputChange}
                            placeholder="Enter as lat, lng"
                            className="mt-2 block"
                        />
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="bg-stone-950 text-stone-200 flex flex-col lg:flex-row">
            <div className="flex flex-col gap-2 mt-2 px-4">
                <UserPreferences />
                <h2 className="text-orange-400 text-2xl playfair underline">
                    Search Parameters
                </h2>
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
