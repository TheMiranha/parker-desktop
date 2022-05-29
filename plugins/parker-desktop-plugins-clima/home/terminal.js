import { windowsStore } from 'process'
import { useEffect, useState } from 'react'
import TemperatureAPI from '../temperature/Temperature'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import StarIcon from '@mui/icons-material/Star'
import Config from '../config/config.js';
import { FormControlUnstyledContext } from '@mui/base'

const render = props => {
  const [config, setConfig] = useState({})
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState({})

  useEffect(() => {
    Config.getConfig(async (c) => {
      setConfig(c);
      if (c.city != false && c.city.length > 0) {
        await loadData(c.city, true);
      } else {
        setLoading(false);
      }
    })
  }, [])

  const loadData = async (city, self) => {
    var data2 = await TemperatureAPI.getTemperature(city)
    if (data2 == false) {
      var toSet = { ...config }
      toSet.city = false
      setConfig(toSet)
      Config.appendConfig(toSet);
      setError('Cidade não encontrada!')
    } else {
      setData(data2)
      setLoading(false);
    }
  }

  const registerCity = async(city) => {
    var toSet = { ...config }
    toSet.city = city
    var data2 = await TemperatureAPI.getTemperature(city)
    if (data2 == false) {
      var toSet = { ...config }
      toSet.city = false
      setConfig(toSet)
      Config.appendConfig(toSet);
      setError('Cidade não encontrada!')
    } else {
      setData(data2)
      setConfig(toSet);
      Config.appendConfig(toSet);
    }
  }

  return (
    <div
      style={{
        width: 'calc(100vw - 150px)',
        backgroundColor: 'hsl(var(--b2))',
        minHeight: 'calc(100vh - 35px)'
      }}
    >
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

      {loading ? (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <progress className='progress progress-primary w-56'></progress>
        </div>
      ) : config.city == false || config.city.length == 0 ? (
        <WelcomeScreen registerCity={registerCity} />
      ) : (
        <DefaultScreen config={config} data={data} />
      )}
    </div>
  )
}

const WelcomeScreen = ({ registerCity }) => {
  const [city, setCity] = useState('')

  return (
    <div
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column'
      }}
    >
      <div style={{ width: '100%', textAlign: 'center' }}>
        <p style={{ fontSize: 25 }}>Digite a sua cidade para começar</p>
      </div>
      <input
        value={city}
        onChange={e => setCity(e.target.value)}
        style={{ marginTop: 20, textAlign: 'center' }}
        type='text'
        placeholder='Digite sua cidade'
        className='input input-bordered w-full max-w-xs'
      />
      <button
        onClick={() => registerCity(city)}
        className='btn'
        style={{ marginTop: 20 }}
      >
        Começar
      </button>
    </div>
  )
}

const DefaultScreen = ({ config, data, open }) => {
  return (
    <div
      style={{
        width: '100%',
        overflowY: 'scroll',
        scrollBehavior: 'smooth',
        height: 'calc(100vh - 35px)'
      }}
    >
      <Modal data={data} />
      <div
        style={{
          width: '100%',
          textAlign: 'center',
          marginTop: 15,
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <div className='indicator' style={{ marginTop: 15 }}>
          <span
            className='indicator-item badge'
            style={{ backgroundColor: 'rgba(0,0,0,0)', border: 'none' }}
          >
            <img src={data.imgs.weather} style={{}} />
          </span>
          <p style={{ fontSize: 25, width: '100%', height: 50, marginTop: 10 }}>
            {data.name}
          </p>
          <span style={{width: 300}} className='indicator-item indicator-bottom indicator-center badge badge-secondary'>
            {data.weather[0].description.toUpperCase()} {data.main.temp}°C
          </span>
        </div>
        <div className='stats shadow' style={{ marginTop: 15 }}>
          <div className='stat'>
            <div className='stat-figure text-secondary'>
              <EmojiEventsIcon />
            </div>
            <div className='stat-title'>Temperatura Máxima</div>
            <div className='stat-value'>{data.main.temp_max}°C</div>
          </div>

          <div className='stat'>
            <div className='stat-figure text-secondary'>
              <img
                src={data.imgs.country}
                style={{ marginBottom: 5, width: 75 }}
              />
            </div>
            <div className='stat-title'>País</div>
            <div className='stat-value'>{data.sys.country}</div>
            <div className='stat-desc'>
              Sensação térmica: {data.main.feels_like}°C
            </div>
          </div>

          <div className='stat'>
            <div className='stat-figure text-secondary'>
              <StarIcon />
            </div>
            <div className='stat-title'>Temperatura Mínima</div>
            <div className='stat-value'>{data.main.temp_min}°C</div>
          </div>
        </div>
        <label
          htmlFor='weather-modal'
          className='btn modal-button'
          style={{ marginTop: 10 }}
        >
          Mais informações
        </label>
      </div>
    </div>
  )
}

const Modal = ({ data }) => {
  return (
    <>
      <input type='checkbox' id='weather-modal' className='modal-toggle' />
      <div className='modal'>
        <div className='modal-box relative'>
          <label
            htmlFor='weather-modal'
            className='btn btn-sm btn-circle absolute right-2 top-2'
          >
            ✕
          </label>
          <h3 className='text-lg font-bold'>Sobre {data.name}</h3>

          <div
            tabIndex='0'
            className='collapse collapse-arrow bg-base-100 rounded-box'
            style={{marginLeft: -17}}
          >
            <div className='collapse-title text-xl font-medium'>
              Principal
            </div>
            <div className='collapse-content'>
              <p>
                Feels like: {data.main.feels_like}
              </p>
              <p>
                Grnd Level: {data.main.grd_level}
              </p>
              <p>
                Humidity: {data.main.humidity}
              </p>
              <p>
                Pressure: {data.main.pressure}
              </p>
              <p>
                Sea Level: {data.main.sea_level}
              </p>
              <p>
                Temp: {data.main.temp}
              </p>
              <p>
                Temp max: {data.main.temp_max}
              </p>
              <p>
                Temp min: {data.main.temp_min}
              </p>
            </div>
          </div>

          <div
            tabIndex='0'
            className='collapse collapse-arrow bg-base-100 rounded-box'
            style={{marginLeft: -17}}
          >
            <div className='collapse-title text-xl font-medium'>
              Vento
            </div>
            <div className='collapse-content'>
              <p>
                Deg: {data.wind.deg}
              </p>
              <p>
                Gust: {data.wind.gust}
              </p>
              <p>
                Speed: {data.wind.speed}
              </p>
            </div>
          </div>

          <div
            tabIndex='0'
            className='collapse collapse-arrow bg-base-100 rounded-box'
            style={{marginLeft: -17}}
          >
            <div className='collapse-title text-xl font-medium'>
              Coordenadas
            </div>
            <div className='collapse-content'>
              <p>
                Lat: {data.coord.lat}
              </p>
              <p>
                Lon: {data.coord.lon}
              </p>
            </div>
          </div>

        </div>
      </div>
    </>
  )
}

export default { render }
