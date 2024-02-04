import { Controller, Get } from '@nestjs/common';
import { SeatTicketService } from './seat_ticket.service';

@Controller('seat_ticket')
export class SeatTicketController {
  constructor(private seatTicketService: SeatTicketService) {}

  @Get()
  getAll() {
    return this.seatTicketService.findAll();
  }

  @Get('free_places_info')
  getgetFreePlacesInfo() {
    return this.seatTicketService.getFreePlacesInfoByTrainId([1, 2, 3]);
  }
}
