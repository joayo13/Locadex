
import getLocation from "./geolocation";

let map: google.maps.Map | null;
let watcherId: number | null = null; // Store the watcher ID
export const initMap = async () => {
    try {
        let latlng = await getLocation()
    const center = new google.maps.LatLng(latlng[0], latlng[1]);
    map = new google.maps.Map(document.getElementById('map') as HTMLElement, {
        center: center,
        zoom: 15,
        mapId: '7c4573adc746c106',
    });
    }
    catch(error) {
        if(error instanceof Error) {
            throw error.message
        }
    }
    
};
export const initUserPosition = () => {
    if (watcherId !== null) {
        navigator.geolocation.clearWatch(watcherId); // Clear any existing watcher
    }

    // Start watching the user's position
    watcherId = navigator.geolocation.watchPosition(updateUserPosition, error, options);
};
export const cleanupUserPosition = () => {
    if (watcherId !== null) {
        navigator.geolocation.clearWatch(watcherId); // Clear the watcher on unmount
        watcherId = null; // Reset the watcher ID
    }
};
const error = (err: GeolocationPositionError) => {
    console.error(`ERROR(${err.code}): ${err.message}`);
};
const options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 200,
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
    markerContent.style.backgroundColor = '#fb923c'; // Blue color
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

export const generateLocation = async (
    lat: number,
    lng: number,
  ): Promise<google.maps.places.PlaceResult | null> => {
    await initMap(); // Assuming this initializes the map
    const center = new google.maps.LatLng(lat, lng);
    const service = new google.maps.places.PlacesService(map as google.maps.Map);
  
    const request: google.maps.places.PlaceSearchRequest = {
      location: center,
      radius: 1000,
      type: 'tourist_attraction',
      language: 'en-US',
    };
  
    return new Promise((resolve, reject) => {
      service.nearbySearch(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && results && results.length > 0) {
          const placeResult = results[0]; // Get the first result
          resolve(placeResult); // Resolve the promise with the place result
        } else {
          console.log('No places found');
          resolve(null); // Resolve with null if no places found
        }
      });
    });
  };
