import React from 'react';
import logo from './logo.svg';
import './App.css';
import ImageUploader from './components/ImageUploader';
import NewLocationGenerator from './components/NewLocationGenerator';
const App: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Ventura
        </p>
<ImageUploader/>
<NewLocationGenerator/>
      </header>
    </div>
  );
}

export default App;
