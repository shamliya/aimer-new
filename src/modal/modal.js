import React, { useEffect, useState } from 'react';
import './Modal.css'; 
import icon from "../images/sparkling-2-fill.png";
import '@dotlottie/player-component';

const Modal = ({ isOpen, onClose }) => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  
  // Texts to cycle through
  const texts = [
    "Scanning through snapshots....",
    "Matching your selfie to our photo gallery...",
    "Curating your personalized event collection...",
    "Almost there! Preparing your high-resolution images..."
  ];

  // Cycle through texts every 2 seconds
  useEffect(() => {
    if (isOpen) {
      const textInterval = setInterval(() => {
        setCurrentTextIndex((prevIndex) => (prevIndex + 1) % texts.length);
      }, 2000); // 2000ms = 2 seconds

      // Close the modal after 5 seconds (or adjust as needed)
      const timer = setTimeout(onClose, 8000); // 5000ms = 5 seconds

      return () => {
        clearInterval(textInterval); // Clear the interval when the component unmounts
        clearTimeout(timer); // Clear the timeout if the component unmounts
      };
    }
  }, [isOpen, onClose, texts.length]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <img src={icon} alt="Icon" className="modal-icon-image" />
        <h2 className="modal-title">AI Magic in Progress</h2>
        <p className="modal-text">We're finding your perfect event moments.</p>
        <div className="modal-gif">
          <dotlottie-player
            src="https://lottie.host/1cd6d346-fc07-4bf7-9e37-0b86d72eba52/G5nLI9IUBm.json"
            background="transparent"
            speed="0.5"
            loop
            autoplay
            style={{ width: '200px', height: '200px' }}
          ></dotlottie-player>
        </div>
        <p className="modal-scanning">{texts[currentTextIndex]}</p>
      </div>
    </div>
  );
};

export default Modal;
