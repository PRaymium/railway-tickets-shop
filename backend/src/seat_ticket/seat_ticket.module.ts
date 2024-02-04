import { Module } from '@nestjs/common';
import { SeatTicketService } from './seat_ticket.service';
import { SeatTicketController } from './seat_ticket.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  providers: [SeatTicketService, PrismaService],
  controllers: [SeatTicketController],
})
export class SeatTicketModule {}
