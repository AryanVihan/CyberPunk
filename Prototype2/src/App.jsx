import React, { useContext } from 'react'; 
import "./App.css";
import Spline from '@splinetool/react-spline';
import { FaMicrophone } from "react-icons/fa6";
import { datacontext } from './context/usercontext';

function App() {
  let { recognition, speaking, setSpeaking, prompt, response, setPrompt, setResponse } = useContext(datacontext);

  const handleClick = () => {
    setPrompt("listening...");
    setSpeaking(true);
    setResponse(false);
    recognition.start();
  };

  return (
    <div className="main">
        {/* Spline 3D Model */}
        <div className="spline-container" onClick={handleClick}>
          <Spline scene="https://prod.spline.design/XBJYaSxMx0AUcMUv/scene.splinecode" />
        </div>

        {!speaking ? (
          <button onClick={handleClick} className="bot-button">
            Talk To Me <FaMicrophone />
          </button>
        ) : (
          <div className='response'>
            <p>{prompt}</p>
          </div>
        )}

      </div>
  );
}

export default App;
