import React,{useState} from 'react'
import {Link,useNavigate} from 'react-router-dom'
import img from '../../assets/woman.jpg'
import {login} from '../../redux/authSlice'
import {useDispatch} from 'react-redux'
// import {BACKEND_URL} from 'dotenv'
// require('dotenv').config()

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  

  const handleLogin = async(e) => {
    e.preventDefault()

    if(email === '' || password === '') return

    try {
      
      // api call
      const res = await fetch(`https://smbe-happymoment.onrender.com/auth/login`,{
      // const res = await fetch(`http://localhost:5000/auth/login`, {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({email, password})
      })

      const data = await res.json()

      dispatch(login(data))
      navigate('/')
    } catch (error) {
      setError(true)
      setTimeout(() => {
        setError(false)
      }, 3000)
    }
  }

  return (
    <div className='flex items-center justify-center w-full h-full absolute top-0 left-0 z-10 bg-center bg-blend-darken bg-slate-200 bg-cover'>
    <div className='flex flex-row-reverse items-center justify-center h-2/3 w-1/2 rounded-3xl'>
    <div className='flex grow h-full w-1/2'>
      <img src={img} alt='loginimg' className='w-full h-full object-cover'/>
      </div>
      <div className='flex grow bg-white h-full w-full overflow-hidden'>
      <h2 className='flex justify-center text-center text-red-400 text-4xl mt-10 '>Login</h2>
      <form onSubmit={handleLogin} className='flex flex-col mt-10 gap-8 items-center justify-center overflow-hidden'>
        <input className='outline-none transition-all w-4/5 border-b-2 divide-solid border-cyan-400 pl-1 rounded-none  focus:pl-3 ' type = 'email' placeholder='Email Id' onChange={(e) => setEmail(e.target.value)} />
        <input className='outline-none  transition-all w-4/5 border-b-2 divide-solid border-cyan-400 pl-1 rounded-none focus:pl-3' type = 'password' placeholder='Password' onChange={(e) => setPassword(e.target.value)} />
        <button className='outline-none cursor-pointer rounded-3xl text-xl font-medium text-white bg-red-600 px-4 py-2 ring-3 hover:border-red-600 border-2 hover:bg-white hover:text-red-400 '>Login</button>
    <p className='flex justify-center flex-col text-center text-black'>Don't have an account?
      <Link to='/signup' className='mt-1 text-lg text-neutral-500'>Sign up
</Link></p>    
    </form>
    {
      error &&(
        <div className='h-16 w-64 text-center rounded-3xl leading-6 px-6 py-3 text-white bg-red-600 absolute top-20 right-20'>
          Wrong Credentials! Try different ones
          </div>
      )
    }
      </div>
      </div>  
      </div>
  )
}

export default Login