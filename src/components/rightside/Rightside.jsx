import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import {useSelector} from 'react-redux'
import {Link} from 'react-router-dom'
import man from '../../assets/man.jpg'
import { capitalizeFirstLetter } from '../../util/capitalizeFirstLetter'

const Rightside = () => {
  const [friends, setFriends] = useState([])
  const {user, token} = useSelector((state) => state.auth)

  useEffect(() => {
    const fetchFriends = async() => {
      try {
        // api call
        const res= await fetch(`https://smbe-happymoment.onrender.com/user/find/friends`,{
        // const res = await fetch(`http://localhost:5000/user/find/friends`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        const data = await res.json()

        setFriends(data)        
      } catch (error) {
        console.error(error)
      }
  }
  fetchFriends()
  }, [user.followings])

  return (
    <div className='h-fit w-full'>
      <div className='flex flex-col items-center gap-10'>
        <h1 className='text-2xl text-teal-900 font-bold '>Friends List</h1>
        {friends?.length > 0 ? (
          friends?.map((friend) => (
             <Link className='flex items-center gap-2' to={`/profileDetail/${friend._id}`} key={friend._id}>
              <img  alt='sugg_img' src={man} className='w-14 h-14 rounded-2xl object-cover'/>
              <div className='flex'>
                <span className='text-lg font-medium'>{capitalizeFirstLetter(friend.username)}</span>
              </div>
             </Link>
          ))
        )
         : <span>You currently have no friends. Follow someone!</span>}
      </div>
    </div>
  )
}

export default Rightside