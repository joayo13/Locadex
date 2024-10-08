
import { getLocation } from "./geolocation";


let map: google.maps.Map | null = null;
let watcherId: number | null = null; // Store the watcher ID
export const initMap = async () => {
    try {
        let latlng = await getLocation()
    const center = new google.maps.LatLng(latlng[0], latlng[1]);
    map = new google.maps.Map(document.getElementById('map') as HTMLElement, {
        center: center,
        zoom: 13,
        mapId: '7c4573adc746c106',
    });
    }
    catch(error) {
        if(error instanceof Error) {
            throw error
        }
    }
    
};
export const initUserPosition = () => {
    cleanupUserPosition()
    watcherId = navigator.geolocation.watchPosition(updateUserPosition, error, options);
};
export const cleanupUserPosition = () => {
    if (watcherId !== null) {
        navigator.geolocation.clearWatch(watcherId); // Clear the watcher on unmount
        watcherId = null; // Reset the watcher ID
    }
};
const error = (err: GeolocationPositionError) => {
    throw err
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
export const addMarker = (location: google.maps.LatLng | null) => {
  if (location && map) {
    new google.maps.marker.AdvancedMarkerElement({
      position: location,
      map: map,
      title: 'test',
      content: null,
    });
  }
};

export const generateLocation = async (
  lat: number,
  lng: number,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
): Promise<google.maps.places.PlaceResult | null> => {
  await initMap();
  const center = new google.maps.LatLng(lat, lng);
  const service = new google.maps.places.PlacesService(map as google.maps.Map);

  const touristAttractionRequest: google.maps.places.PlaceSearchRequest = {
      location: center,
      radius: 10000,
      type: 'tourist_attraction',
      language: 'en-US',
  };

  const parkRequest: google.maps.places.PlaceSearchRequest = {
      location: center,
      radius: 10000,
      type: 'park',
      language: 'en-US',
  };

  return new Promise((resolve, reject) => {
      service.nearbySearch(touristAttractionRequest, (results, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && results && results.length > 0) {
              const filtered = results.filter((x) => (x.user_ratings_total ?? 0) > 100);
              setLoading(false);
              resolve(filtered[Math.floor(Math.random() * filtered.length)]); // Resolve with the best tourist attraction
          } else if (status === google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
              // If no tourist attraction found, search for parks
              service.nearbySearch(parkRequest, (results, status) => {
                  if (status === google.maps.places.PlacesServiceStatus.OK && results && results.length > 0) {
                      const filtered = results.filter((x) => (x.user_ratings_total ?? 0) > 100);
                      setLoading(false);
                      resolve(filtered[Math.floor(Math.random() * filtered.length)]); // Resolve with the best park
                  } else {
                      setLoading(false);
                      // Reject if no parks found
                      reject(new Error("No tourist attractions or parks found near the specified location."));
                  }
              });
          } else {
              // Reject with an error if the Places API call fails for any reason
              setLoading(false);
              reject(new Error("Failed to fetch tourist attractions: " + status));
          }
      });
  });
};
