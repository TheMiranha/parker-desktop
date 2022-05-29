import { useEffect, useState } from 'react'
import Apis from '../../../Geo'
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import 'leaflet/dist/leaflet.css'
import { CircleMarker } from 'react-leaflet'
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
import { setDefaultResultOrder } from 'dns';

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
})

const render = (props) => {
  const [search, setSearch] = useState('')
  const [data, setData] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false);

  const execSearch = () => {
    if (search.trim().length > 0)
    {
      Apis.searchAdress(search).then(d => {
        console.log(d)
        setData(d)
      })
    } else {
      setError('Digite algum local')
    }
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
    {
      data == false ? (
        <WaitInput setScreen={props.setScreen} search={search} setSearch={setSearch} execSearch={execSearch} />
      ) : (
        <RenderMap setData={setData} setSearch={setSearch} data={data} />
      )
    }</>
  )
}

const RenderMap = ({ data, setSearch, setData }) => {
  return (
    <div>
      <input type='checkbox' id='my-modal-3' className='modal-toggle' />
      <div className='modal'>
        <div style={{ marginLeft: 150 }} className='modal-box relative'>
          <label
            htmlFor='my-modal-3'
            className='btn btn-sm btn-circle absolute right-2 top-2'
          >
            ✕
          </label>
          <h3 className='text-lg font-bold'>Mais Informações</h3>
          <p className='py-1'>Classe: {data.class}</p>
          <p className='py-1'>Tipo: {data.type}</p>
          <p className='py-1'>Lat: {data.lat}</p>
          <p className='py-1'>Lon: {data.lon}</p>
          <p className='py-1'>Extra: {data.display_name}</p>
        </div>
      </div>
      <MapContainer
        attributionControl={false}
        center={[data.lat, data.lon]}
        zoom={13}
        style={{ height: '80vh', width: '75vw' }}
      >
        <TileLayer
          attribution=''
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        />
        <CircleMarker
          center={[data.lat, data.lon]}
          pathOptions={{ color: 'pink' }}
          radius={20}
        >
          <Popup>Área de busca</Popup>
        </CircleMarker>
      </MapContainer>
      <div
        style={{
          marginTop: 25,
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
          display: 'flex'
        }}
      >
        <div class='btn-group'>
          <button onClick={() => {setSearch(''); setData(false)}} class='btn' style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}><KeyboardBackspaceIcon/></button>
          <label
            className='btn modal-button btn-active'
            htmlFor='my-modal-3'
            style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
          >
            Mais Informações
          </label>
        </div>
      </div>
    </div>
  )
}

const WaitInput = ({ execSearch, search, setSearch, setScreen }) => {
  return (
    <div>
      <p style={{ fontSize: 20,width: '100%', textAlign: 'center' }}>
        Digite um local para começar
      </p>
      <div className='form-control' style={{ marginTop: 15 }}>
        <div className='input-group'>
        <button className='btn btn-square' onClick={() => {setScreen('welcome')}}><KeyboardBackspaceIcon/></button>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            type='text'
            placeholder='Digite aqui...'
            className='input input-bordered'
          />
          <button className='btn btn-square' onClick={execSearch}>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-6 w-6'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

export default render
