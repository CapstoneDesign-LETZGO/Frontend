export interface PlaceInfo {
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

export interface ApiResponse {
  returnCode: string;
  returnMessage: string;
  data: {
    placeinfo: PlaceInfo;
    reviews: Review[];
  };
}
