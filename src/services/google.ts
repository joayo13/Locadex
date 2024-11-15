let map: google.maps.Map | null = null;
let watcherId: number | null = null; // Store the watcher ID
let latlng: [number, number];
export const initMap = async (latlngcoords: [number, number]) => {
    try {
        const { Map } = (await google.maps.importLibrary(
            'maps'
        )) as google.maps.MapsLibrary;
        await google.maps.importLibrary('marker');
        await google.maps.importLibrary('places');

        latlng = latlngcoords;
        const center = { lat: latlng[0], lng: latlng[1] };
        map = new Map(document.getElementById('map') as HTMLElement, {
            center: center,
            zoom: 12,
            mapId: '7c4573adc746c106',
        });
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
    locations: Array<{
        latlng: google.maps.LatLng;
        icon: string;
        name: string;
        address: string;
        rating: number;
        reviewAmount: number;
    } | null>
) => {
    if (locations && map) {
        for (let location of locations) {
            if (location) {
                // Create a copy of the map variable for safe referencing in the loop
                const mapCopy = map;

                // Create the icon element for the marker
                const iconElement = document.createElement('img');
                iconElement.src = location.icon;
                iconElement.alt = 'Location Icon';
                iconElement.style.width = '32px';
                iconElement.style.height = '32px';

                // Create the marker with the specified position, map, and icon
                const marker = new google.maps.marker.AdvancedMarkerElement({
                    position: location.latlng,
                    map: map,
                    title: location.name,
                    content: iconElement,
                });

                // Create content for the InfoWindow with dynamic data
                const infoWindowContent = document.createElement('div');
                infoWindowContent.className = 'custom-info-window';

                const nameElement = document.createElement('h1');
                nameElement.className = 'info-window-title';
                nameElement.textContent = location.name;

                const addressElement = document.createElement('p');
                addressElement.textContent = `Address: ${location.address}`;

                const ratingElement = document.createElement('p');
                ratingElement.textContent = `Rating: ${location.rating ?? 'N/A'}`;

                const reviewAmountElement = document.createElement('p');
                reviewAmountElement.textContent = `Reviews: ${location.reviewAmount ?? 'N/A'}`;

                // Append elements to the content container
                infoWindowContent.appendChild(nameElement);
                infoWindowContent.appendChild(addressElement);
                infoWindowContent.appendChild(ratingElement);
                infoWindowContent.appendChild(reviewAmountElement);

                // Create the InfoWindow and set its content
                const infoWindow = new google.maps.InfoWindow({
                    content: infoWindowContent,
                });

                // Add event listener to the marker for the click event to open InfoWindow
                marker.addListener('click', () => {
                    infoWindow.open(mapCopy, marker);
                });

                // Store the marker reference
                markers.push(marker);
            }
        }
    } else {
        throw new Error('Could not add marker to map, try again.');
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

async function applyFiltersToRequest(
    request: google.maps.places.PlaceSearchRequest,
    ratingMinimum: number,
    reviewAmountMinimum: number
): Promise<google.maps.places.PlaceResult | null> {
    const service = new google.maps.places.PlacesService(
        map as google.maps.Map
    );
    const result = await new Promise<google.maps.places.PlaceResult | null>(
        (resolve) => {
            service.nearbySearch(request, (results, status) => {
                if (
                    status === google.maps.places.PlacesServiceStatus.OK &&
                    results
                ) {
                    const filteredResults = results.filter((place) => {
                        const firstType =
                            place.types && place.types.length > 0
                                ? place.types[0]
                                : null;
                        return (
                            (place.rating ?? 0) >= ratingMinimum &&
                            (place.user_ratings_total ?? 0) >=
                                reviewAmountMinimum &&
                            firstType === request.type
                        );
                    });

                    if (filteredResults.length > 0) {
                        resolve(
                            filteredResults[
                                Math.floor(
                                    Math.random() * filteredResults.length
                                )
                            ]
                        );
                    } else {
                        resolve(null); // No places meeting criteria
                    }
                } else {
                    resolve(null); // No places found
                }
            });
        }
    );
    return result;
}
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

export const getPlaces = async (
    radius: number,
    ratingMinimum: number,
    reviewAmountMinimum: number,
    placeTypes: Array<PlaceType>
): Promise<{
    places: Array<google.maps.places.PlaceResult>;
    error?: string;
}> => {
    if (!latlng) {
        throw new Error(
            'Must wait for map to initialize before sending place requests.'
        );
    }
    const center = new google.maps.LatLng(latlng[0], latlng[1]);

    const placeRequests = createPlaceSearchRequests(center, radius, placeTypes);
    if (!placeTypes.length) {
        throw new Error('No Place Types Selected.');
    }
    const allResults: Array<google.maps.places.PlaceResult> = [];

    for (const request of placeRequests) {
        const result = await applyFiltersToRequest(
            request,
            ratingMinimum,
            reviewAmountMinimum
        );
        // Add result if found for this type
        if (result !== null) allResults.push(result);
    }

    // If no results are found across all types, return error information
    if (allResults.length === 0) {
        throw new Error('No Results Found. Try increasing Search Radius.');
    }

    // If some place types couldn't be found, return the results and provide a warning
    if (allResults.length < placeRequests.length) {
        console.log(allResults); // Log the results for debugging
        return {
            places: allResults,
            error: 'Some place types could not be found and have been omitted.',
        }; // Partial results with error message
    }

    // If everything is successful, return the results without error
    return { places: allResults };
};
