import { Module } from '@nestjs/common';
import { SeatTicketService } from './seatTicket.service';
import { SeatTicketController } from './seatTicket.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  providers: [SeatTicketService, PrismaService],
  controllers: [SeatTicketController],

  exports: [SeatTicketService],
})
export class SeatTicketModule {}
