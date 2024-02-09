import City from 'src/city/dto/city.dto';
import Train from 'src/train/dto/train.dto';

export default class Trip {
  id: number;
  departureDate: Date;
  destinationDate: Date;
  isComplete: boolean;
  departureCityId: number;
  destinationCityId: number;
  departureCity?: City;
  destinationCity?: City;
  trainId: number;
  train?: Train;
}
