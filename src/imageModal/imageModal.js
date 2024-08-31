import React from "react";
import "./imageModal.css"; // Ensure this CSS file contains necessary styles
import { FaArrowLeft, FaArrowRight, FaDownload, FaTimes } from "react-icons/fa";
import { saveAs } from "file-saver";

function ImageModal({ imageUrl, onClose, onPrev, onNext }) {

    const handleDownload = () => {
        saveAs(imageUrl, "eventhex"); 
      };

  return (
    <div className="image-modal-overlay" onClick={onClose}>
      <div className="image-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>
          <FaTimes size={24} />
        </button>   
        <img src={imageUrl} alt="Full View" className="full-image" />
        <div className="navigation-buttons">
          <button className="nav-button" onClick={onPrev}>
            <FaArrowLeft size={20} />
          </button>
          <button className="download-button"  onClick={handleDownload}>
            <FaDownload size={20} />
          </button>
          <button className="nav-button" onClick={onNext}>
            <FaArrowRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ImageModal;