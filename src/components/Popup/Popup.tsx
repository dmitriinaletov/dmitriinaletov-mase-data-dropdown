import React from "react";

import "./Popup.css";

interface PopupProps {
  companyName: string;
  onClose: () => void;
}

export const Popup: React.FC<PopupProps> = ({ companyName, onClose }) => {
  return (
    <div className="popup">
      <div className="popup-content">
        <h2>{companyName}</h2>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};
