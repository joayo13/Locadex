import { getUserLocation } from './geolocation';

let map: google.maps.Map | null = null;
let watcherId: number | null = null; // Store the watcher ID
let latlng: [number, number];
export const initMap = async () => {
    try {
        latlng = await getUserLocation();
        const center = new google.maps.LatLng(latlng[0], latlng[1]);
        map = new google.maps.Map(
            document.getElementById('map') as HTMLElement,
            {
                center: center,
                zoom: 13,
                mapId: '7c4573adc746c106',
            }
        );
    } catch (error) {
        if (error instanceof Error) {
            throw error;
        }
    }
};
export const initUserPosition = () => {
    cleanupUserPosition();
    watcherId = navigator.geolocation.watchPosition(
        updateUserPosition,
        error,
        options
    );
};
export const cleanupUserPosition = () => {
    if (watcherId !== null) {
        navigator.geolocation.clearWatch(watcherId); // Clear the watcher on unmount
        watcherId = null; // Reset the watcher ID
    }
};
const error = (err: GeolocationPositionError) => {
    throw err;
};
const options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 1000,
};

let currentMarker: google.maps.marker.AdvancedMarkerElement | null = null;

const updateUserPosition = (pos: GeolocationPosition) => {
    // Remove the existing marker if it exists
    if (currentMarker) {
        currentMarker.map = null; // Remove from the map
        currentMarker = null; // Release the reference
    }

    // Create new coordinates
    let coords = new google.maps.LatLng({
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
    });
    const markerContent = document.createElement('div');
    markerContent.style.width = '20px';
    markerContent.style.height = '20px';
    markerContent.style.backgroundColor = '#fb923c'; // Orange color
    markerContent.style.borderRadius = '50%'; // Make it a circle
    markerContent.style.border = '2px solid white'; // Optional: add a white border

    // Create a new marker and set it to the map
    currentMarker = new google.maps.marker.AdvancedMarkerElement({
        position: coords,
        map: map,
        title: 'me',
        content: markerContent,
    });
};
export const addMarkers = (locations: Array<google.maps.LatLng | null>) => {
    if (locations && map) {
        for (let location of locations) {
            new google.maps.marker.AdvancedMarkerElement({
                position: location,
                map: map,
                title: 'test',
                content: null,
            });
        }
        
    }
};

type PlaceType = "restaurant" | "cafe" | "tourist_attraction" | "museum" | "park" | "hotel" | "shopping_mall" | "night_club" | "gym" | "library";

export const getPlaces = async (
    radius: number,
    ratingMinimum: number,
    reviewAmountMinimum: number,
    placeTypes: Array<PlaceType>
): Promise<Array<google.maps.places.PlaceResult>> => {
    const center = new google.maps.LatLng(latlng[0], latlng[1]);
    const service = new google.maps.places.PlacesService(map as google.maps.Map);

    const createPlaceSearchRequests = (
        center: google.maps.LatLng,
        radius: number,
        placeTypes: Array<PlaceType>
    ): Array<google.maps.places.PlaceSearchRequest> => {
        return placeTypes.map(type => ({
            location: center,
            radius: radius,
            type: type,
            language: 'en-US',
        }));
    };

    const placeRequests = createPlaceSearchRequests(center, radius, placeTypes);
    const allResults: Array<google.maps.places.PlaceResult> = [];

    for (const request of placeRequests) {
        const result = await new Promise<google.maps.places.PlaceResult | null>((resolve) => {
            service.nearbySearch(request, (results, status) => {
                if (status === google.maps.places.PlacesServiceStatus.OK && results) {
                    const filteredResults = results.filter(
                        (place) =>
                            (place.rating ?? 0) >= ratingMinimum &&
                            (place.user_ratings_total ?? 0) >= reviewAmountMinimum
                    );

                    if (filteredResults.length > 0) {
                        // Add all matching places for this type to the array
                        resolve(
                            filteredResults[Math.floor(Math.random() * filteredResults.length)]
                        );
                    } else {
                        resolve(null);  // No places meeting criteria
                    }
                } else {
                    resolve(null);  // No places found
                }
            });
        });

        // Add result if found for this type
        if (result) allResults.push(result);
    }

    // If no results are found across all types, throw an error
    if (allResults.length === 0) {
        throw new Error("No locations found.");
    }

    return allResults;
};
