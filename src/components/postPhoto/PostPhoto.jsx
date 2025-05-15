import React from 'react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import postdemoimg from '../../assets/people2.jpg'


const PostPhoto = ({ post }) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <Link
     className='h-96 w-80 border border-solid border-purple-700 bg-black relative'
     onMouseEnter={() => setIsHovered(true)}
     onMouseLeave={() => setIsHovered(false)}
     to={`/postDetails/${post._id}`}
    >
      <img alt='profilepostPhoto' src={postdemoimg} className='opacity-95 w-full h-full object-cover cursor-pointer relative z-1 hover:opacity-80'/>
      {isHovered && <div className='bg-slate-300 absolute z-10 w-full h-full top-0 left-0 flex items-center justify-center text-3xl font-bold'>{post?.likes?.length} likes</div>}
    </Link>
  )
}

export default PostPhoto