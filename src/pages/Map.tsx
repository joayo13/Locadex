import { useEffect, useRef } from 'react'
import { addMarker, cleanupUserPosition, initMap, initUserPosition } from '../services/google';

function Map() {
  const place = useRef<google.maps.places.PlaceResult | null>(null);
    useEffect(() => {
      async function initializeMapAndMarkers() {
        await initMap()
        initUserPosition()
        loadSavedPlace()
        addMarker(place.current?.geometry?.location ?? null)
      }
        initializeMapAndMarkers()
        return() => {
          // we must remove user position marker before initing the next, else our map will not load at all
            cleanupUserPosition()
        }
    }, []);
    
    function loadSavedPlace() {
      // In case we already have a location set in local storage. We want to avoid using apis/ firebase as much as possible.
      let savedPlace: google.maps.places.PlaceResult | null = null;
      
      const placeFromStorage = localStorage.getItem('place');
      
      if (placeFromStorage) {
          
          savedPlace = JSON.parse(placeFromStorage) as google.maps.places.PlaceResult | null;
          if (savedPlace) {
              place.current = savedPlace
              return;
          }
      }
  }
    
  return (
    <>
    {/* the -4rem is to account for navbar */}
    
    {<div id="map" style={{ height: 'calc(100vh - 4rem)', width: '100vw' }}></div>}
    </>
  )
}

export default Map