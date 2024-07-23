import React, { useEffect } from 'react';

const GoogleMap: React.FC = () => {
    useEffect(() => {
        const initMap = () => {
            const center = new google.maps.LatLng(52.369358, 4.889258);

            const map = new google.maps.Map(document.getElementById('map') as HTMLElement, {
                center: center,
                zoom: 15,
            });

            const service = new google.maps.places.PlacesService(map);

            const request: google.maps.places.PlaceSearchRequest = {
                location: center,
                radius: 500,
                type: 'tourist_attraction',
                language: 'en-US',
            };

            service.nearbySearch(request, (results, status) => {
                if (status === google.maps.places.PlacesServiceStatus.OK && results && results.length > 0) {
                    const place = results[0]; // Get the first result
                    console.log(place);

                    // Create a marker for the place
                    new google.maps.Marker({
                        position: place.geometry?.location!,
                        map: map,
                        title: place.name,
                    });
                } else {
                    console.log('No places found');
                }
            });
        };

        // Ensure the script is loaded before calling initMap
        if (!window.google) {
            const script = document.createElement('script');
            script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places`;
            script.onload = initMap;
            document.head.appendChild(script);
        } else {
            initMap();
        }
    }, []);

    return (
        <div id="map" style={{ height: '500px', width: '100%' }}></div>
    );
};

export default GoogleMap;