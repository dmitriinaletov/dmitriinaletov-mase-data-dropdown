import React, { useLayoutEffect, useState } from "react";
import TetherComponent from "react-tether";
import "./Popup.css";

interface PopupProps {
  companyName: string;
  onClose: () => void;
  position: { top: number; left: number };
}

export const Popup: React.FC<PopupProps> = ({
  companyName,
  onClose,
  position,
}) => {
  const [popupPosition, setPopupPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);

  useLayoutEffect(() => {
    setPopupPosition(position); // Обновляем позицию попапа при изменении
  }, [position]);

  if (!popupPosition) {
    return null;
  }

  return (
    <TetherComponent
      attachment="middle left"
      targetAttachment="middle right"
      target={document.body} // Рендерим попап относительно body
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
  );
};
