import { Controller, Get } from '@nestjs/common';
import { TripService } from './trip.service';

@Controller('trip')
export class TripController {
  constructor(private readonly tripService: TripService) {}

  @Get()
  getAll() {
    return this.tripService.findAll();
  }

  @Get('withTrainInfo')
  getOneWithTrainInfo() {
    return this.tripService.findOneWithTrainInfoById(1);
  }
}
