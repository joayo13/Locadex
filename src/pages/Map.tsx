import React, { useEffect } from 'react'
import { cleanupUserPosition, initMap, initUserPosition } from '../services/google';

function Map() {
    
    useEffect(() => {
        initMap()
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
    </>
  )
}

export default Map