import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createClient } from "@supabase/supabase-js";
import { useAppStore } from '../store';

const WEATHER_TAGS = ['sunny', 'cloudy', 'rainy', 'snowy', 'windy', 'foggy', 'humid', 'crisp'];
const MOOD_TAGS = ['happy', 'peaceful', 'energetic', 'nostalgic', 'adventurous', 'contemplative', 'inspired', 'cozy', 'rushed', 'melancholic'];

function Post(props) {
    const [title, setTitle] = useState("")
    const [content, setContent] = useState("")
    const [selectedWeatherTags, setSelectedWeatherTags] = useState<string[]>([])
    const [selectedMoodTags, setSelectedMoodTags] = useState<string[]>([])
    const navigate = useNavigate()
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    //get the state 
    const currentRoute = useAppStore((state) => state.currentRoute);

    // Get current date formatted like "OCT 31. 2025"
    const getCurrentDate = () => {
        const date = new Date();
        const month = date.toLocaleString('en-US', { month: 'short' }).toUpperCase();
        const day = date.getDate();
        const year = date.getFullYear();
        return `${month} ${day}. ${year}`;
    };

    function handleTitleChange(e) {
        setTitle(e.target.value)
    }

    function handleContentChange(e) {
        setContent(e.target.value)
    }

    const toggleWeatherTag = (tag: string) => {
        setSelectedWeatherTags(prev => 
            prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
        )
    }

    const toggleMoodTag = (tag: string) => {
        setSelectedMoodTags(prev => 
            prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
        )
    }

    const handleSavePost = async (e) => {
        // send data to supabase
        const newPost = {
            title: title,
            content: content,
            // this is global state! omg
            route_geometry: currentRoute,
            weather_tags: selectedWeatherTags,
            mood_tags: selectedMoodTags
        }

        try {
            const { data, error } = await supabase
                .from("post")
                .insert([newPost])
            setTitle("")
            setContent("")
            setSelectedWeatherTags([])
            setSelectedMoodTags([])
        } catch (err) {
            console.error(err)
        }

        navigate("/feed")
    }

    const TagTicket = ({ tag, isSelected, onToggle }: { tag: string, isSelected: boolean, onToggle: () => void }) => {
        return (
            <button
                onClick={onToggle}
                className={`
                    relative ticket-stub
                    px-2 py-1 text-[0.65rem]
                    font-["ArchivoNarrow"] font-semibold tracking-wide
                    border-2 border-[#0039A6]
                    transition-all duration-200
                    hover:scale-105
                    ${isSelected ? 'bg-[#ff6319] text-white border-[#ff6319]' : 'bg-white text-[#0039A6]'}
                `}
            >
                {tag.toUpperCase()}
                {isSelected && (
                    <div className="hole-punch"></div>
                )}
            </button>
        )
    }

    return (
        <>

            <div className='h-[100vh] flex flex-col font-["ArchivoNarrow"] items-center justify-center tile-bg'>
                <div className='shadow-natural mt-10 m-10 w-[350px] h-[95%]'>
                    <div className='perforated-x h-full pl-3 pr-3 pt-10 pb-10 bg-white'>
                        <div className='border-2 border-[#0039A6] h-full bg-white'>
                            <div className='border-b-2 border-[#0039A6] h-[5%] flex bg-[#0039A6] relative'>
                                <div className='absolute left-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#D14124] flex items-center justify-center'>
                                    <span className='text-[#FFD034] text-[0.5rem] font-black'>MTA</span>
                                </div>
                                <div className='font-extrabold font-["KGAllofMe"] text-[1.2rem] flex items-center justify-center w-full text-white'>SPECIAL DAY PASS</div>
                            </div>
                            <div className='flex border-b-2 border-[#0039A6] h-[20%]'>
                                <div className='border-r-2 border-[#0039A6] flex items-center justify-center p-2 [writing-mode:vertical-rl] tracking-widest bg-[#f7f4ed] font-bold text-[#ff6319]'>
                                    93493
                                </div>
                                <div className='flex flex-col w-full'>
                                    <div className='px-2 border-b-1 border-[#0039A6] h-[25%] flex items-center text-[0.65rem] text-[#0039A6] font-semibold'>
                                        MTA NYC TRANSIT • YOUR PERFECT DAY
                                    </div>
                                    <div className='px-2 border-b-1 border-[#0039A6] h-[50%] flex items-center text-4xl font-extrabold font-["KGAllofMe"] text-[#ff6319]'>
                                        {getCurrentDate()}
                                    </div>
                                    <input
                                        value={title}
                                        onChange={handleTitleChange}
                                        placeholder='Sunny Williamsburg day...'
                                        className='px-2 h-[25%] font-["KGAllofMe"] flex items-center border-none outline-none'>
                                    </input>
                                </div>
                            </div>
                            <textarea
                                value={content}
                                onChange={handleContentChange}
                                placeholder='Cheap eats day on williamsburg...'
                                className='font-["CutiveMono"] border-b-2 border-[#0039A6] h-[25%] p-4 w-full resize-none outline-none'>
                            </textarea>
                            
                            {/* Tags Section */}
                            <div className='border-b-2 border-[#0039A6] h-[16%] p-2.5 bg-[#f7f4ed]'>
                                <div>
                                    <div className='text-[0.65rem] font-bold mb-0.5 tracking-wider text-[#0039A6]'>☀ WEATHER</div>
                                    <div className='flex flex-wrap gap-1'>
                                        {WEATHER_TAGS.map(tag => (
                                            <TagTicket 
                                                key={tag}
                                                tag={tag}
                                                isSelected={selectedWeatherTags.includes(tag)}
                                                onToggle={() => toggleWeatherTag(tag)}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className='border-b-2 border-[#0039A6] h-[20%] p-2.5 bg-[#f7f4ed]'>
                                <div>
                                    <div className='text-[0.65rem] font-bold mb-0.5 tracking-wider text-[#0039A6]'>😊 MOOD</div>
                                    <div className='flex flex-wrap gap-1'>
                                        {MOOD_TAGS.map(tag => (
                                            <TagTicket 
                                                key={tag}
                                                tag={tag}
                                                isSelected={selectedMoodTags.includes(tag)}
                                                onToggle={() => toggleMoodTag(tag)}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className='h-[14%]'>
                                <div className='border-b-2 border-[#0039A6] h-[50%] flex items-center justify-center text-[0.65rem] text-[#666] italic'>
                                    Valid for unlimited memories on all NYC routes
                                </div>
                                <button
                                    onClick={handleSavePost}
                                    className='subway-save-button h-[50%] w-full font-extrabold text-[1.5rem] font-["KGAllofMe"] flex items-center justify-center'>
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
