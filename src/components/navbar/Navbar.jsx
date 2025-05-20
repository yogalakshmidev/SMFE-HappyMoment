import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AiOutlineClose, AiOutlineFileImage, AiOutlineLogout, AiOutlineSearch, AiOutlineUser } from 'react-icons/ai'
import {GiHamburgerMenu} from 'react-icons/gi'
import { logout, updateUser } from '../../redux/authSlice'
import { useDispatch, useSelector } from 'react-redux'
import man from '../../assets/man.jpg'
import classes from './navbar.module.css'
import { useState } from 'react'
import { useEffect } from 'react'

const Navbar = () => {
  const {token, user} = useSelector((state) => state.auth)
  const [searchText, setSearchText] = useState("")
  const [state, setState] = useState({})
  const [photo, setPhoto] = useState("")
  const handleState = (e) => {
    setState(prev => {
     return {...prev, [e.target.name]: e.target.value}
    })
  }

const [showModal, setShowModal] = useState(false)
const [showForm, setShowForm] = useState(false)

const [allUsers, setAllUsers] = useState([])
const [filteredUsers, setFilteredUsers] = useState([])
const dispatch = useDispatch()
const navigate = useNavigate()

// mobile
const [showMobileNav, setShowMobileNav] = useState(false)


// fetch all users
useEffect(() => {
  const fetchAllUsers = async() => {
    try {
      // API CALL
      const res = await fetch(`https://smbe-happymoment.onrender.com/user/findAll`)
      // const res = await fetch(`http://localhost:5000/user/findAll`)
      const data = await res.json()

      setAllUsers(data)
    } catch (error) {
      console.error(error)
    }
  }
  fetchAllUsers()

}, [])

useEffect(() => {
  if(searchText){
     setFilteredUsers(allUsers.filter((user) => user.username.includes(searchText)))
  } else {
    setFilteredUsers(allUsers)
  }
}, [searchText])

const handleLogout = () => {
  dispatch(logout())
  navigate('/login')
}

const handleShowForm = () => {
  setShowForm(true)
  setShowModal(false)
}

const handleUpdateProfile = async(e) => {
  e.preventDefault()
  let filename = null
  if(photo){
    const formData = new FormData()
    filename = crypto.randomUUID() + photo.name
    formData.append('filename', filename)
    formData.append('image', photo)
    // api call
    await fetch(`https://smbe-happymoment.onrender.com/upload/image`,{
    // await fetch(`http://localhost:5000/upload/image`, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      method: 'POST',
      body: formData
    })
  }
    

  try {
    // api call
    const res = await fetch(`https://smbe-happymoment.onrender.com/user/updateUser/${user._id}`,{
    // const res = await fetch(`http://localhost:5000/user/updateUser/${user._id}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      method: "PUT",
      body: JSON.stringify({...state, profileImg: filename})
    })
    
    const data = await res.json()
    setShowForm(false)
    dispatch(updateUser(data))
    window.location.reload()
  } catch (error) {
    console.error(error)
  }
}


return (
  <div className={classes.container}>
    <div className={classes.wrapper}>
      <div className={classes.left}>
        <Link to='/'>
          Happy Moments
        </Link>
      </div>
      <div className={classes.center}>
        <input value={searchText} onChange={(e) => setSearchText(e.target.value)} type="text" placeholder="Search user..." />
        <AiOutlineSearch className={classes.searchIcon} />
        {searchText && (
          <div onClick={() => setSearchText("")} className={classes.allUsersContainer}>
            {filteredUsers?.map((user) => (
              <Link to={`/profileDetail/${user._id}`} key={user._id}>
                <img src={man} alt='navbarImg'/>
                <div className={classes.userData}>
                  <span>{user?.username}</span>
                  <span>{user?.bio?.slice(0, 10)}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
      <div className={classes.right}>
        <Link to='/upload' style={{ textDecoration: 'none', color: 'inherit' }}>
          Upload
        </Link>
        <div className={classes.icons}>
          <AiOutlineUser />
          <AiOutlineLogout onClick={handleLogout} />
        </div>
        <img src={man} alt='' className={classes.profileUserImg} onClick={() => setShowModal(prev => !prev)} />
        {showModal &&
          <div className={classes.modal}>
            <span onClick={handleShowForm}>Update Profile</span>
          </div>
        }
      </div>
        {
          showForm &&
          <div className={classes.updateProfileForm} onClick={() => setShowForm(false)}>
            <div className={classes.updateProfileWrapper} onClick={(e) => e.stopPropagation()}>
              <h2>Update Profile</h2>
              <form className='flex flex-col gap-2' onSubmit={handleUpdateProfile}>
                <input type="text" placeholder='Username' name="username" className=' border-2 border-solid border-teal-600 p-px m-px' onChange={handleState} />
                <input type="email" placeholder='Email' name="email" className='border-2 border-solid border-teal-600 p-px m-px' onChange={handleState} />
                <input type="text" placeholder='Bio' name="bio" className='border-2 border-solid border-teal-600 p-px m-px' onChange={handleState} />
                <input type="password" placeholder='Password' name="password" className='border-2 border-solid border-teal-600 p-px m-px' onChange={handleState} />
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '50%' }}>
                  <label htmlFor='photo'>Profile Picture <AiOutlineFileImage /></label>
                  <input
                    type="file"
                    id='photo'
                    placeholder='Profile picture'
                    style={{ display: 'none' }}
                    className='border-2 border-solid border-teal-600 p-px m-px'
                    onChange={(e) => setPhoto(e.target.files[0])}
                  />
                  {/* {photo && <p>{photo.name}</p>} */}
                </div>
                <button>Update profile</button>
              </form>
              <AiOutlineClose onClick={() => setShowForm(false)} className={classes.removeIcon} />
            </div>
          </div>
        }
    </div>
    {
        <div className={classes.mobileNav}>
          {showMobileNav &&
            <div className={classes.navigation}>
              <div className={classes.left} onClick={() => setShowMobileNav(false)}>
                <Link to='/'>Happy Moments</Link>
              </div>
              <AiOutlineClose className={classes.mobileCloseIcon} onClick={() => setShowMobileNav(false)} />
              <div className={classes.center}>
                <input value={searchText} type="text" placeholder='Search user...' onChange={(e) => setSearchText(e.target.value)} />
                <AiOutlineSearch className={classes.searchIcon} />
                {searchText && (
                  <div onClick={() => setSearchText("")} className={classes.allUsersContainer}>
                    {filteredUsers?.map((user) => (
                      <Link to={`/profileDetail/${user._id}`} key={user._id} onClick={() => setShowMobileNav(false)}>
                        {/* api call for images */}
                      <img alt='profileImg' src={user?.photo ? `https://smbe-happymoment.onrender.com/images/${user.photo}` : man} />
                        {/* <img alt='profileImg src={user?.photo ? `http://localhost:5000/images/${user.photo}` : man} /> */}
                        <div className={classes.userData}>
                          <span>{user?.username}</span>
                          <span>{user?.bio?.slice(0, 10)}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
              <div className={classes.right}>
                <Link style={{ textDecoration: 'none', color: 'inherit' }} to='/upload' onClick={() => setShowMobileNav(false)}>Upload</Link >
                <div className={classes.icons} onClick={() => setShowMobileNav(false)}>
                  <AiOutlineUser onClick={() => navigate(`/profileDetail/${user._id}`)} />
                  <AiOutlineLogout onClick={handleLogout} />
                </div>
                <img
                alt='userImg'
                  onClick={() => setShowModal(!showModal)}
                  // api call for images  
                  src={user?.profileImg ? `https://smbe-happymoment.onrender.com/images/${user?.profileImg}` : man}
                  // src={user?.profileImg ? `http://localhost:5000/images/${user?.profileImg}` : man}
                  className={classes.profileUserImg}
                />
                {showModal && (
                  <div className={classes.modal}>
                    <span onClick={handleShowForm}>Update Profile</span>
                  </div>
                )}
              </div>
              {showForm &&
                <div className={classes.updateProfileForm} onClick={() => setShowForm(false)}>
                <div className={classes.updateProfileWrapper} onClick={(e) => e.stopPropagation()}>
                  <h2>Update Profile</h2>
                  <form onSubmit={handleUpdateProfile}>
                    <input type="text" placeholder='Username' name="username" onChange={handleState} />
                    <input type="email" placeholder='Email' name="email" onChange={handleState} />
                    <input type="text" placeholder='Bio' name="bio" onChange={handleState} />
                    <input type="password" placeholder='Password' name="password" onChange={handleState} />
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '50%' }}>
                      <label htmlFor='photo'>Profile Picture <AiOutlineFileImage /></label>
                      <input
                        type="file"
                        id='photo'
                        placeholder='Profile picture'
                        style={{ display: 'none' }}
                        onChange={(e) => setPhoto(e.target.files[0])}
                      />
                      {photo && <p>{photo.name}</p>}
                    </div>
                    <button>Update profile</button>
                  </form>
                  <AiOutlineClose onClick={() => setShowForm(false)} className={classes.removeIcon} />
                </div>
              </div>}
            </div>}
          {!showMobileNav && <GiHamburgerMenu onClick={() => setShowMobileNav(prev => !prev)} className={classes.hamburgerIcon} />}
        </div>
      }
    </div>
  )
}

export default Navbar