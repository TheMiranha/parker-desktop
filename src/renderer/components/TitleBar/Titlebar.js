import './Titlebar.css'

import CloseIcon from '@mui/icons-material/Close'
import HorizontalRuleIcon from '@mui/icons-material/HorizontalRule'
import CropSquareIcon from '@mui/icons-material/CropSquare'
import { useNavigate } from 'react-router-dom'


const Titlebar = props => {
  
  const navigate = useNavigate();

  return (
    <div className='titleBarContainer'>
      <div
        style={{
          display: 'flex',
          position: 'absolute',
          height: 35,
          alignItems: 'center'
        }}
      >
        <div onClick={() => {navigate('/')}} className='toolbar_item'>Home</div>
        <div onClick={() => {navigate('/store')}} className='toolbar_item'>Loja</div>
        <div onClick={() => {navigate('/settings')}} className='toolbar_item'>Configurações</div>
        <div className='toolbar_item'>
          <a href='#my-modal'>Servidores</a>
        </div>
      </div>
      <div className='title'>Parker</div>
      <div className='defaultButtons'>
        <div onClick={() => {window.electron.ipcRenderer.sendMessage('titlebar', 'minimize')}} className='miniButton cursor'>
          <HorizontalRuleIcon sx={{ color: '#965F20', fontSize: 12 }} />
        </div>
        <div onClick={() => {window.electron.ipcRenderer.sendMessage('titlebar', 'maximize')}} className='maxButton cursor'>
          <CropSquareIcon sx={{ color: '#286017', fontSize: 12 }} />
        </div>
        <div onClick={() => {window.electron.ipcRenderer.sendMessage('titlebar', 'close')}} className='closeButton cursor'>
          <CloseIcon sx={{ color: '#6A120A', fontSize: 12 }} />
        </div>
      </div>
    </div>
  )
}

export default Titlebar
