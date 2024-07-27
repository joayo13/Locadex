
    const initMap = (lat: number, lng: number) => {
        const center = new google.maps.LatLng(lat, lng);

        const map = new google.maps.Map(document.getElementById('map') as HTMLElement, {
            center: center,
            zoom: 15,
            mapId: '88c0dfbb3ce2d741',
        });

        const service = new google.maps.places.PlacesService(map);

        const request: google.maps.places.PlaceSearchRequest = {
            location: center,
            radius: 1000,
            type: 'tourist_attraction',
            language: 'en-US',
        };

        service.nearbySearch(request, (results, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK && results && results.length > 0) {
                const place = results[0]; // Get the first result, todo: we'll check if user has already captured this result before
                console.log(place);

                // Create a marker for the place
                new google.maps.marker.AdvancedMarkerElement({
                    position: place.geometry?.location!,
                    map: map,
                    title: place.name,
                });
            } else {
                console.log('No places found');
            }
        });
    };

    export default initMap