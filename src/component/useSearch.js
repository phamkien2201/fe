import { useState, useEffect } from 'react';

function useSearch() {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);

    // Define fetchSearchResults outside of useEffect so it can be returned and used externally
    const fetchSearchResults = async () => {
        if (searchQuery.length > 2) {
            setIsSearching(true);
            const encodedQuery = encodeURIComponent(searchQuery);
            const url = `http://localhost:5001/api/product/searchTerms?searchTerms=${encodedQuery}`;

            try {
                const response = await fetch(url);
                const data = await response.json();
                if (data.succeeded && data.data) {
                    // Ensure searchResults is always an array
                    setSearchResults(Array.isArray(data.data) ? data.data : [data.data]);
                } else {
                    setSearchResults([]);
                }
            } catch (error) {
                console.error("Error fetching search results:", error);
                setSearchResults([]);
            }
            setIsSearching(false);
        } else {
            setSearchResults([]); // Clear results if query is less than 3 characters
        }
    };

    // Use useEffect to call fetchSearchResults on searchQuery change
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchSearchResults();
        }, 300); // Debounce timeout
        return () => clearTimeout(timeoutId);
    }, [searchQuery]);

    return { searchQuery, setSearchQuery, searchResults, fetchSearchResults, isSearching };
}

export default useSearch;
