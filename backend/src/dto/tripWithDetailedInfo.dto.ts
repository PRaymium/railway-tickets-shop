import Carriage from 'src/carriage/dto/carriage.dto';
import City from 'src/city/dto/city.dto';
import Locomotive from 'src/locomotive/dto/locomotive.dto';
import Train from 'src/train/dto/train.dto';
import TrainToCarriage from 'src/train_to_carriage/dto/train_to_carriage.dto';
import Trip from 'src/trip/dto/trip.dto';

export default class TripWithDetailedInfo {
  id: Trip['id'];
  departureDate: Trip['departureDate'];
  destinationDate: Trip['destinationDate'];
  departureCityName: City['name'];
  destinationCityName: City['name'];
  train: {
    id: Train['id'];
    locomotive: {
      id: Locomotive['id'];
      type: Locomotive['type'];
      name: Locomotive['name'];
    };
    carriages: {
      id: Carriage['id'];
      type: Carriage['type'];
      number: TrainToCarriage['carriageNumber'];
      freePlaces: {
        count: number;
        minPrice: number;
      };
    }[];
  };
}
