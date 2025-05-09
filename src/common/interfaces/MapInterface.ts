export interface PlaceDto {
  name: string;
  address: string;
  placeId: string;
  placePhoto: string;
  lat: number;
  lng: number;
}

export interface Review {
  id: number;
  account: string;
  title: string;
  rating: number;
  content: string;
  photoDir: string;
}
