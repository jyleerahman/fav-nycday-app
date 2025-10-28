import { useState, useRef, useEffect } from 'react';


function Post() {
    return (
        <>
            <div className='h-[100vh] flex flex-col font-["ArchivoNarrow"]'>
                <div className='border-2 h-[80%] mt-10 m-10 w-[350px] bg-[#d1d3e5]'>
                    <div className='border-b-1 h-[5%] flex'>
                        <div className='font-extrabold font-["KGAllofMe"] text-[1.2rem] flex items-center justify-center w-full'>SPECIAL DAY</div>
                    </div>
                    <div className='flex border-b-1 h-[25%]'>
                        <div className='border-r-1 flex items-center justify-center p-2'>
                            107997
                        </div>
                        <div className='flex flex-col w-full'>
                            <div className='px-2 border-b-1 h-[25%] flex items-center'>
                                Issued by New York City Transit
                            </div>
                            <div className='px-2 border-b-1 h-[50%] flex items-center text-3xl font-extrabold font-["KGAllofMe"]'>
                                OCT. 12 2025
                            </div>
                            <div className='px-2 h-[25%] font-["KGAllofMe"] flex items-center'>
                                B-74 MERMAID AV.
                            </div>
                        </div>
                    </div>
                    <div className='font-["CutiveMono"] border-b-1 h-[50%] p-2'>
                        It was rainy and feeling brooklynish today.
                    </div>
                    <div className='h-[20%]'>
                        <div className='border-b-1 h-[50%] flex items-center justify-center'>
                            Issued on trips toward something station
                        </div>
                        <div className='border-b-1 h-[25%] font-extrabold text-[1.5rem] font-["KGAllofMe"] flex items-center justify-center'>
                            A.M.
                        </div>
                        <div className='h-[25%] font-extrabold text-[1.5rem] font-["KGAllofMe"] flex items-center justify-center'>
                            P.M.
                        </div>
                    </div>
                </div>


            </div>
        </>
    )
}

export default Post;
