import React, { useState } from "react";
import { DataDropdown } from "./components/DataDropdown/DataDropdown";
import { ArraySource } from "./data/ArraySource";
import { Popup } from "./components/Popup/Popup";
import { companies } from "./data/Companies";

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
      top: rect.top - rect.height * 2 + window.scrollY,
      left: rect.right + window.scrollX,
    });
    setShowPopup(true);
  };

  const handlePopupClose = () => {
    setSelectedValue(null);
    setShowPopup(false);
  };

  const companiesSource = new ArraySource(
    companies,
    (company) => company.name,
    (company, expression) =>
      company.name.toLowerCase().includes(expression.toLowerCase())
  );

  return (
    <div>
      <DataDropdown<Company>
        value={selectedValue}
        onChangeValue={handleChangeValue}
        dataSource={companiesSource}
      />
      {showPopup && selectedValue && popupPosition && (
        <Popup
          companyName={selectedValue.name}
          onClose={handlePopupClose}
          position={popupPosition}
        />
      )}
    </div>
  );
};

export default App;
