import { ImportContactsTwoTone, WindPower } from '@mui/icons-material'
import WbSunnyIcon from '@mui/icons-material/WbSunny'
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import { useEffect, useState } from 'react';

const Sidebar = props => {

  return (
    <div
      style={{
        paddingLeft: 10,
        backgroundColor: 'hsl(var(--n))',
        minHeight: 'calc(100vh - 35px)',
        width: 150
      }}
    >
      <Item setTerminal={props.setTerminal} terminal={props.terminal} title="Temperatura" icon={<WbSunnyIcon style={{marginRight: 10}}/>} term="temperature" />
      {props.plugins.map(plugin => 
        <Item key={plugin.package.name + '-' + plugin.package.version} setTerminal={props.setTerminal} terminal={props.terminal} title={plugin.sidebar.Item().title} icon={plugin.sidebar.Item().icon} term={plugin.package.name}/>
      )}

    </div>
  )
}

const Item = ({ icon, title, term, terminal, setTerminal }) => {
  return (
    <div
      onClick={() => setTerminal(term)}
      className='cursor'
      style={
        terminal == term
          ? { color: 'hsl(var(--s))', marginTop: 10 }
          : { marginTop: 10, color: 'hsl(var(--b1))' }
      }
    >
        {icon}
        {title}
    </div>
  )
}

export default Sidebar
