import React from 'react'

const SearchBar = ({ searchTerm, handleSearch }) => {
    return (
        <div class="flex mt-10 flex-col items-center justify-center bg-white">
            <div class="md:w-[584px] mx-auto mt-7 flex w-[92%] items-center rounded-full border shadow-md">
                <div class="pl-5">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
                <input placeholder='Start typing here..' type="text" class="w-full bg-transparent rounded-full py-[14px] pl-4 outline-none" value={searchTerm}
                    onChange={handleSearch} />
                <div class="pr-5">
                    <svg clip-rule="evenodd" class="h-8 w-8 text-gray-400" fill-rule="evenodd" stroke-linejoin="round" stroke-miterlimit="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="m2.009 12.002c0-5.517 4.48-9.997 9.998-9.997s9.998 4.48 9.998 9.997c0 5.518-4.48 9.998-9.998 9.998s-9.998-4.48-9.998-9.998zm1.5 0c0 4.69 3.808 8.498 8.498 8.498s8.498-3.808 8.498-8.498-3.808-8.497-8.498-8.497-8.498 3.807-8.498 8.497zm6.711-4.845c-.141-.108-.3-.157-.456-.157-.389 0-.755.306-.755.749v8.501c0 .445.367.75.755.75.157 0 .316-.05.457-.159 1.554-1.203 4.199-3.252 5.498-4.258.184-.142.29-.36.29-.592 0-.23-.107-.449-.291-.591zm.289 7.564v-5.446l3.523 2.718z" fill-rule="nonzero" /></svg>
                </div>
            </div>
        </div>
    )
}

export default SearchBar