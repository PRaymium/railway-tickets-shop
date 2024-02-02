import { Controller, Get } from '@nestjs/common';
import { TripService } from './trip.service';
import { Trip } from './trip.entity';

@Controller('trip')
export class TripController {
  constructor(private tripService: TripService) {}

  @Get()
  getAll(): Promise<Trip[]> {
    return this.tripService.findAll();
  }
}
