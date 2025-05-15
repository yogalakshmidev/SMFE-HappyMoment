import React, { useState } from 'react'
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai'
import { useSelector } from 'react-redux'
import { format } from 'timeago.js'
import man from '../../assets/man2.jpg'
import { capitalizeFirstLetter } from '../../util/capitalizeFirstLetter'


const Comment = ({ c }) => {
   const {token, user} = useSelector((state) => state.auth)
   const [comment, setComment] = useState(c)
   const [isLiked, setIsLiked] = useState(comment?.likes?.includes(user._id))

   const handleLikeComment = async() => {
    try {
      await fetch(`http://localhost:5000/comment/toggleLike/${c?._id}`, {
        headers: {
          "Authorization": `Bearer ${token}`
        },
        method: "PUT"
      })

      setComment(prev => {
        return {
          ...prev,
          likes: isLiked
          ? [...prev.likes].filter((id) => id !== user._id)
          : [...prev.likes, user._id]
        }
      })
      setIsLiked(prev => !prev)
    } catch (error) {
      console.error(error)
    }
   }

  return (
    <div className='flex  justify-between items-center px-1 py-2'>
      <div className='flex   items-center gap-2'>
        <img src={man} className='w-10 h-10 object-cover rounded-2xl' alt='comment_img'/>
        <div className='flex flex-col mr-6 min-w-24'>
          <span className='font-medium'>{comment?.user?.username ? capitalizeFirstLetter(comment?.user?.username) : ''}</span>
          <span className='text-lg text-black'>{format(comment?.createdAt)}</span>
        </div>
        <div className='self-start text-lg text-black w-3/4 break-words'>{comment?.commentText}</div>
      </div>
      <div className='flex items-center flex-col cursor-pointer gap-1'>
        {
          isLiked 
          ? <AiFillHeart onClick={handleLikeComment} />
          : <AiOutlineHeart onClick={handleLikeComment} />
        }
        <span>{comment?.likes?.length || 0}</span>
        <span>likes</span>
      </div>
    </div>
  )
}

export default Comment