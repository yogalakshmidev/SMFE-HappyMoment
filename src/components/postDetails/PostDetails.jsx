import React from 'react'
import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import man from '../../assets/man.jpg'
import { useEffect } from 'react'
import Comment from '../comment/Comment'

const PostDetails = () => {
  const [post, setPost] = useState("")
  const [comments, setComments] = useState([])
  const [commentText, setCommentText] = useState("")
  const [isCommentEmpty, setIsCommentEmpty] = useState(false)
  const [isCommentLong, setIsCommentLong] = useState(false)
  const { token } = useSelector((state) => state.auth)
  const { id } = useParams()

  useEffect(() => {
    const fetchPost = async () => {
      try {
        // api call
        const res = await fetch(`https://smbe-happymoment.onrender.com/post/find/${id}`)
        // const res = await fetch(`http://localhost:5000/post/find/${id}`)
        const data = await res.json()
        setPost(data)
      } catch (error) {
        console.error(error)
      }
    }
    id && fetchPost()
  }, [id])

  useEffect(() => {
    const fetchComments = async () => {
      try {
        // api call
        const res= await fetch(`https://smbe-happymoment.onrender.com/comment/${id}`,{
        // const res = await fetch(`http://localhost:5000/comment/${id}`, {
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
    post && fetchComments()
  }, [post._id])

  const handlePostComment = async () => {
     if(commentText === ''){
      setIsCommentEmpty(true)
      setTimeout(() => {
        setIsCommentEmpty(false)
      }, 2000);
      return
     }

     if(commentText.length > 50){
      setIsCommentLong(true)
      setTimeout(() => {
        setIsCommentLong(false)
      }, 2000)
      return
     }

     try {
      // api call
      const res = await fetch(`https://smbe-happymoment.onrender.com/comment`,{
      // const res = await fetch(`http://localhost:5000/comment`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        method: 'POST',
        body: JSON.stringify({commentText, post: post._id})
      })

      const data = await res.json()
      setComments(prev => [...prev, data])
      setCommentText("")
     } catch (error) {
      console.error(error)
     }
  }

  return (
    <div className='flex gap-3 w-full'>
      <div className=' flex w-9/12 mt-6 mx-0 h-96'>
        <div className='flex w-9/12 h-full bg-black'>
        {/* api call for images */} 
        <img alt='postPhoto' src={post?.photo && `https://smbe-happymoment.onrender.com/images/${post?.photo}`} className='h-full w-full object-cover opacity-95'/>
          {/* <img alt='postPhoto' src={post?.photo && `http://localhost:5000/images/${post?.photo}`} className='h-full w-full object-cover opacity-95'/> */}
        </div>
        <div className='flex flex-1 flex-col justify-between '>
          <div className='border-b-2 border-solid border-cyan-900 w-full'>
            <Link to={`/profileDetail/${post?.user?._id}`} className='text-inherit py-3 px-8 flex items-center gap-6'>
              <img src={man} className='h-14 w-14 rounded-2xl object-cover' alt='postImage' />
              <div className='flex flex-col gap-2'>
                <span className='capitalize text-2xl font-medium text-black'>{post?.user?.username}</span>
                <span className='text-lg text-neutral-600'>{post?.location ? post?.location : "Somewhere around the globe"}</span>
              </div>
            </Link>
          </div>
          {/* comments */}
          <div className='flex flex-col gap-7 py-6 px-3 h-auto overflow-y-auto'>
            {comments?.length > 0 ?
              comments.map((comment) => (
                <Comment c={comment} key={comment._id} />
              ))
              : <h3 className='m-10 text-center text-2xl'>No comments yet</h3>}
          </div>
          {/* comment input field */}
          <div className=' flex border-t border-black w-full m-auto p-3'>
            <input value={commentText} onChange={(e) => setCommentText(e.target.value)} type="text" placeholder='Type comment...' className='border-none outline-none bg-transparent text-lg w-11/12 pl-2 transition-all focus:pl-4' />
            <button className='outline-none cursor-pointer rounded-3xl text-xl font-medium text-white bg-teal-600 px-4 py-2 ring-3 hover:border-teal-600 border-2 hover:bg-white hover:text-teal-400 ' onClick={handlePostComment}>Post</button>
          </div>
          {isCommentEmpty && <span className='inline-block mt-6 ml-4 text-red-600 text-lg'>You can't post empty comment!</span>}
          {isCommentLong && <span className='inline-block mt-6 ml-4 text-red-600 text-lg'>Comment is too long</span>}
        </div>
      </div>
    </div>
  )
}

export default PostDetails