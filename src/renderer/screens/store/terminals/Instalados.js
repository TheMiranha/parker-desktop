const Instalados = props => {
  return (
    <div
      style={{
        width: 'calc(100vw - 150px)',
        backgroundColor: 'hsl(var(--b2))',
        minHeight: 'calc(100vh - 35px)'
      }}
    >
      <p style={{ textAlign: 'center', fontSize: 25, marginTop: 25 }}>
        Pacotes instalados
      </p>
      <div style={{overflowY: 'scroll',scrollBehavior: 'smooth', height: 'calc(100vh - 125px)', backgroundColor: 'hsl(var(--b2))',}}>
      <div style={{width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        {props.plugins.map((plugin, index) => (
          <Item key={plugin.folder} download={props.download} inStore={props.store.filter(x => x.repo.split('/')[1] == plugin.folder)[0]} removePlugin={props.removePlugin} plugin={plugin}/>
        ))}
      </div>
      </div>
    </div>
  )
}

const Item = ({plugin, removePlugin, inStore, download}) => {

  const desinstalar = () => {
    window.electron.ipcRenderer.sendMessage('removePlugin', {folder: plugin.folder})
    removePlugin(plugin.folder);
  }

  return (
    <div className='card card-side bg-base-100 shadow-xl' style={{width: 600, marginTop: 25}}>
      <figure>
        <img
          src={'https://github.com/TheMiranha/'+plugin.folder+'/blob/main/icon.png?raw=true'}
          alt='Movie'
          style={{ width: 250, height: 250, marginLeft: 10 }}
        />
      </figure>
      <div className='card-body'>
        <h2 className='card-title'>{plugin.package.name}</h2>
        <p>{plugin.package.description}</p>
        {/* "badge badge-success" */}
        <div className="badge badge-info">Feito por: {plugin.package.author}</div> 
        {inStore != undefined ? <div className={parseFloat(inStore.package.version) > parseFloat(plugin.package.version) ? 'badge badge-error' : 'badge badge-success'}>Versão: {plugin.package.version}</div> : false}
        {inStore != undefined ? parseFloat(inStore.package.version) > parseFloat(plugin.package.version) ? <div className="badge badge-success">Versão na loja: {inStore.package.version}</div> : false : false}
        <div className='card-actions justify-end'>
          <button className='btn btn-error' onClick={() => desinstalar()} >Desinstalar</button>
        </div>
      </div>
    </div>
  )
}

export default Instalados


