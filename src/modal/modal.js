// Modal.js
import React from 'react';
import './Modal.css'; // Ensure you have styles for the modal

// Import your GIF
import loadingGif from '../images/Rectangle (4).png'; 
import icon from "../images/sparkling-2-fill.png";

const Modal = ({ isOpen, onClose }) => {

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
          <img src={icon} alt="Icon" className="modal-icon-image" />
        <h2 className="modal-title">AI Magic in Progress</h2>
        <p className="modal-text">We're finding your perfect event moments.</p>
        <img src={loadingGif} alt="Loading" className="modal-gif" />
        <p className="modal-scanning">Scanning through snapshots....</p>
      </div>
    </div>
  );
};

export default Modal;
