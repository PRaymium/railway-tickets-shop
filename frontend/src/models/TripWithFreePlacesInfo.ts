interface TripWithFreePlacesInfoBase {
  id: string;
  departureCity: string;
  destinationCity: string;
  trainId: string;
  freePlaces: number;
  minPrice: number;
}

export interface TripWithFreePlacesInfoApi extends TripWithFreePlacesInfoBase {
  departureDate: string;
  destinationDate: string;
}

export interface TripWithFreePlacesInfo extends TripWithFreePlacesInfoBase {
  departureDate: Date;
  destinationDate: Date;
}
