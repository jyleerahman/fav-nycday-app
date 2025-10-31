import { useState, useRef, useEffect } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css';
import { SearchBox } from "@mapbox/search-js-react"
import { useNavigate } from 'react-router-dom';
import { useRouteStore } from "../store.js";
import polyline from "@mapbox/polyline";
import { useAppStore } from '../store.js';

type WayPoints = {
    id: string,
    name: string,
    lng: number,
    lat: number
}

function MapPage() {
    const mapRef = useRef<Map | null>(null);
    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const [mapLoaded, setMapLoaded] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [wayPoints, setWayPoints] = useState<WayPoints[]>([]);
    const accessToken = "pk.eyJ1IjoianlyYWhtYW4iLCJhIjoiY21oNHozb3NqMDI3ZjJycHU1N2JsazhtdiJ9.ho51ANPXxlvowesHLDv9Dg"
    const markersRef = useRef<mapboxgl.Marker[]>([]);
    const navigate = useNavigate();
    // get the setter
    const setCurrentRoute = useAppStore((state) => state.setCurrentRoute);

    const theme = {
        variables: {
            fontFamily: 'CutiveMono',
            unit: '16x',
            padding: '0.7rem',
            borderRadius: '20px',
        }
    };

    function getwayPoints(res: any) {
        const f = res.features[0];
        const name = f.properties.name || "untitled";
        const [lng, lat] = f.geometry.coordinates;

        setWayPoints(prev => [
            ...prev,
            { id: crypto.randomUUID(), name, lng, lat }
        ])

        setInputValue("")
    }

    function handleSaveRoute() {
        navigate("/create-post")
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

        const getRoute = async () => {
            try {
                const response = await fetch("/api/directions", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        profile: "cycling",
                        coords
                    })
                })
                const json = await response.json();
                const data = json.routes[0];
                const route = data.geometry;
                const encodedPolyline = polyline.fromGeoJSON(route);
                //set it in the store
                setCurrentRoute(encodedPolyline);
                const geojson = {
                    'type': 'Feature',
                    'properties': {},
                    'geometry': route
                };

                if (mapRef.current.getSource('route')) {
                    // if the route already exists on the mapRef.current, reset it using setData
                    mapRef.current.getSource('route').setData(geojson);
                }

                else {
                    mapRef.current.addLayer({
                        id: 'route',
                        type: 'line',
                        source: {
                            type: 'geojson',
                            data: geojson
                        },
                        layout: {
                            'line-join': 'round',
                            'line-cap': 'round'
                        },
                        paint: {
                            'line-color': '#ff6319',
                            'line-width': 7,
                            'line-opacity': 1
                        }
                    })
                }


            } catch (err) {
                console.error(err)
            }
        }

        if (wayPoints.length >= 2) {
            getRoute();
        }
    }, [wayPoints])

    return (
        <>
            {/* <div>{JSON.stringify(wayPoints, null, 2)}</div> */}
            <div className='h-[100vh] w-full p-12 tile-bg subway-map-container'>
                <div className='h-full w-full relative overflow-hidden subway-map-frame'>
                    <div className='absolute top-4 left-10 right-10 z-20 font-["CutiveMono"]'>
                        <SearchBox
                            accessToken={accessToken}
                            map={mapRef.current}
                            mapboxgl={mapboxgl}
                            value={inputValue}
                            theme={theme}
                            onChange={(d) => {
                                setInputValue(d);
                            }}

                            onRetrieve={getwayPoints} // [lon,lat] 
                            marker={false}
                        />
                    </div>

                    <div id='map-container' ref={mapContainerRef} />
                    {(wayPoints.length >= 2) &&
                        <button
                            className='metrocard-button absolute bottom-12 z-[999] left-1/2 -translate-x-1/2'
                            onClick={handleSaveRoute}>
                            <span className="shine"></span>
                            <span></span>
                            <span className="button-text">Insert this way / This side facing you ➤➤➤</span>
                        </button>
                    }
                </div>
                
                {/* Pizza Rat */}
                <div className='pizza-rat' title="Pizza Rat! 🍕">🍕    🐀</div>
            </div>

        </>
    )
}

export default MapPage;
