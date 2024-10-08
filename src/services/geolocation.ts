export const getLocation = (): Promise<[number, number]> => {
    return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    resolve([
                        position.coords.latitude,
                        position.coords.longitude,
                    ]);
                },
                (error) => {
                    // Pass a specific error message to the caller
                    reject(new Error(getGeolocationErrorMessage(error)));
                }
            );
        } else {
            // Reject with an error if geolocation is not supported
            reject(new Error('Geolocation not supported by this browser.'));
        }
    });
};

const EARTH_RADIUS_KM = 6371;

export function getDistanceFromLatLonInKm(userLatLon: [number, number] = [0, 0], placeLatLon: [number, number] = [0, 0]) {
    const [lat1, lon1] = placeLatLon;
    const [lat2, lon2] = userLatLon;
    
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    
    const a = 
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
    const distance = EARTH_RADIUS_KM * c;
    console.log(distance)
    return(distance)
}

function deg2rad(deg: number) {
    return deg * (Math.PI / 180);
}

// Function to get human-readable error messages
const getGeolocationErrorMessage = (error: GeolocationPositionError): string => {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            return 'User denied the request for Geolocation.';
        case error.POSITION_UNAVAILABLE:
            return 'Location information is unavailable.';
        case error.TIMEOUT:
            return 'The request to get user location timed out.';
        default:
            return 'An unknown error occurred.';
    }
};
