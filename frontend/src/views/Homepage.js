import Card from "../components/Card";
import SearchBar from "../components/SearchBar";

export default function Homepage() {
    return (
        <div>
            <SearchBar />
            <section class="bg-white">
                <div class="container px-6 py-10 mx-auto">
                    <h1 class="text-3xl font-semibold text-black-800 capitalize lg:text-4x">Your bookmarks</h1>

                    <div class="grid grid-cols-1 mt-2 md:mt-16 md:grid-cols-2 items-center justify-center">
                        <div class="lg:flex shadow-md rounded-lg max-w-sm">
                            <div class="flex flex-col justify-between py-6 lg:mx-6">
                                <a href="#" class="text-lg font-semibold text-gray-800 hover:underline overflow-hidden truncate max-w-xs whitespace-normal">
                                    How to use sticky note for problem solvingg
                                </a>



                                <span class="text-sm text-gray-800">Summary...</span>
                                <span class="text-sm text-gray-500"> Saved on 20 October 2019</span>
                            </div>
                            <img class="object-cover w-32 h-sm rounded-tr-lg rounded-br-lg" src="https://images.unsplash.com/photo-1515378960530-7c0da6231fb1?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80" alt="" />
                        </div>


                    </div>
                </div>
            </section>
        </div>
    )
}

