import { useState, useRef, useEffect } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css';
import { SearchBox } from "@mapbox/search-js-react"
import './App.css'

type WayPoints = {
  id: string,
  name: string,
  lng: number,
  lat: number
}

function App() {
  const mapRef = useRef<Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [wayPoints, setWayPoints] = useState<WayPoints[]>([]);
  const accessToken = "pk.eyJ1IjoianlyYWhtYW4iLCJhIjoiY21oNHozb3NqMDI3ZjJycHU1N2JsazhtdiJ9.ho51ANPXxlvowesHLDv9Dg"
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  function getwayPoints(res: any) {
    const f = res.features[0];
    const name = f.properties.name || "untitled";
    const [lng, lat] = f.geometry.coordinates;

    setWayPoints(prev => [
      ...prev,
      { id: crypto.randomUUID(), name, lng, lat }
    ])
  }

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

    return () => {
      markersRef.current.forEach(m => m.remove());
      markersRef.current = [];
      mapRef.current.remove()
    }
  }, [])


  useEffect(() => {
    markersRef.current.forEach(m => m.remove())
    markersRef.current = [];


    wayPoints.forEach((wp, n) => {
      const el = document.createElement("h1")
      el.className = 'marker'
      el.textContent = "🐭"
      const marker = new mapboxgl.Marker({
        element: el
      })
        .setLngLat([wp.lng, wp.lat])
        .addTo(mapRef.current!);
      markersRef.current.push(marker);
    })

  }, [mapLoaded, wayPoints])

  useEffect(() => {
    const coords = wayPoints.map(wp => [wp.lng, wp.lat])

    async () => {
      try {
        const response = await fetch("/api/directions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            profile: "walking",
            coords
          })
        })
        const data = await response.json();
        console.log("route: ", data)
      } catch (err) {
        console.error(err)
      }

    }
  }, [wayPoints])

  return (
    <>
      <div>{JSON.stringify(wayPoints, null, 2)}</div>
      <SearchBox
        accessToken={accessToken}
        map={mapRef.current}
        mapboxgl={mapboxgl}
        value={inputValue}
        onChange={(d) => {
          setInputValue(d);
        }}
        onRetrieve={getwayPoints} // [lon,lat] 
        marker={false}
      />
      <div id='map-container' ref={mapContainerRef} />

    </>
  )
}

export default App