import React, { useEffect, useRef, useState } from 'react';
import Welcome from './screens/welcome/Welcome';
import VerMapa from './screens/ver_mapa/VerMapa';
import Rotas from './screens/rotas/Rotas';

const render = () => {

  const [screen, setScreen] = useState('welcome');

  return (
    <div
      style={{
        width: 'calc(100vw - 150px)',
        backgroundColor: 'hsl(var(--b2))',
        minHeight: 'calc(100vh - 35px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      {
        screen == 'welcome' ? <Welcome setScreen={setScreen}/> :
        screen == 'ver_mapa' ? <VerMapa setScreen={setScreen}/> :
        screen == 'rotas' ? <Rotas setScreen={setScreen}/> : false
      }
    </div>
  )
}

export default { render }
