export interface ScheduleDto {
  schedulePk: number;
  hostAccountPk: number;
  region: string;
  title: string;
  startDate: string;
  endDate: string;
}

export interface SchedulePlaceDto {
  schedulePlacePk: number;
  name: string;
  address: string;
  placeId: string;
  latitude: number;
  longitude: number;
  orderIndex: number;
  sequence: number;
  memoPk: number | null;
  memoContent: string | null;
}