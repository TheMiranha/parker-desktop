import { MemoryRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'

import Home from './screens/home/Home'
import Store from './screens/store/Store';
import Settings from './screens/settings/Settings'
import Serversmodal from './components/ServersModal/Serversmodal'
import { useEffect, useState } from 'react'

export default function App () {

  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    
    window.electron.ipcRenderer.once('getTheme', a => {
      setTheme(a);
    })
    window.electron.ipcRenderer.sendMessage('getTheme', {});
  },[])

  const changeTheme = (x) => {
    window.electron.ipcRenderer.sendMessage('changeTheme', x);
    setTheme(x);
  }

  const resetConfig = (x) => {
    window.electron.ipcRenderer.sendMessage('resetConfig', {});
  }

  const getConfig = (callBack) => {
    window.electron.ipcRenderer.once('getConfig', (event, arg) => {
      callBack(arg);
    });
    window.electron.ipcRenderer.sendMessage('getConfig', {});
  }

  return (
    <div data-theme={theme} style={{ height: '100vh', width: '100vw' }}>
      <Serversmodal/>
      <div style={{width: '100vw', height: 'calc(100vh - 35px)', display: 'flex'}}>
        <Router>
          <Routes>
            <Route path='/' element={<Home/>} />
            <Route path='/store' element={<Store/>} />
            <Route path='/settings' element={<Settings resetConfig={resetConfig} theme={theme} setTheme={changeTheme}/>}/>
          </Routes>
        </Router>
      </div>
    </div>
  )
}