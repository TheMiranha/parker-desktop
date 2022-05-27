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
