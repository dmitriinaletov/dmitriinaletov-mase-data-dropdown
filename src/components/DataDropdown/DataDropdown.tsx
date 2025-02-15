import React, { useState, useEffect } from "react";

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

  // Function to start a text search
  const startSearch = async (text: string) => {
    const page = await dataSource.startFulltextSearch(text);
    setDataPage(page);
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
    <div>
      <input
        type="text"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)} // Update the search value
        placeholder="Search..."
      />
      <div>
        {dataPage?.data.length ? (
          dataPage.data.map((item, index) => (
            <div key={index} onClick={() => handleItemClick(item)}>
              {renderItem(item)}
            </div>
          ))
        ) : (
          <div>No results found</div> // Display message if no search results
        )}
      </div>
      <div>{renderCurrentValue()}</div>
    </div>
  );
};
