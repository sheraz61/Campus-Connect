import React, { useEffect, useState } from 'react'
import { useLogin } from '../../Context/Context'
import ResourceItem from './ResourceItem'

function Resource() {
    const [paper, setPaper] = useState([]) // Initialize as empty array
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const { isLoggedIn } = useLogin()

    useEffect(() => {
        const fetchPapers = async () => {
            try {
                setLoading(true)
                const response = await fetch('http://localhost:8000/api/v1/papers/', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('access')}`,
                        'X-Refresh-Token': `${localStorage.getItem('refresh')}`,
                    },
                })

                if (!response.ok) {
                    throw new Error('Failed to fetch papers')
                }

                const data = await response.json()
                setPaper(data.data || []) // Ensure it's an array
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        if (isLoggedIn) {
            fetchPapers()
        }
    }, [isLoggedIn])
    if (loading) {
        return <div className="flex justify-center items-center min-h-screen">Loading...</div>
    }

    if (error) {
        return <div className="text-red-500 text-center p-4">{error}</div>
    }
    return (
        <div className='flex flex-wrap gap-4 p-4'>
            {isLoggedIn ? (
                paper.length > 0 ? (
                    paper.map((res) => (
                        <ResourceItem
                        key={res._id}
                        title={res.title}
                        paperImg={res.paperImage}
                        discription={res.discription}
                        semester={res.semester}
                        owner={res.createdBy}
                        _id={res._id}
                        />
                    ))
                ) : (
                    <p className="text-center w-full">No papers found</p>
                )
            ) : (
                <p className="text-center w-full">Please login to view papers</p>
            )}
        </div>
    )
}

export default Resource