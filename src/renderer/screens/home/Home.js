import { AlternateEmail } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import Titlebar from '../../components/TitleBar/Titlebar'
import Sidebar from './components/Sidebar';
import Temperature from './terminals/Temperature'

function rInverted(s) {
    var x = s;
    while (s.indexOf(`\\`) > -1) {
        s = s.replace(`\\`, `/`);
    }
    return s;
}

const Home = (props) => {

    const [terminal, setTerminal] = useState('temperature')
    const [plugins, setPlugins] = useState([]);

    useEffect(() => {
        window.electron.ipcRenderer.once('getPlugins', pls => {
            var pluginsToSet = []
                pls.forEach(async(pl) => {
                    var side = (await import('../../../../plugins/' + pl.folder + '/home/sidebar')).default;
                    var term = (await import('../../../../plugins/' + pl.folder + '/home/terminal')).default;
                    var plugin = {sidebar: side, terminal: term, package: pl.package};
                    pluginsToSet.push(plugin);
                setPlugins(pluginsToSet);
            })
          })
          window.electron.ipcRenderer.sendMessage('getPlugins', {});
    },[])

    const checkTerminals = () => {
        var ToRender = false;
        for (var i = 0; i < plugins.length; i++) {
            if (plugins[i].package.name == terminal) {
                ToRender = plugins[i].terminal.render;
            }
        }
        return <ToRender/>;
    }

    return (
        <div>
            <Titlebar/>
            <div style={{display: 'flex'}}>
                <Sidebar id="home_sidebar" plugins={plugins} terminal={terminal} setTerminal={setTerminal}/>
                {
                    terminal == 'temperature' ? <Temperature/> : 
                    checkTerminals()
                }
            </div>
        </div>
    )
}

export default Home;