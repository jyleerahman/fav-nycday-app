import { useState, useRef, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";

function Feed() {
    const [posts, setPosts] = useState([])
    const [currentIndex, setCurrentIndex] = useState(0)
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const navigate = useNavigate();
    
    const currentPost = posts[currentIndex];

    function buildMapImgUrl(geometry) {
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

            try {
                const { data, error } = await supabase
                    .from("post")
                    .select("id, title, content, route_geometry, waypoints, weather_tags, mood_tags, created_at")
                    .order("created_at", { ascending: false })

                setPosts(data || [])
            } catch (err) {
                console.error(err)
            }
        }
        fetchPosts();
    }, [])


    return (
        <>
            <div className="tile-bg h-[10%]">
                <div className="ml-5 w-[20rem] h-[4rem] bg-black text-white flex font-['ArchivoNarrow'] items-center">
                    <button onClick={handleExit} className="font-extrabold text-5xl pl-2 pr-2">←</button>
                    <button onClick={handleExit} className="bg-red-700 h-full flex items-center justify-center text-5xl p-2">Exit</button>
                    <div className="text-xl flex pl-2">Canal St & Broadway</div>

                </div>
            </div>

            <div className="light-green-tile-bg h-[3%]"></div>
            <div className="dark-green-tile-bg h-[8%] "></div>
            <div className="light-green-tile-bg h-[3%]"></div>
            <div className="tile-bg h-[76%] flex items-center justify-center overflow-hidden relative pt-8">
                {currentPost ? (
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
                            
                            <div className="mta-flyer flex flex-col bg-[#faf8f3] w-[400px] h-[600px] border-4 border-black overflow-y-auto">
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
                ) : (
                    <p className="text-center text-gray-600 font-sans text-lg">No posts found.</p>
                )}
            </div>

        </>
    )
}

export default Feed;


