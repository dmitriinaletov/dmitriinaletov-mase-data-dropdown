import { DataSource, DataPage } from "../components/DataDropdown/DataDropdown";
import { companies } from "./Companies";

type Company = {
  id: string;
  name: string;
};

export const ArraySource: DataSource<Company> = {
  // Function to get the displayName of the company
  getDisplayName: (value: Company) => value.name,

  // Function for full-text search
  startFulltextSearch: (text: string): Promise<DataPage<Company>> => {
    const filtered = companies.filter(
      (company) => company.name.toLowerCase().includes(text.toLowerCase()) // Filter by company name
    );

    return Promise.resolve({
      prevPageCursor: "",
      nextPageCursor: "",
      pageSize: filtered.length,
      data: filtered,
    });
  },

  // Function to get the next page
  getNextPage: (pageCursor: string): Promise<DataPage<Company>> => {
    return Promise.resolve({
      prevPageCursor: "",
      nextPageCursor: "",
      pageSize: 10,
      data: companies.slice(0, 10),
    });
  },

  getPrevPage: (pageCursor: string): Promise<DataPage<Company>> => {
    return Promise.resolve({
      prevPageCursor: "",
      nextPageCursor: "",
      pageSize: 10,
      data: companies.slice(0, 10),
    });
  },
};
