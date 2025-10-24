import { useState, useRef, useEffect } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css';
import { SearchBox } from "@mapbox/search-js-react"
import './App.css'

function App() {
  const mapRef = useRef()
  const mapContainerRef = useRef()
  const [mapLoaded, setMapLoaded] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const accessToken = "pk.eyJ1IjoianlyYWhtYW4iLCJhIjoiY21oNHozb3NqMDI3ZjJycHU1N2JsazhtdiJ9.ho51ANPXxlvowesHLDv9Dg"

  useEffect(() => {
    mapboxgl.accessToken = accessToken
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      center: [-73.9429, 40.7247],
      style: "mapbox://styles/jyrahman/cmh50ch2t005z01qpakpj9d4e",
      zoom: 12.34
    });

    mapRef.current.on("load", () => {
      setMapLoaded(true);
    });

  }, [])

  return (
    <>
      <SearchBox
        accessToken={accessToken}
        map={mapRef.current}
        mapboxgl={mapboxgl}
        value={inputValue}
        onChange={(d) => {
          setInputValue(d);
        }}
        marker
      />
      <div id='map-container' ref={mapContainerRef} />

    </>
  )
}

export default App