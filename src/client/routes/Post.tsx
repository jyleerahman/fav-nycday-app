import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createClient } from "@supabase/supabase-js";

function Post() {
    const [title, setTitle] = useState("")
    const [content, setContent] = useState("")
    const navigate = useNavigate()
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    function handleTitleChange(e) {
        setTitle(e.target.value)
    }

    function handleContentChange(e) {
        setContent(e.target.value)
    }

    const handleSavePost = async (e) => {
        // send data to supabase
        const newPost = {
            title: title,
            content: content
        }

        try {
            const { data, error } = await supabase
                .from("post")
                .insert([newPost])
            setTitle("")
            setContent("")
        } catch (err) {
            console.error(err)
        }

        navigate("/feed")
    }

    return (
        <>

            <div className='h-[100vh] flex flex-col font-["ArchivoNarrow"] items-center justify-center bg-[#fcf8f5]'>
                <div className='shadow-natural mt-10 m-10 w-[350px] h-[95%]'>
                    <div className='perforated-x h-full pl-3 pr-3 pt-10 pb-10 bg-[#d1d3e5]'>
                        <div className='border-2 h-full'>
                            <div className='border-b-1 h-[5%] flex'>
                                <div className='font-extrabold font-["KGAllofMe"] text-[1.2rem] flex items-center justify-center w-full'>SPECIAL DAY</div>
                            </div>
                            <div className='flex border-b-1 h-[25%]'>
                                <div className='border-r-1 flex items-center justify-center p-2 [writing-mode:vertical-rl] tracking-widest'>
                                    93493
                                </div>
                                <div className='flex flex-col w-full'>
                                    <div className='px-2 border-b-1 h-[25%] flex items-center'>
                                        Issued by Your Perfect New York City Day
                                    </div>
                                    <div className='px-2 border-b-1 h-[50%] flex items-center text-4xl font-extrabold font-["KGAllofMe"]'>
                                        OCT 28. 2025
                                    </div>
                                    <input
                                        value={title}
                                        onChange={handleTitleChange}
                                        placeholder='Sunny Williamsburg day'
                                        className='px-2 h-[25%] font-["KGAllofMe"] flex items-center'>
                                    </input>
                                </div>
                            </div>
                            <textarea
                                value={content}
                                onChange={handleContentChange}
                                placeholder='Had perfect williamsburg day.'
                                className='font-["CutiveMono"] border-b-1 h-[50%] p-4 w-full'>
                            </textarea>
                            <div className='h-[20%]'>
                                <div className='border-b-1 h-[50%] flex items-center justify-center'>
                                    Issued on trips toward something station
                                </div>
                                <button
                                    onClick={handleSavePost}
                                    className='h-[50%] w-full font-extrabold text-[1.5rem] font-["KGAllofMe"] flex items-center justify-center'>
                                    SAVE POST
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Post;
