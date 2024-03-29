import Trip from 'src/trip/dto/trip.dto';

export default class City {
  id: number;
  name: string;
  tripsDeparture?: Trip[];
  tripsDestination?: Trip[];
}
