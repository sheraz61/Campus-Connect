import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLogin } from '../../Context/Context';
import { ArrowLeft } from 'lucide-react';

function EditUpdate() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useLogin();
  const [post, setPost] = useState({
    title: '',
    discription: '', // Fixed typo here from discription to description
    postImage: '',
  });
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    // Fetch post details
    fetch(`http://localhost:8000/api/v1/posts/${id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access')}`,
        'X-Refresh-Token': `${localStorage.getItem('refresh')}`,
      },
    })
      .then(response => response.json())
      .then(data => {
        setPost(data.data);
        setImagePreview(data.data.postImage); // Show existing image as preview
      })
      .catch(error => console.error('Error fetching post:', error));
  }, [id]);

  const onInputChange = (e) => {
    const { name, value, type, files } = e.target;
    setPost((prev) => ({
      ...prev,
      [name]: type === 'file' ? files[0] : value,
    }));

    if (type === 'file' && files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result); // Update preview with selected file
      };
      reader.readAsDataURL(files[0]); // Preview image before submit
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', post.title);
    formData.append('discription', post.discription); // Ensure consistency in field name
    formData.append('postImage', post.postImage);

    try {
      const response = await fetch(`http://localhost:8000/api/v1/posts/${id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access')}`,
          'X-Refresh-Token': `${localStorage.getItem('refresh')}`,
        },
        body: formData,
      });

      if (response.ok) {
        alert('Post updated successfully');
        navigate(-1);
      } else {
        const errorData = await response.json();
        alert(`Failed to update post: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error updating post:', error);
      alert('Error updating post');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 mb-6 text-orange-700 hover:text-orange-800"
      >
        <ArrowLeft className="w-5 h-5" />
        Back
      </button>

      {/* Edit Post Form */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold mb-4">Edit Post</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-semibold text-gray-700">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={post.title}
              onChange={onInputChange}
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="discription" className="block text-sm font-semibold text-gray-700">
              Discription
            </label>
            <textarea
              id="discription"
              name="discription"
              value={post.discription}
              onChange={onInputChange}
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md"
              rows="5"
              required
            />
          </div>

          {/* Image Upload */}
          <div>
            <label htmlFor="postImage" className="block text-sm font-semibold text-gray-700">
              Post Image
            </label>
            <input
              type="file"
              id="postImage"
              name="postImage"
              onChange={onInputChange}
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md"
            />
            {imagePreview && (
              <div className="mt-4 w-[500px] h-[600px]">
                <h3 className="text-sm font-semibold text-gray-700">Image Preview</h3>
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="mt-2 w-full h-full object-cover rounded-md"
                />
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditUpdate;
