import { useState, useRef, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

function Feed() {
    const [post, setPost] = useState({})
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    useEffect(() => {
        const fetchPosts = async () => {

            try {
                const { data, error } = await supabase
                    .from("post")
                    .select("title, content")
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
                    <div className="font-extrabold text-5xl pl-2 pr-2">←</div>
                    <div className="bg-red-700 h-full flex items-center justify-center text-5xl p-2">Exit</div>
                    <div className=" text-xl flex pl-2">Canal St & Broadway</div>

                </div>
            </div>

            <div className="light-green-tile-bg h-[3%]"></div>
            <div className="dark-green-tile-bg h-[8%] "></div>
            <div className="light-green-tile-bg h-[3%]"></div>
            <div className="tile-bg h-[76%] flex items-center justify-center">
                <div className="w-[50%] h-[80%] bg-white border-8 flex flex-col font-['ArchivoNarrow'] items-center">
                    {post ? (
                        <div className="flex flex-col gap-5 m-5">
                            <div className="text-5xl">{post.title}</div>
                            <div>MAP!</div>
                            <p className="text-2xl">{post.content}</p>
                        </div>
                    ) : (
                        <p>No post found.</p>
                    )}
                </div>
            </div>
        </>
    )
}

export default Feed;
