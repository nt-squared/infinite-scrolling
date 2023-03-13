import { useEffect, useState } from 'react'
import axios from "axios"

export default function useBookSearch(query, pageNumber) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [books, setBooks] = useState([]);
    const [hasMore, setHasMore] = useState(false);

    useEffect(() => {
        setBooks([]);
        setLoading(true);
        setError(false);
    }, [query])

    useEffect(() => {
        setLoading(true);
        setError(false);

        const controller = new AbortController();

        axios({
            method: "GET",
            url: "https://openlibrary.org/search.json",
            params: { q: query, page: pageNumber },
            signal: controller.signal,
        }).then(res => {
            setBooks(prevBooks => {
                return [...new Set([...prevBooks, ...res.data.docs.map(b => b.title)])]
            })
            setHasMore(res.data.docs.length > 0)
            setLoading(false)
            console.log(res.data);
        }).catch(error => {
            if (axios.isCancel(error)) return
            setLoading(false)
            setError(true);
        })

        return () => controller.abort();

    }, [query, pageNumber])

    return { loading, error, books, hasMore }
}
