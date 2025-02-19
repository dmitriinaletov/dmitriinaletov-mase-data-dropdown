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
  };

  useEffect(() => {
    if (searchText) {
      startSearch(searchText);
    } else {
      setDataPage(null);
    }
  }, [searchText, startSearch]);

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
        onFocus={handleDropdownClick}
        placeholder="Search..."
      />
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
      </div>
      <div className="pagination">
        {dataPage?.prevPageCursor && (
          <button className="previous-btn" onClick={loadPrevPage}>
            Previous
          </button>
        )}
        {dataPage?.nextPageCursor && (
          <button className="next-btn" onClick={loadNextPage}>
            Next
          </button>
        )}
      </div>
    </div>
  );
};
