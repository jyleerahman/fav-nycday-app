import { useRef, useEffect } from 'react'
import mapboxgl from 'mapbox-gl'

import 'mapbox-gl/dist/mapbox-gl.css';

import './App.css'

function App() {

  const mapRef = useRef()
  const mapContainerRef = useRef()

  useEffect(() => {
    mapboxgl.accessToken = 'pk.eyJ1IjoianlyYWhtYW4iLCJhIjoiY21oNHozb3NqMDI3ZjJycHU1N2JsazhtdiJ9.ho51ANPXxlvowesHLDv9Dg'
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      center: [-73.9429, 40.7247],
      zoom: 12.34
    });

    return () => {
      mapRef.current.remove()
    }
  }, [])

  return (
    <>
      <div id='map-container' ref={mapContainerRef} />
    </>
  )
}

export default App