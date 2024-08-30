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
                    reject(showError(error));
                }
            );
        } else {
            reject(new Error('Geolocation not supported by this browser.'));
        }
    });
};

const showError = (error: GeolocationPositionError) => {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            console.error('User denied the request for Geolocation.');
            break;
        case error.POSITION_UNAVAILABLE:
            console.error('Location information unavailable.');
            break;
        case error.TIMEOUT:
            console.error('Location request timeout.');
            break;
    }
};

export default getLocation;
