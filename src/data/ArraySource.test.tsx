import { ArraySource } from "./ArraySource";
import { companies } from "./Companies";

describe("ArraySource", () => {
  test("getDisplayName should return the company name", () => {
    const company = { id: "1", name: "Apple" };
    const result = ArraySource.getDisplayName(company);
    expect(result).toBe("Apple");
  });

  test("startFulltextSearch should return '0'", async () => {
    const result = await ArraySource.startFulltextSearch("some text");
    expect(result).toBe("0");
  });

  test("getNextPage should return the next page of companies based on search", async () => {
    const searchText = "Tech";
    const pageCursor = "0";
    const result = await ArraySource.getNextPage(pageCursor, searchText);

    const filteredCompanies = companies.filter((company) =>
      company.name.toLowerCase().includes(searchText.toLowerCase())
    );

    expect(result.data.length).toBe(10);
    expect(result.data[0].name).toBe(filteredCompanies[0].name);
    expect(result.data[1].name).toBe(filteredCompanies[1].name);

    expect(result.prevPageCursor).toBe("");
    expect(result.nextPageCursor).toBe("1");
  });

  test("getNextPage should return an empty page if no data matches search", async () => {
    const searchText = "NonExistentCompany";
    const pageCursor = "0";
    const result = await ArraySource.getNextPage(pageCursor, searchText);

    expect(result.data.length).toBe(0);
    expect(result.prevPageCursor).toBe("");
    expect(result.nextPageCursor).toBe("");
  });

  test("getNextPage should paginate correctly", async () => {
    const searchText = "Tech";
    const pageCursor = "2";
    const result = await ArraySource.getNextPage(pageCursor, searchText);

    const filteredCompanies = companies.filter((company) =>
      company.name.toLowerCase().includes(searchText.toLowerCase())
    );

    expect(result.data.length).toBe(10);
    expect(result.data[0].name).toBe(filteredCompanies[20].name);
    expect(result.data[1].name).toBe(filteredCompanies[21].name);

    expect(result.prevPageCursor).toBe("1");
    expect(result.nextPageCursor).toBe("");
  });
});
