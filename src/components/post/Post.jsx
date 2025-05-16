import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { format } from 'timeago.js'
import { Link } from 'react-router-dom'
import woman from '../../assets/woman.jpg'
import { capitalizeFirstLetter } from '../../util/capitalizeFirstLetter'
import { HiOutlineDotsVertical } from 'react-icons/hi'
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai'
import { BiMessageRounded } from 'react-icons/bi'
import { BsBookmarkFill, BsBookmark } from 'react-icons/bs'
import Comment from '../comment/Comment'
import { bookmarkPost } from '../../redux/authSlice'

const Post = ({ post }) => {
  const { token, user } = useSelector((state) => state.auth)
  const [comments, setComments] = useState([])
  const [commentText, setCommentText] = useState('')
  const [isCommentEmpty, setIsCommentEmpty] = useState(false)
  const [isLiked, setIsLiked] = useState(post.likes.includes(user._id))
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(user?.bookmarkedPosts?.some(bookmarkedPost => bookmarkedPost._id === post._id))
  const [showComment, setShowComment] = useState(false)
  const dispatch = useDispatch()

  useEffect(() => {
    const fetchComments = async () => {
      try {
        // api call
        const res = await fetch(`https://smbe-happymoment.onrender.com/comment/${post._id}`,{
        // const res = await fetch(`http://localhost:5000/comment/${post._id}`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        })

        const data = await res.json()
        setComments(data)
      } catch (error) {
        console.error(error)
      }
    }
    fetchComments()
  }, [post._id])

  const deletePost = async () => {
    try {
      // api call
      await fetch(`https://smbe-happymoment.onrender.com/post/${post._id}`,{
      // await fetch(`http://localhost:5000/post/${post._id}`, {
        headers: {
          "Authorization": `Bearer ${token}`
        },
        method: 'DELETE'
      })
      window.location.reload()
    } catch (error) {
      console.error(error)
    }
  }

  const handleLikePost = async () => {
    try {
      // api call
      await fetch(`https://smbe-happymoment.onrender.com/post/toggleLike/${post._id}`,{
      // await fetch(`http://localhost:5000/post/toggleLike/${post._id}`, {
        headers: {
          "Authorization": `Bearer ${token}`
        },
        method: "PUT"
      })
      setIsLiked(prev => !prev)
    } catch (error) {
      console.error(error)
    }
  }

  const handleBookmark = async () => {
    try {
      console.log("enter into bookmark and postid is",post._id,token);
      setIsBookmarked(prev => !prev)
      // api call
      await fetch(`https://smbe-happymoment.onrender.com/user/bookmark/${post._id}`,{
      // await fetch(`http://localhost:5000/user/bookmark/${post._id}`, {
        headers: {
          "Authorization": `Bearer ${token}`
        },
        method: "PUT"
      })
      dispatch(bookmarkPost(post))
      // setIsBookmarked(prev => !prev)
    } catch (error) {
      console.error(error)
    }
  }

  const handlePostComment = async () => {
    if (commentText === '') {
      setIsCommentEmpty(true)
      setTimeout(() => {
        setIsCommentEmpty(false)
      }, 2000)
      return
    }

    try {
      // api call 
      const res = await fetch(`https://smbe-happymoment.onrender.com/comment/createComment`, {
      // const res = await fetch(`http://localhost:5000/comment/createComment`, {
        headers: {
          "Content-Type": 'application/json',
          "Authorization": `Bearer ${token}`
        },
        method: 'POST',
        body: JSON.stringify({ commentText, post: post._id })
      })

      const data = await res.json()

      setComments(prev => [...prev, data])
      setCommentText('')
    } catch (error) {
      console.error(error)
    }
  }


  return (

    <div className='flex  justify-center relative mb-2'>
      <div className='flex flex-col  w-full  overflow-hidden rounded-xl pb-4 h-full bg-teal-300 border-solid border-cyan-100 border max-w-7xl'>
        <div className='flex  justify-between items-center px-3 py-2 border border-solid border-cyan-100 pb-4 mt-2'>
          <Link to={`/profileDetail/${post?.user?._id}`} className='flex items-center gap-2'>
            <img  alt='user_img' src={woman} className='h-10 w-10 rounded-2xl object-cover' />
            <div className='flex flex-col'>
              <span className='text-lg font-medium'>{capitalizeFirstLetter(post.user.username)}</span>
              <span className='text-sm text-cyan-600'>{format(post.createdAt)}</span>
            </div>
          </Link>
          {
            (user._id === post.user._id) &&
            <HiOutlineDotsVertical size={25} onClick={() => setShowDeleteModal(prev => !prev)} />
          }
          {
            showDeleteModal && (
              <div className='flex flex-col gap-2 p-3 bg-cyan-500 right-0 top-16 absolute'>
                <h3>Delete Post</h3>
                <div className='flex justify-center gap-3'>
                  <button className='outline-none border-none bg-white px-2 py-3 rounded-md' onClick={deletePost}>Yes</button>
                  <button className='outline-none border-none bg-white px-2 py-3 rounded-md' onClick={() => setShowDeleteModal(prev => !prev)}>No</button>
                </div>
              </div>
            )
          }
        </div>
        <div className='h-fit w-full'>
          <div className='text-lg text-black p-4 '>{post.desc}</div>
          {post?.location && <div className='p-2 '>Location: {post.location}</div>}
          {/* api call for images */} 
          <img alt="post_img" className='object-contain w-full h-96' src={post?.photo ? `https://smbe-happymoment.onrender.com/images/${post?.photo}` : woman} />
          {/* <img alt="post images" className='object-contain w-full h-96' src={post?.photo ? `http://localhost:5000/images/${post?.photo}` : woman} /> */}
        </div>
        {/* need to check */}
        <div className='flex justify-between items-center text-2xl px-2 py-4 border-b border-solid border-teal-700'>
          <div className='flex items-center gap-2 '>
            {
              isLiked
                ? <AiFillHeart onClick={handleLikePost} />
                : <AiOutlineHeart onClick={handleLikePost} />
            }
            <BiMessageRounded onClick={() => setShowComment(prev => !prev)} />
          </div>
          <div className='flex' 
          onClick={handleBookmark}>
            {
              isBookmarked
                ? <BsBookmarkFill />
                : <BsBookmark />
            }
          </div>
        </div>
        {
          showComment &&
          <>
            <div className=' flex-col gap-7 px-6 py-3 border-b border-solid border-teal-950 max-h-96 overflow-auto'>
              {
                comments?.length > 0 ? comments.map((comment) => (
                  <Comment c={comment} key={comment._id} />
                )) : <span style={{ marginLeft: '12px', fontSize: '20px' }}>No comments</span>
              }
            </div>
            <div className='flex max-w-7xl p-2 mt-5'>
              <input
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                type="text"
                className='border-none text-black outline-none bg-transparent text-lg w-5/6 pl-2 transition-all hover:pl-1'
                placeholder='Type comment'
              />
              <button onClick={handlePostComment}  className="outline-none cursor-pointer rounded-3xl text-xl font-medium text-white bg-teal-600 px-4 py-2 ring-3 hover:border-teal-600 border-2 hover:bg-white hover:text-teal-400">Post</button>
            </div>
            {isCommentEmpty && <span className='inline-block mt-6 ml-4 text-red-500 text-lg'>You can't post empty comment!</span>}
          </>
        }
      </div>
    </div>
    
  )
}

export default Post