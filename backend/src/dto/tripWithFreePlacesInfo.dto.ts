import City from 'src/city/dto/city.dto';
import Trip from 'src/trip/dto/trip.dto';

export default class TripWithFreePlacesInfo {
  id: Trip['id'];
  departureDate: Trip['departureDate'];
  destinationDate: Trip['destinationDate'];
  departureCityName: City['name'];
  destinationCityName: City['name'];
  freePlaces: number;
  minPrice: number;
}
