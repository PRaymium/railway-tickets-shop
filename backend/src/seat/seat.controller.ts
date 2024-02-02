import { Controller, Get } from '@nestjs/common';
import { SeatService } from './seat.service';
import { Seat } from './seat.entity';

@Controller('seat')
export class SeatController {
  constructor(private seatService: SeatService) {}

  @Get()
  getAll(): Promise<Seat[]> {
    return this.seatService.findAll();
  }
}
