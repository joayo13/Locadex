const getLocation = (): Promise<[number, number]> => {
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

export default getLocation;
