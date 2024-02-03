import { Module } from '@nestjs/common';
import { SeatTicketModule } from 'src/seat_ticket/seat_ticket.module';
import { TripModule } from 'src/trip/trip.module';
import { TripWithInfoService } from './trip_with_info.service';
import { TripWithInfoController } from './trip_with_info.controller';

@Module({
  imports: [TripModule, SeatTicketModule],
  providers: [TripWithInfoService],
  controllers: [TripWithInfoController],
})
export class TripWithInfoModule {}
