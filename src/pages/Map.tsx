import React, { useEffect } from 'react'
import { initMap } from '../services/google'

function Map() {

    useEffect(() => {
     initMap()
    },[])
  return (
    <div id="map" style={{ height: 'calc(100vh - 4rem)', width: '100vw' }}></div>
  )
}

export default Map