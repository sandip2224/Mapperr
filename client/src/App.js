import { useEffect, useState } from 'react';
import Map, { Marker, Popup } from 'react-map-gl';
import StarIcon from '@mui/icons-material/Star'
import StarBorderIcon from '@mui/icons-material/StarBorder'
import RoomIcon from '@mui/icons-material/Room'

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { format } from 'timeago.js'
import axios from 'axios'

import './app.css'
import 'mapbox-gl/dist/mapbox-gl.css';
import Register from './components/Register';

function App() {
  const myStorage = window.localStorage;

  const [viewport, setViewport] = useState({
    latitude: 46,
    longitude: 17,
    zoom: 4
  })

  const [currentUser, setCurrentUser] = useState(myStorage.getItem('user'));
  const [pins, setPins] = useState([])
  const [currentPlaceId, setCurrentPlaceId] = useState(null)
  const [newPlace, setNewPlace] = useState(null);
  const [loading, setLoading] = useState(true)

  const [title, setTitle] = useState(null);
  const [desc, setDesc] = useState(null);
  const [star, setStar] = useState(0);

  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    const getPins = async () => {
      try {
        const allPins = await axios.get('/pins');
        setPins(allPins.data.pins);
        toast.success('Fetched all pins!')
        setLoading(false)
      } catch (err) {
        console.log(err);
        toast.error('Could not fetch pins!')
        setLoading(false);
      }
    };

    getPins();
  }, []);

  const handleMarkerClick = (id, lat, lng) => {
    setCurrentPlaceId(id)
    setViewport({ ...viewport, latitude: lat, longitude: lng });
  }

  const handleAddClick = (e) => {
    const { lng, lat } = e.lngLat
    setNewPlace({ lat, lng })
  }

  const handleLogout = () => {
    setCurrentUser(null);
    myStorage.removeItem("user");
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    const newPin = {
      username: currentUser,
      title,
      desc,
      rating: star,
      lat: newPlace.lat,
      lng: newPlace.lng,
    };

    try {
      const res = await axios.post('/pins', newPin);
      setPins([...pins, res.data.pin]);
      setNewPlace(null);
    } catch (err) {
      console.log(err);
    }
  };



  if (loading) return <div className="App">Loading...</div>

  return (
    <div className="App">
      <Map
        {...viewport}
        onMove={evt => setViewport(evt.viewState)}
        onDblClick={handleAddClick}
        style={{
          width: '100vw',
          height: '100vh'
        }}
        mapStyle='mapbox://styles/mapbox/outdoors-v12'
        mapboxAccessToken={process.env.REACT_APP_MAPBOX_KEY}
      >
        {pins && pins.map(p => (
          <>
            <Marker longitude={p.lng} latitude={p.lat} anchor='bottom'>
              <RoomIcon
                style={{ fontSize: viewport.zoom * 8, cursor: 'pointer', color: p.username === currentUser ? 'tomato' : 'slateblue' }}
                onClick={() => handleMarkerClick(p._id, p.lat, p.lng)}
              />
            </Marker>
            {p._id === currentPlaceId &&
              (<Popup longitude={p.lng} latitude={p.lat} key={p._id} anchor='left'
                closeButton={true}
                closeOnClick={false}
                onClose={() => setCurrentPlaceId(null)}
              >
                <div className="card">
                  <label>Place</label>
                  <h4 className='place'>{p.title}</h4>
                  <label>Review</label>
                  <p className='desc'>{p.desc}</p>
                  <label>Rating</label>
                  <label>Information</label>
                  <div className="stars">
                    {Array(p.rating).fill(<StarIcon className='star' />)}
                  </div>
                  <label>Information</label>
                  <span className='username'>Created by <b>{p.username}</b></span>
                  <span className='date'>{format(p.createdAt)}</span>
                </div>
              </Popup>)
            }
          </>
        ))}
        {newPlace &&
          (<Popup longitude={newPlace.lng} latitude={newPlace.lat} anchor='left'
            closeButton={true}
            closeOnClick={false}
            onClose={() => setNewPlace(null)}
          >
            <div>
              <form onSubmit={handleSubmit}>
                <label>Title</label>
                <input
                  placeholder="Enter a title"
                  autoFocus
                  onChange={e => setTitle(e.target.value)}
                />
                <label>Description</label>
                <textarea
                  placeholder="Say us something about this place."
                  onChange={e => setDesc(e.target.value)}
                />
                <label>Rating</label>
                <select onChange={e => setStar(e.target.value)}>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
                <button type="submit" className="submitButton">
                  Add Pin
                </button>
              </form>
            </div>
          </Popup>)
        }
        {/* <NavigationControl /> */}
        {currentUser ? (
          <button className="button logout" onClick={handleLogout}>
            Log out
          </button>
        ) : (
          <div className="buttons">
            <button className="button login" onClick={() => setShowLogin(true)}>
              Log in
            </button>
            <button
              className="button register"
              onClick={() => setShowRegister(true)}
            >
              Register
            </button>
          </div>
        )}
        {showRegister && <Register setShowRegister={setShowRegister} />}
        {showLogin && (
          <></>
          // <Login
          //   setShowLogin={setShowLogin}
          //   setCurrentUsername={setCurrentUser}
          //   myStorage={myStorage}
          // />
        )}
      </Map >
      <ToastContainer
        autoClose={2000}
        position="bottom-center"
      />
    </div>
  );
}

export default App;
