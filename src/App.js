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

function App() {
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

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsContentLoaded(true);
      setSlideIn(true); 
    }, 2000); // Adjust delay time as needed
    return () => clearTimeout(timer);
  }, []);

  const fileInputRef = useRef(null);

  const handleSnapClick = () => {
    fileInputRef.current.click();
  };

  const triggerFileUpload = () => {
    if (uploadedFile) {
      handleFileUpload(uploadedFile);
    }
  };
  console.log("uploaded file", uploadedFile);
  const handleFileUpload = async (file) => {
    if (file) {
      setUploadedFile(file); // Set the file in state
      setShowModal(true); // Show the modal
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
          <header className="header">
            <img src={logo} alt="EventHex" className="logo" />
          </header>
          <div className="content">
            <div className="banner-container">
              <img
                src={banner}
                alt="Event Banner"
                className={`${imageUrl ? "banner-with-image" : "banner"}`}
              />
              {success && (
                <div className="uploaded-image">
                  <img src={imageUrl} alt="Uploaded" className="circle-image" />
                </div>
              )}
            </div>
            {success && (
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
                  <button className="check-button" onClick={triggerFileUpload}>
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
                      />
                    ))}
                  </div>
                ) : (
                  <NoData />
                )}
              </>
            )}

            {!success && (
              <>
                <div className="selfie-section">
                  <img src={selfie} alt="Selfie" className="selfie-image" />
                  <p>You’re just one selfie away from your event photos.</p>
                  <span className="description">
                    EventHex AI will use your selfie to find and deliver your
                    event photos instantly.
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
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  capture="user"
                  style={{ display: "none" }}
                  onChange={(e) => handleFileUpload(e.target.files[0])}
                />
              </>
            )}
          </div>
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
        <div className={`${slideIn ? 'slide-in' : ''}`}>
        <header className="header">
          <img src={logo} alt="EventHex" className="logo" />
        </header>
        <div className="content">
          <div className="banner-container">
            <img
              src={banner}
              alt="Event Banner"
              className={`${success ? "banner-with-image" : "banner"}`}
            />
            {success && (
              <div className="uploaded-image">
                <img src={imageUrl} alt="Uploaded" className="circle-image" />
              </div>
            )}
          </div>
          {success && (
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
                <button className="check-button" onClick={triggerFileUpload}>
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
                    />
                  ))}
                </div>
              ) : (
                <NoData />
              )}
            </>
          )}

          {!success && (
            <>
              <div className="selfie-section">
                <img src={selfie} alt="Selfie" className="selfie-image" />
                <p>You’re just one selfie away from your event photos.</p>
                <span className="description">
                  EventHex AI will use your selfie to find and deliver your
                  event photos instantly.
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
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                capture="user"
                style={{ display: "none" }}
                onChange={(e) => handleFileUpload(e.target.files[0])}
              />
            </>
          )}
        </div>
        </div>
      )}
      </div>
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} />
    </>
  );
}

export default App;
