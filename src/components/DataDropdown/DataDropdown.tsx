import React, { useState, useEffect, useCallback } from "react";

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
  onChangeValue: (value: T | null) => void;
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
  const [pageCursor, setPageCursor] = useState<string>("");

  // Function to start a text search
  const startSearch = useCallback(
    async (text: string) => {
      const cursor = await dataSource.startFulltextSearch(text);
      const page = await dataSource.getNextPage(cursor, text);
      setDataPage(page);
      setPageCursor(cursor);
    },
    [dataSource]
  );

  // Function to handle item click
  const handleItemClick = (item: T) => {
    onChangeValue(item);
  };

  // Render the current value
  const renderCurrentValue = () => {
    if (onRenderCurrentValue) {
      return onRenderCurrentValue(value); // Use provided render function if available
    }

    if (value === null) return "Select an item";

    return dataSource.getDisplayName(value); // Display the name via getDisplayName
  };

  // Function to load the next page
  const loadNextPage = async () => {
    if (pageCursor) {
      const nextPage = await dataSource.getNextPage(pageCursor, searchText);
      setDataPage(nextPage);
      setPageCursor(nextPage.nextPageCursor || "");
    }
  };

  // Function to load the previous page
  const loadPrevPage = async () => {
    if (pageCursor) {
      const prevPage = await dataSource.getPrevPage(pageCursor, searchText);
      setDataPage(prevPage);
      setPageCursor(prevPage.prevPageCursor || ""); // Update the cursor for the previous page
    }
  };

  useEffect(() => {
    if (searchText) {
      startSearch(searchText);
    } else {
      setDataPage(null);
      setPageCursor("");
    }
  }, [searchText, startSearch]);

  // Function to render each list item
  const renderItem = (item: T) => {
    if (onRenderItemValue) {
      return onRenderItemValue(item);
    }

    return dataSource.getDisplayName(item);
  };

  return (
    <div className="data-dropdown">
      <input
        type="text"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        placeholder="Search..."
      />
      <div className="dropdown-list">
        {dataPage?.data.length ? (
          dataPage.data.map((item, index) => (
            <div
              key={index}
              className="dropdown-item"
              onClick={() => handleItemClick(item)}
            >
              {renderItem(item)}
            </div>
          ))
        ) : (
          <div className="no-results">No results found</div>
        )}
      </div>
      <div className="pagination">
        {dataPage?.prevPageCursor && (
          <button onClick={loadPrevPage}>Previous</button>
        )}
        {dataPage?.nextPageCursor && (
          <button onClick={loadNextPage}>Next</button>
        )}
      </div>
      <div className="current-value">{renderCurrentValue()}</div>
    </div>
  );
};
