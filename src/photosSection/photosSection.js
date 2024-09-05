import React, { useState } from "react";
import { FaRegStar, FaTh } from "react-icons/fa"; // Icons from react-icons
import "./photosSection.css";
import NoData from "../noData/noData";

const PhotosSection = ({ photos, highlights,faceMatches,matchCount,openImageModal}) => {
  const [activeTab, setActiveTab] = useState("photos");

  return (
    <div className="tab-container" >
      <div className="tab-header">
        <div
          className={`tab-item ${activeTab === "photos" ? "active" : ""}`}
          onClick={() => setActiveTab("photos")}
        >
          <FaTh />
          <div>Your Photos</div>
        </div>
        <div
          className={`tab-item ${activeTab === "highlights" ? "active" : ""}`}
          onClick={() => setActiveTab("highlights")}
        >
          <FaRegStar />
          <div>Highlights</div>
        </div>
      </div>

      <div className="tab-content">
        {activeTab === "photos" && (
          <div className="photos-section">
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
          </div>
        )}

        {activeTab === "highlights" && (
          <div className="highlights-section">
            {highlights && highlights.length > 0 ? (
              <ul>
                {highlights.map((highlight, index) => (
                  <li key={index}>{highlight}</li>
                ))}
              </ul>
            ) : (
              <div>No highlights available</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PhotosSection;
