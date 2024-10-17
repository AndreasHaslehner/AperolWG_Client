import LoginModal from './LoginModal'
import NavBar from './navbar/NavBar';
import {api_get} from './helper/api_handler'
import { get_stored_signal } from './storage_handler';
import { effect, signal } from "@preact/signals-react";
import AperolList from './aperol_list/AperolList';
import "./App.css"

export const show_app = signal(1);

const registered_apps = {
  0: <p>Select an App</p>,
  1: <AperolList></AperolList>
};

function App() {
  return (
    <div className="App">
   
      <header className="App-header">
        <NavBar></NavBar>
        <LoginModal></LoginModal>
      </header>
      <div className='App-body'>
      <div
        style={{
          backgroundImage: 'url("/background.svg")',
          backgroundSize: 'cover',  // Ensures the background covers the entire div
          backgroundRepeat: 'no-repeat',  // Prevents repeating the image
          backgroundPosition: 'center',  // Centers the image
          position: 'absolute',  // Ensures the background covers the entire page
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: -1  // Places the background behind other elements
        }}
      ></div>

        {registered_apps[show_app.value]}
      </div>
    </div>
  );
}

export default App;