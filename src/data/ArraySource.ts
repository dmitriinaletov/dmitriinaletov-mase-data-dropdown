import { DataPage, DataSource } from "./DataSource";

// prettier-ignore
const paginate = <T,>(
  data: T[],
  pageSize: number,
  pageCursor: number
): DataPage<T> => {
  const start = pageCursor * pageSize;
  const end = start + pageSize;
  const pageData = data.slice(start, end);

  const nextPageCursor = end < data.length ? (pageCursor + 1).toString() : "";

  return {
    prevPageCursor: pageCursor > 0 ? (pageCursor - 1).toString() : "",
    nextPageCursor: nextPageCursor,
    pageSize,
    data: pageData,
  };
};

export class ArraySource<T> implements DataSource<T> {
  data: Array<T>;
  displayName: (value: T) => string;
  filter: (value: T, expression: string) => boolean;
  expression: string;
  pageSize: number;

  constructor(
    data: Array<T>,
    displayName: (value: T) => string,
    filter: (value: T, expression: string) => boolean,
    pageSize: number = 10
  ) {
    this.data = data;
    this.displayName = displayName;
    this.filter = filter;
    this.expression = "";
    this.pageSize = pageSize;
  }

  getDisplayName(value: T) {
    return this.displayName(value);
  }

  startFulltextSearch(expression: string): Promise<string> {
    this.expression = expression;
    return Promise.resolve("0");
  }

  getNextPage(pageCursor: string): Promise<DataPage<T>> {
    const cursor = parseInt(pageCursor, 10);
    const filtered = this.data.filter((item) =>
      this.filter(item, this.expression)
    );

    return Promise.resolve(paginate(filtered, this.pageSize, cursor));
  }
}
