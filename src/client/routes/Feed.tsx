import { useState, useRef, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";

type Waypoint = {
    id: string;
    name: string;
    lng: number;
    lat: number;
}

type Post = {
    id: string;
    title: string;
    content: string;
    route_geometry: string;
    waypoints: Waypoint[];
    weather_tags: string[];
    mood_tags: string[];
    created_at: string;
}

function Feed() {
    const [posts, setPosts] = useState<Post[]>([])
    const [currentIndex, setCurrentIndex] = useState(0)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const navigate = useNavigate();
    
    const currentPost = posts[currentIndex];
    
    // Get the last stop from current post
    const getLastStop = () => {
        if (!currentPost?.waypoints || currentPost.waypoints.length === 0) {
            return "No Route";
        }
        const lastStop = currentPost.waypoints[currentPost.waypoints.length - 1].name;
        return lastStop;
    };

    function buildMapImgUrl(geometry: string) {
        const MAPBOX_STYLE = "mapbox/streets-v12";
        const WIDTH = 600;
        const HEIGHT = 400;
        const MAPBOX_ACCESS_TOKEN = "pk.eyJ1IjoianlyYWhtYW4iLCJhIjoiY21oNHozb3NqMDI3ZjJycHU1N2JsazhtdiJ9.ho51ANPXxlvowesHLDv9Dg";
        const PATH_STYLE = 'path-7+ff6319-1'
        const encodedGeometry = encodeURIComponent(geometry);
        const overlay = `${PATH_STYLE}(${encodedGeometry})`
        const viewport = 'auto';

        return `https://api.mapbox.com/styles/v1/${MAPBOX_STYLE}/static/${overlay}/${viewport}/${WIDTH}x${HEIGHT}?access_token=${MAPBOX_ACCESS_TOKEN}`;
    }

    function handleExit() {
        navigate('/')
    }
    
    function handlePrevious() {
        setCurrentIndex((prev) => (prev > 0 ? prev - 1 : posts.length - 1))
    }
    
    function handleNext() {
        setCurrentIndex((prev) => (prev < posts.length - 1 ? prev + 1 : 0))
    }

    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true)
            setError(null)

            try {
                const { data, error: fetchError } = await supabase
                    .from("post")
                    .select("id, title, content, route_geometry, waypoints, weather_tags, mood_tags, created_at")
                    .order("created_at", { ascending: false })

                if (fetchError) {
                    throw fetchError;
                }

                setPosts(data || [])
            } catch (err) {
                console.error(err)
                setError("Unable to load posts. Please check your connection.")
            } finally {
                setLoading(false)
            }
        }
        fetchPosts();
    }, [])


    return (
        <>
            <div className="tile-bg h-[8%]">
                <div className="ml-5 w-full max-w-[40rem] h-[4rem] bg-black text-white flex font-['ArchivoNarrow'] items-center">
                    <button onClick={handleExit} className="font-extrabold text-5xl pl-2 pr-2">←</button>
                    <button onClick={handleExit} className="bg-red-700 h-full flex items-center justify-center text-5xl p-2">Exit</button>
                    {!loading && currentPost && (
                        <div className="text-xl flex pl-2 truncate">{getLastStop()}</div>
                    )}
                </div>
            </div>

            <div className="light-green-tile-bg h-[2%]"></div>
            <div className="dark-green-tile-bg h-[6%] "></div>
            <div className="light-green-tile-bg h-[2%]"></div>
            <div className="tile-bg h-[82%] flex items-center justify-center overflow-hidden relative pt-8">
                {loading ? (
                    /* LOADING STATE */
                    <div className="flex flex-col items-center justify-center gap-6">
                        <div className="text-6xl animate-bounce">🚇</div>
                        <div className="mta-flyer flex flex-col items-center bg-[#faf8f3] w-[90vw] max-w-[450px] border-4 border-black p-8">
                            <div className="bg-[#0039A6] text-white px-4 py-2.5 border-2 border-black mb-4 w-full text-center">
                                <div className="text-sm font-sans font-bold tracking-widest">
                                    NYC TRANSIT AUTHORITY
                                </div>
                            </div>
                            <div className="text-xl font-sans font-bold text-center mb-4">
                                TRAIN APPROACHING...
                            </div>
                            <div className="flex gap-2 mb-4">
                                <div className="w-3 h-3 bg-[#ff6319] rounded-full animate-pulse"></div>
                                <div className="w-3 h-3 bg-[#ff6319] rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                                <div className="w-3 h-3 bg-[#ff6319] rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                            </div>
                            <div className="text-sm font-sans text-gray-600 text-center">
                                Loading your memories...
                            </div>
                        </div>
                    </div>
                ) : error ? (
                    /* ERROR STATE */
                    <div className="flex flex-col items-center justify-center gap-6">
                        <div className="text-6xl">⚠️</div>
                        <div className="mta-flyer flex flex-col bg-[#faf8f3] w-[90vw] max-w-[450px] border-4 border-black overflow-hidden">
                            <div className="bg-[#c92a2a] text-white px-4 py-2.5 border-b-4 border-black">
                                <div className="text-sm font-sans font-bold tracking-widest">
                                    NYC TRANSIT AUTHORITY
                                </div>
                                <div className="text-xs font-sans tracking-wider">
                                    SERVICE DISRUPTION
                                </div>
                            </div>
                            <div className="px-6 py-8">
                                <div className="text-2xl font-sans font-black uppercase leading-tight mb-4 text-center">
                                    SERVICE TEMPORARILY UNAVAILABLE
                                </div>
                                <p className="text-base font-sans leading-relaxed text-center mb-6">
                                    {error}
                                </p>
                                <button 
                                    onClick={() => window.location.reload()}
                                    className="w-full bg-[#0039A6] text-white py-3 px-6 font-sans font-bold tracking-wider border-2 border-black hover:bg-[#0047c4] transition-colors"
                                >
                                    TRY AGAIN
                                </button>
                            </div>
                            <div className="px-4 py-2 bg-[#e8e6df] border-t-2 border-gray-400">
                                <div className="text-[0.65rem] font-sans text-gray-600 text-center tracking-wider">
                                    For assistance visit mta.info or call 511
                                </div>
                            </div>
                        </div>
                    </div>
                ) : posts.length === 0 ? (
                    /* EMPTY STATE */
                    <div className="flex flex-col items-center justify-center gap-6">
                        <div className="text-6xl">🗺️</div>
                        <div className="mta-flyer flex flex-col bg-[#faf8f3] w-[90vw] max-w-[450px] border-4 border-black overflow-hidden">
                            <div className="bg-[#0039A6] text-white px-4 py-2.5 border-b-4 border-black">
                                <div className="text-sm font-sans font-bold tracking-widest">
                                    NYC TRANSIT AUTHORITY
                                </div>
                                <div className="text-xs font-sans tracking-wider">
                                    SERVICE NOTICE
                                </div>
                            </div>
                            <div className="px-6 py-8">
                                <div className="text-2xl font-sans font-black uppercase leading-tight mb-4 text-center">
                                    NO ROUTES SAVED
                                </div>
                                <p className="text-base font-sans leading-relaxed text-center mb-6">
                                    Start creating memories by mapping out your perfect NYC day.
                                </p>
                                <button 
                                    onClick={() => navigate('/')}
                                    className="w-full bg-[#ff6319] text-white py-3 px-6 font-sans font-bold tracking-wider border-2 border-black hover:bg-[#ff7a3d] transition-colors"
                                >
                                    CREATE YOUR FIRST ROUTE
                                </button>
                            </div>
                            <div className="px-4 py-2 bg-[#e8e6df] border-t-2 border-gray-400">
                                <div className="text-[0.65rem] font-sans text-gray-600 text-center tracking-wider">
                                    Your journey starts here 🚇
                                </div>
                            </div>
                        </div>
                    </div>
                ) : currentPost ? (
                    <>
                        {/* PREVIOUS ARROW */}
                        {posts.length > 1 && (
                            <button
                                onClick={handlePrevious}
                                className="turnstile-arrow absolute left-4 z-10"
                            >
                                ←
                            </button>
                        )}

                        {/* POST FLYER */}
                        <div className="flex flex-col items-center">
                            {/* Tape Counter */}
                            {posts.length > 1 && (
                                <div className="tape-label">
                                    Post {currentIndex + 1} of {posts.length}
                                </div>
                            )}
                            
                            <div className="mta-flyer flex flex-col bg-[#faf8f3] w-[90vw] max-w-[450px] h-[85vh] max-h-[700px] border-4 border-black overflow-y-auto">
                                {/* MTA HEADER */}
                                <div className="bg-[#0039A6] text-white px-4 py-2.5 border-b-4 border-black">
                                    <div className="text-sm font-sans font-bold tracking-widest mb-0.5">
                                        NYC TRANSIT AUTHORITY
                                    </div>
                                    <div className="text-xs font-sans tracking-wider">
                                        SERVICE MEMORY NOTICE
                                    </div>
                                </div>

                                {/* TITLE SECTION */}
                                <div className="px-4 py-3 border-b-2 border-black bg-[#ffd54f]">
                                    <div className="text-3xl font-sans font-black uppercase leading-tight">
                                        {currentPost.title}
                                    </div>
                                </div>

                               

                                {/* ROUTE MAP */}
                                {currentPost.route_geometry && (
                                    <div className="px-4 py-3 bg-[#faf8f3] border-b-2 border-gray-400">
                                        <div className="text-[0.7rem] font-sans font-black tracking-widest mb-1.5 text-gray-700">
                                            ROUTE INFORMATION
                                        </div>
                                        <div className="border-2 border-black">
                                            <img
                                                src={buildMapImgUrl(currentPost.route_geometry)}
                                                className="w-full h-auto"
                                                alt="Route map"
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* ROUTE STATIONS */}
                                {currentPost.waypoints && currentPost.waypoints.length > 0 && (
                                    <div className="px-4 py-3 bg-[#faf8f3] border-b-2 border-gray-400">
                                        <div className="text-[0.7rem] font-sans font-black tracking-widest mb-2 text-gray-700">
                                            ROUTE STATIONS
                                        </div>
                                        <div className="bg-white border-2 border-black p-3">
                                            {currentPost.waypoints.map((waypoint: any, index: number) => (
                                                <div key={waypoint.id} className="flex items-center gap-3 mb-2 last:mb-0">
                                                    {/* Vertical line and dot */}
                                                    <div className="flex flex-col items-center">
                                                        {index > 0 && (
                                                            <div className="w-1 h-3 bg-[#ff6319]"></div>
                                                        )}
                                                        <div className="w-3 h-3 rounded-full bg-[#ff6319] border-2 border-black flex-shrink-0"></div>
                                                        {index < currentPost.waypoints.length - 1 && (
                                                            <div className="w-1 h-3 bg-[#ff6319]"></div>
                                                        )}
                                                    </div>
                                                    {/* Station name */}
                                                    <div className="text-sm font-sans font-bold flex-1">
                                                        {waypoint.name}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

 {/* TAGS AS SERVICE CONDITIONS */}
 {(currentPost.weather_tags?.length > 0 || currentPost.mood_tags?.length > 0) && (
                                    <div className="px-4 py-3 border-b-2 border-gray-400 bg-[#f5f2ea]">
                                        {currentPost.weather_tags?.length > 0 && (
                                            <div className="mb-2">
                                                <div className="text-[0.7rem] font-sans font-black tracking-widest mb-1.5 text-gray-700">
                                                    CONDITIONS
                                                </div>
                                                <div className="flex flex-wrap gap-1.5">
                                                    {currentPost.weather_tags.map((tag: string) => (
                                                        <span 
                                                            key={tag}
                                                            className="px-2 py-1 text-xs font-sans font-bold tracking-wider bg-white border-2 border-black uppercase"
                                                        >
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        {currentPost.mood_tags?.length > 0 && (
                                            <div>
                                                <div className="text-[0.7rem] font-sans font-black tracking-widest mb-1.5 text-gray-700">
                                                    EXPERIENCE
                                                </div>
                                                <div className="flex flex-wrap gap-1.5">
                                                    {currentPost.mood_tags.map((tag: string) => (
                                                        <span 
                                                            key={tag}
                                                            className="px-2 py-1 text-xs font-sans font-bold tracking-wider bg-white border-2 border-black uppercase"
                                                        >
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* DETAILS */}
                                <div className="px-4 py-3 bg-[#faf8f3]">
                                    <div className="text-[0.7rem] font-sans font-black tracking-widest mb-1.5 text-gray-700">
                                        DETAILS
                                    </div>
                                    <p className="text-base font-sans leading-relaxed">
                                        {currentPost.content}
                                    </p>
                                </div>

                                {/* FOOTER */}
                                <div className="px-4 py-2 bg-[#e8e6df] border-t-2 border-gray-400">
                                    <div className="text-[0.65rem] font-sans text-gray-600 text-center tracking-wider">
                                        For more information visit mta.info or call 511
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* NEXT ARROW */}
                        {posts.length > 1 && (
                            <button
                                onClick={handleNext}
                                className="turnstile-arrow absolute right-4 z-10"
                            >
                                →
                            </button>
                        )}
                    </>
                ) : null}
            </div>

        </>
    )
}

export default Feed;


