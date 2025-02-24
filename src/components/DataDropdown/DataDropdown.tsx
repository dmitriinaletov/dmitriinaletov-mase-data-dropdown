import React, { useState, useEffect, useCallback, useRef } from "react";
import { DataPage, DataSource } from "../../data/DataSource";

import "./DataDropdown.css";

interface DataDropdownProps<T> {
  value: T | null;
  onChangeValue: (value: T | null, target: HTMLElement) => void;
  dataSource: DataSource<T>;
  onRenderCurrentValue?: (value: T | null) => React.ReactNode;
  onRenderItemValue?: (value: T | null) => React.ReactNode;
}

export const DataDropdown = <T,>({
  value,
  onChangeValue,
  dataSource,
  onRenderCurrentValue,
  onRenderItemValue,
}: DataDropdownProps<T>) => {
  const [searchText, setSearchText] = useState<string>("");
  const [dataPage, setDataPage] = useState<DataPage<T> | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [displayValue, setDisplayValue] = useState<T | null>(value);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const startSearch = useCallback(
    async (text: string) => {
      const cursor = await dataSource.startFulltextSearch(text);
      const page = await dataSource.getNextPage(cursor);
      setDataPage(page);
    },
    [dataSource]
  );

  const handleItemClick = (
    item: T,
    event: React.MouseEvent<HTMLDivElement>
  ) => {
    const target = event.target as HTMLElement;
    onChangeValue(item, target);
    setDisplayValue(item);
  };

  const loadNextPage = async () => {
    if (dataPage?.nextPageCursor) {
      const nextPage = await dataSource.getNextPage(dataPage.nextPageCursor);
      setDataPage((prevPage) => ({
        ...nextPage,
        data: [...(prevPage?.data || []), ...nextPage.data],
      }));
    }
  };

  const handleDropdownClick = (e: React.MouseEvent<HTMLSpanElement>) => {
    e.stopPropagation();
    setIsDropdownOpen((prev) => !prev);
  };

  const handleInputClick = () => {
    if (!isDropdownOpen) {
      if (!dataPage) {
        startSearch("");
      }
      setIsDropdownOpen(true);
    }
  };

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const dropdownElement = event.target as HTMLDivElement;
    if (
      dropdownElement.scrollTop + dropdownElement.clientHeight >=
      dropdownElement.scrollHeight * 0.75
    ) {
      if (dataPage?.nextPageCursor) {
        loadNextPage();
      }
    }
  };

  useEffect(() => {
    if (searchText) {
      startSearch(searchText);
    } else {
      const loadInitialData = async () => {
        const cursor = await dataSource.startFulltextSearch("");
        const page = await dataSource.getNextPage(cursor);
        setDataPage(page);
      };
      loadInitialData();
    }
  }, [searchText, startSearch, dataSource]);

  useEffect(() => {
    setDisplayValue(value);
  }, [value]);

  const renderItem = (item: T) => {
    if (onRenderItemValue) {
      return onRenderItemValue(item);
    }
    return dataSource.getDisplayName(item);
  };

  const renderCurrentValue = () => {
    if (onRenderCurrentValue) {
      return onRenderCurrentValue(displayValue);
    }
    return displayValue
      ? dataSource.getDisplayName(displayValue)
      : "Select an item";
  };

  return (
    <div className="data-dropdown">
      <div className="input-container">
        <input
          type="text"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Search..."
          onClick={handleInputClick}
        />
        <span
          className={`dropdown-arrow ${isDropdownOpen ? "open" : "closed"}`}
          onClick={handleDropdownClick}
        >
          ▼
        </span>
      </div>

      {isDropdownOpen && (
        <div
          className="dropdown-list"
          ref={dropdownRef}
          onScroll={handleScroll}
        >
          {dataPage?.data.map((item, index) => (
            <div
              key={index}
              className="dropdown-item"
              onClick={(event) => handleItemClick(item, event)}
            >
              {renderItem(item)}
            </div>
          ))}
          {dataPage?.nextPageCursor === "" && (
            <div className="dropdown-item no-more-items">End of the list</div>
          )}
        </div>
      )}
      <div className="current-value">{renderCurrentValue()}</div>
    </div>
  );
};
