const render = ({setScreen}) => {
  return (
    <div>
      <p style={{ fontSize: 25 }}>O que deseja fazer?</p>
      <div style={{marginTop: 15,width: '100%', alignItems: 'center', justifyContent: 'center', display: 'flex', flexDirection: 'column'}}>
        <button onClick={() => setScreen('ver_mapa')} class='btn btn-outline btn-info'>Ver mapa</button>
        <button onClick={() => setScreen('rotas')} style={{marginTop: 15}} class='btn btn-outline btn-primary'>Analizar rota</button>
      </div>
    </div>
  )
}

export default render
