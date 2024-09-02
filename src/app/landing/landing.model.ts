export const DOMAIN = 'http://localhost:8015/api';

export interface LandingState {
  packages: PackageModel[];
  isLoading?: boolean;
  isError?: boolean;
}

export interface PackageModel {
  packID: number;
  packTitle: string;
  packDescription: string;
  packLocationID: number;
  packHotelID: number;
  packHotelDescription: number | string;
  packLimit: number;
  packPrice: number;
  packTransportId: number;
  packTransportDescription: number | string;
  packDateRange: string;
  hotLabel: string;
  imageUrls: string[];
  citName?: string;
}
