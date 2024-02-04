import { Module } from '@nestjs/common';
import { TripService } from './trip.service';
import { TripController } from './trip.controller';
import { PrismaService } from 'src/prisma.service';
import { SeatTicketService } from 'src/seat_ticket/seat_ticket.service';

@Module({
  controllers: [TripController],
  providers: [TripService, PrismaService, SeatTicketService],
})
export class TripModule {}
