import React from 'react'
import { useNavigate } from 'react-router-dom';
import { useRef, useState } from 'react';
function ChangeCover({ updateTrigger, setUpdateTrigger, isUpdateCover, setIsUpdateCover }) {
    const navigate = useNavigate()
    const [cover, setCover] = useState({
        coverImage: null,
    })
    const coverImgRef = useRef(null);
    const onChangeCover = (e) => {
        const { name, files } = e.target;
        setCover((prev) => ({
            ...prev,
            [name]: files[0]
        }));
    }
    const handleCoverSubmit = async (e) => {
        e.preventDefault();
        // Create FormData object dynamically
        const data = new FormData();
        data.append("coverImage", cover.coverImage);
        try {
            const response = await fetch('http://localhost:8000/api/v1/users/cover-image', {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access')}`,
                    'X-Refresh-Token': `${localStorage.getItem('refresh')}`,
                },
                body: data, // FormData automatically handles file upload
            });
            if (!response.ok) {
                alert('Profile Image Not Update')
            }
            if (response.ok) {
                navigate('/profile')
                setUpdateTrigger(updateTrigger + 1)
                setIsUpdateCover(!isUpdateCover)
                if (coverImgRef.current) coverImgRef.current.value = '';
                alert('cover Image change successfully!');
                setCover({
                    coverImage: null,
                })
            }
        } catch (error) {
            console.error('Failed to update cover Image:', error.message);
        }
    }
    return (
        <form onSubmit={handleCoverSubmit}>
            <div className="flex items-center  justify-between w-full">
                <label htmlFor="coverImage" className="text-left w-32">
                    Cover Image
                </label>
                <input
                    type="file"
                    name="coverImage"
                    onChange={onChangeCover}
                    ref={coverImgRef}
                    required
                    className="px-4 py-1 border rounded-md border-black flex-1 ml-4"
                />
            </div>
            <button
                type='Submit'
                className='mt-4 px-6 py-2 bg-orange-700 text-white rounded-full hover:bg-orange-800'
            >
                Update Cover Image
            </button>
        </form>
    )
}

export default ChangeCover