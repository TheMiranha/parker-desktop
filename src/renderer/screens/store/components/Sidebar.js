import StoreIcon from '@mui/icons-material/Store';
import InventoryIcon from '@mui/icons-material/Inventory';

const Sidebar = (props) => {
    return (
        <div
        style={{
          paddingLeft: 10,
          backgroundColor: 'hsl(var(--n))',
          minHeight: 'calc(100vh - 35px)',
          width: 150,
        }}
      >
          <Item term={'instalados'} terminal={props.terminal} setTerminal={props.setTerminal} title="Instalados" icon={<InventoryIcon style={{marginRight: 10}}/>}/>
          <Item term={'loja'} terminal={props.terminal} setTerminal={props.setTerminal} title="Loja" icon={<StoreIcon style={{marginRight: 10}}/>}/>
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

export default Sidebar;