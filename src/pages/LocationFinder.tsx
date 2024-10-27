
import { getPlaces } from '../services/google';
import LoadingScreen from './LoadingScreen';
import { useState } from 'react';

type PlaceType = "restaurant" | "cafe" | "tourist_attraction" | "museum" | "park" | "hotel" | "shopping_mall" | "night_club" | "gym" | "library";

function LocationFinder() {
    const [loading, setLoading] = useState(false);
    const [radius, setRadius] = useState(1000); // Default radius in meters
    const [ratingMinimum, setRatingMinimum] = useState(3); // Default rating
    const [reviewAmountMinimum, setReviewAmountMinimum] = useState(10); // Default review count
    const [placeTypes, setPlaceTypes] = useState<Array<PlaceType>>(["restaurant"]); // Default place type

    const handleSearch = async () => {
        setLoading(true);
        try {
            const results = await getPlaces(radius, ratingMinimum, reviewAmountMinimum, placeTypes);
            // Handle the results (e.g., display them, update state, etc.)
            console.log(results);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-stone-950 text-stone-200 px-4">
            {/* Empty div for map initialization */}
            <div id="map" style={{ height: '400px' }}></div>
            
            {loading && <LoadingScreen />}

            <div className="controls mt-4">
                <label>
                    Radius (meters):
                    <input
                        type="number"
                        value={radius}
                        onChange={(e) => setRadius(Number(e.target.value))}
                        className="ml-2 p-1 text-black"
                    />
                </label>

                <label className="ml-4">
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

                <label className="ml-4">
                    Minimum Review Count:
                    <input
                        type="number"
                        min="0"
                        value={reviewAmountMinimum}
                        onChange={(e) => setReviewAmountMinimum(Number(e.target.value))}
                        className="ml-2 p-1 text-black"
                    />
                </label>

                <label className="ml-4">
                    Place Types:
                    <select
                        multiple
                        value={placeTypes}
                        onChange={(e) => {
                            const selectedOptions = Array.from(e.target.selectedOptions, option => option.value as PlaceType);
                            setPlaceTypes(selectedOptions);
                        }}
                        className="ml-2 p-1 text-black"
                    >
                        <option value="restaurant">Restaurant</option>
                        <option value="cafe">Café</option>
                        <option value="tourist_attraction">Tourist Attraction</option>
                        <option value="museum">Museum</option>
                        <option value="park">Park</option>
                        <option value="hotel">Hotel</option>
                        <option value="shopping_mall">Shopping Mall</option>
                        <option value="night_club">Night Club</option>
                        <option value="gym">Gym</option>
                        <option value="library">Library</option>
                    </select>
                </label>

                <button onClick={handleSearch} className="ml-4 p-2 bg-blue-600 text-white rounded">
                    Search Places
                </button>
            </div>
        </div>
    );
}

export default LocationFinder;