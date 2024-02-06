import { CarriageModule } from './carriage/carriage.module';
import { CityModule } from './city/city.module';
import { LocomotiveModule } from './locomotive/locomotive.module';
import { SeatModule } from './seat/seat.module';
import { SeatTicketModule } from './seatTicket/seatTicket.module';
import { TrainModule } from './train/train.module';
import { TripModule } from './trip/trip.module';

const modulesImports = [
  TripModule,
  TrainModule,
  SeatTicketModule,
  SeatModule,
  LocomotiveModule,
  CityModule,
  CarriageModule,
];

export default modulesImports;
