import * as React from 'react'
import { useState, useEffect } from 'react'
import Map, { Marker, Popup } from 'react-map-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import ReactMapGL from 'react-map-gl'

import Register from './components/Register'
import Login from './components/Login'
import './app.css'
import axios from 'axios'
import { format } from 'timeago.js'
import Header from './components/Header'

const MAPBOX_TOKEN =
  'pk.eyJ1IjoibHVjZHVtYXMiLCJhIjoiY2w0c3QyNjJ2MDBkbjNkdDBiZ2FzbDF2YyJ9.CJvFqizTHtNF0Njjk-b6Ug'

function App() {
  const myStorage = window.localStorage
  const [currentUser, setCurrentUser] = useState(myStorage.getItem('user'))
  const [pins, setPins] = useState([])
  const [currentPlaceId, setCurrentPlaceId] = useState(null)
  const [newPlace, setNewPlace] = useState(null)
  const [showPopup, setShowPopup] = useState(true)
  const [title, setTitle] = useState(null)
  const [desc, setDesc] = useState(null)
  const [showRegister, setShowRegister] = useState(false)
  const [showLogin, setShowLogin] = useState(false)

  useEffect(() => {
    const getPins = async () => {
      try {
        const res = await axios.get(
          'https://trailheadpin.herokuapp.com/api/pins'
        )
        setPins(res.data)
      } catch (error) {
        console.log(error)
      }
    }
    getPins()
  }, [])

  const handleMarkerClick = (id, lat, long) => {
    setCurrentPlaceId(id)
  }

  const handleAddClick = (e) => {
    let findEntries = Object.entries(e)
    let lat = findEntries[1][1].lat
    let long = findEntries[1][1].lng

    currentUser &&
      setNewPlace({
        lat: lat,
        long: long,
      })
  }

  const handleSubmit = async (e) => {
    const newPin = {
      username: currentUser,
      title,
      desc,
      lat: newPlace.lat,
      long: newPlace.long,
    }

    try {
      const res = await axios.post(
        'https://trailheadpin.herokuapp.com/api/pins',
        newPin
      )
      setPins([...pins], res.data)
      setNewPlace(null)
      console.log(pins)
    } catch (error) {
      console.log(error)
    }
  }
  const handleLogout = () => {
    myStorage.removeItem('user')
    setCurrentUser(null)
  }

  return (
    <div className='page'>
      <Header />
      <Map
        initialViewState={{
          latitude: 46,
          longitude: 17,
          zoom: 2,
        }}
        style={{ height: 'calc(100vh)', width: '100%' }}
        mapStyle='mapbox://styles/mapbox/outdoors-v11
'
        mapboxAccessToken={MAPBOX_TOKEN}
        onDblClick={handleAddClick}
      >
        {pins.map((p) => (
          <>
            <Marker
              longitude={p.long}
              latitude={p.lat}
              color={p.username === currentUser ? '#22c55e' : '#94a3b8'}
              cursor='pointer'
              onClick={() => handleMarkerClick(p._id, p.lat, p.long)}
              scale='1.25'
            />

            {p._id === currentPlaceId && (
              <Popup
                longitude={p.long}
                latitude={p.lat}
                closeButton={false}
                closeOnMove={true}
                closeOnClick={false}
                anchor='left'
                offset={10}
                onClose={() => setCurrentPlaceId(null)}
              >
                <div className='formContainer1'>
                  <label className='title1'>Place</label>
                  <h4 className='place'>{p.title}</h4>
                  <label className='title1'>Description</label>
                  <p className='desc'>{p.desc}</p>

                  <label className='title1'> Information</label>
                  <span className='username'>
                    Created by <b>{p.username}</b>
                  </span>
                  <span className='date'>{format(p.createdAt)}</span>
                </div>
              </Popup>
            )}
          </>
        ))}
        {newPlace && (
          <Popup
            latitude={newPlace.lat}
            longitude={newPlace.long}
            anchor='left'
            onClose={() => setNewPlace(null)}
          >
            <div className='formContainer'>
              <div className='logo3'>Add a Pin</div>
              <form onSubmit={handleSubmit}>
                <div className='form_all'>
                  <label>Title</label>
                  <input
                    placeholder='Enter a title'
                    onChange={(e) => setTitle(e.target.value)}
                  />
                  <label>Description</label>
                  <input
                    placeholder='Describe the trail'
                    onChange={(e) => setDesc(e.target.value)}
                  />
                </div>
                <button className='formBtn' type='submit'>
                  Add
                </button>
              </form>
            </div>
          </Popup>
        )}
        {currentUser ? (
          <button className='button logout' onClick={handleLogout}>
            Log out
          </button>
        ) : (
          <div className='buttons'>
            <button
              className='button register'
              onClick={() => setShowRegister(true)}
            >
              Register
            </button>
            <button className='button login' onClick={() => setShowLogin(true)}>
              Log in
            </button>
          </div>
        )}
        {showRegister && <Register setShowRegister={setShowRegister} />}
        {showLogin && (
          <Login
            setShowLogin={setShowLogin}
            myStorage={myStorage}
            setCurrentUser={setCurrentUser}
          />
        )}
      </Map>
    </div>
  )
}

export default App
