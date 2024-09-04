import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import logo from "./images/Logo.png";
import banner from "./images/image 5.png";
import selfie from "./images/Face-Id--Streamline-Tokyo.png";
import cameraIcon from "./images/Layer_1 (1).png";
import Modal from "./modal/modal";
import axios from "axios";
import icon from "./images/sparkling-2-fill.png";
import NoData from "./noData/noData";
import ImageModal from "./imageModal/imageModal";
import Loader from "./loader/loader";
import SignIn from "./signIn";
import "@dotlottie/player-component";
import WebcamComponent from "./webCam/webCam";

const SnapSelfie = () => {
  const [showModal, setShowModal] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploaded, setUploaded] = useState(false); // To track upload status
  const [faceMatches, setFaceMatches] = useState([]);
  const [imageUrl, setImageUrl] = useState("");
  const [success, setSuccess] = useState(false);
  const [hasFaceMatches, setHasFaceMatches] = useState(false);
  const [matchCount, setMatchCount] = useState(0);
  const [isContentLoaded, setIsContentLoaded] = useState(false);
  const [slideIn, setSlideIn] = useState(false);
  // New states for Image Modal
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isBannerLoaded, setIsBannerLoaded] = useState(false);
  const [isSelfieLoaded, setIsSelfieLoaded] = useState(false);
  const [signForm, setSignForm] = useState(false);
  const [snapClick, setSnapClick] = useState(false);
  const [showWebcam, setShowWebcam] = useState(false);
  console.log("showWebcam", showWebcam);
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsContentLoaded(true);
      setSlideIn(true);
    }, 1000); // Adjust delay time as needed
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isImageModalOpen) {
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
    }
  }, [isImageModalOpen]);

  const fileInputRef = useRef(null);

  const handleSnapClick = () => {
    setSnapClick(true);
  };

  const handleGetStarted = () => {
    // fileInputRef.current.click();
    setShowWebcam(true);
  };
  const handleCapture = (imageSrc) => {
    console.log(imageSrc); // Handle the captured image as needed
    setShowWebcam(false); // Optionally close the webcam after capture
  };

  const triggerFileUpload = () => {
    if (uploadedFile) {
      handleFileUpload(uploadedFile);
    }
  };

  const handleFileUpload = async (file) => {
    if (file) {
      setUploadedFile(file); // Set the file in state
      setShowModal(true); // Show the modal

      const timer = setTimeout(() => {
        setShowModal(false);
      }, 8000);
      const imageUrl = URL.createObjectURL(file); // Create a URL for the image
      setImageUrl(imageUrl);

      setUploaded(true);
      const formData = new FormData();
      formData.append("file", file);

      try {
        // API call to match faces
        const matchResponse = await axios.post(
          "https://aws-rekognition-api-ml6no.ondigitalocean.app/api/match",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        const matches = matchResponse.data.FaceMatches;
        setFaceMatches(matches);
        setSuccess(true);
        if (matches && matches.length > 0) {
          setHasFaceMatches(true);
          setMatchCount(matches.length);
        } else {
          setMatchCount(0);
        }
      } catch (error) {
        console.error("Face match failed:", error);
      } finally {
        setUploaded(false);
        setShowModal(false);
      }
    }
  };

  // Handler to open Image Modal
  const openImageModal = (index) => {
    setCurrentImageIndex(index);
    setIsImageModalOpen(true);
  };

  // Handler to close Image Modal
  const closeImageModal = () => {
    setIsImageModalOpen(false);
  };

  // Handlers for navigating images
  const showPrevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? faceMatches.length - 1 : prevIndex - 1
    );
  };

  const showNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === faceMatches.length - 1 ? 0 : prevIndex + 1
    );
  };

  const openSignIn = () => {
    setSignForm(true);
  };

  return (
    <>
      <div className="mobile-frame">
        {!isContentLoaded && (
          <div className="initial-logo">
            <img src={logo} alt="EventHex" className="logo-centered" />
          </div>
        )}
        {isContentLoaded && (
          <>
            <div className="container">
              {!snapClick && (
                <>
                  <header className="header">
                    <img src={logo} alt="EventHex" className="logo" />
                  </header>
                  <div className="content">
                    <div className="banner-container">
                      {!isBannerLoaded && (
                        <div className="banner-placeholder"></div> // Placeholder div
                      )}

                      <img
                        src={banner}
                        alt="Event Banner"
                        className={`${
                          success ? "banner-with-image" : "banner"
                        }`}
                        onLoad={() => setIsBannerLoaded(true)}
                      />
                      {success && (
                        <div className="uploaded-image">
                          <img
                            src={imageUrl}
                            alt="Uploaded"
                            className="circle-image"
                          />
                        </div>
                      )}
                    </div>
                    {success && !signForm && (
                      <>
                        <div className="rectangle-container">
                          <div className="rectangle-content">
                            <img src={icon} alt="Icon" className="icon" />
                            <div className="text">
                              {hasFaceMatches
                                ? "Yay! AI found your photo matches"
                                : "Our AI couldn’t find any photos of you"}
                            </div>
                            <div className="column-items">
                              <div className="number">{matchCount}</div>
                              <div className="photos-text">Photos</div>
                            </div>
                          </div>
                        </div>
                        <div className="photos-section">
                          <div className="photos-text">Your Photos</div>
                          <button
                            className="check-button"
                            onClick={triggerFileUpload}
                          >
                            Check Again
                          </button>
                        </div>
                        {matchCount > 0 ? (
                          <div className="photos-gallery">
                            {faceMatches.map((match, index) => (
                              <img
                                key={index}
                                src={match.ImageUrl}
                                alt={`Matched Face ${index + 1}`}
                                className="matched-photo"
                                onClick={() => openImageModal(index)} // Add onClick handler
                                style={{ cursor: "pointer" }}
                              />
                            ))}
                          </div>
                        ) : (
                          <NoData />
                        )}
                      </>
                    )}

                    {!success && !signForm && (
                      <>
                        <div className="selfie-section">
                          {!isSelfieLoaded && (
                            <div className="selfie-placeholder">
                              <Loader />
                            </div>
                          )}
                          <img
                            src={selfie}
                            alt="Selfie"
                            className="selfie-image"
                            onLoad={() => setIsSelfieLoaded(true)} // Set selfie as loaded
                            style={{
                              display: isSelfieLoaded ? "block" : "none",
                            }}
                          />
                          <p>
                            You’re just one selfie away from your event photos.
                          </p>
                          <span className="description">
                            EventHex AI will use your selfie to find and deliver
                            your event photos instantly.
                          </span>
                        </div>
                        <button
                          className="snap-button"
                          onClick={handleSnapClick}
                        >
                          <img
                            src={cameraIcon}
                            alt="Camera Icon"
                            className="button-icon"
                          />
                          Snap a Selfie
                        </button>
                        <span className="description">
                          Already registered with your face?{" "}
                          <span className="signin-text" onClick={openSignIn}>
                            Sign in
                          </span>
                        </span>
                      </>
                    )}
                  </div>
                </>
              )}
              {snapClick && !showWebcam && (
                <div className="selfie-section">
                  <div className="face-gif">
                    <dotlottie-player
                      src="https://lottie.host/e536c1d8-97c7-4b9f-b1ab-8bc6b2eb53b9/BwaTfRUtwz.json"
                      background="transparent"
                      speed="0.5"
                      loop
                      autoplay
                      style={{ width: "200px", height: "200px" }}
                    ></dotlottie-player>
                  </div>
                  <p>How to Set Up Selfie</p>
                  <span className="description">
                    First, position your face in the camera frame. Then click a
                    photo when your face is detected.
                  </span>
                  <button className="snap-button" onClick={handleGetStarted}>
                    Get Started
                  </button>
                  {/* <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    capture="user"
                    style={{ display: "none" }}
                    onChange={(e) => handleFileUpload(e.target.files[0])}
                  /> */}
                </div>
              )}
              {showWebcam && (
                <WebcamComponent
                  onCapture={handleCapture}
                  onClose={() => setShowWebcam(false)}
                />
              )}
            </div>
          </>
        )}
      </div>
      <div className="container hide-in-web">
        {!isContentLoaded && (
          <div className="initial-logo">
            <img src={logo} alt="EventHex" className="logo-centered" />
          </div>
        )}
        {isContentLoaded && (
          <div className={`${slideIn ? "slide-in" : ""}`}>
            {!snapClick && (
              <>
                <header className="header">
                  <img src={logo} alt="EventHex" className="logo" />
                </header>
                <div className="content">
                  <div className="banner-container">
                    {!isBannerLoaded && (
                      <div className="banner-placeholder"></div> // Placeholder div
                    )}

                    <img
                      src={banner}
                      alt="Event Banner"
                      className={`${success ? "banner-with-image" : "banner"}`}
                      onLoad={() => setIsBannerLoaded(true)}
                    />
                    {success && (
                      <div className="uploaded-image">
                        <img
                          src={imageUrl}
                          alt="Uploaded"
                          className="circle-image"
                        />
                      </div>
                    )}
                  </div>
                  {success && !signForm && (
                    <>
                      <div className="rectangle-container">
                        <div className="rectangle-content">
                          <img src={icon} alt="Icon" className="icon" />
                          <div className="text">
                            {hasFaceMatches
                              ? "Yay! AI found your photo matches"
                              : "Our AI couldn’t find any photos of you"}
                          </div>
                          <div className="column-items">
                            <div className="number">{matchCount}</div>
                            <div className="photos-text">Photos</div>
                          </div>
                        </div>
                      </div>
                      <div className="photos-section">
                        <div className="photos-text">Your Photos</div>
                        <button
                          className="check-button"
                          onClick={triggerFileUpload}
                        >
                          Check Again
                        </button>
                      </div>
                      {matchCount > 0 ? (
                        <div className="photos-gallery">
                          {faceMatches.map((match, index) => (
                            <img
                              key={index}
                              src={match.ImageUrl}
                              alt={`Matched Face ${index + 1}`}
                              className="matched-photo"
                              onClick={() => openImageModal(index)} // Add onClick handler
                              style={{ cursor: "pointer" }}
                            />
                          ))}
                        </div>
                      ) : (
                        <NoData />
                      )}
                    </>
                  )}

                  {!success && !signForm && (
                    <>
                      <div className="selfie-section">
                        {!isSelfieLoaded && (
                          <div className="selfie-placeholder">
                            <Loader />
                          </div>
                        )}
                        <img
                          src={selfie}
                          alt="Selfie"
                          className="selfie-image"
                          onLoad={() => setIsSelfieLoaded(true)} // Set selfie as loaded
                          style={{ display: isSelfieLoaded ? "block" : "none" }}
                        />
                        <p>
                          You’re just one selfie away from your event photos.
                        </p>
                        <span className="description">
                          EventHex AI will use your selfie to find and deliver
                          your event photos instantly.
                        </span>
                      </div>
                      <button className="snap-button" onClick={handleSnapClick}>
                        <img
                          src={cameraIcon}
                          alt="Camera Icon"
                          className="button-icon"
                        />
                        Snap a Selfie
                      </button>
                      <span className="description">
                        Already registered with your face?{" "}
                        <span className="signin-text" onClick={openSignIn}>
                          Sign in
                        </span>
                      </span>
                    </>
                  )}
                </div>
              </>
            )}
            {snapClick && !showWebcam && (
              <div className="selfie-section">
                <div className="face-gif">
                  <dotlottie-player
                    src="https://lottie.host/e536c1d8-97c7-4b9f-b1ab-8bc6b2eb53b9/BwaTfRUtwz.json"
                    background="transparent"
                    speed="0.5"
                    loop
                    autoplay
                    style={{ width: "200px", height: "200px" }}
                  ></dotlottie-player>
                </div>
                <p>How to Set Up Selfie</p>
                <span className="description">
                  First, position your face in the camera frame. Then click a
                  photo when your face is detected.
                </span>
                <button className="snap-button" onClick={handleGetStarted}>
                  Get Started
                </button>
                {/* <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    capture="user"
                    style={{ display: "none" }}
                    onChange={(e) => handleFileUpload(e.target.files[0])}
                  /> */}
              </div>
            )}
            {showWebcam && (
              <WebcamComponent
                onCapture={handleCapture}
                onClose={() => setShowWebcam(false)}
              />
            )}
          </div>
        )}
      </div>
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} />
      {/* New Image Modal */}
      {isImageModalOpen && (
        <ImageModal
          imageUrl={faceMatches[currentImageIndex].ImageUrl}
          onClose={closeImageModal}
          onPrev={showPrevImage}
          onNext={showNextImage}
        />
      )}
      {signForm && <SignIn />}
    </>
  );
};

export default SnapSelfie;
