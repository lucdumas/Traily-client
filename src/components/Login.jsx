import './login.css'
import { useRef, useState } from 'react'
import axios from 'axios'

export default function Login({ setShowLogin, myStorage, setCurrentUser }) {
  const [error, setError] = useState(false)
  const nameRef = useRef()
  const passwordRef = useRef()

  const handleSubmit = async (e) => {
    e.preventDefault()
    const user = {
      username: nameRef.current.value,
      password: passwordRef.current.value,
    }
    try {
      const res = await axios.post(
        'https://trailheadpin.herokuapp.com/api/users/login',
        user
      )
      myStorage.setItem('user', res.data.username)
      setCurrentUser(res.data.username)
      setShowLogin(false)
      setError(false)
    } catch (error) {
      setError(true)
    }
  }

  return (
    <div>
      <div className='formContainer'>
        <div className='logo'>Login</div>
        <form onSubmit={handleSubmit}>
          <div className='form_all'>
            <div>
              <label>Username:</label>
              <input type='text' placeholder='username' ref={nameRef} />
            </div>
            <div>
              <label>Password:</label>
              <input type='password' placeholder='password' ref={passwordRef} />
            </div>
          </div>
          <button className='loginBtn'>Login</button>

          {error && <span className='failure'>Something went wrong</span>}
        </form>
        <h2
          className='formCancel'
          onClick={() => {
            setShowLogin(false)
          }}
        >
          x
        </h2>
      </div>
    </div>
  )
}
