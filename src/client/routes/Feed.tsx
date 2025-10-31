import { useState, useRef, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";

function Feed() {
    const [post, setPost] = useState({})
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const navigate = useNavigate();

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

    useEffect(() => {
        const fetchPosts = async () => {

            try {
                const { data, error } = await supabase
                    .from("post")
                    .select("title, content, route_geometry, weather_tags, mood_tags")
                    .order("created_at", { ascending: false })
                    .limit(1)
                    .single()

                setPost(data)
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
            <div className="tile-bg h-[76%] flex items-center justify-center overflow-hidden">
                {
                    post ? (
                        <div className="flex justify-center items-center w-full h-full p-5">
                            {/* MTA ANNOUNCEMENT FLYER */}
                            <div className="flex flex-col bg-white max-w-lg w-full border-4 border-black max-h-full overflow-y-auto">

                                {/* MTA HEADER */}
                                <div className="bg-[#0039A6] text-white px-4 py-2.5 border-b-4 border-black">
                                    <div className="text-sm font-['ArchivoNarrow'] font-bold tracking-widest mb-0.5">
                                        NYC TRANSIT AUTHORITY
                                    </div>
                                    <div className="text-xs font-['ArchivoNarrow'] tracking-wider">
                                        SERVICE MEMORY NOTICE
                                    </div>
                                </div>

                                {/* TITLE SECTION */}
                                <div className="px-4 py-3 border-b-2 border-black bg-yellow-300">
                                    <div className="text-3xl font-['ArchivoNarrow'] font-black uppercase leading-tight">
                                        {post.title}
                                    </div>
                                </div>

                                {/* TAGS AS SERVICE CONDITIONS */}
                                {(post.weather_tags?.length > 0 || post.mood_tags?.length > 0) && (
                                    <div className="px-4 py-3 border-b-2 border-gray-300 bg-gray-50">
                                        {post.weather_tags?.length > 0 && (
                                            <div className="mb-2">
                                                <div className="text-[0.7rem] font-['ArchivoNarrow'] font-black tracking-widest mb-1.5 text-gray-700">
                                                    CONDITIONS
                                                </div>
                                                <div className="flex flex-wrap gap-1.5">
                                                    {post.weather_tags.map((tag: string) => (
                                                        <span 
                                                            key={tag}
                                                            className="px-2 py-1 text-xs font-['ArchivoNarrow'] font-bold tracking-wider bg-white border-2 border-black uppercase"
                                                        >
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        {post.mood_tags?.length > 0 && (
                                            <div>
                                                <div className="text-[0.7rem] font-['ArchivoNarrow'] font-black tracking-widest mb-1.5 text-gray-700">
                                                    EXPERIENCE
                                                </div>
                                                <div className="flex flex-wrap gap-1.5">
                                                    {post.mood_tags.map((tag: string) => (
                                                        <span 
                                                            key={tag}
                                                            className="px-2 py-1 text-xs font-['ArchivoNarrow'] font-bold tracking-wider bg-white border-2 border-black uppercase"
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
                                {post.route_geometry && (
                                    <div className="px-4 py-3 bg-white border-b-2 border-gray-300">
                                        <div className="text-[0.7rem] font-['ArchivoNarrow'] font-black tracking-widest mb-1.5 text-gray-700">
                                            ROUTE INFORMATION
                                        </div>
                                        <div className="border-2 border-black">
                                            <img
                                                src={buildMapImgUrl(post.route_geometry)}
                                                className="w-full h-auto"
                                                alt="Route map"
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* DETAILS */}
                                <div className="px-4 py-3 bg-white">
                                    <div className="text-[0.7rem] font-['ArchivoNarrow'] font-black tracking-widest mb-1.5 text-gray-700">
                                        DETAILS
                                    </div>
                                    <p className="text-base font-['ArchivoNarrow'] leading-relaxed">
                                        {post.content}
                                    </p>
                                </div>

                                {/* FOOTER */}
                                <div className="px-4 py-2 bg-gray-100 border-t-2 border-gray-300">
                                    <div className="text-[0.65rem] font-['ArchivoNarrow'] text-gray-600 text-center tracking-wider">
                                        For more information visit mta.info or call 511
                                    </div>
                                </div>

                            </div>
                        </div>
                    ) : (
                        <p>No post found.</p>
                    )
                }
            </div>

        </>
    )
}

export default Feed;
