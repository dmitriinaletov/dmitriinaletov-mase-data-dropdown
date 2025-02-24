import { ArraySource } from "./ArraySource";

describe("ArraySource", () => {
  let source: ArraySource<string>;

  beforeEach(() => {
    source = new ArraySource(
      ["fist", "second", "third", "fourth", "fifth", "end"],
      (item) => item,
      (item, expression) => item.includes(expression),
      2
    );
  });

  test("getDisplayName should return the company name", () => {
    const result = source.getDisplayName("second");
    expect(result).toBe("second");
  });

  test("startFulltextSearch should return '0'", async () => {
    const result = await source.startFulltextSearch("");
    expect(result).toBe("0");
  });

  test("getNextPage should return the next page of companies based on search", async () => {
    const firstPage = await source.startFulltextSearch("d");
    const result = await source.getNextPage(firstPage);

    expect(result.data.length).toBe(2);
    expect(result.data[0]).toBe("second");
    expect(result.data[1]).toBe("third");

    expect(result.prevPageCursor).toBe("");
    expect(result.nextPageCursor).toBe("1");
  });

  test("getNextPage should return an empty page if no data matches search", async () => {
    const firstPage = await source.startFulltextSearch("nothing");
    const result = await source.getNextPage(firstPage);

    expect(result.data.length).toBe(0);
    expect(result.prevPageCursor).toBe("");
    expect(result.nextPageCursor).toBe("");
  });

  test("getNextPage should paginate correctly", async () => {
    const firstPage = await source.startFulltextSearch("");
    const secondPage = await source.getNextPage(firstPage);
    const result = await source.getNextPage(secondPage.nextPageCursor);

    expect(result.data.length).toBe(2);
    expect(result.data[0]).toBe("third");
    expect(result.data[1]).toBe("fourth");

    expect(result.prevPageCursor).toBe("0");
    expect(result.nextPageCursor).toBe("2");
  });
});
