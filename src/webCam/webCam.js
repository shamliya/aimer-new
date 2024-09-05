import React, { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import * as faceapi from "face-api.js";
import "./webCam.css";

const WebcamComponent = ({ onCapture, onClose , onContinue }) => {
  const webcamRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [hasCaptured, setHasCaptured] = useState(false); // Track capture status
  const [faceDetected, setFaceDetected] = useState(false);
  const [statusMessage, setStatusMessage] = useState({
    title: "Position Your Face Within the Frame",
    description:
      "First, position your face in the camera frame. Then click a photo when your face is detected.",
    showCaptureButton: false,
    showContinueButton: false,
  });

  useEffect(() => {
    const loadModels = async () => {
      await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
    };
    loadModels();
  }, []);

  const detectFace = async () => {
    if (webcamRef.current && webcamRef.current.video.readyState === 4) {
      const video = webcamRef.current.video;
      const detection = await faceapi.detectSingleFace(
        video,
        new faceapi.TinyFaceDetectorOptions()
      );

      if (detection) {
        const { width, height } = video.getBoundingClientRect();
        const faceBox = detection.box;

        const faceCentered =
          faceBox.x > width * 0.25 && faceBox.x + faceBox.width < width * 0.75;
        const faceSized =
          faceBox.width > width * 0.3 && faceBox.height > height * 0.3;

        if (!faceCentered) {
          if (statusMessage.title !== "Reposition Your Face Within the Frame") {
            setFaceDetected(false);
            setStatusMessage({
              title: "Reposition Your Face Within the Frame",
              description: "Your face is out of view",
              showCaptureButton: false,
              showContinueButton: false,
            });
          }
        } else if (!faceSized) {
          if (statusMessage.title !== "Move Closer") {
            setFaceDetected(false);
            setStatusMessage({
              title: "Move Closer",
              description: "Move Phone 10 to 20 inches from your face",
              showCaptureButton: false,
              showContinueButton: false,
            });
          }
        } else {
          if (statusMessage.title !== "Face Detected") {
            setFaceDetected(true);
            setStatusMessage({
              title: "Face Detected",
              description:
                "Click the button to capture your selfie. It will be used to find matches from our photo gallery",
              showCaptureButton: true,
              showContinueButton: false,
            });
          }
        }
      } else {
        if (statusMessage.title !== "Position Your Face Within the Frame") {
          setFaceDetected(false);
          setStatusMessage({
            title: "Position Your Face Within the Frame",
            description:
              "First, position your face in the camera frame. Then click a photo when your face is detected.",
            showCaptureButton: false,
            showContinueButton: false,
          });
        }
      }
    }
  };

  useEffect(() => {
    if (!hasCaptured) {
      const intervalId = setInterval(detectFace, 500);
      return () => clearInterval(intervalId);
    }
  }, [hasCaptured]); // Run face detection only if image is not captured

  const handleCapture = () => {
    const imageSrc = webcamRef.current.getScreenshot();

    if (imageSrc) {
      setCapturedImage(imageSrc);
      setHasCaptured(true); // Stop further face detection

      setStatusMessage({
        title: "Image Capture Complete",
        description:
          "You can always retake this even after you create an account.",
        showCaptureButton: false,
        showContinueButton: true,
      });

      if (onCapture) {
        onCapture(imageSrc);
      }
    } else {
      console.error("Failed to capture image.");
      setStatusMessage({
        title: "Capture Failed",
        description: "Please try capturing the image again.",
        showCaptureButton: true,
        showContinueButton: false,
      });
    }
  };

  const handleRetake = () => {
    setFaceDetected(false);
    setCapturedImage(null);
    setHasCaptured(false); // Allow face detection to resume
    setStatusMessage({
      title: "Position Your Face Within the Frame",
      description:
        "First, position your face in the camera frame. Then click a photo when your face is detected.",
      showCaptureButton: false,
      showContinueButton: false,
    });
  };

  const handleContinue = () => {
    console.log("clicked continue")
    if (onContinue) {
      onContinue(capturedImage);
    }
  };

  return (
    <div className="webcam-container">
      {capturedImage ? (
        <img src={capturedImage} alt="Captured" className="captured-image" />
      ) : (
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          videoConstraints={{
            width: 320,
            height: 400,
            facingMode: "user",
          }}
          className="custom-webcam-view"
        />
      )}

      {/* Conditional rendering of the face frame */}
      {!faceDetected && (
        <div className="face-frame">
          <div className="corner top-left"></div>
          <div className="corner top-right"></div>
          <div className="corner bottom-left"></div>
          <div className="corner bottom-right"></div>
        </div>
      )}

      <div className="selfie-section">
        <p>{statusMessage.title}</p>
        <span className="description">{statusMessage.description}</span>
        {statusMessage.showCaptureButton && (
          <div className="capture-button-container" onClick={handleCapture}>
            <div className="capture-button"></div>
          </div>
        )}
        {statusMessage.showContinueButton && (
          <>
            <button className="snap-button"  onClick={handleContinue}>Continue</button>
            <span className="description">
              Didn’t like it?
              <span className="signin-text" onClick={handleRetake}>
                Retake
              </span>
            </span>
          </>
        )}
      </div>
    </div>
  );
};

export default WebcamComponent;
