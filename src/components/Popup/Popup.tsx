import React, { useState, useEffect } from "react";
import TetherComponent from "react-tether";

import "./Popup.css";

interface PopupProps {
  companyName: string;
  onClose: () => void;
  targetRef: React.RefObject<HTMLElement>;
}

export const Popup: React.FC<PopupProps> = ({
  companyName,
  onClose,
  targetRef,
}) => {
  const [popupPosition, setPopupPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);

  useEffect(() => {
    if (targetRef.current) {
      const rect = targetRef.current.getBoundingClientRect();
      console.log("Target rect:", rect);
      setPopupPosition({
        top: rect.top - rect.height * 2 + window.scrollY,
        left: rect.right + window.scrollX,
      });
    }
  }, [targetRef]);

  return (
    popupPosition && (
      <TetherComponent
        target={targetRef.current}
        attachment="middle left"
        targetAttachment="middle right"
        renderTarget={(ref) => (
          <div
            ref={ref}
            className="popup"
            style={{
              top: `${popupPosition.top}px`,
              left: `${popupPosition.left}px`,
            }}
          >
            <div className="popup-content">
              <h2>{companyName}</h2>
              <button onClick={onClose}>Close</button>
            </div>
          </div>
        )}
      />
    )
  );
};
