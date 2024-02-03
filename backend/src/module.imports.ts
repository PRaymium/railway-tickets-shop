import { LocomotiveModule } from './locomotive/locomotive.module';
import { CarriageModule } from './carriage/carriage.module';
import { CityModule } from './city/city.module';
import { SeatModule } from './seat/seat.module';
import { SeatTicketModule } from './seat_ticket/seat_ticket.module';
import { TrainModule } from './train/train.module';
import { TrainToCarriageModule } from './train_to_carriage/train_to_carriage.module';
import { TripModule } from './trip/trip.module';
import { TripWithInfoModule } from './trip_with_info/trip_with_info.module';

const modulesImports = [
  LocomotiveModule,
  CarriageModule,
  CityModule,
  SeatModule,
  SeatTicketModule,
  TrainModule,
  TrainToCarriageModule,
  TripModule,
  TripWithInfoModule,
];

export default modulesImports;
