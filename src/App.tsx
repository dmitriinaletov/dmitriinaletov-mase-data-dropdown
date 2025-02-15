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

  const handleChangeValue = (value: Company | null) => {
    setSelectedValue(value);
    setShowPopup(true);
  };

  return (
    <div>
      <DataDropdown
        value={selectedValue}
        onChangeValue={handleChangeValue}
        dataSource={ArraySource}
      />
      {showPopup && selectedValue && (
        <Popup
          companyName={selectedValue.name}
          onClose={() => setShowPopup(false)}
        />
      )}
    </div>
  );
};

export default App;
