import React, { useState, useRef } from "react";
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
  const popupTargetRef = useRef<HTMLElement | null>(null);

  const handleChangeValue = (value: Company | null, target: HTMLElement) => {
    setSelectedValue(value);
    popupTargetRef.current = target;
    setShowPopup(true);
  };

  return (
    <div>
      <DataDropdown
        value={selectedValue}
        onChangeValue={handleChangeValue}
        dataSource={ArraySource}
      />
      {showPopup && selectedValue && popupTargetRef.current && (
        <Popup
          companyName={selectedValue.name}
          onClose={() => setShowPopup(false)}
          targetRef={popupTargetRef}
        />
      )}
    </div>
  );
};

export default App;
