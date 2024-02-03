import { Entity } from 'typeorm';
import { Trip } from 'src/trip/trip.entity';

@Entity('trip')
export class TripWithInfo extends Trip {
  tickets_info: {
    min_price: number;
    free_places: number;
  };
}
