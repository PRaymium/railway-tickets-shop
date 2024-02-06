import { Controller, Get } from '@nestjs/common';
import { SeatTicketService } from './seatTicket.service';

@Controller('seatTicket')
export class SeatTicketController {
  constructor(private seatTicketService: SeatTicketService) {}

  @Get()
  getAll() {
    return this.seatTicketService.findAll();
  }

  @Get('freePlacesInfo')
  getFreePlacesInfo() {
    return this.seatTicketService.getFreePlacesInfoByTrainId([1, 2, 3]);
  }
}
