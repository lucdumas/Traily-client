import './register.css'
import '../app.css'
import { useRef, useState } from 'react'
import axios from 'axios'

export default function Register({ setShowRegister }) {
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(false)

  const nameRef = useRef()
  const emailRef = useRef()
  const passwordRef = useRef()

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newUser = {
      username: nameRef.current.value,
      email: emailRef.current.value,
      password: passwordRef.current.value,
    }
    try {
      await axios.post(
        'https://trailheadpin.herokuapp.com/api/users/register',
        newUser
      )
      setError(false)
      setSuccess(true)
    } catch (error) {
      setError(true)
    }
  }

  return (
    <div>
      <div className='formContainer'>
        <div className='logo1'>Register</div>
        <form onSubmit={handleSubmit}>
          <div className='form_all'>
            <div>
              <label>Username:</label>
              <input type='text' placeholder='username' ref={nameRef} />
            </div>
            <div>
              <label>Email:</label>
              <input type='email' placeholder='email' ref={emailRef} />
            </div>
            <div>
              <label>Password:</label>
              <input type='password' placeholder='password' ref={passwordRef} />
            </div>
          </div>
          <button className='registerBtn'>Register</button>
          {success && (
            <span className='success'>Successful. You can log in now</span>
          )}
          {error && <span className='failure'>Something went wrong</span>}
        </form>
        <h2
          className='formCancel'
          onClick={() => {
            setShowRegister(false)
          }}
        >
          x
        </h2>
      </div>
    </div>
  )
}
