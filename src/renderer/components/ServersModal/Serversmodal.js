import { flexbox, width } from '@mui/system'
import StorageIcon from '@mui/icons-material/Storage'
import { useEffect, useState } from 'react'
import Discloud from '../../apis/discloud/Discloud'
// import R6stats from '../../apis/r6stats/R6stats'
import Temperature from '../../apis/temperature/Temperature'

const initialServers = {
  discord: {
    container: 'Offline',
    cpu: '0%',
    memory: '0/0',
    last_restart: 'never'
  },
  ia: {
    container: 'Offline'
  },
  // r6stats: {
  //   container: 'Offline'
  // },
  weather: {
    container: 'Offline'
  }
}

const Serversmodal = (props) => {
  const [color, setColor] = useState('#ED695F')
  const [servers, setServers] = useState(initialServers)

  useEffect(() => {
    getServersInfo()
    var color2 = color
    setInterval(() => {
      switch (color2) {
        case '#ED695F':
          color2 = '#F5BD50'
          break
        case '#F5BD50':
          color2 = '#61C554'
          break
        case '#61C554':
          color2 = '#ED695F'
          break
      }
      setColor(color2)
    }, 1000)
  }, [])

  const getServersInfo = async() => {
    setServers(initialServers);
    var discloudStatus = await Discloud.appInfo()
    // var r6Status = await R6stats.getServerStatus();
    var weatherStatus = await Temperature.getServerStatus();
    setServers({
      discord: discloudStatus,
      ia: { container: 'Online' },
      // r6stats: {container: r6Status ? 'Online' : 'Offline'},
      weather: {container: weatherStatus ? 'Online' : 'Offline'}
    })
  }

  return (
    <div id='my-modal' className='modal'>
      <div className='modal-box'>
        <div
          style={{
            marginBottom: 5,
            fontSize: 25,
            width: 30,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center'
          }}
        >
          <StorageIcon
            style={{ marginRight: 5, marginTop: 5 }}
            sx={{ color: color }}
          />
          Servidores
        </div>

        <DefaultStatus name='IA' container={servers.ia.container} />
        {/* <DefaultStatus name='R6' container={servers.r6stats.container} /> */}
        <DefaultStatus name="Weather" container={servers.weather.container}/>

        <div
          tabIndex='0'
          className='collapse collapse-arrow border border-base-300 bg-base-100 rounded-box'
        >
          <input type='checkbox' className='peer' />
          <div
            className='collapse-title text-xl font-medium'
            style={{ display: 'flex', alignItems: 'center' }}
          >
            <div
              style={{
                height: 20,
                width: 20,
                borderRadius: 20,
                marginRight: 10,
                backgroundColor:
                  servers.discord.container == 'Online' ? '#61C554' : '#ED695F'
              }}
            />
            Discord
          </div>
          <div className='collapse-content'>
            <p>Memory: {servers.discord.memory}</p>
            <p>CPU: {servers.discord.cpu}</p>
            <p>Last Restart: {servers.discord.last_restart}</p>
            <p>Bot ID: {servers.discord.app_id}</p>
          </div>
        </div>
        <div className='modal-action'>
          <a className='btn btn-primary' onClick={getServersInfo}>
            Atualizar
          </a>
          <a href='#' className='btn'>
            Fechar
          </a>
        </div>
      </div>
    </div>
  )
}

const DefaultStatus = ({ name, container }) => {
  return (
    <div
      tabIndex='0'
      className='collapse border border-base-300 bg-base-100 rounded-box'
    >
      <input type='checkbox' className='peer' />
      <div
        className='collapse-title text-xl font-medium'
        style={{ display: 'flex', alignItems: 'center' }}
      >
        <div
          style={{
            height: 20,
            width: 20,
            borderRadius: 20,
            marginRight: 10,
            backgroundColor: container == 'Online' ? '#61C554' : '#ED695F'
          }}
        />
        {name}
      </div>
    </div>
  )
}

export default Serversmodal
