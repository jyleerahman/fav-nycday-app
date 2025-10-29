import { useState, useRef } from "react"

function Feed() {

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
                <div className="w-[50%] h-[80%] bg-white border-5 flex flex-col font-['ArchivoNarrow'] items-center">
                    <div className="">title</div>
                    <div className="">map?</div>
                    <div className="">content</div>

                </div>
            </div>
        </>
    )
}

export default Feed;
