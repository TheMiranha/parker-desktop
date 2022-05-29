import { useEffect, useState } from 'react'
import Routing from './Routing'

import 'leaflet/dist/leaflet.css'
import {
  MapContainer,
  Popup,
  Marker,
  TileLayer,
  useMap,
  MinimapBounds
} from 'react-leaflet'
import L from 'leaflet'
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css'
import 'leaflet-routing-machine'
import Geo from '../../../Geo'
import { KeyboardBackspace } from '@mui/icons-material'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
})

const render = (props) => {
  const [screen, setScreen] = useState('wait')
  const [error, setError] = useState(false)
  const [points, setPoints] = useState(false)

  const search = (p1, p2) => {
    Geo.searchAdress(p1).then(p1data => {
      Geo.searchAdress(p2).then(p2data => {
        if (p1data == undefined || p2data == undefined) {
          setError('Local não encontrado')
        } else {
          p1 = [p1data.lat, p1data.lon]
          p2 = [p2data.lat, p2data.lon]
          setPoints({ p1, p2 })
          setScreen('route')
        }
      })
    })
  }

  return (
    <>
      {error != false ? (
        <div
          className='alert alert-error shadow-lg'
          style={{ position: 'absolute', bottom: 10, right: 10, width: 500 }}
        >
          <div>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              className='stroke-info flex-shrink-0 w-6 h-6'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
              ></path>
            </svg>
            <span>{error}</span>
          </div>
          <div className='flex-none'>
            <button
              onClick={() => {
                setError(false)
              }}
              className='btn btn-sm btn-ghost'
            >
              ok
            </button>
          </div>
        </div>
      ) : (
        false
      )}
      {screen == 'wait' ? (
        <WaitInput setScreen={props.setScreen} search={search} />
      ) : screen == 'route' ? (
        <Route setScreen={setScreen} points={points} />
      ) : (
        setScreen('wait')
      )}
    </>
  )
}

const WaitInput = ({ search, setScreen }) => {
  const [p1, setP1] = useState('')
  const [p2, setP2] = useState('')

  return (
    <div>
      <p style={{ fontSize: 25, width: '100%', textAlign: 'center' }}>
        Vamos começar
      </p>
      <div style={{ marginTop: 10 }} class='form-control'>
        <label class='input-group input-group-md'>
          <span>Origem</span>
          <input
            value={p1}
            onChange={e => setP1(e.target.value)}
            type='text'
            placeholder='Digite aqui...'
            class='input input-bordered input-md'
          />
        </label>
      </div>
      <div style={{ marginTop: 5 }} class='form-control'>
        <label class='input-group input-group-md'>
          <span>Destino</span>
          <input
            value={p2}
            onChange={e => setP2(e.target.value)}
            type='text'
            placeholder='Digite aqui...'
            class='input input-bordered input-md'
          />
        </label>
      </div>
      <div
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: 20
        }}
      >
        <div class='btn-group'>
          <button class='btn' onClick={() => setScreen('welcome')}><KeyboardBackspace/></button>
          <button onClick={() => search(p1, p2)} class='btn btn-active'>
            Pesquisar
          </button>
        </div>
      </div>
    </div>
  )
}

const Route = ({ points, setScreen }) => {
  return (
    <div>
      <MapContainer
        center={points.p1}
        zoom={13}
        style={{ height: '80vh', width: '75vw' }}
        attributionControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        />
        <Routing p1={points.p1} p2={points.p2} />
      </MapContainer>
      <div style={{marginTop: 20, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <button class="btn" onClick={() => {
          setScreen('wait')
        }}><KeyboardBackspace/></button>
      </div>
    </div>
  )
}

export default render
