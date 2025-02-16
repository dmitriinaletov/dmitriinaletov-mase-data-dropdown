import { DataSource, DataPage } from "../components/DataDropdown/DataDropdown";
import { companies } from "./Companies";

type Company = {
  id: string;
  name: string;
};

const paginate = <T>(
  data: T[],
  pageSize: number,
  pageCursor: number
): DataPage<T> => {
  const start = pageCursor * pageSize;
  const end = start + pageSize;
  const pageData = data.slice(start, end);

  return {
    prevPageCursor: pageCursor > 0 ? (pageCursor - 1).toString() : "",
    nextPageCursor:
      pageData.length === pageSize ? (pageCursor + 1).toString() : "",
    pageSize,
    data: pageData,
  };
};

export const ArraySource: DataSource<Company> = {
  getDisplayName: (value: Company) => value.name,

  // Function for full-text search
  startFulltextSearch: (text: string): Promise<string> => {
    const filtered = companies.filter(
      (company) => company.name.toLowerCase().includes(text.toLowerCase()) // Filter by company name
    );

    const firstPage = paginate(filtered, 10, 0);
    return Promise.resolve(firstPage.nextPageCursor || "0");
  },

  // Function to get the next page
  getNextPage: (
    pageCursor: string,
    searchText: string
  ): Promise<DataPage<Company>> => {
    const cursor = parseInt(pageCursor, 10);
    const filtered = companies.filter((company) =>
      company.name.toLowerCase().includes(searchText.toLowerCase())
    );

    // Returning the next page
    return Promise.resolve(paginate(filtered, 10, cursor));
  },

  // Function to get the previous page
  getPrevPage: (
    pageCursor: string,
    searchText: string
  ): Promise<DataPage<Company>> => {
    const cursor = parseInt(pageCursor, 10);
    const filtered = companies.filter((company) =>
      company.name.toLowerCase().includes(searchText.toLowerCase())
    );

    return Promise.resolve(paginate(filtered, 10, cursor - 1));
  },
};
