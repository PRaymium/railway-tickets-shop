import { Controller, Get } from '@nestjs/common';
import { SeatTicketService } from './seat_ticket.service';
import { SeatTicket } from './seat_ticket.entity';

@Controller('seat_ticket')
export class SeatTicketController {
  constructor(private seatTicketService: SeatTicketService) {}

  @Get()
  getAll(): Promise<SeatTicket[]> {
    return this.seatTicketService.findAll();
  }
}
