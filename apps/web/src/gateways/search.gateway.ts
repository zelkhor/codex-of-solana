export interface ISearchGateway {
  index(items: unknown[]): void;
  search(query: string): unknown[];
}
