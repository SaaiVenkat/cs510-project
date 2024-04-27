import React from 'react'

const Card = ({ title, summary, url }) => {
    return (
        <div class="lg:flex shadow-md rounded-lg max-w-sm">
            <div class="flex flex-col justify-between py-6 lg:mx-6">
                <a href="#" class="text-lg font-semibold text-gray-800 hover:underline overflow-hidden truncate max-w-xs whitespace-normal">
                    {title}
                </a>
                <span class="text-sm text-gray-800">{summary}</span>
                <span class="text-sm text-gray-500"> Saved yesterday</span>
            </div>
            <img class="object-cover w-32 h-sm rounded-tr-lg rounded-br-lg" src={url} alt="" />
        </div>

    )
}

export default Card