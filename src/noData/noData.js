import React from 'react';
import './noData.css'; 
import Frame from "../images/Frame.png";

const NoData = () => {
  return (
    <div className="no-data-container">
      <div className="no-data-title">
        Oops! We couldn't find any<br />photos for you yet.
      </div>
      <img src={Frame} alt="No Data" className="no-data-image" /> 
      <div className="no-data-description">Don't worry! This could be because:</div>
      <ul className="no-data-bullets">
        <li>Your Photos are still processing</li>
        <li>You might be early – new photos are added regularly</li>
      </ul>
    </div>
  );
};

export default NoData;
