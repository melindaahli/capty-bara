import { createRoot } from 'react-dom/client'

import Settings from './components/Settings/Settings'
import logo from '/public/icons/logo.png';

function Popup() {
  return (
    <div style={{ width:'280px', padding:'16px', background:'#eaf1ea' }}>
      <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
        <img src={logo} alt="capybara logo" style={{ maxHeight:'50px', width: '40px'}}/>
        <span style={{ fontSize:'25px', fontWeight:'bold', color:'#175423' }}>capty-bara</span>
      </div>

      <Settings />

      <p style={{ fontSize:'11px', color:'#666', marginTop:'12px', textAlign:'center' }}>
        Open a YouTube video to activate captions
      </p>
    </div>
  )
}

createRoot(document.getElementById('popup-root')).render(<Popup />)
