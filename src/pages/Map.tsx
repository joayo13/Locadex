import { useEffect, useRef } from 'react';
import {
    addMarker,
    cleanupUserPosition,
    initMap,
    initUserPosition,
} from '../services/google';
import { useError } from '../contexts/ErrorContext';

function Map() {
    const place = useRef<google.maps.places.PlaceResult | null>(null);
    const { setError } = useError();
    const setErrorRef = useRef(setError);
    useEffect(() => {
        async function initializeMapAndMarkers() {
            try {
                await initMap();
                initUserPosition();
                loadSavedPlace();
                addMarker(place.current?.geometry?.location ?? null);
            } catch (error) {
                console.error('Error initializing map and markers:', error);
                if (
                    error instanceof Error ||
                    error instanceof GeolocationPositionError
                ) {
                    setErrorRef.current(error.message);
                }
            }
        }

        initializeMapAndMarkers();

        return () => {
            // Cleanup: remove user position marker before initializing the next one to avoid loading issues
            cleanupUserPosition();
        };
    }, []);

    function loadSavedPlace() {
        // In case we already have a location set in local storage. We want to avoid using apis/ firebase as much as possible.
        let savedPlace: google.maps.places.PlaceResult | null = null;

        const placeFromStorage = localStorage.getItem('place');

        if (placeFromStorage) {
            savedPlace = JSON.parse(
                placeFromStorage
            ) as google.maps.places.PlaceResult | null;
            if (savedPlace) {
                place.current = savedPlace;
                return;
            }
        }
    }

    return (
        <>
            {/* the -4rem is to account for navbar */}

            <div
                id="map"
                style={{ height: 'calc(100vh - 4rem)', width: '100vw' }}
            ></div>
        </>
    );
}

export default Map;
