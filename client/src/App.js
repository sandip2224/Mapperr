import { useState } from 'react';
import Map, { Marker, NavigationControl } from 'react-map-gl';
import RoomIcon from '@mui/icons-material/Room';

import 'mapbox-gl/dist/mapbox-gl.css';

function App() {
  const [viewport, setViewport] = useState({
    latitude: 46,
    longitude: 17,
    zoom: 4
  })

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
        <Marker longitude={-122.4} latitude={37.8} anchor='bottom'>
          <RoomIcon style={{ fontSize: viewport.zoom * 7, color: 'slateblue' }} />
        </Marker>
        <NavigationControl />
      </Map>
    </div>
  );
}

export default App;
