import { useEffect, useState } from 'react'
import Sidebar from './components/Sidebar'
import Titlebar from '../../components/TitleBar/Titlebar'
import Instalados from './terminals/Instalados'
import Loja from './terminals/Loja'

const Store = props => {
  const [terminal, setTerminal] = useState('instalados')
  const [store, setStore] = useState([])
  const [plugins, setPlugins] = useState([])

  useEffect(() => {
    window.electron.ipcRenderer.once('getStore', x => {
      setStore(x.plugins)
    })
    window.electron.ipcRenderer.once('getPlugins', x => {
      setPlugins(x)
    })
    window.electron.ipcRenderer.sendMessage('getStore', {})
    window.electron.ipcRenderer.sendMessage('getPlugins', {})
  }, [])

  const removePlugin = (folder) => {
    window.electron.ipcRenderer.sendMessage('removePlugin', {folder: folder})
    window.electron.ipcRenderer.once('removePlugin', () => {
      window.electron.ipcRenderer.once('getPlugins', x => {
        setPlugins(x);
      })
      window.electron.ipcRenderer.sendMessage('getPlugins', {})
    })
  }

  const download = (repo) => {
    window.electron.ipcRenderer.once('downloadPlugin', () => {
      window.electron.ipcRenderer.once('getPlugins', x => {
        setPlugins(x);
      })
      window.electron.ipcRenderer.sendMessage('getPlugins', {})
    })
    window.electron.ipcRenderer.sendMessage('downloadPlugin', {repo: repo})
  }

  return (
    <div>
      <Titlebar />
      <div style={{ display: 'flex' }}>
        <Sidebar terminal={terminal} setTerminal={setTerminal} />
          {terminal == 'instalados' ? <Instalados download={download} store={store} removePlugin={removePlugin} plugins={plugins}/> :
          <Loja plugins={plugins} store={store} download={download}/>}
      </div>
    </div>
  )
}

export default Store
