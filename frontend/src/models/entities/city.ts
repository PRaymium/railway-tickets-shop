import Trip from './trip';

export default interface City {
  id: number;
  name: string;
  tripsDeparture?: Trip[];
  tripsDestination?: Trip[];
}
