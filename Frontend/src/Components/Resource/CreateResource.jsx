import React, { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';
function CreateResource({isCreatePost,setIsCreatePost,setUpdateTrigger,updateTrigger}) {
    const paperImgRef=useRef(null)
    const navigate = useNavigate()
    const [paper,setPaper]=useState({
        paperImage:null,
        title:'',
        semester:'',
        discription:''
    })
    const onInputChange = (e) => {
        const { name, value, type, files } = e.target;
        setPaper((prev) => ({
            ...prev,
            [name]: type === 'file' ? files[0] : value,
        }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        // Create FormData object dynamically
        const data = new FormData();
        Object.keys(paper).forEach((key) => {
            data.append(key, paper[key]);
        });

        try {
            const response = await fetch('http://localhost:8000/api/v1/papers/', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access')}`,
                    'X-Refresh-Token': `${localStorage.getItem('refresh')}`,
                },
                body: data, // FormData automatically handles file upload
            });
            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error:', errorData.message);
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            if (response.ok) {
                navigate('/resource')
                setUpdateTrigger(updateTrigger + 1)
                setIsCreatePost(!isCreatePost)
                setPaper({
                    title: '',
                    discription: '',
                    semester:'',
                    postImage: null,
                });
            }

            if (paperImgRef.current) paperImgRef.current.value = '';
            alert('Resource create successfully!');
        } catch (error) {
            console.error('Failed to create Resource:', error.message);
        }
    };    
  return (
    <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
    <div className="flex items-center  justify-between w-full">
        <label htmlFor="paperImage" className="text-left w-32">
            Resource Image
        </label>
        <input
            type="file"
            name="paperImage"
            onChange={onInputChange}
            ref={paperImgRef}
            required
            className="px-4 py-1 border rounded-md border-black flex-1 ml-4"
        />
    </div>
    <div className='flex items-center justify-between w-full'>
        <label htmlFor="userName" className="text-left w-32">
            Title
        </label>
        <input
            type="text"
            name="title"
            placeholder='Enter Resource Title'
            onChange={onInputChange}
            value={paper.title}
            required
            className="px-4 py-1 border rounded-md border-black flex-1 ml-4"
        />
    </div>
    <div className='flex items-center justify-between w-full'>
        <label htmlFor="semester" className="text-left w-32">
            Semester
        </label>
        <input
            type="text"
            name="semester"
            placeholder='Enter Resource Title'
            onChange={onInputChange}
            value={paper.semester}
            required
            className="px-4 py-1 border rounded-md border-black flex-1 ml-4"
        />
    </div>
    <div className="flex items-center justify-between w-full">
        <label htmlFor="discription" className="text-left w-32">
            Discription
        </label>
        <textarea
            name='discription'
            className='w-full h-28 p-4 border border-gray-300 rounded-md'
            placeholder='Write your post discription here...'
            value={paper.discription}
            onChange={onInputChange}

        />
    </div>
    <button
        type='Submit'
        className='mt-4 px-6 py-2 bg-orange-700 text-white rounded-full hover:bg-orange-800'
    >
        Submit Resource
    </button>
</form>
  )
}

export default CreateResource