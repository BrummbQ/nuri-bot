interface ImageLink {
  href: string;
}

interface Image {
  _links: {
    self: ImageLink;
  };
}

interface Media {
  images: Image[];
}

interface Brand {
  name: string | null;
}

interface BaseUnit {
  KG: number;
}

interface Pricing {
  currentRetailPrice: number;
  currency: string;
  basePrice: number;
  baseUnit: BaseUnit;
  grammage: string;
}

interface Limitations {
  orderLimit: number;
}

interface Listing {
  id: string;
  version: number;
  pricing: Pricing;
  limitations: Limitations;
}

interface Store {
  id: string;
  version: number;
}

interface Merchant {
  id: string;
  version: number;
  name: string;
  type: string;
  logo: string;
}

interface EmbeddedArticle {
  id: string;
  version: number;
  gtin: string;
  _embedded: {
    listing: Listing;
    store: Store;
    merchant: Merchant;
  };
}

interface EmbeddedCategory {
  id: string;
  primary: boolean;
}

interface Embedded {
  articles: EmbeddedArticle[];
  categories: EmbeddedCategory[];
  categoryPath: string;
}

interface DetailLink {
  href: string;
}

interface Links {
  detail: DetailLink;
}

interface Boosting {
  source: string;
  field: string;
  values: string[];
  boost: number;
}

export interface ReweProduct {
  id: string;
  nan: string;
  version: number;
  productName: string;
  attributes: Record<string, unknown>;
  brand: Brand;
  media: Media;
  _embedded: Embedded;
  hasVariants: boolean;
  hasDiverseVariantPrices: boolean;
  shouldDetailsLinkBeMasked: boolean;
  freeShipping: boolean;
  _links: Links;
  boostings: Boosting[];
}

export interface RewePagination {
  page: number;
  totalPages: number;
  objectsPerPage: number;
  totalResultCount: number;
}

export interface ReweProductsResponse {
  pagination: RewePagination;
  _embedded: {
    products: ReweProduct[];
  };
}
