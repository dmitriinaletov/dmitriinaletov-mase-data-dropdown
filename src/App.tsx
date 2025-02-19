import React, { useState } from "react";
import { DataDropdown } from "./components/DataDropdown/DataDropdown";
import { ArraySource } from "./data/ArraySource";
import { Popup } from "./components/Popup/Popup";

type Company = {
  id: string;
  name: string;
};

const App: React.FC = () => {
  const [selectedValue, setSelectedValue] = useState<Company | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [popupPosition, setPopupPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);

  const handleChangeValue = (value: Company | null, target: HTMLElement) => {
    setSelectedValue(value);
    const rect = target.getBoundingClientRect();
    setPopupPosition({
      top: rect.top - rect.height * 2 + window.scrollY, // Отступ для попапа
      left: rect.right + window.scrollX,
    });
    setShowPopup(true);
  };

  return (
    <div>
      <DataDropdown
        value={selectedValue}
        onChangeValue={handleChangeValue}
        dataSource={ArraySource}
      />
      {showPopup && selectedValue && popupPosition && (
        <Popup
          companyName={selectedValue.name}
          onClose={() => setShowPopup(false)}
          position={popupPosition}
        />
      )}
    </div>
  );
};

export default App;
