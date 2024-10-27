
import Slider from '../components/Slider';
import { useError } from '../contexts/ErrorContext';
import { addMarkers, getPlaces, initMap, initUserPosition } from '../services/google';
import LoadingScreen from './LoadingScreen';
import { useEffect, useState } from 'react';

type PlaceType = "restaurant" | "cafe" | "tourist_attraction" | "museum" | "park" | "hotel" | "shopping_mall" | "night_club" | "gym" | "library";

function LocationFinder() {
    const [loading, setLoading] = useState(false);
    const [radius, setRadius] = useState(1000); // Default radius in meters
    const [ratingMinimum, setRatingMinimum] = useState(3); // Default rating
    const [reviewAmountMinimum, setReviewAmountMinimum] = useState(10); // Default review count
    const [placeTypes, setPlaceTypes] = useState<Array<PlaceType>>(["restaurant"]); // Default place type
    const {setError} = useError()

    useEffect(() => {
        initMap()
        initUserPosition()
    },[])

    const handleSearch = async () => {
        setLoading(true);
        try {
            const results = await getPlaces(radius, ratingMinimum, reviewAmountMinimum, placeTypes);
            // Handle the results (e.g., display them, update state, etc.)
            console.log(results)
            addMarkers(results.map((result) => result.geometry?.location ?? null)) 
        } catch (error) {
            if(error instanceof Error)
            setError(error.message)
        } finally {
            setLoading(false);
        }
    };

    const handlePlaceTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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
        <div className="bg-stone-950 text-stone-200 px-4 flex flex-col lg:flex-row">
            {/* Empty div for map initialization */}
            <div className="flex flex-col gap-2">
            <Slider 
                    value={radius} 
                    min={100} 
                    max={5000} 
                    step={50} 
                    onChange={setRadius} 
                    label="Search Radius"
                />

                <label>
                    Minimum Rating:
                    <input
                        type="number"
                        min="0"
                        max="5"
                        step="0.1"
                        value={ratingMinimum}
                        onChange={(e) => setRatingMinimum(Number(e.target.value))}
                        className="ml-2 p-1 text-black"
                    />
                </label>

                <label>
                    Minimum Review Count:
                    <input
                        type="number"
                        min="0"
                        value={reviewAmountMinimum}
                        onChange={(e) => setReviewAmountMinimum(Number(e.target.value))}
                        className="ml-2 p-1 text-black"
                    />
                </label>

                <div className="flex flex-col items-start">
                    <h3>Place Types:</h3>
                    <label>
                        <input
                            type="checkbox"
                            value="restaurant"
                            checked={placeTypes.includes("restaurant")}
                            onChange={handlePlaceTypeChange}
                        />
                        Restaurant
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            value="cafe"
                            checked={placeTypes.includes("cafe")}
                            onChange={handlePlaceTypeChange}
                        />
                        Café
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            value="tourist_attraction"
                            checked={placeTypes.includes("tourist_attraction")}
                            onChange={handlePlaceTypeChange}
                        />
                        Tourist Attraction
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            value="museum"
                            checked={placeTypes.includes("museum")}
                            onChange={handlePlaceTypeChange}
                        />
                        Museum
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            value="park"
                            checked={placeTypes.includes("park")}
                            onChange={handlePlaceTypeChange}
                        />
                        Park
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            value="gym"
                            checked={placeTypes.includes("gym")}
                            onChange={handlePlaceTypeChange}
                        />
                        Gym
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            value="library"
                            checked={placeTypes.includes("library")}
                            onChange={handlePlaceTypeChange}
                        />
                        Library
                    </label>
                </div>

                <button onClick={handleSearch} className=" p-2 w-fit bg-blue-600 text-white rounded">
                    Search Places
                </button>
            </div>
            <div className='relative' style={{height: 'calc(100vh - 4rem)', width: '100%'}} id="map">
            {loading ? <div className='absolute top-0 left-0 right-0 bottom-0 w-full h-full'><LoadingScreen/></div> : null}
            </div>
            
        </div>
    );
}

export default LocationFinder;
