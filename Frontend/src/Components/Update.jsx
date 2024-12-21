import React, { useState, useEffect } from 'react'
import Post from './Post'
import { useLogin } from '../Context/Context'

const getPost = async () => {
  try {
    const response = await fetch('http://localhost:8000/api/v1/posts/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('access')}`,
        'X-Refresh-Token': `${localStorage.getItem('refresh')}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error fetching posts:', errorData);
      return null;
    }
    const data = await response.json();
    return data;

  } catch (error) {
    console.error('Network error:', error);
    return null;
  }
};

function Update() {
  const { isLoggedIn } = useLogin()
  const [posts, setPosts] = useState([]); 

  useEffect(() => {
    getPost().then((data) => {
      if (data && data.data) {
        setPosts(data.data);
      }
    });
  }, []);

  return (
    <div className='flex flex-wrap'>
      {isLoggedIn ? (
        posts.length > 0 ? (
          posts.map((post, index) => (
            <Post 
              key={post._id || post.id || index} // Try multiple possible unique identifiers
              title={post.title}
              postImg={post.postImage}
              discription={post.discription}
              owner={post.createdBy}
            />
          ))
        ) : (
          <p className='p-12'>No posts available</p>
        )
      ) : (
        <p className='p-12'>Please Login First Then See the Updates</p>
      )}
    </div>
  )
}

export default Update