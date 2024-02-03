import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeatTicket } from './seat_ticket.entity';
import { SeatTicketService } from './seat_ticket.service';
import { SeatTicketController } from './seat_ticket.controller';

@Module({
  imports: [TypeOrmModule.forFeature([SeatTicket])],
  providers: [SeatTicketService],
  controllers: [SeatTicketController],

  exports: [SeatTicketService],
})
export class SeatTicketModule {}
