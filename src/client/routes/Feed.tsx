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
                    .select("title, content, route_geometry")
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
            <div className="tile-bg h-[76%] flex items-center justify-center">
                {
                    post ? (
                        // This outer div centers the "flyer" on your gray tile background.
                        <div className="flex justify-center items-center w-full p-5">

                            {/* THE FLYER
              - max-w-lg to keep the "longer" paper feel.
            */}
                            <div className="flex flex-col bg-white shadow-lg max-w-lg w-full border border-gray-300">

                                {/* BLACK HEADER BAR */}
                                <div className="bg-black text-white p-4">
                                    <div className="text-3xl font-sans font-bold uppercase tracking-wide">
                                        {post.title}
                                    </div>
                                </div>

                                {/* --- NEW MOOD & WEATHER SECTION (MTA Style) --- */}
                                <div className="p-4 border-b border-gray-300">

                                    {/* Emojis as "Service Bullets" */}
                                    <div className="flex flex-row gap-3 mb-2">
                                        <div className="text-3xl">{post.weather_emoji}</div>
                                        <div className="text-3xl">{post.mood_emoji}</div>
                                    </div>

                                    {/* The "Alert" Text */}
                                    <div className="text-2xl font-sans font-bold uppercase text-red-600">
                                        {post.weather_text} // {post.mood_text}
                                    </div>

                                </div>
                                {/* --- END NEW SECTION --- */}


                                {/* MAP IMAGE */}
                                {post.route_geometry && (
                                    <div className="p-4">
                                        <img
                                            src={buildMapImgUrl(post.route_geometry)}
                                            className="w-full h-auto border border-gray-200"
                                            alt="Route map"
                                        />
                                    </div>
                                )}

                                {/* CONTENT TEXT */}
                                <div className="px-4 pb-4">
                                    <p className="text-lg font-sans">{post.content}</p>
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
