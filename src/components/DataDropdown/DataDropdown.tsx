import React, { useState, useEffect } from "react";

// Определяем тип страницы данных
export type DataPage<T> = {
  prevPageCursor: string;
  nextPageCursor: string;
  pageSize: number;
  data: Array<T>;
};

// Тип источника данных
export type DataSource<T> = {
  getDisplayName: (value: T) => string;
  startFulltextSearch: (text: string) => Promise<DataPage<T>>;
  getNextPage: (pageCursor: string) => Promise<DataPage<T>>;
  getPrevPage: (pageCursor: string) => Promise<DataPage<T>>;
};

interface DataDropdownProps<T> {
  value: T | null; // Тип для value - T или null
  onChangeValue: (value: T | null) => void;
  dataSource: DataSource<T>;
  onRenderCurrentValue?: (value: T | null) => React.ReactNode;
  onRenderItemValue?: (value: T) => React.ReactNode;
}

export const DataDropdown = <T,>({
  value,
  onChangeValue,
  dataSource,
  onRenderCurrentValue,
  onRenderItemValue,
}: DataDropdownProps<T>) => {
  const [searchText, setSearchText] = useState("");
  const [dataPage, setDataPage] = useState<DataPage<T> | null>(null);

  // Функция для начала поиска по тексту
  const startSearch = async (text: string) => {
    const page = await dataSource.startFulltextSearch(text);
    setDataPage(page);
  };

  // Функция для обработки клика на элемент
  const handleItemClick = (item: T) => {
    onChangeValue(item);
  };

  // Отображение текущего значения
  const renderCurrentValue = () => {
    if (onRenderCurrentValue) {
      return onRenderCurrentValue(value); // Если передана функция для рендера, используем её
    }

    // Если value равно null, вернуть какой-то placeholder или пустую строку
    if (value === null) return "Select an item";

    return dataSource.getDisplayName(value); // Отображаем название через getDisplayName
  };

  useEffect(() => {
    if (searchText) {
      startSearch(searchText); // Если есть текст в поиске, начинаем поиск
    } else {
      setDataPage(null); // Если текст пустой, очищаем результаты поиска
    }
  }, [searchText]);

  // Функция для рендера элемента списка
  const renderItem = (item: T) => {
    if (onRenderItemValue) {
      return onRenderItemValue(item); // Если передана функция для рендера, используем её
    }

    return dataSource.getDisplayName(item); // Отображаем название элемента через getDisplayName
  };

  return (
    <div>
      <input
        type="text"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)} // Обновляем значение поиска
        placeholder="Search..."
      />
      <div>
        {dataPage?.data.length ? (
          dataPage.data.map((item, index) => (
            <div key={index} onClick={() => handleItemClick(item)}>
              {renderItem(item)} {/* Рендерим каждый элемент */}
            </div>
          ))
        ) : (
          <div>No results found</div> // Если нет результатов поиска
        )}
      </div>
      <div>{renderCurrentValue()}</div> {/* Отображаем текущее значение */}
    </div>
  );
};
