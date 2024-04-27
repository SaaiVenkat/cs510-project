import { useEffect, useRef, useState } from "react";
import Card from "../components/Card";
import SearchBar from "../components/SearchBar";
import { apiV1 } from "../api/config";

export default function Homepage() {
    const [results, setResults] = useState([])
    useEffect(() => {
        queryBookmarks("")
    }, [])
    //function and state for search bar
    const [searchTerm, setSearchTerm] = useState('');
    const timerRef = useRef(null);
    const handleSearch = (event) => {
        const searchTerm = event.target.value;
        setSearchTerm(searchTerm);
        // Delay before making API call (adjust as needed)
        const delay = 3000; // 3 second
        clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
            queryBookmarks(searchTerm)
        }, delay);
    };
    const apiClient = apiV1()
    const queryBookmarks = (query) => {
        const params = {
            q: query,
            type: 'string',
        };

        apiClient.get('/query', {
            params: params
        })
            .then(response => {
                // Handle success
                console.log('Response:', response.data);
                setResults(response.data)
            })
            .catch(error => {
                // Handle error
                console.error('Error:', error);
            });
    }
    return (
        <div>
            <SearchBar searchTerm={searchTerm} handleSearch={handleSearch} />
            <section class="bg-white">
                <div class="container px-6 py-10 mx-auto">
                    <h1 class="text-xl font-semibold text-black-800 capitalize lg:text-4x">{searchTerm ? `Your bookmarks for the query "${searchTerm}"` : 'All Bookmarks'}</h1>
                    {results.length == 0 && (
                        <div class="lg:flex justify-center items-center h-80">
                            Start bookmarking!
                        </div>
                    )}
                    <div class="grid grid-cols-4 gap-4 grid-flow-row-dense mt-10">
                        {results.map(result => (
                            <Card title={result.title} summary={result.description} url={result.url} preview_image={result.preview_image} />
                        ))}

                    </div>
                </div>
            </section>
        </div>
    )
}

