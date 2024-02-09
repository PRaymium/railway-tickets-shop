import City from './entities/city';
import Trip from './entities/trip';

interface TripWithFreePlacesInfoBase {
  id: Trip['id'];
  departureCityName: City['name'];
  destinationCityName: City['name'];
  trainId: Trip['trainId'];
  freePlaces: number;
  minPrice: number;
}

export interface TripWithFreePlacesInfoApi extends TripWithFreePlacesInfoBase {
  departureDate: string;
  destinationDate: string;
}

export interface TripWithFreePlacesInfo extends TripWithFreePlacesInfoBase {
  departureDate: Trip['departureDate'];
  destinationDate: Trip['destinationDate'];
}
