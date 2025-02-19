import React, { useState, useEffect, useCallback, useRef } from "react";

import "./DataDropdown.css";

export type DataPage<T> = {
  prevPageCursor: string;
  nextPageCursor: string;
  pageSize: number;
  data: Array<T>;
};

export type DataSource<T> = {
  getDisplayName: (value: T) => string;
  startFulltextSearch: (text: string) => Promise<string>;
  getNextPage: (pageCursor: string, searchText: string) => Promise<DataPage<T>>;
  getPrevPage: (pageCursor: string, searchText: string) => Promise<DataPage<T>>;
};

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
      const page = await dataSource.getNextPage(cursor, text);
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
      const nextPage = await dataSource.getNextPage(
        dataPage.nextPageCursor,
        searchText
      );
      setDataPage(nextPage);
    }
  };

  const loadPrevPage = async () => {
    if (dataPage?.prevPageCursor) {
      const prevPage = await dataSource.getPrevPage(
        dataPage.prevPageCursor,
        searchText
      );
      setDataPage(prevPage);
    }
  };

  const handleDropdownClick = () => {
    if (!dataPage) {
      startSearch("");
    }
    setIsDropdownOpen((prev) => !prev);
    if (isDropdownOpen) {
      setDisplayValue(null);
    }
  };

  const handleWheel = (event: React.WheelEvent) => {
    if (dropdownRef.current) {
      const bottom =
        dropdownRef.current.scrollHeight ===
        dropdownRef.current.scrollTop + dropdownRef.current.clientHeight;
      const top = dropdownRef.current.scrollTop === 0;

      if (event.deltaY > 0 && bottom && dataPage?.nextPageCursor) {
        loadNextPage();
      } else if (event.deltaY < 0 && top && dataPage?.prevPageCursor) {
        loadPrevPage();
      }
    }
  };

  useEffect(() => {
    if (searchText) {
      startSearch(searchText);
    } else {
      const loadInitialData = async () => {
        const cursor = await dataSource.startFulltextSearch("");
        const page = await dataSource.getNextPage(cursor, "");
        setDataPage(page);
      };
      loadInitialData();
    }
  }, [searchText, startSearch, dataSource]);

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
    <div className="data-dropdown" ref={dropdownRef} onWheel={handleWheel}>
      <input
        type="text"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        onClick={handleDropdownClick}
        placeholder="Search..."
        readOnly={!isDropdownOpen}
      />
      {isDropdownOpen && (
        <div className="dropdown-list">
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
