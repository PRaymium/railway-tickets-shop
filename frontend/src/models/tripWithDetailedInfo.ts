export enum CarriageTypes {
  'Сидячий' = 1,
  'Плацкарт' = 2,
  'Купе' = 3,
  'СВ' = 4,
}

interface TripWithDetailedInfoBase {
  id: string;
  departureCity: string;
  destinationCity: string;
  train: {
    id: string;
    locomotive: {
      id: string;
      type: number;
      name: string;
    };
    carriages: {
      id: string;
      type: CarriageTypes;
      free_places: {
        count: number;
        min_price: number;
      };
    }[];
  };
}

export interface TripWithDetailedInfoApi extends TripWithDetailedInfoBase {
  departureDate: string;
  destinationDate: string;
}

export interface TripWithDetailedInfo extends TripWithDetailedInfoBase {
  departureDate: Date;
  destinationDate: Date;
}
