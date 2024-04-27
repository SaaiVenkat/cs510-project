import React from 'react'

const Card = ({ title, summary, url, preview_image }) => {
    return (

        <div class='flex '>
            <div class='mx-auto bg-white rounded-3xl shadow-xl'>
                <div class="grid rounded-3xl max-w-[250px] shadow-sm h-full bg-slate-100  flex-col">
                    <img
                        src={preview_image}
                        width="375"
                        height="100"
                        class="rounded-t-3xl justify-center grid h-40 object-cover"
                    // alt="movie.title"
                    />

                    <div class="group p-6 grid z-10">
                        <a
                            href={url}
                            class="group-hover:text-cyan-700 font-bold sm:text-lg line-clamp-2"
                        >
                            {title}
                        </a>
                        {/* <span class="text-slate-400 pt-2 font-semibold">

                            (2023)
                        </span> */}
                        <div class="h-20">
                            <span class="line-clamp-3 py-2 text-sm font-light leading-relaxed">
                                {summary}
                            </span>
                        </div>
                        <div class=" grid-cols-2 flex group justify-between">


                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default Card