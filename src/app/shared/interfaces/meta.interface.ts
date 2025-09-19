export interface MetaConfig {
  title?: string;
  description?: string;
  keywords?: string;
  author?: string;
  robots?: string;
  canonical?: string;
  openGraph?: OpenGraphConfig;
  twitter?: TwitterCardConfig;
  customTags?: CustomMetaTag[];
}

export interface OpenGraphConfig {
  title?: string;
  description?: string;
  image?: string;
  imageAlt?: string;
  url?: string;
  type?: string;
  siteName?: string;
  locale?: string;
}

export interface TwitterCardConfig {
  card?: 'summary' | 'summary_large_image' | 'app' | 'player';
  site?: string;
  creator?: string;
  title?: string;
  description?: string;
  image?: string;
  imageAlt?: string;
}

export interface CustomMetaTag {
  name?: string;
  property?: string;
  content: string;
  httpEquiv?: string;
}

export interface StructuredDataConfig {
  type: string;
  data: any;
}
