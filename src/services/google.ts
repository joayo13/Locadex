let map: google.maps.Map;

export const initMap = (lat: number, lng: number) => {
    const center = new google.maps.LatLng(lat, lng);
    map = new google.maps.Map(document.getElementById('map') as HTMLElement, {
        center: center,
        zoom: 15,
        mapId: '88c0dfbb3ce2d741',
    });
    //Initialize user position on map, set marker in updateUserPosition
    navigator.geolocation.watchPosition(updateUserPosition, error, options);
};
const error = (err: GeolocationPositionError) => {
    console.error(`ERROR(${err.code}): ${err.message}`);
};
const options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
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
    markerContent.style.backgroundColor = '#4285F4'; // Blue color
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

// export const placePointer = (lat: number, lng: number) => {
//     const center = new google.maps.LatLng(lat, lng);
//     const service = new google.maps.places.PlacesService(map);

//     const request: google.maps.places.PlaceSearchRequest = {
//         location: center,
//         radius: 1000,
//         type: 'tourist_attraction',
//         language: 'en-US',
//     };

//     service.nearbySearch(request, (results, status) => {
//         if (status === google.maps.places.PlacesServiceStatus.OK && results && results.length > 0) {
//             const place = results[0]; // Get the first result, todo: we'll check if user has already captured this result before
//             console.log(place);

//             // Create a marker for the place
//             new google.maps.marker.AdvancedMarkerElement({
//                 position: place.geometry?.location!,
//                 map: map,
//                 title: place.name,
//             });
//         } else {
//             console.log('No places found');
//         }
//     });
// }
