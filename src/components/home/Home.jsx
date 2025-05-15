import React from 'react'
import ProfileCard from '../profileCard/ProfileCard'
import SuggestedUsers from '../suggestedUsers/SuggestedUsers'
import Posts from '../posts/Posts'
import Rightside from '../rightside/Rightside'


const Home = () => {
  return (
    <div className="flex justify-between gap-1 w-4/5 m-10">
      <div className="flex flex-col">
        <ProfileCard/>
        <SuggestedUsers/>
      </div>
      <div className="flex flex-col">
      <Posts/></div>
      <div className="flex flex-col">
      <Rightside/></div>
    </div>
  )
}

export default Home