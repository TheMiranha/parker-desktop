import { useEffect, useState } from "react";

const setConfig = (config) => {
    window.electron.ipcRenderer.sendMessage('setPluginConfig', {plugin: 'parker-desktop-plugins-clima', config});
}

const appendConfig = (config) => {
    window.electron.ipcRenderer.sendMessage('appendPluginConfig', {plugin: 'parker-desktop-plugins-clima', toSet: config});
}

const getConfig = (callBack) => {
    const execOnce = () => {
        window.electron.ipcRenderer.once('parker-desktop-plugins-clima-config', config => {
                callBack(config.config);
        });
    }
    execOnce();
    window.electron.ipcRenderer.sendMessage('getPluginConfig', {plugin: 'parker-desktop-plugins-clima'});
}


const RENDER_CONFIG = true;
const RENDER_TITLE = 'Clima';

const render = () => {

    const [city, setCity] = useState('');

    useEffect(() => {
        getConfig(config => {
            setCity(config.city);
        })
    }, [])

    const saveConfig = () => {
        appendConfig({city: city});
    }

    return (
        <div>
            <div>
            Cidade:
            <input
              style={{ marginLeft: 10 }}
              value={city == false ? '' : city}
              onChange={(e) => setCity(e.target.value)}
              type='text'
              placeholder='Digite uma cidade...'
              className='input input-bordered w-full max-w-xs'
            />
          </div>
          <button className="btn btn-outline btn-success" onClick={saveConfig} style={{marginTop: 20}}>Salvar</button>
        </div>
    )
}


export default { setConfig, appendConfig, getConfig, render, RENDER_CONFIG, RENDER_TITLE }