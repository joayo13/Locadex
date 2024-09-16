import React, { useEffect, useState } from 'react'
import { cleanupUserPosition, initMap, initUserPosition } from '../services/google';
import LoadingScreen from './LoadingScreen';

function Map() {
    const [mapLoaded, setMapLoaded] = useState(false)
    useEffect(() => {
        initMap(setMapLoaded)
        initUserPosition()
        return() => {
          // we must remove user position marker before initing the next, else our map will not load at all
            cleanupUserPosition()
        }
    }, []);
    
  return (
    <>
    {/* the -4rem is to account for navbar */}
    
    {<div id="map" style={{ height: 'calc(100vh - 4rem)', width: '100vw' }}></div>}
    {!mapLoaded ? <LoadingScreen/> : null}
    </>
  )
}

export default Map