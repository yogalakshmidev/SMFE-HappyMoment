import React from 'react'
import man from '../../assets/man.jpg'
import {capitalizeFirstLetter} from '../../util/capitalizeFirstLetter'
import {format} from 'timeago.js'
import {Link} from 'react-router-dom'
import { useSelector } from 'react-redux'

const ProfileCard = () => {

  const {user}= useSelector((state)=>state.auth)

  return (
    <div className='flex flex-col h-80 w-full rounded-3xl border border-2 ring-2 divide-solid items-center justify-center '>
      <div className='h-full py-1 px-2 bg-slate-100'>
      <div className='w-full h-1/2'>
      <div className='flex items-center justify-center w-full'>
      <img alt='profileImg' src={man} className='h-11 w-11 object-cover rounded-2xl '/>
      </div>
      <div className='flex flex-col text-center gap-1 mt-4'>
      
        <p><span className='font-medium text-lg'>Username:</span>{capitalizeFirstLetter(user.username)}</p>
        <p><span className='font-medium text-lg'>Created At:</span>{format(user.createdAt)}</p>
      </div>
      </div>
      <hr className='mt-5'/>
      <div className='flex items-center justify-start gap-1 mt-5 w-full h-1/2'>
        <p className='font-semibold mt-1'>Followers:<span className='font-normal'>{user.followers.length}</span></p>
        <p className='font-semibold mt-1'>Followings:<span className='font-normal'>{user.followings.length}</span></p>
      </div>
      
      </div>
      <Link to={`/profileDetail/${user._id}`}>
      <h3 className='cursor-pointer mb-3 text-xl decoration-0 text-teal-800 transition-all hover:text-neutral-800'>My Profile</h3>
      </Link>
      </div>

  )
}

export default ProfileCard