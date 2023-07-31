/**
 * item interface
 */

export interface ItemPayload {
  title: string;
  description: string;
}
export interface FetchItems {
  page: number;
  perPage: number;
  offset: number;
  data: ItemPayload;
}
