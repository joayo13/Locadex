import { useEffect, useRef } from 'react';
import {
    cleanupUserPosition,
    initMap,
    initUserPosition,
} from '../services/google';
import { useError } from '../contexts/ErrorContext';

function Map() {
    const { setError } = useError();
    const setErrorRef = useRef(setError);
    useEffect(() => {
        async function initializeMapAndMarkers() {
            try {
                await initMap();
                initUserPosition();
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
