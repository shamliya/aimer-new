// WebcamComponent.jsx
import React, { useRef, useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import * as faceapi from 'face-api.js';
// import "./webCam.css"

const WebcamComponent = ({ onCapture, onClose }) => {
  const webcamRef = useRef(null);
  const [statusMessage, setStatusMessage] = useState({
    title: 'Position Your Face Within the Frame',
    description: 'First, position your face in the camera frame. Then click a photo when your face is detected.',
    showCaptureButton: false,
  });

  useEffect(() => {
    const loadModels = async () => {
      await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
    };
    loadModels();
  }, []);

  const detectFace = async () => {
    if (webcamRef.current && webcamRef.current.video.readyState === 4) {
      const video = webcamRef.current.video;
      const detection = await faceapi.detectSingleFace(video, new faceapi.TinyFaceDetectorOptions());

      if (detection) {
        const { width, height } = video.getBoundingClientRect();
        const faceBox = detection.box;

        const faceCentered = faceBox.x > width * 0.25 && faceBox.x + faceBox.width < width * 0.75;
        const faceSized = faceBox.width > width * 0.3 && faceBox.height > height * 0.3;

        if (!faceCentered) {
          setStatusMessage({
            title: 'Reposition Your Face Within the Frame',
            description: 'Your face is out of view',
            showCaptureButton: false,
          });
        } else if (!faceSized) {
          setStatusMessage({
            title: 'Move Closer',
            description: 'Move Phone 10 to 20 inches from your face',
            showCaptureButton: false,
          });
        } else {
          setStatusMessage({
            title: 'Face Detected',
            description: 'Click the button to capture your selfie. It will be used to find matches from our photo gallery',
            showCaptureButton: true,
          });
        }
      } else {
        setStatusMessage({
          title: 'Position Your Face Within the Frame',
          description: 'First, position your face in the camera frame. Then click a photo when your face is detected.',
          showCaptureButton: false,
        });
      }
    }
  };

  useEffect(() => {
    const intervalId = setInterval(detectFace, 500);
    return () => clearInterval(intervalId);
  }, []);

  const handleCapture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    if (onCapture) {
      onCapture(imageSrc);
    }
  };

  return (
    <div className="webcam-container">
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        videoConstraints={{
          width: 380,
          height: 400,
          facingMode: 'user',
        }}
        className="custom-webcam-view"
      />
      <div className="selfie-section">
        <p>{statusMessage.title}</p>
        <span className="description">{statusMessage.description}</span>
        {statusMessage.showCaptureButton && (
          <button className="snap-button" onClick={handleCapture}>
            Capture
          </button>
        )}
        <button className="close-button" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default WebcamComponent;
