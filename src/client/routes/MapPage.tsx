import { useState, useRef, useEffect } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css';
import { SearchBox } from "@mapbox/search-js-react"
import { useNavigate } from 'react-router-dom';
import polyline from "@mapbox/polyline";
import { useAppStore } from '../store.js';

type WayPoints = {
    id: string,
    name: string,
    lng: number,
    lat: number
}

function MapPage() {
    const mapRef = useRef<mapboxgl.Map | null>(null);
    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const [mapLoaded, setMapLoaded] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [wayPoints, setWayPoints] = useState<WayPoints[]>([]);
    const accessToken = "pk.eyJ1IjoianlyYWhtYW4iLCJhIjoiY21oNHozb3NqMDI3ZjJycHU1N2JsazhtdiJ9.ho51ANPXxlvowesHLDv9Dg"
    const markersRef = useRef<mapboxgl.Marker[]>([]);
    const navigate = useNavigate();
    // get the setters
    const setCurrentRoute = useAppStore((state: any) => state.setCurrentRoute);
    const setCurrentWaypoints = useAppStore((state: any) => state.setCurrentWaypoints);

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
        // Save waypoints to global store before navigating
        setCurrentWaypoints(wayPoints);
        navigate("/create-post")
    }

    function handleDeleteWaypoint(id: string) {
        setWayPoints(prev => prev.filter(wp => wp.id !== id));
    }

    useEffect(() => {
        mapboxgl.accessToken = accessToken
        mapRef.current = new mapboxgl.Map({
            container: mapContainerRef.current!,
            center: [-73.9429, 40.7247],
            style: "mapbox://styles/jyrahman/cmh50ch2t005z01qpakpj9d4e",
            zoom: 12.34
        });

        mapRef.current.on("load", () => {
            setMapLoaded(true);
        });

        // Add click handler to add waypoints by clicking on map
        mapRef.current.on('click', async (e) => {
            const { lng, lat } = e.lngLat;
            
            // Reverse geocode to get place name
            try {
                const response = await fetch(
                    `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${accessToken}`
                );
                const data = await response.json();
                
                // Get the place name (prefer place, poi, address, or use coordinates)
                let name = "Custom Location";
                if (data.features && data.features.length > 0) {
                    const feature = data.features[0];
                    name = feature.text || feature.place_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
                }
                
                // Add waypoint
                setWayPoints(prev => [
                    ...prev,
                    { id: crypto.randomUUID(), name, lng, lat }
                ]);
            } catch (error) {
                console.error("Geocoding error:", error);
                // If geocoding fails, still add the point with coordinates as name
                setWayPoints(prev => [
                    ...prev,
                    { id: crypto.randomUUID(), name: `${lat.toFixed(4)}, ${lng.toFixed(4)}`, lng, lat }
                ]);
            }
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

                    {/* Waypoints List - Transit Ticket Style */}
                    {wayPoints.length > 0 && (
                        <div className='absolute top-24 right-10 z-20 shadow-natural max-w-[280px] max-h-[60vh] overflow-y-auto'>
                            <div className='perforated-x bg-white p-3'>
                                <div className='border-2 border-[#0039A6] bg-white'>
                                    {/* Header */}
                                    <div className='bg-[#0039A6] px-3 py-2 border-b-2 border-[#0039A6]'>
                                        <div className='font-["KGAllofMe"] text-white text-sm tracking-wide flex items-center justify-between'>
                                            <span>ROUTE STOPS</span>
                                            <span className='bg-[#ff6319] text-white px-2 py-0.5 text-xs rounded-sm'>{wayPoints.length}</span>
                                        </div>
                                    </div>
                                    
                                    {/* Waypoints */}
                                    <div className='bg-[#f7f4ed]'>
                                        {wayPoints.map((wp, index) => (
                                            <div key={wp.id} className='border-b border-[#0039A6] last:border-b-0'>
                                                <div className='flex items-center gap-2 p-2.5 hover:bg-white transition-colors'>
                                                    {/* Stop Number Circle */}
                                                    <div className='flex-shrink-0 w-6 h-6 rounded-full bg-[#ff6319] flex items-center justify-center border-2 border-[#0039A6]'>
                                                        <span className='text-white text-[0.65rem] font-bold font-["ArchivoNarrow"]'>{index + 1}</span>
                                                    </div>
                                                    
                                                    {/* Location Name */}
                                                    <span className='flex-1 text-[0.7rem] text-[#0039A6] font-["CutiveMono"] break-words leading-tight'>
                                                        {wp.name}
                                                    </span>
                                                    
                                                    {/* Delete Button */}
                                                    <button
                                                        onClick={() => handleDeleteWaypoint(wp.id)}
                                                        className='flex-shrink-0 w-6 h-6 bg-[#D14124] hover:bg-[#a02f18] text-white rounded-sm transition-colors flex items-center justify-center text-xs font-bold border border-[#0039A6]'
                                                        title='Remove stop'
                                                    >
                                                        ✕
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    
                                    {/* Footer */}
                                    <div className='bg-white px-3 py-1.5 border-t-2 border-[#0039A6]'>
                                        <div className='text-[0.6rem] text-[#666] italic font-["ArchivoNarrow"] text-center'>
                                            Click ✕ to remove stops
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

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
