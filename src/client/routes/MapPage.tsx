import { useState, useRef, useEffect } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css';
import { SearchBox } from "@mapbox/search-js-react"
import { useNavigate } from 'react-router-dom';

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
                        profile: "walking",
                        coords
                    })
                })
                const json = await response.json();
                const data = json.routes[0];
                const route = data.geometry;
                const geojson = {
                    'type': 'Feature',
                    'properties': {},
                    'geometry': data.geometry
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
            <div className='h-[100vh] relative '>
                <div className='mt-2 ml-10 mr-10 mb-2 font-["CutiveMono"]'>
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
                        className='absolute bottom-20 z-10 bg-black text-white left-[45%] p-3 ring-3'
                        onClick={handleSaveRoute}>save your day</button>
                }
            </div>

        </>
    )
}

export default MapPage;
