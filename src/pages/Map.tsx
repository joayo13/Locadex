import React, { useEffect } from 'react'
import { cleanupUserPosition, initMap, initUserPosition } from '../services/google';

function Map() {
    
    useEffect(() => {
        initMap()
        initUserPosition()
        return() => {
            cleanupUserPosition()
        }
    }, []);
    
  return (
    <>
    {<div id="map" style={{ height: 'calc(100vh - 4rem)', width: '100vw' }}></div>}
    </>
  )
}

export default Map