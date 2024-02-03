import { Controller, Get } from '@nestjs/common';
import { TripWithInfoService } from './trip_with_info.service';
import { TripWithInfo } from './trip_with_info.entity';

@Controller('trip_with_info')
export class TripWithInfoController {
  constructor(private tripWithInfoService: TripWithInfoService) {}

  @Get()
  getAll(): Promise<TripWithInfo[]> {
    return this.tripWithInfoService.findAll();
  }
}
