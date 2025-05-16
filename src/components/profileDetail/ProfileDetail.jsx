import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {useParams} from 'react-router-dom'
import man from '../../assets/man.jpg'
import { handleFollow } from '../../redux/authSlice'
import PostPhoto from '../postPhoto/PostPhoto'


const ProfileDetail = () => {
  const [profile, setProfile] = useState('')
  const [profilePosts, setProfilePosts] = useState([])
  const {user, token} = useSelector((state) => state.auth)
  const [isFollowed, setIsFollowed] = useState(false)
  const [show, setShow] = useState('mypost')
  const dispatch = useDispatch()
  const {id} = useParams()

  // fetch profile
  useEffect(() => {
    const fetchProfile = async() => {
       try {
        // api call
        const res = await fetch(`https://smbe-happymoment.onrender.com/user/find/${id}`,{
        //  const res = await fetch(`http://localhost:5000/user/find/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        const data  = await res.json()
        setProfile(data)

        if(user?._id !== data?._id){
          setIsFollowed(user?.followings?.includes(data?._id))
        }
       } catch (error) {
        console.error(error)
       }
    }
    fetchProfile()
  }, [id])

  // fetch profile posts
  useEffect(() => {
    const fetchProfilePosts = async() => {
      try {
        // api call

        const res = await fetch(`https://smbe-happymoment.onrender.com/post/find/userposts/${id}`)
        // const res = await fetch(`http://localhost:5000/post/find/userposts/${id}`)

        const data = await res.json()

        setProfilePosts(data)
      } catch (error) {
        console.error(error)
      }
    }
    fetchProfilePosts()
  }, [id])

  // handle follow function
  const handleFollowFunction = async() => {
    try {
      // api call       
      await fetch(`https://smbe-happymoment.onrender.com/user/toggleFollow/${profile?._id}`, {
      // await fetch(`http://localhost:5000/user/toggleFollow/${profile?._id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        method: "PUT"
      })

      dispatch(handleFollow(id))

      setProfile((prev) => {
        return {
           ...prev,
           followers: isFollowed
           ? [...prev.followers].filter((id) => id !== user._id)
           : [...prev.followers, user._id]
        }
      })
      setIsFollowed(prev => !prev)
    } catch (error) {
      console.error(error)
    }
  }

  console.log(user.bookmarkedPosts)
  return (
    <div className='w-full max-h-full min-h-fit'>
      <div className='flex flex-col items-center mt-6 h-full w-5/6'>
        <div className='flex items-center gap-10'>
          <div className='h-20 w-20'>
            <img 
            // api call            
            src={profile?.profileImg ? `https://smbe-happymoment.onrender.com/images/${profile?.profileImg}` : man}
            //  src={profile?.profileImg ? `http://localhost:5000/images/${profile?.profileImg}` : man}
             className='w-full h-full object-cover rounded-2xl '
            />
          </div>
          <div className='flex flex-col gap-3'>
            <h4 className='capitalize text-2xl text-cyan-700 font-bold'>{profile?.username}</h4>
            <h4 className='font-medium text-teal-900'>Bio: {profile?.desc ? profile.desc : 'Life is full of adventures'}</h4>
          </div>
          {
            profile?._id !== user._id &&
            <button onClick={handleFollowFunction} className='outline-none py-1 px-3 bg-neutral-500 border border-transparent border-solid cursor-pointer rounded-lg text-white text-lg hover:bg-neutral-900'>{isFollowed ? "Unfollow" : "Follow"}</button>
          }
        </div>
        <div className='flex justify-between gap-40 mx-10'>
          <div className='font-bold text-xl text-cyan-950'>
            Followings: {profile?.followings?.length}
          </div>
          <div className='font-bold text-xl text-cyan-950'>
           Followers: {profile?.followers?.length}
          </div>
        </div>
        {
          user._id === profile?._id &&
          <div className='flex justify-between gap-32 m-6'>
             <button onClick={() => setShow("mypost")} className={`${show === 'mypost' && 'outline-none border-none py-2 px-5 bg-slate-400 text-white rounded-xl cursor-pointer text-xl hover:bg-slate-300 active:bg-slate-600'}`}>My posts</button>
             <button onClick={() => setShow("bookmarked")} className={`${show === 'bookmarked' && 'outline-none border-none py-2 px-5 bg-slate-400 text-white rounded-xl cursor-pointer text-xl  hover:bg-slate-300 active:bg-slate-700'}`}>Bookmarked</button>
          </div>
        }
        {(show === 'mypost' && profilePosts?.length > 0) ?
        <div className='mt-4 grid grid-cols-3 gap-10'>
          {profilePosts?.map((post) => (
            <PostPhoto post={post} key={post._id}/>
          ))}
        </div>
        : show === 'mypost' ? <h2>Profile has no posts</h2> : ''}
       {(show === 'bookmarked' && profilePosts?.length > 0) ?
        <div className='flex'>
          {user?.bookmarkedPosts?.map((post) => (
            <PostPhoto post={post} key={post._id}/>
          ))}
        </div>
        : show === 'bookmarked' ? <h2>You have no bookmarked posts</h2> : ''}
      </div>
    </div>
  )
}

export default ProfileDetail