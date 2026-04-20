import { apiRequest } from './client';

export interface NominatimFeature {
  properties: {
    osmId?: number;
    name: string;
    type: string;
    countryCode: string;
    country: string;
    state?: string;
    city?: string;
    postcode?: string;
    displayName: string;
    lat: number;
    lon: number;
  };
}

export const searchLocations = (query: string) => {
  return apiRequest<NominatimFeature[]>(`/osm/search?${new URLSearchParams({ q: query })}`);
};

export const reverseGeocoding = (lat: number, lon: number) => {
  return apiRequest<NominatimFeature>(`/osm/reverse?lat=${lat}&lon=${lon}`);
};
