import React, { useState, useEffect } from "react";

import "./DataDropdown.css";

export type DataPage<T> = {
  prevPageCursor: string;
  nextPageCursor: string;
  pageSize: number;
  data: Array<T>;
};

export type DataSource<T> = {
  getDisplayName: (value: T) => string;
  startFulltextSearch: (text: string) => Promise<DataPage<T>>;
  getNextPage: (pageCursor: string) => Promise<DataPage<T>>;
  getPrevPage: (pageCursor: string) => Promise<DataPage<T>>;
};

interface DataDropdownProps<T> {
  value: T | null;
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
  const [pageCursor, setPageCursor] = useState<string>(""); // State for storing the page cursor

  // Function to start a text search
  const startSearch = async (text: string) => {
    const page = await dataSource.startFulltextSearch(text);
    setDataPage(page);
    setPageCursor(page.nextPageCursor || ""); // Store the next page cursor
  };

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
    if (dataPage?.nextPageCursor) {
      const nextPage = await dataSource.getNextPage(dataPage.nextPageCursor);
      setDataPage(nextPage);
      setPageCursor(nextPage.nextPageCursor || ""); // Update the cursor for the next page
    }
  };

  // Function to load the previous page
  const loadPrevPage = async () => {
    if (dataPage?.prevPageCursor) {
      const prevPage = await dataSource.getPrevPage(dataPage.prevPageCursor);
      setDataPage(prevPage);
      setPageCursor(prevPage.prevPageCursor || ""); // Update the cursor for the previous page
    }
  };

  useEffect(() => {
    if (searchText) {
      startSearch(searchText); // Start search if there is text entered
    } else {
      setDataPage(null); // Clear search results if the text is empty
    }
  }, [searchText]);

  // Function to render each list item
  const renderItem = (item: T) => {
    if (onRenderItemValue) {
      return onRenderItemValue(item); // Use provided render function if available
    }

    return dataSource.getDisplayName(item); // Display item name via getDisplayName
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
