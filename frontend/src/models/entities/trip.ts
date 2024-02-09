import City from './city';
import Train from './train';

export default interface Trip {
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
