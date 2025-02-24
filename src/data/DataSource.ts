export type DataPage<T> = {
  prevPageCursor: string;
  nextPageCursor: string;
  pageSize: number;
  data: Array<T>;
};

export interface DataSource<T> {
  getDisplayName(value: T): string;
  startFulltextSearch(text: string): Promise<string>;
  getNextPage(pageCursor: string): Promise<DataPage<T>>;
}
