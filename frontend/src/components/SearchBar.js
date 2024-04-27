import React from 'react'

const SearchBar = () => {
    return (
        <div class="flex mt-10 flex-col items-center justify-center bg-white">
            <div class="md:w-[584px] mx-auto mt-7 flex w-[92%] items-center rounded-full border shadow-md">
                <div class="pl-5">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
                <input placeholder='Start typing here..' type="text" class="w-full bg-transparent rounded-full py-[14px] pl-4 outline-none" />
            </div>
        </div>
    )
}

export default SearchBar