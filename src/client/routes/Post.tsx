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
                    px-3 py-1.5 text-xs
                    font-["ArchivoNarrow"] font-semibold tracking-wide
                    border border-black
                    bg-[#f5f3ed]
                    transition-all duration-200
                    hover:scale-105
                    ${isSelected ? 'selected-ticket' : ''}
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
                    <div className='perforated-x h-full pl-3 pr-3 pt-10 pb-10 bg-[#d1d3e5]'>
                        <div className='border-2 h-full'>
                            <div className='border-b-1 h-[5%] flex'>
                                <div className='font-extrabold font-["KGAllofMe"] text-[1.2rem] flex items-center justify-center w-full'>SPECIAL DAY</div>
                            </div>
                            <div className='flex border-b-1 h-[20%]'>
                                <div className='border-r-1 flex items-center justify-center p-2 [writing-mode:vertical-rl] tracking-widest'>
                                    93493
                                </div>
                                <div className='flex flex-col w-full'>
                                    <div className='px-2 border-b-1 h-[25%] flex items-center'>
                                        Issued by Your Perfect New York City Day
                                    </div>
                                    <div className='px-2 border-b-1 h-[50%] flex items-center text-4xl font-extrabold font-["KGAllofMe"]'>
                                        {getCurrentDate()}
                                    </div>
                                    <input
                                        value={title}
                                        onChange={handleTitleChange}
                                        placeholder='Sunny Williamsburg day...'
                                        className='px-2 h-[25%] font-["KGAllofMe"] flex items-center'>
                                    </input>
                                </div>
                            </div>
                            <textarea
                                value={content}
                                onChange={handleContentChange}
                                placeholder='Cheap eats day on williamsburg...'
                                className='font-["CutiveMono"] border-b-1 h-[25%] p-4 w-full'>
                            </textarea>
                            
                            {/* Tags Section */}
                            <div className='border-b-1 h-[18%] p-3 overflow-y-auto'>
                                <div className='mb-2'>
                                    <div className='text-[0.65rem] font-semibold mb-1 tracking-wider'>WEATHER</div>
                                    <div className='flex flex-wrap gap-1.5'>
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

                            <div className='border-b-1 h-[18%] p-3 overflow-y-auto'>
                                <div>
                                    <div className='text-[0.65rem] font-semibold mb-1 tracking-wider'>MOOD</div>
                                    <div className='flex flex-wrap gap-1.5'>
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
                                <div className='border-b-1 h-[50%] flex items-center justify-center'>
                                    Issued on trips toward something station
                                </div>
                                <button
                                    onClick={handleSavePost}
                                    className='stamp-button h-[50%] w-full font-extrabold text-[1.5rem] font-["KGAllofMe"] flex items-center justify-center'>
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
