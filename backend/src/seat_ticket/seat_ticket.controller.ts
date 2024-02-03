import { Controller, Get } from '@nestjs/common';
import { SeatTicketService } from './seat_ticket.service';
import { SeatTicket } from './seat_ticket.entity';
import { FreePlacesInfo } from './interface/free_places_info.interface';

@Controller('seat_ticket')
export class SeatTicketController {
  constructor(private seatTicketService: SeatTicketService) {}

  @Get()
  getAll(): Promise<SeatTicket[]> {
    return this.seatTicketService.findAll();
  }

  @Get('free_places_info')
  getTest(): Promise<FreePlacesInfo[]> {
    return this.seatTicketService.getFreePlacesInfoByTrainId([1, 2, 3]);
  }
}
