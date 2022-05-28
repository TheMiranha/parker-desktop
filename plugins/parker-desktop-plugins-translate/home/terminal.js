import { useEffect, useState } from 'react'
import Translate from '../Translate'

const render = () => {
  const [loading, setLoading] = useState(false)
  const [text, setText] = useState('')
  const [lang, setLang] = useState('pt')

  const traduzir = async () => {
      setLoading(true)
      var res = await Translate.translate(text, lang)
      setText(res)
      setLoading(false)
    }

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
      {loading ? <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <progress className='progress progress-primary w-56'></progress>
        </div> : 
      <Welcome
        lang={lang}
        setLang={setLang}
        text={text}
        setText={setText}
        traduzir={traduzir}
      />}
    </div>
  )
}

const Welcome = ({traduzir, text, setText, lang, setLang}) => {
  const [langs, setLangs] = useState([{code: 'pt', name: 'Portuguese'}])

  useEffect(() => {
    var init = async () => {
      var temp = await Translate.getLangs()
      setLangs(temp)
    }

    init()
  }, [])

  return (
    <>
      <p style={{ fontSize: 25, marginBottom: 25 }}>Digite o que quiser e escolha uma língua </p>
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        style={{ resize: 'none', height: 200, width: 500 }}
        className='textarea textarea-primary'
        placeholder='Insira seu texto'
      ></textarea>

      <div className='form-control' style={{ marginTop: 25 }}>
        <div className='input-group'>
          <select
            value={lang}
            onChange={e => {
                setLang(e.target.value);
            }}
            className='select select-bordered'
          >
            <option disabled value={'nenhum'}>
              Escolha uma língua
            </option>
            {langs.map(x => {
              return (
                <option key={x.code} value={x.code}>
                  {x.name}
                </option>
              )
            })}
          </select>
          <button
            onClick={() => {
              traduzir()
            }}
            className='btn'
          >
            Traduzir
          </button>
        </div>
      </div>
    </>
  )
}

export default { render }