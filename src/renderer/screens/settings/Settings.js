import { useEffect, useState } from 'react'
import Titlebar from '../../components/TitleBar/Titlebar'

const Themes = [
  'light',
  'dark',
  'cupcake',
  'bumblebee',
  'emerald',
  'corporate',
  'synthwave',
  'retro',
  'cyberpunk',
  'valentine',
  'halloween',
  'garden',
  'forest',
  'aqua',
  'lofi',
  'pastel',
  'fantasy',
  'wireframe',
  'black',
  'luxury',
  'dracula',
  'cmyk',
  'autumn',
  'business',
  'acid',
  'lemonade',
  'night',
  'coffee',
  'winter'
]

const Settings = props => {

  const [loading, setLoading] = useState(true)
  const [config, setConfig] = useState({});
  const [plugins, setPlugins] = useState([]);

  useEffect(() => {
    window.electron.ipcRenderer.once('getConfig', a => {
      setConfig(a);
      setLoading(false);
    })
    window.electron.ipcRenderer.sendMessage('getConfig', {})

    window.electron.ipcRenderer.once('getPlugins', pls => {
      var toSet = [];
        pls.forEach(async(pl) => {
          var functions = (await import('../../../../plugins/' +pl.folder+ '/config/config')).default;
          console.log('PL: ' + pl);
          if (functions.RENDER_CONFIG) {
            var plugin = {package: pl.package, ...functions};
            toSet.push(plugin);
          }
        });
        setPlugins(toSet);
    })
    window.electron.ipcRenderer.sendMessage('getPlugins', {});
  }, []);

  const saveConfig = () => {
    window.electron.ipcRenderer.sendMessage('saveConfig', config);
  }

  if (loading) {
    return (
      <div>
        <Titlebar />
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
      </div>
    )
  } else {
    return (
      <div>
        <Titlebar />
        <div style={{ marginLeft: 10, marginRight: 10, marginTop: 10 }}>
          <div className='divider' style={{ fontSize: 30 }}>
            Interface
          </div>
          <div>
            Temas:
            <select
              style={{ marginLeft: 10 }}
              onChange={e => props.setTheme(e.target.value)}
              className='select select-bordered w-full max-w-xs'
            >
              <option disabled selected>
                {props.theme}
              </option>
              {Themes.map(theme =>
                props.theme != theme ? (
                  <option key={'settings-themes-' + theme}>{theme}</option>
                ) : (
                  false
                )
              )}
            </select>
          </div>
          <div className='divider' style={{ fontSize: 30 }}>
            Temperatura
          </div>
          <div>
            Cidade:
            <input
              style={{ marginLeft: 10 }}
              value={config.weather.city == false ? '' : config.weather.city}
              onChange={(e) => setConfig({...config, weather: {...config.weather, city: e.target.value}})}
              type='text'
              placeholder='Digite sua cidade'
              className='input input-bordered w-full max-w-xs'
            />
          </div>
          <button className="btn btn-outline btn-success" onClick={saveConfig} style={{marginTop: 20}}>Salvar</button>
          {plugins.map(pl => {
            if (pl.RENDER_CONFIG)
            {
              return (
                <div key={pl.package.name}>
                <div className="divider" style={{ fontSize: 30 }}>{pl.RENDER_TITLE}</div>
                <pl.render/>
                </div>
              )
            }
            return <div>nop</div>;
          })}
          <div className="divider"></div>
        </div>
      </div>
    )
  }
}

export default Settings
