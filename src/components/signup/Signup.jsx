import React,{useState} from 'react'
import {Link,useNavigate} from 'react-router-dom'
import img from '../../assets/woman2.jpg'
import {register} from '../../redux/authSlice'
import {useDispatch} from 'react-redux'
// import {BACKEND_URL} from 'dotenv'
// require('dotenv').config()

const Signup = () => {
  const [username,setUsername] = useState("")
  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")
  const [error,setError] = useState(false)
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const backendUrl = process.env.BACKEND_URL;
  const handleSignup = async(e)=> {
    e.preventDefault()
    if(username === '' || email === '' || password === '') return
    console.log(username, email, password)

    try {
      console.log("backend url is",backendUrl)
      const res = await fetch(`http://localhost:5000/auth/register`, {
        headers: {
          'Content-Type': 'application/json'
        },
        method: "POST",
        body: JSON.stringify({username, email, password})
      })
      console.log(res)
      
      const data = await res.json()
      console.log(data)
      dispatch(register(data))
      navigate('/')
  }catch (error) {
      setError(true);
      setTimeout(() => {
        setError(false)
      }, 3000)
    }
  }
  return (
    <div className='flex items-center justify-center w-screen h-screen bg-red-400 absolute bg-black bg-blend-darken bg-center bg-cover'>
      <div className='flex items-center justify-center h-2/3 w-1/2 rounded-3xl'>
      <div className='flex w-1/2 h-full'>
      <img src={img} className='w-full h-full object-cover'/>
    </div>
    <div className='flex flex-col bg-white h-full w-full overflow-hidden'>
      <h2 className='text-center text-4xl m-10 text-teal-800'>Sign Up</h2>
      <form  onSubmit={handleSignup} className='flex flex-col mt-10 gap-8 items-center justify-center overflow-hidden'>
        <input className='outline-none rounded-none transition-all w-1/2 border-b-2 divide-solid p-1 focus:pl-3' type='text' placeholder="Username"  onChange={(e) => setUsername(e.target.value)}/>
        <input  className='outline-none rounded-none transition-all w-1/2 border-b-2 divide-solid p-1 focus:pl-3'  type='email' placeholder="Email Id" onChange={(e) => setEmail(e.target.value)}/>
        <input className='outline-none rounded-none transition-all w-1/2 border-b-2 divide-solid p-1 focus:pl-3'  type='password' placeholder="Password" onChange={(e) => setPassword(e.target.value)}/>
        <button type='submit' className='outline-none cursor-pointer rounded-3xl text-xl font-medium text-white bg-red-600 px-4 py-2 ring-3 hover:border-red-600 border-2 hover:bg-white hover:text-red-400'>Sign Up</button>
        <p className='flex flex-col justify-center text-center text-black'>Already have an account? <Link to='/login' className='mt-1 text-lg'>Login</Link></p>
        
        </form>
        {
          error && (
            <div className='h-16 w-64 text-center rounded-3xl leading-6 px-6 py-3 text-white bg-red-600 absolute top-20 right-20'>
              Wrong Credentials ! Try different ones
            </div>
          )
        }
    </div>
      </div>
    </div>
  )
}

export default Signup