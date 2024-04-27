import React from 'react'
import GoogleLoginButton from './GoogleLogin.js'

const Navbar = () => {
    return (
        <div>
            <nav id="header" class="w-full z-30 top-10 py-1 px-8 bg-white shadow-lg border-b border-grey-400">

                <div class="w-full flex items-center justify-between mt-0 px-6 py-2">
                    <div class="flex items-center justify-center">
                        <div class="inline-block no-underline hover:text-black tracking-wide font-medium text-2xl py-2 font-sans lg:-ml-2">Intellimark</div>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M19 24l-7-6-7 6v-24h14v24z" /></svg>
                    </div>


                    <div class="order-2 md:order-3 flex flex-wrap items-center justify-end mr-0 md:mr-4" id="nav-content">
                        <div class="auth flex items-center w-full md:w-full">
                            <GoogleLoginButton />
                        </div>
                    </div>
                </div>
            </nav >
        </div >
    )
}

export default Navbar