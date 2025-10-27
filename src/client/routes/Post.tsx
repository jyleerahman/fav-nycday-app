import { useState, useRef, useEffect } from 'react';


function Post() {
    return (
        <>
            <div className='h-[100vh] flex flex-col bg-[#d1d3e5] font-["ArchivoNarrow"]'>
                <div className='border-2 h-[80%] mt-10 m-10 w-[350px]'>
                    <div className='border-b-1 h-[5%] font-extrabold font-["KGTribecaStamp"] text-[1.2rem]'>SPECIAL DAY</div>
                    <div className='flex border-b-1 h-[25%]'>
                        <div className='border-r-1'>
                            107997
                        </div>
                        <div className='flex flex-col w-full'>
                            <div className='border-b-1 h-[25%]'>
                                Issued by New York City Transit
                            </div>
                            <div className='border-b-1 h-[50%] text-3xl font-extrabold font-["KGTribecaStamp"]'>
                                OCT. 12 2025
                            </div>
                            <div className='h-[25%]'>
                                B-74 MERMAID AV.
                            </div>
                        </div>
                    </div>
                    <div className='font-["CutiveMono"] border-b-1 h-[50%]'>
                        It was rainy and feeling brooklynish today.
                    </div>
                    <div className='h-[20%]'>
                        <div className='border-b-1 h-[50%]'>
                            Issued on trips toward something station
                        </div>
                        <div className='border-b-1 h-[25%] font-extrabold text-[1.5rem] font-["KGTribecaStamp"]'>
                            A.M.
                        </div>
                        <div className='h-[25%] font-extrabold text-[1.5rem] font-["KGTribecaStamp"]'>
                            P.M.
                        </div>
                    </div>
                </div>


            </div>
        </>
    )
}

export default Post;
