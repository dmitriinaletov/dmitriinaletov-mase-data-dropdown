import React, { useState } from "react";
import { DataDropdown } from "./components/DataDropdown/DataDropdown";
import { ArraySource } from "./data/ArraySource";
import { Popup } from "./components/Popup";

// Объявляем тип для данных компании
type Company = {
  id: string;
  name: string;
};

const App: React.FC = () => {
  const [selectedValue, setSelectedValue] = useState<Company | null>(null); // Указываем тип состояния
  const [showPopup, setShowPopup] = useState(false);

  const handleChangeValue = (value: Company | null) => {
    // Указываем правильный тип для обработчика
    setSelectedValue(value);
    setShowPopup(true); // Показать попап
  };

  return (
    <div>
      <DataDropdown
        value={selectedValue} // Передаем значение в компонент
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
