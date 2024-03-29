import { Controller, Get } from '@nestjs/common';
import { SeatService } from './seat.service';

@Controller('seat')
export class SeatController {
  constructor(private seatService: SeatService) {}

  @Get()
  async getAll() {
    return this.seatService.findAll();
  }
}
