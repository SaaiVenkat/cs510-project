
const Card = ({ title, summary, url, preview_image }) => {
    return (

        <div className='mt-2'>
            <div className='mx-auto bg-white rounded-3xl shadow-xl'>
                <div style={{ width: "300px" }} className="max-w-[300px] shadow-sm h-full bg-slate-100 flex flex-row items-center justify-center">
                    <div className="w-2/5">
                        <img
                            src={preview_image || "https://static.vecteezy.com/system/resources/previews/005/337/799/original/icon-image-not-found-free-vector.jpg"}
                            width="100"
                            height="100"
                            className="rounded-t-3xl justify-center"
                            style={{ width: '100px', height: '100px' }}

                        />
                    </div>

                    <div className="z-10 ml-4 w-3/5">
                        <a
                            href={url}
                            className="group-hover:text-cyan-700 font-bold sm:text-lg line-clamp-2"
                        >
                            {title}
                        </a>
                        <div className=" grid-cols-2 flex group justify-between">
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default Card