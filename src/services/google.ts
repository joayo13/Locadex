let map: google.maps.Map | null = null;
let watcherId: number | null = null; // Store the watcher ID
let latlng: [number, number];
export const initMap = async (latlngcoords: [number, number]) => {
    try {
        latlng = latlngcoords;
        const center = { lat: latlng[0], lng: latlng[1] };
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
const markers: google.maps.marker.AdvancedMarkerElement[] = [];

// Function to add markers
export const addMarkers = (
    locations: Array<{ latlng: google.maps.LatLng; icon: string } | null>
) => {
    if (locations && map) {
        for (let location of locations) {
            if (location) {
                //we create a const copy of map or else eslint will complain that we are referencing a changable variable in a loop
                const mapCopy = map
                const iconElement = document.createElement('img');
                iconElement.src = location.icon;
                iconElement.alt = 'Location Icon';
                iconElement.style.width = '32px';
                iconElement.style.height = '32px';

                const marker = new google.maps.marker.AdvancedMarkerElement({
                    position: location.latlng,
                    map: map,
                    title: 'test',
                    content: iconElement,
                });
                const infoWindow = new google.maps.InfoWindow({
                    content: `<h1>Place</h1><p>Come on down !</p>`,
                });
                
                // Add event listener to marker for click event
                marker.addListener("click", () => {
                    infoWindow.open(mapCopy, marker); // Open info window on marker click
                });

                markers.push(marker); // Store marker reference
            }
        }
    }
    else {
        throw new Error("Could not add marker to map, try again.")
    }
};

// Function to remove markers
export const removeMarkers = () => {
    for (let marker of markers) {
        marker.map = null; // Remove each marker from the map
    }
    markers.length = 0; // Clear the array of markers
};

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

    export const getPlaces = async (
        radius: number,
        ratingMinimum: number,
        reviewAmountMinimum: number,
        placeTypes: Array<PlaceType>
    ): Promise<{ places: Array<google.maps.places.PlaceResult>, error?: string }> => {
        const center = new google.maps.LatLng(latlng[0], latlng[1]);
        const service = new google.maps.places.PlacesService(map as google.maps.Map);
    
        const createPlaceSearchRequests = (
            center: google.maps.LatLng,
            radius: number,
            placeTypes: Array<PlaceType>
        ): Array<google.maps.places.PlaceSearchRequest> => {
            return placeTypes.map((type) => ({
                location: center,
                radius: radius,
                type: type,
                language: 'en-US',
            }));
        };
    
        const placeRequests = createPlaceSearchRequests(center, radius, placeTypes);
        if (!placeTypes.length) {
            return { places: [], error: 'No Place Types Selected.' }; // Return error, but still return an empty places array
        }
        const allResults: Array<google.maps.places.PlaceResult> = [];
    
        for (const request of placeRequests) {
            const result = await new Promise<google.maps.places.PlaceResult | null>((resolve) => {
                service.nearbySearch(request, (results, status) => {
                    if (status === google.maps.places.PlacesServiceStatus.OK && results) {
                        const filteredResults = results.filter((place) => {
                            const firstType = place.types && place.types.length > 0 ? place.types[0] : null;
                            return (
                                (place.rating ?? 0) >= ratingMinimum &&
                                (place.user_ratings_total ?? 0) >= reviewAmountMinimum &&
                                firstType === request.type
                            );
                        });
    
                        if (filteredResults.length > 0) {
                            resolve(filteredResults[Math.floor(Math.random() * filteredResults.length)]);
                        } else {
                            resolve(null); // No places meeting criteria
                        }
                    } else {
                        resolve(null); // No places found
                    }
                });
            });
    
            // Add result if found for this type
            if (result !== null) allResults.push(result);
        }
    
        // If no results are found across all types, return error information
        if (allResults.length === 0) {
            return { places: [], error: 'No locations found.' }; // No locations found
        }
    
        // If some place types couldn't be found, return the results and provide a warning
        if (allResults.length < placeRequests.length) {
            console.log(allResults); // Log the results for debugging
            return { places: allResults, error: 'Some place types could not be found.' }; // Partial results with error message
        }
    
        // If everything is successful, return the results without error
        return { places: allResults };
    };
