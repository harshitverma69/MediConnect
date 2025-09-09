import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const Login = () => {

  const [state, setState] = useState('Sign Up')

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const navigate = useNavigate()
  const { backendUrl, token, setToken } = useContext(AppContext)

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    if (state === 'Sign Up') {

      const registerUrl = `${backendUrl}/api/user/register`;
      console.log("Frontend: Sending registration request to:", registerUrl, "with data:", { name, email, password });
      try {
        const response = await fetch(registerUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name, email, password }),
        });
        const data = await response.json();
        console.log("Frontend: Received response from registration:", data);

        if (response.ok && data.success) {
          localStorage.setItem('token', data.token);
          setToken(data.token);
          console.log('Registration successful:', data.message);
          alert('Registration successful!');
        } else {
          const errorMessage = data.message || `HTTP error! status: ${response.status}`;
          toast.error(errorMessage);
          console.error('Registration failed:', errorMessage);
          alert(`Registration failed: ${errorMessage}`);
        }
      } catch (error) {
        toast.error(error.message || 'A network error occurred');
        console.error('Registration error:', error.message || 'A network error occurred');
        alert(`Registration error: ${error.message || 'A network error occurred'}`);
      }

    } else { // Login block
      const loginUrl = `${backendUrl}/api/user/login`;
      console.log("Frontend: Sending login request to:", loginUrl, "with data:", { email, password });
      try {
        const response = await fetch(loginUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });
        const data = await response.json();
        console.log("Frontend: Received response from login:", data);

        if (response.ok && data.success) {
          localStorage.setItem('token', data.token);
          setToken(data.token);
          console.log('Login successful:', data.message);
          alert('Login successful!');
        } else {
          const errorMessage = data.message || `HTTP error! status: ${response.status}`;
          toast.error(errorMessage);
          console.error('Login failed:', errorMessage);
          alert(`Login failed: ${errorMessage}`);
        }
      } catch (error) {
        toast.error(error.message || 'A network error occurred');
        console.error('Login error:', error.message || 'A network error occurred');
        alert(`Login error: ${error.message || 'A network error occurred'}`);
      }

    }

  }

  useEffect(() => {
    if (token) {
      navigate('/')
    }
  }, [token])

  return (
    <form onSubmit={onSubmitHandler} className='min-h-[80vh] flex items-center'>
      <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg'>
        <p className='text-2xl font-semibold'>{state === 'Sign Up' ? 'Create Account' : 'Login'}</p>
        <p>Please {state === 'Sign Up' ? 'sign up' : 'log in'} to book appointment</p>
        {state === 'Sign Up'
          ? <div className='w-full '>
            <p>Full Name</p>
            <input onChange={(e) => setName(e.target.value)} value={name} className='border border-[#DADADA] rounded w-full p-2 mt-1' type="text" required />
          </div>
          : null
        }
        <div className='w-full '>
          <p>Email</p>
          <input onChange={(e) => setEmail(e.target.value)} value={email} className='border border-[#DADADA] rounded w-full p-2 mt-1' type="email" required />
        </div>
        <div className='w-full '>
          <p>Password</p>
          <input onChange={(e) => setPassword(e.target.value)} value={password} className='border border-[#DADADA] rounded w-full p-2 mt-1' type="password" required />
        </div>
        <button className='bg-primary text-white w-full py-2 my-2 rounded-md text-base'>{state === 'Sign Up' ? 'Create account' : 'Login'}</button>
        {state === 'Sign Up'
          ? <p>Already have an account? <span onClick={() => setState('Login')} className='text-primary underline cursor-pointer'>Login here</span></p>
          : <p>Create an new account? <span onClick={() => setState('Sign Up')} className='text-primary underline cursor-pointer'>Click here</span></p>
        }
      </div>
    </form>
  )
}

export default Login