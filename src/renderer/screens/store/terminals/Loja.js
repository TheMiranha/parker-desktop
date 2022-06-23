const Instalados = props => {
  return (
    <div
      style={{
        width: 'calc(100% - 150px)',
        backgroundColor: 'hsl(var(--b2))',
        minHeight: 'calc(100vh - 35px)'
      }}
    >
      <p style={{ textAlign: 'center', fontSize: 25, marginTop: 25 }}>
        Loja
      </p>
        <div style={{overflowY: 'scroll',scrollBehavior: 'smooth', height: 'calc(100vh - 125px)', backgroundColor: 'hsl(var(--b2))',}}>
             <div
        style={{
          width: '100%',
          textAlign: 'center',
          marginTop: 15,
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {props.store.map((plugin, index) => 
        {
          return props.plugins.filter(x => x.folder == plugin.repo.split('/')[1]).length == 0 ? <Item key={`${index}`} download={props.download} plugin={plugin}/> : false
        }
        )}
        </div>
    </div>
    </div>
  )
}

const Item = ({plugin, download}) => {

  return (
    <div className='card card-side bg-base-100 shadow-xl' style={{width: 600, marginTop: 25}}>
      <figure>
        <img
          src={'https://github.com/'+plugin.repo+'/blob/main/icon.png?raw=true&time=5456748'}
          alt='Movie'
          style={{ width: 250, height: 250, marginLeft: 10}}
        />
      </figure>
      <div className='card-body'>
        <h2 className='card-title'>{plugin.package.name}</h2>
        <p style={{textAlign: 'start'}}>{plugin.package.description}</p>
        <div className="badge badge-info">Feito por: {plugin.package.author}</div> 
        <div className="badge badge-success">Versão: {plugin.package.version}</div> 
        <div className='card-actions justify-end'>
          <button className='btn btn-info' onClick={() => download(plugin.repo)}>Instalar</button>
        </div>
      </div>
    </div>
  )
}

export default Instalados


