import { useEffect, useState } from 'react';
import Map, { Marker, NavigationControl, Popup } from 'react-map-gl';
import RoomIcon from '@mui/icons-material/Room';
import StarIcon from '@mui/icons-material/Star'
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { format } from 'timeago.js'
import axios from 'axios'
import './app.css'

import 'mapbox-gl/dist/mapbox-gl.css';

function App() {
  const [viewport, setViewport] = useState({
    latitude: 46,
    longitude: 17,
    zoom: 4
  })
  const [pins, setPins] = useState([])
  const [loading, setLoading] = useState(true)

  const [showPopup, setShowPopup] = useState(true);

  useEffect(() => {
    const getPins = async () => {
      try {
        const allPins = await axios.get('/pins');
        setPins(allPins.data.pins);
        setLoading(false)
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    };

    getPins();
  }, []);


  if (loading) return <>Loading...</>

  return (
    <div className="App">
      <Map
        {...viewport}
        onMove={evt => setViewport(evt.viewState)}
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
                style={{ fontSize: viewport.zoom * 7, color: 'slateblue' }}
              // onClick={() => handleMarkerClick(p._id, p.lat, p.long)}
              />
            </Marker>
            {showPopup && (
              <Popup longitude={p.lng} latitude={p.lat}
                anchor='left'
                onClose={() => setShowPopup(false)}>
                <div className="card">
                  <label>Place</label>
                  <h4 className='place'>{p.title}</h4>
                  <label>Review</label>
                  <p className='desc'>{p.desc}</p>
                  <label>Rating</label>
                  <label>Information</label>
                  <div className="stars">
                    <StarIcon className='star' />
                    <StarIcon className='star' />
                    <StarIcon className='star' />
                    <StarIcon className='star' />
                    <StarIcon className='star' />
                  </div>
                  <label>Information</label>
                  <span className='username'>Created by <b>{p.username}</b></span>
                  <span className='date'>{format(p.createdAt)}</span>
                </div>
              </Popup>)
            }
          </>
        ))}
        <NavigationControl />
      </Map >
    </div>
  );
}

export default App;
