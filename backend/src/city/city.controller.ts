import { Controller, Get } from '@nestjs/common';
import { CityService } from './city.service';
import { City } from './city.entity';

@Controller('city')
export class CityController {
  constructor(private cityService: CityService) {}

  @Get()
  getAll(): Promise<City[]> {
    return this.cityService.findAll();
  }
}
