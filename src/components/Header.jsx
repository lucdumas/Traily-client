import React from 'react'
import './header.css'
import Register from '../components/Register'
import Login from '../components/Login'

function Header({ userbuttons }) {
  return (
    <>
      <div className='header'>
        <div className='heading'>
          <h1>TrailHead Map</h1>
          <p>Find and mark your favorite trailheads </p>
        </div>
      </div>
    </>
  )
}

export default Header
