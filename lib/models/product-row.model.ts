export interface ProductRow {
  id: string;
  external_id: string;
  product_name: string;
  data: any;
  market_id: string;
  product_name_embedding: number[];
  fetched_at: Date;
}
